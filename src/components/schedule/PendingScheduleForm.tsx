import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { PendingSchedule } from '../../types'

const METHODS = ['ウレタン通気緩衝', '塩ビシート機械固定', 'FRP', 'その他']
const SCALES = ['小規模', '中規模', '大規模', '不明']
const PRIORITIES = ['高', '中', '低', '未設定']

const PRIORITY_ACTIVE: Record<string, string> = {
  '高': 'bg-red-500 text-white border-red-500',
  '中': 'bg-orange-400 text-white border-orange-400',
  '低': 'bg-green-500 text-white border-green-500',
  '未設定': 'bg-gray-400 text-white border-gray-400',
}

interface Props {
  pending: PendingSchedule | null
  onClose: () => void
}

export default function PendingScheduleForm({ pending, onClose }: Props) {
  const [form, setForm] = useState({
    site_name: '',
    client: '',
    scale: '不明',
    priority: '未設定',
    methods: [] as string[],
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (pending) {
      setForm({
        site_name: pending.site_name ?? '',
        client: pending.client ?? '',
        scale: pending.scale ?? '不明',
        priority: pending.priority ?? '未設定',
        methods: pending.methods ?? [],
        notes: pending.notes ?? '',
      })
    }
  }, [pending])

  const toggleMethod = (m: string) =>
    setForm(f => ({
      ...f,
      methods: f.methods.includes(m) ? f.methods.filter(x => x !== m) : [...f.methods, m],
    }))

  const handleSubmit = async () => {
    setSaving(true)
    const payload = {
      site_name: form.site_name.trim() || null,
      client: form.client.trim() || null,
      scale: form.scale || null,
      priority: form.priority || null,
      methods: form.methods.length > 0 ? form.methods : null,
      notes: form.notes.trim() || null,
    }
    if (pending) {
      await supabase.from('pending_schedules').update(payload).eq('id', pending.id)
    } else {
      await supabase.from('pending_schedules').insert(payload)
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {pending ? '未定予定を編集' : '未定予定を追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 text-xl w-8 h-8 flex items-center justify-center">
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-4">すべて空白でも保存できます</p>

        <div className="space-y-4">
          {/* 物件名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">物件名</label>
            <input
              type="text"
              value={form.site_name}
              onChange={e => setForm(f => ({ ...f, site_name: e.target.value }))}
              placeholder="例: ○○マンション"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 客先 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">客先</label>
            <input
              type="text"
              value={form.client}
              onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
              placeholder="例: 株式会社○○"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 想定規模 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">想定規模</label>
            <div className="flex gap-2 flex-wrap">
              {SCALES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, scale: s }))}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    form.scale === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-600 border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 優先度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
            <div className="flex gap-2 flex-wrap">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    form.priority === p
                      ? PRIORITY_ACTIVE[p]
                      : 'text-gray-600 border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 予定工法（複数選択） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              予定工法 <span className="text-xs text-gray-400 font-normal">（複数選択可）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMethod(m)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    form.methods.includes(m)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-600 border-gray-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="備考・注意点など"
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
