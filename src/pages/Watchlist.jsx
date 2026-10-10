import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import PosterArt from '../components/PosterArt'
import RequireSignIn from '../components/RequireSignIn'

const ease = [0.22, 1, 0.36, 1]

export default function Watchlist() {
  const { user, watchlist, toggleWatch } = useApp()

  return (
    <main className="relative min-h-[80svh] overflow-x-clip pb-32 pt-32">
      <div className="pointer-events-none absolute -right-32 top-24 h-[420px] w-[420px] animate-aurora rounded-full bg-hot/15 blur-[120px]" />

      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-12 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
            Your <span className="text-gradient">watchlist</span>
          </h1>
          <p className="text-white/55">Movies you saved to watch later.</p>
        </motion.div>

        {!user ? (
          <RequireSignIn title="Sign in to use your watchlist" text="Save movies you're interested in and find them here anytime." />
        ) : watchlist.length === 0 ? (
          <div className="flex flex-col items-center gap-4 text-center text-white/55">
            <p>No movies saved yet. Tap ♡ Watchlist on any movie page.</p>
            <Link to="/#movies" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Browse movies
            </Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {watchlist.map((m, idx) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group flex flex-col gap-3"
                >
                  <Link to={`/movie/${m.id}`} className="relative block aspect-[2/3] overflow-hidden rounded-2xl ring-1 ring-white/10 transition group-hover:ring-white/25">
                    <PosterArt src={m.poster} title={m.title} hue={m.hue} className="transition-transform duration-700 group-hover:scale-105" />
                  </Link>
                  <div className="flex items-start justify-between gap-2 px-1">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{m.title}</p>
                      {m.genre && <p className="text-xs text-white/45">{m.genre}</p>}
                    </div>
                    <button
                      onClick={() => toggleWatch(m)}
                      aria-label={`Remove ${m.title} from watchlist`}
                      className="shrink-0 rounded-full px-2 py-1 text-xs text-white/45 hover:bg-white/10 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}
