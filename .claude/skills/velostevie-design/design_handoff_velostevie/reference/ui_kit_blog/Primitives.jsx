// Shared small UI bits
const { useState } = React;

function Eyebrow({ children, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 500,
      color: 'var(--fg-muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Logo({ size = 22, onClick }) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(); }} style={{
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontWeight: 600,
      fontSize: size,
      color: 'var(--ink)',
      letterSpacing: '-0.01em',
      lineHeight: 1,
      display: 'inline-block',
      textDecoration: 'underline',
      textDecorationColor: 'var(--clay)',
      textDecorationThickness: Math.max(1, Math.round(size / 14)) + 'px',
      textUnderlineOffset: '0.15em',
    }}>
      vélostevie
    </a>
  );
}

function Button({ variant = 'primary', icon, children, onClick, style }) {
  const [hover, setHover] = useState(false);
  const base = {
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 500,
    padding: '10px 18px',
    borderRadius: 4,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 200ms cubic-bezier(0.2,0.7,0.2,1)',
    textDecoration: 'none',
  };
  const variants = {
    primary: { background: hover ? 'var(--forest-deep)' : 'var(--forest)', color: 'var(--paper)' },
    secondary: { background: hover ? 'var(--ink)' : 'transparent', color: hover ? 'var(--paper)' : 'var(--ink)', borderColor: 'var(--ink)' },
    ghost: { background: 'transparent', color: hover ? 'var(--clay)' : 'var(--forest)', padding: '8px 0' },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {icon}
      {children}
    </button>
  );
}

function TagPill({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 500,
      padding: '5px 12px',
      border: 'none',
      borderRadius: 9999,
      cursor: 'pointer',
      background: active ? 'var(--forest)' : 'var(--paper-deep)',
      color: active ? 'var(--paper)' : 'var(--ink-soft)',
      transition: 'all 200ms',
    }}>{children}</button>
  );
}

function Icon({ name, size = 20 }) {
  const paths = {
    map: <g><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></g>,
    download: <g><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></g>,
    mountain: <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>,
    calendar: <g><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></g>,
    compass: <g><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></g>,
    arrowRight: <g><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></g>,
    search: <g><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></g>,
    rss: <g><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></g>,
    ruler: <path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4zM7.5 10.5l2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>,
    hotel: <g><path d="M2 20v-8a2 2 0 0 1 2-2h10a4 4 0 0 1 4 4v6"/><path d="M2 17h20"/><path d="M22 20v-3"/><circle cx="6" cy="12" r="1.5"/></g>,
    bed: <g><path d="M2 20v-8a2 2 0 0 1 2-2h10a4 4 0 0 1 4 4v6"/><path d="M2 17h20"/><path d="M22 20v-3"/><circle cx="6" cy="12" r="1.5"/></g>,
    tent: <g><path d="M3.5 21 12 3l8.5 18"/><path d="M12 3v18"/><path d="M3.5 21h17"/></g>,
    coffee: <g><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

Object.assign(window, { Eyebrow, Logo, Button, TagPill, Icon });
