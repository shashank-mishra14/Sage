import { useState } from 'react'
import './App.css'
import { generateMnemonic } from "bip39";
import { SolanaWallet } from './components/solWallet';
import { EthWallet } from './components/ethWallet';
import { ToastProvider } from './components/Toast';
import { Wallet, Shield, Key, Sparkles, Eye, EyeOff } from 'lucide-react';

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMnemonic = async () => {
    setIsGenerating(true);
    try {
      const mn = await generateMnemonic();
      setMnemonic(mn);
      setShowMnemonic(true);
    } catch (error) {
      console.error('Error generating mnemonic:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="fixed inset-0 bg-slate-900 opacity-40"></div>
      
      <div className="relative min-h-screen flex flex-col">
        <header className="w-full py-6 px-4 backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Sage Wallet</h1>
                <p className="text-sm text-purple-200">Multi-chain crypto wallet</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-purple-200">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-3">
                    <Key className="w-8 h-8 text-purple-400" />
                    <span>Generate Seed Phrase</span>
                  </h2>
                  <p className="text-purple-200">Create a new wallet with a secure 12-word seed phrase</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center">
                    <button
                      onClick={handleGenerateMnemonic}
                      disabled={isGenerating}
                      className="relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Create New Wallet</span>
                        </>
                      )}
                    </button>
                  </div>

                  {mnemonic && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Your Seed Phrase</h3>
                        <button
                          onClick={() => setShowMnemonic(!showMnemonic)}
                          className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
                        >
                          {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="text-sm">{showMnemonic ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      
                      <div className="relative">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-4 font-mono text-white">
                          {showMnemonic ? (
                            <div className="grid grid-cols-3 gap-3">
                              {mnemonic.split(' ').map((word, index) => (
                                <div key={index} className="bg-slate-700/50 rounded-lg p-3 text-center">
                                  <span className="text-xs text-slate-400 block">{index + 1}</span>
                                  <span className="text-sm font-medium">{word}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-400">
                              Click "Show" to reveal your seed phrase
                            </div>
                          )}
                        </div>
                        
                        {showMnemonic && (
                          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <p className="text-amber-200 text-sm">
                              ⚠️ <strong>Security Warning:</strong> Store this seed phrase securely. Anyone with access to it can control your wallet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {mnemonic && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">SOL</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Solana Wallets</h3>
                      <p className="text-sm text-slate-300">Fast & low-cost transactions</p>
                    </div>
                  </div>
                  <SolanaWallet mnemonic={mnemonic} />
                </div>

                <div className="backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">ETH</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Ethereum Wallets</h3>
                      <p className="text-sm text-slate-300">Smart contracts & DeFi</p>
                    </div>
                  </div>
                  <EthWallet mnemonic={mnemonic} />
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="py-6 px-4 backdrop-blur-sm bg-white/5 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-purple-200 text-sm">
              Built with ❤️ using React, TypeScript & Web3 technologies
            </p>
          </div>
        </footer>
      </div>
    </div>
    </ToastProvider>
  )
}

export default App
