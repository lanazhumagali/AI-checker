import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CHARITY_DATA, LEADERBOARD } from '../data/content'

export default function TopBar() {
  const { user } = useApp()
  const [modal, setModal] = useState<null | 'streak' | 'rank' | 'donate' | 'help'>(null)

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">♟️</span>
          <span className="font-bold text-green-400 text-lg leading-none">CheckersAI</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <button
            onClick={() => setModal('streak')}
            className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-full px-3 py-1.5 transition-all"
          >
            <span className="text-lg animate-fire">🔥</span>
            <span className="text-orange-400 font-bold text-sm">{user.streak}</span>
          </button>

          {/* XP */}
          <button className="flex items-center gap-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-full px-3 py-1.5 transition-all">
            <span className="text-lg">⚡</span>
            <span className="text-purple-400 font-bold text-sm">{user.xp.toLocaleString()}</span>
          </button>

          {/* Coins */}
          <button className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-full px-3 py-1.5 transition-all">
            <span className="text-lg">🪙</span>
            <span className="text-yellow-400 font-bold text-sm">{user.coins}</span>
          </button>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <button onClick={() => setModal('rank')} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition text-lg">🏆</button>
          <button onClick={() => setModal('donate')} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition text-lg">💚</button>
          <button onClick={() => setModal('help')} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition text-lg">❓</button>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-[430px] bg-slate-900 rounded-t-3xl p-6 pb-8 border-t border-white/10 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {modal === 'streak' && <StreakModal streak={user.streak} />}
            {modal === 'rank' && <RankModal rank={user.rank} />}
            {modal === 'donate' && <DonateModal />}
            {modal === 'help' && <HelpModal />}
            <button
              onClick={() => setModal(null)}
              className="mt-4 w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function StreakModal({ streak }: { streak: number }) {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl animate-fire">🔥</span>
        <div>
          <h3 className="text-white font-bold text-xl">{streak}-дневный страйк!</h3>
          <p className="text-white/50 text-sm">Продолжай в том же духе!</p>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              i < adjustedToday ? 'bg-orange-500/80' :
              i === adjustedToday ? 'bg-orange-500 ring-2 ring-orange-300 ring-offset-2 ring-offset-slate-900' :
              'bg-white/5'
            }`}>
              {i <= adjustedToday ? '🔥' : '◯'}
            </div>
            <span className="text-white/40 text-xs">{day}</span>
          </div>
        ))}
      </div>
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-white/60 text-sm mb-2">Завтрашняя награда</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <div>
            <p className="text-white font-semibold">+50 монет + редкий предмет</p>
            <p className="text-white/40 text-xs">Заходи завтра, чтобы получить!</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          { days: 7, reward: '🥉 Бронза', coins: 100 },
          { days: 14, reward: '🥈 Серебро', coins: 250 },
          { days: 30, reward: '🥇 Золото', coins: 500 },
        ].map(item => (
          <div key={item.days} className={`rounded-xl p-3 text-center ${streak >= item.days ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
            <p className="text-lg">{item.reward}</p>
            <p className="text-white/60 text-xs">{item.days} дней</p>
            <p className="text-yellow-400 text-xs font-bold">+{item.coins} 🪙</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RankModal({ rank }: { rank: number }) {
  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
        <span>🏆</span> Мировой рейтинг
      </h3>
      <div className="space-y-2 mb-4">
        {LEADERBOARD.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 p-3 rounded-xl ${player.isUser ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}
          >
            <span className={`w-8 text-center font-bold ${player.rank === 1 ? 'text-yellow-400 text-lg' : player.rank === 2 ? 'text-slate-300 text-lg' : player.rank === 3 ? 'text-amber-600 text-lg' : 'text-white/50 text-sm'}`}>
              {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
            </span>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ background: player.bg }}>
              {player.avatar}
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${player.isUser ? 'text-green-400' : 'text-white'}`}>
                {player.user} {player.country}
              </p>
              <p className="text-white/40 text-xs">🔥 {player.streak} дней</p>
            </div>
            <span className="text-purple-400 font-bold text-sm">{player.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
      <div className="bg-white/5 rounded-2xl p-4">
        <p className="text-white/60 text-sm">Твоя позиция: <span className="text-green-400 font-bold">#{rank}</span></p>
        <div className="mt-2 bg-white/5 rounded-full h-2 overflow-hidden">
          <div className="bg-green-500 h-full rounded-full" style={{ width: '35%' }} />
        </div>
        <p className="text-white/40 text-xs mt-1">35% до следующего ранга</p>
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
          <p className="text-white/50 text-sm">Всего переведено: <span className="text-green-400 font-bold">{CHARITY_DATA.total}</span></p>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        {CHARITY_DATA.projects.map(p => (
          <div key={p.name} className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="text-white text-sm font-medium">{p.name}</span>
              </div>
              <span className="text-green-400 font-bold text-sm">{p.amount}</span>
            </div>
            <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: `${p.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
        <p className="text-white/60 text-sm">📊 Следующий отчёт: <span className="text-white">{CHARITY_DATA.nextReport}</span></p>
        <p className="text-white/60 text-sm mt-1">📋 Последний отчёт: <span className="text-white">{CHARITY_DATA.lastReport}</span></p>
        <p className="text-white/40 text-xs mt-2">Все переводы верифицированы. Скриншоты и выписки доступны в разделе «Отчёты».</p>
      </div>
    </div>
  )
}

function HelpModal() {
  const items = [
    { icon: '⚡', title: 'XP и уровни', desc: 'Получай XP за победы, уроки и задачи. Поднимайся по рангам!' },
    { icon: '🔥', title: 'Страйки', desc: 'Заходи каждый день — получай бонусные монеты и редкие предметы.' },
    { icon: '🤖', title: 'ИИ-тренер', desc: 'Твой персональный наставник, адаптированный под твои интересы.' },
    { icon: '🏆', title: 'Рейтинги', desc: 'Соревнуйся со всем миром и игроками своего уровня.' },
    { icon: '🎭', title: 'ИИ-персонажи', desc: '5 уникальных противников с разными стилями игры.' },
    { icon: '🎁', title: 'Гача и магазин', desc: 'Трать монеты на уникальные скины, эффекты и аватары.' },
  ]

  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
        <span>❓</span> Как это работает?
      </h3>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.title} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
