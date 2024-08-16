'use client';
import { useEffect, useState } from 'react';

export default function LineGraph(props: any) {
  const [pathData, setPathData] = useState('M 20 320');
  const { multiplier } = props;
  
  useEffect(() => {
    if (multiplier == 0) {
      setPathData('M 20 320');
    } else {
      const x = multiplier * 50 + 20;
      const y = 300 - Math.pow(multiplier, 2) * 3 + 20;
      setPathData((prev) => `${prev} L ${x} ${y}`);
    }
  }, [multiplier]);

  return (
    <svg width={540} height={400} style={{ backgroundColor: '#000' }}>
      <line x1={20} y1={320} x2={520} y2={320} stroke='white' strokeWidth={2} />
      {[...Array(11)].map((_, i) => (
        <text
          x={i * 50 + 20}
          y={340}
          key={i}
          fill='white'
          fontSize={12}
          textAnchor='middle'
        >
          {i}
        </text>
      ))}
      <path d={pathData} stroke='red' strokeWidth={4} fill='transparent' />
      <circle
        cx={multiplier * 50 + 20}
        cy={300 - Math.pow(multiplier, 2) * 3 + 20}
        r={10}
        fill='yellow'
      />

      <text
        x={280}
        y={50}
        fill='red'
        fontWeight='bold'
        fontSize={40}
        textAnchor='middle'
      >
        {multiplier?.toFixed(2)}x
      </text>
    </svg>
  );
}
