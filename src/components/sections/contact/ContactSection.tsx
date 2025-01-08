import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Send, Check, AlertCircle } from 'lucide-react';
import { colors } from '../../../constants/colors';

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">
            Get in Touch
          </h2>
          <p className="text-lg text-slate-600 mb-12 text-center">
            Have a question or want to discuss potential opportunities? We'd love to hear from you.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
          >
            <div>
              <label htmlFor="from_name" className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="from_name"
                id="from_name"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="reply_to" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="reply_to"
                id="reply_to"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-lg font-medium text-white 
                transition-all duration-200 flex items-center justify-center gap-2
                bg-blue-600 hover:bg-blue-700 hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-lg">
                <Check className="w-5 h-5" />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>Failed to send message. Please try again later.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
