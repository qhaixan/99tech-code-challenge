import React from 'react'
import { WalletPage } from './WalletPage'

const App: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 font-sans text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 text-slate-100 text-left">
          Wallet Balances
        </h1>
        <div className="bg-slate-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
          <WalletPage />
        </div>
      </div>
    </div>
  )
}

export default App
