import { useState } from 'react'
import type { Schedule } from '../../types'

interface Props {
  schedules: Schedule[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土']

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function ScheduleCalendar({ schedules, selectedDate, onSelectDate }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  // 日付ごとの予定数を集計
  const scheduleCounts: Record<string, number> = {}
  schedules.forEach(s => {
    scheduleCounts[s.date] = (scheduleCounts[s.date] ?? 0) + 1
  })

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="bg-white px-4 pt-3 pb-4 shadow-sm">
      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
          ‹
        </button>
        <button
          onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()) }}
          className="font-bold text-gray-800 text-base"
        >
          {year}年{month + 1}月
        </button>
        <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
          ›
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = toDateStr(year, month, day)
          const count = scheduleCounts[dateStr] ?? 0
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const dow = (firstDayOfWeek + i) % 7

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`relative flex flex-col items-center py-1.5 rounded-lg mx-0.5 transition-colors active:scale-95 ${
                isSelected
                  ? 'bg-blue-600'
                  : isToday
                  ? 'bg-blue-50 ring-1 ring-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span
                className={`text-sm leading-none ${
                  isSelected
                    ? 'text-white font-bold'
                    : dow === 0
                    ? 'text-red-500'
                    : dow === 6
                    ? 'text-blue-500'
                    : 'text-gray-700'
                }`}
              >
                {day}
              </span>
              {count > 0 && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? 'bg-white' : 'bg-blue-500'
                  }`}
                />
              )}
              {count === 0 && <span className="w-1.5 h-1.5 mt-0.5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
