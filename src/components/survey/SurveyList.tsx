import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

interface SurveyRow {
  id: string
  site_name: string | null
  survey_date: string | null
  surveyor: string | null
  survey_locations: { count: number }[]
}

interface Props {
  onSelect: (id: string) => void
  onNew: () => void
}

export default function SurveyList({ onSelect, onNew }: Props) {
  const [records, setRecords] = useState<SurveyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchRecords = useCallback(async () => {
    const { data } = await supabase
      .from('survey_records')
      .select('id, site_name, survey_date, surveyor, survey_locations(count)')
      .order('survey_date', { ascending: false, nullsFirst: false })
    if (data) setRecords(data as SurveyRow[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const filtered = records.filter(r =>
    !search || (r.site_name ?? '').includes(search)
  )

  return (
    <div>
      {/* 検索・追加 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="物件名で検索"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={onNew}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold active:bg-blue-700 whitespace-nowrap"
        >
          ＋ 新規
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-8 text-sm">読み込み中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">データがありません</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const locationCount = r.survey_locations?.[0]?.count ?? 0
            return (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base leading-tight truncate">
                      {r.site_name || <span className="text-gray-400 font-normal">物件名未設定</span>}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {r.survey_date && (
                        <span className="text-xs text-gray-400">
                          {r.survey_date.replace(/-/g, '/')}
                        </span>
                      )}
                      {r.surveyor && (
                        <span className="text-xs text-gray-500">調査者: {r.surveyor}</span>
                      )}
                      {locationCount > 0 && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {locationCount}箇所
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-300 text-xl mt-1 shrink-0">›</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
