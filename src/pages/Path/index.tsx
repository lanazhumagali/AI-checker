import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { PATH_NODES, SKILL_GAMES } from '../../data/content'

export default function Path() {
  const { user, updateUser, addNotification } = useApp()
  const [modal, setModal] = useState<null | 'skills' | 'events' | 'gacha'>(null)
  const [spinning, setSpinning] = useState(false)
  const [gachaResult, setGachaResult] = useState<string | null>(null)

  const spin = () => {
    if (user.coins < 50) return addNotification('Недостаточно монет! Нужно 50 🪙')
    setSpinning(true)
    setGachaResult(null)
    updateUser({ coins: user.coins - 50 })
    setTimeout(() => {
      const items = ['🥉 Обычный скин', '🗡️ Серебряные шашки', '👑 Корона чемпиона', '🌌 Космическая доска', '🔥 Огненный эффект']
      const weights = [40, 30, 15, 10, 5]
      let rand = Math.random() * 100
      let result = items[0]
      for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) { result = items[i]; break }
        rand -= weights[i]
      }
      setGachaResult(result)
      setSpinning(false)
      addNotification(`Получено: ${result}! 🎉`)
    }, 2000)
  }

  return (
    <div className="page-content bg-path">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white text-xl font-bold">Путь мастера</h2>
          <div className="bg-white/10 rounded-full px-3 py-1">
            <span className="text-white/80 text-xs">Глава {Math.min(3, Math.ceil(PATH_NODES.findIndex(n => n.active) / 3) + 1)} / 3</span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setModal('skills')}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 flex flex-col items-center gap-1 transition"
          >
            <span className="text-xl">🧠</span>
            <span className="text-white/80 text-xs font-medium">Навыки</span>
          </button>
          <button
            onClick={() => setModal('events')}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 flex flex-col items-center gap-1 transition"
          >
            <span className="text-xl">🎪</span>
            <span className="text-white/80 text-xs font-medium">Ивенты</span>
          </button>
          <button
            onClick={() => setModal('gacha')}
            className="bg-white/10 hover:bg-white/20 rounded-xl p-2.5 flex flex-col items-center gap-1 transition"
          >
            <span className="text-xl">🎰</span>
            <span className="text-white/80 text-xs font-medium">Гадание</span>
          </button>
        </div>

        {/* Trainer message */}
        <div className="bg-white/10 rounded-2xl p-3 flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-lg shrink-0">🤖</div>
          <div>
            <p className="text-white font-semibold text-xs mb-1">Тренер ИИ</p>
            <p className="text-white/70 text-xs">
              {user.books.includes('Harry Potter')
                ? '"Помни — Гермиона тоже начинала с основ. Контроль центра — это как заклинание Expelliarmus: кажется простым, но решает всё!"'
                : '"Великие чемпионы начинали именно отсюда. Каждый пройденный узел — шаг к мастерству. Ты справишься! 💪"'}
            </p>
          </div>
        </div>
      </div>

      {/* Path nodes */}
      <div className="px-8 relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />

        {PATH_NODES.map((node, idx) => {
          const isLeft = idx % 2 === 0
          return (
            <div
              key={node.id}
              className={`relative flex items-center mb-6 ${isLeft ? 'justify-start' : 'justify-end'}`}
            >
              {/* Horizontal connector */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-1/3 h-0.5 ${node.completed ? 'bg-green-500' : 'bg-white/10'} ${isLeft ? 'left-1/2' : 'right-1/2'}`}
              />

              {/* Node */}
              <button
                className={`relative z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${
                  node.active
                    ? 'bg-green-500 border-green-300 animate-node-pulse shadow-lg shadow-green-500/30 scale-110'
                    : node.completed
                    ? 'bg-green-600/60 border-green-500/50'
                    : 'bg-slate-800/60 border-white/10'
                }`}
              >
                <span className="text-xl">{node.icon}</span>
                {node.completed && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <span key={s} className={`text-xs ${s <= node.stars ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                    ))}
                  </div>
                )}
              </button>

              {/* Label */}
              <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-[62%]' : 'right-[62%]'}`}>
                <p className={`text-xs font-semibold whitespace-nowrap ${node.active ? 'text-green-400' : node.completed ? 'text-white/80' : 'text-white/30'}`}>
                  {node.title}
                </p>
                {node.active && <p className="text-green-400/60 text-xs">← Сейчас</p>}
                {!node.completed && !node.active && <p className="text-white/20 text-xs">🔒</p>}
              </div>
            </div>
          )
        })}

        {/* End node */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-2 border-yellow-500/30 flex flex-col items-center justify-center">
            <span className="text-2xl">🏆</span>
            <span className="text-yellow-400/60 text-xs">Финал</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="relative w-full max-w-[430px] bg-slate-900 rounded-t-3xl p-6 pb-8 border-t border-white/10 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {modal === 'skills' && <SkillsModal />}
            {modal === 'events' && <EventsModal />}
            {modal === 'gacha' && (
              <GachaModal
                coins={user.coins}
                spinning={spinning}
                result={gachaResult}
                onSpin={spin}
              />
            )}
            <button onClick={() => setModal(null)} className="mt-4 w-full py-3 rounded-2xl bg-white/5 text-white/60 text-sm">Закрыть</button>
          </div>
        </div>
      )}
    </div>
  )
}

