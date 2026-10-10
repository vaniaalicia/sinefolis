
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Seats from './pages/Seats'
import Payment from './pages/Payment'
import Confirmed from './pages/Confirmed'

import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/seats" element={<Seats />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmed" element={<Confirmed />} />
      </Routes>
  <Footer />
  </BrowserRouter>
  )
}
