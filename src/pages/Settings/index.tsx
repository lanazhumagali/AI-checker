import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { COUNTRIES } from '../../data/content'

export default function Settings() {
  const { user, updateUser, setIsOnboarded, addNotification } = useApp()
  const [section, setSection] = useState<null | 'profile' | 'theme' | 'subscription' | 'notifications'>(null)
  const [notifications, setNotifications] = useState({
    streak: true,
    tasks: true,
    events: true,
    friends: true,
    tournaments: false,
    messages: true,
  })

  const save = (partial: Parameters<typeof updateUser>[0]) => {
    updateUser(partial)
    addNotification('Изменения сохранены ✓')
  }

  const logout = () => {
    setIsOnboarded(false)
  }

  const menuItems = [
    { id: 'profile', icon: '👤', label: 'Личная информация', desc: `${user.name || 'Не указано'} · ${user.country}` },
    { id: 'theme', icon: '🎨', label: 'Тема приложения', desc: user.theme === 'dark' ? 'Тёмная тема' : 'Светлая тема' },
    { id: 'subscription', icon: '⭐', label: 'Подписка', desc: user.subscription === 'free' ? 'Бесплатный план' : user.subscription === 'personal' ? 'Personal $10/мес' : 'Family $20/мес' },
    { id: 'notifications', icon: '🔔', label: 'Уведомления', desc: 'Управление уведомлениями' },
  ]

  if (section === 'profile') return <ProfileSection user={user} onSave={save} onBack={() => setSection(null)} />
  if (section === 'theme') return <ThemeSection user={user} onSave={save} onBack={() => setSection(null)} />
  if (section === 'subscription') return <SubscriptionSection user={user} onSave={save} onBack={() => setSection(null)} addNotification={addNotification} />
  if (section === 'notifications') return <NotificationsSection notifications={notifications} setNotifications={setNotifications} onBack={() => setSection(null)} />

  return (
    <div className="page-content px-4 pt-4 pb-4">
      <h2 className="text-white text-xl font-bold mb-4">Настройки</h2>

      {/* Profile preview */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center text-3xl">🚀</div>
        <div className="flex-1">
          <p className="text-white font-bold text-base">{user.name || 'Игрок'}</p>
          <p className="text-white/50 text-sm">@{user.nickname || 'player'} · {user.country}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-green-500/15 text-green-400 text-xs px-2 py-0.5 rounded-full capitalize">{user.level}</span>
            {user.childMode && <span className="bg-yellow-500/15 text-yellow-400 text-xs px-2 py-0.5 rounded-full">👶 Детский режим</span>}
          </div>
        </div>
        <span className="text-white/30">✏️</span>
      </div>

      {/* Menu items */}
      <div className="space-y-2 mb-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setSection(item.id as any)}
            className="w-full bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-4 flex items-center gap-3 transition text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">{item.icon}</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-white/40 text-xs">{item.desc}</p>
            </div>
            <span className="text-white/20">›</span>
          </button>
        ))}
      </div>

      {/* Extra links */}
      <div className="space-y-2 mb-6">
        {[
          { icon: '🏆', label: 'Турниры', badge: '1 активный' },
          { icon: '🤝', label: 'Клубы', badge: '' },
          { icon: '📰', label: 'Новости', badge: 'Новое!' },
          { icon: '💬', label: 'Форумы', badge: '' },
        ].map(item => (
          <div key={item.label} className="bg-white/3 border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <span>{item.icon}</span>
            <span className="text-white/60 text-sm flex-1">{item.label}</span>
            {item.badge && <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>}
            <span className="text-white/20">›</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl py-3 font-semibold hover:bg-red-500/20 transition"
      >
        🚪 Выйти из аккаунта
      </button>

      <p className="text-center text-white/20 text-xs mt-4">CheckersAI v1.0.0 · 💚 10% дохода на благотворительность</p>
    </div>
  )
}

function ProfileSection({ user, onSave, onBack }: {
  user: ReturnType<typeof useApp>['user']
  onSave: (p: any) => void
  onBack: () => void
}) {
  const [form, setForm] = useState({
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    country: user.country,
  })

  return (
    <div className="page-content px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <h2 className="text-white text-xl font-bold">Личная информация</h2>
      </div>

      <div className="space-y-4">
        {[
          { key: 'name', label: 'Имя', placeholder: 'Алексей' },
          { key: 'nickname', label: 'Никнейм', placeholder: 'alex_99' },
          { key: 'email', label: 'Email', placeholder: 'email@mail.com' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-white/60 text-sm mb-1 block">{field.label}</label>
            <input
              className="app-input"
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
            />
          </div>
        ))}

        <div>
          <label className="text-white/60 text-sm mb-1 block">Страна</label>
          <select
            className="app-input"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
          >
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <button className="btn-primary w-full mt-6" onClick={() => { onSave(form); onBack() }}>
        Сохранить изменения
      </button>
    </div>
  )
}

const ACCENT_COLORS = [
  { color: '#22c55e', name: 'Зелёный' },
  { color: '#3b82f6', name: 'Синий' },
  { color: '#8b5cf6', name: 'Фиолетовый' },
  { color: '#f59e0b', name: 'Золотой' },
  { color: '#ef4444', name: 'Красный' },
  { color: '#06b6d4', name: 'Бирюзовый' },
  { color: '#ec4899', name: 'Розовый' },
  { color: '#f97316', name: 'Оранжевый' },
]

function ThemeSection({ user, onSave, onBack }: {
  user: ReturnType<typeof useApp>['user']
  onSave: (p: any) => void
  onBack: () => void
}) {
  const [theme, setTheme] = useState(user.theme)
  const [accent, setAccent] = useState(user.accentColor)

  return (
    <div className="page-content px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <h2 className="text-white text-xl font-bold">Тема</h2>
      </div>

      <p className="text-white/60 text-sm mb-3">Тема приложения</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {([
          { id: 'dark', label: 'Тёмная', icon: '🌙', preview: 'bg-slate-900' },
          { id: 'light', label: 'Светлая', icon: '☀️', preview: 'bg-gray-100' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`rounded-2xl p-4 border-2 transition flex flex-col items-center gap-2 ${
              theme === t.id ? 'border-green-500/60 bg-green-500/10' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className={`w-full h-16 ${t.preview} rounded-xl`} />
            <div className="flex items-center gap-1">
              <span>{t.icon}</span>
              <span className={`font-semibold text-sm ${theme === t.id ? 'text-green-400' : 'text-white/70'}`}>{t.label}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-white/60 text-sm mb-3">Акцентный цвет</p>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ACCENT_COLORS.map(c => (
          <button
            key={c.color}
            onClick={() => setAccent(c.color)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition border ${
              accent === c.color ? 'border-white/60 bg-white/10' : 'border-transparent'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl shadow-lg"
              style={{ background: c.color, boxShadow: accent === c.color ? `0 0 12px ${c.color}88` : undefined }}
            />
            <span className="text-white/50 text-xs">{c.name}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary w-full" onClick={() => { onSave({ theme, accentColor: accent }); onBack() }}>
        Применить тему
      </button>
    </div>
  )
}

function SubscriptionSection({ user, onSave, onBack, addNotification }: {
  user: ReturnType<typeof useApp>['user']
  onSave: (p: any) => void
  onBack: () => void
  addNotification: (msg: string) => void
}) {
  const plans = [
    {
      id: 'free',
      name: 'Бесплатный',
      price: '$0',
      color: '#64748b',
      features: ['Базовые уроки', 'Онлайн игры', 'ИИ-бот (Нормальный уровень)', '3 задачи в день'],
    },
    {
      id: 'personal',
      name: 'Personal',
      price: '$10/мес',
      color: '#22c55e',
      badge: '⭐ Популярный',
      features: ['Всё из бесплатного', 'Расширенный ИИ-анализ', 'Все ИИ-персонажи', 'Безлимитные задачи', 'Эксклюзивные тренеры'],
    },
    {
      id: 'family',
      name: 'Family',
      price: '$20/мес',
      color: '#f59e0b',
      badge: '👨‍👩‍👧‍👦 Семья',
      features: ['Всё из Personal', 'До 5 аккаунтов', 'Семейный турнир', 'Общий прогресс', 'Дополнительные монеты'],
    },
  ]

  return (
    <div className="page-content px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <h2 className="text-white text-xl font-bold">Подписка</h2>
      </div>

      <div className="space-y-3">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`rounded-2xl p-4 border-2 transition ${
              user.subscription === plan.id ? 'scale-[1.02]' : ''
            }`}
            style={{
              borderColor: user.subscription === plan.id ? plan.color : 'rgba(255,255,255,0.1)',
              background: user.subscription === plan.id ? `${plan.color}11` : 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">{plan.name}</p>
                  {plan.badge && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${plan.color}22`, color: plan.color }}>{plan.badge}</span>}
                </div>
                <p className="font-bold text-lg" style={{ color: plan.color }}>{plan.price}</p>
              </div>
              {user.subscription === plan.id && (
                <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: `${plan.color}22`, color: plan.color }}>
                  ✓ Активен
                </span>
              )}
            </div>

            <ul className="space-y-1 mb-3">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <span style={{ color: plan.color }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {user.subscription !== plan.id && (
              <button
                className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
                style={{ background: plan.color }}
                onClick={() => {
                  onSave({ subscription: plan.id })
                  addNotification(`Подписка ${plan.name} активирована! 🎉`)
                  onBack()
                }}
              >
                {plan.id === 'free' ? 'Выбрать' : `Оформить — ${plan.price}`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsSection({ notifications, setNotifications, onBack }: {
  notifications: Record<string, boolean>
  setNotifications: (n: any) => void
  onBack: () => void
}) {
  const items = [
    { key: 'streak', label: 'Страйки', desc: 'Напоминание зайти в приложение', icon: '🔥' },
    { key: 'tasks', label: 'Задания', desc: 'Ежедневные и еженедельные задания', icon: '📋' },
    { key: 'events', label: 'Ивенты', desc: 'Новые события и турниры', icon: '🎪' },
    { key: 'friends', label: 'Друзья', desc: 'Запросы в друзья и активность', icon: '👥' },
    { key: 'tournaments', label: 'Турниры', desc: 'Начало и результаты турниров', icon: '🏆' },
    { key: 'messages', label: 'Сообщения', desc: 'Новые сообщения от друзей', icon: '💬' },
  ]

  return (
    <div className="page-content px-4 pt-4 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">←</button>
        <h2 className="text-white text-xl font-bold">Уведомления</h2>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.key} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{item.label}</p>
              <p className="text-white/40 text-xs">{item.desc}</p>
            </div>
            <button
              onClick={() => setNotifications((prev: any) => ({ ...prev, [item.key]: !prev[item.key] }))}
              className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key] ? 'bg-green-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notifications[item.key] ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
