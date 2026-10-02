import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Copy, Edit3, Share2, Plus, Eye, EyeOff, Check } from 'lucide-react'
import { FamBird, RuPayLogo } from './Icons'

export function WalletScreen({
  walletBalance = 186,
  upiId = '8800274561@fam',
  userName = 'Harsh Pandey',
  onAddMoney,
}: {
  walletBalance?: number
  upiId?: string
  userName?: string
  onAddMoney?: () => void
}) {
  const [balanceVisible, setBalanceVisible] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    const upiPayload = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(userName)}&cu=INR`
    QRCode.toDataURL(upiPayload, {
      width: 250,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    }).then((url) => {
      if (active) setQrDataUrl(url)
    })
    return () => {
      active = false
    }
  }, [upiId, userName])

  function handleCopy() {
    navigator.clipboard?.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'My FamPay UPI', text: upiId }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  return (
    <div className="wallet-screen-content">
      {/* Check Balance Header */}
      <div className="wallet-header">
        <span className="wallet-header-title">Check Balance</span>
        <div className="wallet-balance-row">
          <div className="wallet-amount-wrap">
            <span className="rupee-symbol">₹</span>
            <strong className="wallet-amount-text">
              {balanceVisible ? walletBalance : 'XXXX'}
            </strong>
            <button
              className="wallet-eye-btn"
              onClick={() => setBalanceVisible((v) => !v)}
              aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
            >
              {balanceVisible ? <Eye size={19} /> : <EyeOff size={19} />}
            </button>
          </div>
          <button className="wallet-plus-btn" onClick={onAddMoney} aria-label="Add money">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Center QR Stage */}
      <div className="wallet-qr-section">
        <div className="wallet-qr-backdrop">
          <span className="ambient-leaf leaf-tl">🍃</span>
          <span className="ambient-coin coin-tr">🪙</span>
          <span className="ambient-coin coin-br">🪙</span>
          <span className="ambient-leaf leaf-br">🍃</span>
        </div>

        <div className="wallet-qr-box">
          {qrDataUrl && (
            <div className="wallet-qr-inner">
              <img src={qrDataUrl} alt="UPI QR Code" className="wallet-qr-img" />
              <div className="wallet-qr-badge">
                <FamBird size={18} color="#F6A821" />
              </div>
            </div>
          )}
        </div>
        <div className="wallet-qr-pedestal" />

        {/* UPI Bar with Copy, Edit, Share */}
        <div className="wallet-upi-bar">
          <span className="wallet-upi-text">{upiId}</span>
          <div className="wallet-upi-actions">
            <button className="upi-action-btn" onClick={handleCopy} aria-label="Copy UPI ID">
              {copied ? <Check size={18} color="#48BB78" /> : <Copy size={18} />}
            </button>
            <button className="upi-action-btn" onClick={() => alert('Custom UPI ID editing')} aria-label="Edit UPI ID">
              <Edit3 size={18} />
            </button>
            <button className="upi-action-btn" onClick={handleShare} aria-label="Share UPI ID">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* FamX Card */}
      <div className="wallet-card-section">
        <div className="famx-physical-card">
          <div className="famx-card-ambient-x" />
          <div className="famx-card-top">
            <div className="famx-logo">
              <span>fam</span>
              <span className="famx-accent">X</span>
            </div>
          </div>
          <div className="famx-card-holder">{userName}</div>
          <div className="famx-card-bottom">
            <RuPayLogo height={13} />
          </div>
        </div>
      </div>
    </div>
  )
}
