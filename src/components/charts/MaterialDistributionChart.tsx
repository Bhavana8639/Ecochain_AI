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
import { EmissionRecord } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface MaterialDistributionChartProps {
  emissions: EmissionRecord[];
}

export const MaterialDistributionChart: React.FC<MaterialDistributionChartProps> = ({ emissions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    const materialMap: Record<string, number> = {};

    emissions.forEach(e => {
      materialMap[e.materialCategory] = (materialMap[e.materialCategory] || 0) + e.co2EmissionsTons;
    });

    return Object.keys(materialMap).map(mat => ({
      name: mat.length > 15 ? mat.substring(0, 13) + '...' : mat,
      emissions: Math.round(materialMap[mat] * 10) / 10
    })).sort((a, b) => b.emissions - a.emissions);
  }, [emissions]);

  const COLORS = ['#10b981', '#0d9488', '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
          
          <XAxis
            dataKey="name"
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={10}
            tickLine={false}
            angle={-25}
            textAnchor="end"
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
              fontSize: '12px'
            }}
            formatter={(value: any) => [`${value} tCO₂e`, 'Material Footprint']}
          />

          <Bar dataKey="emissions" radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
