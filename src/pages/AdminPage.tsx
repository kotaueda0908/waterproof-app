import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, AttendanceWithEmployee, WakeCheckWithEmployee } from '../types'

type Tab = 'employees' | 'attendance' | 'wakecheck'

export default function AdminPage() {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const [tab, setTab] = useState<Tab>('employees')
  const [loading, setLoading] = useState(true)

  // 従業員管理
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newName, setNewName] = useState('')
  const [addingEmployee, setAddingEmployee] = useState(false)

  // 出勤履歴
  const [attYear, setAttYear] = useState(now.getFullYear())
  const [attMonth, setAttMonth] = useState(now.getMonth() + 1)
  const [attHistory, setAttHistory] = useState<AttendanceWithEmployee[]>([])

  // 起床確認履歴
  const [wakeDate, setWakeDate] = useState(todayStr)
  const [wakeHistory, setWakeHistory] = useState<WakeCheckWithEmployee[]>([])

  const fetchEmployees = useCallback(async () => {
    const { data } = await supabase.from('employees').select('*').order('created_at')
    if (data) setEmployees(data)
    setLoading(false)
  }, [])

  const fetchAttHistory = useCallback(async () => {
    const mm = String(attMonth).padStart(2, '0')
    const start = `${attYear}-${mm}-01`
    const end = new Date(attYear, attMonth, 0).toISOString().slice(0, 10)
    const { data } = await supabase
      .from('attendance')
      .select('*, employees(*)')
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false })
    if (data) setAttHistory(data as AttendanceWithEmployee[])
  }, [attYear, attMonth])

  const fetchWakeHistory = useCallback(async () => {
    const { data } = await supabase
      .from('wake_checks')
      .select('*, employees(*)')
      .eq('date', wakeDate)
      .order('checked_at')
    if (data) setWakeHistory(data as WakeCheckWithEmployee[])
  }, [wakeDate])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])
  useEffect(() => { fetchAttHistory() }, [fetchAttHistory])
  useEffect(() => { fetchWakeHistory() }, [fetchWakeHistory])

  const handleAddEmployee = async () => {
    const name = newName.trim()
    if (!name) return
    setAddingEmployee(true)
    await supabase.from('employees').insert({ name })
    setNewName('')
    await fetchEmployees()
    setAddingEmployee(false)
  }

  const handleToggleActive = async (emp: Employee) => {
    await supabase.from('employees').update({ is_active: !emp.is_active }).eq('id', emp.id)
    fetchEmployees()
  }

  const handleDeleteEmployee = async (emp: Employee) => {
    if (!confirm(`「${emp.name}」を削除しますか？\n出勤・起床確認記録も全て削除されます。`)) return
    await supabase.from('employees').delete().eq('id', emp.id)
    fetchEmployees()
  }

  const prevAttMonth = () => {
    if (attMonth === 1) { setAttYear(y => y - 1); setAttMonth(12) }
    else setAttMonth(m => m - 1)
  }
  const nextAttMonth = () => {
    if (attMonth === 12) { setAttYear(y => y + 1); setAttMonth(1) }
    else setAttMonth(m => m + 1)
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'employees', label: '従業員管理' },
    { key: 'attendance', label: '出勤履歴' },
    { key: 'wakecheck', label: '起床履歴' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-30">
        <h1 className="text-lg font-bold">管理</h1>
      </div>

      {/* タブ */}
      <div className="flex bg-white border-b sticky top-[52px] z-20">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${
              tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-sm">読み込み中...</div>
        </div>
      ) : (
        <div className="px-4 py-4">

          {/* ===== 従業員管理 ===== */}
          {tab === 'employees' && (
            <div>
              <p className="text-xs text-gray-500 mb-3">
                登録した従業員が出勤・起床確認画面に表示されます
              </p>

              {/* 追加フォーム */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddEmployee()}
                  placeholder="氏名を入力（例: 田中 太郎）"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddEmployee}
                  disabled={addingEmployee || !newName.trim()}
                  className="bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:bg-blue-700 whitespace-nowrap"
                >
                  追加
                </button>
              </div>

              <div className="space-y-2">
                {employees.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    まだ従業員が登録されていません
                  </p>
                ) : (
                  employees.map(emp => (
                    <div
                      key={emp.id}
                      className={`bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border ${
                        emp.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'
                      }`}
                    >
                      <div>
                        <span
                          className={`font-medium ${
                            emp.is_active ? 'text-gray-800' : 'text-gray-400 line-through'
                          }`}
                        >
                          {emp.name}
                        </span>
                        {!emp.is_active && (
                          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            無効
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(emp)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            emp.is_active
                              ? 'text-gray-500 border-gray-300 active:bg-gray-50'
                              : 'text-green-600 border-green-300 active:bg-green-50'
                          }`}
                        >
                          {emp.is_active ? '無効化' : '有効化'}
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp)}
                          className="text-xs px-3 py-1.5 rounded-lg border text-red-500 border-red-300 active:bg-red-50"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===== 出勤履歴 ===== */}
          {tab === 'attendance' && (
            <div>
              {/* 月ナビゲーション */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <button onClick={prevAttMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
                  ‹
                </button>
                <span className="font-bold text-gray-800">{attYear}年{attMonth}月</span>
                <button onClick={nextAttMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
                  ›
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-3">{attHistory.length}件のレコード</p>

              <div className="space-y-2">
                {attHistory.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">データがありません</p>
                ) : (
                  attHistory.map(att => {
                    const d = new Date(att.date + 'T00:00:00')
                    return (
                      <div
                        key={att.id}
                        className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-gray-100"
                      >
                        <span className="text-sm text-gray-500">
                          {d.toLocaleDateString('ja-JP', {
                            month: 'numeric', day: 'numeric', weekday: 'short',
                          })}
                        </span>
                        <span className="font-medium text-gray-800">{att.employees?.name}</span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* ===== 起床確認履歴 ===== */}
          {tab === 'wakecheck' && (
            <div>
              {/* 日付選択 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                <input
                  type="date"
                  value={wakeDate}
                  onChange={e => setWakeDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 全員の確認状況 */}
              <div className="space-y-2">
                {employees.filter(e => e.is_active).length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    従業員が登録されていません
                  </p>
                ) : (
                  employees
                    .filter(e => e.is_active)
                    .map(emp => {
                      const wake = wakeHistory.find(w => w.employee_id === emp.id)
                      return (
                        <div
                          key={emp.id}
                          className={`bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border ${
                            wake ? 'border-green-200' : 'border-gray-100'
                          }`}
                        >
                          <span className="font-medium text-gray-800">{emp.name}</span>
                          {wake ? (
                            <span className="text-sm text-green-600 font-medium">
                              ✓ {new Date(wake.checked_at).toLocaleTimeString('ja-JP', {
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">未確認</span>
                          )}
                        </div>
                      )
                    })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
