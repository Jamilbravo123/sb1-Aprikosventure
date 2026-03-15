import codeEntropyLogo from '../../../assets/images/code-entropy-logo.webp';

export default function CodeEntropyStrip() {
  return (
    <div className="flex flex-col items-center gap-3 pt-12 pb-4">
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="flex items-center gap-3">
        <span className="text-[#555] text-[13px] tracking-wide">Powered by</span>
        <a
          href="https://codentropy.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={codeEntropyLogo}
            alt="Code Entropy"
            className="h-5 w-auto object-contain"
          />
        </a>
        <span className="text-[#333]">·</span>
        <span className="text-[#555] text-[13px] tracking-wide">AI-first studio · Lahore</span>
      </div>
    </div>
  );
}
