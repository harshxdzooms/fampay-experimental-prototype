import { useState } from 'react'
import {
  ArrowLeft,
  X,
  CircleHelp,
  Share2,
  Copy,
  Paperclip,
  Calculator,
  Delete,
  Check,
  Zap,
} from 'lucide-react'
import type { Transaction, Screen } from '../types'
import { FamBird } from './Icons'
import rewardWheelBanner from '../assets/reward-wheel-banner.png'
import pumaOffer from '../assets/puma-offer.png'
import ajioOffer from '../assets/ajio-offer.png'

export function PaymentFlow({
  screen,
  onSetScreen,
  recipient,
  onSetRecipient,
  amount,
  onSetAmount,
  qrReference,
  onPaymentComplete,
  lastTransaction,
  onResetToHome,
  onViewHistory,
}: {
  screen: Screen
  onSetScreen: (screen: Screen) => void
  recipient: string
  onSetRecipient: (name: string) => void
  amount: string
  onSetAmount: (amt: string) => void
  qrReference: string
  onPaymentComplete: (tx: Transaction) => void
  lastTransaction: Transaction | null
  onResetToHome: () => void
  onViewHistory: () => void
}) {
  const [note, setNote] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const [copiedTxn, setCopiedTxn] = useState(false)

  function handleKeypad(key: string) {
    if (key === 'delete') {
      onSetAmount(amount.slice(0, -1))
      return
    }
    if (key === '.') {
      if (!amount.includes('.')) onSetAmount(amount ? `${amount}.` : '0.')
      return
    }
    if (amount.length >= 7) return
    onSetAmount(amount === '0' ? key : `${amount}${key}`)
  }

  function handleStartPayment() {
    if (!recipient.trim() || Number(amount) <= 0) return
    const upiId = qrReference.includes('@') ? qrReference : 'paytm.s2fnmv1@pty'
    const newTx: Transaction = {
      id: `01a0b540-7c35-7f00-81ce-${crypto.randomUUID().slice(0, 12)}`,
      recipient: recipient.trim(),
      upiId,
      amount: Number(amount),
      reference: qrReference || 'paytm.s2fnmv1@pty',
      createdAt: new Date().toISOString(),
      note: note.trim() || undefined,
    }
    onPaymentComplete(newTx)
    onSetScreen('success')
  }

  function handleCopyTxn(id: string) {
    navigator.clipboard?.writeText(id)
    setCopiedTxn(true)
    setTimeout(() => setCopiedTxn(false), 1800)
  }

  function formatSuccessDate(isoDate: string) {
    const d = new Date(isoDate)
    const day = d.toLocaleDateString('en-IN', { day: 'numeric' })
    const month = d.toLocaleDateString('en-IN', { month: 'short' }).replace('Sep', 'Sept')
    const year = d.toLocaleDateString('en-IN', { year: 'numeric' })
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    return `${day} ${month} ${year} at ${time}`
  }

  // 1. Enter Recipient Form
  if (screen === 'recipient') {
    return (
      <div className="payment-screen-content recipient-form-screen">
        <header className="flow-topbar">
          <button className="flow-back-btn" onClick={onResetToHome} aria-label="Cancel">
            <ArrowLeft size={22} />
          </button>
          <span className="flow-step-tag">NEW PAYMENT</span>
        </header>

        <div className="recipient-form-wrap">
          <h2 className="form-heading">Pay to</h2>
          <div className="reference-tag-card">
            <span>Reference / QR ID</span>
            <strong>{qrReference || 'paytm.s2fnmv1@pty'}</strong>
          </div>

          <label className="input-field-label" htmlFor="recipient-input">
            Recipient name or nickname
          </label>
          <input
            id="recipient-input"
            className="recipient-text-input"
            placeholder="e.g. shani"
            value={recipient}
            onChange={(e) => onSetRecipient(e.target.value)}
            autoFocus
          />

          <button
            className="flow-continue-btn"
            disabled={!recipient.trim()}
            onClick={() => onSetScreen('payment')}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // 2. Payment Amount Keypad Screen
  if (screen === 'payment') {
    return (
      <div className="payment-screen-content keypad-screen">
        <header className="flow-topbar">
          <button className="flow-back-btn" onClick={() => onSetScreen('recipient')} aria-label="Back">
            <ArrowLeft size={24} />
          </button>
        </header>

        {/* Recipient Hero */}
        <div className="keypad-recipient-hero">
          <div className="recipient-avatar-large">
            <span>{recipient.charAt(0).toUpperCase()}</span>
            <div className="recipient-fam-badge">
              <FamBird size={12} color="#F6A821" />
            </div>
          </div>
          <h2 className="recipient-name-title">{recipient}</h2>
          <p className="recipient-account-sub">
            <FamBird size={14} color="#F6A821" /> FamX Wallet
          </p>
        </div>

        {/* Speech-bubble Amount Display */}
        <div className="amount-speech-bubble-wrap">
          <div className="amount-speech-bubble">
            <span className="bubble-rupee">₹</span>
            <strong className="bubble-amount-text">{amount || '95'}</strong>
            <i className="bubble-cursor" />
          </div>

          <button className="add-note-chip" onClick={() => setNoteOpen((v) => !v)}>
            <Paperclip size={14} />
            <span>{note || 'Add a note'}</span>
          </button>
          {noteOpen && (
            <input
              className="note-inline-input"
              placeholder="What's this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoFocus
            />
          )}
        </div>

        {/* Pay Now Button */}
        <button
          className="pay-now-action-btn"
          disabled={!amount || Number(amount) <= 0}
          onClick={handleStartPayment}
        >
          Pay now
        </button>

        {/* 12-Key Virtual Numpad */}
        <div className="virtual-keypad-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button key={digit} className="key-btn" onClick={() => handleKeypad(digit)}>
              {digit}
            </button>
          ))}
          <button className="key-btn util-key calculator-key" aria-label="Calculator" onClick={() => alert('Calculator')}>
            <Calculator size={18} />
          </button>
          <button className="key-btn util-key decimal-key" onClick={() => handleKeypad('.')}> 
            .
          </button>
          <button className="key-btn zero-key" onClick={() => handleKeypad('0')}>
            0
          </button>
          <button className="key-btn util-key delete-key" aria-label="Delete" onClick={() => handleKeypad('delete')}>
            <Delete size={20} />
          </button>
        </div>

        <div className="payment-security-note">
          <span>Paid securely via FamApp · local demo</span>
        </div>
      </div>
    )
  }

  // 3. Success Screen
  if (screen === 'success' && lastTransaction) {
    return (
      <div className="payment-screen-content success-receipt-screen">
        {/* Top Actions: Close (X), Help (?), Share */}
        <header className="success-header-actions">
          <button className="receipt-icon-btn close-btn" onClick={onResetToHome} aria-label="Close">
            <X size={26} />
          </button>

          <div className="success-header-right">
            <button className="receipt-icon-btn" aria-label="Help">
              <CircleHelp size={28} />
            </button>
            <button
              className="receipt-icon-btn"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Payment Successful',
                    text: `Paid ₹${lastTransaction.amount} to ${lastTransaction.recipient} via FamApp`,
                  }).catch(() => {})
                }
              }}
              aria-label="Share"
            >
              <Share2 size={26} />
            </button>
          </div>
        </header>

        {/* Ambient Rays and Sparkles */}
        <div className="success-ambient-effects">
          <div className="ambient-ray ray-left" />
          <div className="ambient-ray ray-center" />
          <div className="ambient-ray ray-right" />
          <span className="ambient-sparkle sp-1" />
          <span className="ambient-sparkle sp-2" />
          <span className="ambient-sparkle sp-3" />
          <span className="ambient-sparkle sp-4" />
        </div>

        {/* Amount & Recipient Details */}
        <div className="success-hero-details">
          <div className="success-amount-glow">
            <span className="success-rupee-sign">₹</span>
            <span className="success-amount-number">{lastTransaction.amount}</span>
          </div>

          <h1 className="success-to-recipient">to {lastTransaction.recipient}</h1>
          <p className="success-upi-handle">{lastTransaction.upiId || 'paytm.s2fnmv1@pty'}</p>
          <p className="success-secure-badge">Paid securely via FamApp</p>
        </div>

        {/* Arch & 3D Shopping Bag Mockup */}
        <div className="success-bag-stage">
          <div className="stage-arch-line" />
          <div className="stage-pedestal-platform" />
          <div className="stage-shopping-bag">
            <div className="bag-handle" />
            <div className="bag-body">
              <div className="bag-yellow-stripe" />
            </div>
          </div>
        </div>

        {/* Speed Pill */}
        <div className="success-speed-badge">
          <Zap size={14} className="speed-bolt" fill="#48BB78" color="#48BB78" />
          <span>Paid in 1.08 s</span>
        </div>

        {/* Timestamp */}
        <div className="success-timestamp-text">{formatSuccessDate(lastTransaction.createdAt)}</div>

        {/* TXN ID with Copy Button */}
        <div className="success-txn-box">
          <span className="txn-label">TXN ID:</span>
          <span className="txn-id-val">{lastTransaction.id}</span>
          <button className="txn-copy-btn" onClick={() => handleCopyTxn(lastTransaction.id)} aria-label="Copy TXN ID">
            {copiedTxn ? <Check size={16} color="#48BB78" /> : <Copy size={16} />}
          </button>
        </div>

        {/* View Details Link */}
        <button className="success-view-details-btn" onClick={onViewHistory}>
          View Details
        </button>

        {/* Reward Offers Section */}
        <section className="success-reward-offers">
          {/* Invite & Earn Banner */}
          <div
            className="invite-earn-banner"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(25, 4, 60, 0.95) 0%, rgba(35, 10, 80, 0.4) 65%), url(${rewardWheelBanner})`,
            }}
          >
            <div className="invite-copy">
              <span className="invite-label">Invite &amp; earn</span>
              <strong className="invite-headline">up to ₹1000 FamCash</strong>
              <small className="invite-subtext">min. ₹20 FamCash</small>
            </div>
          </div>

          {/* Puma & Ajio Deal Grid */}
          <div className="success-deals-grid">
            {/* Puma Card */}
            <div className="success-brand-card puma-card">
              <img className="success-brand-art" src={pumaOffer} alt="Puma Birthday Bash offer" />
              <div className="deal-footer">
                <span>Up to 50% off</span>
                <span>+ Extra 15% off</span>
              </div>
            </div>

            {/* Ajio Card */}
            <div className="success-brand-card ajio-card">
              <img className="success-brand-art" src={ajioOffer} alt="AJIO fashion offer" />
              <div className="deal-footer">
                <span>Flat 20% off</span>
                <span>on orders of ₹999+</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return null
}
