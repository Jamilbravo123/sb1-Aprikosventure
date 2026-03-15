export default function CopperDivider() {
  return (
    <div className="relative hidden lg:block">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(201,147,94,0.15) 10%, rgba(201,147,94,0.45) 50%, rgba(201,147,94,0.15) 90%, transparent 100%)',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-gold shadow-[0_0_16px_rgba(201,147,94,0.5)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-gold/20 animate-pulse-ring" />
    </div>
  );
}
