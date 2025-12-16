export interface Account {
  id: number
  name: string
  code: string
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
}

export interface AccountsData {
  version: string
  lastUpdated: string
  accounts: Account[]
}