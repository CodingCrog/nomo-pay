import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { AccountsOverview } from './pages/AccountsOverview';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { TransferPage } from './pages/TransferPage';
import { ReceivePage } from './pages/ReceivePage';
import { ExchangePage } from './pages/ExchangePage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { BeneficiariesPage } from './pages/BeneficiariesPageBackend';
import { SettingsPage } from './pages/SettingsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MorePage } from './pages/MorePage';
import { useTheme } from './context/ThemeContext';
import { ConnectionStatus } from './components/ConnectionStatus';
import { NotificationContainer } from './components/Notification';
import { DebugContainer } from './components/debug/DebugContainer';

function App() {
  const { colors, colorMode } = useTheme();
  
  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300 relative" style={{ backgroundColor: colors.background1 }}>
        {/* Debug Container - Only in development */}
        <DebugContainer />
        
        {/* Notifications */}
        <NotificationContainer />
        
        {/* Connection Status Indicator */}
        <ConnectionStatus />
        
        {/* Global background pattern */}
        <div 
          className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: colorMode === 'dark' 
              ? 'url(/images/dark-background.png)' 
              : 'url(/images/light-background.png)'
          }}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountsOverview />} />
          <Route path="/accounts/:accountId" element={<AccountsOverview />} />
          <Route path="/accounts/:accountId/transactions/:currencyCode" element={<TransactionHistoryPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/more" element={<MorePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;