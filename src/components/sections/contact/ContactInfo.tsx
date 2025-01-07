import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { gradients } from '../../../constants/colors';

const contactDetails = [
  {
    icon: Mail,
    title: 'Email',
    details: 'info@aprikosventure.com',
    link: 'mailto:info@aprikosventure.com',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: 'Lørenveien 73a, 0580 Oslo',
    link: 'https://maps.google.com/?q=Lørenveien+73a,+0580+Oslo',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: '+47-98691760',
    link: 'tel:+47-98691760',
  },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-8">
        {contactDetails.map((item) => (
          <div key={item.title} className="group flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 transition-colors duration-200 group-hover:bg-purple-200">
              <item.icon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              {item.link ? (
                <a 
                  href={item.link} 
                  className="mt-1 text-slate-600 hover:text-purple-600 transition-colors duration-200"
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {item.details}
                </a>
              ) : (
                <p className="mt-1 text-slate-600">{item.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-12 rounded-2xl ${gradients.background.primary} p-8 text-white shadow-lg`}>
        <h3 className="text-lg font-semibold">Join our journey</h3>
        <p className="mt-4 text-slate-100">
          We're always looking for innovative ideas and passionate founders. Let's create something extraordinary together.
        </p>
      </div>
    </div>
  );
}