import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/schedule',   label: '予定',    icon: '📅' },
  { to: '/attendance', label: '出勤',    icon: '👷' },
  { to: '/wakecheck',  label: '起床',    icon: '⏰' },
  { to: '/fun',        label: 'おたのしみ', icon: '🎰' },
  { to: '/admin',      label: '管理',    icon: '⚙️' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-1.5 transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[9px] font-medium mt-0.5 leading-tight">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
