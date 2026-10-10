import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useApp } from '../context/AppContext'

// Urutan sama dengan urutan section di Home.
// section: id section di Home · path: halaman lain yang juga dianggap "aktif"
const links = [
  { to: '/#movies', label: 'Movies', section: 'movies', path: '/movie/' },
  { to: '/#cinemas', label: 'Cinemas', section: 'cinemas' },
  { to: '/#promotions', label: 'Promotions', section: 'promotions', path: '/promotions' },
  { to: '/#coming-soon', label: 'Coming soon', section: 'coming-soon' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, signOut, watchlist } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // navbar jadi kaca buram setelah di-scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // di Home: cari tahu section mana yang sedang terlihat
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(null)
      return
    }
    const ids = links.map((l) => l.section)
    // section aktif = section yang sedang melewati garis 35% dari atas layar
    const onScroll = () => {
      const line = window.innerHeight * 0.35
      let current = null
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= line && r.bottom > line) current = id
      }
      setActiveSection(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // tutup menu akun kalau klik di luar
  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  // tutup menu tiap pindah halaman
  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (l) => (pathname === '/' ? activeSection === l.section : !!l.path && pathname.startsWith(l.path))

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6"
    >
      <nav
        className={`mx-auto grid max-w-[1280px] grid-cols-[1fr_auto] items-center gap-6 rounded-full px-4 py-2.5 transition-all duration-500 md:grid-cols-[1fr_auto_1fr] md:px-6 ${
          scrolled ? 'border border-white/10 bg-ink/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl' : 'border border-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 justify-self-start">
          <span className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-brand to-violet shadow-[0_0_14px_var(--color-hot)]" />
          <span className="font-display text-base font-semibold tracking-tight">Sinéfolis</span>
        </Link>

        {/* menu tengah, yang aktif diberi "pill" */}
        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
          {links.map((l) => {
            const active = isActive(l)
            return (
              <Link
                key={l.label}
                to={l.to}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/12 ring-1 ring-white/15"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-hot shadow-[0_0_8px_var(--color-hot)]"
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1.5 justify-self-end">
          {/* my tickets: bisa diakses tanpa login */}
          <Link
            to="/tickets"
            aria-current={pathname === '/tickets' ? 'page' : undefined}
            className={`flex h-10 items-center gap-2 rounded-full px-3 text-[13px] font-semibold transition hover:bg-white/10 ${
              pathname === '/tickets' ? 'bg-white/12 text-white ring-1 ring-white/15' : 'text-white/75 hover:text-white'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
              <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
              <path d="M14 5v12" strokeDasharray="2 2" />
            </svg>
            <span className="hidden lg:inline">My tickets</span>
          </Link>

          {/* watchlist */}
          <Link
            to="/watchlist"
            aria-label="Watchlist"
            aria-current={pathname === '/watchlist' ? 'page' : undefined}
            className={`relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10 ${
              pathname === '/watchlist' ? 'bg-white/12 text-hot' : 'text-white/75 hover:text-white'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={pathname === '/watchlist' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
            </svg>
            {user && watchlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-hot px-1 text-[9px] font-bold">{watchlist.length}</span>
            )}
          </Link>

          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1 pr-3 transition hover:bg-white/10"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-brand to-violet text-xs font-bold uppercase">{user.name[0]}</span>
                <span className="hidden max-w-[90px] truncate text-[13px] font-semibold sm:block">{user.name}</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-white/10 bg-ink/95 p-1.5 shadow-2xl backdrop-blur-xl"
                  >
                    <p className="truncate px-3 py-2 text-xs text-white/45">{user.email}</p>
                    <MenuLink to="/watchlist" label="Watchlist" />
                    <button
                      onClick={() => {
                        signOut()
                        navigate('/')
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#FF8A97] hover:bg-white/5"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/signin"
              state={{ from: pathname }}
              className={`hidden h-10 items-center rounded-full px-4 text-[13px] font-semibold transition hover:bg-white/10 sm:flex ${
                pathname === '/signin' ? 'bg-white/12 text-white' : 'text-white/80'
              }`}
            >
              Sign in
            </Link>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/#movies"
              className="flex h-10 items-center rounded-full bg-linear-to-r from-brand to-hot px-5 text-[13px] font-bold shadow-[0_0_30px_-6px_var(--color-hot)]"
            >
              Get tickets
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  )
}

function MenuLink({ to, label }) {
  return (
    <Link to={to} className="block rounded-xl px-3 py-2.5 text-sm text-white/85 hover:bg-white/5 hover:text-white">
      {label}
    </Link>
  )
}