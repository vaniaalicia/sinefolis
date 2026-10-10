import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Stepper from '../components/Stepper'
import PosterArt from '../components/PosterArt'
import { featured, promos, rupiah } from '../data/dummy'

const ease = [0.22, 1, 0.36, 1]
const SERVICE_FEE = 4000 // per tiket
const HOLD_SECONDS = 10 * 60 // kursi ditahan 10 menit

// promo yang bisa dipakai saat checkout (yang punya persentase diskon)
const checkoutPromos = promos.filter((p) => p.discount)

const methods = [
  { id: 'card', title: 'Credit / debit card', sub: 'Visa, Mastercard, JCB' },
  { id: 'ewallet', title: 'E-wallet & QRIS', sub: 'GoPay, OVO, DANA, ShopeePay' },
  { id: 'va', title: 'Virtual account', sub: 'BCA, Mandiri, BNI, BRI' },
]

export default function Payment() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // data default kalau halaman dibuka langsung
  const b = state ?? {
    movie: featured[0],
    cinema: 'Plaza Indonesia',
    hall: 'IMAX',
    date: 'Today',
    time: '20:30',
    price: 100000,
    seats: ['E6', 'E7'],
    total: 200000,
  }

  const [method, setMethod] = useState('card')
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // hitung mundur waktu tahan kursi
  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  const fee = SERVICE_FEE * b.seats.length
  const discount = promo ? Math.round((b.total * promo.percent) / 100) : 0
  const grandTotal = b.total + fee - discount
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const expired = secondsLeft <= 0

  function applyCode(raw) {
    const code = raw.trim().toUpperCase()
    const found = checkoutPromos.find((p) => p.code === code)
    if (found) {
      setPromo({ code, label: `${found.discount}% off tickets`, percent: found.discount })
      setPromoInput(code)
      setPromoError('')
    } else {
      setPromo(null)
      setPromoError("This code isn't valid. Pick one of the available promos below.")
    }
  }

  function applyPromo(e) {
    e.preventDefault()
    applyCode(promoInput)
  }

  function removePromo() {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  function pay() {
    setPaying(true)
    // pura-pura proses pembayaran 1.8 detik
    setTimeout(() => {
      const code = 'SNF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      navigate('/confirmed', { state: { ...b, fee, discount, grandTotal, method, bookingCode: code } })
    }, 1800)
  }

  return (
    <main className="relative overflow-x-clip pb-32 pt-28">
      <div className="pointer-events-none absolute -right-40 top-32 h-[460px] w-[460px] animate-aurora rounded-full bg-violet/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 top-[520px] h-[420px] w-[420px] animate-aurora rounded-full bg-hot/15 blur-[120px] [animation-delay:-8s]" />

      <div className="relative mx-auto flex max-w-[1080px] flex-col gap-12 px-6 md:px-12">
        <Stepper current={2} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-3">
            <Link to={`/movie/${b.movie.id}/seats`} className="self-start text-[13px] font-semibold text-white/50 transition-colors hover:text-white">
              ← Change seats
            </Link>
            <h1 className="font-display text-3xl font-semibold uppercase leading-none tracking-tight md:text-[40px]">
              Check<span className="text-gradient">out</span>
            </h1>
          </div>

          {/* timer */}
          <div
            className={`flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm backdrop-blur-md ${
              expired ? 'border-brand/50 bg-brand/15' : 'border-white/10 bg-white/[0.04]'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${expired ? 'bg-brand' : 'animate-pulse bg-hot shadow-[0_0_10px_var(--color-hot)]'}`} />
            {expired ? (
              <span className="font-semibold">Time's up. Please choose your seats again.</span>
            ) : (
              <span className="text-white/65">
                Seats held for <span className="font-display font-semibold text-white">{mm}:{ss}</span>
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* ================= RINGKASAN ================= */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="flex flex-col gap-6 self-start rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">Booking summary</p>

            <div className="flex gap-5">
              <div className="h-36 w-24 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <PosterArt src={b.movie.poster} title="" hue={b.movie.hue} />
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <p className="text-lg font-semibold leading-tight">{b.movie.title}</p>
                <dl className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="text-white/45">Cinema</dt>
                  <dd>{b.cinema} {b.hall}</dd>
                  <dt className="text-white/45">Date</dt>
                  <dd>{b.date}</dd>
                  <dt className="text-white/45">Time</dt>
                  <dd>{b.time}</dd>
                </dl>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {b.seats.map((s) => (
                <span key={s} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold">
                  {s}
                </span>
              ))}
            </div>

            {/* kode promo (opsional) */}
            <div className="flex flex-col gap-3 border-t border-white/10 pt-5">
              <div>
                <p className="text-sm font-semibold">Have a promo code?</p>
                <p className="text-xs text-white/45">Optional. Type a code from the Promotions page, or tap one below.</p>
              </div>

              <form onSubmit={applyPromo} className="flex gap-2 rounded-full border border-white/15 bg-black/30 p-1.5 focus-within:border-white/35">
                <label htmlFor="promo" className="sr-only">Promo code</label>
                <input
                  id="promo"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. 7DV90K"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm uppercase tracking-wider outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-white/35"
                />
                {promo ? (
                  <button type="button" onClick={removePromo} className="h-10 shrink-0 rounded-full border border-white/20 px-5 text-[13px] font-bold hover:bg-white/10">
                    Remove
                  </button>
                ) : (
                  <button className="h-10 shrink-0 rounded-full bg-white px-5 text-[13px] font-bold text-ink transition hover:bg-white/85">Apply</button>
                )}
              </form>

              <AnimatePresence mode="wait">
                {promo && (
                  <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm font-semibold text-[#5BE49B]">
                    {promo.code} applied: {promo.label}
                  </motion.p>
                )}
                {promoError && (
                  <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-[#FF8A97]">
                    {promoError}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* daftar promo yang tersedia */}
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Available for this booking</p>
                {checkoutPromos.map((p) => {
                  const used = promo?.code === p.code
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => (used ? removePromo() : applyCode(p.code))}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                        used ? 'border-[#5BE49B]/40 bg-[#5BE49B]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-xs font-semibold"
                        style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                      >
                        {p.discount}%
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{p.title}</span>
                        <span className="block text-xs tracking-wider text-white/45">{p.code}</span>
                      </span>
                      <span className={`text-xs font-bold ${used ? 'text-[#5BE49B]' : 'text-white/70'}`}>{used ? 'Applied' : 'Use'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* rincian harga */}
            <div className="flex flex-col gap-2.5 border-t border-white/10 pt-5 text-sm">
              <Row label={`${b.seats.length} × Ticket`} value={rupiah(b.total)} />
              <Row label="Service fee" value={rupiah(fee)} />
              <AnimatePresence>
                {promo && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <Row label={`Promo ${promo.code}`} value={`− ${rupiah(discount)}`} accent />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-5">
              <span className="text-white/60">Total</span>
              <motion.span key={grandTotal} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-2xl font-semibold">
                {rupiah(grandTotal)}
              </motion.span>
            </div>
          </motion.section>

          {/* ================= METODE BAYAR ================= */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="flex flex-col gap-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">Payment method</p>

            <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-3">
              {methods.map((m) => {
                const active = m.id === method
                return (
                  <div key={m.id} className="relative">
                    {active && (
                      <motion.span
                        layoutId="method-ring"
                        className="absolute -inset-px rounded-[22px] bg-linear-to-r from-brand via-hot to-violet shadow-[0_0_30px_-8px_var(--color-hot)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <div className={`relative rounded-[21px] ${active ? 'bg-ink' : 'border border-white/10 bg-white/[0.03]'}`}>
                      <button
                        role="radio"
                        aria-checked={active}
                        onClick={() => setMethod(m.id)}
                        className="flex w-full items-center gap-4 p-5 text-left"
                      >
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? 'border-hot' : 'border-white/30'}`}>
                          {active && <motion.span layoutId="method-dot" className="h-2.5 w-2.5 rounded-full bg-hot" />}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold">{m.title}</span>
                          <span className="block text-sm text-white/50">{m.sub}</span>
                        </span>
                      </button>

                      {/* detail tiap metode, muncul saat dipilih */}
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5">
                              {m.id === 'card' && <CardFields />}
                              {m.id === 'ewallet' && <Note text="A QRIS code will appear after you tap Pay. Scan it with any e-wallet or mobile banking app." />}
                              {m.id === 'va' && <Note text="You'll get a virtual account number to pay through ATM or mobile banking." />}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )
              })}
            </div>

            <motion.button
              whileHover={!paying && !expired ? { scale: 1.02 } : undefined}
              whileTap={!paying && !expired ? { scale: 0.98 } : undefined}
              onClick={pay}
              disabled={paying || expired}
              className="mt-3 flex h-14 items-center justify-center gap-3 rounded-full bg-linear-to-r from-brand via-hot to-violet text-[15px] font-bold shadow-[0_0_50px_-8px_var(--color-hot)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying ? (
                <>
                  <motion.span
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Processing…
                </>
              ) : (
                <>Pay {rupiah(grandTotal)} →</>
              )}
            </motion.button>
            <p className="text-center text-xs text-white/40">Demo checkout. No real payment is processed.</p>
          </motion.section>
        </div>
      </div>
    </main>
  )
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/55">{label}</span>
      <span className={accent ? 'font-semibold text-[#5BE49B]' : ''}>{value}</span>
    </div>
  )
}

function Note({ text }) {
  return <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/60">{text}</p>
}

function CardFields() {
  const field =
    'h-12 w-full rounded-xl border border-white/12 bg-black/30 px-4 text-sm outline-none transition-colors placeholder:text-white/30 focus:border-white/40'
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="col-span-2 flex flex-col gap-1.5 text-xs text-white/50">
        Name on card
        <input className={field} placeholder="Vania Alicia" autoComplete="off" />
      </label>
      <label className="col-span-2 flex flex-col gap-1.5 text-xs text-white/50">
        Card number
        <input className={field} placeholder="4242 4242 4242 4242" inputMode="numeric" autoComplete="off" />
      </label>
      <label className="flex flex-col gap-1.5 text-xs text-white/50">
        Expiry
        <input className={field} placeholder="MM / YY" autoComplete="off" />
      </label>
      <label className="flex flex-col gap-1.5 text-xs text-white/50">
        CVV
        <input className={field} placeholder="123" inputMode="numeric" autoComplete="off" />
      </label>
    </div>
  )
}
