import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

interface HSKRadarChartProps {
  data: RadarData[];
}

export default function HSKRadarChart({ data }: HSKRadarChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(26, 26, 26, 0.07)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(26, 26, 26, 0.4)', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Scholar"
            dataKey="A"
            stroke="#C41E3A"
            fill="#C41E3A"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
