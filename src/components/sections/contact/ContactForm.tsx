interface ContactFormProps {
  formRef: React.RefObject<HTMLFormElement>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ContactForm({ formRef, isSubmitting, handleSubmit }: ContactFormProps) {
  const inputClasses = 'block w-full rounded-lg border-0 py-2.5 px-4 bg-[#0c0c0c]/50 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-[#C9935E]/50 sm:text-sm sm:leading-6 transition-colors';

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-300">
          Name
        </label>
        <div className="mt-2">
          <input type="text" name="name" id="name" required className={inputClasses} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-300">
          Email
        </label>
        <div className="mt-2">
          <input type="email" name="email" id="email" required className={inputClasses} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium leading-6 text-slate-300">
          Message
        </label>
        <div className="mt-2">
          <textarea name="message" id="message" rows={4} required className={inputClasses} />
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gradient-to-r from-[#C9935E] to-[#E8C896] px-6 py-3 text-center text-sm font-semibold text-[#0c0c0c] shadow-sm hover:from-[#E8C896] hover:to-[#C9935E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9935E] transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
