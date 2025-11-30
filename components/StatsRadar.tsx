"use client";

import { ResponsiveRadar } from '@nivo/radar';

interface StatsRadarProps {
  data: {
    subject: string;
    value: number;
    fullMark: number;
  }[];
}

export function StatsRadar({ data }: StatsRadarProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveRadar
        data={data}
        keys={['value']}
        indexBy="subject"
        maxValue="auto"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
      />
    </div>
  );
}
