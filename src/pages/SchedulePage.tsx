import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Schedule } from '../types'
import ScheduleCalendar from '../components/schedule/ScheduleCalendar'
import ScheduleForm from '../components/schedule/ScheduleForm'
import ScheduleCard from '../components/schedule/ScheduleCard'

type ViewMode = 'calendar' | 'list'

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [view, setView] = useState<ViewMode>('calendar')
  const [showForm, setShowForm] = useState(false)
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSchedules = useCallback(async () => {
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true })
    if (data) setSchedules(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchSchedules() }, [fetchSchedules])

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

  // カレンダー: 選択日でフィルタ / リスト: 全件
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
    <div className="min-h-screen bg-gray-50">
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
            {/* 選択日フィルター表示 */}
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
        </>
      )}

      {/* FAB（追加ボタン） */}
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

      {/* フォームモーダル */}
      {showForm && (
        <ScheduleForm
          schedule={editSchedule}
          defaultDate={selectedDate ?? undefined}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}
