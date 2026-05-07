import type { PendingSchedule } from '../../types'

const PRIORITY_BADGE: Record<string, string> = {
  '高': 'bg-red-100 text-red-700 border border-red-200',
  '中': 'bg-orange-100 text-orange-700 border border-orange-200',
  '低': 'bg-green-100 text-green-700 border border-green-200',
  '未設定': 'bg-gray-100 text-gray-500 border border-gray-200',
}

interface Props {
  pending: PendingSchedule
  onEdit: () => void
  onDelete: () => void
  onConfirmDate: () => void
}

export default function PendingScheduleCard({ pending, onEdit, onDelete, onConfirmDate }: Props) {
  const priorityStyle = pending.priority ? (PRIORITY_BADGE[pending.priority] ?? PRIORITY_BADGE['未設定']) : PRIORITY_BADGE['未設定']

  return (
    <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* バッジ行 */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyle}`}>
              {pending.priority ?? '未設定'}
            </span>
            {pending.scale && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                {pending.scale}
              </span>
            )}
          </div>

          {/* 物件名 */}
          <h3 className="font-bold text-gray-800 text-base leading-tight">
            {pending.site_name || <span className="text-gray-400 font-normal">物件名未定</span>}
          </h3>

          {/* 客先 */}
          {pending.client && (
            <p className="text-sm text-gray-500 mt-0.5">客先: {pending.client}</p>
          )}

          {/* 工法タグ */}
          {pending.methods && pending.methods.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {pending.methods.map(m => (
                <span key={m} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {m}
                </span>
              ))}
            </div>
          )}

          {/* メモ */}
          {pending.notes && (
            <p className="text-xs text-gray-400 mt-1.5 leading-snug">{pending.notes}</p>
          )}
        </div>

        {/* ボタン列 */}
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={onConfirmDate}
            className="text-xs px-2.5 py-1.5 bg-blue-600 text-white rounded-lg active:bg-blue-700 font-medium whitespace-nowrap"
          >
            日付確定
          </button>
          <button
            onClick={onEdit}
            className="text-xs px-2.5 py-1.5 text-blue-600 border border-blue-300 rounded-lg active:bg-blue-50"
          >
            編集
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-2.5 py-1.5 text-red-500 border border-red-300 rounded-lg active:bg-red-50"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}
