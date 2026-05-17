import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { POPULAR_BOOKS, POPULAR_MOVIES, MUSIC_GENRES, COUNTRIES } from '../../data/content'

type Step = 'welcome' | 'register' | 'books' | 'movies' | 'music' | 'level' | 'childmode' | 'done'

const STEPS: Step[] = ['welcome', 'register', 'books', 'movies', 'music', 'level', 'childmode', 'done']

export default function Onboarding() {
  const { updateUser, setIsOnboarded } = useApp()
  const [step, setStep] = useState<Step>('welcome')
  const [form, setForm] = useState({
    name: '', nickname: '', email: '', password: '', country: 'Kazakhstan', age: '',
  })
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [selectedMovies, setSelectedMovies] = useState<string[]>([])
  const [selectedMusic, setSelectedMusic] = useState<string[]>([])
  const [level, setLevel] = useState<'beginner' | 'player' | 'pro' | 'expert'>('beginner')
  const [childMode, setChildMode] = useState(false)
  const [testStep, setTestStep] = useState(0)
  const [testScore, setTestScore] = useState(0)

  const stepIndex = STEPS.indexOf(step)

  const next = (s?: Step) => setStep(s || STEPS[stepIndex + 1])

  const toggle = (arr: string[], item: string, setArr: (a: string[]) => void) => {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  const finish = () => {
    updateUser({
      name: form.name || 'Игрок',
      nickname: form.nickname || 'player_1',
      email: form.email,
      country: form.country,
      age: form.age,
      books: selectedBooks,
      movies: selectedMovies,
      musicGenres: selectedMusic,
      level,
      childMode,
    })
    setIsOnboarded(true)
  }

  const bgClass = childMode
    ? 'min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100'
    : 'min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'

  return (
    <div className={`${bgClass} flex flex-col`}>
      {/* Progress dots */}
      {step !== 'welcome' && step !== 'done' && (
        <div className="flex items-center justify-center gap-2 pt-4 px-6">
          {STEPS.slice(1, -1).map((s, i) => (
            <div
              key={s}
              className={`step-dot ${i === stepIndex - 1 ? 'active' : ''}`}
              style={{ background: i < stepIndex - 1 ? (childMode ? '#22c55e' : '#22c55e') : undefined }}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 py-6">
        {step === 'welcome' && <WelcomeStep onNext={() => next()} childMode={childMode} />}
        {step === 'register' && (
          <RegisterStep
            form={form}
            onChange={(k, v) => setForm(f => ({ ...f, [k]: v }))}
            onNext={() => next()}
            childMode={childMode}
          />
        )}
        {step === 'books' && (
          <SelectionStep
            title="Твои любимые книги"
            subtitle="ИИ-тренер будет делать отсылки к твоим любимым книгам 📚"
            emoji="📚"
            items={POPULAR_BOOKS}
            selected={selectedBooks}
            onToggle={item => toggle(selectedBooks, item, setSelectedBooks)}
            onNext={() => next()}
            onSkip={() => next()}
            childMode={childMode}
            maxSelect={5}
          />
        )}
        {step === 'movies' && (
          <SelectionStep
            title="Любимые фильмы и сериалы"
            subtitle="Тренер будет мотивировать тебя через любимых персонажей 🎬"
            emoji="🎬"
            items={POPULAR_MOVIES}
            selected={selectedMovies}
            onToggle={item => toggle(selectedMovies, item, setSelectedMovies)}
            onNext={() => next()}
            onSkip={() => next()}
            childMode={childMode}
            maxSelect={5}
          />
        )}
        {step === 'music' && (
          <SelectionStep
            title="Твои музыкальные вкусы"
            subtitle="Атмосфера и энергетика тренера адаптируется под тебя 🎵"
            emoji="🎵"
            items={MUSIC_GENRES}
            selected={selectedMusic}
            onToggle={item => toggle(selectedMusic, item, setSelectedMusic)}
            onNext={() => next()}
            onSkip={() => next()}
            childMode={childMode}
            maxSelect={3}
          />
        )}
        {step === 'level' && (
          <LevelStep
            level={level}
            setLevel={setLevel}
            testStep={testStep}
            onTestAnswer={(correct: boolean) => {
              if (correct) setTestScore(s => s + 1)
              if (testStep < 2) {
                setTestStep(s => s + 1)
              } else {
                const score = testScore + (correct ? 1 : 0)
                setLevel(score === 0 ? 'beginner' : score === 1 ? 'player' : score === 2 ? 'pro' : 'expert')
                next()
              }
            }}
            onNext={() => next()}
            childMode={childMode}
          />
        )}
        {step === 'childmode' && (
          <ChildModeStep
            childMode={childMode}
            setChildMode={setChildMode}
            onNext={() => next()}
          />
        )}
        {step === 'done' && (
          <DoneStep level={level} childMode={childMode} onFinish={finish} />
        )}
      </div>
    </div>
  )
}

function WelcomeStep({ onNext, childMode }: { onNext: () => void; childMode: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="text-8xl mb-6 animate-float">♟️</div>
      <h1 className={`text-4xl font-extrabold mb-3 ${childMode ? 'text-gray-800' : 'text-white'}`}>
        CheckersAI
      </h1>
      <p className={`text-lg mb-2 ${childMode ? 'text-gray-600' : 'text-green-400'} font-semibold`}>
        Шашки нового поколения
      </p>
      <p className={`text-sm mb-8 max-w-xs ${childMode ? 'text-gray-500' : 'text-white/50'}`}>
        Учись играть в шашки с персональным ИИ-тренером, который адаптируется под тебя
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
        {[
          { icon: '🤖', text: 'ИИ-тренер' },
          { icon: '🏆', text: 'Рейтинги' },
          { icon: '🎭', text: 'Персонажи' },
          { icon: '💚', text: 'Благотворительность' },
        ].map(item => (
          <div key={item.text} className={`rounded-2xl p-3 flex items-center gap-2 ${childMode ? 'bg-white shadow-md' : 'bg-white/5 border border-white/10'}`}>
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-sm font-medium ${childMode ? 'text-gray-700' : 'text-white/80'}`}>{item.text}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full max-w-xs text-lg py-4" onClick={onNext}>
        Начать — Бесплатно 🚀
      </button>
      <p className={`text-xs mt-3 ${childMode ? 'text-gray-400' : 'text-white/30'}`}>
        Регистрация занимает 2 минуты
      </p>
    </div>
  )
}

function RegisterStep({
  form, onChange, onNext, childMode
}: {
  form: Record<string, string>
  onChange: (k: string, v: string) => void
  onNext: () => void
  childMode: boolean
}) {
  const textClass = childMode ? 'text-gray-800' : 'text-white'
  const labelClass = childMode ? 'text-gray-600 text-sm mb-1 block' : 'text-white/60 text-sm mb-1 block'

  return (
    <div className="flex-1">
      <h2 className={`text-2xl font-bold mb-1 ${textClass}`}>Создай аккаунт</h2>
      <p className={childMode ? 'text-gray-500 text-sm mb-6' : 'text-white/40 text-sm mb-6'}>
        Начни свой путь к мастерству
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Имя</label>
            <input
              className="app-input"
              placeholder="Алексей"
              value={form.name}
              onChange={e => onChange('name', e.target.value)}
              style={childMode ? { background: 'white', color: '#1f2937', border: '2px solid #d1d5db' } : {}}
            />
          </div>
          <div>
            <label className={labelClass}>Никнейм</label>
            <input
              className="app-input"
              placeholder="alex_99"
              value={form.nickname}
              onChange={e => onChange('nickname', e.target.value)}
              style={childMode ? { background: 'white', color: '#1f2937', border: '2px solid #d1d5db' } : {}}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            className="app-input"
            type="email"
            placeholder="alex@mail.com"
            value={form.email}
            onChange={e => onChange('email', e.target.value)}
            style={childMode ? { background: 'white', color: '#1f2937', border: '2px solid #d1d5db' } : {}}
          />
        </div>

        <div>
          <label className={labelClass}>Пароль</label>
          <input
            className="app-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => onChange('password', e.target.value)}
            style={childMode ? { background: 'white', color: '#1f2937', border: '2px solid #d1d5db' } : {}}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Страна</label>
            <select
              className="app-input"
              value={form.country}
              onChange={e => onChange('country', e.target.value)}
              style={childMode ? { background: 'white', color: '#1f2937', border: '2px solid #d1d5db' } : {}}
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Возраст</label>
            <input
              className="app-input"
              type="number"
              placeholder="25"
              value={form.age}
              onChange={e => onChange('age', e.target.value)}
              style={childMode ? { background: 'white', color: '#1f2937', border: '2px solid #d1d5db' } : {}}
            />
          </div>
        </div>
      </div>

      <button className="btn-primary w-full mt-6" onClick={onNext}>
        Продолжить →
      </button>
    </div>
  )
}

function SelectionStep({
  title, subtitle, emoji, items, selected, onToggle, onNext, onSkip, childMode, maxSelect
}: {
  title: string
  subtitle: string
  emoji: string
  items: string[]
  selected: string[]
  onToggle: (item: string) => void
  onNext: () => void
  onSkip: () => void
  childMode: boolean
  maxSelect: number
}) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-5xl mb-3 text-center">{emoji}</div>
      <h2 className={`text-2xl font-bold mb-1 ${childMode ? 'text-gray-800' : 'text-white'}`}>{title}</h2>
      <p className={`text-sm mb-4 ${childMode ? 'text-gray-500' : 'text-white/40'}`}>{subtitle}</p>
      {selected.length > 0 && (
        <p className={`text-xs mb-3 ${childMode ? 'text-green-700' : 'text-green-400'}`}>
          Выбрано: {selected.length}/{maxSelect}
        </p>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-2 pb-4">
          {items.map(item => {
            const sel = selected.includes(item)
            return (
              <button
                key={item}
                onClick={() => (sel || selected.length < maxSelect) && onToggle(item)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                  sel
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : childMode
                    ? 'bg-white border-gray-200 text-gray-600 hover:border-green-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                } ${!sel && selected.length >= maxSelect ? 'opacity-40' : ''}`}
              >
                {sel ? '✓ ' : ''}{item}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="btn-secondary flex-1 py-3" onClick={onSkip}>
          Пропустить
        </button>
        <button className="btn-primary flex-1 py-3" onClick={onNext}>
          Далее →
        </button>
      </div>
    </div>
  )
}

const TEST_QUESTIONS = [
  {
    question: 'Как ходит шашка в начале игры?',
    options: ['По прямой', 'По диагонали вперёд', 'В любую сторону', 'Назад'],
    correct: 1,
  },
  {
    question: 'Что даёт дамка по сравнению с обычной шашкой?',
    options: ['Ничего особенного', 'Ходит на любое расстояние по диагонали', 'Ходит прямо', 'Бьёт все шашки рядом'],
    correct: 1,
  },
  {
    question: 'Когда шашка становится дамкой?',
    options: ['После 10 ходов', 'При достижении последнего ряда', 'При взятии 3 шашек', 'В конце партии'],
    correct: 1,
  },
]

function LevelStep({
  level, setLevel, testStep, onTestAnswer, onNext, childMode
}: {
  level: string
  setLevel: (l: 'beginner' | 'player' | 'pro' | 'expert') => void
  testStep: number
  onTestAnswer: (correct: boolean) => void
  onNext: () => void
  childMode: boolean
}) {
  const [mode, setMode] = useState<'choose' | 'test'>('choose')
  const levels = [
    { id: 'beginner', label: 'Новичок', emoji: '🌱', desc: 'Только начинаю' },
    { id: 'player', label: 'Игрок', emoji: '♟️', desc: 'Знаю основные правила' },
    { id: 'pro', label: 'Профи', emoji: '⚡', desc: 'Играю регулярно' },
    { id: 'expert', label: 'Эксперт', emoji: '🏆', desc: 'Участвую в турнирах' },
  ]

  const q = TEST_QUESTIONS[testStep]

  if (mode === 'test' && testStep < 3) {
    return (
      <div className="flex-1 flex flex-col">
        <div className={`text-sm mb-2 ${childMode ? 'text-gray-500' : 'text-white/40'}`}>
          Вопрос {testStep + 1} из 3
        </div>
        <div className="bg-white/5 rounded-2xl h-1.5 mb-6 overflow-hidden">
          <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${(testStep / 3) * 100}%` }} />
        </div>
        <h2 className={`text-xl font-bold mb-6 ${childMode ? 'text-gray-800' : 'text-white'}`}>{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onTestAnswer(i === q.correct)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                childMode
                  ? 'bg-white border-gray-200 text-gray-700 hover:border-green-400 hover:bg-green-50'
                  : 'bg-white/5 border-white/10 text-white hover:border-green-500/50 hover:bg-green-500/10'
              }`}
            >
              <span className="mr-2 text-white/40">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <h2 className={`text-2xl font-bold mb-1 ${childMode ? 'text-gray-800' : 'text-white'}`}>Твой уровень</h2>
      <p className={`text-sm mb-6 ${childMode ? 'text-gray-500' : 'text-white/40'}`}>
        Выбери сам или пройди быстрый тест
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {levels.map(l => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id as 'beginner' | 'player' | 'pro' | 'expert')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              level === l.id
                ? 'bg-green-500/20 border-green-500/60 text-green-400'
                : childMode
                ? 'bg-white border-gray-200 text-gray-600 hover:border-green-400'
                : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
            }`}
          >
            <div className="text-3xl mb-2">{l.emoji}</div>
            <div className="font-semibold text-sm">{l.label}</div>
            <div className={`text-xs mt-0.5 ${childMode ? 'text-gray-400' : 'text-white/40'}`}>{l.desc}</div>
          </button>
        ))}
      </div>

      <button
        className="btn-secondary w-full mb-3 py-3"
        onClick={() => setMode('test')}
      >
        🧪 Пройти тест вместо этого
      </button>
      <button className="btn-primary w-full py-3" onClick={onNext}>
        Готово →
      </button>
    </div>
  )
}

function ChildModeStep({
  childMode, setChildMode, onNext
}: {
  childMode: boolean
  setChildMode: (v: boolean) => void
  onNext: () => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-7xl mb-6 animate-bounce">👶</div>
      <h2 className="text-white text-2xl font-bold mb-2 text-center">Детский режим</h2>
      <p className="text-white/50 text-sm text-center mb-8 max-w-xs">
        Яркий интерфейс, более простые объяснения, больше похвалы и мотивации для юных игроков!
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => { setChildMode(true); onNext() }}
          className={`p-5 rounded-2xl border-2 text-center transition-all ${
            childMode
              ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
              : 'bg-white/5 border-white/10 text-white hover:border-yellow-400/50'
          }`}
        >
          <div className="text-4xl mb-2">🌈</div>
          <div className="font-bold text-lg">Включить</div>
          <div className="text-sm text-white/50">Для детей до 12 лет</div>
        </button>

        <button
          onClick={() => { setChildMode(false); onNext() }}
          className={`p-5 rounded-2xl border-2 text-center transition-all ${
            !childMode
              ? 'bg-green-500/20 border-green-500 text-green-400'
              : 'bg-white/5 border-white/10 text-white hover:border-green-500/50'
          }`}
        >
          <div className="text-4xl mb-2">♟️</div>
          <div className="font-bold text-lg">Обычный режим</div>
          <div className="text-sm text-white/50">Полный функционал</div>
        </button>
      </div>
    </div>
  )
}

function DoneStep({
  level, childMode, onFinish
}: {
  level: string
  childMode: boolean
  onFinish: () => void
}) {
  const levelEmojis: Record<string, string> = {
    beginner: '🌱',
    player: '♟️',
    pro: '⚡',
    expert: '🏆',
  }

  return (
    <div className={`flex-1 flex flex-col items-center justify-center text-center ${childMode ? 'child-mode p-6 rounded-2xl' : ''}`}>
      <div className="text-7xl mb-4 animate-bounce">🎉</div>
      <h2 className={`text-3xl font-extrabold mb-2 ${childMode ? 'text-gray-800' : 'text-white'}`}>
        Добро пожаловать!
      </h2>
      <p className={`mb-6 ${childMode ? 'text-gray-600' : 'text-white/60'}`}>
        Твой профиль создан. Готов начать путь к мастерству?
      </p>

      <div className={`rounded-2xl p-5 mb-6 w-full max-w-xs ${childMode ? 'bg-white shadow-lg' : 'bg-white/5 border border-white/10'}`}>
        <div className="text-5xl mb-3">{levelEmojis[level]}</div>
        <p className={`font-bold text-lg capitalize ${childMode ? 'text-gray-800' : 'text-white'}`}>
          Уровень: {level === 'beginner' ? 'Новичок' : level === 'player' ? 'Игрок' : level === 'pro' ? 'Профи' : 'Эксперт'}
        </p>
        {childMode && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span>🌈</span>
            <span className="text-gray-600 text-sm font-medium">Детский режим включён!</span>
          </div>
        )}
        <div className="flex justify-center gap-4 mt-3">
          <div className={`text-center ${childMode ? 'text-gray-600' : 'text-white/60'}`}>
            <div className="font-bold text-green-400">0</div>
            <div className="text-xs">XP</div>
          </div>
          <div className={`text-center ${childMode ? 'text-gray-600' : 'text-white/60'}`}>
            <div className="font-bold text-yellow-400">100</div>
            <div className="text-xs">🪙 Монет</div>
          </div>
          <div className={`text-center ${childMode ? 'text-gray-600' : 'text-white/60'}`}>
            <div className="font-bold text-orange-400">1</div>
            <div className="text-xs">🔥 Страйк</div>
          </div>
        </div>
      </div>

      <button className="btn-primary w-full max-w-xs text-lg py-4" onClick={onFinish}>
        🚀 Начать играть!
      </button>
    </div>
  )
}
