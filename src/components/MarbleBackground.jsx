export default function MarbleBackground({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden min-h-[520px] ${className}`} style={{ contain: "layout" }}>
      {/* Marble image background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://i.ibb.co/fVXTHn7M/logan-voss-Jp-NKV9-a-Om4-unsplash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Soft cream overlay for readability - luxury filter */}
      <div className="absolute inset-0 bg-[#FDFBF7]/60 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/20 pointer-events-none" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
