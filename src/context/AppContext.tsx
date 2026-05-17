import { createContext, useContext, useState, type ReactNode } from 'react'

export type Level = 'beginner' | 'player' | 'pro' | 'expert'

export interface UserProfile {
  name: string
  nickname: string
  email: string
  country: string
  age: string
  level: Level
  childMode: boolean
  books: string[]
  movies: string[]
  musicGenres: string[]
  xp: number
  coins: number
  streak: number
  rank: number
  avatar: {
    face: string
    hair: string
    outfit: string
    accessory: string
  }
  theme: 'dark' | 'light'
  accentColor: string
  subscription: 'free' | 'personal' | 'family'
}

interface AppContextType {
  user: UserProfile
  setUser: (u: UserProfile) => void
  updateUser: (partial: Partial<UserProfile>) => void
  isOnboarded: boolean
  setIsOnboarded: (v: boolean) => void
  activeTab: string
  setActiveTab: (t: string) => void
  notifications: string[]
  addNotification: (msg: string) => void
}

const defaultUser: UserProfile = {
  name: '',
  nickname: '',
  email: '',
  country: 'Kazakhstan',
  age: '',
  level: 'beginner',
  childMode: false,
  books: [],
  movies: [],
  musicGenres: [],
  xp: 1240,
  coins: 320,
  streak: 7,
  rank: 142,
  avatar: {
    face: 'face1',
    hair: 'hair2',
    outfit: 'outfit1',
    accessory: 'none',
  },
  theme: 'dark',
  accentColor: '#22c55e',
  subscription: 'free',
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser)
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [notifications, setNotifications] = useState<string[]>([])

  const updateUser = (partial: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...partial }))
  }

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev.slice(0, 9)])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== msg))
    }, 3000)
  }

  return (
    <AppContext.Provider value={{
      user, setUser, updateUser,
      isOnboarded, setIsOnboarded,
      activeTab, setActiveTab,
      notifications, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
