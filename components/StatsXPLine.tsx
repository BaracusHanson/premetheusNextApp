"use client";

import { ResponsiveLine } from '@nivo/line';

export function StatsXPLine() {
  // Mock data
  const data = [
    {
      id: "xp",
      color: "hsl(212, 70%, 50%)",
      data: [
        { x: "Jan", y: 100 },
        { x: "Feb", y: 300 },
        { x: "Mar", y: 450 },
        { x: "Apr", y: 800 },
        { x: "May", y: 1250 },
      ]
    }
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'XP',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableGridX={false}
        enableGridY={true}
      />
    </div>
  );
}
