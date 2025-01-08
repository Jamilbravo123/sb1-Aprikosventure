import React from 'react';

export default function ContactHeader() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-block">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-[#0B2545] to-[#051428] bg-clip-text text-transparent">
          Ready to Build Something Amazing?
        </h2>
        <div className="h-1 w-full bg-gradient-to-r from-[#0B2545] to-[#051428] rounded-full mt-2" />
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        Whether you're a founder with a groundbreaking idea or an investor looking to partner, we'd love to hear from you.
      </p>
    </div>
  );
}