import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

// Popup untuk menulis review setelah menonton/booking
export default function ReviewModal({ open, onClose, onSubmit, movieTitle, defaultName = '' }) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit({ rating, text: text.trim(), name: defaultName || 'Anonymous', movie: movieTitle })
    setText('')
    setRating(5)
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-6 backdrop-blur-md"
        >
          <motion.form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative flex w-full max-w-md flex-col gap-5 rounded-[28px] border border-white/10 bg-ink/95 p-7 text-center"
          >
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-lg text-white/60 hover:bg-white/10">
              ×
            </button>
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-lg font-semibold uppercase tracking-tight">Rate your experience</p>
              {movieTitle && <p className="text-sm text-white/50">{movieTitle}</p>}
            </div>

            <div className="flex justify-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  type="button"
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                  className={`text-3xl transition-colors ${(hover || rating) >= n ? 'text-[#FFC94D]' : 'text-white/15'}`}
                >
                  ★
                </motion.button>
              ))}
            </div>

            <label htmlFor="review-text" className="sr-only">Your review</label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              required
              placeholder="How was the movie, the seats, the sound?"
              className="resize-none rounded-xl border border-white/12 bg-black/30 p-4 text-left text-sm outline-none placeholder:text-white/30 focus:border-white/40"
            />
            <button className="h-12 rounded-full bg-linear-to-r from-brand via-hot to-violet text-sm font-bold">Post review</button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
