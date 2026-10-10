// Data sementara. Di Tahap 7 diganti data asli TMDB.
// hue = warna placeholder (0-360) biar tiap film punya warna sendiri sebelum ada poster asli.

export const featured = [
  {
    id: 1,
    title: 'Judul Film Satu',
    tagline: 'Film unggulan minggu ini',
    genres: ['Sci-Fi', 'Adventure'],
    year: '2026',
    duration: '2j 26m',
    age: '13+',
    rating: '8.6',
    overview: 'Sinopsis singkat film unggulan. Nanti diisi otomatis dari TMDB, sekitar dua kalimat.',
    backdrop: null,
    hue: 18,
  },
  {
    id: 2,
    title: 'Judul Film Dua',
    tagline: 'Paling banyak ditonton',
    genres: ['Action', 'Thriller'],
    year: '2026',
    duration: '2j 05m',
    age: '17+',
    rating: '8.1',
    overview: 'Sinopsis singkat film kedua. Nanti diisi otomatis dari TMDB, sekitar dua kalimat.',
    backdrop: null,
    hue: 265,
  },
  {
    id: 3,
    title: 'Judul Film Tiga',
    tagline: 'Baru tayang',
    genres: ['Animation', 'Family'],
    year: '2026',
    duration: '1j 42m',
    age: 'SU',
    rating: '7.9',
    overview: 'Sinopsis singkat film ketiga. Nanti diisi otomatis dari TMDB, sekitar dua kalimat.',
    backdrop: null,
    hue: 190,
  },
]

const make = (id, title, genre, duration, age, rating, hue) => ({
  id, title, genre, duration, age, rating, hue, poster: null,
})

export const nowShowing = [
  make(1, 'Judul Film Satu', 'Sci-Fi', '2j 26m', '13+', '8.6', 18),
  make(2, 'Judul Film Dua', 'Action', '2j 05m', '17+', '8.1', 265),
  make(3, 'Judul Film Tiga', 'Animation', '1j 42m', 'SU', '7.9', 190),
  make(4, 'Judul Film Empat', 'Drama', '2j 10m', '13+', '7.6', 330),
  make(5, 'Judul Film Lima', 'Horror', '1j 48m', '17+', '7.2', 140),
  make(6, 'Judul Film Enam', 'Comedy', '1j 36m', 'SU', '7.4', 45),
  make(7, 'Judul Film Tujuh', 'Romance', '1j 58m', '13+', '7.1', 300),
  make(8, 'Judul Film Delapan', 'Mystery', '2j 01m', '13+', '7.8', 220),
]

export const topRated = [
  make(9, 'Top Rated Satu', 'Drama', '2j 20m', '13+', '9.0', 280),
  make(10, 'Top Rated Dua', 'Sci-Fi', '2j 35m', '13+', '8.9', 200),
  make(11, 'Top Rated Tiga', 'Crime', '2j 12m', '17+', '8.8', 10),
  make(12, 'Top Rated Empat', 'Animation', '1j 50m', 'SU', '8.7', 160),
]

// comingSoon: true → film belum tayang, tidak bisa dipesan
export const comingSoon = [
  { id: 13, title: 'Coming Soon Satu', date: '24 Okt', genre: 'Action', hue: 350, poster: null },
  { id: 14, title: 'Coming Soon Dua', date: '31 Okt', genre: 'Horror', hue: 120, poster: null },
  { id: 15, title: 'Coming Soon Tiga', date: '7 Nov', genre: 'Animation', hue: 40, poster: null },
  { id: 16, title: 'Coming Soon Empat', date: '14 Nov', genre: 'Sci-Fi', hue: 230, poster: null },
  { id: 17, title: 'Coming Soon Lima', date: '21 Nov', genre: 'Drama', hue: 290, poster: null },
  { id: 18, title: 'Coming Soon Enam', date: '5 Des', genre: 'Adventure', hue: 170, poster: null },
]

// ---------- dipakai di halaman detail film ----------

