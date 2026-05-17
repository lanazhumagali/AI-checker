import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Path from './pages/Path'
import Study from './pages/Study'
import Social from './pages/Social'
import AvatarPage from './pages/Avatar'
import Settings from './pages/Settings'
import './index.css'

function AppShell() {
  const { isOnboarded, activeTab, notifications } = useApp()

  if (!isOnboarded) {
    return <Onboarding />
  }

  const pages: Record<string, React.ReactElement> = {
    home: <Home />,
    path: <Path />,
    study: <Study />,
    social: <Social />,
    avatar: <AvatarPage />,
    settings: <Settings />,
  }

  return (
    <div className="app-shell bg-game">
      <TopBar />
      <div className="flex-1 overflow-hidden relative">
        {pages[activeTab] || <Home />}
      </div>
      <BottomNav />

      {/* Toast notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 z-50 space-y-2 pointer-events-none">
        {notifications.map((msg, i) => (
          <div
            key={i}
            className="bg-slate-800 border border-green-500/30 rounded-2xl px-4 py-3 shadow-xl shadow-black/30 flex items-center gap-2 animate-float"
          >
            <span className="text-green-400 text-lg">✓</span>
            <span className="text-white text-sm font-medium">{msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex justify-center min-h-screen bg-slate-950">
        <AppShell />
      </div>
    </AppProvider>
  )
}
