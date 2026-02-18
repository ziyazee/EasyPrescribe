
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, Medicine, Prescription } from '../types';
import { GoogleGenAI, Type, Modality } from "@google/genai";

interface Props {
  onSave: (prescription: Prescription) => void;
}

const CreatePrescription: React.FC<Props> = ({ onSave }) => {
  const navigate = useNavigate();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{text: string, links: {title: string, uri: string}[]} | null>(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Form State
  const [patient, setPatient] = useState<Patient>({
    name: 'Rajesh Kumar',
    age: '42',
    gender: 'Male',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [advice, setAdvice] = useState<string[]>([]);
  
  // Voice State
  const [isDictating, setIsDictating] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const suggestTreatment = async () => {
    if (!diagnosis) return;
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest a treatment plan for a patient (${patient.age}y, ${patient.gender}) with diagnosis: ${diagnosis}. 
                  Provide suggestions in JSON format with two keys: 
                  "medicines" (array of objects with name, type, dosage, frequency, duration, timing) 
                  and "advice" (array of strings).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              medicines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    timing: { type: Type.STRING }
                  },
                  required: ["name", "type", "dosage", "frequency", "duration", "timing"]
                }
              },
              advice: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["medicines", "advice"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.medicines) {
        const newMeds = data.medicines.map((m: any, i: number) => ({ ...m, id: Date.now() + i }));
        setMedicines([...medicines, ...newMeds]);
      }
      if (data.advice) {
        setAdvice([...new Set([...advice, ...data.advice])]);
      }
    } catch (err) {
      console.error("AI Suggestion failed", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const searchDrugInfo = async (query: string) => {
    setIsSearching(true);
    setShowSearchPanel(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Search for the latest medical guidelines, dosages, and contraindications for: ${query}`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        ?.map(chunk => ({ title: chunk.web.title, uri: chunk.web.uri })) || [];

      setSearchResults({
        text: response.text || "No detailed info found.",
        links: links.slice(0, 5)
      });
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const startDictation = async () => {
    if (isDictating) {
      if (sessionRef.current) sessionRef.current.close();
      setIsDictating(false);
      return;
    }

    setIsDictating(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: (msg) => {
            if (msg.serverContent?.outputTranscription) {
              setCustomNotes(prev => prev + " " + msg.serverContent!.outputTranscription!.text);
            }
          }
        },
        config: { 
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {} 
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Live API failed", err);
      setIsDictating(false);
    }
  };

  const handleSave = () => {
    const newPrescription: Prescription = {
      id: `RX-${Math.floor(Math.random() * 10000)}`,
      patient,
      diagnosis,
      medicines,
      advice,
      customNotes,
      vitals: { bp: '120/80', pulse: '72', temp: '100.2', weight: '72' },
      doctor: {
        name: 'Dr. Sarah Mitchell',
        regNo: '2456789',
        qualification: 'MBBS, MD',
        specialization: 'General Physician',
        clinicName: 'City Care Clinic',
        clinicAddress: '123, Main Road, City Center',
        clinicPhone: '+91 98765 43210',
        clinicEmail: 'contact@citycare.com'
      }
    };
    onSave(newPrescription);
    navigate('/prescription/preview');
  };

  const removeMedicine = (id: string) => setMedicines(medicines.filter(m => m.id !== id));

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-display">
      <header className="flex items-center justify-between border-b border-neutral-border bg-white px-6 py-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">local_hospital</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Clinic Rx</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={startDictation}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDictating ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <span className="material-symbols-outlined">{isDictating ? 'mic' : 'mic_none'}</span>
            <span className="text-sm font-bold">{isDictating ? 'Dictating...' : 'Voice Scribe'}</span>
          </button>
          <img src="https://picsum.photos/seed/doc1/100/100" className="size-10 rounded-full border-2 border-primary/20" alt="Doctor" />
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full relative">
        <div className="flex flex-col gap-6 flex-[2] min-w-0">
          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                <h3 className="text-lg font-bold">Patient Details</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Full Name</label>
                <input type="text" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full rounded-lg border-neutral-border bg-gray-50 py-2 text-sm focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Age</label>
                <input type="number" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} className="w-full rounded-lg border-neutral-border bg-gray-50 py-2 text-sm focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Gender</label>
                <select value={patient.gender} onChange={e => setPatient({...patient, gender: e.target.value as any})} className="w-full rounded-lg border-neutral-border bg-gray-50 py-2 text-sm focus:ring-primary">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">medication</span>
                <h3 className="text-lg font-bold">Diagnosis & AI Suggestions</h3>
              </div>
            </div>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis (e.g., Acute Migraine)" 
                  className="w-full rounded-lg border-neutral-border bg-gray-50 pl-10 py-3 text-sm focus:ring-primary"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">stethoscope</span>
              </div>
              <button 
                onClick={suggestTreatment}
                disabled={isAiLoading || !diagnosis}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${isAiLoading ? 'bg-primary/20 text-primary cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover shadow-md'}`}
              >
                {isAiLoading ? (
                  <span className="animate-spin material-symbols-outlined text-lg">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                )}
                {isAiLoading ? 'Analyzing...' : 'Suggest Treatment'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-full">Quick Search Drugs:</span>
              {['Paracetamol', 'Amoxicillin', 'Metformin', 'Atorvastatin'].map((drug) => (
                <button 
                  key={drug} 
                  onClick={() => searchDrugInfo(drug)}
                  className="text-xs px-3 py-1.5 border border-neutral-border rounded-lg bg-white hover:bg-gray-50 hover:border-primary transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">search</span>
                  {drug}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-border bg-gray-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Prescription Table</h3>
              <span className="text-xs text-text-secondary">{medicines.length} Medicines added</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 text-text-secondary font-semibold border-b border-neutral-border">
                  <tr>
                    <th className="px-5 py-3">Medicine Name</th>
                    <th className="px-2 py-3 text-center">M-A-N</th>
                    <th className="px-5 py-3">Days</th>
                    <th className="px-5 py-3">Timing</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-gray-400 italic">
                        No medicines added yet. Use AI suggestions or search above.
                      </td>
                    </tr>
                  )}
                  {medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-bold flex items-center gap-2">
                          {m.name}
                          <button onClick={() => searchDrugInfo(m.name)} className="text-primary hover:text-primary-hover">
                            <span className="material-symbols-outlined text-sm">info</span>
                          </button>
                        </div>
                        <div className="text-xs text-text-secondary">{m.type} • {m.dosage}</div>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className="font-mono bg-primary/5 px-2 py-1 rounded text-primary">{m.frequency}</span>
                      </td>
                      <td className="px-5 py-3">
                        <input type="text" value={m.duration} onChange={() => {}} className="w-20 rounded border-neutral-border py-1 text-sm bg-transparent" />
                      </td>
                      <td className="px-5 py-3">
                        <select className="rounded border-neutral-border py-1 text-sm w-32 bg-transparent">
                          <option>{m.timing}</option>
                          <option>After Food</option><option>Before Food</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => removeMedicine(m.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className={`flex flex-col gap-6 flex-1 min-w-[320px] transition-all duration-300 ${showSearchPanel ? 'lg:translate-x-0' : 'lg:translate-x-4'}`}>
          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5 flex-grow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              <h3 className="text-lg font-bold">Clinical Advice & Notes</h3>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <ul className="space-y-2 mb-4">
                {advice.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg group">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span className="flex-grow">{a}</span>
                    <button onClick={() => setAdvice(advice.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="relative">
                <textarea 
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  className={`w-full rounded-lg border-neutral-border bg-gray-50 text-sm h-48 p-4 focus:ring-primary transition-all ${isDictating ? 'ring-2 ring-red-500 bg-red-50/10' : ''}`} 
                  placeholder={isDictating ? "Listening and transcribing..." : "Additional clinical notes or dictated advice..."}
                ></textarea>
                {isDictating && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce delay-200"></div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {showSearchPanel && searchResults && (
            <section className="bg-primary/5 rounded-xl border border-primary/20 p-5 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">verified_user</span>
                  Drug Information (Grounded)
                </h4>
                <button onClick={() => setShowSearchPanel(false)} className="text-primary hover:bg-primary/10 rounded">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="text-xs text-gray-700 leading-relaxed max-h-48 overflow-y-auto pr-2 mb-4 custom-scrollbar">
                {isSearching ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                    <div className="h-4 bg-primary/10 rounded w-full"></div>
                    <div className="h-4 bg-primary/10 rounded w-1/2"></div>
                  </div>
                ) : (
                  searchResults.text
                )}
              </div>
              <div className="space-y-2 border-t border-primary/10 pt-3">
                <span className="text-[10px] uppercase font-bold text-primary/60 tracking-tighter">Sources</span>
                {searchResults.links.map((link, i) => (
                  <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[11px] text-primary hover:underline truncate">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    {link.title}
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 z-40 bg-white border-t border-neutral-border px-6 py-4 shadow-lg no-print">
        <div className="max-w-[1600px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="text-xs text-text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-base animate-pulse text-green-500">cloud_done</span>
            Draft auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg text-text-main font-medium text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-neutral-border text-text-main font-bold text-sm hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Preview Rx
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">print</span>
              Save & Print
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f7a5c44; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CreatePrescription;
