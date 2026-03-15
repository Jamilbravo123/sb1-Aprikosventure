export default function CodeEntropyStrip() {
  return (
    <div className="flex items-center justify-center gap-2.5 pt-7">
      <div className="w-10 h-px bg-gradient-to-r from-transparent to-gold/15" />
      <p className="text-[#444] text-[11px] tracking-wider">
        Powered by{' '}
        <a
          href="https://codentropy.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold font-medium hover:text-gold-light transition-colors"
        >
          Code Entropy
        </a>
        {' '}&mdash; AI-first studio &middot; Lahore / Oslo
      </p>
      <div className="w-10 h-px bg-gradient-to-l from-transparent to-gold/15" />
    </div>
  );
}
