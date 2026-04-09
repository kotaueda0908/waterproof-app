import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import SchedulePage from './pages/SchedulePage'
import AttendancePage from './pages/AttendancePage'
import WakeCheckPage from './pages/WakeCheckPage'
import FunPage from './pages/FunPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="/schedule" replace />} />
          <Route path="/schedule"   element={<SchedulePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/wakecheck"  element={<WakeCheckPage />} />
          <Route path="/fun"        element={<FunPage />} />
          <Route path="/admin"      element={<AdminPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
