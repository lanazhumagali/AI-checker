import { useApp } from '../context/AppContext'

const TABS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'path', icon: '🗺️', label: 'Path' },
  { id: 'study', icon: '📚', label: 'Study' },
  { id: 'social', icon: '👥', label: 'Social' },
  { id: 'avatar', icon: '🎭', label: 'Avatar' },
]

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp()

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-slate-900/95 backdrop-blur border-t border-white/5 z-40">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all relative ${
              activeTab === tab.id
                ? 'text-green-400 bg-green-500/10'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className={`text-2xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>
              {tab.icon}
            </span>
            <span className={`text-xs font-medium ${activeTab === tab.id ? 'text-green-400' : 'text-white/40'}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
