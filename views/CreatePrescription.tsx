
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, Medicine, Prescription } from '../types';

interface Props {
  onSave: (prescription: Prescription) => void;
}

const CreatePrescription: React.FC<Props> = ({ onSave }) => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient>({
    name: 'Rajesh Kumar',
    age: '42',
    gender: 'Male',
    phone: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: '1', name: 'Dolo 650mg', type: 'Tablet', dosage: '650mg', frequency: '1-0-1', duration: '3 Days', timing: 'After Food' },
    { id: '2', name: 'Azithromycin 500', type: 'Tablet', dosage: '500mg', frequency: '1-0-1', duration: '5 Days', timing: 'After Food' }
  ]);

  const [diagnosis, setDiagnosis] = useState('Fever, Viral Infection');
  const [customNotes, setCustomNotes] = useState('');
  const [advice, setAdvice] = useState<string[]>(['Drink plenty of warm fluids', 'Complete bed rest for 2 days']);

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
          <span className="text-sm font-medium text-text-secondary hidden sm:block">Dr. Sarah Mitchell</span>
          <img src="https://picsum.photos/seed/doc1/100/100" className="size-10 rounded-full border-2 border-primary/20" alt="Doctor" />
          <button onClick={() => navigate('/settings')} className="size-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-gray-600">settings</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row gap-6 p-4 md:p-6 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col gap-6 flex-[2] min-w-0">
          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">person_add</span>
              <h3 className="text-lg font-bold">Patient Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={patient.name} 
                  onChange={e => setPatient({...patient, name: e.target.value})}
                  className="w-full rounded-lg border-neutral-border bg-gray-50 py-2 text-sm focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Age</label>
                <input 
                  type="number" 
                  value={patient.age} 
                  onChange={e => setPatient({...patient, age: e.target.value})}
                  className="w-full rounded-lg border-neutral-border bg-gray-50 py-2 text-sm focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase mb-1 block">Gender</label>
                <select 
                  value={patient.gender} 
                  onChange={e => setPatient({...patient, gender: e.target.value as any})}
                  className="w-full rounded-lg border-neutral-border bg-gray-50 py-2 text-sm focus:ring-primary"
                >
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">medication</span>
                <h3 className="text-lg font-bold">Diagnosis & Medicine</h3>
              </div>
              <div className="relative">
                <input className="pl-9 pr-3 py-1.5 text-sm rounded-full border-neutral-border bg-gray-50 w-48 focus:w-64 transition-all" placeholder="Search medicine..." />
                <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-gray-400 text-lg">search</span>
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b border-gray-100">
              {['Fever', 'Cold & Cough', 'Gastric', 'Pain Relief', 'Antibiotics'].map((c, i) => (
                <button key={i} className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${i === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {c}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {['Paracetamol 650', 'Dolo 650', 'Ibuprofen 400', 'Crocin Advance'].map((m, i) => (
                <button key={i} className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-border rounded-lg bg-white hover:border-primary hover:text-primary transition-all shadow-sm">
                  <span className="text-xs font-medium">{m}</span>
                  <span className="material-symbols-outlined text-base text-gray-400 group-hover:text-primary">add_circle</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-border bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700 uppercase">Prescription</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-100 text-text-secondary font-semibold border-b border-neutral-border">
                  <tr>
                    <th className="px-5 py-3">Medicine Name</th>
                    <th className="px-2 py-3 text-center">M</th>
                    <th className="px-2 py-3 text-center">A</th>
                    <th className="px-2 py-3 text-center">N</th>
                    <th className="px-5 py-3">Days</th>
                    <th className="px-5 py-3">Timing</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {medicines.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-text-secondary">{m.type}</div>
                      </td>
                      <td className="px-2 py-3 text-center"><input type="checkbox" checked className="rounded text-primary focus:ring-primary" /></td>
                      <td className="px-2 py-3 text-center"><input type="checkbox" className="rounded text-primary focus:ring-primary" /></td>
                      <td className="px-2 py-3 text-center"><input type="checkbox" checked className="rounded text-primary focus:ring-primary" /></td>
                      <td className="px-5 py-3"><input type="text" value={m.duration} className="w-20 rounded border-neutral-border py-1 text-sm" /></td>
                      <td className="px-5 py-3">
                        <select className="rounded border-neutral-border py-1 text-sm w-32">
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

        <div className="flex flex-col gap-6 flex-1 min-w-[320px]">
          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5 flex-grow">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              <h3 className="text-lg font-bold">Nutrition & Advice</h3>
            </div>
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Quick Select</h4>
              <div className="flex flex-wrap gap-2">
                {['Drink Warm Water', 'Avoid Spicy Food', 'Bed Rest', 'Soft Diet'].map((a, i) => (
                  <button key={i} className="px-3 py-1 rounded-full text-xs bg-gray-100 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 transition-colors">
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Selected Advice</h4>
              <ul className="space-y-2">
                {advice.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg group">
                    <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    <span>{a}</span>
                    <button onClick={() => setAdvice(advice.filter((_, idx) => idx !== i))} className="ml-auto text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </li>
                ))}
              </ul>
              <textarea 
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                className="w-full mt-3 rounded-lg border-neutral-border bg-gray-50 text-sm h-24 focus:ring-primary" 
                placeholder="Add custom notes here..."
              ></textarea>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">calendar_clock</span>
              <h3 className="text-sm font-bold uppercase">Follow Up</h3>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="followUp" className="rounded text-primary" />
              <label htmlFor="followUp" className="text-sm text-gray-700">Review after</label>
              <input type="number" defaultValue={3} className="w-16 rounded border-neutral-border py-1 text-sm" />
              <span className="text-sm text-gray-700">Days</span>
            </div>
          </section>
        </div>
      </main>

      <div className="sticky bottom-0 z-40 bg-white border-t border-neutral-border px-6 py-4 shadow-lg no-print">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="text-xs text-text-secondary">Draft auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-neutral-border text-text-main font-medium text-sm hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-lg">visibility</span>
              Preview PDF
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover shadow-sm transition-colors">
              <span className="material-symbols-outlined text-lg">print</span>
              Print
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 shadow-sm transition-colors">
              <span className="material-symbols-outlined">send</span>
              SEND VIA WHATSAPP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
