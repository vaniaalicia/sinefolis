import { useState } from 'react'

// Gambar poster/backdrop.
// Selalu ada latar warna (sesuai "hue" film) di belakang, lalu foto asli muncul perlahan
// begitu selesai dimuat → tidak ada kotak kosong/kedip saat loading.
// eager = gambar penting di layar pertama (hero), dimuat duluan.
export default function PosterArt({ src, title, hue = 0, className = '', eager = false }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `
          radial-gradient(circle at 25% 15%, hsl(${hue} 95% 62% / 0.65), transparent 55%),
          radial-gradient(circle at 85% 90%, hsl(${(hue + 50) % 360} 90% 55% / 0.45), transparent 50%),
          linear-gradient(160deg, hsl(${hue} 55% 18%), hsl(${(hue + 40) % 360} 60% 6%))`,
      }}
    >
      {!src && (
        <>
          <div className="bg-grid absolute inset-0 opacity-60" />
          {title && (
            <span className="absolute bottom-3 left-3 right-3 font-display text-[11px] uppercase leading-tight tracking-wider text-white/35">
              {title}
            </span>
          )}
        </>
      )}

      {src && (
        <img
          src={src}
          alt={title ? `Poster ${title}` : ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}