
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Prescription } from '../types';

interface Props {
  prescription: Prescription | null;
}

const PrescriptionPreview: React.FC<Props> = ({ prescription }) => {
  const navigate = useNavigate();

  if (!prescription) return <div className="p-10 text-center">No prescription found. <button onClick={() => navigate('/dashboard')} className="text-primary underline">Go back</button></div>;

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-display text-gray-900">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm no-print">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Rx Preview</h1>
              <p className="text-xs text-gray-500">Draft for {prescription.patient.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/prescription/new')} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="material-symbols-outlined align-middle mr-1 text-[20px]">edit</span> Edit
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="material-symbols-outlined align-middle mr-1 text-[20px]">print</span> Print
            </button>
            <button className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary-hover">
              <span className="material-symbols-outlined align-middle mr-1 text-[20px]">download</span> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex justify-center">
        <div className="a4-paper w-[210mm] min-h-[297mm] bg-white p-12 shadow-xl relative flex flex-col">
          <header className="flex flex-col sm:flex-row gap-6 justify-between items-start border-b-2 border-primary/20 pb-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                <span className="material-symbols-outlined text-4xl">local_hospital</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary tracking-tight">{prescription.doctor.clinicName}</h2>
                <p className="text-sm text-gray-600 mt-1">{prescription.doctor.clinicAddress}</p>
                <p className="text-sm text-gray-600">Ph: {prescription.doctor.clinicPhone}</p>
                <p className="text-sm text-gray-600">Email: {prescription.doctor.clinicEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-900">{prescription.doctor.name}</h3>
              <p className="text-sm font-medium text-primary">{prescription.doctor.qualification}</p>
              <p className="text-sm text-gray-500 mt-1">Reg No: {prescription.doctor.regNo}</p>
              <p className="text-sm text-gray-500">{prescription.doctor.specialization}</p>
            </div>
          </header>

          <section className="bg-gray-50 rounded border border-gray-100 p-4 mb-6 flex flex-wrap gap-y-4 justify-between items-center text-sm">
            <div className="flex gap-6 flex-wrap">
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Patient Name</span>
                <span className="font-semibold text-gray-900 text-lg">{prescription.patient.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Age / Sex</span>
                <span className="font-medium text-gray-900">{prescription.patient.age} Yrs / {prescription.patient.gender}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Weight</span>
                <span className="font-medium text-gray-900">{prescription.vitals.weight} kg</span>
              </div>
            </div>
            <div>
              <span className="text-gray-500 block text-xs uppercase tracking-wider text-right">Date</span>
              <span className="font-medium text-gray-900">{prescription.patient.date}</span>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Diagnosis</h4>
              <p className="text-gray-900 font-medium">{prescription.diagnosis}</p>
            </div>
            <div className="sm:text-right">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Vitals</h4>
              <p className="text-gray-900 font-medium">
                BP: <span className="text-gray-700">{prescription.vitals.bp} mmHg</span> | 
                Pulse: <span className="text-gray-700">{prescription.vitals.pulse} bpm</span> | 
                Temp: <span className="text-gray-700">{prescription.vitals.temp}°F</span>
              </p>
            </div>
          </section>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-4xl font-serif font-bold text-primary italic">Rx</h2>
              <div className="h-px bg-gray-200 flex-1 ml-4"></div>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg mb-8">
              <table className="w-full text-left text-sm">
                <thead className="bg-primary/5 text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-12 text-center">#</th>
                    <th className="py-3 px-4 font-semibold">Medicine Name</th>
                    <th className="py-3 px-4 font-semibold">Dosage</th>
                    <th className="py-3 px-4 font-semibold w-24">Frequency</th>
                    <th className="py-3 px-4 font-semibold w-24">Duration</th>
                    <th className="py-3 px-4 font-semibold">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prescription.medicines.map((m, i) => (
                    <tr key={m.id} className={i % 2 !== 0 ? 'bg-gray-50/50' : ''}>
                      <td className="py-4 px-4 text-center text-gray-500">{i + 1}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900 block text-base">{m.name}</span>
                        <span className="text-xs text-gray-500">({m.type})</span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{m.dosage}</td>
                      <td className="py-4 px-4 font-mono font-medium text-primary">{m.frequency}</td>
                      <td className="py-4 px-4 text-gray-700">{m.duration}</td>
                      <td className="py-4 px-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-gray-400">restaurant</span>
                          {m.timing}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-primary/5 rounded-lg p-5 border border-primary/10 mb-8">
              <h5 className="text-primary font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">info</span>
                Doctor's Advice / Diet
              </h5>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-1">
                {prescription.advice.map((a, i) => <li key={i}>{a}</li>)}
                {prescription.customNotes && <li>{prescription.customNotes}</li>}
              </ul>
            </div>
          </div>

          <footer className="mt-auto pt-8 border-t border-gray-100 flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-400 font-mono">ID: {prescription.id}</p>
              <p className="text-xs text-gray-500 mt-1">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-32 relative">
                <img src="https://picsum.photos/seed/sig1/128/64" className="object-contain w-full h-full opacity-80" alt="Signature" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-900">{prescription.doctor.name}</p>
                <p className="text-[10px] text-primary uppercase tracking-wider font-semibold">Digitally Signed</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <style>{`
        @media print {
          body { background: white; }
          .a4-paper { box-shadow: none; margin: 0; width: 100%; border: none; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PrescriptionPreview;
