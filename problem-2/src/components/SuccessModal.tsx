interface SuccessModalProps {
    visible: boolean
    onClose: () => void
    amount: string
    fromCurrency: string
    toCurrency: string
    resultAmount: number
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose, amount, fromCurrency, toCurrency, resultAmount }) => {
    if (!visible) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-4">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Swap Successful!</h3>
                    <p className="text-gray-600 mb-6">
                        Your swap of {amount} {fromCurrency} to <span className="font-bold">{resultAmount.toFixed(6)} {toCurrency}</span> has been completed successfully.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessModal
