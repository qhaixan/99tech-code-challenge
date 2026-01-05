import { useEffect, useState } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { Listbox, Transition } from '@headlessui/react'
import LoadingIndicator from './LoadingIndicator'
import SuccessModal from './SuccessModal'
import RateDisplay from './RateDisplay'
import { calculateSwapResult } from '../utils/swapUtils'

const TokenIcon = ({ tokenSymbol }: { tokenSymbol: string }) => {
  const getIconUrl = (tokenSymbol: string) => {
    try {
      return new URL(`../assets/token-icons/${tokenSymbol}.svg`, import.meta.url).href;
    } catch (error) {
      return null;
    }
  };

  const iconUrl = getIconUrl(tokenSymbol);

  return (
    <div className="w-6 h-6 mr-2 flex items-center justify-center">
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={`${tokenSymbol} icon`}
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-full"></div>
      )}
    </div>
  );
}

const TokenDropdown = ({
  tokens,
  selectedToken,
  onChange,
  className = ''
}: {
  tokens: string[];
  selectedToken: string;
  onChange: (value: string) => void;
  className?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      <Listbox value={selectedToken} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between">
            <div className="flex items-center">
              <TokenIcon tokenSymbol={selectedToken} />
              <span>{selectedToken}</span>
            </div>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {tokens.map(token => (
                <Listbox.Option
                  key={token}
                  value={token}
                  className={({ active }: { active: boolean }) =>
                    `w-full p-3 text-left flex items-center cursor-pointer ${
                      active ? 'bg-gray-100' : ''
                    }`
                  }
                >
                  {({ selected }: { selected: boolean }) => (
                    <>
                      <TokenIcon tokenSymbol={token} />
                      <span>{token}</span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

interface PriceMap {
    [symbol: string]: number
}

export default function SwapForm() {
    const [prices, setPrices] = useState<PriceMap>({})
    const [pricesLoading, setPricesLoading] = useState(true)
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [amount, setAmount] = useState('1')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [resultAmount, setResultAmount] = useState(0)

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                setPricesLoading(true)
                const response = await fetch('https://interview.switcheo.com/prices.json')
                const data: { currency: string, price: number }[] = await response.json()

                const priceMap: PriceMap = {}
                data.forEach(item => {
                    priceMap[item.currency] = item.price
                })
                setPrices(priceMap)

                const availableTokens = Object.keys(priceMap)
                if (availableTokens.length >= 2) {
                    setFrom(availableTokens[0])
                    setTo(availableTokens[1])
                } else if (availableTokens.length === 1) {
                    setFrom(availableTokens[0])
                    setTo(availableTokens[0])
                }
            } catch (err) {
                console.error('Failed to fetch prices', err)
            } finally {
                setPricesLoading(false)
            }
        }

        fetchPrices()
    }, [])

    const tokens = Object.keys(prices)

    const validateSwap = (): boolean => {
        if (from === to) {
            setError('Cannot swap the same currency')
            return false
        }
        if (!amount || Number(amount) <= 0) {
            setError('Enter a valid amount')
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateSwap()) return

        setError('')
        setLoading(true)

        await new Promise(resolve => setTimeout(resolve, 1500))

        const calculatedResult = calculateSwapResult(prices, from, to, amount)
        setResultAmount(calculatedResult)

        setLoading(false)
        setShowSuccessModal(true)
    }

    const handleSwapCurrencies = () => {
        setFrom(to)
        setTo(from)
    }

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false)
    }

    return (
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Confirm Swap</h1>

            <div className="space-y-4">
                <div>
                    <label className="text-sm block mb-1">From</label>
                    <div className="flex flex-col md:flex-row gap-2">
                        <TokenDropdown
                            tokens={tokens}
                            selectedToken={from}
                            onChange={setFrom}
                            className="w-full md:flex-1"
                        />
                        <input
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.0"
                            className="w-full md:flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleSwapCurrencies}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        type="button"
                        aria-label="Swap currencies"
                    >
                        <ArrowsUpDownIcon className="w-5 h-5" />
                    </button>
                </div>

                <div>
                    <label className="text-sm block mb-1">To</label>
                    <TokenDropdown
                        tokens={tokens}
                        selectedToken={to}
                        onChange={setTo}
                        className="w-full"
                    />
                </div>

                <RateDisplay
                    pricesLoading={pricesLoading}
                    prices={prices}
                    from={from}
                    to={to}
                    amount={amount}
                />

                {error && (
                    <div className="text-red-600 text-sm font-medium">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? 'Confirming...' : 'Confirm Swap'}
                </button>
            </div>

            <LoadingIndicator visible={loading} />
            <SuccessModal
                visible={showSuccessModal}
                onClose={handleCloseSuccessModal}
                amount={amount}
                fromCurrency={from}
                toCurrency={to}
                resultAmount={resultAmount}
            />
        </div>
    )
}
