export default function Section({
  children,
  className = "",
  container = true,
  padding = "py-20", // 80px vertical
  id,
}) {
  return (
    <section id={id} className={`${padding} ${className}`}>
      <div className={container ? "container-luxury" : ""}>{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, centered = true, light = false }) {
  return (
    <div className={`${centered ? "text-center mx-auto" : ""} max-w-2xl mb-12`}>
      {eyebrow && (
        <p className={`text-xs tracking-[0.25em] uppercase mb-3 ${light ? "text-white/70" : "text-accent"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-playfair text-3xl md:text-4xl font-medium leading-tight ${light ? "text-white" : "text-primary"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-[15px] leading-relaxed ${light ? "text-white/80" : "text-secondary"}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-px w-12 mx-auto ${light ? "bg-white/30" : "bg-accent"}`} />
    </div>
  );
}
