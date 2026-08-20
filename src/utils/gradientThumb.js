export function gradientThumb({ from, to, label = '' }) {
  const initials = label
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="440" viewBox="0 0 800 440">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
        <radialGradient id="h" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="440" fill="url(#g)"/>
      <rect width="800" height="440" fill="url(#h)"/>
      <g fill="none" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1.5">
        ${Array.from({ length: 5 }, (_, r) => `<line x1="0" y1="${r * 110}" x2="800" y2="${r * 110}"/>`).join('')}
        ${Array.from({ length: 8 }, (_, c) => `<line x1="${c * 114}" y1="0" x2="${c * 114}" y2="440"/>`).join('')}
      </g>
      <g fill="#ffffff" fill-opacity="0.5">
        ${Array.from({ length: 9 }, (_, i) => {
          const x = (i * 97) % 800
          const y = (i * 173) % 440
          return `<circle cx="${x}" cy="${y}" r="${i % 2 ? 3 : 5}"/>`
        }).join('')}
      </g>
      <text x="40" y="180" font-family="Arial, sans-serif" font-weight="bold" font-size="56" fill="#ffffff" fill-opacity="0.92">${initials}</text>
      <text x="40" y="222" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" fill-opacity="0.65">PROJECT</text>
    </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
