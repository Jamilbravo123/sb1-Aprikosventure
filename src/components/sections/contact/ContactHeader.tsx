export default function ContactHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm uppercase tracking-[0.25em] text-[#C9935E] mb-4">Contact</p>
      <div className="inline-block">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
          Let's Build Together
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C9935E] to-transparent rounded-full mt-3" />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-400">
        Founder, investor, or future partner? We'd love to hear from you.
      </p>
    </div>
  );
}
