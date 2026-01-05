import { calculateSwapResult } from '../utils/swapUtils'
interface PriceMap {
    [symbol: string]: number
}

interface RateDisplayProps {
    pricesLoading: boolean
    prices: PriceMap
    from: string
    to: string
    amount: string
}

const RateDisplay: React.FC<RateDisplayProps> = ({ pricesLoading, prices, from, to, amount }) => {
    if (pricesLoading) {
        return <div className="text-sm text-gray-500 mb-4">Loading rates...</div>
    }

    if (!prices[from] || !prices[to]) {
        return <div className="text-sm text-gray-500 mb-4">Rate unavailable</div>
    }

    const calculatedAmount = calculateSwapResult(prices, from, to, amount)

    return (
        <div className="text-sm text-gray-500 mb-4">
            Rate: {amount} {from} ≈ {calculatedAmount.toFixed(6)} {to}
        </div>
    )
}

export default RateDisplay
