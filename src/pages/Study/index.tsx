import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { LESSONS, FLASHCARDS } from '../../data/content'

type Tab = 'lessons' | 'flashcards' | 'chat'

export default function Study() {
  const [tab, setTab] = useState<Tab>('lessons')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'lessons', label: 'Уроки', icon: '📖' },
    { id: 'flashcards', label: 'Флэшкарты', icon: '🗂️' },
    { id: 'chat', label: 'ИИ-Тренер', icon: '🤖' },
  ]

  return (
    <div className="page-content">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-white text-xl font-bold mb-3">Обучение</h2>
        <div className="flex gap-1 bg-white/5 rounded-2xl p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id ? 'bg-green-500 text-white shadow' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'lessons' && <LessonsTab />}
      {tab === 'flashcards' && <FlashcardsTab />}
      {tab === 'chat' && <ChatTab />}
    </div>
  )
}

function LessonsTab() {
  const { updateUser, user, addNotification } = useApp()
  const [activeLesson, setActiveLesson] = useState<number | null>(null)

  const startLesson = (id: number) => {
    setActiveLesson(id)
  }

  const finishLesson = (lesson: typeof LESSONS[0]) => {
    updateUser({ xp: user.xp + lesson.xp })
    addNotification(`Урок "${lesson.title}" пройден! +${lesson.xp} XP 🎓`)
    setActiveLesson(null)
  }

  if (activeLesson !== null) {
    const lesson = LESSONS.find(l => l.id === activeLesson)!
    return <LessonPlayer lesson={lesson} onFinish={() => finishLesson(lesson)} onBack={() => setActiveLesson(null)} />
  }

  return (
    <div className="px-4 space-y-3 pb-4">
      {LESSONS.map(lesson => (
        <button
          key={lesson.id}
          onClick={() => !lesson.locked && startLesson(lesson.id)}
          disabled={lesson.locked}
          className={`w-full text-left rounded-2xl p-4 border transition-all ${
            lesson.locked
              ? 'bg-white/3 border-white/5 opacity-50 cursor-not-allowed'
              : 'bg-white/5 border-white/10 hover:border-green-500/40 hover:bg-green-500/5 active:scale-[0.99]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${lesson.locked ? 'bg-white/5' : 'bg-green-500/15'}`}>
              {lesson.locked ? '🔒' : lesson.icon}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{lesson.title}</p>
              <p className="text-white/50 text-xs mt-0.5">{lesson.description}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/30 text-xs">⏱️ {lesson.duration}</span>
                <span className="text-purple-400 text-xs font-medium">+{lesson.xp} XP</span>
              </div>
            </div>
            {!lesson.locked && <span className="text-green-400 text-xl">→</span>}
          </div>
        </button>
      ))}
    </div>
  )
}

const LESSON_CONTENT: Record<number, { slides: { title: string; content: string; visual?: string }[] }> = {
  1: {
    slides: [
      { title: 'Цель игры', content: 'Захвати или заблокируй все шашки противника. Игра ведётся на чёрных клетках доски 8×8.', visual: '♟️' },
      { title: 'Как ходят шашки', content: 'Шашка ходит по диагонали вперёд на одну клетку. Ход только на свободные тёмные клетки.', visual: '↗️' },
      { title: 'Взятие шашки', content: 'Если за шашкой противника есть свободное поле — ты обязан её взять. Через прыжок по диагонали.', visual: '💥' },
      { title: 'Дамка', content: 'Дошла до последнего ряда — стала дамкой! Ходит на любое расстояние по диагонали в любую сторону.', visual: '👑' },
    ],
  },
  2: {
    slides: [
      { title: 'Центр — ключ к победе', content: 'Центральные поля (d4, e4, d5, e5) дают максимальный контроль над доской. Занимай их первым!', visual: '🎯' },
      { title: 'Почему центр важен', content: 'С центральной позиции шашка атакует больше клеток, чем с края. Это как командная высота в стратегии.', visual: '🗺️' },
      { title: 'Практика', content: 'В дебюте старайся занять хотя бы 2-3 центральных поля. Не увлекайся краями без причины.', visual: '♟️' },
    ],
  },
  3: {
    slides: [
      { title: 'Дебют "Косяк"', content: 'Быстрое развитие в центр. Шашки выходят на e3-d4 создавая мощную базу. Популярен среди профессионалов.', visual: '🕵️' },
      { title: 'Дебютные ловушки', content: 'Следи за симметричными ходами противника — он может заманить тебя в ловушку уже на 5-м ходу!', visual: '🪤' },
      { title: 'Принцип дебюта', content: '1. Занимай центр 2. Не ходи одной шашкой дважды 3. Не открывай фланги без причины', visual: '📋' },
    ],
  },
}

function LessonPlayer({ lesson, onFinish, onBack }: {
  lesson: typeof LESSONS[0]
  onFinish: () => void
  onBack: () => void
}) {
  const [slide, setSlide] = useState(0)
  const content = LESSON_CONTENT[lesson.id]
  const slides = content?.slides || [{ title: lesson.title, content: lesson.description, visual: lesson.icon }]
  const current = slides[slide]
  const isLast = slide === slides.length - 1

  return (
    <div className="px-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <div className="flex-1">
          <p className="text-white font-bold text-sm">{lesson.title}</p>
          <p className="text-white/40 text-xs">{slide + 1} из {slides.length}</p>
        </div>
        <span className="text-purple-400 text-xs font-bold">+{lesson.xp} XP</span>
      </div>

      <div className="bg-white/5 rounded-full h-1.5 mb-6 overflow-hidden">
        <div className="bg-green-500 h-full rounded-full progress-fill" style={{ width: `${((slide + 1) / slides.length) * 100}%` }} />
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 text-center min-h-[200px] flex flex-col items-center justify-center border border-white/5">
        <div className="text-6xl mb-4">{current.visual}</div>
        <h3 className="text-white text-xl font-bold mb-3">{current.title}</h3>
        <p className="text-white/60 text-sm leading-relaxed">{current.content}</p>
      </div>

      {!isLast ? (
        <button className="btn-primary w-full" onClick={() => setSlide(s => s + 1)}>
          Далее →
        </button>
      ) : (
        <button className="btn-primary w-full" onClick={onFinish}>
          🎉 Завершить урок (+{lesson.xp} XP)
        </button>
      )}

      {slide > 0 && (
        <button className="btn-secondary w-full mt-2" onClick={() => setSlide(s => s - 1)}>
          ← Назад
        </button>
      )}
    </div>
  )
}

