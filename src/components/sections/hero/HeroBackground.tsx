export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#141420] to-[#0c0c0c]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,147,94,0.04) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
