import React from 'react';
import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';

export default function Contact() {
  return (
    <section id="contact" className="relative isolate bg-white py-24 mb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to Build Something Amazing?</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Whether you're a founder with a groundbreaking idea or an investor looking to partner, we'd love to hear from you.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}