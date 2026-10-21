import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { EmissionRecord, TransportMode } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface TransportModeChartProps {
  emissions: EmissionRecord[];
}

export const TransportModeChart: React.FC<TransportModeChartProps> = ({ emissions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    const modeMap: Record<string, number> = {};

    emissions.forEach(e => {
      modeMap[e.transportMode] = (modeMap[e.transportMode] || 0) + e.co2EmissionsTons;
    });

    return Object.keys(modeMap).map(mode => ({
      name: mode,
      value: Math.round(modeMap[mode] * 10) / 10
    }));
  }, [emissions]);

  const COLORS: Record<string, string> = {
    'Road Freight (Truck)': '#3b82f6',
    'Air Freight': '#f43f5e',
    'Rail Freight': '#10b981',
    'Sea Freight (Container)': '#06b6d4'
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[entry.name] || '#64748b'}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
              borderRadius: '0.75rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              fontSize: '12px'
            }}
            formatter={(value: any) => [`${value} tCO₂e`, 'Emissions']}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '11px',
              color: isDark ? '#94a3b8' : '#64748b'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
