import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wuwttumvagglruqpxlzt.supabase.co',
  'sb_publishable_8lSntHzENd3j89aRLnHnfA_lGZ3HAr9'
)

// ─── 従業員 ────────────────────────────────────────────
const employees = [
  { name: '光前' },
  { name: '上田' },
  { name: '佐藤' },
  { name: '高橋' },
]

// ─── 現場予定 ──────────────────────────────────────────
// 日程未定は 2099-12-31 を仮置き（notes に「日程未定」と記録）
const schedules = [
  {
    site_name: 'アクタス 戸建て',
    date: '2026-04-07',
    method: 'シール工事',
    address: '鎌倉市長谷4-7-11',
  },
  {
    site_name: 'さきとり幼稚園',
    date: '2026-04-10',
    notes: '15:30〜 現調・クロス貼り替え',
  },
  {
    site_name: 'くらしのマーケット 高橋様邸',
    date: '2026-04-12',
    address: '藤沢市柄沢2-35-3',
    notes: '9:00〜 現調',
  },
  {
    site_name: '相模原文化センター',
    date: '2026-04-13',
    method: '長尺シート',
    assignee: '米山さん（未来図）',
    notes: '現調・長尺シート',
  },
  {
    site_name: '愛宕産業 産廃回収',
    date: '2026-04-15',
    notes: '午前中',
  },
  {
    site_name: 'ウレタン50or100箇所',
    date: '2026-04-20',
    method: 'ウレタン防水',
    assignee: '高橋さん',
    notes: '4/20あたり',
  },
  {
    site_name: 'アルデーア下北沢',
    date: '2026-04-10',
    method: '塩ビシート防水',
    assignee: '内藤さん',
    notes: '4月上旬',
  },
  {
    site_name: 'シール2件',
    date: '2026-04-10',
    method: 'シール工事',
    assignee: '内藤さん',
    notes: '4月上旬',
  },
  {
    site_name: '加納ビル',
    date: '2026-04-10',
    method: '塩ビシート防水',
    assignee: '内藤さん',
    notes: '4月上旬',
  },
  {
    site_name: 'ファミールヴィラ箱根',
    date: '2026-04-15',
    assignee: 'サンマイ',
    notes: '4月中旬 大規模',
  },
  {
    site_name: '大規模長尺シート',
    date: '2026-05-05',
    method: '長尺シート',
    assignee: '高橋さん',
    notes: '5月上旬',
  },
  {
    site_name: 'ウレタン大規模',
    date: '2026-05-07',
    method: 'ウレタン防水',
    assignee: 'みほさん',
    notes: 'GW明け',
  },
  {
    site_name: 'ルーフバルコニーウレタン（栄輪）',
    date: '2026-06-01',
    method: 'ウレタン防水',
    assignee: '栄輪',
    notes: '6月頃',
  },
  {
    site_name: '鎌倉ウレタン残り',
    date: '2099-12-31',
    method: 'ウレタン防水',
    assignee: 'サンマイ',
    notes: '日程未定',
  },
  {
    site_name: '上田・エリカ実家',
    date: '2099-12-31',
    notes: '日程未定 塗装・シール・防水',
  },
  {
    site_name: 'バルコニーウレタン（栗田塗装）',
    date: '2099-12-31',
    method: 'ウレタン防水',
    assignee: '栗田塗装',
    notes: '日程未定 レジアンダー下地',
  },
  {
    site_name: '株式会社リビア ブロック撤去ウレタン補修',
    date: '2026-06-29',
    method: 'ウレタン防水',
  },
]

async function seed() {
  console.log('=== シードデータ投入開始 ===\n')

  // 既存データを全削除
  console.log('▶ 既存データを削除中...')
  await supabase.from('wake_checks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('attendance').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('schedules').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('employees').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('  ✓ 削除完了\n')

  // 従業員を投入
  console.log('▶ 従業員を登録中...')
  for (const emp of employees) {
    const { error } = await supabase.from('employees').insert(emp)
    if (error) {
      console.error(`  ✗ ${emp.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${emp.name}`)
    }
  }

  // 現場予定を投入
  console.log('\n▶ 現場予定を登録中...')
  for (const s of schedules) {
    const { error } = await supabase.from('schedules').insert(s)
    const dateLabel = s.date === '2099-12-31' ? '日程未定' : s.date
    if (error) {
      console.error(`  ✗ [${dateLabel}] ${s.site_name}: ${error.message}`)
    } else {
      console.log(`  ✓ [${dateLabel}] ${s.site_name}`)
    }
  }

  console.log('\n=== 完了 ===')
}

seed()
