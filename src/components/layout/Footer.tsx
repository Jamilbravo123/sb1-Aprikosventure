import React from 'react';
import { Linkedin, Mail, Instagram } from 'lucide-react';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/aprikos-venture/',
    icon: Linkedin,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/aprikosventure?igsh=MTA4cnM1dGRvOWtoYQ==',
    icon: Instagram,
  },
  {
    name: 'Email',
    href: 'mailto:contact@aprikos.no',
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-8 md:order-2">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-slate-400 hover:text-purple-600 transition-colors"
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel={item.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} Aprikos Venture AS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}