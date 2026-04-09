import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Employee, WakeCheckWithEmployee } from '../types'

export default function WakeCheckPage() {
  const todayStr = new Date().toISOString().slice(0, 10)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [checks, setChecks] = useState<WakeCheckWithEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const [{ data: emps }, { data: wakes }] = await Promise.all([
      supabase.from('employees').select('*').eq('is_active', true).order('created_at'),
      supabase
        .from('wake_checks')
        .select('*, employees(*)')
        .eq('date', todayStr)
        .order('checked_at'),
    ])
    if (emps) setEmployees(emps)
    if (wakes) setChecks(wakes as WakeCheckWithEmployee[])
    setLoading(false)
  }, [todayStr])

  useEffect(() => { fetchData() }, [fetchData])

  const handleWakeCheck = async (employeeId: string) => {
    setSubmitting(employeeId)
    const { error } = await supabase.from('wake_checks').insert({
      employee_id: employeeId,
      date: todayStr,
      checked_at: new Date().toISOString(),
    })
    if (!error) await fetchData()
    setSubmitting(null)
  }

  const getCheck = (id: string) => checks.find(c => c.employee_id === id)
  const isChecked = (id: string) => !!getCheck(id)

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })

  const todayLabel = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const uncheckedCount = employees.length - checks.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-30">
        <h1 className="text-lg font-bold">朝の起床確認</h1>
        <p className="text-xs text-blue-200 mt-0.5">{todayLabel}</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-sm">読み込み中...</div>
        </div>
      ) : (
        <div className="px-4 py-4">
          {/* サマリーカード */}
          <div className="bg-blue-600 text-white rounded-2xl p-5 mb-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">起床確認済み</p>
                <p className="text-4xl font-bold mt-1">
                  {checks.length}
                  <span className="text-xl ml-1 font-normal">/ {employees.length}人</span>
                </p>
              </div>
              <div className="text-5xl opacity-30">⏰</div>
            </div>
            {uncheckedCount > 0 && (
              <p className="text-sm text-orange-200 mt-2">
                未確認: {uncheckedCount}人
              </p>
            )}
            {uncheckedCount === 0 && employees.length > 0 && (
              <p className="text-sm text-green-200 mt-2">
                全員確認完了！
              </p>
            )}
          </div>

          {/* 従業員ボタン一覧 */}
          {employees.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">
              管理画面から従業員を登録してください
            </p>
          ) : (
            <div className="space-y-3">
              {employees.map(emp => {
                const check = getCheck(emp.id)
                const checked = !!check
                const isLoading = submitting === emp.id
                return (
                  <div
                    key={emp.id}
                    className={`bg-white rounded-xl shadow-sm border p-4 transition-colors ${
                      checked ? 'border-green-200 bg-green-50' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800 text-base">{emp.name}</p>
                        {check && (
                          <p className="text-sm text-green-600 mt-0.5 flex items-center gap-1">
                            <span>✓</span>
                            <span>{formatTime(check.checked_at)} に確認</span>
                          </p>
                        )}
                      </div>
                      {checked ? (
                        <span className="text-sm text-green-600 font-medium bg-green-100 px-3 py-2 rounded-xl">
                          起きました
                        </span>
                      ) : (
                        <button
                          onClick={() => handleWakeCheck(emp.id)}
                          disabled={isLoading}
                          className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm active:bg-orange-600 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {isLoading ? '...' : '起きました'}
                        </button>
                      )}
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
