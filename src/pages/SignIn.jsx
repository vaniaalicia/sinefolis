import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'

const ease = [0.22, 1, 0.36, 1]

export default function SignIn() {
  const { signIn } = useApp()
  const navigate = useNavigate()
  const { state } = useLocation()
  const from = state?.from && state.from !== '/signin' ? state.from : '/'
  const reason = state?.reason

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!email.includes('@')) return setError('Please enter a valid email.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (mode === 'signup' && !name.trim()) return setError('Please enter your name.')
    signIn(email.trim(), mode === 'signup' ? name.trim() : '')
    navigate(from, { replace: true })
  }

  const field =
    'h-12 w-full rounded-xl border border-white/12 bg-black/30 px-4 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-white/40'

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] animate-aurora rounded-full bg-hot/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[420px] w-[420px] animate-aurora rounded-full bg-violet/25 blur-[120px] [animation-delay:-8s]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="relative w-full max-w-[420px] rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl md:p-9"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-2xl font-semibold uppercase tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-white/55">
            {reason ?? (mode === 'signin' ? 'Sign in to see your tickets and watchlist.' : 'Join Sinéfolis to save movies and track your tickets.')}
          </p>
        </div>

        {/* tab sign in / sign up */}
        <div className="mt-7 grid grid-cols-2 rounded-full border border-white/10 bg-black/20 p-1">
          {[
            ['signin', 'Sign in'],
            ['signup', 'Sign up'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setMode(key)
                setError('')
              }}
              className={`relative rounded-full py-2.5 text-[13px] font-semibold transition-colors ${mode === key ? 'text-white' : 'text-white/50 hover:text-white'}`}
            >
              {mode === key && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-full bg-linear-to-r from-brand via-hot to-violet"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          {mode === 'signup' && (
            <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-1.5 text-xs text-white/50">
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} className={field} placeholder="Your name" />
            </motion.label>
          )}
          <label className="flex flex-col gap-1.5 text-xs text-white/50">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@email.com" />
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-white/50">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} placeholder="At least 6 characters" />
          </label>

          {error && <p className="text-sm text-[#FF8A97]">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 h-12 rounded-full bg-linear-to-r from-brand via-hot to-violet text-sm font-bold shadow-[0_0_40px_-8px_var(--color-hot)]"
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Demo account system. Data is only saved in this browser.{' '}
          <Link to="/" className="text-white/60 underline-offset-2 hover:underline">
            Back home
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
