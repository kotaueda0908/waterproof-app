import { useState, useEffect } from 'react'
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

interface WeatherInfo { icon: string; temp: number }

function codeToIcon(code: number): string {
  if (code === 0)              return '☀️'
  if (code === 1)              return '🌤️'
  if (code === 2)              return '⛅'
  if (code === 3)              return '☁️'
  if (code <= 48)              return '🌫️'
  if (code <= 55)              return '🌦️'
  if (code <= 67)              return '🌧️'
  if (code <= 77)              return '❄️'
  if (code <= 82)              return '🌧️'
  if (code <= 99)              return '⛈️'
  return '🌡️'
}

export default function ScheduleCalendar({ schedules, selectedDate, onSelectDate }: Props) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [weather, setWeather] = useState<Record<string, WeatherInfo>>({})

  // Open-Meteo API（無料・APIキー不要）神奈川県
  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=35.45&longitude=139.64' +
      '&daily=weathercode,temperature_2m_max' +
      '&timezone=Asia%2FTokyo&forecast_days=14&past_days=7'
    )
      .then(r => r.json())
      .then(data => {
        const map: Record<string, WeatherInfo> = {}
        data.daily.time.forEach((date: string, i: number) => {
          map[date] = {
            icon: codeToIcon(data.daily.weathercode[i]),
            temp: Math.round(data.daily.temperature_2m_max[i]),
          }
        })
        setWeather(map)
      })
      .catch(() => {/* 天気取得失敗は無視 */})
  }, [])

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth    = new Date(year, month + 1, 0).getDate()
  const todayStr       = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const scheduleCounts: Record<string, number> = {}
  schedules.forEach(s => { scheduleCounts[s.date] = (scheduleCounts[s.date] ?? 0) + 1 })

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  return (
    <div className="bg-white px-2 pt-3 pb-4 shadow-sm">
      {/* 月ナビ */}
      <div className="flex items-center justify-between mb-2 px-2">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100 text-xl">‹</button>
        <button onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()) }}
          className="font-bold text-gray-800 text-base">
          {year}年{month + 1}月
        </button>
        <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100 text-xl">›</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={d} className={`text-center text-xs font-medium py-0.5 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day    = i + 1
          const dateStr = toDateStr(year, month, day)
          const count  = scheduleCounts[dateStr] ?? 0
          const isToday    = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          const dow    = (firstDayOfWeek + i) % 7
          const w      = weather[dateStr]

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`flex flex-col items-center py-1 rounded-lg mx-0.5 transition-colors active:scale-95 ${
                isSelected ? 'bg-blue-600' : isToday ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              {/* 日付 */}
              <span className={`text-xs font-medium leading-none ${
                isSelected ? 'text-white' : dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-700'
              }`}>
                {day}
              </span>

              {/* 天気アイコン */}
              {w ? (
                <>
                  <span style={{ fontSize: '10px', lineHeight: 1.2 }}>{w.icon}</span>
                  <span className={`leading-none ${isSelected ? 'text-blue-100' : 'text-gray-400'}`} style={{ fontSize: '8px' }}>
                    {w.temp}°
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '10px', lineHeight: 1.2 }} className="opacity-0">{'　'}</span>
              )}

              {/* 予定ドット */}
              <span className={`w-1 h-1 rounded-full mt-0.5 ${
                count > 0
                  ? isSelected ? 'bg-white' : 'bg-blue-500'
                  : 'bg-transparent'
              }`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
