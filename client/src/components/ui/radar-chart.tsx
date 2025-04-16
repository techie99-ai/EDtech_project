import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

type RadarDataPoint = {
  subject: string;
  value: number;
  fullMark: number;
};

interface PersonaRadarChartProps {
  data: RadarDataPoint[];
  className?: string;
  colors?: {
    areaFill?: string;
    areaStroke?: string;
    gridStroke?: string;
  };
}

export function PersonaRadarChart({
  data,
  className,
  colors = {
    areaFill: 'rgba(94, 96, 206, 0.2)',
    areaStroke: '#5E60CE',
    gridStroke: '#e0e0e0',
  },
}: PersonaRadarChartProps) {
  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={colors.gridStroke} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} stroke="transparent" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke={colors.areaStroke}
            fill={colors.areaFill}
            fillOpacity={0.6}
            strokeWidth={2}
            dot={{ fill: colors.areaStroke, r: 4 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}