import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { AI_CHARACTERS } from '../../data/content'
import CheckersBoard from '../../components/CheckersBoard'

type View = 'main' | 'online' | 'friend' | 'bot' | 'botgame' | 'puzzle' | 'history'

export default function Home() {
  const { user, addNotification } = useApp()
  const [view, setView] = useState<View>('main')
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [playersOnline] = useState(() => Math.floor(Math.random() * 300) + 700)
  const [puzzleIdx, setPuzzleIdx] = useState(0)
  const [friendCode, setFriendCode] = useState('')
  const [liveMessages, setLiveMessages] = useState([{ from: 'opponent', text: 'Привет! Готов к игре? 🎮' }])
  const [chatInput, setChatInput] = useState('')
  const [isLive, setIsLive] = useState(false)

  const startSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      setView('online')
      addNotification('Соперник найден! AlexK_99 (1450 рейтинг) 🎮')
    }, 2500)
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const msg = chatInput
    setChatInput('')
    setLiveMessages(prev => [...prev, { from: 'me', text: msg }])
    setTimeout(() => {
      const replies = ['Хороший ход! 👍', 'Думаю... 🤔', 'Ого! Не ожидал', 'Интересно 🧐', 'gg']
      setLiveMessages(prev => [...prev, { from: 'opponent', text: replies[Math.floor(Math.random() * replies.length)] }])
    }, 1100)
  }

  if (view === 'online') return (
    <OnlineGame messages={liveMessages} chatInput={chatInput} setChatInput={setChatInput} onSend={sendChat}
      isLive={isLive} setIsLive={setIsLive} onBack={() => setView('main')} />
  )
  if (view === 'bot') return <BotSelection onSelect={id => { setSelectedBot(id); setView('botgame') }} onBack={() => setView('main')} />
  if (view === 'botgame' && selectedBot) return <BotGame botId={selectedBot} onBack={() => setView('main')} />
  if (view === 'puzzle') return <PuzzleView idx={puzzleIdx} setIdx={setPuzzleIdx} onBack={() => setView('main')} />
  if (view === 'history') return <HistoryView onBack={() => setView('main')} />

  return (
    <div className="page-content">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 checkerboard" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
        <div className="relative px-4 pt-5 pb-2 text-center">
          <p className="text-green-400 text-sm font-semibold mb-3">
            {user.childMode ? '🌈 Привет, юный чемпион!' : `Добро пожаловать, ${user.name || 'Игрок'}! 👋`}
          </p>
          <div className="flex justify-center mb-3">
            <CheckersBoard size={210} />
          </div>
          {/* Stats */}
          <div className="flex items-center justify-center gap-5 mb-3">
            {[
              { v: user.xp.toLocaleString(), l: 'XP', color: 'text-purple-400' },
              { v: `${user.streak}🔥`, l: 'Страйк', color: 'text-orange-400' },
              { v: `#${user.rank}`, l: 'Рейтинг', color: 'text-yellow-400' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className={`text-xl font-black ${s.color}`}>{s.v}</p>
                <p className="text-white/30 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 pb-4">
        {/* Play Online */}
        {isSearching ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">Ищем соперника...</p>
              <p className="text-white/40 text-sm">{playersOnline} игроков онлайн</p>
            </div>
            <button onClick={() => setIsSearching(false)} className="text-white/30 text-sm hover:text-white/60 transition">Отмена</button>
          </div>
        ) : (
          <button onClick={startSearch}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-4 flex items-center gap-4 shadow-xl shadow-green-500/20 hover:shadow-green-500/35 hover:scale-[1.01] transition-all active:scale-[0.99]">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🌐</div>
            <div className="flex-1 text-left">
              <p className="text-white font-black text-base">Играть онлайн</p>
              <p className="text-white/70 text-xs">Автопоиск · {playersOnline} онлайн сейчас</p>
            </div>
            <div className="text-white/70 text-2xl">›</div>
          </button>
        )}

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '👥', label: 'С другом', sub: 'Код комнаты', action: () => setView('friend'), hov: 'hover:border-blue-500/40' },
            { icon: '🤖', label: 'С ботом', sub: '5 ИИ-персонажей', action: () => setView('bot'), hov: 'hover:border-purple-500/40' },
            { icon: '🧩', label: 'Задачи', sub: '+30 XP за задачу', action: () => setView('puzzle'), hov: 'hover:border-yellow-500/40' },
            { icon: '📊', label: 'История', sub: 'ИИ-анализ партий', action: () => setView('history'), hov: 'hover:border-pink-500/40' },
          ].map(b => (
            <button key={b.label} onClick={b.action}
              className={`bg-white/4 border border-white/8 ${b.hov} rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]`}>
              <span className="text-3xl">{b.icon}</span>
              <span className="text-white font-bold text-sm">{b.label}</span>
              <span className="text-white/35 text-xs">{b.sub}</span>
            </button>
          ))}
        </div>

        {/* Daily quest */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/40 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-bold text-sm">🌟 Задание дня</p>
            <span className="text-yellow-400 text-xs font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full">+150 XP</span>
          </div>
          <p className="text-white/50 text-xs mb-3">Победи в онлайн-партии менее чем за 20 ходов</p>
          <div className="bg-black/30 rounded-full h-1.5 overflow-hidden mb-1">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '30%' }} />
          </div>
          <p className="text-white/25 text-xs">0 / 1 выполнено</p>
        </div>
      </div>

      {/* Friend modal */}
      {view === 'friend' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 w-full max-w-sm border border-white/10 animate-pop">
            <h3 className="text-white text-xl font-bold mb-4">👥 Играть с другом</h3>
            <p className="text-white/50 text-sm mb-2">Твой код комнаты:</p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center mb-4">
              <span className="text-green-400 font-mono font-black text-2xl tracking-widest">7F4K2</span>
            </div>
            <div className="text-center text-white/20 text-sm mb-4">— или введи код друга —</div>
            <input className="app-input text-center font-mono tracking-widest text-lg mb-4" placeholder="XXXXX"
              maxLength={5} value={friendCode} onChange={e => setFriendCode(e.target.value.toUpperCase())} />
            <div className="flex gap-3">
              <button className="btn-secondary flex-1 py-3" onClick={() => setView('main')}>Отмена</button>
              <button className="btn-primary flex-1 py-3" onClick={() => setView('main')}>Войти →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ========================================================= */
function BotSelection({ onSelect, onBack }: { onSelect: (id: string) => void; onBack: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="page-content">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">←</button>
        <div>
          <h2 className="text-white text-xl font-bold">Выбери соперника</h2>
          <p className="text-white/40 text-xs">5 уникальных ИИ-персонажей</p>
        </div>
      </div>
      <div className="px-4 space-y-3 pb-4">
        {AI_CHARACTERS.map(char => (
          <button key={char.id} onClick={() => onSelect(char.id)} onMouseEnter={() => setHovered(char.id)} onMouseLeave={() => setHovered(null)}
            className={`w-full bg-gradient-to-r ${char.gradient} border rounded-2xl p-4 text-left transition-all ${hovered === char.id ? 'border-white/30 scale-[1.01]' : 'border-white/8'}`}>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-white/10" style={{ background: `${char.color}25` }}>
                {char.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-white font-black text-sm">{char.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-white/60 text-xs font-bold">{char.rating}</span>
                  </div>
                </div>
                <p className="text-xs mb-1" style={{ color: char.color }}>{char.description}</p>
                <p className="text-white/40 text-xs">{char.style}</p>
                <p className="mt-1.5 text-xs italic opacity-80" style={{ color: char.color }}>{char.quote}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function BotGame({ botId, onBack }: { botId: string; onBack: () => void }) {
  const { user, updateUser, addNotification } = useApp()
  const char = AI_CHARACTERS.find(c => c.id === botId)!
  const [moveCount, setMoveCount] = useState(0)
  const [botThinking, setBotThinking] = useState(false)
  const [botComment, setBotComment] = useState(char.quote.replace(/"/g, ''))
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [playerTime] = useState(300)
  const [botTime] = useState(300)

  const botComments: Record<string, string[]> = {
    grandmaster: ['Предсказуемый ход.', 'Рассчитано.', 'Именно это я и ждал.', 'Позиция в мою пользу.'],
    trickster: ['Хаос нарастает... 😈', 'Ты попал в мою ловушку.', 'Неожиданно? Для меня — нет.', 'Танцуй, марионетка!'],
    commander: ['АТАКУЮ!', 'Центр мой.', 'Ты теряешь позицию.', 'Я доминирую на доске.'],
    observer: ['Ты боишься... я вижу.', 'Нерешительность — твой враг.', 'Интересный психологический выбор.', '...'],
    oracle: ['Вероятность твоей победы: 18%.', 'Предсказано 3 хода назад.', 'Оптимальный ход найден.', 'Просчитал 847 вариантов.'],
  }

  const makeMove = () => {
    if (botThinking || gameOver) return
    setMoveCount(m => m + 1)
    setBotThinking(true)
    setTimeout(() => {
      setBotThinking(false)
      const comments = botComments[botId] || botComments.grandmaster
      setBotComment(comments[Math.floor(Math.random() * comments.length)])
      if (moveCount > 0 && Math.random() < 0.08) {
        const result = Math.random() > 0.45 ? 'win' : 'lose'
        setGameOver(result)
        if (result === 'win') {
          updateUser({ xp: user.xp + 200, coins: user.coins + 30 })
          addNotification(`Победа над ${char.name}! +200 XP 🏆`)
        }
      }
    }, 800 + Math.random() * 1200)
  }

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">←</button>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{char.name}</p>
          <p className="text-white/40 text-xs">Ход {moveCount + 1}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${char.color}25` }}>{char.emoji}</div>
      </div>

      {/* Bot quote bubble */}
      <div className={`mx-4 mb-2 bg-gradient-to-r ${char.gradient} border border-white/10 rounded-2xl p-3 flex items-start gap-2`}>
        {botThinking ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">{char.emoji}</span>
            <div className="flex gap-1">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
            </div>
          </div>
        ) : (
          <>
            <span className="text-xl">{char.emoji}</span>
            <p className="text-white/80 text-xs italic flex-1">{botComment}</p>
          </>
        )}
      </div>

      {/* Bot opponent row */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-white/10" style={{ background: char.color }}>{char.emoji}</div>
        <div className="flex-1">
          <p className="text-white text-sm font-bold">{char.name}</p>
          <p className="text-white/40 text-xs">⭐ {char.rating}</p>
        </div>
        <div className={`font-mono font-bold text-sm px-3 py-1 rounded-xl ${botThinking ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white'}`}>
          {fmt(botTime)}
        </div>
      </div>

      <div className="flex justify-center py-1 cursor-pointer" onClick={makeMove}>
        <CheckersBoard size={330} />
      </div>
      {!gameOver && <p className="text-center text-white/20 text-xs mb-1">Нажми на доску чтобы сделать ход</p>}

      {/* My row */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl">🚀</div>
        <div className="flex-1">
          <p className="text-green-400 text-sm font-bold">Ты</p>
          <p className="text-white/40 text-xs">{user.xp.toLocaleString()} XP</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 font-mono font-bold text-green-400 text-sm px-3 py-1 rounded-xl">{fmt(playerTime)}</div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-1 grid grid-cols-3 gap-2">
        <button className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-2 text-center hover:bg-blue-500/20 transition">
          <p className="text-blue-400 text-xs font-semibold">💡 Подсказка</p>
        </button>
        <button className="bg-white/5 border border-white/8 rounded-xl p-2 text-center hover:bg-white/10 transition">
          <p className="text-white/60 text-xs font-semibold">↩️ Отменить</p>
        </button>
        <button className="bg-red-500/10 border border-red-500/15 rounded-xl p-2 text-center hover:bg-red-500/20 transition" onClick={onBack}>
          <p className="text-red-400 text-xs font-semibold">🏳️ Сдаться</p>
        </button>
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 mx-6 text-center border border-white/10 animate-pop">
            <div className="text-7xl mb-4">{gameOver === 'win' ? '🏆' : '💪'}</div>
            <h3 className="text-white font-black text-2xl mb-2">{gameOver === 'win' ? 'Победа!' : 'Поражение'}</h3>
            <p className="text-white/60 text-sm mb-1">Ходов сыграно: {moveCount}</p>
            {gameOver === 'win' && <p className="text-green-400 font-bold mb-4">+200 XP · +30 🪙</p>}
            {gameOver === 'lose' && <p className="text-white/40 text-sm mb-4">Не сдавайся — продолжай тренироваться!</p>}
            <div className="flex gap-3">
              <button className="btn-secondary flex-1 py-3 text-sm" onClick={() => { setMoveCount(0); setGameOver(null); setBotComment(char.quote.replace(/"/g,'')) }}>Реванш</button>
              <button className="btn-primary flex-1 py-3 text-sm" onClick={onBack}>В меню</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OnlineGame({ messages, chatInput, setChatInput, onSend, isLive, setIsLive, onBack }: {
  messages: { from: string; text: string }[]
  chatInput: string
  setChatInput: (v: string) => void
  onSend: () => void
  isLive: boolean
  setIsLive: (v: boolean) => void
  onBack: () => void
}) {
  return (
    <div className="page-content">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">←</button>
        <div className="text-center">
          <p className="text-white font-bold text-sm">AlexK_99 🇰🇿 vs Ты</p>
          <p className="text-white/30 text-xs">Рейтинговая · 1 мин + 0 сек</p>
        </div>
        <button onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition ${isLive ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-white/5 border border-white/10 text-white/40'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-white/30'}`} />
          {isLive ? 'LIVE' : 'Эфир'}
        </button>
      </div>

      {isLive && (
        <div className="mx-4 mb-2 bg-red-500/10 border border-red-500/20 rounded-xl p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-black">ПРЯМОЙ ЭФИР</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/35">
            <span>👁️ 23</span><span>❤️ 147</span><span>🎁 12</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-xl">🦁</div>
        <div className="flex-1"><p className="text-white text-sm font-bold">AlexK_99</p><p className="text-white/30 text-xs">1450 рейтинг</p></div>
        <div className="bg-red-500/10 border border-red-500/20 font-mono font-bold text-red-400 text-sm px-3 py-1 rounded-xl">0:58</div>
      </div>

      <div className="flex justify-center py-1"><CheckersBoard size={330} /></div>

      <div className="flex items-center gap-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl">🚀</div>
        <div className="flex-1"><p className="text-green-400 text-sm font-bold">Ты</p><p className="text-white/30 text-xs">1200 рейтинг</p></div>
        <div className="bg-green-500/10 border border-green-500/20 font-mono font-bold text-green-400 text-sm px-3 py-1 rounded-xl">1:00</div>
      </div>

      <div className="px-4 mt-1">
        <div className="bg-white/4 rounded-2xl p-3 h-24 overflow-y-auto mb-2 space-y-1.5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-xs px-3 py-1.5 rounded-full max-w-[80%] ${m.from === 'me' ? 'bg-green-600 text-white' : 'bg-white/10 text-white/80'}`}>{m.text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="app-input flex-1 py-2 text-sm" placeholder="Написать..."
            value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} />
          <button onClick={onSend} className="btn-primary px-4 py-2 text-sm">→</button>
        </div>
      </div>
    </div>
  )
}

const PUZZLES = [
  { title: 'Двойной удар', desc: 'Найди ход, которым можно взять 2 шашки за один прыжок.', hint: '💡 Ищи прыжок через b4 на d6, затем f8', options: ['e3-f4', 'c3-d4', 'e3-c5-a7', 'b2-c3'], correct: 2, xp: 35, difficulty: '⭐ Лёгкая' },
  { title: 'Защитная позиция', desc: 'Чёрные угрожают взять дамку. Как защититься наилучшим образом?', hint: '💡 Отойди на g7 чтобы уйти с диагонали угрозы', options: ['g7-h8', 'g7-f8✓', 'g5-h6', 'отдай дамку'], correct: 1, xp: 45, difficulty: '⭐⭐ Средняя' },
  { title: 'Путь к дамке', desc: 'Проведи шашку в дамки за минимальное количество ходов, избегая взятий.', hint: '💡 Иди через c5-b6-a7-b8', options: ['c5-d6-e7-f8', 'c5-b6-a7-b8', 'c5-d6-c7-d8', 'c5-b6-c7-b8'], correct: 1, xp: 50, difficulty: '⭐⭐⭐ Сложная' },
]

function PuzzleView({ idx, setIdx, onBack }: { idx: number; setIdx: (i: number) => void; onBack: () => void }) {
  const { updateUser, user, addNotification } = useApp()
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState<null | 'correct' | 'wrong'>(null)
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
  const puzzle = PUZZLES[idx % PUZZLES.length]

  const attempt = (i: number) => {
    if (selectedOpt !== null) return
    setSelectedOpt(i)
    const ok = i === puzzle.correct
    setResult(ok ? 'correct' : 'wrong')
    if (ok) {
      updateUser({ xp: user.xp + puzzle.xp, coins: user.coins + 5 })
      addNotification(`✅ Решено! +${puzzle.xp} XP +5 🪙`)
    }
  }

  const next = () => {
    setIdx(idx + 1)
    setSelectedOpt(null)
    setResult(null)
    setShowHint(false)
  }

  return (
    <div className="page-content">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">←</button>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{puzzle.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white/40 text-xs">{puzzle.difficulty}</span>
            <span className="text-yellow-400 text-xs font-bold">+{puzzle.xp} XP</span>
          </div>
        </div>
        <span className="text-white/30 text-sm">#{idx + 1}</span>
      </div>

      <div className="flex justify-center py-1"><CheckersBoard size={300} /></div>

      <div className="px-4 mt-2 space-y-3">
        <div className="bg-white/4 border border-white/8 rounded-2xl p-4">
          <p className="text-white text-sm leading-relaxed">{puzzle.desc}</p>
          {showHint && (
            <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2">
              <p className="text-yellow-400 text-xs">{puzzle.hint}</p>
            </div>
          )}
        </div>

        {result && (
          <div className={`rounded-2xl p-3 text-center animate-pop border ${result === 'correct' ? 'bg-green-500/15 border-green-500/30' : 'bg-red-500/15 border-red-500/30'}`}>
            <p className={`font-bold ${result === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
              {result === 'correct' ? `✅ Отлично! +${puzzle.xp} XP` : `❌ Неверно. Правильный: ${puzzle.options[puzzle.correct]}`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {puzzle.options.map((opt, i) => (
            <button key={i} onClick={() => attempt(i)} disabled={selectedOpt !== null}
              className={`py-3 px-3 rounded-xl text-sm font-mono font-semibold text-center transition border ${
                selectedOpt === i
                  ? i === puzzle.correct ? 'bg-green-500/25 border-green-500 text-green-300' : 'bg-red-500/25 border-red-500 text-red-300'
                  : selectedOpt !== null && i === puzzle.correct ? 'bg-green-500/15 border-green-500/40 text-green-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/25'
              }`}>
              {opt}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowHint(!showHint)} className="btn-secondary flex-1 py-2.5 text-sm">
            {showHint ? '🙈 Скрыть' : '💡 Подсказка'}
          </button>
          {selectedOpt !== null && (
            <button onClick={next} className="btn-primary flex-1 py-2.5 text-sm">Следующая →</button>
          )}
        </div>
      </div>
    </div>
  )
}

const PAST = [
  { id: 1, opp: 'AlexK_99', result: 'win', moves: 24, date: '16 мая', score: '1-0', analysis: 'Отличная партия! Ты контролировал центр с 8-го хода. Одна пропущенная возможность на ходу 17 — но победа заслуженная. Продолжай!' },
  { id: 2, opp: 'Maria_Chess', result: 'loss', moves: 31, date: '15 мая', score: '0-1', analysis: 'Слабость на левом фланге с хода 12. Рекомендую уроки по "Защита позиции" — укрепляй позицию перед атакой.' },
  { id: 3, opp: 'ИИ-Оракул', result: 'draw', moves: 42, date: '14 мая', score: '½-½', analysis: 'Ничья с сильнейшим ботом — это достижение! Твоя эндшпильная техника заметно улучшилась. 🏆' },
]

function HistoryView({ onBack }: { onBack: () => void }) {
  const [exp, setExp] = useState<number | null>(null)

  return (
    <div className="page-content">
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition">←</button>
        <div>
          <h2 className="text-white text-xl font-bold">История матчей</h2>
          <p className="text-white/40 text-xs">ИИ-анализ каждой партии</p>
        </div>
      </div>

      <div className="px-4 space-y-3 pb-4">
        {PAST.map(g => (
          <div key={g.id} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
            <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/3 transition" onClick={() => setExp(exp === g.id ? null : g.id)}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${
                g.result === 'win' ? 'bg-green-500/20 text-green-400' : g.result === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {g.score}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">vs {g.opp}</p>
                <p className="text-white/30 text-xs">{g.date} · {g.moves} ходов</p>
              </div>
              <span className="text-white/20 text-lg">{exp === g.id ? '↑' : '↓'}</span>
            </button>
            {exp === g.id && (
              <div className="px-4 pb-4 space-y-3 animate-slide-up">
                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/30 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-xl">🤖</span>
                  <div>
                    <p className="text-blue-400 text-xs font-bold mb-1">ИИ-Анализ</p>
                    <p className="text-white/70 text-xs leading-relaxed">{g.analysis}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 py-2 text-xs">📊 Подробно</button>
                  <button className="btn-primary flex-1 py-2 text-xs">🔄 Переиграть</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
