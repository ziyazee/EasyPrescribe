
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-display text-text-main">
      <header className="w-full bg-white border-b border-neutral-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">local_pharmacy</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Clinic Rx</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">Dr. Registration</span>
              <span className="text-xs text-text-secondary">New Profile</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <img alt="User" src="https://picsum.photos/seed/reg/100/100" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Doctor Registration</h1>
            <span className="text-primary font-medium text-sm">Step {step} of 4</span>
          </div>
          <p className="text-text-secondary mb-4">Please fill in your personal details and clinic information to proceed.</p>
          <div className="h-2 w-full bg-neutral-border rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        <form className="space-y-12 pb-20 bg-white p-8 rounded-xl shadow-sm border border-neutral-border">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-border">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="text-lg font-semibold">Personal Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium block">Full Name</label>
                  <input className="w-full rounded-lg border-neutral-border px-4 py-3 placeholder:text-gray-300" placeholder="e.g. Dr. Rajesh Kumar" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium block">Medical Registration Number</label>
                  <input className="w-full rounded-lg border-neutral-border px-4 py-3 placeholder:text-gray-300" placeholder="e.g. WBMC-12345" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium block">Date of Birth</label>
                  <input className="w-full rounded-lg border-neutral-border px-4 py-3" type="date" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium block">Qualification</label>
                  <input className="w-full rounded-lg border-neutral-border px-4 py-3 placeholder:text-gray-300" placeholder="e.g. MBBS, MD" type="text" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-border">
                <span className="material-symbols-outlined text-primary">apartment</span>
                <h2 className="text-lg font-semibold">Clinic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium block">Clinic Name</label>
                  <input className="w-full rounded-lg border-neutral-border px-4 py-3" placeholder="e.g. Life Care Polyclinic" type="text" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium block">Address</label>
                  <textarea className="w-full rounded-lg border-neutral-border px-4 py-3 h-20" placeholder="Street Address, Area"></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium block">City</label>
                  <input className="w-full rounded-lg border-neutral-border px-4 py-3" placeholder="e.g. Asansol" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium block">State</label>
                  <select className="w-full rounded-lg border-neutral-border px-4 py-3"><option>Select State</option></select>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-neutral-border flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
              className="px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button 
              type="button"
              onClick={() => step < 4 ? setStep(step + 1) : navigate('/dashboard')}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              {step === 4 ? 'Finish' : 'Next Step'}
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Registration;
