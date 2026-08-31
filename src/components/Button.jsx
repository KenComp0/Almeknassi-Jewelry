import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-inter font-medium tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-accent/50";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-accent hover:text-white border border-primary hover:border-accent",
    secondary:
      "bg-white text-primary border border-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-primary hover:text-accent",
    gold: "bg-accent text-white hover:bg-black border border-accent hover:border-black",
  };

  const sizes = {
    sm: "text-xs px-6 py-2.5 uppercase tracking-[0.15em]",
    md: "text-sm px-8 py-3.5 uppercase tracking-[0.12em]",
    lg: "text-sm px-10 py-4 uppercase tracking-[0.14em]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
