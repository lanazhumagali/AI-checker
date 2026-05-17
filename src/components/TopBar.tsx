import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CHARITY_DATA, LEADERBOARD } from '../data/content'

export default function TopBar() {
  const { user, setActiveTab } = useApp()
  const [modal, setModal] = useState<null | 'streak' | 'rank' | 'donate' | 'help'>(null)

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 backdrop-blur-xl border-b border-white/5">
        {/* Logo */}
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
            <span className="text-base">♟️</span>
          </div>
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 text-base tracking-tight">CheckersAI</span>
        </button>

        {/* Stats row */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => setModal('streak')}
            className="flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-full px-2.5 py-1 transition-all">
            <span className="text-sm animate-fire">🔥</span>
            <span className="text-orange-400 font-black text-xs">{user.streak}</span>
          </button>
          <div className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/15 rounded-full px-2.5 py-1">
            <span className="text-sm">⚡</span>
            <span className="text-purple-400 font-black text-xs">{user.xp.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/15 rounded-full px-2.5 py-1">
            <span className="text-sm">🪙</span>
            <span className="text-yellow-400 font-black text-xs">{user.coins}</span>
          </div>
        </div>

        {/* Icon row */}
        <div className="flex items-center gap-1">
          {[
            { icon: '🏆', key: 'rank' },
            { icon: '💚', key: 'donate' },
            { icon: '❓', key: 'help' },
          ].map(({ icon, key }) => (
            <button key={key} onClick={() => setModal(key as any)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">
              {icon}
            </button>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[430px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl p-5 pb-8 border-t border-white/10 max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={e => e.stopPropagation()}>
            {modal === 'streak' && <StreakModal streak={user.streak} />}
            {modal === 'rank' && <RankModal rank={user.rank} />}
            {modal === 'donate' && <DonateModal />}
            {modal === 'help' && <HelpModal />}
            <button onClick={() => setModal(null)} className="mt-4 w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 text-sm transition">Закрыть</button>
          </div>
        </div>
      )}
    </>
  )
}

function StreakModal({ streak }: { streak: number }) {
  const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
  const today = new Date().getDay()
  const adj = today === 0 ? 6 : today - 1
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-5xl animate-fire">🔥</span>
        <div>
          <h3 className="text-white font-black text-2xl">{streak} дней подряд!</h3>
          <p className="text-white/50 text-sm">Продолжай — впереди лучшие награды!</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all ${
              i < adj ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow shadow-orange-500/30' :
              i === adj ? 'bg-gradient-to-br from-orange-400 to-red-500 ring-2 ring-orange-300 ring-offset-2 ring-offset-slate-900 scale-110 shadow-lg shadow-orange-500/40' :
              'bg-white/5 border border-white/10'
            }`}>
              {i <= adj ? '🔥' : '○'}
            </div>
            <span className="text-white/30 text-[10px]">{day}</span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-4 mb-3">
        <p className="text-white/60 text-sm mb-2">Завтрашняя награда:</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <p className="text-white font-bold">+50 монет + редкий предмет</p>
            <p className="text-white/30 text-xs">Не пропусти!</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{d:7,r:'🥉',c:100},{d:14,r:'🥈',c:250},{d:30,r:'🥇',c:500}].map(item => (
          <div key={item.d} className={`rounded-xl p-3 text-center border ${streak >= item.d ? 'bg-green-500/15 border-green-500/30' : 'bg-white/3 border-white/8'}`}>
            <p className="text-xl">{item.r}</p>
            <p className="text-white/50 text-xs">{item.d} дней</p>
            <p className="text-yellow-400 text-xs font-bold">+{item.c} 🪙</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RankModal({ rank }: { rank: number }) {
  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">🏆 Мировой рейтинг</h3>
      <div className="space-y-2 mb-4">
        {LEADERBOARD.map(p => (
          <div key={p.rank} className={`flex items-center gap-3 p-3 rounded-2xl transition ${p.isUser ? 'bg-green-500/15 border border-green-500/25' : 'bg-white/4 hover:bg-white/7'}`}>
            <span className={`w-8 text-center font-bold ${p.rank===1?'text-yellow-400 text-lg':p.rank===2?'text-slate-300 text-lg':p.rank===3?'text-amber-600 text-lg':'text-white/40 text-sm'}`}>
              {p.rank===1?'🥇':p.rank===2?'🥈':p.rank===3?'🥉':`#${p.rank}`}
            </span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-lg" style={{ background: p.bg }}>{p.avatar}</div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${p.isUser?'text-green-400':'text-white'}`}>{p.user} {p.country}</p>
              <p className="text-white/30 text-xs">🔥 {p.streak} дней</p>
            </div>
            <span className="text-purple-400 font-bold text-xs">{p.xp.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3">
        <p className="text-white/50 text-sm">Твоя позиция: <span className="text-green-400 font-bold">#{rank}</span></p>
        <div className="mt-2 bg-black/30 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full progress-fill" style={{ width: '35%' }} />
        </div>
        <p className="text-white/30 text-xs mt-1">35% до следующего ранга</p>
      </div>
    </div>
  )
}

function DonateModal() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">💚</span>
        <div>
          <h3 className="text-white font-bold text-xl">10% дохода — на добро</h3>
          <p className="text-white/50 text-sm">Всего: <span className="text-green-400 font-bold">{CHARITY_DATA.total}</span></p>
        </div>
      </div>
      <div className="space-y-2.5 mb-4">
        {CHARITY_DATA.projects.map(p => (
          <div key={p.name} className="bg-white/4 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2"><span>{p.icon}</span><span className="text-white text-sm">{p.name}</span></div>
              <span className="text-green-400 font-bold text-sm">{p.amount}</span>
            </div>
            <div className="bg-black/30 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full progress-fill" style={{ width: `${p.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-green-500/8 border border-green-500/20 rounded-2xl p-4">
        <p className="text-white/50 text-sm">📊 Следующий отчёт: <span className="text-white">{CHARITY_DATA.nextReport}</span></p>
        <p className="text-white/30 text-xs mt-2">Все переводы верифицированы. Скриншоты доступны в отчётах.</p>
      </div>
    </div>
  )
}

function HelpModal() {
  const items = [
    { icon: '⚡', title: 'XP и уровни', desc: 'Получай опыт за победы, уроки и задачи.' },
    { icon: '🔥', title: 'Страйки', desc: 'Ежедневный вход = монеты и редкие предметы.' },
    { icon: '🤖', title: 'ИИ-тренер', desc: 'Адаптируется под твои книги, музыку, стиль.' },
    { icon: '🏆', title: 'Рейтинги', desc: 'Мировой, страновой и по уровню игры.' },
    { icon: '🎭', title: 'ИИ-боты', desc: '5 уникальных персонажей с разными стилями.' },
    { icon: '🎁', title: 'Гача и магазин', desc: 'Монеты → скины, эффекты, аватары.' },
  ]
  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4">❓ Как это работает</h3>
      <div className="space-y-2.5">
        {items.map(item => (
          <div key={item.title} className="flex items-start gap-3 bg-white/4 rounded-xl p-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
