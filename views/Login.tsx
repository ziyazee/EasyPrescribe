
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (phone.length >= 10) {
      navigate('/otp');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 w-full flex items-center justify-between border-b border-neutral-border bg-white px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">local_hospital</span>
          <h2 className="text-xl font-bold">Clinic Rx</h2>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => navigate('/register')} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
            Register Clinic
          </button>
          <button className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg">Help & Support</button>
        </div>
      </header>

      <main className="w-full max-w-md bg-white p-8 shadow-sm rounded-xl border border-neutral-border">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Doctor Login</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your registered mobile number to access your dashboard.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Mobile Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 material-symbols-outlined">smartphone</span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-lg border-neutral-border pl-10 py-3 focus:ring-primary focus:border-primary"
                placeholder="+91 98765 43210"
              />
            </div>
            <p className="mt-2 text-xs text-text-secondary">We'll send a 6-digit OTP to this number.</p>
          </div>

          <button 
            onClick={handleSendOtp}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-white/50">lock_open</span>
            Send OTP
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500">New to Clinic Rx?</span>
            <button onClick={() => navigate('/register')} className="font-medium text-primary ml-1 hover:underline">Register your clinic</button>
          </div>
          <div className="text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-xs text-gray-400">
        Trusted by 2000+ doctors across India
        <div className="mt-2 flex justify-center gap-1 opacity-50">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
