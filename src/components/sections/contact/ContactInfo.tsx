import React from 'react';
import { Mail, MapPin } from 'lucide-react';

const contactDetails = [
  {
    title: 'Email',
    details: 'contact@aprikosventure.com',
    icon: Mail,
    link: 'mailto:contact@aprikosventure.com',
  },
  {
    title: 'Office',
    details: 'Lørenveien 73a, Oslo',
    icon: MapPin,
  }
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-8">
        {contactDetails.map((item) => (
          <div key={item.title} className="group flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B2545] to-[#051428] transition-all duration-200 group-hover:scale-105">
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              {item.link ? (
                <a 
                  href={item.link} 
                  className="mt-1 text-slate-600 hover:text-[#0B2545] transition-colors duration-200"
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
    </div>
  );
}