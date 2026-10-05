import React, { useState } from 'react';
import { Upload, X, ShieldCheck, CheckCircle } from 'lucide-react';

export default function PrescriptionModal({ isOpen, onClose, onSubmitPrescription }) {
  // If the popup is not open, show nothing
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [sampleSlip, setSampleSlip] = useState('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new prescription request object
    const newRequest = {
      id: 'req-' + Date.now(),
      patientName: patientName || 'Walk-in Patient',
      patientPhone: patientPhone || '+91 98765 43210',
      imageUrl: sampleSlip,
      time: 'Just now'
    };

    // Send this request to the parent app
    onSubmitPrescription(newRequest);
    alert('Prescription sent to nearby pharmacies! A pharmacist will verify the handwriting.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
          <h3 className="font-bold text-base text-slate-800">Upload Doctor's Prescription</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safe Verification Notice (Option 1) */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 mb-4 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>100% Human Verified:</strong> A registered pharmacist in your neighborhood reads the doctor's handwriting to avoid any AI mistakes.
          </span>
        </div>

        {/* Prescription Photo Preview */}
        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 mb-4 text-center">
          <p className="text-xs text-slate-500 mb-2 font-medium">Prescription Slip Attached:</p>
          <img 
            src={sampleSlip} 
            alt="Doctor prescription" 
            className="w-full h-36 object-cover rounded-lg border border-slate-200 shadow-sm"
          />
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="e.g. 98765 43210"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Send to Chemists
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}