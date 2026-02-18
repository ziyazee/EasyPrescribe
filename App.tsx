
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Otp from './views/Otp';
import Dashboard from './views/Dashboard';
import Registration from './views/Registration';
import CreatePrescription from './views/CreatePrescription';
import PrescriptionPreview from './views/PrescriptionPreview';
import Settings from './views/Settings';
import { Prescription } from './types';

const App: React.FC = () => {
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route 
          path="/prescription/new" 
          element={<CreatePrescription onSave={setCurrentPrescription} />} 
        />
        <Route 
          path="/prescription/preview" 
          element={<PrescriptionPreview prescription={currentPrescription} />} 
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
