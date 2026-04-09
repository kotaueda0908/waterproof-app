import { useState } from 'react'
import { CARDS, RARITY_FRAME, RARITY_LABELS, ATTRIBUTE_ICONS, pullCard } from '../data/cards'
import type { Card, Rarity } from '../data/cards'

const LS_GACHA_DATE       = 'lifeeve_gacha_date'
const LS_GACHA_COLLECTION = 'lifeeve_gacha_collection'
const today = () => new Date().toISOString().slice(0, 10)

// ─── キャラクターSVGイラスト ───────────────────────────────
function CharacterArt({ card }: { card: Card }) {
  const { id, rarity } = card

  // レジェンド専用イラスト
  if (id === 42) return <TsubashiArt />
  if (id === 41) return <ZeroArt />
  if (id === 40) return <TenchiArt />
  if (id === 39) return <GenSanArt />

  if (rarity === 4) return id % 2 === 0 ? <MasterArtA /> : <MasterArtB />
  if (rarity === 3) {
    const v = id % 3
    return v === 0 ? <RareArtA /> : v === 1 ? <RareArtB /> : <RareArtC />
  }
  if (rarity === 2) return id % 2 === 0 ? <UncommonArtA /> : <UncommonArtB />
  return id % 2 === 0 ? <NormalArtA /> : <NormalArtB />
}

/* ── 土橋（塗装神） ── */
function TsubashiArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* 背景：ペンキ壁 */}
      <rect width="200" height="200" fill="#f8fafc"/>
      <rect x="0" y="0" width="200" height="200" fill="#f1f5f9"/>
      {[20,55,95,135,168].map(y => <rect key={y} x="0" y={y} width="200" height="7" fill="#e2e8f0"/>)}
      {/* ペンキ飛び散り */}
      {[[25,18,'#fbbf24'],[170,45,'#60a5fa'],[15,90,'#f87171'],[180,130,'#34d399'],[30,160,'#a78bfa']].map(([x,y,c],i)=>
        <circle key={i} cx={x as number} cy={y as number} r="7" fill={c as string} opacity="0.5"/>
      )}
      {/* 炎エフェクト */}
      {[[90,195,'#f97316'],[100,190,'#ef4444'],[110,195,'#f59e0b']].map(([x,y,c],i) => (
        <ellipse key={i} cx={x as number} cy={y as number} rx="8" ry="14" fill={c as string} opacity="0.6"/>
      ))}
      {/* 脚 */}
      <rect x="78" y="162" width="18" height="28" rx="5" fill="#e2e8f0"/>
      <rect x="104" y="162" width="18" height="28" rx="5" fill="#e2e8f0"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#374151"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#374151"/>
      {/* 胴体 */}
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#f8fafc"/>
      <line x1="100" y1="110" x2="100" y2="165" stroke="#e2e8f0" strokeWidth="1.5"/>
      {/* ペンキ染み on 制服 */}
      {[[82,128,'#fbbf24'],[116,140,'#60a5fa'],[88,152,'#f87171']].map(([x,y,c],i)=>
        <circle key={i} cx={x as number} cy={y as number} r="4" fill={c as string} opacity="0.6"/>
      )}
      {/* 左腕（腰に手） */}
      <path d="M68 118 Q52 125 48 145 Q44 158 55 163 Q62 135 74 128 Z" fill="#f8fafc"/>
      <circle cx="53" cy="164" r="9" fill="#fcd9bd"/>
      {/* 右腕（ローラー担ぎ） */}
      <path d="M132 115 Q148 108 152 90 Q155 78 148 72" stroke="#f8fafc" strokeWidth="22" fill="none" strokeLinecap="round"/>
      {/* ローラー柄 */}
      <rect x="140" y="52" width="7" height="68" rx="3.5" fill="#78350f" transform="rotate(-15 143.5 86)"/>
      {/* ローラーヘッド */}
      <rect x="132" y="46" width="34" height="18" rx="9" fill="#9ca3af" transform="rotate(-15 149 55)"/>
      <rect x="134" y="48" width="30" height="14" rx="7" fill="#6b7280" transform="rotate(-15 149 55)"/>
      <path d="M134 50 Q148 44 166 52" stroke="#fbbf24" strokeWidth="4" fill="none" opacity="0.8" strokeLinecap="round" transform="rotate(-15 150 51)"/>
      {/* 頭部 */}
      <circle cx="100" cy="82" r="30" fill="#fcd9bd"/>
      {/* 首 */}
      <rect x="92" y="108" width="16" height="8" fill="#fcd9bd"/>
      {/* 髪（黒ベース） */}
      <path d="M70 76 Q74 48 100 45 Q126 48 130 76" fill="#1c1917"/>
      <path d="M70 76 Q68 90 72 104" fill="#1c1917"/>
      <path d="M130 76 Q132 90 128 104" fill="#1c1917"/>
      {/* 白髪の白い筋 */}
      <path d="M73 70 Q75 56 80 50" stroke="white" strokeWidth="5" fill="none" opacity="0.95" strokeLinecap="round"/>
      <path d="M127 70 Q125 56 120 50" stroke="white" strokeWidth="5" fill="none" opacity="0.95" strokeLinecap="round"/>
      <path d="M74 80 Q73 68 76 60" stroke="white" strokeWidth="3" fill="none" opacity="0.75" strokeLinecap="round"/>
      <path d="M126 80 Q127 68 124 60" stroke="white" strokeWidth="3" fill="none" opacity="0.75" strokeLinecap="round"/>
      {/* 耳 */}
      <ellipse cx="70" cy="85" rx="6" ry="8" fill="#fbbf24"/>
      <ellipse cx="130" cy="85" rx="6" ry="8" fill="#fbbf24"/>
      {/* 目（鋭い） */}
      <ellipse cx="89" cy="82" rx="8" ry="6" fill="white"/>
      <ellipse cx="111" cy="82" rx="8" ry="6" fill="white"/>
      <path d="M81 80 Q89 77 97 80" fill="#1c1917" opacity="0.12"/>
      <path d="M103 80 Q111 77 119 80" fill="#1c1917" opacity="0.12"/>
      <circle cx="90" cy="82" r="4.5" fill="#1c1917"/>
      <circle cx="112" cy="82" r="4.5" fill="#1c1917"/>
      <circle cx="91.5" cy="80.5" r="1.8" fill="#1d4ed8" opacity="0.7"/>
      <circle cx="113.5" cy="80.5" r="1.8" fill="#1d4ed8" opacity="0.7"/>
      <circle cx="92.5" cy="79.5" r="1.2" fill="white"/>
      <circle cx="114.5" cy="79.5" r="1.2" fill="white"/>
      {/* 太い眉 */}
      <path d="M81 74 Q89 69 97 72" stroke="#1c1917" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M103 72 Q111 69 119 74" stroke="#1c1917" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* シワ */}
      <path d="M84 76 Q87 74 90 76" stroke="#c97316" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M110 76 Q113 74 116 76" stroke="#c97316" strokeWidth="1" fill="none" opacity="0.5"/>
      {/* 鼻 */}
      <path d="M97 92 Q100 98 103 92" stroke="#d4a574" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* 口（自信の笑み） */}
      <path d="M92 104 Q100 110 108 104" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* オーラ */}
      {[0,45,90,135,180,225,270,315].map((deg,i) => (
        <line key={i} x1="100" y1="82"
          x2={100 + Math.cos(deg*Math.PI/180)*48}
          y2={82  + Math.sin(deg*Math.PI/180)*48}
          stroke="#f59e0b" strokeWidth="1.5" opacity="0.25"/>
      ))}
    </svg>
  )
}