// daftar lokasi bioskop (simulasi)
export const cinemaList = [
  { name: 'Plaza Indonesia', city: 'Jakarta', area: 'Central Jakarta', screens: 6, formats: ['IMAX', 'Laser', '2D'], hue: 350 },
  { name: 'Senayan Park', city: 'Jakarta', area: 'Central Jakarta', screens: 5, formats: ['Premiere', 'Recliner'], hue: 280 },
  { name: 'Mall of Indonesia', city: 'Jakarta', area: 'North Jakarta', screens: 7, formats: ['Dolby Atmos', '2D'], hue: 200 },
  { name: 'Pondok Indah Mall', city: 'Jakarta', area: 'South Jakarta', screens: 8, formats: ['IMAX', '4DX', '2D'], hue: 20 },
  { name: 'Living World Alam Sutera', city: 'Tangerang', area: 'Alam Sutera', screens: 6, formats: ['Dolby Atmos', '2D'], hue: 160 },
  { name: 'Summarecon Mall Serpong', city: 'Tangerang', area: 'Gading Serpong', screens: 7, formats: ['Premiere', '2D'], hue: 45 },
  { name: 'Paris Van Java', city: 'Bandung', area: 'Sukajadi', screens: 6, formats: ['IMAX', '2D'], hue: 230 },
  { name: 'Tunjungan Plaza', city: 'Surabaya', area: 'Tegalsari', screens: 7, formats: ['4DX', 'Dolby Atmos', '2D'], hue: 320 },
]

export const cinemas = cinemaList.map((c) => c.name)

// studio + jam tayang (simulasi; bioskop Indonesia tidak punya API publik)
export const halls = [
  { id: 'pi-imax', cinema: 'Plaza Indonesia', name: 'IMAX', tags: ['IMAX', 'Laser', 'Premium seats'], price: 100000, times: ['10:00', '13:30', '17:00', '20:30'] },
  { id: 'pi-reg', cinema: 'Plaza Indonesia', name: 'Regular', tags: ['2D'], price: 50000, times: ['11:15', '14:45', '18:15', '21:45'] },
  { id: 'moi-atmos', cinema: 'Mall of Indonesia', name: 'Dolby Atmos', tags: ['2D', 'Dolby Atmos'], price: 65000, times: ['12:00', '15:20', '18:40', '22:00'] },
  { id: 'sp-premiere', cinema: 'Senayan Park', name: 'Premiere', tags: ['Premiere', 'Recliner seats'], price: 150000, times: ['12:30', '16:00', '19:30'] },
  { id: 'pim-imax', cinema: 'Pondok Indah Mall', name: 'IMAX', tags: ['IMAX', 'Laser'], price: 100000, times: ['11:00', '14:20', '17:40', '21:00'] },
  { id: 'pim-4dx', cinema: 'Pondok Indah Mall', name: '4DX', tags: ['4DX', 'Motion seats'], price: 120000, times: ['13:00', '16:30', '20:00'] },
  { id: 'lw-atmos', cinema: 'Living World Alam Sutera', name: 'Dolby Atmos', tags: ['2D', 'Dolby Atmos'], price: 55000, times: ['10:30', '13:45', '17:00', '20:15'] },
  { id: 'sms-premiere', cinema: 'Summarecon Mall Serpong', name: 'Premiere', tags: ['Premiere', 'Recliner seats'], price: 120000, times: ['12:15', '15:45', '19:15'] },
  { id: 'pvj-imax', cinema: 'Paris Van Java', name: 'IMAX', tags: ['IMAX'], price: 90000, times: ['11:30', '15:00', '18:30', '21:45'] },
  { id: 'tp-4dx', cinema: 'Tunjungan Plaza', name: '4DX', tags: ['4DX', 'Dolby Atmos'], price: 110000, times: ['12:45', '16:15', '19:45'] },
]

export const credits = {
  director: 'Nama Sutradara',
  cast: ['Pemeran Satu', 'Pemeran Dua', 'Pemeran Tiga', 'Pemeran Empat', 'Pemeran Lima'],
}

// cari film berdasarkan id (dari URL /movie/:id)
// film Coming Soon diberi tanda comingSoon: true
export function getMovie(id) {
  const soon = comingSoon.find((m) => String(m.id) === String(id))
  if (soon) return { ...soon, comingSoon: true }
  const all = [...featured, ...nowShowing, ...topRated]
  return all.find((m) => String(m.id) === String(id)) ?? featured[0]
}

export const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

