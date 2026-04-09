import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Schedule } from '../../types'

const METHODS = [
  'ウレタン防水',
  '塩ビシート防水',
  'シール工事',
  '長尺シート',
  'FRP防水',
  'その他',
]

interface Props {
  schedule: Schedule | null
  defaultDate?: string
  onClose: () => void
}

export default function ScheduleForm({ schedule, defaultDate, onClose }: Props) {
  const today = defaultDate ?? new Date().toISOString().slice(0, 10)

  const [form, setForm] = useState({
    site_name: '',
    date: today,
    assignee: '',
    address: '',
    method: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (schedule) {
      setForm({
        site_name: schedule.site_name,
        date: schedule.date,
        assignee: schedule.assignee ?? '',
        address: schedule.address ?? '',
        method: schedule.method ?? '',
        notes: schedule.notes ?? '',
      })
    }
  }, [schedule])

  const set = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async () => {
    if (!form.site_name.trim()) { setError('現場名を入力してください'); return }
    if (!form.date) { setError('日付を入力してください'); return }
    setError('')
    setSaving(true)

    const payload = {
      site_name: form.site_name.trim(),
      date: form.date,
      assignee: form.assignee.trim() || null,
      address: form.address.trim() || null,
      method: form.method || null,
      notes: form.notes.trim() || null,
    }

    if (schedule) {
      await supabase.from('schedules').update(payload).eq('id', schedule.id)
    } else {
      await supabase.from('schedules').insert(payload)
    }

    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-2xl p-5 max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {schedule ? '予定を編集' : '新しい予定を追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 text-xl w-8 h-8 flex items-center justify-center">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* 現場名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現場名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.site_name}
              onChange={e => set('site_name', e.target.value)}
              placeholder="例: 〇〇マンション屋上防水"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 日付 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 工法タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">工法</label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => set('method', form.method === m ? '' : m)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    form.method === m
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-600 border-gray-300 active:bg-gray-50'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 担当者 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">担当者</label>
            <input
              type="text"
              value={form.assignee}
              onChange={e => set('assignee', e.target.value)}
              placeholder="例: 田中"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 住所 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所 <span className="text-xs text-gray-400">（タップでGoogleマップ）</span>
            </label>
            <input
              type="text"
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="例: 東京都渋谷区〇〇1-2-3"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ・備考</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="特記事項・注意点など"
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full mt-5 bg-blue-600 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50 active:bg-blue-700 transition-colors"
        >
          {saving ? '保存中...' : '保存する'}
        </button>
      </div>
    </div>
  )
}