/* ── 零（幻の職人） ── */
function ZeroArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect width="200" height="200" fill="#0f0f0f"/>
      {[20,50,90,130,170].map(y=><line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#1f1f2e" strokeWidth="1"/>)}
      {[[40,60],[90,120],[150,80],[60,150],[130,40],[170,160]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.3+i*0.05}/>
      ))}
      {/* 影のシルエット */}
      <ellipse cx="100" cy="145" rx="30" ry="45" fill="#1a1a2e" opacity="0.8"/>
      {/* 謎めいた輪郭 */}
      <path d="M70 80 Q100 50 130 80 Q145 110 130 140 Q100 165 70 140 Q55 110 70 80 Z"
        fill="none" stroke="#4f46e5" strokeWidth="1.5" opacity="0.6"/>
      {/* 目 */}
      <ellipse cx="88" cy="100" rx="8" ry="5" fill="#4f46e5" opacity="0.9"/>
      <ellipse cx="112" cy="100" rx="8" ry="5" fill="#4f46e5" opacity="0.9"/>
      <circle cx="88" cy="100" r="3" fill="white" opacity="0.8"/>
      <circle cx="112" cy="100" r="3" fill="white" opacity="0.8"/>
      {/* 霧エフェクト */}
      {[[100,180,60,30],[80,160,50,25],[120,170,55,28]].map(([cx,cy,rx,ry],i)=>(
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#312e81" opacity="0.15"/>
      ))}
      {/* クエスチョンマーク */}
      <text x="100" y="145" textAnchor="middle" fontSize="32" fill="#6366f1" opacity="0.5" fontWeight="bold">？</text>
      {/* 星屑 */}
      {Array.from({length:12}).map((_,i)=>(
        <circle key={i} cx={10+i*15} cy={10+(i%4)*15} r="1" fill="#a5b4fc" opacity={0.4+Math.random()*0.4}/>
      ))}
    </svg>
  )
}

/* ── 天地（防水の神） ── */
function TenchiArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="sky-t" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#0ea5e9"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#sky-t)"/>
      {/* 雨 */}
      {Array.from({length:20}).map((_,i)=>(
        <line key={i} x1={i*10} y1={(i*7)%200} x2={i*10-5} y2={(i*7+30)%200}
          stroke="#93c5fd" strokeWidth="1" opacity="0.5"/>
      ))}
      {/* 稲妻 */}
      <polyline points="130,20 120,60 135,60 118,100" stroke="#fde047" strokeWidth="3" fill="none"/>
      {/* 人物シルエット */}
      <circle cx="100" cy="80" r="26" fill="#0c4a6e"/>
      <rect x="72" y="104" width="56" height="55" rx="6" fill="#075985"/>
      <rect x="50" y="106" width="22" height="45" rx="11" fill="#075985"/>
      <rect x="128" y="106" width="22" height="45" rx="11" fill="#075985"/>
      {/* 腕を広げる */}
      <path d="M50 110 Q30 100 15 110" stroke="#0284c7" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M150 110 Q170 100 185 110" stroke="#0284c7" strokeWidth="14" fill="none" strokeLinecap="round"/>
      {/* 顔 */}
      <circle cx="100" cy="80" r="24" fill="#bae6fd"/>
      <path d="M76 76 Q82 55 100 52 Q118 55 124 76" fill="#0c4a6e"/>
      <ellipse cx="91" cy="78" rx="6" ry="5" fill="white"/>
      <ellipse cx="109" cy="78" rx="6" ry="5" fill="white"/>
      <circle cx="91" cy="78" r="3.5" fill="#0c4a6e"/>
      <circle cx="109" cy="78" r="3.5" fill="#0c4a6e"/>
      <circle cx="92" cy="77" r="1.5" fill="#38bdf8"/>
      <circle cx="110" cy="77" r="1.5" fill="#38bdf8"/>
      <path d="M82 66 Q91 62 98 66" stroke="#0c4a6e" strokeWidth="3" fill="none"/>
      <path d="M102 66 Q109 62 118 66" stroke="#0c4a6e" strokeWidth="3" fill="none"/>
      <path d="M92 90 Q100 95 108 90" stroke="#0c4a6e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 水の玉 */}
      {[[30,140,'#38bdf8'],[170,130,'#7dd3fc'],[100,190,'#0ea5e9']].map(([x,y,c],i)=>(
        <ellipse key={i} cx={x as number} cy={y as number} rx="10" ry="14" fill={c as string} opacity="0.6"/>
      ))}
    </svg>
  )
}

