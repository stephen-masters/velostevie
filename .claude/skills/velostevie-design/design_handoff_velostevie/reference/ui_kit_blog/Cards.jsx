// Photo placeholder: soft landscape-ish gradient with photo-like composition
function Placeholder({ seed = 0, ratio = '3/2', style }) {
  // Deterministic "photo" palettes keyed to seed
  const palettes = [
    ['#6B8A6E', '#2F4A3A', '#1F1B17'], // forest
    ['#C8C0B0', '#8B8579', '#3A342D'], // stone
    ['#B85C3C', '#8B8579', '#2F4A3A'], // sunset over hills
    ['#8FA584', '#6B8A6E', '#24392D'], // valley
    ['#D9C8A8', '#B85C3C', '#6B4A3A'], // clay roads
    ['#A0B5A8', '#4A6B5A', '#1F1B17'], // coastal
  ];
  const p = palettes[seed % palettes.length];
  const bg = `linear-gradient(180deg, ${p[0]} 0%, ${p[1]} 55%, ${p[2]} 100%)`;
  const overlay = `radial-gradient(ellipse 60% 40% at 30% 20%, rgba(246,241,231,0.30), transparent 60%), radial-gradient(ellipse 50% 30% at 75% 80%, rgba(31,27,23,0.25), transparent 70%)`;
  return (
    <div style={{
      width: '100%', aspectRatio: ratio,
      backgroundImage: `${overlay}, ${bg}`,
      position: 'relative', overflow: 'hidden',
      ...style,
    }} />
  );
}

function RouteCard({ route, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
       onMouseEnter={() => setHover(true)}
       onMouseLeave={() => setHover(false)}
       style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          transition: 'transform 400ms cubic-bezier(0.2,0.7,0.2,1)',
          transform: hover ? 'scale(1.03)' : 'scale(1)',
        }}>
          <Placeholder seed={route.seed} />
        </div>
      </div>
      <Eyebrow style={{ marginTop: 14 }}>Route report · {route.country}</Eyebrow>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
        margin: '6px 0 8px 0',
        color: 'var(--ink)',
      }}>{route.title}</h3>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontVariantNumeric: 'tabular-nums',
      }}>{route.distance} km · {route.elevation} m · {route.date}</div>
    </a>
  );
}

function StatBlock({ distance, elevation, days, surface }) {
  const cells = [
    { k: 'Distance', v: distance, u: 'km' },
    { k: 'Elevation', v: elevation, u: 'm' },
    { k: 'Days', v: days, u: '' },
    { k: 'Surface', v: surface, u: '', small: true },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--paper)',
    }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          padding: '20px 22px',
          borderRight: i < 3 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--fg-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>{c.k}</div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            fontSize: c.small ? 20 : 32,
            color: 'var(--ink)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}>
            {c.v}
            {c.u && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)', marginLeft: 4, fontWeight: 400 }}>{c.u}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PullQuote({ children, source }) {
  return (
    <blockquote style={{
      borderLeft: '2px solid var(--clay)',
      margin: '40px 0',
      padding: '0 0 0 24px',
    }}>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontSize: 24,
        lineHeight: 1.4,
        color: 'var(--ink-soft)',
        margin: 0,
      }}>{children}</p>
      {source && <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: 12,
      }}>{source}</div>}
    </blockquote>
  );
}

Object.assign(window, { Placeholder, RouteCard, StatBlock, PullQuote });
