import React from 'react';

interface ContactFormProps {
  formRef: React.RefObject<HTMLFormElement>;
  isSubmitting: boolean;
}

export default function ContactForm({ formRef, isSubmitting }: ContactFormProps) {
  return (
    <form ref={formRef} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">
          Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            id="name"
            required
            className="block w-full rounded-lg border-0 py-2 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0B2545] sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
          Email
        </label>
        <div className="mt-2">
          <input
            type="email"
            name="email"
            id="email"
            required
            className="block w-full rounded-lg border-0 py-2 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0B2545] sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium leading-6 text-slate-900">
          Message
        </label>
        <div className="mt-2">
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            className="block w-full rounded-lg border-0 py-2 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0B2545] sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gradient-to-r from-[#0B2545] to-[#051428] px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:from-[#051428] hover:to-[#0B2545] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2545] transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}