export type Rarity = 1 | 2 | 3 | 4 | 5

export interface Card {
  id: number
  name: string
  rarity: Rarity
  skills: { 施工力: number; 根性: number; 雨耐性: number; 臭い: number; 酒量: number }
  effect: string
}

export const RARITY_LABELS: Record<Rarity, string> = {
  1: '★ ノーマル',
  2: '★★ アンコモン',
  3: '★★★ レア',
  4: '★★★★ SR',
  5: '★★★★★ レジェンド',
}

export const RARITY_COLORS: Record<Rarity, { bg: string; text: string; border: string; star: string }> = {
  1: { bg: 'from-gray-200 to-gray-400',   text: 'text-gray-700',   border: 'border-gray-400',   star: '#9ca3af' },
  2: { bg: 'from-green-300 to-green-600',  text: 'text-green-800',  border: 'border-green-500',  star: '#16a34a' },
  3: { bg: 'from-blue-300 to-blue-600',    text: 'text-blue-900',   border: 'border-blue-500',   star: '#2563eb' },
  4: { bg: 'from-purple-300 to-purple-700',text: 'text-purple-900', border: 'border-purple-500', star: '#9333ea' },
  5: { bg: 'from-yellow-200 to-amber-500', text: 'text-yellow-900', border: 'border-yellow-400', star: '#d97706' },
}

// 排出率
export const RARITY_RATES: Record<Rarity, number> = { 1: 50, 2: 30, 3: 14, 4: 5, 5: 1 }

