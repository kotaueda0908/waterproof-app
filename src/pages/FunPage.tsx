import { useState, useEffect } from 'react'
import { CARDS, RARITY_COLORS, RARITY_LABELS, pullCard } from '../data/cards'
import type { Card, Rarity } from '../data/cards'
import { QUOTES, getTodayQuote } from '../data/quotes'

// ─── ローカルストレージキー ───────────────────────────────
const LS_GACHA_DATE       = 'lifeeve_gacha_date'
const LS_GACHA_COLLECTION = 'lifeeve_gacha_collection'
const LS_QUOTE_DATE       = 'lifeeve_quote_date'
const LS_QUOTE_STREAK     = 'lifeeve_quote_streak'
const LS_QUOTE_ID         = 'lifeeve_quote_id'

const today = () => new Date().toISOString().slice(0, 10)

// ─── カード顔SVG ────────────────────────────────────────
function CardFace({ rarity, id }: { rarity: Rarity; id: number }) {
  const faces = [
    // ノーマル: ぼんやり顔
    <svg key="1" viewBox="0 0 80 80" className="w-full h-full">
      <circle cx="40" cy="40" r="36" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
      <circle cx="28" cy="34" r="5" fill="#6b7280"/>
      <circle cx="52" cy="34" r="5" fill="#6b7280"/>
      <path d="M28 52 Q40 58 52 52" stroke="#6b7280" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="29" cy="33" r="2" fill="white"/>
      <circle cx="53" cy="33" r="2" fill="white"/>
    </svg>,
    // アンコモン: 笑顔
    <svg key="2" viewBox="0 0 80 80" className="w-full h-full">
      <circle cx="40" cy="40" r="36" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2"/>
      <circle cx="28" cy="33" r="6" fill="#15803d"/>
      <circle cx="52" cy="33" r="6" fill="#15803d"/>
      <path d="M25 50 Q40 64 55 50" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="30" cy="32" r="2.5" fill="white"/>
      <circle cx="54" cy="32" r="2.5" fill="white"/>
      <ellipse cx="22" cy="46" rx="5" ry="3" fill="#fca5a5" opacity="0.6"/>
      <ellipse cx="58" cy="46" rx="5" ry="3" fill="#fca5a5" opacity="0.6"/>
    </svg>,
    // レア: クールなヘルメット
    <svg key="3" viewBox="0 0 80 80" className="w-full h-full">
      <circle cx="40" cy="44" r="32" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2"/>
      <path d="M10 38 Q40 10 70 38" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2"/>
      <rect x="14" y="36" width="52" height="8" rx="4" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1"/>
      <rect x="28" y="32" width="24" height="6" rx="3" fill="#fbbf24"/>
      <line x1="28" y1="38" x2="52" y2="38" stroke="#1e40af" strokeWidth="1"/>
      <ellipse cx="30" cy="50" rx="5" ry="4" fill="#1e40af" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="5" ry="4" fill="#1e40af" opacity="0.9"/>
      <circle cx="31" cy="49" r="2" fill="white"/>
      <circle cx="51" cy="49" r="2" fill="white"/>
      <path d="M28 62 Q40 70 52 62" stroke="#1d4ed8" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>,
    // SR: 貫禄の親方
    <svg key="4" viewBox="0 0 80 80" className="w-full h-full">
      <circle cx="40" cy="44" r="32" fill="#e9d5ff" stroke="#9333ea" strokeWidth="2"/>
      <path d="M12 36 Q40 8 68 36" fill="#7e22ce" stroke="#6b21a8" strokeWidth="2"/>
      <rect x="14" y="34" width="52" height="8" rx="4" fill="#7e22ce"/>
      <rect x="28" y="30" width="24" height="6" rx="3" fill="#fbbf24"/>
      <path d="M30 30 L40 18 L50 30" fill="#f59e0b" stroke="#d97706" strokeWidth="1"/>
      <ellipse cx="29" cy="50" rx="5" ry="4" fill="#6b21a8"/>
      <ellipse cx="51" cy="50" rx="5" ry="4" fill="#6b21a8"/>
      <circle cx="30" cy="49" r="2" fill="white"/>
      <circle cx="52" cy="49" r="2" fill="white"/>
      <path d="M26 60 Q40 70 54 60" stroke="#7e22ce" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <line x1="26" y1="56" width="5" x2="30" y2="52" stroke="#6b21a8" strokeWidth="2"/>
      <line x1="54" y1="56" x2="50" y2="52" stroke="#6b21a8" strokeWidth="2"/>
    </svg>,
    // レジェンド: 神の職人
    <svg key="5" viewBox="0 0 80 80" className="w-full h-full">
      <circle cx="40" cy="40" r="36" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
      {[0,60,120,180,240,300].map((deg, i) => (
        <line key={i} x1="40" y1="8" x2="40" y2="2"
          stroke="#fbbf24" strokeWidth="2"
          transform={`rotate(${deg} 40 40)`}/>
      ))}
      <circle cx="40" cy="40" r="28" fill="#fef9c3"/>
      <path d="M18 36 Q40 12 62 36" fill="#d97706" stroke="#b45309" strokeWidth="2"/>
      <rect x="16" y="34" width="48" height="7" rx="3" fill="#d97706"/>
      <rect x="26" y="30" width="28" height="5" rx="2" fill="#fbbf24"/>
      <ellipse cx="28" cy="49" rx="5" ry="4" fill="#92400e"/>
      <ellipse cx="52" cy="49" rx="5" ry="4" fill="#92400e"/>
      <circle cx="29" cy="48" r="2.5" fill="white"/>
      <circle cx="53" cy="48" r="2.5" fill="white"/>
      <circle cx="30" cy="47" r="1" fill="#fbbf24"/>
      <circle cx="54" cy="47" r="1" fill="#fbbf24"/>
      <path d="M24 62 Q40 74 56 62" stroke="#d97706" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M24 58 Q24 52 28 50" stroke="#92400e" strokeWidth="2" fill="none"/>
      <path d="M56 58 Q56 52 52 50" stroke="#92400e" strokeWidth="2" fill="none"/>
    </svg>,
  ]
  const faceIndex = (rarity - 1 + (id % 2)) % faces.length
  return <>{faces[Math.min(rarity - 1, 4)]}</>
}

