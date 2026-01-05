interface LoadingIndicatorProps {
    visible: boolean
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ visible }) => {
    if (!visible) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-700 font-medium">Processing your swap...</p>
            </div>
        </div>
    )
}

export default LoadingIndicator
