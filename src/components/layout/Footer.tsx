import { Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0c]">
      {/* Copper gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9935E]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="md:order-1">
          <p className="text-center md:text-left text-sm leading-5 text-slate-400">
            &copy; {new Date().getFullYear()} Aprikos Venture AS
          </p>
          <p className="mt-1 text-center md:text-left text-xs leading-5 text-slate-500">
            Org. no. 926 056 743 MVA · Nordalveien 8B, 0580 Oslo, Norway
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
            href="/styret"
            className="text-sm text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            Styreportal
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
            href="https://www.instagram.com/aprikosventure/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[#C9935E] transition-colors"
          >
            <span className="sr-only">Instagram</span>
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
        <p className="text-center md:text-left text-[11px] leading-5 text-slate-500 max-w-4xl">
          Information on this website is general information about Aprikos Venture and its portfolio companies. It is not
          investment advice and does not constitute an offer to sell, or a solicitation of an offer to buy, any securities,
          crypto-assets or other financial instruments. Crypto-assets carry a high risk of loss. Tokenized instruments
          referred to on this site are available to professional investors only, where permitted by applicable law.
        </p>
      </div>
    </footer>
  );
}
