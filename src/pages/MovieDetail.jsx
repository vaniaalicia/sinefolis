import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import PosterArt from '../components/PosterArt'
import { cinemas, halls, rupiah } from '../data/dummy'
import { useMovieDetail } from '../hooks/useTmdb'
import { useApp } from '../context/AppContext'

const ease = [0.22, 1, 0.36, 1]

// 14 hari ke depan mulai hari ini: minggu ini + minggu depan
function nextTwoWeeks() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      key: d.toISOString().slice(0, 10),
      dow: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      day: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
    }
  })
}

// Ambil data film dulu (TMDB), tampilkan loading, baru render halaman
export default function MovieDetail() {
  const { id } = useParams()
  const { loading, movie, credits } = useMovieDetail(id)

  if (loading) {
    return (
      <main className="grid min-h-[100svh] place-items-center">
        <div className="flex flex-col items-center gap-4 text-sm text-white/50">
          <motion.span
            className="h-8 w-8 rounded-full border-2 border-white/15 border-t-hot"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          Loading movie…
        </div>
      </main>
    )
  }

  return <MovieDetailView key={movie.id} movie={movie} credits={credits} />
}

function MovieDetailView({ movie, credits }) {
  const navigate = useNavigate()
  const id = movie.id

  // data film dirapikan (data dummy bentuknya beda-beda, nanti TMDB seragam)
  const genres = movie.genres ?? [movie.genre]
  const overview = movie.overview ?? 'Sinopsis film akan diambil otomatis dari TMDB.'

  const days = useMemo(nextTwoWeeks, [])
  const [week, setWeek] = useState(0) // 0 = minggu ini, 1 = minggu depan
  const [day, setDay] = useState(days[0].key)
  // ?cinema=... dari kartu lokasi di Home → filter bioskop langsung terpilih
  const [params] = useSearchParams()
  const presetCinema = params.get('cinema')
  const [cinema, setCinema] = useState(presetCinema && cinemas.includes(presetCinema) ? presetCinema : 'All')
  const isSoon = !!movie.comingSoon
  const [pick, setPick] = useState(null) // { hall, time }
  // ?trailer=1 (dari tombol Watch trailer di Home) → trailer langsung terbuka
  const [trailerOpen, setTrailerOpen] = useState(params.get('trailer') === '1')
  const { user, isSaved, toggleWatch } = useApp()
  const { pathname } = useLocation()
  const saved = user ? isSaved(movie.id) : false

  // watchlist butuh login dulu
  function handleWatchlist() {
    if (!user) {
      navigate('/signin', { state: { from: pathname, reason: 'Sign in to save movies to your watchlist.' } })
      return
    }
    toggleWatch(movie)
  }

  // pindah film → mulai dari atas lagi
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // ganti tanggal / bioskop → reset jam yang dipilih
  useEffect(() => setPick(null), [day, cinema])

  const visibleHalls = halls.filter((h) => cinema === 'All' || h.cinema === cinema)
  const dayInfo = days.find((d) => d.key === day)

  function goToSeats() {
    navigate(`/movie/${movie.id}/seats`, {
      state: {
        movie: { id: movie.id, title: movie.title, hue: movie.hue, poster: movie.poster ?? null },
        cinema: pick.hall.cinema,
        hall: pick.hall.name,
        price: pick.hall.price,
        date: dayInfo.label,
        time: pick.time,
      },
    })
  }

  return (
    <main className="relative overflow-x-clip pb-40">
      {/* ================= HERO FILM ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 scale-110 opacity-70 blur-2xl">
          <PosterArt src={movie.backdrop} title="" hue={movie.hue} eager />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-ink/40 via-ink/70 to-ink" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] animate-aurora rounded-full bg-hot/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-6 pb-16 pt-36 md:px-12 lg:grid-cols-[340px_1fr] lg:gap-16">
          {/* poster melayang */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease }}
            className="mx-auto w-[240px] lg:w-full"
          >
            <div
              className="animate-float overflow-hidden rounded-3xl ring-1 ring-white/15 aspect-[2/3]"
              style={{ boxShadow: `0 40px 100px -30px hsl(${movie.hue} 95% 60% / 0.6)` }}
            >
              <PosterArt src={movie.poster} title={movie.title} hue={movie.hue} eager />
            </div>
          </motion.div>

          {/* info */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            className="flex flex-col gap-6"
          >
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
                <span className={`h-1.5 w-1.5 rounded-full ${isSoon ? 'bg-cyan shadow-[0_0_10px_var(--color-cyan)]' : 'animate-pulse bg-hot shadow-[0_0_10px_var(--color-hot)]'}`} />
                {isSoon ? `Coming soon · ${movie.date}` : 'Now showing'}
              </span>
            </Reveal>

            <Reveal>
              <h1 className="font-display text-3xl font-semibold uppercase leading-[1] tracking-tight md:text-5xl">{movie.title}</h1>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                {movie.rating && (
                  <span className="rounded-full bg-[#FFC94D]/15 px-3 py-1 text-xs font-bold text-[#FFC94D]">★ {movie.rating}</span>
                )}
                {[movie.age, ...genres, movie.year, movie.duration].filter(Boolean).map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-md">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <p className="max-w-[560px] text-[15px] leading-relaxed text-white/65">{overview}</p>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTrailerOpen(true)}
                  className="flex h-13 items-center gap-3 rounded-full bg-linear-to-r from-brand via-hot to-violet pl-2 pr-6 text-sm font-bold shadow-[0_0_50px_-8px_var(--color-hot)]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                  </span>
                  Watch trailer
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWatchlist}
                  aria-pressed={saved}
                  className={`flex h-13 items-center gap-2 rounded-full border px-5 text-sm font-semibold backdrop-blur-md transition-colors ${
                    saved ? 'border-hot/50 bg-hot/15 text-white' : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <motion.span key={String(saved)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className={saved ? 'text-hot' : ''}>
                    {saved ? '♥' : '♡'}
                  </motion.span>
                  {saved ? 'Saved' : 'Watchlist'}
                </motion.button>
                {!isSoon && (
                  <a href="#showtimes" className="flex h-13 items-center px-3 text-sm font-semibold text-white/70 hover:text-white">
                    See showtimes ↓
                  </a>
                )}
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-x-12 gap-y-5 border-t border-white/10 pt-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Director</p>
                  <p className="mt-1.5 text-sm">{credits.director}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Cast</p>
                  <div className="mt-2 flex items-center">
                    {credits.cast.map((name, i) => (
                      <span
                        key={name}
                        title={name}
                        className="-ml-2 grid h-9 w-9 place-items-center rounded-full border-2 border-ink text-[10px] font-bold first:ml-0"
                        style={{ background: `hsl(${(movie.hue + i * 40) % 360} 60% 35%)` }}
                      >
                        {name.split(' ').map((w) => w[0]).join('')}
                      </span>
                    ))}
                    <span className="ml-3 text-sm text-white/60">
                      {credits.cast.slice(0, 2).join(', ')}
                      {credits.cast.length > 2 && ` +${credits.cast.length - 2}`}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* ================= JADWAL (hanya untuk film yang sedang tayang) ================= */}
      {isSoon ? (
        <section className="relative mx-auto flex max-w-[720px] flex-col items-center gap-5 px-6 pt-16 text-center">
          <div className="flex flex-col items-center gap-5 rounded-[28px] border border-white/10 bg-white/[0.03] px-8 py-10 backdrop-blur-md">
            <span className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold text-cyan">In cinemas {movie.date}</span>
            <p className="font-display text-xl font-semibold uppercase tracking-tight">Tickets aren't on sale yet</p>
            <p className="max-w-sm text-sm text-white/55">
              Showtimes will appear here once ticket sales open. Save it to your watchlist so you don't miss it.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleWatchlist}
              className="flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-brand via-hot to-violet px-6 text-sm font-bold"
            >
              {saved ? '♥ Saved to watchlist' : '♡ Add to watchlist'}
            </motion.button>
          </div>
        </section>
      ) : (
      <section id="showtimes" className="relative mx-auto flex max-w-[1280px] scroll-mt-28 flex-col gap-10 px-6 pt-16 md:px-12">
        <div className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-violet/15 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-brand to-violet shadow-[0_0_10px_var(--color-hot)]" />
            Pick a date and time
          </span>
          <h2 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
            Show<span className="text-gradient">times</span>
          </h2>
        </motion.div>

        {/* pilih tanggal: di tengah, bisa pindah ke minggu depan */}
        <div className="flex flex-col items-center gap-5">
          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {['This week', 'Next week'].map((label, w) => (
              <button
                key={label}
                onClick={() => {
                  setWeek(w)
                  setDay(days[w * 7].key)
                }}
                className={`relative rounded-full px-5 py-2 text-[13px] font-semibold transition-colors ${week === w ? 'text-white' : 'text-white/55 hover:text-white'}`}
              >
                {week === w && (
                  <motion.span layoutId="week-pill" className="absolute inset-0 rounded-full bg-white/12 ring-1 ring-white/15" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={week}
              initial={{ opacity: 0, x: week ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: week ? -40 : 40 }}
              transition={{ duration: 0.35, ease }}
              className="no-scrollbar -mx-6 flex max-w-full gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:justify-center md:px-0"
            >
              {days.slice(week * 7, week * 7 + 7).map((d) => {
                const active = d.key === day
                return (
                  <button
                    key={d.key}
                    onClick={() => setDay(d.key)}
                    aria-pressed={active}
                    className={`relative flex h-[104px] w-[84px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border transition-colors md:w-[100px] ${
                      active ? 'border-transparent' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="day-pill"
                        className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand via-hot to-violet shadow-[0_10px_40px_-10px_var(--color-hot)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative text-[11px] font-semibold uppercase tracking-wider ${active ? 'text-white' : 'text-white/50'}`}>{d.dow}</span>
                    <span className="relative font-display text-[26px] font-semibold leading-none">{d.day}</span>
                    <span className={`relative text-[10px] uppercase tracking-widest ${active ? 'text-white/85' : 'text-white/40'}`}>{d.month}</span>
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* filter bioskop */}
        <div className="flex flex-wrap justify-center gap-2">
          {['All', ...cinemas].map((c) => {
            const active = c === cinema
            return (
              <button
                key={c}
                onClick={() => setCinema(c)}
                aria-pressed={active}
                className={`rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-all ${
                  active ? 'border-white bg-white text-ink' : 'border-white/12 bg-white/[0.03] text-white/65 hover:border-white/30 hover:text-white'
                }`}
              >
                {c === 'All' ? 'All cinemas' : c}
              </button>
            )
          })}
        </div>

        {/* daftar studio + jam */}
        <motion.div layout className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {visibleHalls.map((h, idx) => (
              <motion.div
                key={h.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: idx * 0.06, ease } }}
                exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:grid-cols-[1fr_auto] md:items-center md:p-7"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-lg font-semibold">{h.cinema}</p>
                    <p className="text-sm text-white/45">{h.name} · {rupiah(h.price)}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {h.tags.map((t) => (
                      <span key={t} className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {h.times.map((t) => {
                    const active = pick?.hall.id === h.id && pick?.time === t
                    return (
                      <motion.button
                        key={t}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setPick({ hall: h, time: t })}
                        aria-pressed={active}
                        className={`h-12 min-w-[84px] rounded-xl border px-4 text-sm font-semibold transition-all ${
                          active
                            ? 'border-transparent bg-linear-to-r from-brand to-hot shadow-[0_8px_30px_-6px_var(--color-hot)]'
                            : 'border-white/12 bg-black/20 text-white/85 hover:border-white/35'
                        }`}
                      >
                        {t}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      )}

      {/* ================= BAR BOOKING (muncul setelah pilih jam) ================= */}
      <AnimatePresence>
        {pick && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:px-6 md:pb-6"
          >
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-ink/80 p-4 pl-6 shadow-[0_-10px_60px_-20px_var(--color-hot)] backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg">
                  <PosterArt src={movie.poster} title="" hue={movie.hue} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{movie.title}</p>
                  <p className="truncate text-sm text-white/55">
                    {pick.hall.cinema} {pick.hall.name} · {dayInfo.label} · {pick.time}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={goToSeats}
                className="flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-brand via-hot to-violet px-7 text-sm font-bold shadow-[0_0_40px_-8px_var(--color-hot)]"
              >
                Choose seats <span aria-hidden>→</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= POPUP TRAILER ================= */}
      <AnimatePresence>
        {trailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTrailerOpen(false)}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15"
            >
              {/* Tahap 7: ganti isi ini dengan <iframe> YouTube dari data TMDB */}
              {movie.trailerKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <>
                  <PosterArt title="" hue={movie.hue} />
                  <div className="absolute inset-0 grid place-items-center text-sm text-white/70">Trailer not available yet</div>
                </>
              )}
              <button
                onClick={() => setTrailerOpen(false)}
                aria-label="Close trailer"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-lg backdrop-blur-md hover:bg-black/70"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Reveal({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease } },
      }}
    >
      {children}
    </motion.div>
  )
}