interface WalletRowProps {
  className?: string;
  currency: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

const WalletRow = ({ currency, amount, usdValue, formattedAmount }: WalletRowProps) => {
  const getIconUrl = (currency: string) => {
    try {
      return new URL(`../assets/token-icons/${currency}.svg`, import.meta.url).href;
    } catch (error) {
      return null;
    }
  };

  const iconUrl = getIconUrl(currency);

  return (
    <div className="p-4 sm:p-6 my-2 sm:my-3 border border-slate-600 rounded-lg flex justify-between items-start text-white bg-slate-900 transition-all duration-200 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4">
        {iconUrl ? (
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center p-2">
            <img
              src={iconUrl}
              alt={`${currency} icon`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl text-white">
            {currency.charAt(0)}
          </div>
        )}
        <div className="text-white">
          <div className="text-base sm:text-lg font-semibold mb-1 text-slate-50">
            {currency}
          </div>
          <div className="text-xs sm:text-sm text-slate-400">
            <strong>Amount:</strong> {formattedAmount}
          </div>
        </div>
      </div>
      <div className="text-base sm:text-lg font-bold text-slate-400">
        ${usdValue.toFixed(2)}
      </div>
    </div>
  );
};

export default WalletRow;
