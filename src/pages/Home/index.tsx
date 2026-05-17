import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AI_CHARACTERS } from '../../data/content'
import CheckersBoard from '../../components/CheckersBoard'

type View = 'main' | 'online' | 'friend' | 'bot' | 'puzzle' | 'history' | 'live'

export default function Home() {
  const { user, updateUser, addNotification } = useApp()
  const [view, setView] = useState<View>('main')
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [puzzleResult, setPuzzleResult] = useState<null | 'correct' | 'wrong'>(null)
  const [friendCode, setFriendCode] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState([
    { from: 'opponent', text: 'Привет! Готов к игре?' },
  ])

  const startSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setView('online')
      addNotification('Соперник найден! AlexK_99 (1450 рейтинг)')
    }, 2500)
  }

  const solvePuzzle = (correct: boolean) => {
    setPuzzleResult(correct ? 'correct' : 'wrong')
    if (correct) {
      updateUser({ xp: user.xp + 30, coins: user.coins + 5 })
      addNotification('+30 XP за решённую задачу! 🎉')
    }
    setTimeout(() => setPuzzleResult(null), 2000)
  }

  if (view === 'online') return <OnlineGame onBack={() => setView('main')} isLive={isLive} setIsLive={setIsLive} messages={messages} setMessages={setMessages} chatMsg={chatMsg} setChatMsg={setChatMsg} />
  if (view === 'bot' && selectedBot) return <BotGame botId={selectedBot} onBack={() => { setView('main'); setSelectedBot(null) }} />
  if (view === 'puzzle') return <PuzzleView onBack={() => { setView('main'); setPuzzleResult(null) }} onSolve={solvePuzzle} result={puzzleResult} />
  if (view === 'history') return <HistoryView onBack={() => setView('main')} />

  return (
    <div className="page-content">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 checkerboard opacity-20" />
        <div className="relative px-4 pt-6 pb-4 text-center">
          <p className={`text-sm font-medium mb-1 ${user.childMode ? 'text-yellow-600' : 'text-green-400'}`}>
            {user.childMode ? '🌈 Привет, юный чемпион!' : `Привет, ${user.name || 'Игрок'}! 👋`}
          </p>
          <div className="flex justify-center mb-4">
            <CheckersBoard size={200} />
          </div>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-purple-400">{user.xp.toLocaleString()}</p>
              <p className="text-xs text-white/40">XP</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-orange-400">{user.streak}</p>
              <p className="text-xs text-white/40">🔥 Страйк</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-400">#{user.rank}</p>
              <p className="text-xs text-white/40">Рейтинг</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main action buttons */}
      <div className="px-4 space-y-3 pb-4">
        {/* Play online - primary */}
        {isSearching ? (
          <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Ищем соперника...</p>
              <p className="text-white/40 text-sm">Среди {Math.floor(Math.random() * 200) + 100} игроков онлайн</p>
            </div>
            <button onClick={() => setIsSearching(false)} className="text-white/40 text-sm">Отмена</button>
          </div>
        ) : (
          <button
            onClick={startSearch}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-4 flex items-center gap-4 shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🌐</div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-base">Играть онлайн</p>
              <p className="text-white/70 text-xs">Автоматический поиск · 847 игроков онлайн</p>
            </div>
            <span className="text-white/70 text-xl">→</span>
          </button>
        )}

        {/* Secondary buttons grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('friend')}
            className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:border-blue-500/40 hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="text-3xl">👥</span>
            <span className="text-white font-semibold text-sm">С другом</span>
            <span className="text-white/40 text-xs">Код комнаты</span>
          </button>

          <button
            onClick={() => setView('bot')}
            className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:border-purple-500/40 hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="text-3xl">🤖</span>
            <span className="text-white font-semibold text-sm">С ботом</span>
            <span className="text-white/40 text-xs">5 уникальных ИИ</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setView('puzzle')}
            className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:border-yellow-500/40 hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="text-3xl">🧩</span>
            <span className="text-white font-semibold text-sm">Задачи</span>
            <span className="text-white/40 text-xs">+30 XP за задачу</span>
          </button>

          <button
            onClick={() => setView('history')}
            className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:border-pink-500/40 hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="text-3xl">📊</span>
            <span className="text-white font-semibold text-sm">Прошлые матчи</span>
            <span className="text-white/40 text-xs">ИИ-анализ</span>
          </button>
        </div>

        {/* Today's challenge */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold text-sm">🌟 Задание дня</p>
            <span className="text-yellow-400 text-xs font-bold">+150 XP</span>
          </div>
          <p className="text-white/60 text-xs mb-3">Победи в онлайн-игре менее чем за 15 ходов</p>
          <div className="bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '30%' }} />
          </div>
          <p className="text-white/30 text-xs mt-1">0 / 1 выполнено</p>
        </div>
      </div>

      {/* Bot selection (when view === 'bot') */}
      {view === 'bot' && (
        <BotSelection
          onSelect={id => { setSelectedBot(id); setView('bot') }}
          onBack={() => setView('main')}
        />
      )}

      {/* Friend game (when view === 'friend') */}
      {view === 'friend' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-white/10">
            <h3 className="text-white text-xl font-bold mb-4">Играть с другом</h3>
            <div className="space-y-3">
              <div>
                <p className="text-white/60 text-sm mb-2">Твой код комнаты:</p>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
                  <span className="text-green-400 font-mono font-bold text-2xl tracking-widest">7F4K2</span>
                </div>
              </div>
              <div className="text-center text-white/30 text-sm">— или —</div>
              <div>
                <p className="text-white/60 text-sm mb-2">Введи код друга:</p>
                <input
                  className="app-input text-center font-mono tracking-widest text-lg"
                  placeholder="XXXXX"
                  maxLength={5}
                  value={friendCode}
                  onChange={e => setFriendCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-secondary flex-1 py-3" onClick={() => setView('main')}>Отмена</button>
              <button className="btn-primary flex-1 py-3" onClick={() => setView('main')}>Войти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BotSelection({ onSelect, onBack }: { onSelect: (id: string) => void; onBack: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-y-auto">
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
          <h2 className="text-white text-xl font-bold">Выбери соперника</h2>
        </div>
        <div className="space-y-4">
          {AI_CHARACTERS.map(char => (
            <button
              key={char.id}
              onClick={() => onSelect(char.id)}
              className={`w-full bg-gradient-to-r ${char.gradient} border border-white/10 rounded-2xl p-4 text-left hover:border-white/30 transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: `${char.color}33` }}
                >
                  {char.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-bold text-sm">{char.name}</p>
                    <span className="text-white/60 text-xs">⭐ {char.rating}</span>
                  </div>
                  <p className="text-white/60 text-xs mb-1">{char.description}</p>
                  <p className="text-white/40 text-xs">{char.style}</p>
                  <p className="mt-2 text-xs italic" style={{ color: char.color }}>{char.quote}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function OnlineGame({
  onBack, isLive, setIsLive, messages, setMessages, chatMsg, setChatMsg
}: {
  onBack: () => void
  isLive: boolean
  setIsLive: (v: boolean) => void
  messages: { from: string; text: string }[]
  setMessages: React.Dispatch<React.SetStateAction<{ from: string; text: string }[]>>
  chatMsg: string
  setChatMsg: (v: string) => void
}) {
  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setMessages([...messages, { from: 'me', text: chatMsg }])
    setChatMsg('')
    setTimeout(() => {
      const replies = ['Хороший ход!', 'Думаю...', 'Интересно 🤔', 'Не ожидал!']
      setMessages(prev => ([...prev, { from: 'opponent', text: replies[Math.floor(Math.random() * replies.length)] }]))
    }, 1200)
  }

  return (
    <div className="page-content bg-slate-950">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <div className="text-center">
          <p className="text-white font-bold text-sm">AlexK_99 vs Ты</p>
          <p className="text-white/40 text-xs">1450 · Казахстан 🇰🇿</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isLive ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-white/5 border border-white/10 text-white/50'}`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-white/30'}`} />
          {isLive ? 'LIVE' : 'Эфир'}
        </button>
      </div>

      {isLive && (
        <div className="mx-4 mb-2 bg-red-500/10 border border-red-500/20 rounded-xl p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold">ПРЯМОЙ ЭФИР</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>👁️ 23 зрителя</span>
            <span>❤️ 147</span>
          </div>
        </div>
      )}

      {/* Opponent */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl">🦁</div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">AlexK_99 🇰🇿</p>
          <p className="text-white/40 text-xs">1450 рейтинг · Про</p>
        </div>
        <div className="text-right">
          <p className="text-white font-mono font-bold">3:42</p>
          <p className="text-white/30 text-xs">оставшееся время</p>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <CheckersBoard size={340} />
      </div>

      {/* My info */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl">🚀</div>
        <div className="flex-1">
          <p className="text-green-400 text-sm font-semibold">Ты 🇰🇿</p>
          <p className="text-white/40 text-xs">{1200} рейтинг</p>
        </div>
        <div className="text-right">
          <p className="text-white font-mono font-bold">5:00</p>
          <p className="text-white/30 text-xs">оставшееся время</p>
        </div>
      </div>

      {/* Chat */}
      <div className="px-4 mt-2">
        <div className="bg-white/5 rounded-2xl p-3 h-28 overflow-y-auto mb-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex mb-1.5 ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-xs px-3 py-1.5 rounded-full max-w-[80%] ${m.from === 'me' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80'}`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="app-input flex-1 py-2 text-sm"
            placeholder="Написать..."
            value={chatMsg}
            onChange={e => setChatMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button onClick={sendMsg} className="btn-primary px-4 py-2 text-sm">→</button>
        </div>
      </div>
    </div>
  )
}

function BotGame({ botId, onBack }: { botId: string; onBack: () => void }) {
  const char = AI_CHARACTERS.find(c => c.id === botId)!

  return (
    <div className="page-content">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <p className="text-white font-bold">{char.name}</p>
          <p className="text-white/40 text-xs">⭐ {char.rating} · {char.description}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl`} style={{ background: `${char.color}33` }}>
          {char.emoji}
        </div>
      </div>

      <div className={`mx-4 mb-3 bg-gradient-to-r ${char.gradient} rounded-xl p-3`}>
        <p className="text-white/70 text-xs italic">{char.quote}</p>
      </div>

      <div className="flex justify-center">
        <CheckersBoard size={340} />
      </div>

      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        <button className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
          <p className="text-white text-xs">💡 Подсказка</p>
        </button>
        <button className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
          <p className="text-white text-xs">↩️ Отменить</p>
        </button>
        <button className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-center" onClick={onBack}>
          <p className="text-red-400 text-xs">🏳️ Сдаться</p>
        </button>
      </div>
    </div>
  )
}

const PUZZLES = [
  {
    title: 'Найди тактический удар',
    description: 'Белые ходят. Найди способ взять 2 шашки противника за один ход.',
    hint: 'Подсказка: посмотри на диагональ c3-f6',
    options: ['d4-e5', 'c3-b4', 'f2-e3', 'b2-c3'],
    correct: 0,
    xp: 30,
  },
  {
    title: 'Защита позиции',
    description: 'Чёрные угрожают взять твою дамку. Как защититься?',
    hint: 'Подсказка: думай об уходе с диагонали',
    options: ['g7-h6', 'e7-f6', 'g7-f8', 'e7-d6'],
    correct: 2,
    xp: 40,
  },
]

function PuzzleView({ onBack, onSolve, result }: {
  onBack: () => void
  onSolve: (correct: boolean) => void
  result: null | 'correct' | 'wrong'
}) {
  const [idx, setIdx] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const puzzle = PUZZLES[idx % PUZZLES.length]

  return (
    <div className="page-content">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <div>
          <p className="text-white font-bold">Задача #{idx + 1}</p>
          <p className="text-yellow-400 text-xs">+{puzzle.xp} XP</p>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <CheckersBoard size={300} />
      </div>

      <div className="px-4 mt-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
          <p className="text-white font-semibold text-sm mb-1">{puzzle.title}</p>
          <p className="text-white/60 text-xs">{puzzle.description}</p>
          {showHint && (
            <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2">
              <p className="text-yellow-400 text-xs">💡 {puzzle.hint}</p>
            </div>
          )}
        </div>

        {result && (
          <div className={`rounded-2xl p-3 mb-4 text-center ${result === 'correct' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
            <p className={`font-bold ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
              {result === 'correct' ? `✅ Правильно! +${puzzle.xp} XP` : '❌ Неверно. Попробуй ещё раз!'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {puzzle.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { onSolve(i === puzzle.correct); if (i === puzzle.correct) setIdx(p => p + 1) }}
              className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm hover:border-green-500/50 hover:bg-green-500/10 transition"
            >
              {opt}
            </button>
          ))}
        </div>

        <button onClick={() => setShowHint(!showHint)} className="btn-secondary w-full py-2.5 text-sm">
          {showHint ? '🙈 Скрыть подсказку' : '💡 Показать подсказку'}
        </button>
      </div>
    </div>
  )
}

const PAST_GAMES = [
  { id: 1, opponent: 'AlexK_99', result: 'win', moves: 24, date: '16 мая', analysis: 'Отличная игра! Ты контролировал центр с хода 8. Одна упущенная возможность на ходу 17.' },
  { id: 2, opponent: 'Maria_Chess', result: 'loss', moves: 31, date: '15 мая', analysis: 'Слабость на левом фланге. ИИ советует укреплять позицию до атаки.' },
  { id: 3, opponent: 'ИИ-Оракул', result: 'draw', moves: 42, date: '14 мая', analysis: 'Ничья против сильнейшего ИИ — это достижение! Твоя защита была безупречна.' },
]

function HistoryView({ onBack }: { onBack: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="page-content">
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <h2 className="text-white text-xl font-bold">Прошлые матчи</h2>
      </div>

      <div className="px-4 space-y-3 pb-4">
        {PAST_GAMES.map(game => (
          <div key={game.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              className="w-full p-4 flex items-center gap-3 text-left"
              onClick={() => setExpanded(expanded === game.id ? null : game.id)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                game.result === 'win' ? 'bg-green-500/20 text-green-400' :
                game.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {game.result === 'win' ? 'W' : game.result === 'loss' ? 'L' : 'D'}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">vs {game.opponent}</p>
                <p className="text-white/40 text-xs">{game.date} · {game.moves} ходов</p>
              </div>
              <span className="text-white/30">{expanded === game.id ? '↑' : '↓'}</span>
            </button>

            {expanded === game.id && (
              <div className="px-4 pb-4 space-y-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🤖</span>
                    <div>
                      <p className="text-blue-400 text-xs font-bold mb-1">ИИ-Анализ</p>
                      <p className="text-white/70 text-xs">{game.analysis}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 py-2 text-xs">📊 Подробный анализ</button>
                  <button className="btn-primary flex-1 py-2 text-xs">🔄 Переиграть позицию</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