function SkillsModal() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4">🧠 Тренировка навыков</h3>
      <div className="grid grid-cols-2 gap-3">
        {SKILL_GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setActive(active === game.id ? null : game.id)}
            className={`rounded-2xl p-4 text-center transition-all border ${
              active === game.id ? 'border-opacity-60 scale-105' : 'border-white/10 bg-white/5 hover:bg-white/8'
            }`}
            style={active === game.id ? { background: `${game.color}22`, borderColor: `${game.color}66` } : {}}
          >
            <div className="text-3xl mb-2">{game.icon}</div>
            <p className="text-white font-semibold text-sm">{game.name}</p>
            <p className="text-white/40 text-xs mt-1">{game.description}</p>
            {active === game.id && (
              <button
                className="mt-3 w-full py-2 rounded-xl text-white text-xs font-bold"
                style={{ background: game.color }}
              >
                Начать
              </button>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function EventsModal() {
  const events = [
    {
      title: 'Весенний чемпионат',
      description: 'Сыграй 10 партий за 2 недели. Получи эксклюзивный скин!',
      emoji: '🌸',
      progress: 4,
      total: 10,
      reward: '🌸 Весенний скин + 500 XP',
      days: 8,
      color: '#ec4899',
    },
    {
      title: 'Марафон задач',
      description: 'Реши 50 тактических задач и стань мастером атаки.',
      emoji: '⚡',
      progress: 23,
      total: 50,
      reward: '⚡ Эффект молнии + 300 монет',
      days: 5,
      color: '#f59e0b',
    },
  ]

  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4">🎪 Текущие ивенты</h3>
      <div className="space-y-4">
        {events.map(ev => (
          <div key={ev.title} className="rounded-2xl p-4 border border-white/10" style={{ background: `${ev.color}11` }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ev.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{ev.title}</p>
                  <p className="text-white/50 text-xs">{ev.days} дней осталось</p>
                </div>
              </div>
            </div>
            <p className="text-white/60 text-xs mb-3">{ev.description}</p>
            <div className="bg-white/10 rounded-full h-2 overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(ev.progress / ev.total) * 100}%`, background: ev.color }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">{ev.progress} / {ev.total}</span>
              <span style={{ color: ev.color }}>{ev.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GachaModal({ coins, spinning, result, onSpin }: {
  coins: number
  spinning: boolean
  result: string | null
  onSpin: () => void
}) {
  const rarityColors: Record<string, string> = {
    '🥉': '#cd7f32',
    '🗡️': '#c0c0c0',
    '👑': '#ffd700',
    '🌌': '#9b59b6',
    '🔥': '#ff6b6b',
  }

  const resultEmoji = result ? result.split(' ')[0] : null
  const resultColor = resultEmoji ? rarityColors[resultEmoji] || '#22c55e' : '#22c55e'

  const rarities = [
    { label: 'Обычный', color: '#cd7f32', chance: '40%' },
    { label: 'Необычный', color: '#c0c0c0', chance: '30%' },
    { label: 'Редкий', color: '#ffd700', chance: '15%' },
    { label: 'Эпический', color: '#9b59b6', chance: '10%' },
    { label: 'Легендарный', color: '#ff6b6b', chance: '5%' },
  ]

  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-2">🎰 Гадание</h3>
      <p className="text-white/50 text-sm mb-4">50 монет за вращение · Гарантированный предмет</p>

      {/* Gacha machine visual */}
      <div className="flex justify-center mb-6">
        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-4 border-purple-400/50 shadow-2xl shadow-purple-500/30 ${spinning ? 'animate-gacha' : ''}`}>
          {spinning ? (
            <span className="text-5xl">🌀</span>
          ) : result ? (
            <span className="text-5xl">{resultEmoji}</span>
          ) : (
            <span className="text-5xl">🎁</span>
          )}
        </div>
      </div>

      {result && !spinning && (
        <div className="mb-4 rounded-2xl p-4 text-center" style={{ background: `${resultColor}22`, border: `1px solid ${resultColor}44` }}>
          <p style={{ color: resultColor }} className="font-bold text-lg">{result}</p>
          <p className="text-white/50 text-xs mt-1">Добавлено в твою коллекцию!</p>
        </div>
      )}

      <button
        onClick={onSpin}
        disabled={spinning || coins < 50}
        className="btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {spinning ? '🌀 Крутим...' : `🎰 Крутить — 50 🪙 (у тебя: ${coins})`}
      </button>

      <div className="grid grid-cols-5 gap-1">
        {rarities.map(r => (
          <div key={r.label} className="text-center rounded-lg p-1.5 bg-white/5">
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: r.color }} />
            <p className="text-white/60 text-xs leading-tight">{r.label}</p>
            <p className="font-bold text-xs" style={{ color: r.color }}>{r.chance}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
