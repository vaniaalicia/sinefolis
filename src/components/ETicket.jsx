import { useMemo } from 'react'
import { motion } from 'motion/react'
import PosterArt from './PosterArt'
import { rupiah } from '../data/dummy'

const ease = [0.22, 1, 0.36, 1]

// QR code "palsu" tapi konsisten berdasarkan kode booking (untuk tampilan saja)
function fakeQR(seed, size = 25) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const cells = []
  const finder = (x, y, ox, oy) => {
    const dx = x - ox
    const dy = y - oy
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null
    return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let f = finder(x, y, 0, 0) ?? finder(x, y, size - 7, 0) ?? finder(x, y, 0, size - 7)
      if (f === null) {
        const nearFinder = (x < 8 && y < 8) || (x > size - 9 && y < 8) || (x < 8 && y > size - 9)
        h = (h * 1103515245 + 12345) >>> 0
        f = nearFinder ? false : h % 100 < 48
      }
      cells.push(f)
    }
  }
  return cells
}

function Info({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className={`mt-1 truncate font-semibold ${mono ? 'tracking-wider' : ''}`}>{value}</p>
    </div>
  )
}

// E-tiket lengkap dengan QR. Dipakai di halaman Confirmed dan My tickets.
// used = tiket sudah dipakai (riwayat) → tampil redup dengan cap "Used"
export default function ETicket({ booking: b, used = false, delay = 0 }) {
  const qr = useMemo(() => fakeQR(b.bookingCode), [b.bookingCode])

  return (
    <motion.article
      aria-label={`Ticket ${b.bookingCode}`}
      initial={{ opacity: 0, y: 40, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay, ease }}
      style={{ transformPerspective: 1200 }}
      className="relative w-full max-w-[760px]"
    >
      <div
        className={`rounded-[30px] p-px ${
          used ? 'bg-white/10' : 'bg-linear-to-br from-brand via-hot to-violet shadow-[0_40px_120px_-40px_var(--color-hot)]'
        }`}
      >
        <div className="grid overflow-hidden rounded-[29px] bg-ink md:grid-cols-[1fr_auto]">
          {/* bagian kiri tiket */}
          <div className={`flex gap-5 p-6 md:p-8 ${used ? 'opacity-60' : ''}`}>
            <div className="hidden h-40 w-28 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 sm:block">
              <PosterArt src={b.movie.poster} title="" hue={b.movie.hue} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Sinéfolis · e-ticket</p>
                <p className="mt-1.5 font-display text-xl font-semibold uppercase leading-tight tracking-tight">{b.movie.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
                <Info label="Cinema" value={`${b.cinema} ${b.hall}`} />
                <Info label="Date" value={b.date} />
                <Info label="Time" value={b.time} />
                <Info label="Seats" value={b.seats.join(', ')} />
                <Info label="Paid" value={rupiah(b.grandTotal)} />
                <Info label="Booking code" value={b.bookingCode} mono />
              </div>
            </div>
          </div>

          {/* sobekan tiket + QR */}
          <div className="relative flex items-center justify-center border-t-2 border-dashed border-white/15 p-6 md:border-l-2 md:border-t-0 md:p-8">
            <span className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-ink md:block" />
            <span className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-ink md:block" />
            <div className="relative flex flex-col items-center gap-3">
              <div role="img" aria-label="Ticket QR code" className={`rounded-2xl bg-white p-3 ${used ? 'opacity-30' : ''}`}>
                <div className="grid grid-cols-[repeat(25,5px)] grid-rows-[repeat(25,5px)]">
                  {qr.map((on, i) => (
                    <span key={i} className={on ? 'bg-ink' : 'bg-white'} />
                  ))}
                </div>
              </div>
              {used ? (
                <span className="absolute top-12 -rotate-12 rounded-lg border-2 border-white/70 px-3 py-1 font-display text-sm font-semibold uppercase tracking-widest text-white/80">
                  Used
                </span>
              ) : null}
              <p className="text-[11px] text-white/45">{used ? 'This ticket has been used' : 'Show this at the entrance'}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
