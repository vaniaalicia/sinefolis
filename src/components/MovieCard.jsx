import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import PosterArt from './PosterArt'

// Kartu film dengan efek: muncul saat di-scroll, miring 3D ikut mouse,
// glow warna film, kilau cahaya, dan tombol "Get tickets" yang naik saat hover.
export default function MovieCard({ movie, index = 0 }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 18 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 180, damping: 18 })

  function handleMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900, '--glow': `hsl(${movie.hue} 95% 60% / 0.55)` }}
    >
      <Link to={`/movie/${movie.id}`} className="group block">
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow duration-500 group-hover:shadow-[0_25px_70px_-20px_var(--glow)] group-hover:ring-white/25"
        >
          <PosterArt
            src={movie.poster}
            title={movie.title}
            hue={movie.hue}
            className="transition-transform duration-700 group-hover:scale-110"
          />

          {/* gelap di bawah biar tombol kebaca */}
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

          {/* kilau cahaya lewat saat hover */}
          <div className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/15 blur-sm transition-all duration-1000 group-hover:left-[130%]" />

          {/* rating & umur */}
          <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
              <span className="text-[#FFC94D]">★</span> {movie.rating}
            </span>
            {movie.age && (
              <span className="rounded-full border border-white/20 bg-black/30 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                {movie.age}
              </span>
            )}
          </div>

          {/* tombol muncul saat hover */}
          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex h-10 items-center justify-center rounded-full bg-linear-to-r from-brand to-hot text-xs font-bold tracking-wide shadow-[0_8px_30px_-6px_var(--color-hot)]">
              Get tickets
            </span>
          </div>
        </motion.div>

        <div className="mt-4 flex flex-col gap-1 px-1">
          <p className="truncate text-sm font-semibold transition-colors group-hover:text-white">{movie.title}</p>
          <p className="text-xs text-muted">
            {movie.genre} <span className="mx-1 text-white/20">/</span> {movie.duration || movie.year}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}