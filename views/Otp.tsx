
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Otp: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every(v => v !== '')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl border border-neutral-200 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-4 px-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <span className="material-symbols-outlined text-3xl">local_hospital</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Clinic Portal</h2>
        </div>

        <div className="px-8 pb-8 pt-2">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-2">Verify Identity</h1>
            <p className="text-text-secondary text-sm">
              Please enter the 6-digit code sent to your registered mobile number ending in <span className="font-semibold text-text-main">**89</span>.
            </p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-4 mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold bg-gray-50 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
              />
            ))}
          </div>

          <button 
            onClick={handleVerify}
            className="w-full bg-primary text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 group shadow-sm hover:bg-primary-hover transition-colors"
          >
            Verify & Proceed
            <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">I didn't receive a code</span></div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-neutral-100">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">timer</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Resend Code</span>
                  <span className="text-xs text-gray-500">Available in 00:30</span>
                </div>
              </div>
              <button disabled className="text-sm font-semibold text-gray-400">Resend</button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-neutral-100 hover:border-primary/30 cursor-pointer group transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">smartphone</span>
                <span className="text-sm font-semibold">Incorrect number?</span>
              </div>
              <button onClick={() => navigate('/login')} className="flex items-center gap-1 text-sm font-bold text-primary">
                Change
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
