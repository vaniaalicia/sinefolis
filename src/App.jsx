import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Seats from './pages/Seats'
import Payment from './pages/Payment'
import Confirmed from './pages/Confirmed'
import Promotions from './pages/Promotions'
import SignIn from './pages/SignIn'
import Watchlist from './pages/Watchlist'
import Tickets from './pages/Tickets'

// Pindah halaman → mulai dari atas. Kalau link punya #section, scroll ke section itu.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // tunggu sebentar sampai halaman selesai digambar
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollManager />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/:id/seats" element={<Seats />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmed" element={<Confirmed />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  )
}
