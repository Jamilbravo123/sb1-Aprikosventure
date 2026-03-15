import { Linkedin } from 'lucide-react';

export default function Footer() {
  const isDashboard = window.location.pathname.includes('dashboard');

  return (
    <footer className="bg-[#0c0c0c]">
      {/* Copper gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9935E]/40 to-transparent" />

      {/* Legal & Compliance Notice - Member Dashboard Only */}
      {isDashboard && (
        <div className="py-12">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#C9935E]/60 to-transparent mx-auto mb-8" />
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
              <p className="font-semibold text-[#C9935E] max-w-2xl mx-auto pt-2 border-t border-white/10 mt-6">
                Members must conduct their own assessments and seek independent professional advice before making any financial decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="md:order-1">
          <p className="text-center text-sm leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} Aprikos Venture AS
          </p>
        </div>
        <div className="flex justify-center items-center space-x-6 mt-6 md:order-2 md:mt-0">
          <a
            href="/privacy"
            className="text-sm text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://www.linkedin.com/company/aprikos-venture/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="/investor-login"
            className="text-sm text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            Investor Login
          </a>
        </div>
      </div>
    </footer>
  );
}
