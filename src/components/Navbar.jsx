
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b border-line bg-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link to="/" className="text-2xl font-bold text-brand">
          Sinéfolis
        </Link>

        <div className="flex items-center gap-8 text-sm">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>
          <Link to="/#movies" className="hover:text-brand">
            Movies
          </Link>
        </div>
      </nav>
    </header>
  )
}
