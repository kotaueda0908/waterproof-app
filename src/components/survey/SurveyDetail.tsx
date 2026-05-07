import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { SurveyRecord, SurveyLocation } from '../../types'

// ─── 定数 ────────────────────────────────────────────────────
const METHODS = ['ウレタン通気緩衝', '塩ビシート機械固定', 'FRP', 'その他']
const URGENCIES = ['高', '中', '低', '未設定']

// ─── ローカル行型 ─────────────────────────────────────────────
type LocationRow = {
  _key: string
  id?: string
  name: string
  dimensions_note: string
  existing_spec: string
  deterioration: string
  methods: string[]
  methods_other: string
  rising_height: string
  expansion_joint: string
  drain_count: string
  drain_diameter: string
  degassing_count: string
  fence_count: string
  ac_count: string
  other_attachments: string
  special_notes: string
}

const newLocation = (): LocationRow => ({
  _key: `tmp_${Date.now()}_${Math.random()}`,
  name: '',
  dimensions_note: '',
  existing_spec: '',
  deterioration: '',
  methods: [],
  methods_other: '',
  rising_height: '',
  expansion_joint: '',
  drain_count: '',
  drain_diameter: '',
  degassing_count: '',
  fence_count: '',
  ac_count: '',
  other_attachments: '',
  special_notes: '',
})

