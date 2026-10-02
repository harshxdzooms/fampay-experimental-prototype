import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Landmark, Share2, Check, X } from 'lucide-react'
import { FamBird } from './Icons'

export function YourQrSheet({
  isOpen,
  onClose,
  upiId = '8800274561@fam',
}: {
  isOpen: boolean
  onClose: () => void
  upiId?: string
}) {
  const [qrType, setQrType] = useState<'famx' | 'bank'>('famx')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    const upiPayload = `upi://pay?pa=${upiId}&pn=Harsh%20Pandey&cu=INR`
    QRCode.toDataURL(upiPayload, {
      width: 260,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    }).then((url) => {
      if (active) setQrDataUrl(url)
    })
    return () => {
      active = false
    }
  }, [upiId])

  function handleCopy() {
    navigator.clipboard?.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: 'My FamPay QR', text: `Pay me via UPI: ${upiId}` }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  if (!isOpen) return null

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet-container qr-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <div className="sheet-handle" />
          <button className="sheet-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Toggle FamX / Bank */}
        <div className="qr-toggle-container">
          <button
            className={`qr-toggle-pill ${qrType === 'famx' ? 'active' : ''}`}
            onClick={() => setQrType('famx')}
          >
            <span className="toggle-famx-icon">✕</span> FamX
          </button>
          <button
            className={`qr-toggle-pill ${qrType === 'bank' ? 'active' : ''}`}
            onClick={() => setQrType('bank')}
          >
            <Landmark size={15} />
            <span>Bank</span>
            <span className="orange-dot" />
          </button>
        </div>

        {/* QR Stage with background artwork */}
        <div className="qr-stage-wrapper">
          <div className="qr-ambient-bg">
            <span className="ambient-leaf leaf-tl">🍃</span>
            <span className="ambient-coin coin-tr">🪙</span>
            <span className="ambient-coin coin-br">🪙</span>
            <span className="ambient-leaf leaf-br">🍃</span>
          </div>

          <div className="qr-card-container">
            {qrDataUrl ? (
              <div className="qr-code-frame">
                <img src={qrDataUrl} alt="UPI QR code" className="qr-image" />
                <div className="qr-center-badge">
                  <FamBird size={16} color="#F6A821" />
                </div>
              </div>
            ) : (
              <div className="qr-placeholder" />
            )}
          </div>
          <div className="qr-pedestal-base" />
        </div>

        {/* UPI ID bar with Copy and Share buttons */}
        <div className="qr-id-bar">
          <span className="qr-upi-text">{upiId}</span>
          <div className="qr-actions">
            <button className="qr-icon-action" onClick={handleCopy} aria-label="Copy UPI ID">
              {copied ? <Check size={18} color="#48BB78" /> : <Copy size={18} />}
            </button>
            <button className="qr-icon-action" onClick={handleShare} aria-label="Share QR">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
