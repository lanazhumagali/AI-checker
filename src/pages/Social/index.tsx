import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SOCIAL_POSTS } from '../../data/content'

type Tab = 'feed' | 'chat' | 'matches'

export default function Social() {
  const [tab, setTab] = useState<Tab>('feed')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'feed', label: 'Лента', icon: '📰' },
    { id: 'chat', label: 'Чат', icon: '💬' },
    { id: 'matches', label: 'Матчи', icon: '🎮' },
  ]

  return (
    <div className="page-content">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-white text-xl font-bold mb-3">Сообщество</h2>
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

      {tab === 'feed' && <FeedTab />}
      {tab === 'chat' && <ChatTab />}
      {tab === 'matches' && <MatchesTab />}
    </div>
  )
}

function FeedTab() {
  const { user } = useApp()
  const [posts, setPosts] = useState(SOCIAL_POSTS)
  const [liked, setLiked] = useState<number[]>([])
  const [shareText, setShareText] = useState('')
  const [showShare, setShowShare] = useState(false)

  const toggleLike = (id: number) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, likes: p.likes + (liked.includes(id) ? -1 : 1) }
      : p
    ))
  }

  const submitPost = () => {
    if (!shareText.trim()) return
    const newPost = {
      id: Date.now(),
      user: user.nickname || 'Ты',
      country: '🇰🇿',
      avatar: '🚀',
      avatarBg: '#22c55e',
      time: 'только что',
      content: shareText,
      image: null as string | null,
      likes: 0,
      comments: 0,
      xpGained: 0,
      achievement: '',
    }
    setPosts(prev => [newPost, ...prev])
    setShareText('')
    setShowShare(false)
  }

  return (
    <div className="px-4 space-y-4 pb-4">
      {/* Create post */}
      <div
        className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:border-green-500/30 transition"
        onClick={() => setShowShare(true)}
      >
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-xl">🚀</div>
        <p className="text-white/40 text-sm flex-1">Поделись своими победами...</p>
        <span className="text-green-400 text-sm">📝</span>
      </div>

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center" onClick={() => setShowShare(false)}>
          <div className="w-full max-w-[430px] bg-slate-900 rounded-t-3xl p-6 border-t border-white/10" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-3">Поделиться</h3>
            <textarea
              className="app-input w-full min-h-[100px] resize-none text-sm mb-3"
              placeholder="Расскажи о своей игре, достижении или мысли..."
              value={shareText}
              onChange={e => setShareText(e.target.value)}
            />
            <div className="flex gap-2 mb-4">
              {['#победа', '#новыйранг', '#шашки', '#тренировка'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setShareText(p => p + ' ' + tag)}
                  className="bg-white/5 border border-white/10 text-white/50 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1 py-3" onClick={() => setShowShare(false)}>Отмена</button>
              <button className="btn-primary flex-1 py-3" onClick={submitPost}>Опубликовать 🚀</button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.map(post => (
        <div key={post.id} className="post-card p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl shrink-0" style={{ background: post.avatarBg }}>
              {post.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-sm">{post.user}</p>
                <span>{post.country}</span>
              </div>
              <p className="text-white/30 text-xs">{post.time}</p>
            </div>
            {post.achievement && (
              <span className="bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 text-xs px-2 py-1 rounded-full">
                {post.achievement}
              </span>
            )}
          </div>

          <p className="text-white/80 text-sm mb-3 leading-relaxed">{post.content}</p>

          {post.xpGained > 0 && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-2 mb-3 flex items-center gap-2">
              <span className="text-purple-400 text-xs font-bold">+{post.xpGained} XP</span>
              <span className="text-white/30 text-xs">получено</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1.5 text-sm transition-all ${liked.includes(post.id) ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
            >
              <span>{liked.includes(post.id) ? '❤️' : '🤍'}</span>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-white/40 hover:text-blue-400 text-sm transition">
              <span>💬</span>
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-white/40 hover:text-green-400 text-sm transition ml-auto">
              <span>↗️</span>
              <span className="text-xs">Поделиться</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChatTab() {
  const [activeChat, setActiveChat] = useState<string | null>('ai')
  const [messages, setMessages] = useState<Record<string, { from: string; text: string }[]>>({
    ai: [{ from: 'ai', text: 'Привет! Спрашивай меня о чём угодно — я здесь 24/7 🤖' }],
    AlexK_99: [{ from: 'friend', text: 'Привет! Сыграем партию?' }],
    Maria_Chess: [{ from: 'friend', text: 'Видел мой новый рейтинг? 🎉' }],
  })
  const [input, setInput] = useState('')

  const chats = [
    { id: 'ai', name: 'ИИ-Тренер', avatar: '🤖', bg: '#22c55e', online: true, pinned: true },
    { id: 'AlexK_99', name: 'AlexK_99', avatar: '🦁', bg: '#f59e0b', online: true },
    { id: 'Maria_Chess', name: 'Maria_Chess', avatar: '🦊', bg: '#ef4444', online: false },
  ]

  const send = () => {
    if (!input.trim() || !activeChat) return
    const msg = input
    setInput('')
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), { from: 'me', text: msg }],
    }))
    setTimeout(() => {
      const replies: Record<string, string[]> = {
        ai: ['Интересная мысль! В шашках это называется...', 'Да, это отличная стратегия!', 'Попробуй применить это в следующей партии 🎯'],
        AlexK_99: ['Звучит круто!', 'Давай завтра сыграем?', '👍'],
        Maria_Chess: ['Точно!', 'Ха, знаю! 😄', 'Класс!'],
      }
      const arr = replies[activeChat] || ['👍']
      setMessages(prev => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), { from: 'friend', text: arr[Math.floor(Math.random() * arr.length)] }],
      }))
    }, 1200)
  }

  const activeMessages = activeChat ? messages[activeChat] || [] : []
  const activeChatInfo = chats.find(c => c.id === activeChat)

  return (
    <div className="flex h-[calc(100vh-220px)]">
      {/* Chat list */}
      <div className={`flex flex-col border-r border-white/5 ${activeChat ? 'hidden' : 'flex'} w-full`} style={{ display: activeChat ? 'none' : 'flex' }}>
        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-left border-b border-white/5"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background: chat.bg }}>
                {chat.avatar}
              </div>
              {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="text-white font-semibold text-sm">{chat.name}</p>
                {chat.pinned && <span className="text-yellow-400 text-xs">📌</span>}
              </div>
              <p className="text-white/40 text-xs truncate">
                {messages[chat.id]?.slice(-1)[0]?.text || '...'}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Active chat */}
      {activeChat && activeChatInfo && (
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <button onClick={() => setActiveChat(null)} className="text-white/50 text-lg">←</button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: activeChatInfo.bg }}>
              {activeChatInfo.avatar}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{activeChatInfo.name}</p>
              <p className="text-white/30 text-xs">{activeChatInfo.online ? 'онлайн' : 'был(а) недавно'}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {activeMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-sm px-3 py-2 rounded-2xl max-w-[78%] leading-relaxed ${
                  msg.from === 'me'
                    ? 'bg-green-600 text-white rounded-br-sm'
                    : 'bg-white/8 text-white/80 rounded-bl-sm'
                }`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4 flex gap-2">
            <input
              className="app-input flex-1"
              placeholder="Сообщение..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button onClick={send} className="btn-primary px-4 py-3">→</button>
          </div>
        </div>
      )}
    </div>
  )
}

function MatchesTab() {
  const [isLive, setIsLive] = useState(true)
  const liveMatches = [
    { id: 1, p1: 'Magnus_V 🇳🇴', p2: 'Kerim_KZ 🇰🇿', viewers: 234, likes: 892, emoji1: '👑', emoji2: '🦅', bg1: '#f59e0b', bg2: '#3b82f6', move: 14 },
    { id: 2, p1: 'Anna_Pro 🇷🇺', p2: 'JohnD_UK 🇬🇧', viewers: 89, likes: 341, emoji1: '🌟', emoji2: '🎯', bg1: '#ec4899', bg2: '#8b5cf6', move: 22 },
  ]

  const recordings = [
    { id: 3, p1: 'DimaN_Pro', p2: 'ИИ-Оракул', result: '1-0', duration: '18 мин', views: 1240, emoji1: '🐺', emoji2: '🤖', bg1: '#8b5cf6', bg2: '#f59e0b' },
    { id: 4, p1: 'SaraPlay', p2: 'AlexK_99', result: '0-1', duration: '25 мин', views: 876, emoji1: '🦋', emoji2: '🦁', bg1: '#06b6d4', bg2: '#f59e0b' },
  ]

  return (
    <div className="px-4 pb-4 space-y-4">
      {/* Toggle */}
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1">
        <button
          onClick={() => setIsLive(true)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${isLive ? 'bg-red-500 text-white' : 'text-white/50'}`}
        >
          🔴 Прямой эфир
        </button>
        <button
          onClick={() => setIsLive(false)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${!isLive ? 'bg-blue-500 text-white' : 'text-white/50'}`}
        >
          📹 Записи
        </button>
      </div>

      {isLive ? (
        <div className="space-y-3">
          {liveMatches.map(m => (
            <div key={m.id} className="bg-white/5 border border-red-500/15 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-bold">LIVE</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span>👁️ {m.viewers}</span>
                  <span>❤️ {m.likes}</span>
                  <span>Ход {m.move}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: m.bg1 }}>{m.emoji1}</div>
                  <div>
                    <p className="text-white text-sm font-semibold">{m.p1}</p>
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <p className="text-white font-bold text-sm">VS</p>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-white text-sm font-semibold text-right">{m.p2}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: m.bg2 }}>{m.emoji2}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-red-500/15 border border-red-500/20 text-red-400 rounded-xl py-2 text-xs font-semibold hover:bg-red-500/25 transition">
                  👁️ Смотреть
                </button>
                <button className="bg-white/5 border border-white/10 text-white/50 rounded-xl px-3 py-2 text-xl hover:bg-white/10 transition">
                  🎁
                </button>
                <button className="bg-white/5 border border-white/10 text-white/50 rounded-xl px-3 py-2 text-xl hover:bg-white/10 transition">
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {recordings.map(r => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: r.bg1 }}>{r.emoji1}</div>
                  <span className="text-white text-sm">{r.p1}</span>
                </div>
                <div className="text-white/60 text-sm font-bold">{r.result}</div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{r.p2}</span>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: r.bg2 }}>{r.emoji2}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-white/30">
                <span>⏱️ {r.duration}</span>
                <span>👁️ {r.views} просмотров</span>
              </div>
              <button className="w-full mt-3 bg-white/5 border border-white/10 text-white/60 rounded-xl py-2 text-xs hover:bg-white/10 transition">
                ▶️ Смотреть запись
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
