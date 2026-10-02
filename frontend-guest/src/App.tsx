import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GuestPortal from './pages/GuestPortal'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/book" element={<BookingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/guest" element={<GuestPortal />} />
    </Routes>
  )
}
