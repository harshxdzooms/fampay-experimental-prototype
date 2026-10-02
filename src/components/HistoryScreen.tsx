import { useState } from 'react'
import { ArrowLeft, MoreVertical, SlidersHorizontal, ShoppingCart, ChevronDown, Check } from 'lucide-react'
import type { Transaction } from '../types'

const defaultHistoricalTransactions: Transaction[] = [
  {
    id: 'TXN-9831-A',
    recipient: 'Sangram So Jilboo',
    amount: 10,
    reference: 'sangram@upi',
    createdAt: '2026-09-29T20:49:00',
  },
  {
    id: 'TXN-9831-B',
    recipient: 'Lalit Mavi',
    amount: 20,
    reference: 'lalit@upi',
    createdAt: '2026-09-29T20:36:00',
  },
  {
    id: 'TXN-9831-C',
    recipient: 'Noida Metro Rail Corporatio...',
    amount: 15,
    reference: 'nmrc@axis',
    createdAt: '2026-09-29T20:17:00',
  },
  {
    id: 'TXN-9831-D',
    recipient: 'Dharampal',
    amount: 40,
    reference: 'dharampal@paytm',
    createdAt: '2026-09-29T20:13:00',
  },
  {
    id: 'TXN-9831-E',
    recipient: 'Mr Arvind Kumar',
    amount: 30,
    reference: 'arvind@upi',
    createdAt: '2026-09-29T19:42:00',
  },
]

export function HistoryScreen({
  transactions,
  onBack,
  onSelectTransaction,
}: {
  transactions: Transaction[]
  onBack: () => void
  onSelectTransaction: (tx: Transaction) => void
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent')

  const allTx = [...transactions, ...defaultHistoricalTransactions]

  const sortedTx = [...allTx].sort((a, b) => {
    if (sortBy === 'highest') return b.amount - a.amount
    if (sortBy === 'lowest') return a.amount - b.amount
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const baseTotal = 8831
  const dynamicTotal = baseTotal + transactions.reduce((sum, t) => sum + t.amount, 0)

  function formatTime(iso: string) {
    const d = new Date(iso)
    const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
    const day = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    return `${time}, ${day}`
  }

  return (
    <div className="history-screen-content">
      {/* Header */}
      <div className="history-header">
        <button className="history-back-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <h1 className="history-title">History</h1>
        <button className="history-menu-btn" aria-label="More options">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="history-scrollable">
        {/* Financial Thinking Card */}
        <div className="finance-habits-card">
          <div className="habits-card-top">
            <span className="habits-month-btn">
              This month <ChevronDown size={14} />
            </span>
            <span className="habits-new-badge">New!</span>
          </div>

          <h3 className="habits-heading">
            Your first step towards <br />
            financial thinking
          </h3>

          <div className="needs-wants-bar">
            <span className="label-needs">Needs</span>
            <div className="needs-wants-divider" />
            <span className="label-wants">Wants</span>
            <span className="heart-yellow">💛</span>
            <span className="heart-blue">💙</span>
          </div>

          <button className="habits-cta-btn">Try it out</button>
        </div>

        {/* Month & Total header */}
        <div className="history-month-row">
          <div className="month-name-wrap">
            <strong className="month-name">September</strong>
            <span className="month-year">2026</span>
          </div>
          <strong className="month-total-amount">
            ₹{new Intl.NumberFormat('en-IN').format(dynamicTotal)}
          </strong>
        </div>

        {/* Transactions List */}
        <div className="history-transactions-list">
          {sortedTx.map((tx) => (
            <div
              key={tx.id}
              className="history-tx-item"
              onClick={() => onSelectTransaction(tx)}
              role="button"
              tabIndex={0}
            >
              <div className="tx-cart-icon-wrap">
                <ShoppingCart size={20} className="tx-cart-icon" />
              </div>
              <div className="tx-info-wrap">
                <strong className="tx-recipient-name">{tx.recipient}</strong>
                <span className="tx-timestamp">{formatTime(tx.createdAt)}</span>
              </div>
              <strong className="tx-amount-negative">
                -₹{new Intl.NumberFormat('en-IN').format(tx.amount)}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Filter Button */}
      <button className="history-filters-pill" onClick={() => setFilterOpen((v) => !v)}>
        <SlidersHorizontal size={18} />
        <span>Filters</span>
      </button>

      {/* Filter Modal */}
      {filterOpen && (
        <div className="sheet-backdrop" onClick={() => setFilterOpen(false)}>
          <div className="sheet-container filter-sheet" onClick={(e) => e.stopPropagation()}>
            <h3 className="sheet-title">Sort Transactions</h3>
            <div className="filter-options-list">
              <button
                className={`filter-opt ${sortBy === 'recent' ? 'active' : ''}`}
                onClick={() => {
                  setSortBy('recent')
                  setFilterOpen(false)
                }}
              >
                <span>Most Recent</span>
                {sortBy === 'recent' && <Check size={18} />}
              </button>
              <button
                className={`filter-opt ${sortBy === 'highest' ? 'active' : ''}`}
                onClick={() => {
                  setSortBy('highest')
                  setFilterOpen(false)
                }}
              >
                <span>Highest Amount</span>
                {sortBy === 'highest' && <Check size={18} />}
              </button>
              <button
                className={`filter-opt ${sortBy === 'lowest' ? 'active' : ''}`}
                onClick={() => {
                  setSortBy('lowest')
                  setFilterOpen(false)
                }}
              >
                <span>Lowest Amount</span>
                {sortBy === 'lowest' && <Check size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
