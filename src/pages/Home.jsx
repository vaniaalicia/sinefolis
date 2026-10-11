import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import MovieCard from '../components/MovieCard'
import PosterArt from '../components/PosterArt'
import ReviewsSection from '../components/ReviewsSection'
import { AdCarousel, PromoCard } from '../components/Promo'
import { ads, promos, cinemaList } from '../data/dummy'
import { useHomeMovies } from '../hooks/useTmdb'

const ease = [0.22, 1, 0.36, 1]
const SLIDE_MS = 6000

export default function Home() {
  // data film: dari TMDB (kalau berhasil dimuat) atau dummy
  const { featured, nowShowing, topRated, comingSoon } = useHomeMovies()

  return (
    <main className="relative overflow-x-clip">
      {featured.length ? <Hero featured={featured} /> : <HeroSkeleton />}
      <NowShowing now={nowShowing} top={topRated} />
      <Cinemas firstId={nowShowing[0]?.id} />
      <Deals />
      <ComingSoon items={comingSoon} />
      <ReviewsSection />
    </main>
  )
}

/* =========================================================
   KERANGKA LOADING (tampil sebentar saat data pertama kali dimuat)
   ========================================================= */
function HeroSkeleton() {
  return (
    <section className="relative h-[100svh] min-h-[680px] overflow-hidden bg-surface">
      <div className="mx-auto flex h-full max-w-[1280px] flex-col justify-center gap-6 px-6 md:px-12">
        <div className="h-7 w-40 animate-pulse rounded-full bg-white/[0.07]" />
        <div className="h-14 w-full max-w-[560px] animate-pulse rounded-2xl bg-white/[0.07]" />
        <div className="h-5 w-72 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-16 w-full max-w-[460px] animate-pulse rounded-2xl bg-white/[0.05]" />
        <div className="flex gap-3">
          <div className="h-13 w-40 animate-pulse rounded-full bg-white/[0.07]" />
          <div className="h-13 w-44 animate-pulse rounded-full bg-white/[0.05]" />
        </div>
      </div>
    </section>
  )
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.06]" />
      <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/[0.04]" />
    </div>
  )
}

/* =========================================================
   HERO — slide otomatis, teks muncul bertahap, background bergerak
   ========================================================= */
function Hero({ featured }) {
  const [i, setI] = useState(0)
  const movie = featured[i % featured.length]
  const ref = useRef(null)
  const navigate = useNavigate()

  // efek parallax: saat di-scroll, isi hero bergerak lebih lambat & memudar
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // ganti slide tiap 6 detik
  useEffect(() => {
    const t = setTimeout(() => setI((n) => (n + 1) % featured.length), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i])

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden">
      {/* background film (crossfade + zoom pelan) */}
      <AnimatePresence>
        <motion.div
          key={movie.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }}
        >
          <PosterArt src={movie.backdrop} title="" hue={movie.hue} eager />
        </motion.div>
      </AnimatePresence>

      {/* cahaya aurora yang bergerak */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] animate-aurora rounded-full bg-hot/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[460px] w-[460px] animate-aurora rounded-full bg-violet/30 blur-[120px] [animation-delay:-8s]" />

      {/* lapisan gelap */}
      <div className="absolute inset-0 bg-linear-to-r from-ink via-ink/70 to-ink/10" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/50" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto grid h-full max-w-[1280px] content-center items-center gap-12 px-6 py-24 md:px-12 lg:grid-cols-[1fr_300px]"
      >
        {/* teks utama */}
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              show: { transition: { staggerChildren: 0.09 } },
              exit: { opacity: 0, y: -20, transition: { duration: 0.35 } },
            }}
            className="flex max-w-[720px] flex-col gap-6"
          >
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-hot shadow-[0_0_10px_var(--color-hot)]" />
                {movie.tagline}
              </span>
            </Reveal>

            <Reveal>
              <h1 className="font-display text-4xl font-semibold uppercase leading-[1] tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-[#FFC94D]/15 px-3 py-1 text-xs font-bold text-[#FFC94D]">
                  ★ {movie.rating}
                </span>
                {[movie.age, ...movie.genres, movie.year, movie.duration].filter(Boolean).map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-md">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <p className="max-w-[460px] text-[15px] leading-relaxed text-white/65">{movie.overview}</p>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={`/movie/${movie.id}`}
                    className="flex h-13 items-center gap-2 rounded-full bg-linear-to-r from-brand via-hot to-violet px-7 text-sm font-bold shadow-[0_0_50px_-8px_var(--color-hot)]"
                  >
                    Get tickets <span aria-hidden>→</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/movie/${movie.id}?trailer=1`)}
                  className="flex h-13 items-center gap-3 rounded-full border border-white/15 bg-white/5 pl-2 pr-6 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                  </span>
                  Watch trailer
                </motion.button>
              </div>
            </Reveal>
          </motion.div>
        </AnimatePresence>

        {/* daftar slide di kanan (desktop) */}
        <div className="hidden flex-col gap-3 lg:flex">
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Featured</span>
          {featured.map((f, idx) => {
            const active = idx === i % featured.length
            return (
              <button
                key={f.id}
                onClick={() => setI(idx)}
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border p-2.5 text-left transition-all duration-500 ${
                  active ? 'border-white/20 bg-white/10 backdrop-blur-md' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg">
                  <PosterArt src={f.poster} title="" hue={f.hue} />
                </div>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${active ? 'text-white' : 'text-white/60'}`}>{f.title}</p>
                  <p className="text-xs text-white/40">{[f.genres[0], f.duration || f.year].filter(Boolean).join(' · ')}</p>
                </div>
                {/* progress bar slide */}
                {active && (
                  <motion.span
                    key={`bar-${i}`}
                    className="absolute bottom-0 left-0 h-[2px] bg-linear-to-r from-brand to-violet"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* indikator scroll */}
      <div className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 md:flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-white"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </div>
    </section>
  )
}