// ─── スパークルエフェクト ────────────────────────────────
function Sparkles({ rarity }: { rarity: Rarity }) {
  if (rarity < 3) return null
  const colors = rarity === 5
    ? ['#fbbf24','#f59e0b','#fcd34d','#fff','#f97316']
    : rarity === 4
    ? ['#c084fc','#a855f7','#818cf8','#fff','#e879f9']
    : ['#60a5fa','#34d399','#a78bfa','#fff','#f472b6']

  const count = rarity === 5 ? 18 : rarity === 4 ? 12 : 8
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360
        const dist  = 60 + Math.random() * 60
        const tx    = Math.cos((angle * Math.PI) / 180) * dist
        const ty    = Math.sin((angle * Math.PI) / 180) * dist
        const size  = 6 + Math.random() * 12
        const delay = Math.random() * 0.4
        return (
          <div
            key={i}
            className="sparkle-item absolute"
            style={{
              left: '50%', top: '50%',
              width: size, height: size,
              marginLeft: -size / 2, marginTop: -size / 2,
              background: colors[i % colors.length],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              transform: `rotate(${angle}deg)`,
              animationDelay: `${delay}s`,
              '--tx': `${tx}px`, '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}

// ─── カードコンポーネント ────────────────────────────────
function GachaCardDisplay({ card, size = 'full' }: { card: Card; size?: 'full' | 'mini' }) {
  const c = RARITY_COLORS[card.rarity]
  const isLegend = card.rarity === 5

  if (size === 'mini') {
    return (
      <div className={`rounded-xl border-2 ${c.border} bg-gradient-to-b ${c.bg} p-2 flex flex-col items-center gap-1`}>
        <div className="w-10 h-10">
          <CardFace rarity={card.rarity} id={card.id} />
        </div>
        <p className="text-[9px] font-bold text-center leading-tight line-clamp-2">{card.name}</p>
        <p className={`text-[8px] font-bold ${c.text}`}>{'★'.repeat(card.rarity)}</p>
      </div>
    )
  }

  return (
    <div className={`relative rounded-2xl border-4 ${c.border} bg-gradient-to-b ${c.bg} p-4 w-64 mx-auto ${isLegend ? 'legend-card' : ''}`}>
      <div className="text-center mb-1">
        <span className={`text-xs font-bold ${c.text}`}>{RARITY_LABELS[card.rarity]}</span>
      </div>
      <div className="w-32 h-32 mx-auto mb-3">
        <CardFace rarity={card.rarity} id={card.id} />
      </div>
      <h3 className={`text-center font-black text-base mb-3 ${c.text}`}>{card.name}</h3>

      {/* 能力値 */}
      <div className="bg-white/60 rounded-xl p-3 space-y-1.5 mb-3">
        {Object.entries(card.skills).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-14 shrink-0">{key}</span>
            <div className="flex-1 bg-white/80 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${val}%`, background: isLegend ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : '#3b82f6' }}
              />
            </div>
            <span className="text-xs font-bold text-gray-700 w-6 text-right">{val}</span>
          </div>
        ))}
      </div>

      {/* 特殊効果 */}
      <div className="bg-white/70 rounded-xl p-2 text-center">
        <p className="text-xs text-gray-500 mb-0.5">特殊効果</p>
        <p className={`text-sm font-bold ${c.text}`}>「{card.effect}」</p>
      </div>
    </div>
  )
}

// ─── ガチャタブ ──────────────────────────────────────────
function GachaTab() {
  const [phase, setPhase] = useState<'idle' | 'animating' | 'reveal'>('idle')
  const [pulledCard, setPulledCard] = useState<Card | null>(null)
  const [collection, setCollection] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem(LS_GACHA_COLLECTION) ?? '[]')
  )
  const [alreadyPulled, setAlreadyPulled] = useState(
    localStorage.getItem(LS_GACHA_DATE) === today()
  )

  const isNew = pulledCard ? !collection.includes(pulledCard.id) : false

  const handlePull = () => {
    setPhase('animating')
    setTimeout(() => {
      const card = pullCard()
      setPulledCard(card)
      const newCol = collection.includes(card.id) ? collection : [...collection, card.id]
      setCollection(newCol)
      localStorage.setItem(LS_GACHA_COLLECTION, JSON.stringify(newCol))
      localStorage.setItem(LS_GACHA_DATE, today())
      setAlreadyPulled(true)
      setPhase('reveal')
    }, 1200)
  }

  const totalCards = CARDS.length
  const gotAll = collection.length === totalCards

  return (
    <div className="px-4 py-4">
      {gotAll && (
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-2xl p-4 mb-4 text-center shadow-lg">
          <p className="text-2xl font-black">🏆 伝説の親方</p>
          <p className="text-sm mt-1">全{totalCards}種コンプリート達成！</p>
        </div>
      )}

      {/* 進捗 */}
      <div className="bg-white rounded-xl p-3 mb-4 shadow-sm border border-gray-100">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">図鑑達成率</span>
          <span className="font-bold text-blue-600">{collection.length} / {totalCards}</span>
        </div>
        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(collection.length / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* ガチャメイン */}
      {phase === 'idle' && (
        <div className="text-center py-6">
          <div className="text-6xl mb-4 pulse-glow-anim inline-block">🎰</div>
          <p className="text-gray-600 text-sm mb-6">毎日1回無料！職人カードを集めよう</p>
          {alreadyPulled ? (
            <div className="bg-gray-100 rounded-2xl p-4">
              <p className="text-gray-500 font-medium">今日はもう引きました</p>
              <p className="text-sm text-gray-400 mt-1">明日0時にリセット</p>
            </div>
          ) : (
            <button
              onClick={handlePull}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform"
            >
              ガチャを引く！
            </button>
          )}
        </div>
      )}

      {phase === 'animating' && (
        <div className="text-center py-8">
          <div className="text-7xl animate-bounce mb-4">🎰</div>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2].map(i => (
              <div key={i} className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-3">引いています…</p>
        </div>
      )}

      {phase === 'reveal' && pulledCard && (
        <div className="text-center">
          {isNew && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl px-4 py-2 mb-3 inline-block font-bold text-sm animate-bounce">
              🌟 NEW！初めてのカード！
            </div>
          )}
          <div className="relative inline-block card-animate-in">
            <Sparkles rarity={pulledCard.rarity} />
            <GachaCardDisplay card={pulledCard} />
          </div>
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => setPhase('idle')}
              className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm active:bg-gray-300"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 図鑑タブ ────────────────────────────────────────────
function CollectionTab() {
  const collection: number[] = JSON.parse(localStorage.getItem(LS_GACHA_COLLECTION) ?? '[]')
  const rarities: Rarity[] = [5, 4, 3, 2, 1]

  return (
    <div className="px-4 py-4">
      <p className="text-xs text-gray-500 mb-3">
        収集: {collection.length} / {CARDS.length}種
        {collection.length === CARDS.length && ' 🏆 コンプリート！'}
      </p>
      {rarities.map(r => {
        const cards = CARDS.filter(c => c.rarity === r)
        const c = RARITY_COLORS[r]
        return (
          <div key={r} className="mb-4">
            <h3 className={`text-sm font-bold mb-2 ${c.text}`}>{RARITY_LABELS[r]}</h3>
            <div className="grid grid-cols-4 gap-2">
              {cards.map(card => {
                const owned = collection.includes(card.id)
                return (
                  <div key={card.id} className={!owned ? 'opacity-30 grayscale' : ''}>
                    <GachaCardDisplay card={card} size="mini" />
                    {!owned && (
                      <p className="text-[8px] text-center text-gray-400 mt-0.5">???</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── 格言タブ ────────────────────────────────────────────
function QuoteTab() {
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'reveal'>('idle')
  const [streak, setStreak]       = useState(() => Number(localStorage.getItem(LS_QUOTE_STREAK) ?? 0))
  const [quoteId, setQuoteId]     = useState<number | null>(() => {
    const saved = localStorage.getItem(LS_QUOTE_ID)
    const date  = localStorage.getItem(LS_QUOTE_DATE)
    return (saved && date === today()) ? Number(saved) : null
  })
  const [alreadyPulled, setAlreadyPulled] = useState(
    localStorage.getItem(LS_QUOTE_DATE) === today()
  )

  const quote = quoteId != null ? QUOTES.find(q => q.id === quoteId) ?? null : null

  const handlePull = () => {
    setPhase('shaking')
    setTimeout(() => {
      const q = getTodayQuote(today())

      // 連続日数チェック
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const lastDate  = localStorage.getItem(LS_QUOTE_DATE)
      const newStreak = lastDate === yesterday ? streak + 1 : 1

      setStreak(newStreak)
      setQuoteId(q.id)
      setAlreadyPulled(true)
      localStorage.setItem(LS_QUOTE_DATE,   today())
      localStorage.setItem(LS_QUOTE_STREAK, String(newStreak))
      localStorage.setItem(LS_QUOTE_ID,     String(q.id))
      setPhase('reveal')
    }, 1800)
  }

  return (
    <div className="px-4 py-4">
      {/* 連続日数バッジ */}
      {streak > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="font-bold text-orange-700">{streak}日連続</p>
            <p className="text-xs text-orange-500">今日も格言を引こう！</p>
          </div>
        </div>
      )}

      {/* 今日の格言（引いた後は常時表示） */}
      {alreadyPulled && quote && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-5 mb-4 quote-animate-in">
          <p className="text-xs text-indigo-400 mb-2 text-center font-medium">📜 今日の言葉</p>
          <p className="text-base font-bold text-gray-800 leading-relaxed text-center mb-3">
            「{quote.text}」
          </p>
          <p className="text-sm text-indigo-600 font-medium text-right">— {quote.author}</p>
        </div>
      )}

      {/* おみくじ */}
      {!alreadyPulled && phase === 'idle' && (
        <div className="text-center py-6">
          <div className="text-6xl mb-2">🎋</div>
          <p className="text-gray-500 text-sm mb-1">現場神社のおみくじ</p>
          <p className="text-xs text-gray-400 mb-6">今日の格言を引こう</p>
          <button
            onClick={handlePull}
            className="bg-gradient-to-b from-red-500 to-red-700 text-white px-10 py-4 rounded-2xl font-black text-base shadow-lg active:scale-95 transition-transform border-b-4 border-red-900"
          >
            🎋 おみくじを引く
          </button>
        </div>
      )}

      {phase === 'shaking' && (
        <div className="text-center py-8">
          <div className="text-7xl box-shake inline-block mb-4">🎋</div>
          <p className="text-gray-500 text-sm mt-2">おみくじを振っています…</p>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
      )}

      {phase === 'reveal' && !alreadyPulled && quote && (
        <div className="text-center quote-animate-in">
          <p className="text-green-600 font-bold mb-3">✨ 今日の格言が出ました！</p>
        </div>
      )}

      {alreadyPulled && phase === 'idle' && (
        <div className="text-center text-gray-400 text-sm py-2">
          <p>明日また引けます 🌅</p>
        </div>
      )}
    </div>
  )
}

// ─── メインページ ────────────────────────────────────────
type FunTab = 'gacha' | 'collection' | 'quote'

export default function FunPage() {
  const [tab, setTab] = useState<FunTab>('gacha')

  const tabs: { key: FunTab; label: string; icon: string }[] = [
    { key: 'gacha',      label: 'ガチャ',  icon: '🎰' },
    { key: 'collection', label: '図鑑',    icon: '📖' },
    { key: 'quote',      label: '格言',    icon: '🎋' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-30">
        <h1 className="text-lg font-bold">おたのしみ</h1>
      </div>

      <div className="flex bg-white border-b sticky top-[52px] z-20">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors flex flex-col items-center gap-0.5 ${
              tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            <span className="text-lg">{t.icon}</span>
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'gacha'      && <GachaTab />}
      {tab === 'collection' && <CollectionTab />}
      {tab === 'quote'      && <QuoteTab />}
    </div>
  )
}