/* ── 源さん（神の手） ── */
function GenSanArt() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="glow-g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3"/>
          <stop offset="100%" stopColor="#fef3c7"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#glow-g)"/>
      {/* 光条 */}
      {Array.from({length:12}).map((_,i)=>(
        <line key={i} x1="100" y1="100"
          x2={100+Math.cos(i*30*Math.PI/180)*150}
          y2={100+Math.sin(i*30*Math.PI/180)*150}
          stroke="#fde68a" strokeWidth="2" opacity="0.35"/>
      ))}
      {/* 脚 */}
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#d97706"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#d97706"/>
      <ellipse cx="87" cy="190" rx="14" ry="6" fill="#78350f"/>
      <ellipse cx="113" cy="190" rx="14" ry="6" fill="#78350f"/>
      {/* 胴体（金色作業服） */}
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#b45309"/>
      <line x1="100" y1="110" x2="100" y2="165" stroke="#92400e" strokeWidth="2"/>
      {/* 神の手（両手から光） */}
      <ellipse cx="52" cy="145" rx="13" ry="10" fill="#fcd9bd"/>
      <ellipse cx="148" cy="145" rx="13" ry="10" fill="#fcd9bd"/>
      {[[48,138],[55,135],[46,148],[52,152],[58,142]].map(([x,y],i)=>(
        <line key={i} x1={x} y1={y} x2={x-10} y2={y-8} stroke="#fde68a" strokeWidth="2" opacity="0.8"/>
      ))}
      {[[144,138],[151,135],[142,148],[148,152],[154,142]].map(([x,y],i)=>(
        <line key={i} x1={x} y1={y} x2={x+10} y2={y-8} stroke="#fde68a" strokeWidth="2" opacity="0.8"/>
      ))}
      <rect x="50" y="106" width="20" height="42" rx="10" fill="#b45309"/>
      <rect x="130" y="106" width="20" height="42" rx="10" fill="#b45309"/>
      {/* 頭部 */}
      <circle cx="100" cy="80" r="28" fill="#fcd9bd"/>
      <rect x="93" y="106" width="14" height="8" fill="#fcd9bd"/>
      {/* 白髪（全白） */}
      <path d="M72 76 Q76 48 100 44 Q124 48 128 76" fill="#f8fafc"/>
      <path d="M72 76 Q70 92 74 106" fill="#f8fafc"/>
      <path d="M128 76 Q130 92 126 106" fill="#f8fafc"/>
      {/* 耳 */}
      <ellipse cx="72" cy="84" rx="6" ry="8" fill="#fbbf24"/>
      <ellipse cx="128" cy="84" rx="6" ry="8" fill="#fbbf24"/>
      {/* 優しい目 */}
      <path d="M82 80 Q91 74 99 80" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M101 80 Q109 74 118 80" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="91" cy="81" r="3.5" fill="#78350f"/>
      <circle cx="109" cy="81" r="3.5" fill="#78350f"/>
      <circle cx="92" cy="80" r="1.5" fill="white"/>
      <circle cx="110" cy="80" r="1.5" fill="white"/>
      {/* 太い眉（白） */}
      <path d="M82 73 Q91 69 99 72" stroke="#9ca3af" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M101 72 Q109 69 118 73" stroke="#9ca3af" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* 温かい笑顔 */}
      <path d="M90 92 Q100 100 110 92" stroke="#92400e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* 光の冠 */}
      {[-40,-20,0,20,40].map((deg,i)=>(
        <ellipse key={i} cx={100+Math.sin(deg*Math.PI/180)*35} cy={52+Math.cos(deg*Math.PI/180)*10}
          rx="4" ry="12" fill="#fde68a" opacity="0.7" transform={`rotate(${deg} ${100+Math.sin(deg*Math.PI/180)*35} ${52+Math.cos(deg*Math.PI/180)*10})`}/>
      ))}
    </svg>
  )
}

/* ── SR マスターA ── */
function MasterArtA() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="bg-ma" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b"/><stop offset="100%" stopColor="#312e81"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#bg-ma)"/>
      {/* 紫の光条 */}
      {[0,60,120,180,240,300].map((deg,i)=>(
        <line key={i} x1="100" y1="100"
          x2={100+Math.cos(deg*Math.PI/180)*150} y2={100+Math.sin(deg*Math.PI/180)*150}
          stroke="#7c3aed" strokeWidth="1.5" opacity="0.3"/>
      ))}
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#4c1d95"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#4c1d95"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#4c1d95"/>
      <rect x="50" y="106" width="20" height="50" rx="10" fill="#4c1d95"/>
      <rect x="130" y="106" width="20" height="50" rx="10" fill="#4c1d95"/>
      {/* 光るツール */}
      <rect x="138" y="70" width="8" height="40" rx="4" fill="#c084fc" transform="rotate(30 142 90)"/>
      <ellipse cx="148" cy="68" rx="12" ry="8" fill="#a855f7" transform="rotate(30 148 68)"/>
      {[[-15,-10],[0,-16],[15,-10],[20,0],[15,10]].map(([dx,dy],i)=>(
        <line key={i} x1="148" y1="68" x2={148+dx*2} y2={68+dy*2}
          stroke="#e9d5ff" strokeWidth="1.5" opacity="0.8" transform="rotate(30 148 68)"/>
      ))}
      <circle cx="100" cy="80" r="28" fill="#e9d5ff"/>
      <rect x="93" y="106" width="14" height="8" fill="#e9d5ff"/>
      {/* 逆立つ髪 */}
      <path d="M72 74 Q80 46 100 42 Q120 46 128 74" fill="#6d28d9"/>
      {[-15,-5,5,15].map((x,i)=>(
        <path key={i} d={`M${100+x} 44 Q${102+x} 30 ${100+x} 20`} stroke="#7c3aed" strokeWidth="5" fill="none" strokeLinecap="round"/>
      ))}
      <ellipse cx="72" cy="84" rx="6" ry="8" fill="#e9d5ff"/>
      <ellipse cx="128" cy="84" rx="6" ry="8" fill="#e9d5ff"/>
      <ellipse cx="89" cy="80" rx="7" ry="6" fill="white"/>
      <ellipse cx="111" cy="80" rx="7" ry="6" fill="white"/>
      <circle cx="90" cy="80" r="4" fill="#4c1d95"/>
      <circle cx="112" cy="80" r="4" fill="#4c1d95"/>
      <circle cx="91" cy="79" r="2" fill="#a855f7"/>
      <circle cx="113" cy="79" r="2" fill="#a855f7"/>
      <circle cx="92" cy="78" r="1.2" fill="white"/>
      <circle cx="114" cy="78" r="1.2" fill="white"/>
      <path d="M82 72 Q89 67 96 71" stroke="#6d28d9" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M104 71 Q111 67 118 72" stroke="#6d28d9" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M97 92 Q100 98 103 92" stroke="#d4a574" strokeWidth="1.5" fill="none"/>
      <path d="M91 102 Q100 108 109 102" stroke="#7c3aed" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── SR マスターB（不死鳥） ── */
