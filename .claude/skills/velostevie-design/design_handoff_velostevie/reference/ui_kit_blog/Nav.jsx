function Nav({ current, go }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'routes', label: 'Routes' },
    { id: 'map', label: 'Map' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
  ];
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 10,
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px',
      background: 'rgba(246,241,231,0.88)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Logo size={22} onClick={() => go('home')} />
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {items.map(it => (
          <a key={it.id} href="#" onClick={(e) => { e.preventDefault(); go(it.id); }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 500,
              color: current === it.id ? 'var(--ink)' : 'var(--ink-soft)',
              textDecoration: current === it.id ? 'underline' : 'none',
              textUnderlineOffset: '0.35em',
              textDecorationThickness: 1,
              textDecorationColor: 'var(--clay)',
            }}>{it.label}</a>
        ))}
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ink-soft)', display: 'inline-flex' }} aria-label="RSS">
          <Icon name="rss" size={18} />
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      marginTop: 96,
      padding: '40px 40px 60px',
      borderTop: '1px solid var(--border)',
      background: 'var(--paper-deep)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <Logo size={20} />
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 13,
            color: 'var(--fg-muted)',
            margin: '14px 0 0 0',
            maxWidth: 380,
            lineHeight: 1.5,
          }}>
            Built on a kitchen table in Rennes. Route reports from bikes, tents, and wrong turns. <a href="#" style={{ color: 'var(--forest)' }}>RSS lives here.</a>
          </p>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          © 2026 · no cookies · no tracking
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer });
