
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light flex flex-row">
      <aside className="hidden lg:flex w-72 flex-col border-r border-neutral-border bg-white h-screen sticky top-0 p-4">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center p-2 rounded-lg bg-gray-50">
              <img src="https://picsum.photos/seed/doc1/100/100" className="size-12 rounded-full ring-2 ring-primary/20" alt="Doctor" />
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-sm font-semibold truncate">Dr. Sarah Mitchell</h1>
                <p className="text-text-secondary text-xs truncate">General Physician</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1 mt-4">
              {[
                { n: 'Dashboard', i: 'dashboard', p: '/dashboard' },
                { n: 'Patients', i: 'group', p: '#' },
                { n: 'Prescriptions', i: 'description', p: '#' },
                { n: 'Settings', i: 'settings', p: '/settings', active: true }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={() => item.p !== '#' && navigate(item.p)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${item.active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-secondary hover:bg-gray-50 hover:text-primary'}`}
                >
                  <span className={`material-symbols-outlined text-2xl ${item.active ? 'fill-1' : ''}`}>{item.i}</span>
                  <span className="text-sm font-medium">{item.n}</span>
                </button>
              ))}
            </nav>
          </div>
          <button onClick={() => navigate('/login')} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-auto">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-text-secondary mt-1">Manage your professional profile and clinic preferences.</p>
          </div>
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
            Log out
          </button>
        </div>

        <div className="space-y-6 pb-20">
          <section className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-border bg-gray-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Full Name</label>
                <input type="text" className="w-full rounded-lg border-neutral-border h-11" defaultValue="Dr. Sarah Mitchell" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Medical Registration No.</label>
                <input type="text" className="w-full rounded-lg border-neutral-border h-11" defaultValue="MCI-2023-8842" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Mobile Number</label>
                <input type="tel" className="w-full rounded-lg border-neutral-border h-11" defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Email Address</label>
                <input type="email" className="w-full rounded-lg border-neutral-border h-11" defaultValue="sarah.m@clinic.com" />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-border bg-gray-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">domain</span>
              <h2 className="text-lg font-semibold">Practice Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Clinic Name</label>
                <input type="text" className="w-full rounded-lg border-neutral-border h-11" defaultValue="City Care Clinic" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Qualification</label>
                  <input type="text" className="w-full rounded-lg border-neutral-border h-11" defaultValue="MBBS, MD" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Specialization</label>
                  <select className="w-full rounded-lg border-neutral-border h-11"><option>General Physician</option></select>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-border overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-border bg-gray-50 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">ink_pen</span>
              <h2 className="text-lg font-semibold">Digital Signature</h2>
            </div>
            <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1 w-full border-2 border-dashed border-neutral-border rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary">cloud_upload</span>
                <p className="mt-2 text-sm font-medium">Upload new signature</p>
                <p className="text-xs text-text-secondary">PNG or JPG up to 2MB</p>
              </div>
              <div className="shrink-0 w-48">
                <p className="text-xs font-medium text-gray-500 mb-2">Current Preview</p>
                <div className="h-32 border border-neutral-border rounded-lg bg-white p-4 flex items-center justify-center">
                  <img src="https://picsum.photos/seed/sig1/128/64" className="max-h-full opacity-80" alt="Current Signature" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-6">
            <button className="px-6 py-2.5 rounded-lg border border-neutral-border hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined">check</span>
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
