export default function AuroraText({ children, className = '' }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#D9541E] via-[#f59e0b] to-[#b84010] bg-[length:200%_auto] font-extrabold tracking-tight animate-aurora ${className}`}
    >
      {children}
    </span>
  )
}
