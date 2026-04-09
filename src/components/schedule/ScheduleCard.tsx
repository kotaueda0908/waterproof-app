import type { Schedule } from '../../types'

const METHOD_COLORS: Record<string, string> = {
  'ウレタン防水':   'bg-orange-100 text-orange-700',
  '塩ビシート防水': 'bg-green-100 text-green-700',
  'シール工事':     'bg-purple-100 text-purple-700',
  '長尺シート':     'bg-yellow-100 text-yellow-700',
  'FRP防水':        'bg-red-100 text-red-700',
  'その他':         'bg-gray-100 text-gray-700',
}

interface Props {
  schedule: Schedule
  onEdit: () => void
  onDelete: () => void
}

export default function ScheduleCard({ schedule, onEdit, onDelete }: Props) {
  const methodColor = schedule.method
    ? (METHOD_COLORS[schedule.method] ?? 'bg-gray-100 text-gray-700')
    : null

  const openMap = () => {
    if (schedule.address) {
      window.open(
        `https://maps.google.com/maps?q=${encodeURIComponent(schedule.address)}`,
        '_blank'
      )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs text-gray-400 font-medium">
              {schedule.date.replace(/-/g, '/')}
            </span>
            {schedule.method && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${methodColor}`}>
                {schedule.method}
              </span>
            )}
          </div>
          <h3 className="font-bold text-gray-800 text-base leading-tight">
            {schedule.site_name}
          </h3>
          {schedule.assignee && (
            <p className="text-sm text-gray-500 mt-1">担当: {schedule.assignee}</p>
          )}
          {schedule.address && (
            <button
              onClick={openMap}
              className="flex items-center gap-1 text-sm text-blue-600 mt-1.5 underline text-left"
            >
              <span>📍</span>
              <span className="truncate">{schedule.address}</span>
            </button>
          )}
          {schedule.notes && (
            <p className="text-sm text-gray-400 mt-1 leading-snug">{schedule.notes}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="text-xs px-3 py-1.5 text-blue-600 border border-blue-300 rounded-lg active:bg-blue-50"
          >
            編集
          </button>
          <button
            onClick={onDelete}
            className="text-xs px-3 py-1.5 text-red-500 border border-red-300 rounded-lg active:bg-red-50"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  )
}