function MasterArtB() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="bg-mb" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#b45309"/><stop offset="100%" stopColor="#7c2d12"/>
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="#1c0a00"/>
      <rect width="200" height="200" fill="url(#bg-mb)" opacity="0.7"/>
      {/* 炎の揺らぎ */}
      {[[40,180,'#f97316',15,35],[70,170,'#ef4444',12,30],[100,165,'#fbbf24',18,40],[130,170,'#f97316',12,30],[160,180,'#ef4444',15,35]].map(([x,y,c,rx,ry],i)=>(
        <ellipse key={i} cx={x as number} cy={y as number} rx={rx as number} ry={ry as number} fill={c as string} opacity="0.5"/>
      ))}
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#c2410c"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#c2410c"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#431407"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#431407"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#c2410c"/>
      <rect x="46" y="108" width="22" height="48" rx="11" fill="#c2410c"/>
      <rect x="132" y="108" width="22" height="48" rx="11" fill="#c2410c"/>
      {/* 翼のような炎 */}
      <path d="M46 110 Q25 90 10 110 Q20 80 46 100 Z" fill="#f97316" opacity="0.7"/>
      <path d="M154 110 Q175 90 190 110 Q180 80 154 100 Z" fill="#f97316" opacity="0.7"/>
      <circle cx="100" cy="80" r="28" fill="#fed7aa"/>
      <rect x="93" y="106" width="14" height="8" fill="#fed7aa"/>
      {/* 炎色の髪 */}
      <path d="M72 74 Q80 48 100 44 Q120 48 128 74" fill="#ea580c"/>
      {[-10,0,10].map((x,i)=>(
        <path key={i} d={`M${100+x} 46 Q${103+x} 25 ${100+x} 14`} stroke="#f97316" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8"/>
      ))}
      <ellipse cx="72" cy="84" rx="6" ry="8" fill="#fed7aa"/>
      <ellipse cx="128" cy="84" rx="6" ry="8" fill="#fed7aa"/>
      <ellipse cx="89" cy="80" rx="7" ry="6" fill="white"/>
      <ellipse cx="111" cy="80" rx="7" ry="6" fill="white"/>
      <circle cx="90" cy="80" r="4" fill="#7c2d12"/>
      <circle cx="112" cy="80" r="4" fill="#7c2d12"/>
      <circle cx="91" cy="79" r="2" fill="#f97316"/>
      <circle cx="113" cy="79" r="2" fill="#f97316"/>
      <circle cx="92" cy="78" r="1.2" fill="white"/>
      <circle cx="114" cy="78" r="1.2" fill="white"/>
      <path d="M82 72 Q89 67 96 70" stroke="#7c2d12" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M104 70 Q111 67 118 72" stroke="#7c2d12" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M90 102 Q100 108 110 102" stroke="#c2410c" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── レアA（達人） ── */
function RareArtA() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><linearGradient id="bg-ra" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#3b82f6"/>
      </linearGradient></defs>
      <rect width="200" height="200" fill="url(#bg-ra)"/>
      {[40,80,120,160].map(y=><rect key={y} x="0" y={y} width="200" height="2" fill="white" opacity="0.05"/>)}
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#1e40af"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#1e40af"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#1e3a8a"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#1e3a8a"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#1e40af"/>
      {/* ヘルメット */}
      <path d="M72 72 Q80 48 100 46 Q120 48 128 72" fill="#2563eb"/>
      <rect x="68" y="70" width="64" height="10" rx="5" fill="#1d4ed8"/>
      <rect x="78" y="64" width="44" height="8" rx="4" fill="#60a5fa"/>
      <rect x="50" y="106" width="20" height="50" rx="10" fill="#1e40af"/>
      <rect x="130" y="106" width="20" height="50" rx="10" fill="#1e40af"/>
      {/* 工具 */}
      <rect x="136" y="88" width="6" height="30" rx="3" fill="#94a3b8"/>
      <rect x="130" y="84" width="18" height="10" rx="5" fill="#64748b"/>
      <rect x="140" y="118" width="10" height="6" rx="3" fill="#94a3b8"/>
      <circle cx="100" cy="88" r="26" fill="#dbeafe"/>
      <rect x="93" y="112" width="14" height="6" fill="#dbeafe"/>
      <path d="M74 80 Q80 56 100 54 Q120 56 126 80" fill="#1e3a8a"/>
      <ellipse cx="74" cy="90" rx="6" ry="7" fill="#dbeafe"/>
      <ellipse cx="126" cy="90" rx="6" ry="7" fill="#dbeafe"/>
      <ellipse cx="90" cy="86" rx="6" ry="5" fill="white"/>
      <ellipse cx="110" cy="86" rx="6" ry="5" fill="white"/>
      <circle cx="90" cy="86" r="3.5" fill="#1e3a8a"/>
      <circle cx="110" cy="86" r="3.5" fill="#1e3a8a"/>
      <circle cx="91" cy="85" r="1.5" fill="#93c5fd"/>
      <circle cx="111" cy="85" r="1.5" fill="#93c5fd"/>
      <circle cx="92" cy="84" r="1" fill="white"/>
      <circle cx="112" cy="84" r="1" fill="white"/>
      <path d="M83 78 Q90 74 97 77" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M103 77 Q110 74 117 78" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M92 98 Q100 104 108 98" stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── レアB（嵐） ── */
