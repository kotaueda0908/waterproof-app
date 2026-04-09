import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, Attendance } from '../types'

const WAGE_STORAGE_KEY = 'attendance_daily_wages'

function loadWages(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(WAGE_STORAGE_KEY) ?? '{}') } catch { return {} }
}
function saveWages(wages: Record<string, string>) {
  localStorage.setItem(WAGE_STORAGE_KEY, JSON.stringify(wages))
}

export default function AttendancePage() {
  const todayStr = new Date().toISOString().slice(0, 10)
  const now = new Date()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [todayAttendance, setTodayAttendance] = useState<Attendance[]>([])
  const [tab, setTab] = useState<'today' | 'monthly' | 'employee'>('today')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)

  // 月別集計
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1)
  const [monthlyData, setMonthlyData] = useState<{ date: string; count: number }[]>([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)

  // 従業員別集計
  const [empMonthly, setEmpMonthly] = useState<{ id: string; name: string; days: number }[]>([])
  const [dailyWages, setDailyWages] = useState<Record<string, string>>(loadWages)

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
    const end = new Date(viewYear, viewMonth, 0).toISOString().slice(0, 10)
    const [{ data: emps }, { data: att }] = await Promise.all([
      supabase.from('employees').select('*').eq('is_active', true).order('created_at'),
      supabase.from('attendance').select('employee_id, date').gte('date', start).lte('date', end),
    ])

    if (att) {
      const counts: Record<string, number> = {}
      att.forEach(({ date }) => { counts[date] = (counts[date] ?? 0) + 1 })
      const sorted = Object.entries(counts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
      setMonthlyData(sorted)
      setMonthlyTotal(att.length)

      if (emps) {
        const empCounts: Record<string, number> = {}
        att.forEach(({ employee_id }) => { empCounts[employee_id] = (empCounts[employee_id] ?? 0) + 1 })
        const result = emps.map(e => ({ id: e.id, name: e.name, days: empCounts[e.id] ?? 0 }))
        setEmpMonthly(result)
      }
    }
  }, [viewYear, viewMonth])

  const handleWageChange = (empId: string, value: string) => {
    const next = { ...dailyWages, [empId]: value }
    setDailyWages(next)
    saveWages(next)
  }

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

  const handleCancelAttendance = async (employeeId: string) => {
    if (!confirm('出勤を取り消しますか？')) return
    setSubmitting(employeeId)
    await supabase
      .from('attendance')
      .delete()
      .eq('employee_id', employeeId)
      .eq('date', todayStr)
    await fetchToday()
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
        {(['today', 'monthly', 'employee'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            {t === 'today' ? '本日の出勤' : t === 'monthly' ? '月別集計' : '従業員別'}
          </button>
        ))}
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <span>✓</span> 出勤済み
                        </span>
                        <button
                          onClick={() => handleCancelAttendance(emp.id)}
                          disabled={isLoading}
                          className="text-xs px-2.5 py-1.5 text-red-500 border border-red-300 rounded-lg active:bg-red-50 disabled:opacity-50"
                        >
                          取消
                        </button>
                      </div>
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
      ) : tab === 'monthly' ? (
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
      ) : (
        /* 従業員別集計 */
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

          {/* 合計給料サマリー */}
          <div className="bg-green-600 text-white rounded-2xl p-5 mb-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-green-200 text-sm">{viewYear}年{viewMonth}月 給料合計</p>
              <p className="text-4xl font-bold mt-1">
                ¥{empMonthly.reduce((sum, e) => {
                  const wage = parseInt(dailyWages[e.id] ?? '0', 10) || 0
                  return sum + e.days * wage
                }, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-5xl opacity-30">💴</div>
          </div>

          {/* 従業員別リスト */}
          {empMonthly.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">データがありません</p>
          ) : (
            <div className="space-y-3">
              {empMonthly.map(emp => {
                const wage = parseInt(dailyWages[emp.id] ?? '0', 10) || 0
                const total = emp.days * wage
                return (
                  <div key={emp.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-800">{emp.name}</span>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        {emp.days}日出勤
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 whitespace-nowrap">日当</label>
                      <div className="flex items-center flex-1 border border-gray-200 rounded-lg overflow-hidden">
                        <span className="px-2 text-gray-400 text-sm">¥</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={dailyWages[emp.id] ?? ''}
                          onChange={e => handleWageChange(emp.id, e.target.value)}
                          placeholder="0"
                          className="flex-1 py-1.5 pr-2 text-sm text-right outline-none"
                        />
                      </div>
                      <span className="text-xs text-gray-400">×{emp.days}日</span>
                      <span className="text-sm font-bold text-green-700 min-w-[80px] text-right">
                        ¥{total.toLocaleString()}
                      </span>
                    </div>
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
