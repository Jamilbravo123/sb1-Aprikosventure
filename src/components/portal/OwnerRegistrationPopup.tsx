import React, { useState } from 'react';
import { X, User, Mail, Building2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface OwnerRegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerRegistrationPopup({ isOpen, onClose }: OwnerRegistrationPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    investorType: 'Individual'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        'template_owner_reg', // Replace with your new template ID
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        investorType: 'Individual'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-[100] pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-start p-6 pb-0">
          <h2 className="text-[#0B2545] text-xl font-semibold">Private Placement Registration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-[#0B2545] text-white rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">Opening Soon!</h3>
            <p className="text-slate-200">
              Private Placement Opening Soon for Eligible Investors – Stay Tuned!
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            Register your interest to receive exclusive early access:
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company (Optional)"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Investor Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="investorType"
                    value="Individual"
                    checked={formData.investorType === 'Individual'}
                    onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                    className="mr-2"
                  />
                  Individual
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="investorType"
                    value="Institutional"
                    checked={formData.investorType === 'Institutional'}
                    onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                    className="mr-2"
                  />
                  Institutional
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#0B2545] text-white rounded-lg font-medium
                hover:bg-[#0B2545]/90 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Register Interest'}
            </button>

            {submitStatus === 'success' && (
              <p className="mt-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                Thank you for your interest! We'll contact you with early access details.
              </p>
            )}

            {submitStatus === 'error' && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                Failed to submit. Please try again later.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
