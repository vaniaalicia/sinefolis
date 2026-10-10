// Gambar poster. Kalau belum ada gambar asli (sebelum TMDB), tampilkan
// placeholder berwarna sesuai "hue" film supaya halaman tetap hidup.
export default function PosterArt({ src, title, hue = 0, className = '' }) {
  if (src) {
    return <img src={src} alt={`Poster ${title}`} className={`h-full w-full object-cover ${className}`} />
  }

  return (
    <div
      className={`relative h-full w-full ${className}`}
      style={{
        background: `
          radial-gradient(circle at 25% 15%, hsl(${hue} 95% 62% / 0.65), transparent 55%),
          radial-gradient(circle at 85% 90%, hsl(${(hue + 50) % 360} 90% 55% / 0.45), transparent 50%),
          linear-gradient(160deg, hsl(${hue} 55% 18%), hsl(${(hue + 40) % 360} 60% 6%))`,
      }}
    >
      <div className="bg-grid absolute inset-0 opacity-60" />
      <span className="absolute bottom-3 left-3 right-3 font-display text-[11px] uppercase leading-tight tracking-wider text-white/35">
        {title}
      </span>
    </div>
  )
}
