import { useRef, useEffect, useState } from 'react'
import { Capacitor, type PluginListenerHandle } from '@capacitor/core'
import { BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning'
import {
  Search,
  Send,
  QrCode,
  Eye,
  History,
  Zap,
  Flashlight,
  Image as ImageIcon,
  ArrowRight,
  Shirt,
  Sparkles,
} from 'lucide-react'
import cassetteArtwork from '../assets/ChatGPT Image Oct 2, 2026, 12_38_02 PM.png'
import pointerArtwork from '../assets/pointer-transparent.png'
import googlePlayLogo from '../assets/ChatGPT Image Oct 2, 2026, 01_19_11 PM.png'
import famStudioLogo from '../assets/ChatGPT Image Oct 2, 2026, 12_44_25 PM.png'

type ScannerControls = {
  stop: () => void
  switchTorch?: (onOff: boolean) => Promise<void>
  streamVideoConstraintsApply?: (constraints: MediaTrackConstraints) => void | Promise<void>
}

export function HomeScreen({
  isScanning,
  onToggleScan,
  onOpenYourQr,
  onOpenCheckBalance,
  onOpenHistory,
  onQrDetected,
  torchOn,
  onToggleTorch,
  scanError,
  onFileUpload,
  onDirectPay,
}: {
  isScanning: boolean
  onToggleScan: () => void
  onOpenYourQr: () => void
  onOpenCheckBalance: () => void
  onOpenHistory: () => void
  onQrDetected: (data: string) => void
  torchOn: boolean
  onToggleTorch: () => void
  scanError?: string
  onFileUpload: (file: File) => void
  onDirectPay: (recipient: string) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scannerControlsRef = useRef<ScannerControls | null>(null)
  const torchOnRef = useRef(torchOn)
  const nativeScannerActiveRef = useRef(false)
  const onQrDetectedRef = useRef(onQrDetected)
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    onQrDetectedRef.current = onQrDetected
  }, [onQrDetected])

  useEffect(() => {
    if (!isScanning || !videoRef.current) return
    let active = true
    let controls: ScannerControls | undefined
    let nativeListener: PluginListenerHandle | undefined
    setCameraError('')

    if (Capacitor.getPlatform() === 'android') {
      document.documentElement.classList.add('native-scanner-active')
      document.body.classList.add('native-scanner-active')

      void (async () => {
        const permission = await BarcodeScanner.checkPermissions()
        const cameraPermission = permission.camera === 'granted'
          ? permission
          : await BarcodeScanner.requestPermissions()
        if (cameraPermission.camera !== 'granted') {
          throw new Error('Camera permission is required to scan QR codes.')
        }

        nativeListener = await BarcodeScanner.addListener('barcodesScanned', ({ barcodes }) => {
          const value = barcodes.find((barcode) => barcode.rawValue)?.rawValue
          if (active && value) onQrDetectedRef.current(value)
        })

        await BarcodeScanner.startScan({
          formats: [BarcodeFormat.QrCode],
          lensFacing: LensFacing.Back,
        })
        nativeScannerActiveRef.current = true
      })().catch((error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : ''
        setCameraError(message || 'Camera preview could not start. Check camera access in Android settings.')
      })

      return () => {
        active = false
        document.documentElement.classList.remove('native-scanner-active')
        document.body.classList.remove('native-scanner-active')
        nativeScannerActiveRef.current = false
        void nativeListener?.remove()
        void BarcodeScanner.stopScan().catch(() => {})
        if (torchOnRef.current) {
          void BarcodeScanner.disableTorch().catch(() => {})
          torchOnRef.current = false
          onToggleTorch()
        }
      }
    }

    void import('@zxing/browser')
      .then(({ BrowserQRCodeReader }) => {
        if (!active || !videoRef.current) return
        return new BrowserQRCodeReader().decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, _err, scanControls) => {
            controls = scanControls
            scannerControlsRef.current = scanControls
            if (result && active) {
              scanControls.stop()
              onQrDetectedRef.current(result.getText())
            }
          }
        )
      })
      .then((ctrls) => {
        controls = ctrls
        scannerControlsRef.current = ctrls ?? null
        if (!active && ctrls) ctrls.stop()
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : ''
        setCameraError(message || 'Camera preview could not start. Check camera access in Android settings.')
      })

    return () => {
      active = false
      controls?.stop()
      scannerControlsRef.current = null
      if (torchOnRef.current) {
        const turnTorchOff = controls?.switchTorch?.(false) ?? controls?.streamVideoConstraintsApply?.({ advanced: [{ torch: false } as MediaTrackConstraintSet] })
        void Promise.resolve(turnTorchOff).catch(() => {})
        torchOnRef.current = false
        onToggleTorch()
      }
    }
  }, [isScanning])

  async function handleToggleTorch() {
    const nextTorchState = !torchOn
    if (Capacitor.getPlatform() === 'android') {
      if (!nativeScannerActiveRef.current) {
        setCameraError('Wait for the camera preview before using the flashlight.')
        return
      }

      try {
        const { available } = await BarcodeScanner.isTorchAvailable()
        if (!available) {
          setCameraError('This device does not have a camera flashlight.')
          return
        }
        if (nextTorchState) {
          await BarcodeScanner.enableTorch()
        } else {
          await BarcodeScanner.disableTorch()
        }
        setCameraError('')
        torchOnRef.current = nextTorchState
        onToggleTorch()
      } catch (error) {
        setCameraError(error instanceof Error ? error.message : 'The camera could not switch its flashlight.')
      }
      return
    }

    const controls = scannerControlsRef.current
    if (!controls) {
      setCameraError('Flashlight is not supported by this camera.')
      return
    }

    try {
      if (controls.switchTorch) {
        await controls.switchTorch(nextTorchState)
      } else if (controls.streamVideoConstraintsApply) {
        await controls.streamVideoConstraintsApply({
          advanced: [{ torch: nextTorchState } as MediaTrackConstraintSet],
        })
      } else {
        setCameraError('Flashlight is not supported by this camera.')
        return
      }
      setCameraError('')
      torchOnRef.current = nextTorchState
      onToggleTorch()
    } catch {
      setCameraError('The camera could not switch its flashlight.')
    }
  }

  return (
    <div className="home-screen-content">
      {/* Top Header */}
      <header className="home-top-header">
        <div className="home-avatar-circle" title="Profile">
          <span>HP</span>
        </div>

        <div className="home-search-pill" onClick={() => onDirectPay('shani')}>
          <Search size={18} className="search-icon" />
          <span className="search-placeholder">Pay any number</span>
        </div>

        <button className="home-send-btn" onClick={() => onDirectPay('shani')} aria-label="Send to contact">
          <Send size={18} />
          <span className="send-badge">8</span>
        </button>
      </header>

      {/* Hero "TAP TO SCAN" / In-place Camera Viewfinder */}
      <section className="home-hero-section">
        {isScanning ? (
          <div className={`home-camera-box ${torchOn ? 'torch-active' : ''}`}>
            <video ref={videoRef} autoPlay playsInline muted className="camera-stream-video" />

            <div className="camera-overlay-tap" onClick={onToggleScan} title="Tap to exit camera" />

            <div className="camera-viewfinder-reticle">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <span className="camera-laser" />
            </div>

            <div className="camera-bottom-toolbar">
              <button
                className={`cam-tool-btn ${torchOn ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  void handleToggleTorch()
                }}
                aria-label="Toggle Flashlight"
              >
                <Flashlight size={20} />
              </button>

              <button
                className="cam-tool-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                aria-label="Upload QR Image"
              >
                <ImageIcon size={20} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onFileUpload(file)
                }}
              />
            </div>

            <div className="camera-hint-bubble">
              <button
                className="camera-demo-qr-link"
                onClick={(e) => {
                  e.stopPropagation()
                  onQrDetected('paytm.s2fnmv1@pty')
                }}
              >
                Tap to simulate scanning Shani's QR
              </button>
            </div>

            {(scanError || cameraError) && <div className="camera-scan-err">{scanError || cameraError}</div>}
          </div>
        ) : (
          <div className="home-cassette-card" onClick={onToggleScan} role="button" tabIndex={0}>
            <img className="cassette-art" src={cassetteArtwork} alt="Tap to scan" draggable={false} />

            <div className="cassette-cursor-wrap">
              <img className="cassette-pointer" src={pointerArtwork} alt="" draggable={false} />
            </div>
          </div>
        )}

        {/* Paytune Banner */}
        <div className="home-paytune-banner">
          <div className="paytune-phone-art">
            <div className="phone-screen-check">✓</div>
          </div>
          <div className="paytune-copy">
            <strong>Make payments go FAAAHHHHH</strong>
            <span className="paytune-link">
              Customise your Paytune <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </section>

      {/* Main Quick Action Pills */}
      <section className="home-quick-actions">
        <button className="quick-btn-side" onClick={onOpenYourQr}>
          <div className="quick-icon-wrap">
            <QrCode size={22} />
          </div>
          <span>Your QR</span>
        </button>

        <button className="quick-btn-center" onClick={onOpenCheckBalance}>
          <Eye size={18} />
          <strong>Check Balance</strong>
        </button>

        <button className="quick-btn-side" onClick={onOpenHistory}>
          <div className="quick-icon-wrap">
            <History size={22} />
          </div>
          <span>History</span>
        </button>
      </section>

      {/* Service Action Tiles */}
      <section className="home-service-cards">
        <div className="service-tile recharge-tile" onClick={() => onDirectPay('Mobile Recharge')}>
          <span className="service-badge-pill">Get 1x coins</span>
          <div className="service-icon-box recharge-box">
            <Zap size={22} className="lightning-icon" />
          </div>
          <span className="service-tile-label">Recharge</span>
        </div>

        <div className="service-tile studio-tile" onClick={() => onDirectPay('Fam Studio')}>
          <div className="service-icon-box studio-box">
            <img className="service-logo" src={famStudioLogo} alt="" draggable={false} />
          </div>
          <span className="service-tile-label">Fam Studio</span>
        </div>

        <div className="service-tile play-tile" onClick={() => onDirectPay('Google Play')}>
          <span className="service-badge-pill">Flat 4%</span>
          <div className="service-icon-box play-box">
            <img className="service-logo" src={googlePlayLogo} alt="" draggable={false} />
          </div>
          <span className="service-tile-label">Google Play</span>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="home-recommended-section">
        <h3 className="section-heading">Recommended</h3>
        <div className="recommended-rack">
          <div className="rack-item">
            <div className="rack-hanger">
              <span className="hanger-clip" />
              <span className="hanger-clip right" />
            </div>
            <div className="rack-card purple">
              <Shirt size={22} />
            </div>
          </div>
          <div className="rack-item">
            <div className="rack-card green-star">
              <Sparkles size={22} />
            </div>
          </div>
          <div className="rack-item">
            <div className="rack-card green-star">
              <Sparkles size={22} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
