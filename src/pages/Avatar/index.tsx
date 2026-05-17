import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SHOP_ITEMS, AVATAR_OPTIONS } from '../../data/content'

type Tab = 'editor' | 'shop' | 'friends'

export default function Avatar() {
  const [tab, setTab] = useState<Tab>('editor')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'editor', label: 'Аватар', icon: '🎭' },
    { id: 'shop', label: 'Магазин', icon: '🛒' },
    { id: 'friends', label: 'Друзья', icon: '👥' },
  ]

  return (
    <div className="page-content">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-white text-xl font-bold mb-3">Мой профиль</h2>
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

      {tab === 'editor' && <EditorTab />}
      {tab === 'shop' && <ShopTab />}
      {tab === 'friends' && <FriendsTab />}
    </div>
  )
}

function EditorTab() {
  const { user, updateUser } = useApp()
  const [category, setCategory] = useState<'faces' | 'hairs' | 'outfits' | 'accessories'>('faces')
  const [preview, setPreview] = useState({ ...user.avatar })

  const categories: { id: typeof category; label: string; icon: string }[] = [
    { id: 'faces', label: 'Лицо', icon: '😊' },
    { id: 'hairs', label: 'Волосы', icon: '💇' },
    { id: 'outfits', label: 'Одежда', icon: '👕' },
    { id: 'accessories', label: 'Аксессуары', icon: '🎩' },
  ]

  const save = () => {
    updateUser({ avatar: preview })
  }

  const levelLabels: Record<string, string> = {
    beginner: 'Новичок 🌱',
    player: 'Игрок ♟️',
    pro: 'Профи ⚡',
    expert: 'Эксперт 🏆',
  }

  return (
    <div className="px-4 pb-4">
      {/* Avatar preview */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-green-500/40 flex items-center justify-center text-6xl shadow-xl shadow-green-500/10">
            {preview.face === 'face1' ? '😊' :
             preview.face === 'face2' ? '😎' :
             preview.face === 'face3' ? '🧐' :
             preview.face || AVATAR_OPTIONS.faces[0]}
          </div>
          {/* Accessory overlay */}
          {preview.accessory !== 'none' && preview.accessory && (
            <div className="absolute -top-3 -right-3 text-2xl">{preview.accessory}</div>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-white font-bold text-lg">{user.nickname || 'Игрок'}</p>
          <p className="text-white/50 text-sm">{user.country}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
              {levelLabels[user.level]}
            </span>
            <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">
              ⚡ {user.xp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Победы', value: '47', icon: '🏆' },
          { label: 'Страйк', value: `${user.streak}`, icon: '🔥' },
          { label: 'Рейтинг', value: `#${user.rank}`, icon: '📊' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xl">{s.icon}</p>
            <p className="text-white font-bold">{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category selector */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              category === cat.id
                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {AVATAR_OPTIONS[category].map((item, i) => {
          const isSelected = (
            (category === 'faces' && (preview.face === `face${i + 1}` || preview.face === item)) ||
            (category === 'hairs' && (preview.hair === `hair${i + 1}` || preview.hair === item)) ||
            (category === 'outfits' && (preview.outfit === `outfit${i + 1}` || preview.outfit === item)) ||
            (category === 'accessories' && preview.accessory === item)
          )

          return (
            <button
              key={i}
              onClick={() => {
                const key = category.slice(0, -1) as 'face' | 'hair' | 'outfit' | 'accessory'
                setPreview(p => ({ ...p, [key]: item }))
              }}
              className={`avatar-item h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${
                isSelected
                  ? 'bg-green-500/20 border-green-500/50 scale-110'
                  : 'bg-white/5 border-transparent hover:border-white/20'
              }`}
            >
              {item === 'none' ? '❌' : item}
            </button>
          )
        })}
      </div>

      <button className="btn-primary w-full" onClick={save}>
        💾 Сохранить аватар
      </button>
    </div>
  )
}

function ShopTab() {
  const { user, updateUser, addNotification } = useApp()
  const [bought, setBought] = useState<number[]>([])

  const buy = (item: typeof SHOP_ITEMS[0]) => {
    if (bought.includes(item.id)) return
    if (user.coins < item.price) {
      addNotification(`Недостаточно монет! Нужно ${item.price} 🪙`)
      return
    }
    updateUser({ coins: user.coins - item.price })
    setBought(prev => [...prev, item.id])
    addNotification(`Куплено: ${item.name} ${item.icon}! 🎉`)
  }

  const rarityColors: Record<string, string> = {
    uncommon: '#4ade80',
    rare: '#60a5fa',
    epic: '#a78bfa',
    legendary: '#fb923c',
  }

  const rarityLabels: Record<string, string> = {
    uncommon: 'Необычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/60 text-sm">Твои монеты:</p>
        <span className="text-yellow-400 font-bold">{user.coins} 🪙</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SHOP_ITEMS.map(item => {
          const color = rarityColors[item.rarity]
          const isBought = bought.includes(item.id)

          return (
            <div
              key={item.id}
              className="rounded-2xl p-4 border transition-all"
              style={{ background: `${color}11`, borderColor: `${color}33` }}
            >
              <div className="text-4xl text-center mb-2">{item.icon}</div>
              <p className="text-white font-semibold text-sm text-center">{item.name}</p>
              <p className="text-center text-xs mt-0.5 mb-3" style={{ color }}>{rarityLabels[item.rarity]}</p>
              <button
                onClick={() => buy(item)}
                disabled={isBought}
                className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${
                  isBought
                    ? 'bg-green-500/15 text-green-400 cursor-default'
                    : user.coins >= item.price
                    ? 'text-white hover:opacity-90'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                style={!isBought && user.coins >= item.price ? { background: color } : {}}
              >
                {isBought ? '✓ Куплено' : `${item.price} 🪙`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FRIENDS_DATA = [
  { id: 1, name: 'AlexK_99', country: '🇰🇿', avatar: '🦁', bg: '#f59e0b', xp: 3400, online: true, streak: 12 },
  { id: 2, name: 'Maria_Chess', country: '🇷🇺', avatar: '🦊', bg: '#ef4444', xp: 2800, online: false, streak: 5 },
  { id: 3, name: 'DimaN_Pro', country: '🇺🇦', avatar: '🐺', bg: '#8b5cf6', xp: 5600, online: true, streak: 28 },
  { id: 4, name: 'SaraPlay', country: '🇩🇪', avatar: '🦋', bg: '#06b6d4', xp: 1900, online: false, streak: 3 },
]

function FriendsTab() {
  const [search, setSearch] = useState('')
  const filtered = FRIENDS_DATA.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 pb-4">
      <input
        className="app-input mb-4"
        placeholder="🔍 Найти друга..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="space-y-2">
        {filtered.map(f => (
          <div key={f.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: f.bg }}>
                {f.avatar}
              </div>
              {f.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="text-white font-semibold text-sm">{f.name}</p>
                <span>{f.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400 text-xs">{f.xp.toLocaleString()} XP</span>
                <span className="text-orange-400 text-xs">🔥 {f.streak}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center text-sm hover:bg-blue-500/25 transition">
                💬
              </button>
              <button className="w-9 h-9 rounded-xl bg-green-500/15 text-green-400 flex items-center justify-center text-sm hover:bg-green-500/25 transition">
                ⚔️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
        <p className="text-white/40 text-sm mb-2">Пригласи друзей и получи бонус!</p>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 mb-3">
          <span className="text-green-400 font-mono font-bold text-lg">ALEX7F4K</span>
        </div>
        <button className="btn-primary w-full py-2.5 text-sm">
          📤 Поделиться кодом
        </button>
      </div>
    </div>
  )
}
