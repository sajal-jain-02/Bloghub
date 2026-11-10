export default function AuroraText({ children, className = '' }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-crimson via-[#ff6b8b] to-crimson bg-[length:200%_auto] font-extrabold tracking-tight animate-aurora ${className}`}
    >
      {children}
    </span>
  )
}
