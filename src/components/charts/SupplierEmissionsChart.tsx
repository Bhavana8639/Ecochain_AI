import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { Supplier } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SupplierEmissionsChartProps {
  suppliers: Supplier[];
}

export const SupplierEmissionsChart: React.FC<SupplierEmissionsChartProps> = ({ suppliers }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    return [...suppliers]
      .sort((a, b) => b.totalEmissionsTons - a.totalEmissionsTons)
      .slice(0, 6)
      .map(s => ({
        name: s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name,
        emissions: Math.round(s.totalEmissionsTons * 10) / 10,
        risk: s.riskLevel
      }));
  }, [suppliers]);

  const getBarColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
          
          <XAxis
            type="number"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={11}
            tickLine={false}
            unit=" t"
          />

          <YAxis
            type="category"
            dataKey="name"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={11}
            tickLine={false}
            width={120}
          />

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

          <Bar dataKey="emissions" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.risk)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
