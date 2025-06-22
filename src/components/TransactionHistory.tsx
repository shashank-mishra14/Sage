import React from 'react';
import { ExternalLink, Clock, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  currency: 'SOL' | 'ETH';
  from: string;
  to: string;
  hash: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  walletType: 'SOL' | 'ETH';
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  walletType
}) => {
  const getExplorerUrl = (hash: string, type: 'SOL' | 'ETH') => {
    if (type === 'SOL') {
      return `https://explorer.solana.com/tx/${hash}`;
    } else {
      return `https://etherscan.io/tx/${hash}`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-300 mb-3">Recent Transactions</h4>
      {transactions.slice(0, 5).map((tx) => (
        <div key={tx.id} className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(tx.status)}
              <div className="flex items-center space-x-1">
                <ArrowUpRight className="w-3 h-3 text-red-400" />
                <span className="text-sm font-medium text-white">
                  -{tx.amount.toFixed(6)} {tx.currency}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400">{formatDate(tx.timestamp)}</span>
          </div>
          
          <div className="text-xs text-slate-400 space-y-1">
            <div>To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}</div>
            <div className="flex items-center space-x-2">
              <span>Hash: {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}</span>
              <a
                href={getExplorerUrl(tx.hash, walletType)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 