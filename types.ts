
export interface Medicine {
  id: string;
  name: string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Cream';
  dosage: string;
  frequency: string; // e.g., "1-0-1"
  duration: string; // e.g., "5 Days"
  timing: 'Before Food' | 'After Food' | 'Empty Stomach' | 'At Bedtime';
}

export interface Patient {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  date: string;
}

export interface Prescription {
  id: string;
  patient: Patient;
  diagnosis: string;
  medicines: Medicine[];
  advice: string[];
  customNotes: string;
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    weight: string;
  };
  doctor: {
    name: string;
    regNo: string;
    qualification: string;
    specialization: string;
    clinicName: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail: string;
  };
}

export enum Step {
  Personal = 1,
  Professional = 2,
  Clinic = 3,
  Branding = 4
}