// ─── MethodChips ─────────────────────────────────────────────
function MethodChips({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (m: string) =>
    onChange(selected.includes(m) ? selected.filter(x => x !== m) : [...selected, m])
  return (
    <div className="flex flex-wrap gap-2">
      {METHODS.map(m => (
        <button
          key={m}
          type="button"
          onClick={() => toggle(m)}
          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
            selected.includes(m)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-600 border-gray-300'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}

// ─── セクションヘッダー ───────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-bold text-gray-700 text-sm mb-3">{children}</h3>
}

// ─── テキストコピー生成 ────────────────────────────────────────
function buildCopyText(
  form: ReturnType<typeof initForm>,
  locations: LocationRow[]
): string {
  const lines: string[] = []
  const add = (label: string, val: string | null | undefined) => {
    if (val) lines.push(`${label}：${val}`)
  }

  lines.push('━━━━━━━━━━━━')
  lines.push('【現地調査シート】')
  lines.push('━━━━━━━━━━━━')
  add('■ 物件名', form.site_name)
  add('■ 住所', form.address)
  if (form.survey_date) add('■ 調査日', form.survey_date.replace(/-/g, '/'))
  add('■ 調査者', form.surveyor)
  add('■ 客先', form.client)

  lines.push('')
  lines.push('【全体】')
  add('建物階数', form.building_floors)
  add('工事希望時期', form.desired_timing)
  add('緊急度', form.urgency !== '未設定' ? form.urgency : null)
  if (form.methods.length > 0) {
    const methodStr = buildMethodStr(form.methods, form.methods_other)
    lines.push(`予定工法：${methodStr}`)
  }
  add('全体メモ', form.overall_notes)

  locations.forEach((loc, i) => {
    lines.push('')
    lines.push('━━━━━━━━━━━━')
    lines.push(`【箇所${i + 1}】${loc.name || '（名称未設定）'}`)
    add('寸法', loc.dimensions_note)
    add('既存仕様', loc.existing_spec)
    add('劣化状況', loc.deterioration)
    if (loc.methods.length > 0) {
      lines.push(`予定工法：${buildMethodStr(loc.methods, loc.methods_other)}`)
    }
    if (loc.rising_height) add('立上り', `${loc.rising_height}m`)
    if (loc.expansion_joint) add('伸縮目地', `${loc.expansion_joint}m`)
    if (loc.drain_count) {
      const drainStr = loc.drain_diameter
        ? `${loc.drain_count}ヶ所（${loc.drain_diameter}）`
        : `${loc.drain_count}ヶ所`
      lines.push(`ドレン：${drainStr}`)
    }
    if (loc.degassing_count) lines.push(`脱気筒：${loc.degassing_count}ヶ所`)
    if (loc.fence_count) lines.push(`フェンス架台：${loc.fence_count}ヶ所`)
    if (loc.ac_count) lines.push(`室外機：${loc.ac_count}ヶ所`)
    add('その他付帯', loc.other_attachments)
    add('特記事項', loc.special_notes)
  })

  const hasRemarks =
    form.access_route || form.power_supply || form.water_supply ||
    form.neighbor_consideration || form.other_remarks
  if (hasRemarks) {
    lines.push('')
    lines.push('━━━━━━━━━━━━')
    lines.push('【備考】')
    add('搬入経路', form.access_route)
    add('電源', form.power_supply)
    add('水', form.water_supply)
    add('近隣配慮', form.neighbor_consideration)
    add('その他', form.other_remarks)
  }

  return lines.join('\n')
}

function buildMethodStr(methods: string[], other: string) {
  return methods
    .map(m => (m === 'その他' && other ? `その他（${other}）` : m))
    .join('、')
}

// ─── フォーム初期値 ──────────────────────────────────────────
function initForm() {
  return {
    site_name: '',
    address: '',
    survey_date: '',
    surveyor: '',
    client: '',
    building_floors: '',
    desired_timing: '',
    urgency: '未設定',
    methods: [] as string[],
    methods_other: '',
    overall_notes: '',
    access_route: '',
    power_supply: '',
    water_supply: '',
    neighbor_consideration: '',
    other_remarks: '',
  }
}

// ─── メインコンポーネント ─────────────────────────────────────
interface Props {
  id: string | null
  onBack: () => void
}

export default function SurveyDetail({ id, onBack }: Props) {
  const isNew = id === null
  const [form, setForm] = useState(initForm())
  const [locations, setLocations] = useState<LocationRow[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const setF = (key: keyof ReturnType<typeof initForm>, value: any) =>
    setForm(f => ({ ...f, [key]: value }))

  const updateLoc = (i: number, key: keyof LocationRow, value: any) =>
    setLocations(rows => rows.map((r, ri) => ri === i ? { ...r, [key]: value } : r))

  const fetchRecord = useCallback(async () => {
    if (!id) return
    const [recRes, locRes] = await Promise.all([
      supabase.from('survey_records').select('*').eq('id', id).single(),
      supabase.from('survey_locations').select('*').eq('survey_record_id', id).order('sort_order'),
    ])
    if (recRes.data) {
      const r = recRes.data as SurveyRecord
      setForm({
        site_name: r.site_name ?? '',
        address: r.address ?? '',
        survey_date: r.survey_date ?? '',
        surveyor: r.surveyor ?? '',
        client: r.client ?? '',
        building_floors: r.building_floors ?? '',
        desired_timing: r.desired_timing ?? '',
        urgency: r.urgency ?? '未設定',
        methods: r.methods ?? [],
        methods_other: r.methods_other ?? '',
        overall_notes: r.overall_notes ?? '',
        access_route: r.access_route ?? '',
        power_supply: r.power_supply ?? '',
        water_supply: r.water_supply ?? '',
        neighbor_consideration: r.neighbor_consideration ?? '',
        other_remarks: r.other_remarks ?? '',
      })
    }
    if (locRes.data) {
      setLocations((locRes.data as SurveyLocation[]).map(l => ({
        _key: l.id,
        id: l.id,
        name: l.name ?? '',
        dimensions_note: l.dimensions_note ?? '',
        existing_spec: l.existing_spec ?? '',
        deterioration: l.deterioration ?? '',
        methods: l.methods ?? [],
        methods_other: l.methods_other ?? '',
        rising_height: l.rising_height != null ? String(l.rising_height) : '',
        expansion_joint: l.expansion_joint != null ? String(l.expansion_joint) : '',
        drain_count: l.drain_count != null ? String(l.drain_count) : '',
        drain_diameter: l.drain_diameter ?? '',
        degassing_count: l.degassing_count != null ? String(l.degassing_count) : '',
        fence_count: l.fence_count != null ? String(l.fence_count) : '',
        ac_count: l.ac_count != null ? String(l.ac_count) : '',
        other_attachments: l.other_attachments ?? '',
        special_notes: l.special_notes ?? '',
      })))
    }
    setLoading(false)
  }, [id])

  useEffect(() => { fetchRecord() }, [fetchRecord])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const payload = {
      site_name: form.site_name.trim() || null,
      address: form.address.trim() || null,
      survey_date: form.survey_date || null,
      surveyor: form.surveyor.trim() || null,
      client: form.client.trim() || null,
      building_floors: form.building_floors.trim() || null,
      desired_timing: form.desired_timing.trim() || null,
      urgency: form.urgency || null,
      methods: form.methods.length > 0 ? form.methods : null,
      methods_other: form.methods_other.trim() || null,
      overall_notes: form.overall_notes.trim() || null,
      access_route: form.access_route.trim() || null,
      power_supply: form.power_supply.trim() || null,
      water_supply: form.water_supply.trim() || null,
      neighbor_consideration: form.neighbor_consideration.trim() || null,
      other_remarks: form.other_remarks.trim() || null,
    }

    let recordId = id
    if (isNew) {
      const { data } = await supabase.from('survey_records').insert(payload).select('id').single()
      recordId = data?.id ?? null
    } else {
      await supabase.from('survey_records').update(payload).eq('id', id)
    }

    if (!recordId) { setSaving(false); return }

    // 箇所を全削除 → 再挿入
    await supabase.from('survey_locations').delete().eq('survey_record_id', recordId)
    if (locations.length > 0) {
      await supabase.from('survey_locations').insert(
        locations.map((loc, i) => ({
          survey_record_id: recordId,
          sort_order: i,
          name: loc.name.trim() || null,
          dimensions_note: loc.dimensions_note.trim() || null,
          existing_spec: loc.existing_spec.trim() || null,
          deterioration: loc.deterioration.trim() || null,
          methods: loc.methods.length > 0 ? loc.methods : null,
          methods_other: loc.methods_other.trim() || null,
          rising_height: loc.rising_height !== '' ? parseFloat(loc.rising_height) : null,
          expansion_joint: loc.expansion_joint !== '' ? parseFloat(loc.expansion_joint) : null,
          drain_count: loc.drain_count !== '' ? parseInt(loc.drain_count) : null,
          drain_diameter: loc.drain_diameter.trim() || null,
          degassing_count: loc.degassing_count !== '' ? parseInt(loc.degassing_count) : null,
          fence_count: loc.fence_count !== '' ? parseInt(loc.fence_count) : null,
          ac_count: loc.ac_count !== '' ? parseInt(loc.ac_count) : null,
          other_attachments: loc.other_attachments.trim() || null,
          special_notes: loc.special_notes.trim() || null,
        }))
      )
    }

    setSaving(false)
    onBack()
  }

  const handleDelete = async () => {
    if (!id) return
    if (!confirm(`「${form.site_name || '（未設定）'}」を削除しますか？\n箇所情報もすべて削除されます。`)) return
    await supabase.from('survey_records').delete().eq('id', id)
    onBack()
  }

  const handleDeleteLocation = (i: number) => {
    const loc = locations[i]
    if (!confirm(`「${loc.name || `箇所${i + 1}`}」を削除しますか？`)) return
    setLocations(rows => rows.filter((_, ri) => ri !== i))
  }

  const handleCopy = async () => {
    const text = buildCopyText(form, locations)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    )
  }

  // ─── 入力欄共通スタイル ─────────────────────────────────────
  const inp = 'w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white'
  const ta = `${inp} resize-none`

  return (
    <div>
      {/* 戻る */}
      <button onClick={onBack} className="flex items-center gap-1 text-blue-600 text-sm mb-4 active:opacity-70">
        ‹ 一覧に戻る
      </button>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">{error}</div>
      )}

      {/* ─── 基本情報 ─── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <SectionTitle>基本情報</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">物件名</label>
            <input type="text" value={form.site_name} onChange={e => setF('site_name', e.target.value)} placeholder="例: ○○マンション" className={inp} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">住所</label>
            <input type="text" value={form.address} onChange={e => setF('address', e.target.value)} placeholder="例: 東京都渋谷区○○1-2-3" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">調査日</label>
              <input type="date" value={form.survey_date} onChange={e => setF('survey_date', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">調査者</label>
              <input type="text" value={form.surveyor} onChange={e => setF('surveyor', e.target.value)} placeholder="氏名" className={inp} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">客先（紹介元）</label>
            <input type="text" value={form.client} onChange={e => setF('client', e.target.value)} placeholder="例: 株式会社○○" className={inp} />
          </div>
        </div>
      </section>

      {/* ─── 全体情報 ─── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <SectionTitle>全体情報</SectionTitle>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">建物階数</label>
              <input type="text" value={form.building_floors} onChange={e => setF('building_floors', e.target.value)} placeholder="例: 5階建て" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">工事希望時期</label>
              <input type="text" value={form.desired_timing} onChange={e => setF('desired_timing', e.target.value)} placeholder="例: 6月頃" className={inp} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">緊急度</label>
            <div className="flex gap-2">
              {URGENCIES.map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setF('urgency', u)}
                  className={`flex-1 py-2 text-xs rounded-xl border transition-colors ${
                    form.urgency === u
                      ? u === '高' ? 'bg-red-500 text-white border-red-500 font-medium'
                        : u === '中' ? 'bg-orange-400 text-white border-orange-400 font-medium'
                        : u === '低' ? 'bg-green-500 text-white border-green-500 font-medium'
                        : 'bg-gray-400 text-white border-gray-400 font-medium'
                      : 'text-gray-500 border-gray-300'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              予定工法 <span className="text-gray-400 font-normal">（複数選択可）</span>
            </label>
            <MethodChips selected={form.methods} onChange={v => setF('methods', v)} />
            {form.methods.includes('その他') && (
              <input
                type="text"
                value={form.methods_other}
                onChange={e => setF('methods_other', e.target.value)}
                placeholder="その他の工法を入力"
                className={`${inp} mt-2`}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">全体メモ</label>
            <textarea value={form.overall_notes} onChange={e => setF('overall_notes', e.target.value)} placeholder="全体的な状況・特記事項など" rows={3} className={ta} />
          </div>
        </div>
      </section>

      {/* ─── 箇所情報 ─── */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700 text-sm">
            箇所情報
            <span className="ml-2 text-gray-400 font-normal text-xs">{locations.length}箇所</span>
          </h3>
          <button
            onClick={() => setLocations(l => [...l, newLocation()])}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold active:bg-blue-700"
          >
            ＋ 箇所追加
          </button>
        </div>

        {locations.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4 bg-white rounded-2xl border border-gray-100">
            「＋ 箇所追加」で箇所を追加してください
          </p>
        )}

        <div className="space-y-4">
          {locations.map((loc, i) => (
            <div key={loc._key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              {/* 箇所ヘッダー */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-blue-600">箇所 {i + 1}</span>
                <button
                  onClick={() => handleDeleteLocation(i)}
                  className="text-xs text-red-400 border border-red-200 px-2.5 py-1 rounded-lg active:bg-red-50"
                >
                  削除
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">名称</label>
                  <input type="text" value={loc.name} onChange={e => updateLoc(i, 'name', e.target.value)} placeholder="例: 屋上、3Fバルコニー" className={inp} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    寸法メモ
                    <span className="text-gray-400 font-normal ml-1">（自由記述）</span>
                  </label>
                  <textarea value={loc.dimensions_note} onChange={e => updateLoc(i, 'dimensions_note', e.target.value)} placeholder={'例: 15.75×5.7\n0.75×5.1+1.8×5.2'} rows={2} className={ta} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">既存仕様</label>
                  <input type="text" value={loc.existing_spec} onChange={e => updateLoc(i, 'existing_spec', e.target.value)} placeholder="例: ウレタン塗膜防水" className={inp} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">劣化状況</label>
                  <input type="text" value={loc.deterioration} onChange={e => updateLoc(i, 'deterioration', e.target.value)} placeholder="例: 亀裂・膨れあり" className={inp} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    予定工法 <span className="text-gray-400 font-normal">（複数選択可）</span>
                  </label>
                  <MethodChips selected={loc.methods} onChange={v => updateLoc(i, 'methods', v)} />
                  {loc.methods.includes('その他') && (
                    <input
                      type="text"
                      value={loc.methods_other}
                      onChange={e => updateLoc(i, 'methods_other', e.target.value)}
                      placeholder="その他の工法を入力"
                      className={`${inp} mt-2`}
                    />
                  )}
                </div>

                {/* 数値項目グリッド */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">立上り (m)</label>
                    <input type="number" inputMode="decimal" value={loc.rising_height} onChange={e => updateLoc(i, 'rising_height', e.target.value)} placeholder="0" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">伸縮目地 (m)</label>
                    <input type="number" inputMode="decimal" value={loc.expansion_joint} onChange={e => updateLoc(i, 'expansion_joint', e.target.value)} placeholder="0" className={inp} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">ドレン数</label>
                    <input type="number" inputMode="numeric" value={loc.drain_count} onChange={e => updateLoc(i, 'drain_count', e.target.value)} placeholder="0" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">口径</label>
                    <input type="text" value={loc.drain_diameter} onChange={e => updateLoc(i, 'drain_diameter', e.target.value)} placeholder="例: φ70" className={inp} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">脱気筒</label>
                    <input type="number" inputMode="numeric" value={loc.degassing_count} onChange={e => updateLoc(i, 'degassing_count', e.target.value)} placeholder="0" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">架台</label>
                    <input type="number" inputMode="numeric" value={loc.fence_count} onChange={e => updateLoc(i, 'fence_count', e.target.value)} placeholder="0" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">室外機</label>
                    <input type="number" inputMode="numeric" value={loc.ac_count} onChange={e => updateLoc(i, 'ac_count', e.target.value)} placeholder="0" className={inp} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">その他付帯</label>
                  <input type="text" value={loc.other_attachments} onChange={e => updateLoc(i, 'other_attachments', e.target.value)} placeholder="例: 笠木・パラペット等" className={inp} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">特記事項</label>
                  <textarea value={loc.special_notes} onChange={e => updateLoc(i, 'special_notes', e.target.value)} placeholder="注意点・特記事項" rows={2} className={ta} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 備考情報 ─── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <SectionTitle>備考情報</SectionTitle>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">搬入経路</label>
            <input type="text" value={form.access_route} onChange={e => setF('access_route', e.target.value)} placeholder="例: 外部階段使用可" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">電源</label>
              <input type="text" value={form.power_supply} onChange={e => setF('power_supply', e.target.value)} placeholder="例: 屋上コンセントあり" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">水</label>
              <input type="text" value={form.water_supply} onChange={e => setF('water_supply', e.target.value)} placeholder="例: 屋上散水栓あり" className={inp} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">近隣配慮</label>
            <input type="text" value={form.neighbor_consideration} onChange={e => setF('neighbor_consideration', e.target.value)} placeholder="例: 営業中・住民への配慮要" className={inp} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">その他</label>
            <textarea value={form.other_remarks} onChange={e => setF('other_remarks', e.target.value)} placeholder="その他備考" rows={2} className={ta} />
          </div>
        </div>
      </section>

      {/* ─── ボタン群 ─── */}
      <button
        onClick={handleCopy}
        className={`w-full py-3.5 rounded-xl border text-sm font-bold mb-3 transition-colors ${
          copied
            ? 'bg-green-50 text-green-600 border-green-300'
            : 'text-blue-600 border-blue-300 active:bg-blue-50'
        }`}
      >
        {copied ? '✓ コピーしました' : 'テキストでコピー'}
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50 active:bg-blue-700 transition-colors mb-3"
      >
        {saving ? '保存中...' : '保存する'}
      </button>

      {!isNew && (
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-xl border border-red-300 text-red-500 text-sm font-medium active:bg-red-50 mb-6"
        >
          このメモを削除
        </button>
      )}
    </div>
  )
}
