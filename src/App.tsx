import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import type { Tab, Screen, Transaction } from './types'
import { StatusBar } from './components/StatusBar'
import { BottomNav } from './components/BottomNav'
import { HomeScreen } from './components/HomeScreen'
import { WalletScreen } from './components/WalletScreen'
import { BankScreen } from './components/BankScreen'
import { RewardsScreen } from './components/RewardsScreen'
import { KeeperScreen } from './components/KeeperScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { CheckBalanceSheet } from './components/CheckBalanceSheet'
import { YourQrSheet } from './components/YourQrSheet'
import { PaymentFlow } from './components/PaymentFlow'
import './App.css'

const STORAGE_KEY = 'fampay-experimental-transactions'

function loadSavedTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function App() {
  const isNativePlatform = Capacitor.isNativePlatform()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [screen, setScreen] = useState<Screen>('main')

  // Modals & Sheets
  const [checkBalanceOpen, setCheckBalanceOpen] = useState(false)
  const [yourQrOpen, setYourQrOpen] = useState(false)

  // In-place camera state on Home
  const [isScanning, setIsScanning] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [scanError, setScanError] = useState('')

  // Payment State
  const [recipient, setRecipient] = useState('shani')
  const [amount, setAmount] = useState('95')
  const [qrReference, setQrReference] = useState('paytm.s2fnmv1@pty')
  const [transactions, setTransactions] = useState<Transaction[]>(loadSavedTransactions)
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  function handleQrDetected(data: string) {
    setIsScanning(false)
    setQrReference(data)
    // Extract recipient if possible, default to shani
    if (data.includes('shani') || data.includes('s2fnmv1')) {
      setRecipient('shani')
    } else if (data.includes('vimlendra')) {
      setRecipient('Vimlendra Mishra')
    } else {
      setRecipient(data.split('@')[0] || 'shani')
    }
    setAmount('95')
    setScreen('payment')
  }

  async function handleFileUpload(file: File) {
    setScanError('')
    const url = URL.createObjectURL(file)
    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser')
      const result = await new BrowserQRCodeReader().decodeFromImageUrl(url)
      handleQrDetected(result.getText())
    } catch {
      setScanError('No QR detected in that image. Try a clearer image.')
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  function handleDirectPay(name: string) {
    setRecipient(name)
    const contactId = name.toLowerCase().replace(/\s+/g, '')
    setQrReference(contactId === 'shani' ? 'paytm.s2fnmv1@pty' : `${contactId}@fam`)
    setAmount('95')
    setScreen('payment')
  }

  function handlePaymentComplete(tx: Transaction) {
    setLastTransaction(tx)
    setTransactions((prev) => [tx, ...prev])
  }

  function handleResetToHome() {
    setIsScanning(false)
    setScreen('main')
    setActiveTab('home')
  }

  const isFullscreenFlow = ['recipient', 'payment', 'success', 'history'].includes(screen)

  return (
    <div className="mobile-device-viewport">
      <div className={`fampay-app-frame ${isNativePlatform ? 'native-app' : ''} ${screen === 'success' ? 'receipt-frame-theme' : ''}`}>
        {/* Status Bar */}
        {!isNativePlatform && (
          <StatusBar
            time={screen === 'success' ? '21:42' : '00:06'}
            battery={screen === 'success' ? '17%' : '49%'}
          />
        )}

        {/* Main Content Area */}
        <main className="app-main-body">
          {screen === 'history' ? (
            <HistoryScreen
              transactions={transactions}
              onBack={handleResetToHome}
              onSelectTransaction={(tx) => {
                setLastTransaction(tx)
                setScreen('success')
              }}
            />
          ) : isFullscreenFlow ? (
            <PaymentFlow
              screen={screen}
              onSetScreen={setScreen}
              recipient={recipient}
              onSetRecipient={setRecipient}
              amount={amount}
              onSetAmount={setAmount}
              qrReference={qrReference}
              onPaymentComplete={handlePaymentComplete}
              lastTransaction={lastTransaction}
              onResetToHome={handleResetToHome}
              onViewHistory={() => setScreen('history')}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  isScanning={isScanning}
                  onToggleScan={() => {
                    setIsScanning((v) => !v)
                    setScanError('')
                  }}
                  onOpenYourQr={() => setYourQrOpen(true)}
                  onOpenCheckBalance={() => setCheckBalanceOpen(true)}
                  onOpenHistory={() => setScreen('history')}
                  onQrDetected={handleQrDetected}
                  torchOn={torchOn}
                  onToggleTorch={() => setTorchOn((v) => !v)}
                  scanError={scanError}
                  onFileUpload={handleFileUpload}
                  onDirectPay={handleDirectPay}
                />
              )}

              {activeTab === 'wallet' && (
                <WalletScreen
                  walletBalance={186}
                  upiId="8800274561@fam"
                  userName="Harsh Pandey"
                  onAddMoney={() => setCheckBalanceOpen(true)}
                />
              )}

              {activeTab === 'bank' && (
                <BankScreen onLinkBank={() => setCheckBalanceOpen(true)} />
              )}

              {activeTab === 'rewards' && <RewardsScreen />}

              {activeTab === 'keeper' && <KeeperScreen userName="Harsh's Keeper" />}
            </>
          )}
        </main>

        {/* Bottom Navigation (Only visible on main 5 tabs) */}
        {!isFullscreenFlow && (
          <BottomNav
            activeTab={activeTab}
            onChangeTab={(tab) => {
              setIsScanning(false)
              setScreen('main')
              setActiveTab(tab)
            }}
          />
        )}

        {/* Global Bottom Sheets */}
        <CheckBalanceSheet
          isOpen={checkBalanceOpen}
          onClose={() => setCheckBalanceOpen(false)}
          walletBalance={186}
          onAddMoney={() => alert('Add money simulated')}
          onLinkBank={() => alert('Link bank account simulated')}
        />

        <YourQrSheet
          isOpen={yourQrOpen}
          onClose={() => setYourQrOpen(false)}
          upiId="8800274561@fam"
        />
      </div>
    </div>
  )
}

export default App
