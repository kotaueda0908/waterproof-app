import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/schedule', label: '現場予定', icon: '📅' },
  { to: '/attendance', label: '出勤', icon: '👷' },
  { to: '/wakecheck', label: '起床確認', icon: '⏰' },
  { to: '/admin', label: '管理', icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          <span className="text-xl mb-0.5">{item.icon}</span>
          <span className="text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
