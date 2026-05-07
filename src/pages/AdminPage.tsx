import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, AttendanceWithEmployee, WakeCheckWithEmployee } from '../types'
import { financeAuth } from '../lib/financeAuth'
import FinanceAuth from '../components/finance/FinanceAuth'
import FinanceList from '../components/finance/FinanceList'
import FinanceDetail from '../components/finance/FinanceDetail'
import SurveyList from '../components/survey/SurveyList'
import SurveyDetail from '../components/survey/SurveyDetail'

type Tab = 'employees' | 'att_edit' | 'attendance' | 'wakecheck' | 'finance' | 'survey'
type FinanceView = 'list' | 'detail'
type SurveyView = 'list' | 'detail'

export default function AdminPage() {
  const now = new Date()
  const todayStr = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })

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
  const [attDateFilter, setAttDateFilter] = useState('')
  const [deletingAtt, setDeletingAtt] = useState<string | null>(null)

  // 出勤編集
  const [attEditDate, setAttEditDate] = useState(todayStr)
  const [attEditRecords, setAttEditRecords] = useState<{ employee_id: string }[]>([])
  const [togglingEmp, setTogglingEmp] = useState<string | null>(null)

  // 起床確認履歴
  const [wakeDate, setWakeDate] = useState(todayStr)
  const [wakeHistory, setWakeHistory] = useState<WakeCheckWithEmployee[]>([])

  // 金額管理
  const [financeAuthed, setFinanceAuthed] = useState(() => financeAuth.isAuthenticated())
  const [financeView, setFinanceView] = useState<FinanceView>('list')
  const [selectedFinanceId, setSelectedFinanceId] = useState<string | null>(null)

  // 現調メモ
  const [surveyView, setSurveyView] = useState<SurveyView>('list')
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)

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

  const fetchAttEditRecords = useCallback(async () => {
    const { data } = await supabase
      .from('attendance')
      .select('employee_id')
      .eq('date', attEditDate)
    if (data) setAttEditRecords(data)
  }, [attEditDate])

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
  useEffect(() => { fetchAttEditRecords() }, [fetchAttEditRecords])
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

  const handleDeleteAttendance = async (att: AttendanceWithEmployee) => {
    if (!confirm(`「${att.employees?.name}」${att.date} の出勤記録を削除しますか？`)) return
    setDeletingAtt(att.id)
    await supabase.from('attendance').delete().eq('id', att.id)
    await fetchAttHistory()
    setDeletingAtt(null)
  }

  const handleToggleAttEdit = async (empId: string) => {
    setTogglingEmp(empId)
    const existing = attEditRecords.find(r => r.employee_id === empId)
    if (existing) {
      await supabase.from('attendance').delete().eq('employee_id', empId).eq('date', attEditDate)
    } else {
      await supabase.from('attendance').insert({ employee_id: empId, date: attEditDate })
    }
    await fetchAttEditRecords()
    setTogglingEmp(null)
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
    { key: 'att_edit',  label: '出勤編集' },
    { key: 'attendance', label: '出勤履歴' },
    { key: 'wakecheck', label: '起床履歴' },
    { key: 'finance',   label: '金額管理' },
    { key: 'survey',    label: '現調メモ' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-30">
        <h1 className="text-lg font-bold">管理</h1>
      </div>

      {/* タブ */}
      <div className="flex bg-white border-b sticky top-[52px] z-20 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-shrink-0 flex-1 py-3 text-xs font-medium border-b-2 transition-colors min-w-0 ${
              tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && tab !== 'finance' ? (
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

          {/* ===== 出勤編集 ===== */}
          {tab === 'att_edit' && (
            <div>
              <p className="text-xs text-gray-500 mb-3">日付を選んで出勤を登録・取消できます</p>

              <input
                type="date"
                value={attEditDate}
                onChange={e => setAttEditDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
              />

              <div className="bg-blue-600 text-white rounded-2xl p-4 mb-4 flex items-center justify-between shadow-md">
                <div>
                  <p className="text-blue-200 text-xs">{attEditDate} の出勤</p>
                  <p className="text-3xl font-bold mt-0.5">
                    {attEditRecords.length}
                    <span className="text-base ml-1 font-normal">人</span>
                  </p>
                </div>
                <div className="text-4xl opacity-30">👷</div>
              </div>

              {employees.filter(e => e.is_active).length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">従業員が登録されていません</p>
              ) : (
                <div className="space-y-2">
                  {employees.filter(e => e.is_active).map(emp => {
                    const checked = attEditRecords.some(r => r.employee_id === emp.id)
                    const isLoading = togglingEmp === emp.id
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
                              ✓ 出勤済み
                            </span>
                            <button
                              onClick={() => handleToggleAttEdit(emp.id)}
                              disabled={isLoading}
                              className="text-xs px-2.5 py-1.5 text-red-500 border border-red-300 rounded-lg active:bg-red-50 disabled:opacity-50"
                            >
                              {isLoading ? '...' : '取消'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleToggleAttEdit(emp.id)}
                            disabled={isLoading}
                            className="bg-blue-600 text-white text-sm px-5 py-2 rounded-xl font-bold disabled:opacity-50 active:bg-blue-700"
                          >
                            {isLoading ? '...' : '出勤登録'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== 出勤履歴 ===== */}
          {tab === 'attendance' && (
            <div>
              <div className="flex items-center justify-between mb-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <button onClick={prevAttMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
                  ‹
                </button>
                <span className="font-bold text-gray-800">{attYear}年{attMonth}月</span>
                <button onClick={nextAttMonth} className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-full active:bg-gray-100">
                  ›
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <input
                  type="date"
                  value={attDateFilter}
                  onChange={e => setAttDateFilter(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                {attDateFilter && (
                  <button
                    onClick={() => setAttDateFilter('')}
                    className="text-xs text-gray-500 border border-gray-300 rounded-xl px-3 py-2 active:bg-gray-50"
                  >
                    クリア
                  </button>
                )}
              </div>

              {(() => {
                const filtered = attDateFilter
                  ? attHistory.filter(a => a.date === attDateFilter)
                  : attHistory
                return (
                  <>
                    <p className="text-xs text-gray-500 mb-3">
                      {attDateFilter ? `${attDateFilter} — ` : ''}{filtered.length}件
                    </p>
                    <div className="space-y-2">
                      {filtered.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 text-sm">データがありません</p>
                      ) : (
                        filtered.map(att => {
                          const d = new Date(att.date + 'T00:00:00')
                          return (
                            <div
                              key={att.id}
                              className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-gray-100"
                            >
                              <div>
                                <span className="text-sm text-gray-500">
                                  {d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' })}
                                </span>
                                <span className="ml-3 font-medium text-gray-800">{att.employees?.name}</span>
                              </div>
                              <button
                                onClick={() => handleDeleteAttendance(att)}
                                disabled={deletingAtt === att.id}
                                className="text-xs px-3 py-1.5 rounded-lg border text-red-500 border-red-300 active:bg-red-50 disabled:opacity-50"
                              >
                                {deletingAtt === att.id ? '...' : '削除'}
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {/* ===== 起床確認履歴 ===== */}
          {tab === 'wakecheck' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                <input
                  type="date"
                  value={wakeDate}
                  onChange={e => setWakeDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

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

          {/* ===== 金額管理 ===== */}
          {tab === 'finance' && (
            <div>
              {!financeAuthed ? (
                <FinanceAuth onSuccess={() => setFinanceAuthed(true)} />
              ) : financeView === 'list' ? (
                <FinanceList
                  onSelect={id => { setSelectedFinanceId(id); setFinanceView('detail') }}
                  onNew={() => { setSelectedFinanceId(null); setFinanceView('detail') }}
                />
              ) : (
                <FinanceDetail
                  id={selectedFinanceId}
                  onBack={() => { setFinanceView('list'); setSelectedFinanceId(null) }}
                />
              )}
            </div>
          )}

          {/* ===== 現調メモ ===== */}
          {tab === 'survey' && (
            <div>
              {surveyView === 'list' ? (
                <SurveyList
                  onSelect={id => { setSelectedSurveyId(id); setSurveyView('detail') }}
                  onNew={() => { setSelectedSurveyId(null); setSurveyView('detail') }}
                />
              ) : (
                <SurveyDetail
                  id={selectedSurveyId}
                  onBack={() => { setSurveyView('list'); setSelectedSurveyId(null) }}
                />
              )}
            </div>
          )}

        </div>
      )}
    </div>
  )
}
