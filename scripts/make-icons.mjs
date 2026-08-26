import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i]
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function u32(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n)
  return b
}

function chunk(type, data) {
  const t = Buffer.from(type)
  return Buffer.concat([u32(data.length), t, data, u32(crc32(Buffer.concat([t, data])))])
}

function toPng(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h)
  for (let y = 0; y < h; y += 1) {
    const o = y * (w * 4 + 1)
    raw[o] = 0
    rgba.copy(raw, o + 1, y * w * 4, (y + 1) * w * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function mix(dst, i, r, g, b, a) {
  const inv = 1 - a
  dst[i] = Math.round(dst[i] * inv + r * a)
  dst[i + 1] = Math.round(dst[i + 1] * inv + g * a)
  dst[i + 2] = Math.round(dst[i + 2] * inv + b * a)
  dst[i + 3] = Math.max(dst[i + 3], Math.round(a * 255))
}

function roundedDist(x, y, size, radius) {
  const px = Math.abs(x - size / 2) - (size / 2 - radius)
  const py = Math.abs(y - size / 2) - (size / 2 - radius)
  const dx = Math.max(px, 0)
  const dy = Math.max(py, 0)
  return Math.hypot(dx, dy) + Math.min(Math.max(px, py), 0) - radius
}

function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t
  return (
    u * u * u * p0 +
    3 * u * u * t * p1 +
    3 * u * t * t * p2 +
    t * t * t * p3
  )
}

function stamp(rgba, size, x, y, radius, rgb) {
  const r0 = Math.max(0, Math.floor(x - radius - 1))
  const r1 = Math.min(size - 1, Math.ceil(x + radius + 1))
  const c0 = Math.max(0, Math.floor(y - radius - 1))
  const c1 = Math.min(size - 1, Math.ceil(y + radius + 1))
  for (let py = c0; py <= c1; py += 1) {
    for (let px = r0; px <= r1; px += 1) {
      const d = Math.hypot(px + 0.5 - x, py + 0.5 - y) - radius
      const a = Math.max(0, Math.min(1, 0.5 - d))
      if (a) mix(rgba, (py * size + px) * 4, rgb[0], rgb[1], rgb[2], a)
    }
  }
}

function strokePath(rgba, size, pts, width, rgb) {
  const radius = width / 2
  for (let i = 0; i < pts.length; i += 1) {
    stamp(rgba, size, pts[i][0], pts[i][1], radius, rgb)
    if (i === 0) continue
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const steps = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0)))
    for (let s = 1; s < steps; s += 1) {
      const t = s / steps
      stamp(rgba, size, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius, rgb)
    }
  }
}

function bezierPts(x0, y0, x1, y1, x2, y2, x3, y3, n = 24) {
  const pts = []
  for (let i = 0; i <= n; i += 1) {
    const t = i / n
    pts.push([
      cubic(x0, x1, x2, x3, t),
      cubic(y0, y1, y2, y3, t),
    ])
  }
  return pts
}

function drawIcon(size) {
  const rgba = Buffer.alloc(size * size * 4, 0)
  const radius = size * 0.25
  const ink = [245, 245, 245]
  const border = [42, 42, 42]

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const d = roundedDist(x + 0.5, y + 0.5, size, radius)
      const fill = Math.max(0, Math.min(1, 0.5 - d))
      const edge = Math.max(0, Math.min(1, 0.5 - Math.abs(d) + size * 0.012))
      mix(rgba, (y * size + x) * 4, 0, 0, 0, fill)
      mix(rgba, (y * size + x) * 4, border[0], border[1], border[2], edge * (1 - fill * 0.2))
    }
  }

  const s = size / 32
  const w = size * 0.078
  strokePath(
    rgba,
    size,
    [
      ...bezierPts(14.4 * s, 10.4 * s, 14.4 * s, 8.5 * s, 12.6 * s, 8.0 * s, 10.5 * s, 8.0 * s),
      ...bezierPts(10.5 * s, 8.0 * s, 8.2 * s, 8.0 * s, 6.8 * s, 9.2 * s, 6.8 * s, 11.3 * s),
      ...bezierPts(6.8 * s, 11.3 * s, 6.8 * s, 13.4 * s, 8.5 * s, 14.4 * s, 11.2 * s, 15.4 * s),
      ...bezierPts(11.2 * s, 15.4 * s, 13.8 * s, 16.4 * s, 15.4 * s, 17.6 * s, 15.4 * s, 20.4 * s),
      ...bezierPts(15.4 * s, 20.4 * s, 15.4 * s, 23.0 * s, 13.4 * s, 24.5 * s, 10.6 * s, 24.5 * s),
      ...bezierPts(10.6 * s, 24.5 * s, 8.2 * s, 24.5 * s, 6.6 * s, 23.2 * s, 6.6 * s, 21.2 * s),
    ],
    w,
    ink,
  )
  strokePath(
    rgba,
    size,
    [
      ...bezierPts(25.2 * s, 10.6 * s, 24.0 * s, 8.4 * s, 21.6 * s, 7.8 * s, 19.0 * s, 7.8 * s),
      ...bezierPts(19.0 * s, 7.8 * s, 15.0 * s, 7.8 * s, 12.6 * s, 10.6 * s, 12.6 * s, 16.2 * s),
      ...bezierPts(12.6 * s, 16.2 * s, 12.6 * s, 21.8 * s, 15.0 * s, 24.8 * s, 19.0 * s, 24.8 * s),
      ...bezierPts(19.0 * s, 24.8 * s, 21.6 * s, 24.8 * s, 24.0 * s, 24.2 * s, 25.2 * s, 22.0 * s),
    ],
    w,
    ink,
  )

  return rgba
}

function toIco(png32) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  const entry = Buffer.alloc(16)
  entry[0] = 32
  entry[1] = 32
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png32.length, 8)
  entry.writeUInt32LE(22, 12)
  return Buffer.concat([header, entry, png32])
}

const png32 = toPng(32, 32, drawIcon(32))
const png180 = toPng(180, 180, drawIcon(180))
const png192 = toPng(192, 192, drawIcon(192))
const png512 = toPng(512, 512, drawIcon(512))

writeFileSync(join(outDir, 'favicon-32x32.png'), png32)
writeFileSync(join(outDir, 'apple-touch-icon.png'), png180)
writeFileSync(join(outDir, 'icon-192.png'), png192)
writeFileSync(join(outDir, 'icon-512.png'), png512)
writeFileSync(join(outDir, 'favicon.ico'), toIco(png32))
console.log('wrote mobile favicon pngs')
