import React from 'react';
import ContactHeader from './ContactHeader';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

export default function Contact() {
  return (
    <section id="contact" className="relative isolate bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ContactHeader />
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}