import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface InvestorPortalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  heading?: string;
  message?: string;
}

export default function InvestorPortalPopup({ 
  isOpen, 
  onClose,
  title = "Investor Portal",
  heading = "Coming Soon!",
  message = "Our secure investor portal is currently under development. Stay tuned for exclusive access to portfolio performance, investment opportunities, and detailed reports."
}: InvestorPortalPopupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        'template_fzpd72b',
        {
          email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus('success');
      setEmail('');
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
          <h2 className="text-[#0B2545] text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-[#0B2545] to-[#051428] text-white rounded-xl p-6 mb-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-3">{heading}</h3>
            <p className="text-slate-200">{message}</p>
          </div>

          <p className="text-gray-600 mb-4">
            Want to be notified when we launch? Leave your email below:
          </p>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#0B2545] to-[#051428] text-white rounded-lg font-medium
                hover:from-[#051428] hover:to-[#0B2545] transition-all disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Notify Me'}
            </button>

            {submitStatus === 'success' && (
              <p className="mt-4 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                Thank you! We'll notify you when the portal launches.
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
