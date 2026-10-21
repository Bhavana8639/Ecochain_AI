import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { EmissionRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MonthlyTrendChartProps {
  emissions: EmissionRecord[];
  targetMonthlyThreshold?: number;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  emissions,
  targetMonthlyThreshold = 80
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    const monthlyMap: Record<string, number> = {};

    // Group emissions by YYYY-MM
    emissions.forEach(e => {
      const monthKey = e.date ? e.date.slice(0, 7) : '2026-07';
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + e.co2EmissionsTons;
    });

    const keys = Object.keys(monthlyMap).sort();
    
    // Fill up to last 6 months
    return keys.map(key => {
      const [year, month] = key.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('default', { month: 'short' });
      const tons = Math.round(monthlyMap[key] * 10) / 10;
      return {
        month: `${monthName} ${year.slice(2)}`,
        emissions: tons,
        target: targetMonthlyThreshold
      };
    });
  }, [emissions, targetMonthlyThreshold]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
          
          <XAxis
            dataKey="month"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={11}
            tickLine={false}
          />

          <YAxis
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={11}
            tickLine={false}
            unit=" t"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#cbd5e1',
              borderRadius: '0.75rem',
              color: isDark ? '#f8fafc' : '#0f172a',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
            formatter={(value: any) => [`${value} tCO₂e`, 'Monthly Emissions']}
          />

          <ReferenceLine
            y={targetMonthlyThreshold}
            label={{
              value: `Net-Zero Cap (${targetMonthlyThreshold} tCO₂e)`,
              fill: '#f59e0b',
              fontSize: 10,
              position: 'insideTopRight'
            }}
            stroke="#f59e0b"
            strokeDasharray="4 4"
          />

          <Area
            type="monotone"
            dataKey="emissions"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorEmissions)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
