export default function Header({ employee }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <span className="text-accent font-bold text-lg tracking-tight leading-none">
          Mort Subite
        </span>
        <span className="text-border text-sm">|</span>
        <span className="text-muted text-sm">Training</span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-text leading-tight">{employee.name}</p>
          <p className="text-xs text-muted">{employee.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
          <span className="text-accent text-xs font-bold">{employee.initials}</span>
        </div>
      </div>
    </header>
  )
}
