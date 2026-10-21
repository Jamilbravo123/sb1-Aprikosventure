import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LAST_UPDATED = '21 October 2026';

const sections = [
  {
    title: 'Who we are',
    body: [
      'Aprikos Venture AS (org. no. 926 056 743, Nordalveien 8B, 0580 Oslo, Norway) is the controller for the personal data described in this notice. Questions about privacy can be sent to contact@aprikosventure.com.',
    ],
  },
  {
    title: 'What we collect and why',
    body: [
      'Contact form: your name, email address and message. We use this to answer your enquiry. Legal basis: our legitimate interest in responding to people who contact us (GDPR art. 6(1)(f)).',
      'Investor pre-registration: name, email, phone, company, country, investor type, areas of interest and indicative commitment range. We use this to keep you informed about investment opportunities and to follow up on your interest. Legal basis: your request and consent (art. 6(1)(a) and (b)). You can withdraw consent at any time.',
      'Sign-in to restricted areas (investor material and board portal): your email address and a session token stored in your browser. This is strictly necessary to provide the service you ask for.',
      'Technical data: our hosting provider processes your IP address and basic request data in server logs to deliver and protect the website.',
    ],
  },
  {
    title: 'Cookies and tracking',
    body: [
      'We do not use advertising or analytics cookies. Signed-in areas store a session token in your browser’s local storage, which is required for the sign-in to work. Web fonts are loaded from Google Fonts, which means your IP address is sent to Google when the page loads.',
    ],
  },
  {
    title: 'Processors and transfers',
    body: [
      'We use the following service providers to run this website: Netlify (hosting), Supabase (database and sign-in, hosted in the EU, Ireland), EmailJS (delivery of contact form messages), Microsoft 365 (email) and Google Fonts. Where a provider processes data outside the EU/EEA, the transfer is based on the EU Standard Contractual Clauses or an adequacy decision.',
    ],
  },
  {
    title: 'How long we keep data',
    body: [
      'Contact enquiries are kept for as long as needed to follow up, and no longer than 24 months after the last contact. Investor pre-registrations are kept until you ask us to delete them or withdraw consent, and are reviewed at least every 24 months. Server logs are kept by our hosting provider for a limited period.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'You have the right to access, correct and delete your personal data, to restrict or object to processing, and to data portability. To use these rights, email contact@aprikosventure.com. If you believe we process your data unlawfully, you can complain to the Norwegian Data Protection Authority (Datatilsynet, datatilsynet.no).',
    ],
  },
];

export default function Privacy() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Privacy Notice | Aprikos Venture';
    return () => { document.title = previous; };
  }, []);

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#C9935E] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Aprikos Venture
        </Link>

        <h1 className="mt-10 font-display text-4xl font-bold text-white">Privacy Notice</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-white">{section.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-7">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
