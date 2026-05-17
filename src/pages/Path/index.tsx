import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { PATH_NODES } from '../../data/content'

export default function Path() {
  const { user, updateUser, addNotification } = useApp()
  const [modal, setModal] = useState<null | 'skills' | 'events' | 'gacha'>(null)
  const [spinning, setSpinning] = useState(false)
  const [gachaResult, setGachaResult] = useState<string | null>(null)

  const spin = () => {
    if (user.coins < 50) { addNotification('Недостаточно монет! Нужно 50 🪙'); return }
    setSpinning(true); setGachaResult(null)
    updateUser({ coins: user.coins - 50 })
    setTimeout(() => {
      const pool = [
        { label: '🥉 Бронзовый скин', rarity: 'common' },
        { label: '🗡️ Серебряные шашки', rarity: 'uncommon' },
        { label: '🌸 Весенняя тема', rarity: 'uncommon' },
        { label: '👑 Корона чемпиона', rarity: 'rare' },
        { label: '🌌 Космическая доска', rarity: 'epic' },
        { label: '🔥 Огненный эффект', rarity: 'legendary' },
      ]
      const weights = [35, 25, 20, 12, 6, 2]
      let rand = Math.random() * 100; let result = pool[0]
      for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) { result = pool[i]; break }
        rand -= weights[i]
      }
      setGachaResult(result.label)
      setSpinning(false)
      addNotification(`Получено: ${result.label} 🎉`)
    }, 1800)
  }

  const xpToNext = 2000; const xpProgress = (user.xp % xpToNext) / xpToNext * 100

  return (
    <div className="page-content bg-path">
      {/* Header */}
      <div className="px-4 pt-5 pb-2">
        {/* XP bar */}
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-white font-bold text-sm">Уровень {Math.floor(user.xp / xpToNext) + 1}</p>
                <p className="text-white/40 text-xs">{user.xp} / {(Math.floor(user.xp / xpToNext) + 1) * xpToNext} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold">{user.coins} 🪙</p>
              <p className="text-white/40 text-xs">монет</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-full h-2.5 overflow-hidden">
            <div className="xp-shimmer h-full rounded-full progress-fill" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>

        {/* Quick buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: 'skills', icon: '🧠', label: 'Навыки', color: 'from-purple-600/30 to-purple-900/30', border: 'border-purple-500/30' },
            { id: 'events', icon: '🎪', label: 'Ивенты', color: 'from-pink-600/30 to-red-900/30', border: 'border-pink-500/30' },
            { id: 'gacha', icon: '🎰', label: 'Гадание', color: 'from-yellow-600/30 to-amber-900/30', border: 'border-yellow-500/30' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setModal(btn.id as any)}
              className={`bg-gradient-to-br ${btn.color} border ${btn.border} rounded-xl p-3 flex flex-col items-center gap-1 transition-all hover:scale-105 active:scale-95`}
            >
              <span className="text-2xl">{btn.icon}</span>
              <span className="text-white/80 text-xs font-semibold">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Trainer tip */}
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/30 border border-green-500/20 rounded-2xl p-3 flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-lg shrink-0 shadow-lg shadow-green-500/30">🤖</div>
          <div>
            <p className="text-green-400 font-bold text-xs mb-0.5">ИИ-Тренер</p>
            <p className="text-white/70 text-xs leading-relaxed">
              {user.books.includes('Harry Potter')
                ? '"Гермиона говорила: «Я надеюсь, ты учил уроки». Так вот — контроль центра это твоё заклинание Protego! 🪄"'
                : user.musicGenres.includes('Hip-Hop')
                ? '"Stay focused, stay grinding. Каждый пройденный узел — это новый уровень игры. Let\'s go! 🎤"'
                : '"Великие чемпионы начинали здесь. Каждый шаг вперёд — это победа над вчерашней версией себя 💪"'}
            </p>
          </div>
        </div>
      </div>

      {/* === PATH NODES === */}
      <div className="px-6 relative pb-6">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />

        {PATH_NODES.map((node, idx) => {
          const isLeft = idx % 2 === 0
          const chapterStart = idx === 0 || node.chapter !== PATH_NODES[idx - 1].chapter

          return (
            <div key={node.id}>
              {chapterStart && (
                <div className="relative z-20 flex justify-center mb-4 mt-2">
                  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5">
                    <p className="text-white/60 text-xs font-semibold tracking-wider">— ГЛАВА {node.chapter} —</p>
                  </div>
                </div>
              )}
              <div className={`relative flex items-center mb-7 ${isLeft ? 'justify-start' : 'justify-end'}`}>
                {/* Connector */}
                <div className={`absolute top-1/2 -translate-y-1/2 h-0.5 ${isLeft ? 'left-1/2' : 'right-1/2'} w-1/3 ${node.completed ? 'bg-green-500' : 'bg-white/10'}`} />

                {/* Node button */}
                <button className={`relative z-10 w-[68px] h-[68px] rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all shadow-lg ${
                  node.active
                    ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-200 animate-node-pulse scale-110 shadow-green-500/40'
                    : node.completed
                    ? 'bg-gradient-to-br from-green-700/80 to-green-900/80 border-green-500/50'
                    : 'bg-gradient-to-br from-slate-700/60 to-slate-900/60 border-white/10'
                }`}>
                  <span className="text-2xl">{node.icon}</span>
                  {node.completed && (
                    <div className="flex gap-0.5">
                      {[1,2,3].map(s => (
                        <span key={s} className={`text-[9px] ${s <= node.stars ? 'text-yellow-300' : 'text-white/20'}`}>★</span>
                      ))}
                    </div>
                  )}
                  {node.active && <span className="text-[9px] text-white/90 font-bold">СЕЙЧАС</span>}
                </button>

                {/* Label */}
                <div className={`absolute ${isLeft ? 'left-[58%] pl-3' : 'right-[58%] pr-3 text-right'} top-1/2 -translate-y-1/2`}>
                  <p className={`text-xs font-semibold whitespace-nowrap leading-tight ${node.active ? 'text-green-300' : node.completed ? 'text-white/80' : 'text-white/25'}`}>
                    {node.title}
                  </p>
                  {node.active && <p className="text-green-400/60 text-[10px]">Продолжить</p>}
                  {!node.completed && !node.active && <p className="text-white/20 text-[10px]">🔒 Заблокировано</p>}
                </div>
              </div>
            </div>
          )
        })}

        {/* Trophy end */}
        <div className="flex justify-center mt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border-2 border-yellow-500/30 flex flex-col items-center justify-center shadow-lg shadow-yellow-500/10">
            <span className="text-2xl">🏆</span>
            <span className="text-yellow-400/50 text-[10px] font-bold">ФИНАЛ</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[430px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl p-5 pb-8 border-t border-white/10 max-h-[85vh] overflow-y-auto animate-slide-up"
            onClick={e => e.stopPropagation()}>
            {modal === 'skills' && <SkillsModal onClose={() => setModal(null)} />}
            {modal === 'events' && <EventsModal />}
            {modal === 'gacha' && <GachaModal coins={user.coins} spinning={spinning} result={gachaResult} onSpin={spin} />}
            {modal !== 'skills' && (
              <button onClick={() => setModal(null)} className="mt-4 w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 text-sm transition">
                Закрыть
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   SKILLS MODAL — real interactive mini-games
   ============================================================ */
type SkillGame = 'menu' | 'memory' | 'speed' | 'logic' | 'focus'

const SPEED_POSITIONS = [
  { board: '5 шашек в центре vs 3 у края', correct: 'Атаковать край', wrong: ['Защищать центр', 'Ход назад', 'Пропустить'] },
  { board: 'Соперник открыл фланг', correct: 'Использовать прорыв', wrong: ['Отступить', 'Ход в центр', 'Обменяться'] },
  { board: 'У соперника 1 шашка до дамки', correct: 'Заблокировать путь', wrong: ['Атаковать другой фланг', 'Ход дамкой', 'Пропустить'] },
]

const LOGIC_PUZZLES = [
  { question: 'Шашка на e3. За 2 хода можно взять 2 фигуры противника. Оба хода?', options: ['e3→f4→g5', 'e3→d4→e5', 'e3→f4→d6', 'e3→d4→c5'], correct: 0 },
  { question: 'Ход белых. Как взять 3 шашки за 1 ход (цепочкой)?', options: ['Через b2-d4-f6', 'Через a3-c5-e7', 'Через c1-e3-g5', 'Через d2-f4-h6'], correct: 2 },
]

const MEMORY_POSITIONS = [
  { pieces: ['e3', 'c3', 'g5', 'a5', 'f4'], label: '5 шашек' },
  { pieces: ['d4', 'b4', 'f2', 'h6', 'c7', 'e5'], label: '6 шашек' },
  { pieces: ['a1', 'c3', 'e5', 'g7', 'b6', 'f4', 'd2'], label: '7 шашек' },
]

function SkillsModal({ onClose }: { onClose: () => void }) {
  const { updateUser, user, addNotification } = useApp()
  const [game, setGame] = useState<SkillGame>('menu')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'show' | 'answer' | 'result'>('show')
  const [timeLeft, setTimeLeft] = useState(5)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [memoryInput, setMemoryInput] = useState('')
  const finishGame = (finalScore: number) => {
    const xpGained = finalScore * 25
    updateUser({ xp: user.xp + xpGained })
    addNotification(`+${xpGained} XP за тренировку! 🎉`)
    setPhase('result')
    setScore(finalScore)
  }

  const startGame = (g: SkillGame) => {
    setGame(g); setScore(0); setRound(0); setPhase('show')
    setSelectedAnswer(null); setIsCorrect(null); setMemoryInput('')
    setTimeLeft(5)
  }

  // Speed game timer
  useEffect(() => {
    if (game === 'speed' && phase === 'show') {
      setTimeLeft(5)
      const interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(interval)
            if (selectedAnswer === null) {
              setIsCorrect(false)
              setTimeout(() => nextRound(false), 800)
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [game, phase, round])

  const nextRound = (correct: boolean) => {
    const newScore = score + (correct ? 1 : 0)
    setScore(newScore)
    setSelectedAnswer(null); setIsCorrect(null)
    const totalRounds = game === 'speed' ? SPEED_POSITIONS.length : game === 'logic' ? LOGIC_PUZZLES.length : 3
    if (round + 1 >= totalRounds) {
      finishGame(newScore)
    } else {
      setRound(r => r + 1)
      setPhase('show')
      setTimeLeft(5)
    }
  }

  const answerQuestion = (answer: string, correct: string) => {
    const ok = answer === correct
    setSelectedAnswer(answer); setIsCorrect(ok)
    setTimeout(() => nextRound(ok), 900)
  }

  if (game === 'menu') return (
    <div>
      <h3 className="text-white font-bold text-xl mb-1">🧠 Тренировка навыков</h3>
      <p className="text-white/40 text-sm mb-4">+25 XP за каждый правильный ответ</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'memory', icon: '🧠', name: 'Память', desc: 'Запомни позиции шашек', color: '#8b5cf6', gradient: 'from-purple-600 to-violet-800' },
          { id: 'speed', icon: '⚡', name: 'Скорость', desc: 'Лучший ход за 5 секунд', color: '#f59e0b', gradient: 'from-amber-500 to-orange-700' },
          { id: 'logic', icon: '🔗', name: 'Логика', desc: 'Комбинации на 2+ хода', color: '#06b6d4', gradient: 'from-cyan-500 to-blue-700' },
          { id: 'focus', icon: '🎯', name: 'Фокус', desc: 'Найди скрытую угрозу', color: '#10b981', gradient: 'from-emerald-500 to-teal-700' },
        ].map(g => (
          <button
            key={g.id}
            onClick={() => startGame(g.id as SkillGame)}
            className={`bg-gradient-to-br ${g.gradient} rounded-2xl p-4 text-left border border-white/10 hover:scale-105 active:scale-95 transition-all shadow-lg`}
          >
            <div className="text-3xl mb-2">{g.icon}</div>
            <p className="text-white font-bold text-sm">{g.name}</p>
            <p className="text-white/60 text-xs mt-0.5">{g.desc}</p>
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-4 w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 text-sm transition">Закрыть</button>
    </div>
  )

  if (phase === 'result') return (
    <div className="text-center py-4">
      <div className="text-6xl mb-3 animate-pop">
        {score >= 3 ? '🏆' : score >= 2 ? '⭐' : score >= 1 ? '👍' : '💪'}
      </div>
      <h3 className="text-white font-bold text-2xl mb-1">{score} / {game === 'speed' ? SPEED_POSITIONS.length : game === 'logic' ? LOGIC_PUZZLES.length : 3} правильно</h3>
      <p className="text-green-400 font-bold text-lg mb-4">+{score * 25} XP получено!</p>
      <div className="flex gap-3">
        <button className="btn-secondary flex-1 py-3" onClick={() => startGame(game)}>Ещё раз</button>
        <button className="btn-primary flex-1 py-3" onClick={() => setGame('menu')}>Другая игра</button>
      </div>
    </div>
  )

  /* MEMORY GAME */
  if (game === 'memory') {
    const pos = MEMORY_POSITIONS[Math.min(round, MEMORY_POSITIONS.length - 1)]
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setGame('menu')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">←</button>
          <div>
            <p className="text-white font-bold">🧠 Память — Раунд {round + 1}/{MEMORY_POSITIONS.length}</p>
            <p className="text-purple-400 text-xs">Счёт: {score}</p>
          </div>
        </div>
        {phase === 'show' && (
          <div>
            <p className="text-white/60 text-sm mb-3">Запомни позиции шашек ({pos.label}):</p>
            <div className="bg-amber-900/30 border border-amber-500/20 rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-4 gap-2 justify-items-center">
                {pos.pieces.map(p => (
                  <div key={p} className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-red-500/30">
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full" onClick={() => setPhase('answer')}>
              Готово — ответить →
            </button>
          </div>
        )}
        {phase === 'answer' && (
          <div>
            <p className="text-white/60 text-sm mb-3">Введи позиции через запятую:</p>
            <input
              className="app-input mb-3 text-center font-mono tracking-wider"
              placeholder="e3, c3, g5, ..."
              value={memoryInput}
              onChange={e => setMemoryInput(e.target.value)}
            />
            <p className="text-white/30 text-xs mb-4 text-center">Напр: e3, c3, g5, a5, f4</p>
            <button
              className="btn-primary w-full"
              onClick={() => {
                const entered = memoryInput.toLowerCase().replace(/\s/g, '').split(',').sort()
                const correct = pos.pieces.map(p => p.toLowerCase()).sort()
                const ok = JSON.stringify(entered) === JSON.stringify(correct)
                setIsCorrect(ok)
                setTimeout(() => nextRound(ok), 1000)
              }}
            >
              Проверить
            </button>
            {isCorrect !== null && (
              <div className={`mt-3 rounded-xl p-3 text-center font-bold ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isCorrect ? '✅ Отлично! Всё верно!' : `❌ Правильно: ${pos.pieces.join(', ')}`}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  /* SPEED GAME */
  if (game === 'speed') {
    const q = SPEED_POSITIONS[Math.min(round, SPEED_POSITIONS.length - 1)]
    const allOptions = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5)
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setGame('menu')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">←</button>
          <div className="flex-1">
            <p className="text-white font-bold">⚡ Скорость — Раунд {round + 1}/{SPEED_POSITIONS.length}</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${timeLeft <= 2 ? 'border-red-500 text-red-400 animate-pulse' : 'border-amber-500 text-amber-400'}`}>
            {timeLeft}
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
            style={{ width: `${(timeLeft / 5) * 100}%`, transition: 'width 1s linear' }}
          />
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-center">
          <p className="text-white/50 text-xs mb-1">Ситуация на доске:</p>
          <p className="text-white font-bold">{q.board}</p>
        </div>
        <p className="text-white/60 text-sm mb-3">Лучший ход:</p>
        <div className="grid grid-cols-2 gap-2">
          {allOptions.map(opt => (
            <button
              key={opt}
              onClick={() => { if (!selectedAnswer) answerQuestion(opt, q.correct) }}
              disabled={!!selectedAnswer}
              className={`py-3 px-3 rounded-xl text-sm font-semibold transition-all border ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-green-500/30 border-green-500 text-green-300'
                    : 'bg-red-500/30 border-red-500 text-red-300 animate-shake'
                  : selectedAnswer && opt === q.correct
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/25'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* LOGIC GAME */
  if (game === 'logic') {
    const q = LOGIC_PUZZLES[Math.min(round, LOGIC_PUZZLES.length - 1)]
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setGame('menu')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">←</button>
          <p className="text-white font-bold">🔗 Логика — Задача {round + 1}/{LOGIC_PUZZLES.length}</p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 mb-4">
          <p className="text-white text-sm leading-relaxed">{q.question}</p>
        </div>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { if (!selectedAnswer) answerQuestion(opt, q.options[q.correct]) }}
              disabled={!!selectedAnswer}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-mono font-semibold transition-all border ${
                selectedAnswer === opt
                  ? i === q.correct ? 'bg-green-500/25 border-green-500 text-green-300' : 'bg-red-500/25 border-red-500 text-red-300'
                  : selectedAnswer && i === q.correct ? 'bg-green-500/15 border-green-500/50 text-green-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* FOCUS GAME */
  if (game === 'focus') {
    const threats = [
      { desc: 'Соперник угрожает взять 2 шашки за один ход. Где угроза?', options: ['Левый фланг', 'Центр', 'Правый фланг', 'Нет угрозы'], correct: 'Центр' },
      { desc: 'Замаскированная ловушка: соперник жертвует шашку. Стоит ли брать?', options: ['Брать сразу', 'Не брать — ловушка', 'Брать потом', 'Отступить'], correct: 'Не брать — ловушка' },
      { desc: 'Соперник ведёт к дамке через h8. Как заблокировать?', options: ['Поставить на g7', 'Атаковать на a3', 'Ход дамкой', 'Ждать'], correct: 'Поставить на g7' },
    ]
    const t = threats[Math.min(round, threats.length - 1)]
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setGame('menu')} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">←</button>
          <p className="text-white font-bold">🎯 Фокус — {round + 1}/{threats.length}</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-4">
          <p className="text-emerald-400 text-xs font-bold mb-1">⚠️ Ситуация:</p>
          <p className="text-white text-sm">{t.desc}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {t.options.map(opt => (
            <button
              key={opt}
              onClick={() => { if (!selectedAnswer) answerQuestion(opt, t.correct) }}
              disabled={!!selectedAnswer}
              className={`py-3 px-2 rounded-xl text-xs font-semibold text-center transition-all border ${
                selectedAnswer === opt
                  ? opt === t.correct ? 'bg-green-500/25 border-green-500 text-green-300' : 'bg-red-500/25 border-red-500 text-red-300'
                  : selectedAnswer && opt === t.correct ? 'bg-green-500/15 border-green-500/50 text-green-400'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}

function EventsModal() {
  const events = [
    { title: 'Весенний чемпионат', emoji: '🌸', progress: 4, total: 10, reward: '🌸 Весенний скин + 500 XP', days: 8, color: '#ec4899', desc: 'Сыграй 10 партий за 2 недели' },
    { title: 'Марафон задач', emoji: '⚡', progress: 23, total: 50, reward: '⚡ Эффект молнии + 300 🪙', days: 5, color: '#f59e0b', desc: 'Реши 50 тактических задач' },
    { title: 'Разговорчивый игрок', emoji: '💬', progress: 2, total: 5, reward: '💬 Стикер-пак', days: 12, color: '#8b5cf6', desc: 'Напиши 5 комментариев в ленте' },
  ]

  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-4">🎪 Текущие ивенты</h3>
      <div className="space-y-3">
        {events.map(ev => (
          <div key={ev.title} className="rounded-2xl p-4 border border-white/8" style={{ background: `${ev.color}0f` }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ev.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{ev.title}</p>
                  <p className="text-white/40 text-xs">{ev.days} дн. осталось</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: `${ev.color}22`, color: ev.color }}>
                {Math.round(ev.progress / ev.total * 100)}%
              </span>
            </div>
            <p className="text-white/50 text-xs mb-3">{ev.desc}</p>
            <div className="bg-black/30 rounded-full h-2 overflow-hidden mb-1.5">
              <div className="h-full rounded-full progress-fill" style={{ width: `${ev.progress / ev.total * 100}%`, background: ev.color }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/30">{ev.progress} / {ev.total}</span>
              <span style={{ color: ev.color }}>{ev.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const RARITY = [
  { label: 'Обычный', color: '#94a3b8', chance: 35 },
  { label: 'Необычный', color: '#4ade80', chance: 25 },
  { label: 'Необычный★', color: '#86efac', chance: 20 },
  { label: 'Редкий', color: '#60a5fa', chance: 12 },
  { label: 'Эпический', color: '#a78bfa', chance: 6 },
  { label: 'Легендарный', color: '#fb923c', chance: 2 },
]

function GachaModal({ coins, spinning, result, onSpin }: { coins: number; spinning: boolean; result: string | null; onSpin: () => void }) {
  const resultEmoji = result?.split(' ')[0]
  const rarityForResult = result?.includes('Огненный') ? RARITY[5] : result?.includes('Космическая') ? RARITY[4] : result?.includes('Корона') ? RARITY[3] : RARITY[1]

  return (
    <div>
      <h3 className="text-white font-bold text-xl mb-1">🎰 Гадание</h3>
      <p className="text-white/40 text-sm mb-5">50 монет за крутку · Гарантированный предмет</p>

      <div className="flex justify-center mb-5">
        <div className={`relative w-36 h-36 rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center border-2 border-white/20 shadow-2xl shadow-purple-500/40 ${spinning ? 'animate-gacha' : ''}`}>
          <div className="absolute inset-1 rounded-[20px] bg-black/30 flex items-center justify-center">
            <span className="text-6xl">
              {spinning ? '🌀' : result ? resultEmoji : '🎁'}
            </span>
          </div>
        </div>
      </div>

      {result && !spinning && (
        <div className="mb-4 rounded-2xl p-4 text-center animate-pop border"
          style={{ background: `${rarityForResult.color}18`, borderColor: `${rarityForResult.color}40` }}>
          <p className="text-xs mb-1" style={{ color: rarityForResult.color }}>{rarityForResult.label.toUpperCase()}</p>
          <p className="text-white font-bold text-lg">{result}</p>
          <p className="text-white/40 text-xs mt-1">Добавлено в коллекцию!</p>
        </div>
      )}

      <button onClick={onSpin} disabled={spinning || coins < 50}
        className="btn-primary w-full mb-5 disabled:opacity-40 disabled:cursor-not-allowed">
        {spinning ? '🌀 Крутим...' : `🎰 Крутить — 50 🪙  (у тебя: ${coins})`}
      </button>

      <div className="grid grid-cols-3 gap-1.5">
        {RARITY.map(r => (
          <div key={r.label} className="rounded-xl p-2 text-center" style={{ background: `${r.color}11`, border: `1px solid ${r.color}33` }}>
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: r.color, boxShadow: `0 0 6px ${r.color}88` }} />
            <p className="text-xs leading-tight" style={{ color: r.color }}>{r.label}</p>
            <p className="font-bold text-xs text-white/80">{r.chance}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}
