import { motion } from 'motion/react'

const steps = ['Showtime', 'Seats', 'Payment', 'Done']

// Versi minimal: label kecil + garis tipis per langkah, tanpa lingkaran/angka.
// current: 0 = Showtime, 1 = Seats, 2 = Payment, 3 = Done
export default function Stepper({ current }) {
  return (
    <ol aria-label="Booking steps" className="mx-auto grid w-full max-w-[560px] grid-cols-4 gap-2">
      {steps.map((label, i) => {
        const reached = i <= current
        const active = i === current
        return (
          <li key={label} aria-current={active ? 'step' : undefined} className="flex flex-col gap-2.5">
            <span className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
              {reached && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-linear-to-r from-brand via-hot to-violet"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </span>
            <span className={`text-xs font-medium ${active ? 'text-white' : reached ? 'text-white/55' : 'text-white/30'}`}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
