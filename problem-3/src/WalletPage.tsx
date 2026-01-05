import React, { useMemo, useState, useEffect } from 'react';
import WalletRow from './components/WalletRow';
// fix: added missing `blockchain` property
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
// improvement: extend WalletBalance instead of duplicating fields
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  // fix: added missing `usdValue` property
  usdValue: number;
}
// added BoxProps
interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}
interface Props extends BoxProps { }

// added hooks
const useWalletBalances = (): WalletBalance[] => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  useEffect(() => {
    setBalances([
      {
        currency: 'ETH',
        amount: 1.062532,
        blockchain: 'Ethereum',
      },
      {
        currency: 'OSMO',
        amount: 2.062532,
        blockchain: 'Osmosis',
      }
    ])
  }, []);
  return balances;
};
const usePrices = (): Record<string, number> => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  useEffect(() => {
    setPrices({
      ETH: 2300,
      OSMO: 0.75,
      NEO: 12.4
    })
  }, []);
  return prices;
};

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // define classes object for styling
  const classes = {
    row: 'flex items-center justify-between p-2 border-b'
  };

  // improvement: replaced parameter type `any` with `string`
  const getPriority = (blockchain: string): number => blockchainPriority[blockchain] ?? -99;
  // improvement: use map instead of switch for maintainability
  const blockchainPriority: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20
  };

  const formattedBalances = useMemo(() => {
    return balances
    // improvement: simplify filter and sort function
    .filter(balance => getPriority(balance.blockchain) > -99 && balance.amount > 0)
    .sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain))
    // improvement: add formatted and usdValue properties here for easier maintainability
    .map(balance => ({
      ...balance,
      // fix: format decimal point (usually 4 to 8 decimal places for cryptocurrency)
      formatted: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(balance.amount),
      usdValue: (prices[balance.currency] ?? 0) * balance.amount
    }));
}, [balances, prices]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    return (
      <WalletRow
        className={classes.row}
        /* improvement: changed key from array index to currency */
        key={`${balance.currency}-${balance.blockchain}`}
        currency={balance.currency}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
