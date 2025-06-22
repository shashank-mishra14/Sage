import React, { useState } from 'react';
import { Send, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from './Toast';

interface SendTransactionProps {
  walletType: 'SOL' | 'ETH';
  fromAddress: string;
  privateKey: string;
  balance: number;
  onTransactionSent: () => void;
}

interface TransactionStatus {
  status: 'idle' | 'sending' | 'success' | 'error';
  message: string;
  txHash?: string;
}

export const SendTransaction: React.FC<SendTransactionProps> = ({
  walletType,
  fromAddress,
  privateKey,
  balance,
  onTransactionSent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    status: 'idle',
    message: ''
  });
  const { showToast } = useToast();

  const validateAddress = (address: string): boolean => {
    if (walletType === 'SOL') {
      // Basic Solana address validation (44 characters, base58)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    } else {
      // Basic Ethereum address validation (42 characters, hex)
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
  };

  const sendSolanaTransaction = async () => {
    try {
      const { Connection, PublicKey, SystemProgram, Transaction, Keypair, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
      
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      
      // Recreate keypair from private key
      const secretKeyArray = new Uint8Array(Buffer.from(privateKey, 'hex'));
      const keypair = Keypair.fromSecretKey(secretKeyArray);
      
      const toPublicKey = new PublicKey(toAddress);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: toPublicKey,
          lamports: lamports
        })
      );
      
      const signature = await connection.sendTransaction(transaction, [keypair]);
      
      setTxStatus({
        status: 'success',
        message: 'Transaction sent successfully!',
        txHash: signature
      });
      
      onTransactionSent();
    } catch (error: unknown) {
      setTxStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Transaction failed'
      });
    }
  };

  const sendEthereumTransaction = async () => {
    try {
      const { Wallet, JsonRpcProvider, parseEther } = await import('ethers');
      
      const provider = new JsonRpcProvider('https://ethereum-rpc.publicnode.com');
      const wallet = new Wallet(privateKey, provider);
      
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: parseEther(amount)
      });
      
      setTxStatus({
        status: 'success',
        message: 'Transaction sent successfully!',
        txHash: tx.hash
      });
      
      onTransactionSent();
    } catch (error: unknown) {
      setTxStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Transaction failed'
      });
    }
  };

  const handleSend = async () => {
    if (!validateAddress(toAddress)) {
      setTxStatus({
        status: 'error',
        message: `Invalid ${walletType} address format`
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setTxStatus({
        status: 'error',
        message: 'Please enter a valid amount'
      });
      return;
    }

    if (parseFloat(amount) > balance) {
      setTxStatus({
        status: 'error',
        message: 'Insufficient balance'
      });
      return;
    }

    setTxStatus({ status: 'sending', message: 'Sending transaction...' });

    if (walletType === 'SOL') {
      await sendSolanaTransaction();
    } else {
      await sendEthereumTransaction();
    }
  };

  const resetForm = () => {
    setToAddress('');
    setAmount('');
    setTxStatus({ status: 'idle', message: '' });
    setIsOpen(false);
  };

  const getStatusIcon = () => {
    switch (txStatus.status) {
      case 'sending':
        return <Loader className="w-5 h-5 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (txStatus.status) {
      case 'sending':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      case 'success':
        return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'error':
        return 'text-red-400 bg-red-900/20 border-red-500/30';
      default:
        return '';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm"
      >
        <Send className="w-4 h-4" />
        <span>Send</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 border border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Send {walletType}</h3>
          <button
            onClick={resetForm}
            className="text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* From Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From</label>
            <div className="bg-slate-900/50 rounded-lg p-3 text-sm text-slate-400 font-mono break-all">
              {fromAddress}
            </div>
          </div>

          {/* To Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">To Address</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder={`Enter ${walletType} address`}
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount ({walletType})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <div className="absolute right-3 top-2 text-sm text-slate-400">
                Balance: {balance.toFixed(6)}
              </div>
            </div>
            <button
              onClick={() => setAmount((balance * 0.9).toString())}
              className="text-xs text-purple-400 hover:text-purple-300 mt-1"
            >
              Use 90% of balance
            </button>
          </div>

          {/* Transaction Status */}
          {txStatus.status !== 'idle' && (
            <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm">{txStatus.message}</span>
              </div>
              {txStatus.txHash && (
                <div className="mt-2">
                  <a
                    href={
                      walletType === 'SOL'
                        ? `https://explorer.solana.com/tx/${txStatus.txHash}`
                        : `https://etherscan.io/tx/${txStatus.txHash}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 underline break-all"
                  >
                    View on Explorer: {txStatus.txHash}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={resetForm}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={txStatus.status === 'sending'}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {txStatus.status === 'sending' ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Transaction</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 