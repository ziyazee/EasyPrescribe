
import React, { useState, useRef } from 'react';
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

  // Helper for safe base64 encoding (avoids stack limits)
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const suggestTreatment = async () => {
    if (!diagnosis) return;
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest a treatment plan for a patient (${patient.age}y, ${patient.gender}) with diagnosis: ${diagnosis}. 
                  Provide suggestions in JSON format with "medicines" (name, type, dosage, frequency, duration, timing) 
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
        const newMeds = data.medicines.map((m: any, i: number) => ({ ...m, id: `ai-${Date.now()}-${i}` }));
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
        contents: `Latest medical guidelines and drug interactions for: ${query}`,
        config: { tools: [{ googleSearch: {} }] }
      });

      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.web)
        ?.map(chunk => ({ title: chunk.web.title, uri: chunk.web.uri })) || [];

      setSearchResults({
        text: response.text || "No specific clinical guidelines found.",
        links: links.slice(0, 5)
      });
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Fix: Added missing removeMedicine function
  const removeMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
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
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = arrayBufferToBase64(int16.buffer);
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: (msg) => {
            if (msg.serverContent?.outputTranscription) {
              setCustomNotes(prev => prev + (prev ? " " : "") + msg.serverContent!.outputTranscription!.text);
            }
          },
          onclose: () => setIsDictating(false),
          onerror: () => setIsDictating(false)
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
      id: `RX-${Math.floor(Math.random() * 90000 + 10000)}`,
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

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-display">
      <header className="flex items-center justify-between border-b border-neutral-border bg-white px-6 py-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-2xl font-bold">local_hospital</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-primary">Clinic Rx</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={startDictation}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow-sm border ${isDictating ? 'bg-red-500 text-white border-red-600 scale-105' : 'bg-white text-gray-700 border-neutral-border hover:border-primary/50'}`}
          >
            <span className={`material-symbols-outlined text-xl ${isDictating ? 'animate-pulse fill-1' : ''}`}>
              {isDictating ? 'graphic_eq' : 'mic_none'}
            </span>
            <span className="text-sm font-bold">{isDictating ? 'Transcribing...' : 'Voice Dictation'}</span>
          </button>
          <div className="h-10 w-px bg-neutral-border mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold leading-none">Dr. Sarah Mitchell</p>
              <p className="text-[10px] text-text-secondary uppercase tracking-tighter">General Physician</p>
            </div>
            <img src="https://picsum.photos/seed/doc1/100/100" className="size-10 rounded-full border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer" alt="Doctor" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full relative">
        <div className="flex flex-col gap-6 flex-[2] min-w-0">
          <section className="bg-white rounded-xl shadow-soft border border-neutral-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary bg-primary-light p-1.5 rounded-lg text-xl">person_search</span>
              <h3 className="text-lg font-bold">Patient Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">Full Patient Name</label>
                <input type="text" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full rounded-lg border-neutral-border bg-gray-50/50 py-2.5 px-4 text-sm focus:ring-primary focus:bg-white transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">Age</label>
                <input type="number" value={patient.age} onChange={e => setPatient({...patient, age: e.target.value})} className="w-full rounded-lg border-neutral-border bg-gray-50/50 py-2.5 px-4 text-sm focus:ring-primary focus:bg-white transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest px-1">Gender</label>
                <select value={patient.gender} onChange={e => setPatient({...patient, gender: e.target.value as any})} className="w-full rounded-lg border-neutral-border bg-gray-50/50 py-2.5 px-4 text-sm focus:ring-primary focus:bg-white transition-all">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-soft border border-neutral-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary bg-primary-light p-1.5 rounded-lg text-xl">psychology</span>
                <h3 className="text-lg font-bold">Clinical Diagnosis</h3>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis (e.g., Type 2 Diabetes)" 
                  className="w-full rounded-lg border-neutral-border bg-gray-50 pl-11 py-3 text-sm focus:ring-primary focus:bg-white transition-all shadow-inner"
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400">stethoscope</span>
              </div>
              <button 
                onClick={suggestTreatment}
                disabled={isAiLoading || !diagnosis}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${isAiLoading ? 'bg-primary/20 text-primary animate-pulse' : 'bg-primary text-white hover:bg-primary-hover shadow-md active:scale-95'}`}
              >
                <span className={`material-symbols-outlined text-lg ${isAiLoading ? 'animate-spin' : ''}`}>
                  {isAiLoading ? 'sync' : 'auto_awesome'}
                </span>
                {isAiLoading ? 'Analyzing...' : 'AI Suggest Treatment'}
              </button>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-soft border border-neutral-border overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-border bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500">list_alt</span>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Prescription Details</h3>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{medicines.length} Medicines</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-text-secondary font-bold border-b border-neutral-border">
                  <tr>
                    <th className="px-6 py-4">Medicine & Type</th>
                    <th className="px-2 py-4 text-center">Dosage (M-A-N)</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Instructions</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                        No medicines prescribed. Click "AI Suggest" for a treatment plan.
                      </td>
                    </tr>
                  ) : (
                    medicines.map((m) => (
                      <tr key={m.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{m.name}</span>
                            <button 
                              onClick={() => searchDrugInfo(m.name)} 
                              className="text-primary opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-primary/10 rounded"
                              title="Search guidelines"
                            >
                              <span className="material-symbols-outlined text-sm">help_outline</span>
                            </button>
                          </div>
                          <div className="text-[11px] text-text-secondary font-medium">{m.type} • {m.dosage}</div>
                        </td>
                        <td className="px-2 py-4 text-center">
                          <span className="font-mono bg-white border border-primary/20 px-3 py-1 rounded-md text-primary font-bold shadow-sm">{m.frequency}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 font-medium">{m.duration}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-600 italic">
                            <span className="material-symbols-outlined text-[14px]">restaurant</span>
                            {m.timing}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => removeMedicine(m.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                            <span className="material-symbols-outlined text-xl">delete_sweep</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className={`flex flex-col gap-6 flex-1 min-w-[340px] transition-all duration-500 ${showSearchPanel ? 'opacity-100' : 'opacity-100'}`}>
          <section className="bg-white rounded-xl shadow-soft border border-neutral-border p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              <h3 className="text-lg font-bold">Clinical Advice</h3>
            </div>
            
            <div className="flex-grow space-y-4">
              <ul className="space-y-2">
                {advice.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-transparent hover:border-primary/20 transition-all group shadow-sm">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">verified</span>
                    <span className="flex-grow leading-relaxed">{a}</span>
                    <button onClick={() => setAdvice(advice.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="relative group">
                <textarea 
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  className={`w-full rounded-xl border-neutral-border bg-gray-50/50 text-sm h-64 p-5 focus:ring-primary focus:bg-white transition-all shadow-inner leading-relaxed ${isDictating ? 'ring-2 ring-red-500 shadow-primary-glow' : ''}`} 
                  placeholder={isDictating ? "AI Scribe is listening..." : "Additional notes or dictated clinical observations..."}
                ></textarea>
                {isDictating && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce delay-200"></div>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 uppercase">Live</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {showSearchPanel && searchResults && (
            <section className="bg-white rounded-xl shadow-soft border border-primary/20 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">verified_user</span>
                  Medical Grounding
                </h4>
                <button onClick={() => setShowSearchPanel(false)} className="text-gray-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-700 leading-relaxed mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 max-h-48 overflow-y-auto custom-scrollbar">
                {isSearching ? (
                  <div className="space-y-3">
                    <div className="h-3 shimmer rounded w-full"></div>
                    <div className="h-3 shimmer rounded w-5/6"></div>
                    <div className="h-3 shimmer rounded w-4/6"></div>
                  </div>
                ) : (
                  searchResults.text
                )}
              </div>
              
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter opacity-50">Referenced Clinical Sources</p>
                {searchResults.links.map((link, i) => (
                  <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[11px] text-primary hover:text-primary-hover font-medium truncate bg-primary/5 p-2 rounded-lg border border-primary/5 hover:border-primary/20 transition-all">
                    <img src={`https://www.google.com/s2/favicons?domain=${new URL(link.uri).hostname}&sz=32`} className="size-4 rounded-sm" alt="" />
                    <span className="truncate">{link.title}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 z-40 bg-white border-t border-neutral-border px-6 py-4 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] no-print">
        <div className="max-w-[1600px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
              <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
              <span className="text-[11px] font-bold uppercase tracking-tight">Draft Secured</span>
            </div>
            <span className="text-[11px] text-text-secondary font-medium">Auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 text-text-secondary font-bold text-sm hover:text-text-main transition-colors">
              Discard
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-neutral-border bg-white text-text-main font-bold text-sm hover:bg-gray-50 hover:border-primary/40 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Full Preview
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">print</span>
              Print Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
