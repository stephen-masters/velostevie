function RoutesScreen({ go }) {
  const [country, setCountry] = useState('All');
  const [surface, setSurface] = useState('All');
  const countries = ['All', ...Array.from(new Set(SAMPLE_ROUTES.map(r => r.country)))];
  const surfaces = ['All', 'paved', 'gravel', 'mixed'];
  const filtered = SAMPLE_ROUTES.filter(r =>
    (country === 'All' || r.country === country) &&
    (surface === 'All' || r.surface === surface)
  );
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 40px 0' }}>
      <Eyebrow>Index</Eyebrow>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 60, margin: '12px 0 10px', letterSpacing: '-0.02em' }}>
        Every route, so far
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)', maxWidth: 520, margin: '0 0 40px' }}>
        {SAMPLE_ROUTES.length} trips. Roughly {SAMPLE_ROUTES.reduce((a, r) => a + r.distance, 0).toLocaleString()} km of riding.
      </p>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', paddingBottom: 24, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>Country</span>
          {countries.map(c => <TagPill key={c} active={country === c} onClick={() => setCountry(c)}>{c}</TagPill>)}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 8 }}>Surface</span>
          {surfaces.map(s => <TagPill key={s} active={surface === s} onClick={() => setSurface(s)}>{s}</TagPill>)}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 48 }}>
        {filtered.map(r => <RouteCard key={r.id} route={r} onClick={() => go('report')} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--fg-muted)' }}>
          No routes match. Try loosening a filter.
        </div>
      )}
    </div>
  );
}

function MapScreen({ go }) {
  // Scatter pins for each route
  const pins = [
    { x: 240, y: 160 }, // France
    { x: 260, y: 90 },  // Scotland
    { x: 220, y: 220 }, // Spain
    { x: 270, y: 140 }, // England
    { x: 340, y: 80 },  // Denmark
    { x: 290, y: 190 }, // Vercors
  ];
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 40px 0' }}>
      <Eyebrow>Everywhere</Eyebrow>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 60, margin: '12px 0 10px', letterSpacing: '-0.02em' }}>
        The map of it all
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)', maxWidth: 600, margin: '0 0 40px' }}>
        Every trip on one map. Click a pin to jump to the report.
      </p>
      <MapEmbed height={560} showRoute={false} pins={pins} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
        {SAMPLE_ROUTES.map(r => (
          <a key={r.id} href="#" onClick={(e) => { e.preventDefault(); go('report'); }} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            padding: '14px 0', borderTop: '1px solid var(--border)',
            textDecoration: 'none', color: 'inherit',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--forest)', border: '2px solid var(--paper)', boxShadow: '0 0 0 1px var(--border)' }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 17 }}>{r.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                {r.country} · {r.distance} km · {r.date}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function GalleryScreen({ go }) {
  // Build a 12-image varied grid
  const tiles = [];
  for (let i = 0; i < 14; i++) tiles.push(i);
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 40px 0' }}>
      <Eyebrow>Photographs</Eyebrow>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 60, margin: '12px 0 10px', letterSpacing: '-0.02em' }}>
        Things I saw
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)', maxWidth: 600, margin: '0 0 40px' }}>
        Landscapes, bikes, food, road signs. Mostly in that order.
      </p>
      <div style={{
        columnCount: 3, columnGap: 16,
      }}>
        {tiles.map(i => (
          <div key={i} style={{ breakInside: 'avoid', marginBottom: 16 }}>
            <Placeholder seed={i} ratio={i % 3 === 0 ? '4/5' : i % 4 === 0 ? '3/2' : '1/1'} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutScreen() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 40px 0' }} className="prose">
      <Eyebrow>About</Eyebrow>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 60, margin: '12px 0 20px', letterSpacing: '-0.02em' }}>
        Hello.
      </h1>
      <p style={{ fontSize: 18, lineHeight: 1.65 }}>
        I'm Steve. I ride bikes for longer than is sensible and then write about it here. This site is mostly route reports — what I did, where I slept, what went wrong — plus GPX files in case any of it is useful to you.
      </p>
      <p style={{ fontSize: 18, lineHeight: 1.65 }}>
        No ads, no tracking, no newsletter. If you want to follow along, <a href="#">the RSS feed lives here</a>.
      </p>
    </div>
  );
}

Object.assign(window, { RoutesScreen, MapScreen, GalleryScreen, AboutScreen });
