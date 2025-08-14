import React from 'react';
import type { Account } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Wifi } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AccountCardProps {
  account: Account;
  onClick?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  const { colors } = useTheme();
  const isNumbered = account.type === 'numbered';
  const isGold = !isNumbered; // GB account is gold
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const chartData = {
    labels: account.chartData.labels,
    datasets: [
      {
        data: account.chartData.values,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const gradientColors = isNumbered ? colors.numberedCardGradient : colors.gbCardGradient;
  
  // Format account number like credit card
  const formatAccountNumber = (num: string) => {
    // For GB accounts, don't show the account number
    if (num.startsWith('GB')) {
      return '';
    }
    // For numbered accounts, show masked number
    return `**** **** **** ${num.slice(-4)}`;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="relative p-6 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 50%, ${gradientColors[2]} 100%)`,
        aspectRatio: '1.586', // Credit card aspect ratio
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-black/10"></div>
      </div>
      
      {/* Metallic shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top section */}
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              {/* Chip */}
              <div className="w-10 h-8 rounded bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-sm flex items-center justify-center">
                <div className="w-8 h-6 rounded-sm bg-yellow-300/50 border border-yellow-400/30"></div>
              </div>
              {/* Contactless icon */}
              <Wifi size={20} className="text-white/60 rotate-90" />
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs font-medium">NOMOPAY</p>
              <p className="text-white/60 text-xs">{isGold ? 'GOLD' : 'PLATINUM'}</p>
            </div>
          </div>

          {/* Card number - only show for numbered accounts */}
          {isNumbered && (
            <div className="mb-4">
              <p className="text-white/80 text-sm font-mono tracking-wide">
                {formatAccountNumber(account.accountNumber)}
              </p>
            </div>
          )}

          {/* Name and expiry */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-xs uppercase">Card Holder</p>
              <p className="text-white/90 text-sm font-medium uppercase tracking-wide">
                {account.name.replace('Account', '').trim()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs uppercase">Valid Thru</p>
              <p className="text-white/90 text-sm font-mono">12/28</p>
            </div>
          </div>
        </div>

        {/* Bottom section with balance */}
        <div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-xs">Balance</p>
              <p className="text-white text-2xl font-bold font-heading">
                {account.currency === 'EUR' ? '€' : '$'}
                {account.balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            {/* Mini chart */}
            <div className="h-10 w-24 opacity-60">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Card brand logo */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-white/20"></div>
            <div className="w-8 h-8 rounded-full bg-white/20 -ml-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};