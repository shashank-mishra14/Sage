# 🔮 Sage Wallet

A modern, multi-chain crypto wallet application built with React, TypeScript, and Vite. Sage Wallet supports both Solana and Ethereum blockchains, providing a secure and user-friendly interface for managing your digital assets.

## ✨ Features

- **Multi-Chain Support**: Full support for Solana (SOL) and Ethereum (ETH) blockchains
- **Secure Seed Phrase Generation**: Generate BIP39-compliant 12-word mnemonic phrases
- **HD Wallet Derivation**: Create multiple wallets from a single seed phrase
- **Transaction History**: View and track your transaction history with blockchain explorer links
- **Send Transactions**: Transfer SOL and ETH to other addresses
- **Modern UI**: Beautiful, responsive interface with glassmorphism design
- **Real-time Updates**: Live balance updates and transaction status tracking
- **Security First**: Private keys never leave your device

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sage-wallet.git
cd sage-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🛠️ Built With

### Core Technologies
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework

### Blockchain Libraries
- **@solana/web3.js** - Solana blockchain interaction
- **ethers.js** - Ethereum blockchain interaction
- **bip39** - Mnemonic phrase generation
- **ed25519-hd-key** - HD key derivation for Solana

### UI & UX
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations
- **@heroui/react** - UI component library

## 📱 Usage

### 1. Generate a New Wallet
- Click "Create New Wallet" to generate a secure 12-word seed phrase
- **Important**: Store your seed phrase securely - anyone with access can control your wallet

### 2. Add Wallets
- Generate Solana wallets using the SOL section
- Generate Ethereum wallets using the ETH section
- Each wallet has a unique address derived from your seed phrase

### 3. View Balances
- Wallet balances are automatically fetched and displayed
- Balances update in real-time

### 4. Send Transactions
- Click "Send" on any wallet
- Enter recipient address and amount
- Confirm the transaction
- Track status in transaction history

### 5. Transaction History
- View recent transactions for each wallet
- Click the external link icon to view on blockchain explorers
- Transaction status updates automatically

## 🔐 Security Features

- **Client-Side Key Generation**: All private keys are generated locally
- **No Key Transmission**: Private keys never leave your device
- **BIP39 Standard**: Industry-standard mnemonic phrase generation
- **HD Wallet Support**: Hierarchical deterministic wallet derivation
- **Secure Random Generation**: Cryptographically secure randomness

## 🌐 Supported Networks

### Solana
- **Mainnet**: Production Solana network
- **Explorer**: [Solana Explorer](https://explorer.solana.com/)
- **Features**: Fast transactions, low fees

### Ethereum
- **Mainnet**: Production Ethereum network  
- **Explorer**: [Etherscan](https://etherscan.io/)
- **Features**: Smart contracts, DeFi ecosystem

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── ethWallet.tsx      # Ethereum wallet component
│   ├── solWallet.tsx      # Solana wallet component
│   ├── SendTransaction.tsx # Transaction sending modal
│   ├── TransactionHistory.tsx # Transaction history display
│   └── Toast.tsx          # Toast notification system
├── App.tsx                # Main application component
├── main.tsx              # Application entry point
└── App.css               # Global styles
```

### Adding New Features

1. **New Blockchain Support**: 
   - Create new wallet component in `src/components/`
   - Add blockchain-specific web3 library
   - Implement key derivation logic

2. **UI Enhancements**:
   - Components use Tailwind CSS for styling
   - Icons from Lucide React library
   - Animations with Framer Motion

### Configuration

The project uses Vite with the following key configurations:
- **TypeScript**: Strict mode enabled
- **ESLint**: React and TypeScript rules
- **Node Polyfills**: Required for blockchain libraries
- **Tailwind CSS**: Modern styling approach

## ⚠️ Security Warnings

- **Testnet Only**: This application is for educational purposes
- **Seed Phrase Storage**: Never share or store seed phrases online
- **Private Keys**: Generated keys are your responsibility
- **Network Security**: Always verify recipient addresses
- **Production Use**: Additional security audits recommended

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana Labs](https://github.com/solana-labs) for excellent Web3.js library
- [Ethers.js](https://github.com/ethers-io/ethers.js/) for Ethereum integration
- [Vite](https://vitejs.dev/) for blazing fast development experience
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling utilities

## ⭐ Support

If you find this project helpful, please consider giving it a star on GitHub!

---

**Disclaimer**: This wallet is for educational and development purposes. Please use testnet funds only and never share your seed phrases or private keys.
