// Faked map canvas — not a real tile map. Stylized cream tiles + clay route + pins.
function MapEmbed({ routePath = 'default', height = 360, showRoute = true, pins = [], style }) {
  // A few pre-baked route paths (SVG d attrs) so multiple instances look distinct
  const paths = {
    default: "M 60 240 Q 120 200 170 220 T 280 180 T 400 200 T 540 160 T 680 220 T 820 180",
    coastal: "M 40 100 Q 120 160 200 140 T 360 180 T 500 220 T 660 180 T 820 260",
    highlands: "M 80 280 Q 180 240 260 260 T 400 200 T 520 240 T 680 180 T 820 200",
  };
  const d = paths[routePath] || paths.default;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      background: '#E8E0CD',
      overflow: 'hidden',
      ...style,
    }}>
      {/* Pseudo contour tiles */}
      <svg width="100%" height="100%" viewBox="0 0 880 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="contours" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40 Q 30 10, 60 40 T 120 40" stroke="#D1C6A8" strokeWidth="0.6" fill="none"/>
            <path d="M0 60 Q 30 30, 60 60 T 120 60" stroke="#D1C6A8" strokeWidth="0.6" fill="none"/>
            <path d="M0 20 Q 30 50, 60 20 T 120 20" stroke="#D1C6A8" strokeWidth="0.6" fill="none"/>
          </pattern>
          <pattern id="green" x="-20" y="40" width="200" height="140" patternUnits="userSpaceOnUse">
            <ellipse cx="60" cy="60" rx="70" ry="36" fill="#C9D3B8" opacity="0.55"/>
          </pattern>
          <pattern id="water" x="100" y="-60" width="400" height="300" patternUnits="userSpaceOnUse">
            <ellipse cx="120" cy="140" rx="130" ry="60" fill="#BBCCD6" opacity="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#green)"/>
        <rect width="100%" height="100%" fill="url(#water)"/>
        <rect width="100%" height="100%" fill="url(#contours)"/>
        {/* Subtle roads */}
        <path d="M 0 120 L 880 140" stroke="#C8C0B0" strokeWidth="1" fill="none"/>
        <path d="M 200 0 L 220 400" stroke="#C8C0B0" strokeWidth="1" fill="none"/>
        <path d="M 0 300 L 880 320" stroke="#C8C0B0" strokeWidth="1" fill="none"/>

        {showRoute && (
          <>
            <path d={d} stroke="#B85C3C" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="1 0"/>
            {/* start pin */}
            <circle cx="60" cy="240" r="7" fill="#2F4A3A" stroke="#F6F1E7" strokeWidth="2.5"/>
            {/* end pin */}
            <circle cx="820" cy="180" r="7" fill="#B85C3C" stroke="#F6F1E7" strokeWidth="2.5"/>
          </>
        )}

        {/* World-map mode: extra pins */}
        {pins.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="#2F4A3A" stroke="#F6F1E7" strokeWidth="2"/>
        ))}
      </svg>

      {/* Attribution + zoom stub */}
      <div style={{
        position: 'absolute', bottom: 8, right: 10,
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'rgba(31,27,23,0.55)', letterSpacing: '0.02em',
      }}>© OpenStreetMap contributors</div>
      <div style={{
        position: 'absolute', top: 12, left: 12,
        display: 'flex', flexDirection: 'column',
        background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 4,
      }}>
        <button style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-sans)' }}>+</button>
        <button style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>−</button>
      </div>
    </div>
  );
}

Object.assign(window, { MapEmbed });