function RareArtB() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><linearGradient id="bg-rb" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#134e4a"/><stop offset="100%" stopColor="#0f766e"/>
      </linearGradient></defs>
      <rect width="200" height="200" fill="url(#bg-rb)"/>
      {Array.from({length:15}).map((_,i)=>(
        <line key={i} x1={i*14} y1={(i*13)%200} x2={i*14-8} y2={(i*13+35)%200}
          stroke="#67e8f9" strokeWidth="1.5" opacity="0.35"/>
      ))}
      <path d="M5 110 Q15 100 20 115" stroke="#67e8f9" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M175 110 Q185 100 190 115" stroke="#67e8f9" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#0f766e"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#0f766e"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#134e4a"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#134e4a"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#0f766e"/>
      <rect x="46" y="108" width="22" height="50" rx="11" fill="#0f766e"/>
      <rect x="132" y="108" width="22" height="50" rx="11" fill="#0f766e"/>
      {/* 風を受けるポーズ */}
      <path d="M46 110 Q34 100 28 85 Q35 90 46 100 Z" fill="#14b8a6" opacity="0.6"/>
      <path d="M154 110 Q166 100 172 85 Q165 90 154 100 Z" fill="#14b8a6" opacity="0.6"/>
      <circle cx="100" cy="82" r="27" fill="#ccfbf1"/>
      <rect x="93" y="107" width="14" height="7" fill="#ccfbf1"/>
      {/* 風になびく髪 */}
      <path d="M73 76 Q80 52 100 50 Q120 52 127 76" fill="#0d9488"/>
      {[10,20,30].map((x,i)=>(
        <path key={i} d={`M${110+x} 54 Q${120+x} 44 ${130+x} 50`}
          stroke="#14b8a6" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8"/>
      ))}
      <ellipse cx="73" cy="85" rx="6" ry="8" fill="#ccfbf1"/>
      <ellipse cx="127" cy="85" rx="6" ry="8" fill="#ccfbf1"/>
      <ellipse cx="90" cy="82" rx="6" ry="5" fill="white"/>
      <ellipse cx="110" cy="82" rx="6" ry="5" fill="white"/>
      <circle cx="91" cy="82" r="3.5" fill="#0f766e"/>
      <circle cx="111" cy="82" r="3.5" fill="#0f766e"/>
      <circle cx="92" cy="81" r="1.5" fill="#5eead4"/>
      <circle cx="112" cy="81" r="1.5" fill="#5eead4"/>
      <circle cx="93" cy="80" r="1" fill="white"/>
      <circle cx="113" cy="80" r="1" fill="white"/>
      <path d="M83 74 Q90 70 97 73" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M103 73 Q110 70 117 74" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M92 95 Q100 101 108 95" stroke="#0f766e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── レアC（炎の魂） ── */
function RareArtC() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><linearGradient id="bg-rc" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#7f1d1d"/><stop offset="100%" stopColor="#ef4444"/>
      </linearGradient></defs>
      <rect width="200" height="200" fill="url(#bg-rc)"/>
      {[[50,190,20,40],[80,185,16,35],[110,182,20,42],[140,188,18,38],[170,190,16,34]].map(([x,y,rx,ry],i)=>(
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#f97316" opacity="0.4"/>
      ))}
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#b91c1c"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#b91c1c"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#7f1d1d"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#7f1d1d"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#b91c1c"/>
      <rect x="50" y="108" width="20" height="50" rx="10" fill="#b91c1c"/>
      <rect x="130" y="108" width="20" height="50" rx="10" fill="#b91c1c"/>
      {/* 炎のオーラ */}
      {[[-30,0],[30,0],[0,-20]].map(([dx,dy],i)=>(
        <ellipse key={i} cx={100+dx} cy={85+dy} rx="45" ry="55" fill="#f97316" opacity="0.08"/>
      ))}
      <circle cx="100" cy="82" r="27" fill="#fecaca"/>
      <rect x="93" y="107" width="14" height="7" fill="#fecaca"/>
      {/* 炎の髪 */}
      <path d="M73 76 Q80 50 100 47 Q120 50 127 76" fill="#dc2626"/>
      {[-12,-4,4,12].map((x,i)=>(
        <path key={i} d={`M${100+x} 49 Q${102+x} 30 ${100+x} 18`}
          stroke="#f97316" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9"/>
      ))}
      <ellipse cx="73" cy="85" rx="6" ry="8" fill="#fecaca"/>
      <ellipse cx="127" cy="85" rx="6" ry="8" fill="#fecaca"/>
      <ellipse cx="90" cy="82" rx="6" ry="5" fill="white"/>
      <ellipse cx="110" cy="82" rx="6" ry="5" fill="white"/>
      <circle cx="91" cy="82" r="3.8" fill="#7f1d1d"/>
      <circle cx="111" cy="82" r="3.8" fill="#7f1d1d"/>
      <circle cx="92" cy="81" r="1.8" fill="#f97316"/>
      <circle cx="112" cy="81" r="1.8" fill="#f97316"/>
      <circle cx="93" cy="80" r="1.2" fill="white"/>
      <circle cx="113" cy="80" r="1.2" fill="white"/>
      <path d="M82 73 Q89 68 96 72" stroke="#7f1d1d" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M104 72 Q111 68 118 73" stroke="#7f1d1d" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M91 96 Q100 103 109 96" stroke="#b91c1c" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── アンコモンA（ヘルメット） ── */
function UncommonArtA() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><linearGradient id="bg-ua" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1c4a1c"/><stop offset="100%" stopColor="#4ade80"/>
      </linearGradient></defs>
      <rect width="200" height="200" fill="url(#bg-ua)"/>
      <rect x="0" y="160" width="200" height="40" fill="#4b5563"/>
      {[10,30,50,70,90,110,130,150,170,190].map(x=>(
        <rect key={x} x={x} y="150" width="8" height="15" rx="2" fill="#6b7280"/>
      ))}
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#15803d"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#15803d"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#15803d"/>
      <rect x="50" y="108" width="20" height="50" rx="10" fill="#15803d"/>
      <rect x="130" y="108" width="20" height="50" rx="10" fill="#15803d"/>
      {/* 工具ベルト */}
      <rect x="68" y="155" width="64" height="8" rx="4" fill="#92400e"/>
      {[80,100,120].map(x=>(<rect key={x} x={x} y="153" width="8" height="12" rx="2" fill="#78350f"/>))}
      {/* ドリル */}
      <rect x="136" y="110" width="8" height="35" rx="4" fill="#9ca3af" transform="rotate(20 140 127)"/>
      <path d="M142 106 L150 110 L146 116 Z" fill="#6b7280" transform="rotate(20 146 111)"/>
      <circle cx="100" cy="84" r="27" fill="#dcfce7"/>
      <rect x="93" y="109" width="14" height="7" fill="#dcfce7"/>
      {/* ヘルメット */}
      <path d="M73 76 Q80 52 100 50 Q120 52 127 76" fill="#f59e0b"/>
      <rect x="70" y="74" width="60" height="9" rx="4.5" fill="#d97706"/>
      <rect x="80" y="68" width="40" height="7" rx="3.5" fill="#fbbf24"/>
      <ellipse cx="73" cy="86" rx="6" ry="8" fill="#dcfce7"/>
      <ellipse cx="127" cy="86" rx="6" ry="8" fill="#dcfce7"/>
      <ellipse cx="90" cy="84" rx="6" ry="5" fill="white"/>
      <ellipse cx="110" cy="84" rx="6" ry="5" fill="white"/>
      <circle cx="91" cy="84" r="3.5" fill="#15803d"/>
      <circle cx="111" cy="84" r="3.5" fill="#15803d"/>
      <circle cx="92" cy="83" r="1.5" fill="#86efac"/>
      <circle cx="112" cy="83" r="1.5" fill="#86efac"/>
      <circle cx="93" cy="82" r="1" fill="white"/>
      <circle cx="113" cy="82" r="1" fill="white"/>
      <path d="M83 77 Q90 73 97 76" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M103 76 Q110 73 117 77" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M92 96 Q100 102 108 96" stroke="#15803d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── アンコモンB（集中） ── */
