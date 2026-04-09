export type Rarity    = 1 | 2 | 3 | 4 | 5
export type Attribute = '炎' | '水' | '土' | '風' | '鉄'

export interface Card {
  id: number
  name: string
  rarity: Rarity
  attribute: Attribute
  tribe: string
  skills: { 施工力: number; 根性: number; 雨耐性: number; 臭い: number; 酒量: number }
  effect: string
  atk: number
  def: number
}

export const ATTRIBUTE_ICONS: Record<Attribute, string> = {
  '炎': '🔥', '水': '💧', '土': '🌱', '風': '🌪️', '鉄': '⚙️',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  1: 'ノーマル', 2: 'アンコモン', 3: 'レア', 4: 'SR', 5: 'レジェンド',
}

export const RARITY_FRAME: Record<Rarity, { border: string; namePlate: string; bg: string; starColor: string }> = {
  1: { border: '#9ca3af', namePlate: '#d1d5db', bg: '#f9fafb',   starColor: '#6b7280' },
  2: { border: '#16a34a', namePlate: '#bbf7d0', bg: '#f0fdf4',   starColor: '#15803d' },
  3: { border: '#2563eb', namePlate: '#93c5fd', bg: '#eff6ff',   starColor: '#1d4ed8' },
  4: { border: '#7c3aed', namePlate: '#c4b5fd', bg: '#f5f3ff',   starColor: '#6d28d9' },
  5: { border: '#b45309', namePlate: '#fde68a', bg: '#fffbeb',   starColor: '#d97706' },
}

