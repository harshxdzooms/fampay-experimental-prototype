import { useState } from 'react'
import { Landmark, X } from 'lucide-react'
import { FamBird } from './Icons'

export function CheckBalanceSheet({
  isOpen,
  onClose,
  walletBalance = 186,
  onAddMoney,
  onLinkBank,
}: {
  isOpen: boolean
  onClose: () => void
  walletBalance?: number
  onAddMoney?: () => void
  onLinkBank?: () => void
}) {
  const [balanceVisible, setBalanceVisible] = useState(true)

  if (!isOpen) return null

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet-container" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <div className="sheet-handle" />
          <button className="sheet-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <h2 className="sheet-title">Check Balance</h2>

        <div className="balance-item-card">
          <div className="balance-item-icon wallet-icon-bg">
            <FamBird size={20} color="#F6A821" />
          </div>
          <div className="balance-item-info">
            <span className="balance-item-name">Wallet balance</span>
            <button className="balance-action-link" onClick={onAddMoney}>
              + Add Money
            </button>
          </div>
          <button
            className="balance-value-btn"
            onClick={() => setBalanceVisible((v) => !v)}
            title="Toggle visibility"
          >
            {balanceVisible ? `₹ ${walletBalance}` : '₹ •••'}
          </button>
        </div>

        <div className="sheet-section-title">Bank accounts</div>

        <div className="balance-item-card bank-link-card" onClick={onLinkBank}>
          <div className="balance-item-icon bank-icon-bg">
            <Landmark size={20} color="#D69E2E" />
          </div>
          <div className="balance-item-info">
            <span className="balance-item-name">Link bank account</span>
            <span className="balance-item-sub">10L+ users pay using bank</span>
          </div>
          <span className="balance-action-link">Link now</span>
        </div>
      </div>
    </div>
  )
}
