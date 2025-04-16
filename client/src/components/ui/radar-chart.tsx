import React from 'react';
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface PersonaRadarChartProps {
  data: {
    subject: string;
    value: number;
    fullMark: number;
  }[];
  colors?: {
    areaFill?: string;
    areaStroke?: string;
    gridStroke?: string;
  };
  width?: number;
  height?: number;
}

export function PersonaRadarChart({ 
  data, 
  colors = {
    areaFill: 'rgba(94, 96, 206, 0.2)',
    areaStroke: '#5E60CE',
    gridStroke: '#ddd'
  },
  width = 300,
  height = 300
}: PersonaRadarChartProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={colors.gridStroke} />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Persona Profile"
          dataKey="value"
          stroke={colors.areaStroke}
          fill={colors.areaFill}
          fillOpacity={0.6}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Score']} 
          labelFormatter={(label) => `${label} Learning`}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}