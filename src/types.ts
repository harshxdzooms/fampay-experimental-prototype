export type Transaction = {
  id: string
  recipient: string
  upiId?: string
  amount: number
  reference: string
  createdAt: string
  note?: string
}

export type Tab = 'bank' | 'wallet' | 'home' | 'rewards' | 'keeper'
export type Screen = 'main' | 'history' | 'recipient' | 'payment' | 'success'
