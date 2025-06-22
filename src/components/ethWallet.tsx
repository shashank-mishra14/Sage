import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Plus, Wallet as WalletIcon, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { SendTransaction } from './SendTransaction';

interface EthWalletProps {
  mnemonic: string;
}

interface WalletData {
  address: string;
  privateKey: string;
  balance: number;
  isLoading: boolean;
}

export const EthWallet = ({ mnemonic }: EthWalletProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [showPrivateKeys, setShowPrivateKeys] = useState<{[key: number]: boolean}>({});

  const fetchBalance = async (address: string): Promise<number> => {
    try {
      // Using Ethereum public RPC endpoint
      const response = await axios.post('https://ethereum-rpc.publicnode.com', {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      });
      
      if (response.data.result) {
        const balanceWei = parseInt(response.data.result, 16);
        return balanceWei / Math.pow(10, 18); // Convert Wei to ETH
      }
      return 0;
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return 0;
    }
  };

  const addWallet = async () => {
    if (!mnemonic) return;

    const seed = await mnemonicToSeed(mnemonic);
    const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    const privateKey = child.privateKey;
    const wallet = new Wallet(privateKey);
    
    const newWallet: WalletData = {
      address: wallet.address,
      privateKey: privateKey,
      balance: 0,
      isLoading: true
    };

    setWallets(prev => [...prev, newWallet]);
    setCurrentIndex(currentIndex + 1);

    // Fetch balance for the new wallet
    const balance = await fetchBalance(newWallet.address);
    setWallets(prev => prev.map((wallet, index) => 
      index === prev.length - 1 ? { ...wallet, balance, isLoading: false } : wallet
    ));
  };

  const refreshBalance = async (index: number) => {
    setWallets(prev => prev.map((wallet, i) => 
      i === index ? { ...wallet, isLoading: true } : wallet
    ));

    const balance = await fetchBalance(wallets[index].address);
    setWallets(prev => prev.map((wallet, i) => 
      i === index ? { ...wallet, balance, isLoading: false } : wallet
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePrivateKey = (index: number) => {
    setShowPrivateKeys(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-slate-300">Wallets ({wallets.length})</h4>
        <button
          onClick={addWallet}
          disabled={!mnemonic}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wallet</span>
        </button>
      </div>

      {wallets.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No wallets created yet</p>
          <p className="text-sm">Click "Add Wallet" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Wallet {index + 1}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-blue-400">
                        {wallet.isLoading ? (
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          `${wallet.balance.toFixed(6)} ETH`
                        )}
                      </span>
                      <button
                        onClick={() => refreshBalance(index)}
                        className="text-slate-400 hover:text-white transition-colors"
                        disabled={wallet.isLoading}
                      >
                        <RefreshCw className={`w-4 h-4 ${wallet.isLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400">Address</label>
                    <button
                      onClick={() => copyToClipboard(wallet.address)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 font-mono text-xs text-slate-300 break-all">
                    {wallet.address}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400">Private Key</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => togglePrivateKey(index)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {showPrivateKeys[index] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      {showPrivateKeys[index] && (
                        <button
                          onClick={() => copyToClipboard(wallet.privateKey)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 font-mono text-xs text-slate-300 break-all">
                    {showPrivateKeys[index] ? wallet.privateKey : '•'.repeat(66)}
                  </div>
                </div>
                
                {/* Send Transaction Button */}
                <div className="pt-3 border-t border-slate-600">
                  <SendTransaction
                    walletType="ETH"
                    fromAddress={wallet.address}
                    privateKey={wallet.privateKey}
                    balance={wallet.balance}
                    onTransactionSent={() => refreshBalance(index)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};