import { Landmark, Trophy } from 'lucide-react'
import type { Tab } from '../types'
import { HomeMark } from './Icons'

// Jar icon for Keeper
function JarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h10M6 6h12M5 9v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9H5z" />
      <path d="M9 13h6" />
    </svg>
  )
}

// X icon for Wallet
function WalletXIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 6 12 12M6 18 18 6" />
      <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeDasharray="3 3" />
    </svg>
  )
}

export function BottomNav({ activeTab, onChangeTab }: { activeTab: Tab; onChangeTab: (tab: Tab) => void }) {
  return (
    <nav className="fampay-bottom-nav">
      <button
        className={`nav-tab ${activeTab === 'bank' ? 'active' : ''}`}
        onClick={() => onChangeTab('bank')}
        aria-label="Bank Tab"
      >
        <Landmark size={21} />
        <span>Bank</span>
      </button>

      <button
        className={`nav-tab ${activeTab === 'wallet' ? 'active' : ''}`}
        onClick={() => onChangeTab('wallet')}
        aria-label="Wallet Tab"
      >
        <WalletXIcon size={21} />
        <span>Wallet</span>
      </button>

      <button
        className={`nav-tab home-tab ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onChangeTab('home')}
        aria-label="Home Tab"
      >
        <HomeMark size={28} color={activeTab === 'home' ? '#F6A821' : '#888'} />
        <span>Home</span>
        {activeTab === 'home' && <i className="active-dot" />}
      </button>

      <button
        className={`nav-tab ${activeTab === 'rewards' ? 'active' : ''}`}
        onClick={() => onChangeTab('rewards')}
        aria-label="Rewards Tab"
      >
        <Trophy size={21} />
        <span>Rewards</span>
      </button>

      <button
        className={`nav-tab keeper-tab ${activeTab === 'keeper' ? 'active' : ''}`}
        onClick={() => onChangeTab('keeper')}
        aria-label="Keeper Tab"
      >
        <div className="flex-badge">
          <span>flex</span>
          <small>Coming soon</small>
        </div>
        <JarIcon size={21} />
        <span>Keeper</span>
      </button>
    </nav>
  )
}
