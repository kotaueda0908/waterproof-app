import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { FinanceRecord } from '../../types'

const fmt = (n: number | null | undefined) =>
  n != null ? `¥${n.toLocaleString()}` : '―'

const STATUS_STYLE: Record<string, string> = {
  '未入金': 'bg-red-100 text-red-700',
  '一部入金': 'bg-yellow-100 text-yellow-700',
  '完了': 'bg-green-100 text-green-700',
}

interface Props {
  onSelect: (id: string) => void
  onNew: () => void
}

export default function FinanceList({ onSelect, onNew }: Props) {
  const [records, setRecords] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterUnpaid, setFilterUnpaid] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)

  const fetchRecords = useCallback(async () => {
    const { data } = await supabase
      .from('finance_records')
      .select('*')
      .order('contract_date', { ascending: sortAsc, nullsFirst: !sortAsc })
    if (data) setRecords(data as FinanceRecord[])
    setLoading(false)
  }, [sortAsc])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const filtered = records
    .filter(r => !filterUnpaid || r.payment_status === '未入金')
    .filter(r => !search || r.site_name.includes(search))

  return (
    <div>
      {/* 検索・フィルタ */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="物件名で検索"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterUnpaid(f => !f)}
            className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${
              filterUnpaid
                ? 'bg-red-50 text-red-600 border-red-300 font-medium'
                : 'text-gray-500 border-gray-300'
            }`}
          >
            未入金のみ
          </button>
          <button
            onClick={() => setSortAsc(a => !a)}
            className="flex-1 py-2 text-sm rounded-xl border text-gray-500 border-gray-300"
          >
            {sortAsc ? '古い順 ↑' : '新しい順 ↓'}
          </button>
          <button
            onClick={onNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:bg-blue-700 whitespace-nowrap"
          >
            ＋ 追加
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-8 text-sm">読み込み中...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">データがありません</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left active:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[r.payment_status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {r.payment_status}
                    </span>
                    {r.contract_date && (
                      <span className="text-xs text-gray-400">
                        {r.contract_date.replace(/-/g, '/')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base leading-tight">
                    {r.site_name}
                  </h3>
                  {r.contract_amount != null && (
                    <p className="text-sm text-blue-600 font-medium mt-0.5">
                      {fmt(r.contract_amount)}
                    </p>
                  )}
                </div>
                <span className="text-gray-300 text-xl mt-1">›</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
