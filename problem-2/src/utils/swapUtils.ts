interface PriceMap {
    [symbol: string]: number
}

export const calculateSwapResult = (
    prices: PriceMap,
    fromCurrency: string,
    toCurrency: string,
    amount: string
): number => {
    if (!prices[fromCurrency] || !prices[toCurrency]) {
        return 0
    }

    return (prices[fromCurrency] / prices[toCurrency]) * Number(amount)
}