function UncommonArtB() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect width="200" height="200" fill="#1e293b"/>
      {[30,60,90,120,150,180].map(y=>(
        <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#334155" strokeWidth="1"/>
      ))}
      <rect x="0" y="162" width="200" height="38" fill="#0f172a"/>
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#1e40af"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#1e40af"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#1e40af"/>
      <rect x="50" y="108" width="20" height="50" rx="10" fill="#1e40af"/>
      <rect x="130" y="108" width="20" height="50" rx="10" fill="#1e40af"/>
      {/* ハチマキ */}
      <circle cx="100" cy="84" r="27" fill="#e2e8f0"/>
      <rect x="93" y="109" width="14" height="7" fill="#e2e8f0"/>
      <path d="M73 78 Q80 54 100 52 Q120 54 127 78" fill="#1e293b"/>
      <rect x="73" y="76" width="54" height="8" rx="4" fill="#dc2626"/>
      <text x="100" y="83" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">必勝</text>
      {/* ハチマキの端 */}
      <path d="M127 80 Q140 85 138 100" stroke="#dc2626" strokeWidth="4" fill="none"/>
      <ellipse cx="73" cy="88" rx="6" ry="8" fill="#e2e8f0"/>
      <ellipse cx="127" cy="88" rx="6" ry="8" fill="#e2e8f0"/>
      <ellipse cx="90" cy="86" rx="6" ry="5" fill="white"/>
      <ellipse cx="110" cy="86" rx="6" ry="5" fill="white"/>
      <circle cx="91" cy="86" r="3.5" fill="#1e293b"/>
      <circle cx="111" cy="86" r="3.5" fill="#1e293b"/>
      <circle cx="92" cy="85" r="1.5" fill="#60a5fa"/>
      <circle cx="112" cy="85" r="1.5" fill="#60a5fa"/>
      <circle cx="93" cy="84" r="1" fill="white"/>
      <circle cx="113" cy="84" r="1" fill="white"/>
      <path d="M83 79 Q90 75 97 78" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M103 78 Q110 75 117 79" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* 引き結んだ口（集中） */}
      <line x1="92" y1="98" x2="108" y2="98" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── ノーマルA（見習い） ── */
function NormalArtA() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><linearGradient id="bg-na" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bfdbfe"/><stop offset="100%" stopColor="#eff6ff"/>
      </linearGradient></defs>
      <rect width="200" height="200" fill="url(#bg-na)"/>
      {[[40,40,8,'#fed7aa'],[80,25,5,'#fed7aa'],[155,55,6,'#fed7aa']].map(([x,y,r,c],i)=>(
        <circle key={i} cx={x} cy={y} r={r as number} fill={c as string} opacity="0.7"/>
      ))}
      <rect x="0" y="162" width="200" height="38" fill="#92400e"/>
      <rect x="0" y="158" width="200" height="8" fill="#b45309"/>
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#1d4ed8"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#1d4ed8"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#3b82f6"/>
      <rect x="50" y="110" width="20" height="44" rx="10" fill="#3b82f6"/>
      <rect x="130" y="110" width="20" height="44" rx="10" fill="#3b82f6"/>
      {/* バケツ */}
      <path d="M132 150 L150 146 L154 168 L128 168 Z" fill="#9ca3af"/>
      <ellipse cx="141" cy="146" rx="11" ry="4" fill="#6b7280"/>
      <path d="M134 150 Q141 157 150 147" stroke="#6b7280" strokeWidth="2" fill="none"/>
      {/* 汗 */}
      <path d="M126 62 Q128 57 131 64 Q129 70 126 68 Z" fill="#93c5fd" opacity="0.9"/>
      <circle cx="100" cy="82" r="27" fill="#fde68a"/>
      <rect x="93" y="107" width="14" height="7" fill="#fde68a"/>
      <path d="M73 76 Q80 50 100 48 Q120 50 127 76" fill="#1c1917"/>
      <ellipse cx="73" cy="86" rx="5" ry="7" fill="#fbbf24"/>
      <ellipse cx="127" cy="86" rx="5" ry="7" fill="#fbbf24"/>
      <ellipse cx="90" cy="82" rx="6" ry="6.5" fill="white"/>
      <ellipse cx="110" cy="82" rx="6" ry="6.5" fill="white"/>
      <circle cx="91" cy="83" r="3.5" fill="#1c1917"/>
      <circle cx="111" cy="83" r="3.5" fill="#1c1917"/>
      <circle cx="92" cy="82" r="1.5" fill="white"/>
      <circle cx="112" cy="82" r="1.5" fill="white"/>
      <path d="M84 74 Q90 69 96 73" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M104 73 Q110 69 116 74" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M94 94 Q100 99 106 94" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── ノーマルB（汗だく） ── */
