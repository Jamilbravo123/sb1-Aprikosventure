import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import ContactHeader from './ContactHeader';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
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
    <div id="contact" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ContactHeader />
        
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-2">
          <ContactInfo />
          
          <div className="rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#051428] p-[1px] shadow-xl">
            <div className="rounded-2xl bg-white p-6">
              <ContactForm formRef={formRef} isSubmitting={isSubmitting} handleSubmit={handleSubmit} />
              
              {submitStatus === 'success' && (
                <div className="mt-4 rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mt-4 rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    Sorry, there was an error sending your message. Please try again later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
