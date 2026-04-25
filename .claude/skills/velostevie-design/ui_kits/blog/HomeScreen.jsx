function HomeScreen({ go }) {
  const hero = SAMPLE_ROUTES[0];
  const recent = SAMPLE_ROUTES.slice(0, 4);
  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 40px 32px' }}>
        <Eyebrow>Latest route report · {hero.country}</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: 84,
          letterSpacing: '-0.025em',
          lineHeight: 1.02,
          margin: '12px 0 20px 0',
          color: 'var(--ink)',
          maxWidth: 900,
        }}>{hero.title}</h1>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 22,
          lineHeight: 1.45,
          color: 'var(--ink-soft)',
          maxWidth: 640,
          margin: 0,
        }}>
          I rode into Roscoff on the ferry at 6am, ate a croissant that changed my life, and pointed the bike south.
        </p>
        <div style={{ marginTop: 28, display: 'flex', gap: 14, alignItems: 'center' }}>
          <Button variant="primary" onClick={() => go('report')}>Read the report</Button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {hero.distance} km · {hero.elevation} m · {hero.days} days
          </span>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px 40px' }}>
        <Placeholder seed={hero.seed} ratio="21/9" />
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-muted)', marginTop: 10 }}>
          Morlaix viaduct, morning. Day one.
        </div>
      </div>

      {/* Recent */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 32, margin: 0, letterSpacing: '-0.01em' }}>
            Recent route reports
          </h2>
          <a href="#" onClick={(e) => { e.preventDefault(); go('routes'); }} style={{
            fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--forest)',
          }}>All routes →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {recent.map(r => <RouteCard key={r.id} route={r} onClick={() => go('report')} />)}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { HomeScreen });
