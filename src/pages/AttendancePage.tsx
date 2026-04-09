import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, Attendance } from '../types'

export default function AttendancePage() {
  const todayStr = new Date().toISOString().slice(0, 10)
  const now = new Date()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([])
  const [tab, setTab] = useState<'today' | 'monthly'>('today')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)

  // 月別集計
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1)
  const [monthlyData, setMonthlyData] = useState<{ date: string; count: number }[]>([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)

  const fetchToday = useCallback(async () => {
    const [{ data: emps }, { data: att }] = await Promise.all([
      supabase.from('employees').select('*').eq('is_active', true).order('created_at'),
      supabase.from('attendance').select('*').eq('date', todayStr),
    ])
    if (emps) setEmployees(emps)
    if (att) setTodayAttendance(att)
    setLoading(false)
  }, [todayStr])

  const fetchMonthly = useCallback(async () => {
    const mm = String(viewMonth).padStart(2, '0')
    const start = `${viewYear}-${mm}-01`
    // 月末は翌月1日未満で取得
    const end = new Date(viewYear, viewMonth, 0).toISOString().slice(0, 10)
    const { data } = await supabase
      .from('attendance')
      .select('date')
      .gte('date', start)
      .lte('date', end)

    if (data) {
      const counts: Record<string, number> = {}
      data.forEach(({ date }) => {
        counts[date] = (counts[date] ?? 0) + 1
      })
      const sorted = Object.entries(counts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
      setMonthlyData(sorted)
      setMonthlyTotal(data.length)
    }
  }, [viewYear, viewMonth])

  useEffect(() => { fetchToday() }, [fetchToday])
  useEffect(() => { fetchMonthly() }, [fetchMonthly])

  const handleAttendance = async (employeeId: string) => {
    setSubmitting(employeeId)
    const { error } = await supabase
      .from('attendance')
      .insert({ employee_id: employeeId, date: todayStr })
    if (!error) await fetchToday()
    setSubmitting(null)
  }

  const isCheckedIn = (id: string) => todayAttendance.some(a => a.employee_id === id)

  const todayLabel = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-30">
        <h1 className="text-lg font-bold">出勤管理（人工カウント）</h1>
      </div>

      {/* タブ */}
      <div className="flex bg-white border-b sticky top-[52px] z-20">
        <button
          onClick={() => setTab('today')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'today' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          本日の出勤
        </button>
        <button
          onClick={() => setTab('monthly')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'monthly' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          月別集計
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-sm">読み込み中...</div>
        </div>
      ) : tab === 'today' ? (
        <div className="px-4 py-4">
          <p className="text-xs text-gray-500 mb-3">{todayLabel}</p>

          {/* サマリーカード */}
          <div className="bg-blue-600 text-white rounded-2xl p-5 mb-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-blue-200 text-sm">本日の出勤人数</p>
              <p className="text-4xl font-bold mt-1">
                {todayAttendance.length}
                <span className="text-xl ml-1 font-normal">人</span>
              </p>
            </div>
            <div className="text-5xl opacity-30">👷</div>
          </div>

          {/* 従業員リスト */}
          {employees.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              管理画面から従業員を登録してください
            </p>
          ) : (
            <div className="space-y-2">
              {employees.map(emp => {
                const checked = isCheckedIn(emp.id)
                const isLoading = submitting === emp.id
                return (
                  <div
                    key={emp.id}
                    className={`bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border transition-colors ${
                      checked ? 'border-green-200 bg-green-50' : 'border-gray-100'
                    }`}
                  >
                    <span className="font-medium text-gray-800">{emp.name}</span>
                    {checked ? (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <span>✓</span> 出勤済み
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAttendance(emp.id)}
                        disabled={isLoading}
                        className="bg-blue-600 text-white text-sm px-5 py-2 rounded-xl font-bold disabled:opacity-50 active:bg-blue-700 transition-colors"
                      >
                        {isLoading ? '...' : '今日出勤'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-4">
          {/* 月ナビゲーション */}
          <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
              ‹
            </button>
            <span className="font-bold text-gray-800">{viewYear}年{viewMonth}月</span>
            <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
              ›
            </button>
          </div>

          {/* 月間合計 */}
          <div className="bg-blue-600 text-white rounded-2xl p-5 mb-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-blue-200 text-sm">{viewYear}年{viewMonth}月 合計</p>
              <p className="text-4xl font-bold mt-1">
                {monthlyTotal}
                <span className="text-xl ml-1 font-normal">人工</span>
              </p>
            </div>
            <div className="text-5xl opacity-30">📊</div>
          </div>

          {/* 日別内訳 */}
          {monthlyData.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">データがありません</p>
          ) : (
            <div className="space-y-2">
              {monthlyData.map(({ date, count }) => {
                const d = new Date(date + 'T00:00:00')
                return (
                  <div
                    key={date}
                    className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-gray-100"
                  >
                    <span className="text-sm text-gray-700">
                      {d.toLocaleDateString('ja-JP', {
                        month: 'long', day: 'numeric', weekday: 'short',
                      })}
                    </span>
                    <span className="font-bold text-blue-600 text-base">{count}人</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
