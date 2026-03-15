import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import ContactHeader from './ContactHeader';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

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
    <section id="contact" className="py-24 bg-[#0c0c0c]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ContactHeader />

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-2">
          <ContactInfo />

          <div className="rounded-2xl bg-[#141420]/50 backdrop-blur-sm border border-white/5 p-6">
            <ContactForm formRef={formRef} isSubmitting={isSubmitting} handleSubmit={handleSubmit} />

            {submitStatus === 'success' && (
              <div className="mt-4 rounded-lg bg-emerald-900/30 border border-emerald-700/30 p-4">
                <p className="text-sm text-emerald-300">
                  Thank you for your message! We'll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 rounded-lg bg-red-900/30 border border-red-700/30 p-4">
                <p className="text-sm text-red-300">
                  Sorry, there was an error sending your message. Please try again later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