// ---------- promo & iklan ----------
// from/to = warna gradasi kartu promo
export const promos = [
  {
    id: 'p1', title: 'Cashback up to 50%', code: '7DV90K', category: 'Payment', until: '31 Dec 2026', discount: 20,
    desc: 'Pay with any partner e-wallet and get cashback on your tickets.', from: '#FF3D54', to: '#FF9F43',
    terms: ['Valid for all movies and all Sinéfolis locations.', 'Discount is applied to the ticket subtotal.', 'One use per account per day.', 'Cannot be combined with other promotions.'],
  },
  {
    id: 'p2', title: 'Weekday deal 10% off', code: '5009KS', category: 'Movies', until: '30 Nov 2026', discount: 10,
    desc: 'Every Monday to Thursday, for all regular 2D screenings.', from: '#7B5CFF', to: '#3DE3FF',
    terms: ['Valid Monday to Thursday only.', 'Regular 2D screenings only.', 'Maximum 4 tickets per transaction.'],
  },
  {
    id: 'p3', title: 'Popcorn combo 35% off', code: '1235BN', category: 'Food & Beverage', until: '15 Nov 2026',
    desc: 'Large popcorn + 2 soft drinks, valid at all locations.', from: '#FFC94D', to: '#FF6B3D',
    terms: ['Show this code at the snack counter.', 'Valid for one combo per ticket purchased.', 'Not valid for online checkout.'],
  },
  {
    id: 'p4', title: 'Student Tuesday 15% off', code: 'STUDNT', category: 'Movies', until: '31 Dec 2026', discount: 15,
    desc: 'Discounted tickets every Tuesday with a valid student card.', from: '#3DE3FF', to: '#5BE49B',
    terms: ['Valid on Tuesdays only.', 'Student card must be shown at the entrance.', 'One ticket per student card.'],
  },
  {
    id: 'p5', title: 'Bank partner 25% off', code: 'BANK25', category: 'Payment', until: '30 Nov 2026', discount: 25,
    desc: 'Use partner bank credit or debit cards at checkout.', from: '#FF2E93', to: '#7B5CFF',
    terms: ['Pay with a partner bank card to use this code.', 'Maximum discount Rp 50.000 per transaction.', 'Valid for all screenings.'],
  },
  {
    id: 'p6', title: 'Birthday free ticket', code: 'HBDSNF', category: 'Event', until: '31 Dec 2026',
    desc: 'One free regular ticket in your birthday month for members.', from: '#5BE49B', to: '#3DE3FF',
    terms: ['Members only. Sign in to claim.', 'Valid during your birthday month.', 'Regular 2D screenings only.'],
  },
]

// iklan besar yang bergeser di Home & halaman Promotions
export const ads = [
  { id: 'a1', eyebrow: 'Limited time', title: 'Midnight premiere week', desc: 'Catch the biggest releases first, every Friday at 00:01.', cta: 'See schedule', href: '/#movies', from: '#FF3D54', via: '#FF2E93', to: '#7B5CFF' },
  { id: 'a2', eyebrow: 'Snack deal', title: 'Popcorn combo 35% off', desc: 'Large popcorn + 2 drinks with code 1235BN.', cta: 'Get the deal', href: '/promotions', from: '#FF9F43', via: '#FF6B3D', to: '#FF2E93' },
  { id: 'a3', eyebrow: 'New at Senayan Park', title: 'Premiere recliner lounge', desc: 'Fully reclining seats, blankets, and in-seat service.', cta: 'Explore', href: '/#cinemas', from: '#3DE3FF', via: '#7B5CFF', to: '#FF2E93' },
]

// ---------- ulasan penonton (Tahap 7: diganti endpoint TMDB /movie/{id}/reviews) ----------
export const reviews = [
  { id: 'r1', name: 'Marissa Ang', rating: 5, date: '2 days ago', text: 'A true five-star cinema experience. From the plush seating to the gourmet snacks, it felt like watching a movie in a luxury hotel lounge.' },
  { id: 'r2', name: 'Michelle Alicia', rating: 5, date: '5 days ago', text: 'Elegance meets entertainment. The ambiance, lighting, and service were top-tier. Definitely my go-to place for date nights.' },
  { id: 'r3', name: 'Earlene Santoso', rating: 4, date: '1 week ago', text: 'Exceptional quality and comfort. Every detail, from the sound system to the scent in the air, feels curated. Worth every penny.' },
]