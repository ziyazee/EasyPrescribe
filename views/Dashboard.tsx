
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light flex flex-col transition-colors duration-200">
      <header className="w-full bg-white border-b border-neutral-border px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-3xl">local_hospital</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">City Care Clinic</h1>
              <p className="text-xs text-text-secondary font-medium">Prescription Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold">Dr. Sarah Mitchell</span>
              <span className="text-xs text-text-secondary">General Physician</span>
            </div>
            <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
              <img 
                src="https://picsum.photos/seed/doc1/100/100" 
                className="size-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1f7a5c 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="w-full max-w-2xl flex flex-col items-center gap-8 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Good Morning, Doctor.</h2>
            <p className="text-text-secondary text-lg">Ready to see your next patient?</p>
          </div>

          <div className="w-full bg-white rounded-2xl shadow-xl border border-primary/10 p-8 sm:p-12 flex flex-col items-center gap-8 hover:scale-[1.01] transition-transform">
            <button 
              onClick={() => navigate('/prescription/new')}
              className="group flex w-full max-w-md items-center justify-center gap-4 bg-primary text-white rounded-xl py-6 px-8 shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
            >
              <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined font-bold">add</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-wide uppercase">Create New Prescription</span>
            </button>

            <div className="relative w-full max-w-md flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-grow"></div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">or</span>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>

            <button className="flex items-center gap-2 text-primary font-semibold text-lg hover:underline transition-colors">
              <span className="material-symbols-outlined">history</span>
              View Previous Prescriptions
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg mt-4">
            {[
              { label: 'Patients Today', val: '12' },
              { label: 'Avg. Time', val: '45m' },
              { label: 'Sync Status', val: 'Pending' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-100 text-center">
                <div className="text-2xl font-bold">{stat.val}</div>
                <div className="text-xs text-text-secondary font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-neutral-border py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <p>© 2024 City Care Clinic. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Support: +91 000 000 0000</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
