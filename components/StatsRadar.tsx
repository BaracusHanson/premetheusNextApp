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
    <div className="h-full w-full">
      <ResponsiveRadar
        data={data}
        keys={['value']}
        indexBy="subject"
        maxValue={100} // Normalize to 100 for consistency
        margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color', modifiers: [] }}
        gridLevels={4}
        gridShape="circular"
        gridLabelOffset={24}
        enableDots={true}
        dotSize={8}
        dotColor="hsl(var(--background))" 
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={false} // Cleaner look without labels on dots
        colors={['hsl(var(--primary))']} // Use theme primary color
        fillOpacity={0.4}
        blendMode="normal"
        animate={true}
        motionConfig="gentle"
        theme={{
            axis: {
                ticks: {
                    text: {
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600
                    }
                }
            },
            grid: {
                line: {
                    stroke: "hsl(var(--border))",
                    strokeWidth: 1,
                    strokeDasharray: "4 4"
                }
            },
            dots: {
                text: {
                    fill: "hsl(var(--foreground))"
                }
            }
        }}
      />
    </div>
  );
}