export const CARDS: Card[] = [
  // ★ ノーマル 15枚
  { id: 1,  name: '見習い太郎',      rarity: 1, attribute: '土', tribe: '見習い職人',   skills: { 施工力: 10, 根性: 20, 雨耐性: 15, 臭い: 30, 酒量: 40 }, effect: 'とりあえずやります！不安だけど全力で頑張ります！',                    atk: 400,  def: 300 },
  { id: 2,  name: '汗だく三郎',      rarity: 1, attribute: '炎', tribe: '一般職人',     skills: { 施工力: 25, 根性: 45, 雨耐性: 20, 臭い: 70, 酒量: 55 }, effect: '夏は地獄や…でも仕事は止めない根性がある。',                          atk: 550,  def: 400 },
  { id: 3,  name: 'ぼやき次郎',      rarity: 1, attribute: '風', tribe: '一般職人',     skills: { 施工力: 30, 根性: 35, 雨耐性: 25, 臭い: 45, 酒量: 60 }, effect: 'また雨かよ…と言いながら結局仕事はする。',                             atk: 500,  def: 450 },
  { id: 4,  name: '遅刻の健',        rarity: 1, attribute: '風', tribe: '一般職人',     skills: { 施工力: 35, 根性: 30, 雨耐性: 30, 臭い: 40, 酒量: 65 }, effect: 'すんません5分だけ！（毎回言う）',                                       atk: 480,  def: 380 },
  { id: 5,  name: '昼寝の松',        rarity: 1, attribute: '土', tribe: '一般職人',     skills: { 施工力: 20, 根性: 25, 雨耐性: 35, 臭い: 50, 酒量: 70 }, effect: 'ちょっと休憩…いつの間にかぐっすり。',                                  atk: 420,  def: 500 },
  { id: 6,  name: 'スマホ依存の竹',  rarity: 1, attribute: '風', tribe: '現代職人',     skills: { 施工力: 15, 根性: 20, 雨耐性: 20, 臭い: 35, 酒量: 45 }, effect: 'ちょっとYouTubeだけ…で2時間経過。',                                   atk: 380,  def: 330 },
  { id: 7,  name: 'ぐちぐちの梅',    rarity: 1, attribute: '土', tribe: '一般職人',     skills: { 施工力: 28, 根性: 32, 雨耐性: 18, 臭い: 55, 酒量: 75 }, effect: '昔はもっと給料よかった…口癖。',                                       atk: 460,  def: 420 },
  { id: 8,  name: '方向音痴の清',    rarity: 1, attribute: '風', tribe: '一般職人',     skills: { 施工力: 32, 根性: 40, 雨耐性: 28, 臭い: 42, 酒量: 50 }, effect: '現場どこだっけ…毎回迷子になる男。',                                   atk: 490,  def: 410 },
  { id: 9,  name: '二日酔いの勉',    rarity: 1, attribute: '水', tribe: '一般職人',     skills: { 施工力: 18, 根性: 22, 雨耐性: 15, 臭い: 80, 酒量: 90 }, effect: '今日はちょっとキツい…臭いは本物。',                                   atk: 350,  def: 280 },
  { id: 10, name: '見栄っ張りの浩',  rarity: 1, attribute: '炎', tribe: '一般職人',     skills: { 施工力: 38, 根性: 35, 雨耐性: 32, 臭い: 38, 酒量: 55 }, effect: '俺に任せろ！（不安がちらつく）',                                       atk: 580,  def: 440 },
  { id: 11, name: 'おしゃべりの富',  rarity: 1, attribute: '風', tribe: '一般職人',     skills: { 施工力: 22, 根性: 28, 雨耐性: 22, 臭い: 48, 酒量: 62 }, effect: 'そういえばさあ…話し始めたら止まらない。',                              atk: 430,  def: 380 },
  { id: 12, name: 'ど忘れの正',      rarity: 1, attribute: '土', tribe: '一般職人',     skills: { 施工力: 30, 根性: 38, 雨耐性: 28, 臭い: 44, 酒量: 58 }, effect: 'あれ何しに来たっけ…道具を忘れること3回。',                            atk: 470,  def: 430 },
  { id: 13, name: '近道好きの順',    rarity: 1, attribute: '風', tribe: '一般職人',     skills: { 施工力: 35, 根性: 30, 雨耐性: 25, 臭い: 42, 酒量: 48 }, effect: '近道あるで（迷子確定）',                                               atk: 500,  def: 360 },
  { id: 14, name: 'マイペースの慎',  rarity: 1, attribute: '土', tribe: '一般職人',     skills: { 施工力: 40, 根性: 42, 雨耐性: 38, 臭い: 36, 酒量: 44 }, effect: '焦らず行きましょ、が口癖。実は安定感抜群。',                           atk: 560,  def: 520 },
  { id: 15, name: '天気読みの賢',    rarity: 1, attribute: '水', tribe: '一般職人',     skills: { 施工力: 28, 根性: 35, 雨耐性: 55, 臭い: 40, 酒量: 52 }, effect: '明日は降るな…その予報精度80%。',                                      atk: 440,  def: 460 },

  // ★★ アンコモン 10枚
  { id: 16, name: '中堅の健二',      rarity: 2, attribute: '土', tribe: '熟練職人',     skills: { 施工力: 55, 根性: 60, 雨耐性: 45, 臭い: 60, 酒量: 70 }, effect: 'まあまあいけるで。経験が自信を生む。',                                 atk: 1400, def: 1100 },
  { id: 17, name: 'タバコの賢治',    rarity: 2, attribute: '炎', tribe: '熟練職人',     skills: { 施工力: 50, 根性: 55, 雨耐性: 40, 臭い: 85, 酒量: 75 }, effect: '一服していい？一服が仕事のリズムを作る。',                              atk: 1300, def: 1000 },
  { id: 18, name: '雨男の信二',      rarity: 2, attribute: '水', tribe: '雨天職人',     skills: { 施工力: 48, 根性: 65, 雨耐性: 20, 臭い: 55, 酒量: 68 }, effect: 'なんで俺が来ると雨なんだ。呪いか才能か。',                             atk: 1250, def: 1050 },
  { id: 19, name: 'ベテランの波',    rarity: 2, attribute: '土', tribe: '熟練職人',     skills: { 施工力: 62, 根性: 58, 雨耐性: 50, 臭い: 65, 酒量: 72 }, effect: 'もう20年やってるから。その安心感は本物。',                             atk: 1600, def: 1300 },
  { id: 20, name: '職人気質の剛',    rarity: 2, attribute: '炎', tribe: '職人気質',     skills: { 施工力: 70, 根性: 65, 雨耐性: 55, 臭い: 58, 酒量: 65 }, effect: '妥協はしない。一ミリの歪みも許さない男。',                            atk: 1750, def: 1200 },
  { id: 21, name: '黙々の蔵',        rarity: 2, attribute: '土', tribe: '寡黙職人',     skills: { 施工力: 65, 根性: 70, 雨耐性: 60, 臭い: 48, 酒量: 55 }, effect: '（無言で仕事）言葉より手が語る。',                                     atk: 1650, def: 1400 },
  { id: 22, name: '道具オタクの進',  rarity: 2, attribute: '鉄', tribe: '道具職人',     skills: { 施工力: 68, 根性: 60, 雨耐性: 52, 臭い: 52, 酒量: 60 }, effect: 'この道具が最高なんだ。工具への愛は誰にも負けない。',                   atk: 1700, def: 1250 },
  { id: 23, name: '段取りの幸',      rarity: 2, attribute: '風', tribe: '計画職人',     skills: { 施工力: 60, 根性: 62, 雨耐性: 58, 臭い: 50, 酒量: 65 }, effect: '準備が全てだ。段取り八分、仕事二分。',                                 atk: 1550, def: 1350 },
  { id: 24, name: '親分肌の猛',      rarity: 2, attribute: '炎', tribe: '親分職人',     skills: { 施工力: 58, 根性: 72, 雨耐性: 48, 臭い: 68, 酒量: 80 }, effect: '俺についてこい。若手の信頼は絶大だ。',                                 atk: 1500, def: 1450 },
  { id: 25, name: '夜型の徹',        rarity: 2, attribute: '水', tribe: '夜間職人',     skills: { 施工力: 52, 根性: 58, 雨耐性: 42, 臭い: 62, 酒量: 78 }, effect: '夜の方が仕事はかどる。深夜の現場が主戦場。',                          atk: 1350, def: 1150 },

  // ★★★ レア 8枚
  { id: 26, name: '職人歴30年の鉄男',  rarity: 3, attribute: '鉄', tribe: '達人職人',   skills: { 施工力: 80, 根性: 85, 雨耐性: 70, 臭い: 72, 酒量: 80 }, effect: '俺の背中を見て覚えろ。30年の技は言葉を超える。',                      atk: 2200, def: 1800 },
  { id: 27, name: '無言の達人・武',    rarity: 3, attribute: '土', tribe: '達人職人',   skills: { 施工力: 85, 根性: 80, 雨耐性: 75, 臭い: 65, 酒量: 70 }, effect: '…（完璧な仕事が全てを語る）',                                          atk: 2400, def: 1900 },
  { id: 28, name: '台風でも来る男・嵐', rarity: 3, attribute: '風', tribe: '嵐の職人', skills: { 施工力: 78, 根性: 92, 雨耐性: 95, 臭い: 75, 酒量: 85 }, effect: '天気なんか関係ない。台風の日でも現場に立つ。',                          atk: 2100, def: 2200 },
  { id: 29, name: '速攻の鷹',          rarity: 3, attribute: '風', tribe: '俊足職人',   skills: { 施工力: 90, 根性: 82, 雨耐性: 72, 臭い: 68, 酒量: 75 }, effect: 'もう終わったで。誰より速く、誰より丁寧。',                              atk: 2500, def: 1700 },
  { id: 30, name: '絶対安全の守',      rarity: 3, attribute: '鉄', tribe: '安全職人',   skills: { 施工力: 75, 根性: 85, 雨耐性: 80, 臭い: 60, 酒量: 65 }, effect: '安全第一、これだけ。事故ゼロ20年の鉄の男。',                           atk: 2050, def: 2100 },
  { id: 31, name: '職人の魂・炎',      rarity: 3, attribute: '炎', tribe: '炎の職人',   skills: { 施工力: 88, 根性: 90, 雨耐性: 76, 臭い: 78, 酒量: 88 }, effect: '魂を込めて施工する。炎のような情熱が品質を生む。',                     atk: 2350, def: 1850 },
  { id: 32, name: '現場監督・龍平',    rarity: 3, attribute: '土', tribe: '監督職人',   skills: { 施工力: 82, 根性: 88, 雨耐性: 78, 臭い: 62, 酒量: 72 }, effect: '全体を見てこそ職人。現場を俯瞰する鋭い目。',                           atk: 2150, def: 1950 },
  { id: 33, name: '伝説の弟子・蒼',    rarity: 3, attribute: '水', tribe: '次世代職人', skills: { 施工力: 84, 根性: 86, 雨耐性: 82, 臭い: 70, 酒量: 78 }, effect: '師匠の教えが全て。伝説を受け継ぐ青い炎。',                              atk: 2250, def: 2000 },

  // ★★★★ SR 5枚
  { id: 34, name: '伝説の防水師・龍造',   rarity: 4, attribute: '水', tribe: '伝説防水師', skills: { 施工力: 93, 根性: 95, 雨耐性: 92, 臭い: 82, 酒量: 90 }, effect: 'この現場、俺に任せろ。龍造が手がければ水は入らない。',               atk: 2900, def: 2500 },
  { id: 35, name: '嵐を呼ぶ男・豪',       rarity: 4, attribute: '風', tribe: '嵐の支配者', skills: { 施工力: 90, 根性: 98, 雨耐性: 99, 臭い: 85, 酒量: 95 }, effect: '嵐よ来い、俺が止める。暴風でも工期は守る。',                        atk: 2800, def: 2700 },
  { id: 36, name: '伝説の塗り師・銀次',   rarity: 4, attribute: '鉄', tribe: '伝説塗装師', skills: { 施工力: 96, 根性: 92, 雨耐性: 88, 臭い: 80, 酒量: 88 }, effect: '一塗りに魂を込める。銀次の仕事に手直しは不要。',                    atk: 3100, def: 2300 },
  { id: 37, name: '不死鳥の職人・不動',   rarity: 4, attribute: '炎', tribe: '不死鳥職人', skills: { 施工力: 94, 根性: 99, 雨耐性: 90, 臭い: 88, 酒量: 92 }, effect: '倒れても立ち上がる。炎から生まれし職人の不屈。',                    atk: 3000, def: 2600 },
  { id: 38, name: '最速の仕上げ師・疾風', rarity: 4, attribute: '風', tribe: '疾風職人',  skills: { 施工力: 98, 根性: 94, 雨耐性: 86, 臭い: 84, 酒量: 86 }, effect: '仕事は速さが命。疾風の如く現場を駆け抜ける。',                        atk: 3200, def: 2100 },

  // ★★★★★ レジェンド 4枚（土橋追加）
  { id: 39, name: '神の手を持つ男・源さん', rarity: 5, attribute: '土', tribe: '神の職人',   skills: { 施工力: 99, 根性: 99, 雨耐性: 99, 臭い: 95, 酒量: 99 }, effect: '触れるものすべて完璧になる。源さんの手は神の域に達した。',          atk: 3800, def: 3500 },
  { id: 40, name: '防水の神・天地',         rarity: 5, attribute: '水', tribe: '神の職人',   skills: { 施工力: 99, 根性: 99, 雨耐性: 99, 臭い: 90, 酒量: 95 }, effect: '雨よ降れ、俺が完璧に守る。雨水すら従わせる神格。',                  atk: 3900, def: 3600 },
  { id: 41, name: '幻の職人・零',           rarity: 5, attribute: '風', tribe: '幻の職人',   skills: { 施工力: 99, 根性: 99, 雨耐性: 99, 臭い: 99, 酒量: 99 }, effect: '誰も見たことがない…本当に存在するのか、それが零。',                 atk: 4000, def: 4000 },
  { id: 42, name: '塗装神・土橋',           rarity: 5, attribute: '炎', tribe: '伝説の塗装職人', skills: { 施工力: 99, 根性: 99, 雨耐性: 97, 臭い: 88, 酒量: 96 }, effect: '七色の塗料を自在に操る伝説の塗装職人。一度塗れば百年持つと言われ、土橋が手がけた壁は嵐も台風も寄せつけない。業界の神。', atk: 4200, def: 3800 },
]

export function pullCard(): Card {
  const rand = Math.random() * 100
  let rarity: Rarity
  if (rand < 1)       rarity = 5
  else if (rand < 6)  rarity = 4
  else if (rand < 20) rarity = 3
  else if (rand < 50) rarity = 2
  else                rarity = 1
  const pool = CARDS.filter(c => c.rarity === rarity)
  return pool[Math.floor(Math.random() * pool.length)]
}
