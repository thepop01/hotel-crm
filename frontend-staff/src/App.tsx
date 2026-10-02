import { Routes, Route, Navigate } from 'react-router-dom'
import StaffDashboard from './pages/StaffDashboard'
import DashboardHome from './pages/staff/DashboardHome'
import BookingsPage from './pages/staff/BookingsPage'
import OrdersPage from './pages/staff/OrdersPage'
import RoomsPage from './pages/staff/RoomsPage'
import InventoryPage from './pages/staff/InventoryPage'
import ReportsPage from './pages/staff/ReportsPage'
import StaffMgmtPage from './pages/staff/StaffMgmtPage'
import SettingsPage from './pages/staff/SettingsPage'
import POSInterface from './pages/POSInterface'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pos" element={<POSInterface />} />
      <Route path="/" element={<StaffDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="staff-mgmt" element={<StaffMgmtPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