// satu baris teks yang muncul dari bawah + blur → jelas
function Reveal({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* =========================================================
   JUDUL SECTION
   ========================================================= */
function SectionHeader({ label, title, children, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease }}
      className={center ? 'flex flex-col items-center gap-6 text-center' : 'flex flex-wrap items-end justify-between gap-6'}
    >
      <div className={`flex flex-col gap-3 ${center ? 'items-center' : ''}`}>
        <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-brand to-violet shadow-[0_0_10px_var(--color-hot)]" />
          {label}
        </span>
        <h2 className="font-display text-2xl font-semibold uppercase leading-none tracking-tight md:text-[34px]">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

/* =========================================================
   NOW SHOWING — tab dengan "pill" yang meluncur
   ========================================================= */
function NowShowing({ now, top }) {
  const tabs = [
    { key: 'now', label: 'Now showing', data: now },
    { key: 'top', label: 'Top rated', data: top },
  ]
  const [tab, setTab] = useState('now')
  const active = tabs.find((t) => t.key === tab)

  return (
    <section id="movies" className="relative mx-auto flex max-w-[1280px] scroll-mt-24 flex-col gap-10 px-6 pb-24 pt-20 md:px-12">
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-violet/15 blur-[100px]" />

      <SectionHeader label="In cinemas" title={<>Now <span className="text-gradient">showing</span></>}>
        <div className="flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                t.key === tab ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
            >
              {t.key === tab && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-brand to-hot shadow-[0_0_24px_-4px_var(--color-hot)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </SectionHeader>

      <div key={tab} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {!active.data.length && Array.from({ length: 12 }, (_, i) => <CardSkeleton key={i} />)}
        {active.data.map((m, idx) => (
          <MovieCard key={m.id} movie={m} index={idx} />
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   CINEMAS — banner Premiere + daftar lokasi bioskop
   ========================================================= */
const cities = ['All', ...new Set(cinemaList.map((c) => c.city))]

function Cinemas({ firstId = 1 }) {
  const ref = useRef(null)
  const [city, setCity] = useState('All')
  const list = cinemaList.filter((c) => city === 'All' || c.city === city)

  function handleMove(e) {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const features = ['4K Laser', 'Dolby Atmos', 'Recliner seats', 'Lounge & bar']

  return (
    <section id="cinemas" className="relative mx-auto flex max-w-[1280px] scroll-mt-28 flex-col gap-10 px-6 pb-24 md:px-12">
      <SectionHeader center label="Our cinemas" title={<>Find a <span className="text-gradient">cinema</span></>}>
        <p className="max-w-md text-white/55">
          {cinemaList.length} locations across {cities.length - 1} cities. Pick one to see what's playing.
        </p>
      </SectionHeader>

      {/* banner Premiere */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease }}
        className="rounded-[28px] bg-linear-to-br from-brand via-hot to-violet p-px"
      >
        <div
          ref={ref}
          onMouseMove={handleMove}
          className="group relative overflow-hidden rounded-[27px] bg-ink px-7 py-9 md:px-10 md:py-10"
          style={{ '--mx': '50%', '--my': '50%' }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: 'radial-gradient(500px circle at var(--mx) var(--my), rgba(255,46,147,0.18), transparent 60%)' }}
          />
          <div className="bg-grid absolute inset-0 opacity-50" />
          <div className="absolute -right-24 -top-24 h-96 w-96 animate-aurora rounded-full bg-violet/30 blur-[100px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex flex-col gap-5">
              <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-brand to-violet shadow-[0_0_10px_var(--color-hot)]" />
                Sinéfolis Premiere
              </span>
              <h3 className="font-display text-xl font-semibold uppercase leading-[1] tracking-tight md:text-[28px]">
                Not just a movie.
                <br />
                <span className="text-gradient">An experience.</span>
              </h3>
              <p className="max-w-md text-[15px] leading-relaxed text-white/60">
                Premium screens, immersive sound, and recliner seats. Available at locations marked Premiere below.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((f, idx) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1, ease }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
                >
                  <span className="mb-4 block h-2 w-2 rounded-full bg-linear-to-br from-brand to-violet shadow-[0_0_12px_var(--color-hot)]" />
                  <span className="font-display text-sm font-semibold uppercase tracking-tight">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* filter kota */}
      <div className="flex flex-wrap justify-center gap-2">
        {cities.map((c) => {
          const active = c === city
          return (
            <button
              key={c}
              onClick={() => setCity(c)}
              aria-pressed={active}
              className={`relative rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors ${
                active ? 'text-white' : 'border border-white/12 text-white/60 hover:text-white'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="city-pill"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-brand via-hot to-violet"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{c === 'All' ? 'All cities' : c}</span>
            </button>
          )
        })}
      </div>

      {/* kartu lokasi */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {list.map((c, idx) => (
            <motion.div
              key={c.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.04, ease } }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            >
              <Link
                to={`/movie/${firstId}?cinema=${encodeURIComponent(c.name)}#showtimes`}
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-colors hover:border-white/25"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-80"
                  style={{ background: `hsl(${c.hue} 90% 60%)` }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: `hsl(${c.hue} 90% 75%)` }}>
                      {c.city}
                    </p>
                    <p className="mt-1 font-semibold leading-tight">{c.name}</p>
                    <p className="text-sm text-white/45">{c.area}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/60">{c.screens} screens</span>
                </div>
                <div className="relative flex flex-wrap gap-1.5">
                  {c.formats.map((f) => (
                    <span key={f} className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                      {f}
                    </span>
                  ))}
                </div>
                <span className="relative mt-auto text-[13px] font-semibold text-white/70 transition-colors group-hover:text-white">See showtimes →</span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/* =========================================================
   DEALS — iklan + promo pilihan
   ========================================================= */
function Deals() {
  return (
    <section id="promotions" className="relative mx-auto flex max-w-[1280px] scroll-mt-28 flex-col gap-10 px-6 pb-24 md:px-12">
      <div className="pointer-events-none absolute left-1/4 top-20 h-80 w-80 rounded-full bg-[#FF9F43]/15 blur-[110px]" />
      <SectionHeader center label="Deals & vouchers" title={<>Hot <span className="text-gradient">deals</span></>}>
        <p className="max-w-md text-white/55">Save on tickets and snacks. Copy a code and use it at checkout.</p>
      </SectionHeader>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease }}
      >
        <AdCarousel ads={ads} />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {promos.slice(0, 4).map((p, idx) => (
          <PromoCard key={p.id} promo={p} index={idx} />
        ))}
      </div>

      <Link
        to="/promotions"
        className="self-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/10"
      >
        See all promotions →
      </Link>
    </section>
  )
}

/* =========================================================
   COMING SOON — grid di tengah, tanpa scroll samping
   ========================================================= */
function ComingSoon({ items }) {
  return (
    <section id="coming-soon" className="relative mx-auto flex max-w-[1280px] scroll-mt-28 flex-col gap-10 px-6 pb-24 md:px-12">
      <div className="pointer-events-none absolute right-1/4 top-10 h-80 w-80 rounded-full bg-cyan/10 blur-[110px]" />
      <SectionHeader center label="Mark your calendar" title={<>Coming <span className="text-gradient">soon</span></>} />

      {/* poster tegak (2:3) supaya tidak terpotong */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {!items.length &&
          Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.05]" />)}
        {items.map((m, idx) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: (idx % 6) * 0.06, ease }}
            className="group"
          >
            <Link to={`/movie/${m.id}`} className="block">
              <div
                className="relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10 transition-shadow duration-500 group-hover:ring-white/25"
                style={{ boxShadow: `0 20px 50px -35px hsl(${m.hue} 95% 60%)` }}
              >
                <PosterArt src={m.poster} title={m.title} hue={m.hue} className="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute left-2.5 top-2.5 rounded-lg border border-white/15 bg-black/45 px-2 py-1 text-center backdrop-blur-md">
                  <span className="block font-display text-sm font-semibold leading-none">{m.date.split(' ')[0]}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-white/70">{m.date.split(' ')[1]}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-0.5 px-0.5">
                <p className="truncate text-[13px] font-semibold">{m.title}</p>
                <p className="text-[11px] font-medium" style={{ color: `hsl(${m.hue} 90% 72%)` }}>
                  {m.genre} · Coming soon
                </p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}