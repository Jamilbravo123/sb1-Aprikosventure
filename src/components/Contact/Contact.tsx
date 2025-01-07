import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Ready to build something great together? Get in touch with our team.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <Mail className="h-8 w-8 text-purple-600" />
              <h3 className="mt-4 text-base font-semibold text-gray-900">Email</h3>
              <p className="mt-2 text-gray-600">contact@aprikos.no</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <h3 className="mt-4 text-base font-semibold text-gray-900">Office</h3>
              <p className="mt-2 text-gray-600">Oslo, Norway</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Phone className="h-8 w-8 text-purple-600" />
              <h3 className="mt-4 text-base font-semibold text-gray-900">Phone</h3>
              <p className="mt-2 text-gray-600">+47 000 00 000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}