function NormalArtB() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs><linearGradient id="bg-nb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef3c7"/><stop offset="100%" stopColor="#fde68a"/>
      </linearGradient></defs>
      <rect width="200" height="200" fill="url(#bg-nb)"/>
      {/* 太陽 */}
      <circle cx="170" cy="30" r="28" fill="#fbbf24" opacity="0.6"/>
      {[0,45,90,135,180,225,270,315].map((deg,i)=>(
        <line key={i} x1={170+Math.cos(deg*Math.PI/180)*30} y1={30+Math.sin(deg*Math.PI/180)*30}
          x2={170+Math.cos(deg*Math.PI/180)*40} y2={30+Math.sin(deg*Math.PI/180)*40}
          stroke="#f59e0b" strokeWidth="3"/>
      ))}
      <rect x="0" y="162" width="200" height="38" fill="#92400e"/>
      <rect x="78" y="162" width="18" height="28" rx="6" fill="#1d4ed8"/>
      <rect x="104" y="162" width="18" height="28" rx="6" fill="#1d4ed8"/>
      <ellipse cx="87" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <ellipse cx="113" cy="190" rx="13" ry="6" fill="#1c1917"/>
      <rect x="68" y="110" width="64" height="55" rx="7" fill="#3b82f6"/>
      <rect x="50" y="110" width="20" height="44" rx="10" fill="#3b82f6"/>
      <rect x="130" y="110" width="20" height="44" rx="10" fill="#3b82f6"/>
      <circle cx="100" cy="82" r="27" fill="#fde68a"/>
      <rect x="93" y="107" width="14" height="7" fill="#fde68a"/>
      {/* 汗だく演出 */}
      {[[120,65],[130,80],[118,80],[125,95],[72,70],[65,85]].map(([x,y],i)=>(
        <path key={i} d={`M${x} ${y} Q${x+2} ${y-5} ${x+4} ${y+2} Q${x+2} ${y+6} ${x} ${y} Z`}
          fill="#93c5fd" opacity="0.8"/>
      ))}
      {/* 赤い顔（熱い） */}
      <ellipse cx="84" cy="92" rx="8" ry="6" fill="#fca5a5" opacity="0.5"/>
      <ellipse cx="116" cy="92" rx="8" ry="6" fill="#fca5a5" opacity="0.5"/>
      <path d="M73 76 Q80 50 100 48 Q120 50 127 76" fill="#1c1917"/>
      {/* タオル */}
      <rect x="88" y="106" width="24" height="6" rx="3" fill="#f97316"/>
      <ellipse cx="73" cy="86" rx="5" ry="7" fill="#fbbf24"/>
      <ellipse cx="127" cy="86" rx="5" ry="7" fill="#fbbf24"/>
      <ellipse cx="90" cy="82" rx="6" ry="5.5" fill="white"/>
      <ellipse cx="110" cy="82" rx="6" ry="5.5" fill="white"/>
      <circle cx="91" cy="82" r="3.5" fill="#1c1917"/>
      <circle cx="111" cy="82" r="3.5" fill="#1c1917"/>
      <circle cx="92" cy="81" r="1.5" fill="white"/>
      <circle cx="112" cy="81" r="1.5" fill="white"/>
      <path d="M84 74 Q90 70 96 73" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M104 73 Q110 70 116 74" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* 疲れた口 */}
      <path d="M94 94 Q100 90 106 94" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

// ─── カードバック（裏面デザイン） ────────────────────────
function CardBack() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      border: '3px solid #7c3aed',
    }}>
      <div className="w-full h-full flex flex-col items-center justify-center gap-2"
        style={{background:'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px)'}}>
        <div className="text-4xl">⚙️</div>
        <div className="text-white font-black text-lg tracking-wider">LifeEve</div>
        <div className="text-purple-300 text-xs">職人カード</div>
      </div>
    </div>
  )
}

