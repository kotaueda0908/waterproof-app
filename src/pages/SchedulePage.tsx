import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Schedule, PendingSchedule } from '../types'
import ScheduleCalendar from '../components/schedule/ScheduleCalendar'
import ScheduleForm from '../components/schedule/ScheduleForm'
import ScheduleCard from '../components/schedule/ScheduleCard'
import PendingScheduleForm from '../components/schedule/PendingScheduleForm'
import PendingScheduleCard from '../components/schedule/PendingScheduleCard'

type ViewMode = 'calendar' | 'list'

const PRIORITY_ORDER: Record<string, number> = { '高': 0, '中': 1, '低': 2, '未設定': 3 }

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [view, setView] = useState<ViewMode>('calendar')
  const [showForm, setShowForm] = useState(false)
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 未定スケジュール
  const [pendings, setPendings] = useState<PendingSchedule[]>([])
  const [showPendingForm, setShowPendingForm] = useState(false)
  const [editPending, setEditPending] = useState<PendingSchedule | null>(null)
  const [pendingLoading, setPendingLoading] = useState(true)

  // 日付確定ダイアログ
  const [confirmTarget, setConfirmTarget] = useState<PendingSchedule | null>(null)
  const [confirmDate, setConfirmDate] = useState('')

  const fetchSchedules = useCallback(async () => {
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })
    if (data) setSchedules(data)
    setLoading(false)
  }, [])

  const fetchPendings = useCallback(async () => {
    const { data } = await supabase
      .from('pending_schedules')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setPendings(data as PendingSchedule[])
    setPendingLoading(false)
  }, [])

  useEffect(() => { fetchSchedules() }, [fetchSchedules])
  useEffect(() => { fetchPendings() }, [fetchPendings])

  const handleDelete = async (id: string) => {
    if (!confirm('この予定を削除しますか？')) return
    await supabase.from('schedules').delete().eq('id', id)
    fetchSchedules()
  }

  const handleEdit = (schedule: Schedule) => {
    setEditSchedule(schedule)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditSchedule(null)
    fetchSchedules()
  }

  const handleSelectDate = (date: string) => {
    setSelectedDate(prev => (prev === date ? null : date))
  }

  const switchView = (v: ViewMode) => {
    setView(v)
    if (v === 'list') setSelectedDate(null)
  }

  // 未定スケジュール操作
  const handleDeletePending = async (id: string) => {
    if (!confirm('この未定予定を削除しますか？')) return
    await supabase.from('pending_schedules').delete().eq('id', id)
    fetchPendings()
  }

  const handlePendingFormClose = () => {
    setShowPendingForm(false)
    setEditPending(null)
    fetchPendings()
  }

  // 日付確定: ダイアログを開く
  const handleOpenConfirm = (pending: PendingSchedule) => {
    setConfirmTarget(pending)
    setConfirmDate(new Date().toISOString().slice(0, 10))
  }

  // 日付確定: schedules に移動して pending を削除
  const handleConfirmDate = async () => {
    if (!confirmTarget || !confirmDate) return
    await supabase.from('schedules').insert({
      site_name: confirmTarget.site_name || '（未定）',
      date: confirmDate,
      method: confirmTarget.methods?.[0] ?? null,
      assignee: null,
      address: null,
      notes: confirmTarget.notes ?? null,
    })
    await supabase.from('pending_schedules').delete().eq('id', confirmTarget.id)
    await fetchSchedules()
    await fetchPendings()
    // カレンダービューに切り替えて確定日を選択
    setView('calendar')
    setSelectedDate(confirmDate)
    setConfirmTarget(null)
    setConfirmDate('')
  }

  const sortedPendings = [...pendings].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority ?? '未設定'] ?? 3
    const pb = PRIORITY_ORDER[b.priority ?? '未設定'] ?? 3
    return pa - pb
  })

  const displayedSchedules =
    view === 'calendar' && selectedDate
      ? schedules.filter(s => s.date === selectedDate)
      : view === 'list'
      ? schedules
      : []

  const showEmptyMsg =
    view === 'calendar' && !selectedDate
      ? '日付を選択すると予定が表示されます'
      : displayedSchedules.length === 0
      ? '予定がありません'
      : null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ヘッダー */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-lg font-bold">現場予定</h1>
        <div className="flex gap-1 bg-blue-700 rounded-lg p-0.5">
          <button
            onClick={() => switchView('calendar')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              view === 'calendar' ? 'bg-white text-blue-600 font-medium' : 'text-white'
            }`}
          >
            カレンダー
          </button>
          <button
            onClick={() => switchView('list')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              view === 'list' ? 'bg-white text-blue-600 font-medium' : 'text-white'
            }`}
          >
            一覧
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-sm">読み込み中...</div>
        </div>
      ) : (
        <>
          {view === 'calendar' && (
            <ScheduleCalendar
              schedules={schedules}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}

          <div className="px-4 py-3">
            {view === 'calendar' && selectedDate && (
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-700 text-sm">
                  {selectedDate.replace(/-/g, '/')} の予定
                  <span className="ml-2 text-blue-600">({displayedSchedules.length}件)</span>
                </h2>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full"
                >
                  解除
                </button>
              </div>
            )}

            {showEmptyMsg ? (
              <p className="text-center text-gray-400 py-12 text-sm">{showEmptyMsg}</p>
            ) : (
              <div className="space-y-3 pb-4">
                {displayedSchedules.map(schedule => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={() => handleEdit(schedule)}
                    onDelete={() => handleDelete(schedule.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ─── 未定スケジュールセクション ─── */}
          <div className="mt-2 border-t border-gray-200">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-700 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
                  未定スケジュール
                  {!pendingLoading && sortedPendings.length > 0 && (
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      {sortedPendings.length}件
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">施工日未確定の受注済み現場</p>
              </div>
              <button
                onClick={() => {
                  setEditPending(null)
                  setShowPendingForm(true)
                }}
                className="bg-orange-400 text-white px-3 py-1.5 rounded-xl text-sm font-bold active:bg-orange-500"
              >
                ＋ 追加
              </button>
            </div>

            <div className="px-4 pb-4">
              {pendingLoading ? (
                <p className="text-center text-gray-400 py-6 text-sm">読み込み中...</p>
              ) : sortedPendings.length === 0 ? (
                <p className="text-center text-gray-400 py-6 text-sm">未定の現場はありません</p>
              ) : (
                <div className="space-y-3">
                  {sortedPendings.map(p => (
                    <PendingScheduleCard
                      key={p.id}
                      pending={p}
                      onEdit={() => { setEditPending(p); setShowPendingForm(true) }}
                      onDelete={() => handleDeletePending(p.id)}
                      onConfirmDate={() => handleOpenConfirm(p)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* FAB（通常予定追加） */}
      <button
        onClick={() => {
          setEditSchedule(null)
          setShowForm(true)
        }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl z-30 active:scale-95 transition-transform"
        aria-label="予定を追加"
      >
        +
      </button>

      {/* 通常予定フォーム */}
      {showForm && (
        <ScheduleForm
          schedule={editSchedule}
          defaultDate={selectedDate ?? undefined}
          onClose={handleFormClose}
        />
      )}

      {/* 未定予定フォーム */}
      {showPendingForm && (
        <PendingScheduleForm
          pending={editPending}
          onClose={handlePendingFormClose}
        />
      )}

      {/* 日付確定ダイアログ */}
      {confirmTarget && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          onClick={() => setConfirmTarget(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-800 mb-1">日付を確定する</h3>
            <p className="text-sm text-gray-500 mb-4 truncate">
              {confirmTarget.site_name || '物件名未定'}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">施工日</label>
            <input
              type="date"
              value={confirmDate}
              onChange={e => setConfirmDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-5"
            />

            <p className="text-xs text-gray-400 mb-4">
              確定するとカレンダーの予定に移動し、この未定リストから削除されます。
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-sm text-gray-600 active:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDate}
                disabled={!confirmDate}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold disabled:opacity-50 active:bg-blue-700"
              >
                確定する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
