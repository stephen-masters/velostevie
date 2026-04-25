function ReportScreen({ go }) {
  const r = SAMPLE_ROUTES[0];
  return (
    <article>
      {/* Article header */}
      <header style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 40px 32px' }}>
        <Eyebrow>Route report · {r.country} · {r.region}</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: 72,
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          margin: '12px 0 20px 0',
          maxWidth: 900,
        }}>{r.title}</h1>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 22,
          lineHeight: 1.45,
          color: 'var(--ink-soft)',
          maxWidth: 640,
          margin: 0,
        }}>
          Four days, two ferries, one borrowed tent. A loop from Roscoff to Quimper, mostly by the coast.
        </p>
      </header>

      {/* Hero photo */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
        <Placeholder seed={0} ratio="21/9" />
      </div>

      {/* Stat block */}
      <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 40px' }}>
        <StatBlock distance="237" elevation="3,420" days="4" surface="mixed" />
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <Button variant="primary" icon={<Icon name="download" size={16} />}>Download GPX</Button>
          <Button variant="secondary" icon={<Icon name="map" size={16} />}>Open in komoot</Button>
        </div>
      </div>

      {/* Prose */}
      <div style={{ maxWidth: 680, margin: '72px auto 0', padding: '0 40px' }} className="prose">
        <p style={{ fontSize: 18, lineHeight: 1.65, margin: '0 0 18px 0' }}>
          The ferry docked at Roscoff an hour early, which meant the café I'd been thinking about for three weeks was still shut. I ate a croissant from the bakery on the quay instead. It changed my life. Maybe it was the salt in the air. Maybe it was just the relief of being off the boat.
        </p>
        <p style={{ fontSize: 18, lineHeight: 1.65, margin: '0 0 18px 0' }}>
          The plan, loosely: follow the coast south-west to Pointe Saint-Mathieu, cut inland through the Monts d'Arrée, then back up to the ferry in four days. No reservations. I'd find somewhere to pitch when I ran out of legs.
        </p>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 28, margin: '48px 0 12px', letterSpacing: '-0.01em' }}>Day 1 — Roscoff to Plouescat</h2>
        <p style={{ fontSize: 18, lineHeight: 1.65, margin: '0 0 18px 0' }}>
          54 km of easy coastal path, most of it on the GR34. The tent stayed in the bag — a municipal campsite in Plouescat charged me €6 and gave me a key to the showers. I ate mussels. I had a small cider. I was asleep by nine.
        </p>

        <PullQuote source="Day 2 · somewhere past Morlaix">
          The tent leaked. It always leaks. I bring it anyway.
        </PullQuote>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 28, margin: '48px 0 12px', letterSpacing: '-0.01em' }}>The map</h2>
        <p style={{ fontSize: 18, lineHeight: 1.65, margin: '0 0 18px 0' }}>
          Full route below. GPX at the top of the page. Start is forest green, end is terracotta — habit from years of coloured string on paper maps.
        </p>
      </div>

      {/* Map */}
      <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 40px' }}>
        <MapEmbed routePath="coastal" height={420} />
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1200, margin: '80px auto 0', padding: '0 40px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: 28, margin: '0 0 20px', letterSpacing: '-0.01em' }}>Photos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[0, 3, 5, 1, 2, 4].map(s => (
            <div key={s}>
              <Placeholder seed={s} ratio="4/3" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { ReportScreen });
