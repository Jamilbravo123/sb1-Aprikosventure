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
  const isDashboard = window.location.pathname.includes('dashboard');
  
  return (
    <footer className={isDashboard ? 'bg-[#0A0E1A]' : 'bg-white border-t border-slate-100'}>
      {/* Legal & Compliance Notice - Member Dashboard Only */}
      {isDashboard && (
        <div className="py-12 bg-[#0A0E1A]">
          {/* Gold hairline accent */}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#B8860B]/60 to-transparent mx-auto mb-8" />
          
          <div className="mx-auto max-w-4xl px-6">
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-widest text-center">
              Legal & Compliance Notice
            </h3>
            
            <div className="space-y-4 text-sm text-white leading-relaxed text-center">
              <p className="max-w-3xl mx-auto">
                The Aprikos Venture Private Lounge provides informational access for members only. Nothing presented on this page constitutes investment advice, investment research, brokerage services, or a recommendation to engage in any financial transaction.
              </p>
              
              <p className="max-w-3xl mx-auto">
                Aprikos Venture AS does not facilitate, intermediate, arrange, or promote investments. All companies featured within the Aprikos ecosystem are ordinary commercial enterprises and are solely responsible for their own communication, marketing materials, regulatory disclosures, and any prospectus obligations.
              </p>
              
              <p className="max-w-3xl mx-auto">
                BalderX is a technology provider only, delivering infrastructure for tokenization, wallet connectivity, and ledger-based processes. BalderX does not market offerings, does not distribute financial instruments, and does not provide any form of investment or financial services. Any tokenized instruments accessed through BalderX are issued and made available solely by the respective companies under their own responsibility.
              </p>
              
              <p className="font-semibold text-[#B8860B] max-w-2xl mx-auto pt-2 border-t border-slate-700/50 mt-6">
                Members must conduct their own assessments and seek independent professional advice before making any financial decisions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-8 md:order-2">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`transition-colors ${
                isDashboard
                  ? 'text-slate-400 hover:text-[#B8860B]'
                  : 'text-slate-400 hover:text-purple-600'
              }`}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel={item.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className={`text-center text-sm leading-5 ${
            isDashboard
              ? 'text-slate-500'
              : 'text-slate-500'
          }`}>
            &copy; {new Date().getFullYear()} Aprikos Venture AS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}