export const CARDS: Card[] = [
  // ★ ノーマル 15枚
  { id: 1,  name: '見習い太郎',      rarity: 1, skills: { 施工力: 10, 根性: 20, 雨耐性: 15, 臭い: 30, 酒量: 40 }, effect: 'とりあえずやります' },
  { id: 2,  name: '汗だく三郎',      rarity: 1, skills: { 施工力: 25, 根性: 45, 雨耐性: 20, 臭い: 70, 酒量: 55 }, effect: '夏は地獄や…' },
  { id: 3,  name: 'ぼやき次郎',      rarity: 1, skills: { 施工力: 30, 根性: 35, 雨耐性: 25, 臭い: 45, 酒量: 60 }, effect: 'また雨かよ…' },
  { id: 4,  name: '遅刻の健',        rarity: 1, skills: { 施工力: 35, 根性: 30, 雨耐性: 30, 臭い: 40, 酒量: 65 }, effect: 'すんません5分だけ' },
  { id: 5,  name: '昼寝の松',        rarity: 1, skills: { 施工力: 20, 根性: 25, 雨耐性: 35, 臭い: 50, 酒量: 70 }, effect: 'ちょっと休憩…' },
  { id: 6,  name: 'スマホ依存の竹',  rarity: 1, skills: { 施工力: 15, 根性: 20, 雨耐性: 20, 臭い: 35, 酒量: 45 }, effect: 'ちょっとYouTubeだけ' },
  { id: 7,  name: 'ぐちぐちの梅',    rarity: 1, skills: { 施工力: 28, 根性: 32, 雨耐性: 18, 臭い: 55, 酒量: 75 }, effect: '昔はもっと給料よかった' },
  { id: 8,  name: '方向音痴の清',    rarity: 1, skills: { 施工力: 32, 根性: 40, 雨耐性: 28, 臭い: 42, 酒量: 50 }, effect: '現場どこだっけ…' },
  { id: 9,  name: '二日酔いの勉',    rarity: 1, skills: { 施工力: 18, 根性: 22, 雨耐性: 15, 臭い: 80, 酒量: 90 }, effect: '今日はちょっとキツい' },
  { id: 10, name: '見栄っ張りの浩',  rarity: 1, skills: { 施工力: 38, 根性: 35, 雨耐性: 32, 臭い: 38, 酒量: 55 }, effect: '俺に任せろ！（不安）' },
  { id: 11, name: 'おしゃべりの富',  rarity: 1, skills: { 施工力: 22, 根性: 28, 雨耐性: 22, 臭い: 48, 酒量: 62 }, effect: 'そういえばさあ…' },
  { id: 12, name: 'ど忘れの正',      rarity: 1, skills: { 施工力: 30, 根性: 38, 雨耐性: 28, 臭い: 44, 酒量: 58 }, effect: 'あれ何しに来たっけ' },
  { id: 13, name: '近道好きの順',    rarity: 1, skills: { 施工力: 35, 根性: 30, 雨耐性: 25, 臭い: 42, 酒量: 48 }, effect: '近道あるで（迷子）' },
  { id: 14, name: 'マイペースの慎',  rarity: 1, skills: { 施工力: 40, 根性: 42, 雨耐性: 38, 臭い: 36, 酒量: 44 }, effect: '焦らず行きましょ' },
  { id: 15, name: '天気読みの賢',    rarity: 1, skills: { 施工力: 28, 根性: 35, 雨耐性: 55, 臭い: 40, 酒量: 52 }, effect: '明日は降るな…' },

  // ★★ アンコモン 10枚
  { id: 16, name: '中堅の健二',      rarity: 2, skills: { 施工力: 55, 根性: 60, 雨耐性: 45, 臭い: 60, 酒量: 70 }, effect: 'まあまあいけるで' },
  { id: 17, name: 'タバコの賢治',    rarity: 2, skills: { 施工力: 50, 根性: 55, 雨耐性: 40, 臭い: 85, 酒量: 75 }, effect: '一服していい？' },
  { id: 18, name: '雨男の信二',      rarity: 2, skills: { 施工力: 48, 根性: 65, 雨耐性: 20, 臭い: 55, 酒量: 68 }, effect: 'なんで俺が来ると雨なんだ' },
  { id: 19, name: 'ベテランの波',    rarity: 2, skills: { 施工力: 62, 根性: 58, 雨耐性: 50, 臭い: 65, 酒量: 72 }, effect: 'もう20年やってるから' },
  { id: 20, name: '職人気質の剛',    rarity: 2, skills: { 施工力: 70, 根性: 65, 雨耐性: 55, 臭い: 58, 酒量: 65 }, effect: '妥協はしない' },
  { id: 21, name: '黙々の蔵',        rarity: 2, skills: { 施工力: 65, 根性: 70, 雨耐性: 60, 臭い: 48, 酒量: 55 }, effect: '（無言で仕事）' },
  { id: 22, name: '道具オタクの進',  rarity: 2, skills: { 施工力: 68, 根性: 60, 雨耐性: 52, 臭い: 52, 酒量: 60 }, effect: 'この道具が最高なんだ' },
  { id: 23, name: '段取りの幸',      rarity: 2, skills: { 施工力: 60, 根性: 62, 雨耐性: 58, 臭い: 50, 酒量: 65 }, effect: '準備が全てだ' },
  { id: 24, name: '親分肌の猛',      rarity: 2, skills: { 施工力: 58, 根性: 72, 雨耐性: 48, 臭い: 68, 酒量: 80 }, effect: '俺についてこい' },
  { id: 25, name: '夜型の徹',        rarity: 2, skills: { 施工力: 52, 根性: 58, 雨耐性: 42, 臭い: 62, 酒量: 78 }, effect: '夜の方が仕事はかどる' },

  // ★★★ レア 8枚
  { id: 26, name: '職人歴30年の鉄男',  rarity: 3, skills: { 施工力: 80, 根性: 85, 雨耐性: 70, 臭い: 72, 酒量: 80 }, effect: '俺の背中を見て覚えろ' },
  { id: 27, name: '無言の達人・武',    rarity: 3, skills: { 施工力: 85, 根性: 80, 雨耐性: 75, 臭い: 65, 酒量: 70 }, effect: '…（完璧な仕事）' },
  { id: 28, name: '台風でも来る男・嵐', rarity: 3, skills: { 施工力: 78, 根性: 92, 雨耐性: 95, 臭い: 75, 酒量: 85 }, effect: '天気なんか関係ない' },
  { id: 29, name: '速攻の鷹',          rarity: 3, skills: { 施工力: 90, 根性: 82, 雨耐性: 72, 臭い: 68, 酒量: 75 }, effect: 'もう終わったで' },
  { id: 30, name: '絶対安全の守',      rarity: 3, skills: { 施工力: 75, 根性: 85, 雨耐性: 80, 臭い: 60, 酒量: 65 }, effect: '安全第一、これだけ' },
  { id: 31, name: '職人の魂・炎',      rarity: 3, skills: { 施工力: 88, 根性: 90, 雨耐性: 76, 臭い: 78, 酒量: 88 }, effect: '魂を込めて施工する' },
  { id: 32, name: '現場監督・龍平',    rarity: 3, skills: { 施工力: 82, 根性: 88, 雨耐性: 78, 臭い: 62, 酒量: 72 }, effect: '全体を見てこそ職人' },
  { id: 33, name: '伝説の弟子・蒼',    rarity: 3, skills: { 施工力: 84, 根性: 86, 雨耐性: 82, 臭い: 70, 酒量: 78 }, effect: '師匠の教えが全て' },

  // ★★★★ SR 5枚
  { id: 34, name: '伝説の防水師・龍造',   rarity: 4, skills: { 施工力: 93, 根性: 95, 雨耐性: 92, 臭い: 82, 酒量: 90 }, effect: 'この現場、俺に任せろ' },
  { id: 35, name: '嵐を呼ぶ男・豪',       rarity: 4, skills: { 施工力: 90, 根性: 98, 雨耐性: 99, 臭い: 85, 酒量: 95 }, effect: '嵐よ来い、俺が止める' },
  { id: 36, name: '伝説の塗り師・銀次',   rarity: 4, skills: { 施工力: 96, 根性: 92, 雨耐性: 88, 臭い: 80, 酒量: 88 }, effect: '一塗りに魂を込める' },
  { id: 37, name: '不死鳥の職人・不動',   rarity: 4, skills: { 施工力: 94, 根性: 99, 雨耐性: 90, 臭い: 88, 酒量: 92 }, effect: '倒れても立ち上がる' },
  { id: 38, name: '最速の仕上げ師・疾風', rarity: 4, skills: { 施工力: 98, 根性: 94, 雨耐性: 86, 臭い: 84, 酒量: 86 }, effect: '仕事は速さが命' },

  // ★★★★★ レジェンド 3枚
  { id: 39, name: '神の手を持つ男・源さん', rarity: 5, skills: { 施工力: 99, 根性: 99, 雨耐性: 99, 臭い: 95, 酒量: 99 }, effect: '触れるものすべて完璧になる' },
  { id: 40, name: '防水の神・天地',         rarity: 5, skills: { 施工力: 99, 根性: 99, 雨耐性: 99, 臭い: 90, 酒量: 95 }, effect: '雨よ降れ、俺が完璧に守る' },
  { id: 41, name: '幻の職人・零',           rarity: 5, skills: { 施工力: 99, 根性: 99, 雨耐性: 99, 臭い: 99, 酒量: 99 }, effect: '誰も見たことがない…本当に存在するのか' },
]

export function pullCard(): Card {
  const rand = Math.random() * 100
  let rarity: Rarity
  if (rand < 1)  rarity = 5
  else if (rand < 6)  rarity = 4
  else if (rand < 20) rarity = 3
  else if (rand < 50) rarity = 2
  else rarity = 1

  const pool = CARDS.filter(c => c.rarity === rarity)
  return pool[Math.floor(Math.random() * pool.length)]
}