// ─── 遊戯王スタイルカード ────────────────────────────────
function YGOCard({ card, size = 'full' }: { card: Card; size?: 'full' | 'mini' }) {
  const f = RARITY_FRAME[card.rarity]
  const isLegend = card.rarity === 5
  const isSR     = card.rarity === 4

  if (size === 'mini') {
    return (
      <div className="rounded-lg overflow-hidden" style={{ border: `2px solid ${f.border}`, background: f.bg }}>
        <div style={{ background: f.namePlate }} className="px-1 py-0.5 flex items-center justify-between">
          <span className="text-[7px] font-bold truncate leading-tight">{card.name}</span>
          <span style={{ fontSize: '8px' }}>{ATTRIBUTE_ICONS[card.attribute]}</span>
        </div>
        <div className="aspect-square overflow-hidden">
          <CharacterArt card={card} />
        </div>
        <div className="px-1 py-0.5">
          <div style={{ color: f.starColor, fontSize: '6px' }}>{'★'.repeat(card.rarity)}</div>
          <div className="flex justify-between" style={{ fontSize: '7px' }}>
            <span>ATK/{card.atk}</span><span>DEF/{card.def}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-xl overflow-hidden w-56 mx-auto shadow-2xl ${isLegend ? 'legend-card' : ''}`}
      style={{ border: `4px solid ${f.border}`, background: f.bg }}>
      {/* ホログラムオーバーレイ */}
      {isLegend && <div className="absolute inset-0 holo-legend pointer-events-none z-10 rounded-xl"/>}
      {isSR     && <div className="absolute inset-0 holo-sr     pointer-events-none z-10 rounded-xl"/>}

      {/* 名前プレート */}
      <div className="px-2.5 py-1.5 flex items-center justify-between" style={{ background: f.namePlate }}>
        <span className="font-black text-xs leading-tight flex-1 mr-1">{card.name}</span>
        <span className="text-base shrink-0">{ATTRIBUTE_ICONS[card.attribute]}</span>
      </div>

      {/* 星 */}
      <div className="px-2.5 py-0.5 flex items-center justify-end gap-0.5" style={{ background: f.bg }}>
        {Array.from({ length: card.rarity }).map((_, i) => (
          <span key={i} style={{ color: f.starColor, fontSize: '11px', lineHeight: 1 }}>★</span>
        ))}
      </div>

      {/* イラスト枠 */}
      <div className="mx-2 mb-1.5 rounded overflow-hidden aspect-square"
        style={{ border: `2px solid ${f.border}` }}>
        <CharacterArt card={card} />
      </div>

      {/* 種族テキスト */}
      <div className="mx-2 px-2 py-0.5 rounded text-xs font-bold mb-1"
        style={{ background: f.namePlate, border: `1px solid ${f.border}` }}>
        【{card.tribe}/効果】
      </div>

      {/* 効果テキスト */}
      <div className="mx-2 mb-1.5 px-2 py-1.5 rounded text-xs bg-white/80 min-h-[52px]"
        style={{ border: `1px solid ${f.border}` }}>
        {card.effect}
      </div>

      {/* ATK/DEF */}
      <div className="mx-2 mb-2 px-2 py-1 flex justify-end gap-3 rounded text-xs font-black"
        style={{ background: f.namePlate, border: `1px solid ${f.border}` }}>
        <span>ATK/{card.atk}</span>
        <span>DEF/{card.def}</span>
      </div>
    </div>
  )
}

// ─── スパークルエフェクト ─────────────────────────────────
function Sparkles({ rarity }: { rarity: Rarity }) {
  if (rarity < 4) return null
  const colors = rarity === 5
    ? ['#fbbf24','#f59e0b','#fcd34d','#fff','#f97316','#ef4444']
    : ['#c084fc','#a855f7','#818cf8','#fff','#e879f9']
  const count = rarity === 5 ? 20 : 10
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360
        const dist  = 70 + Math.random() * 70
        const tx    = Math.cos((angle * Math.PI) / 180) * dist
        const ty    = Math.sin((angle * Math.PI) / 180) * dist
        const size  = 5 + Math.random() * 12
        return (
          <div key={i} className="sparkle-item absolute"
            style={{
              left: '50%', top: '50%',
              width: size, height: size,
              marginLeft: -size/2, marginTop: -size/2,
              background: colors[i % colors.length],
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDelay: `${Math.random() * 0.4}s`,
              '--tx': `${tx}px`, '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}

// ─── ガチャタブ ───────────────────────────────────────────
type GachaPhase = 'idle' | 'animating' | 'back' | 'flipping' | 'revealed'

function GachaTab() {
  const [phase, setPhase]         = useState<GachaPhase>('idle')
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
      const newCol = collection.includes(card.id) ? collection : [...collection, card.id]
      setCollection(newCol)
      localStorage.setItem(LS_GACHA_COLLECTION, JSON.stringify(newCol))
      localStorage.setItem(LS_GACHA_DATE, today())
      setAlreadyPulled(true)
      setPulledCard(card)
      setPhase('back')           // カード裏面を表示
      setTimeout(() => setPhase('flipping'), 600)  // フリップ開始
      setTimeout(() => setPhase('revealed'), 1400) // フリップ完了
    }, 1000)
  }

  const totalCards = CARDS.length
  const gotAll = collection.length === totalCards

  return (
    <div className="px-4 py-4">
      {gotAll && (
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-2xl p-4 mb-4 text-center shadow-lg">
          <p className="text-2xl font-black">🏆 伝説の親方</p>
          <p className="text-sm mt-0.5">全{totalCards}種コンプリート！</p>
        </div>
      )}

      {/* 進捗 */}
      <div className="bg-white rounded-xl p-3 mb-4 shadow-sm border border-gray-100">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">図鑑達成率</span>
          <span className="font-bold text-blue-600">{collection.length} / {totalCards}</span>
        </div>
        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
            style={{ width: `${(collection.length / totalCards) * 100}%` }}/>
        </div>
      </div>

      {/* アイドル */}
      {phase === 'idle' && (
        <div className="text-center py-6">
          <div className="text-6xl mb-4 pulse-glow-anim inline-block">🎴</div>
          <p className="text-gray-600 text-sm mb-6">遊戯王カード風・職人カードを集めよう</p>
          {alreadyPulled ? (
            <div className="bg-gray-100 rounded-2xl p-4">
              <p className="text-gray-500 font-medium">今日はもう引きました</p>
              <p className="text-xs text-gray-400 mt-1">次は明日0時にリセット</p>
            </div>
          ) : (
            <button onClick={handlePull}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform">
              カードを引く！
            </button>
          )}
        </div>
      )}

      {/* アニメ中 */}
      {phase === 'animating' && (
        <div className="text-center py-8">
          <div className="text-7xl animate-bounce mb-4">🎴</div>
          <div className="flex justify-center gap-1 mt-4">
            {[0,1,2].map(i => (
              <div key={i} className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i*0.15}s` }}/>
            ))}
          </div>
        </div>
      )}

      {/* カードフリップ */}
      {(phase === 'back' || phase === 'flipping' || phase === 'revealed') && pulledCard && (
        <div className="text-center">
          {phase === 'revealed' && isNew && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl px-4 py-2 mb-3 inline-block font-bold text-sm animate-bounce">
              🌟 NEW！初めてのカード！
            </div>
          )}

          {/* 3Dフリップコンテナ */}
          <div className="card-flipper inline-block">
            <div className={`card-flip-inner ${phase === 'flipping' || phase === 'revealed' ? 'flipped' : ''}`}
              style={{ width: '224px', height: '340px' }}>
              {/* 裏面 */}
              <div className="card-back-face absolute inset-0">
                <CardBack />
              </div>
              {/* 表面 */}
              <div className="card-face absolute inset-0">
                <div className="relative inline-block w-full h-full">
                  {phase === 'revealed' && <Sparkles rarity={pulledCard.rarity} />}
                  <YGOCard card={pulledCard} />
                </div>
              </div>
            </div>
          </div>

          {phase === 'revealed' && (
            <div className="mt-4">
              <button onClick={() => setPhase('idle')}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm active:bg-gray-300">
                閉じる
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 図鑑タブ ────────────────────────────────────────────
function CollectionTab() {
  const collection: number[] = JSON.parse(localStorage.getItem(LS_GACHA_COLLECTION) ?? '[]')
  const rarities: Rarity[]   = [5, 4, 3, 2, 1]

  return (
    <div className="px-4 py-4">
      <p className="text-xs text-gray-500 mb-3">
        収集: {collection.length} / {CARDS.length}種
        {collection.length === CARDS.length && ' 🏆 コンプリート！'}
      </p>
      {rarities.map(r => {
        const cards = CARDS.filter(c => c.rarity === r)
        const f = RARITY_FRAME[r]
        return (
          <div key={r} className="mb-4">
            <h3 className="text-sm font-bold mb-2" style={{ color: f.border }}>
              {'★'.repeat(r)} {RARITY_LABELS[r]} ({cards.filter(c => collection.includes(c.id)).length}/{cards.length})
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {cards.map(card => {
                const owned = collection.includes(card.id)
                return (
                  <div key={card.id} className={!owned ? 'opacity-30 grayscale' : ''}>
                    <YGOCard card={card} size="mini" />
                    {!owned && <p className="text-[7px] text-center text-gray-400 mt-0.5">未入手</p>}
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

// ─── メインページ ─────────────────────────────────────────
type FunTab = 'gacha' | 'collection'

export default function FunPage() {
  const [tab, setTab] = useState<FunTab>('gacha')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-30">
        <h1 className="text-lg font-bold">おたのしみ</h1>
      </div>
      <div className="flex bg-white border-b sticky top-[52px] z-20">
        {([['gacha','ガチャ','🎴'],['collection','図鑑','📖']] as const).map(([key,label,icon]) => (
          <button key={key} onClick={() => setTab(key as FunTab)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 flex flex-col items-center gap-0.5 transition-colors ${
              tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}>
            <span className="text-lg">{icon}</span>
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
      {tab === 'gacha'      && <GachaTab />}
      {tab === 'collection' && <CollectionTab />}
    </div>
  )
}
