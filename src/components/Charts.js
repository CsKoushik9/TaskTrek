import React from 'react';

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    '#007bff',
    '#28a745',
    '#ffc107',
    '#dc3545',
    '#17a2b8',
    '#6c757d',
  ];

  let cumulativePercentage = 0;

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h4>{title}</h4>
      <svg width="200" height="200" style={{ margin: '0 auto' }}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const startAngle = (cumulativePercentage / 100) * 360;
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360;

          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);

          const largeArcFlag = percentage > 50 ? 1 : 0;

          const x1 = 100 + 80 * Math.cos(startAngleRad);
          const y1 = 100 + 80 * Math.sin(startAngleRad);
          const x2 = 100 + 80 * Math.cos(endAngleRad);
          const y2 = 100 + 80 * Math.sin(endAngleRad);

          const pathData = [
            `M 100 100`,
            `L ${x1} ${y1}`,
            `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');

          cumulativePercentage += percentage;

          return (
            <path
              key={index}
              d={pathData}
              fill={colors[index % colors.length]}
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div style={{ marginTop: '10px' }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{ display: 'inline-block', margin: '5px', fontSize: '12px' }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: colors[index % colors.length],
                marginRight: '5px',
              }}
            ></span>
            {item.label}: {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const colors = [
    '#007bff',
    '#28a745',
    '#ffc107',
    '#dc3545',
    '#17a2b8',
    '#6c757d',
  ];

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h4>{title}</h4>
      <svg width="300" height="200" style={{ margin: '0 auto' }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 150;
          const barWidth = 30;
          const x = 20 + index * 40;
          const y = 170 - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={colors[index % colors.length]}
              />
              <text
                x={x + barWidth / 2}
                y={185}
                textAnchor="middle"
                fontSize="10"
                fill="#333"
              >
                {item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#333"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const LineChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map((item) => item.value));
  const width = 300;
  const height = 150;
  const padding = 20;

  const points = data
    .map((item, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y =
        height - padding - (item.value / maxValue) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h4>{title}</h4>
      <svg width={width} height={height + 40} style={{ margin: '0 auto' }}>
        <polyline
          points={points}
          fill="none"
          stroke="#007bff"
          strokeWidth="2"
        />
        {data.map((item, index) => {
          const x =
            padding + (index / (data.length - 1)) * (width - 2 * padding);
          const y =
            height - padding - (item.value / maxValue) * (height - 2 * padding);

          return (
            <g key={index}>
              <circle cx={x} cy={y} r="3" fill="#007bff" />
              <text
                x={x}
                y={height + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#333"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export { PieChart, BarChart, LineChart };