function FlashcardsTab() {
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<number[]>([])
  const [unknown, setUnknown] = useState<number[]>([])
  const card = FLASHCARDS[current]

  const next = (isKnown: boolean) => {
    if (isKnown) setKnown(p => [...p, current])
    else setUnknown(p => [...p, current])
    setFlipped(false)
    setTimeout(() => {
      if (current < FLASHCARDS.length - 1) setCurrent(c => c + 1)
      else setCurrent(0)
    }, 200)
  }

  const progress = ((known.length + unknown.length) / FLASHCARDS.length) * 100

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/60 text-sm">{current + 1} / {FLASHCARDS.length} карточек</p>
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-sm">✓ {known.length}</span>
          <span className="text-red-400 text-sm">✗ {unknown.length}</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-full h-1.5 mb-4 overflow-hidden">
        <div className="bg-green-500 h-full rounded-full progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Category badge */}
      <div className="flex justify-center mb-3">
        <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full">
          {card.category}
        </span>
      </div>

      {/* Card */}
      <div className="flashcard h-48 mb-4 cursor-pointer" onClick={() => setFlipped(f => !f)}>
        <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
          <div className="flashcard-front bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-white/40 text-xs mb-3">Вопрос · нажми чтобы увидеть ответ</p>
            <p className="text-white font-bold text-lg">{card.front}</p>
          </div>
          <div className="flashcard-back bg-gradient-to-br from-green-900 to-emerald-900 border border-green-500/30 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-green-400/60 text-xs mb-3">Ответ</p>
            <p className="text-white text-sm leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => next(false)}
            className="bg-red-500/15 border border-red-500/30 text-red-400 rounded-2xl py-3 font-semibold transition hover:bg-red-500/25"
          >
            ✗ Не знал
          </button>
          <button
            onClick={() => next(true)}
            className="bg-green-500/15 border border-green-500/30 text-green-400 rounded-2xl py-3 font-semibold transition hover:bg-green-500/25"
          >
            ✓ Знал
          </button>
        </div>
      )}

      {!flipped && (
        <button onClick={() => setFlipped(true)} className="btn-primary w-full">
          Показать ответ
        </button>
      )}
    </div>
  )
}

export function ChatTab() {
  const { user } = useApp()
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Привет${user.name ? `, ${user.name}` : ''}! 👋 Я твой персональный ИИ-тренер по шашкам. ${
        user.books.includes('Harry Potter')
          ? 'Как настоящий волшебник из Хогвартса, ты будешь осваивать магию шашечной стратегии!'
          : user.country === 'Brazil'
          ? 'Ты знал, что в Бразилии шашки очень популярны в школах как тренировка логики? Давай начнём!'
          : 'Спрашивай меня о дебютах, тактике, ошибках — я помогу!'
      }`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const AI_RESPONSES: Record<string, string> = {
    default: 'Отличный вопрос! В шашках главное — контроль центра и активная игра. Чем конкретнее вопрос — тем точнее совет!',
    дебют: 'Дебют определяет всю игру. Главный принцип: занимай центр (поля d4, e5), не ходи одной фигурой дважды и не открывай фланги без причины.',
    тактик: 'Тактика — это конкретные комбинации. Ищи возможности для двойного удара, когда одним прыжком можно взять 2+ шашки.',
    ошибк: 'Типичные ошибки новичков: 1) Пренебрежение центром, 2) Торопливые атаки, 3) Забывают о дамочных полях противника.',
    эндшпиль: 'В эндшпиле дамки решают всё. Стремись превратить максимум шашек в дамки и контролируй ключевые диагонали.',
    совет: 'Мой совет: играй каждый день хотя бы 1-2 партии. Анализируй ошибки после каждой игры — прогресс будет заметен уже через неделю!',
    привет: `Привет! Рад видеть тебя снова${user.name ? `, ${user.name}` : ''}! 😊 Чем могу помочь сегодня?`,
  }

  const send = () => {
    if (!input.trim() || loading) return
    const userMsg = input
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text: userMsg }])
    setLoading(true)

    setTimeout(() => {
      const lower = userMsg.toLowerCase()
      let response = AI_RESPONSES.default
      for (const [key, resp] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(key)) { response = resp; break }
      }
      setMessages(prev => [...prev, { from: 'ai', text: response }])
      setLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const suggestions = ['Объясни дебюты', 'Типичные ошибки', 'Совет на сегодня', 'Что такое эндшпиль?']

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
            {msg.from === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm shrink-0">🤖</div>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.from === 'user'
                ? 'bg-green-600 text-white rounded-br-sm'
                : 'bg-white/8 text-white/90 rounded-bl-sm border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-white/8 border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => { setInput(s); }}
            className="shrink-0 bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full hover:bg-white/10 transition"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <input
          className="app-input flex-1"
          placeholder="Спроси тренера..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="btn-primary px-4 py-3 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  )
}
