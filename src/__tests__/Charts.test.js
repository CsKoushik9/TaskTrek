import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PieChart, BarChart, LineChart } from '../components/Charts';

const mockData = [
  { label: 'Item 1', value: 10 },
  { label: 'Item 2', value: 20 },
  { label: 'Item 3', value: 30 },
];

const emptyData = [];
const singleData = [{ label: 'Single', value: 100 }];

describe('Charts Components', () => {
  describe('PieChart', () => {
    test('renders pie chart with title', () => {
      render(<PieChart data={mockData} title="Test Pie Chart" />);

      expect(screen.getByText('Test Pie Chart')).toBeInTheDocument();
    });

    test('renders chart data labels', () => {
      render(<PieChart data={mockData} title="Test Chart" />);

      expect(screen.getByText('Item 1: 10')).toBeInTheDocument();
      expect(screen.getByText('Item 2: 20')).toBeInTheDocument();
      expect(screen.getByText('Item 3: 30')).toBeInTheDocument();
    });

    test('handles total of zero', () => {
      const zeroTotalData = [{ label: 'Zero', value: 0 }];
      render(<PieChart data={zeroTotalData} title="Zero Total" />);
      expect(screen.getByText('Zero Total')).toBeInTheDocument();
    });

    test('renders SVG element with paths', () => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const { container } = render(
        <PieChart data={mockData} title="Test Chart" />
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('path')).toHaveLength(3);
    });
  });

  describe('BarChart', () => {
    test('renders bar chart with title', () => {
      render(<BarChart data={mockData} title="Test Bar Chart" />);

      expect(screen.getByText('Test Bar Chart')).toBeInTheDocument();
    });

    test('renders SVG element with bars', () => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const { container } = render(
        <BarChart data={mockData} title="Test Chart" />
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('rect')).toHaveLength(3);
    });

    test('renders data labels and values', () => {
      render(<BarChart data={mockData} title="Test Chart" />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });

  describe('LineChart', () => {
    test('renders line chart with title', () => {
      render(<LineChart data={mockData} title="Test Line Chart" />);

      expect(screen.getByText('Test Line Chart')).toBeInTheDocument();
    });

    test('renders SVG element with line and points', () => {
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const { container } = render(
        <LineChart data={mockData} title="Test Chart" />
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('polyline')).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelectorAll('circle')).toHaveLength(3);
    });

    test('renders data labels', () => {
      render(<LineChart data={mockData} title="Test Chart" />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    test('renders with two data points', () => {
      const twoPointData = [
        { label: 'Start', value: 5 },
        { label: 'End', value: 15 },
      ];
      render(<LineChart data={twoPointData} title="Two Points" />);
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles single data point in all charts', () => {
      const { rerender } = render(
        <BarChart data={singleData} title="Single Bar" />
      );
      expect(screen.getByText('Single Bar')).toBeInTheDocument();
      expect(screen.getAllByText('Single')).toHaveLength(1);

      rerender(<PieChart data={singleData} title="Single Pie" />);
      expect(screen.getByText('Single Pie')).toBeInTheDocument();
      expect(screen.getByText('Single: 100')).toBeInTheDocument();

      rerender(<LineChart data={singleData} title="Single Line" />);
      expect(screen.getByText('Single Line')).toBeInTheDocument();
      expect(screen.getAllByText('Single')).toHaveLength(1);
    });

    test('handles empty data in all charts', () => {
      render(<BarChart data={emptyData} title="Empty Bar" />);
      expect(screen.getByText('Empty Bar')).toBeInTheDocument();

      render(<PieChart data={emptyData} title="Empty Pie" />);
      expect(screen.getByText('Empty Pie')).toBeInTheDocument();

      render(<LineChart data={emptyData} title="Empty Line" />);
      expect(screen.getByText('Empty Line')).toBeInTheDocument();
    });

    test('handles zero values in data', () => {
      const zeroData = [
        { label: 'Zero', value: 0 },
        { label: 'Non-zero', value: 10 },
      ];
      render(<PieChart data={zeroData} title="Zero Values" />);
      expect(screen.getByText('Zero: 0')).toBeInTheDocument();
      expect(screen.getByText('Non-zero: 10')).toBeInTheDocument();
    });

    test('handles large arc in pie chart', () => {
      const largeArcData = [
        { label: 'Large', value: 80 },
        { label: 'Small', value: 20 },
      ];
      render(<PieChart data={largeArcData} title="Large Arc" />);
      expect(screen.getByText('Large: 80')).toBeInTheDocument();
    });

    test('handles zero max value in bar chart', () => {
      const zeroMaxData = [{ label: 'Zero', value: 0 }];
      render(<BarChart data={zeroMaxData} title="Zero Max" />);
      expect(screen.getByText('Zero Max')).toBeInTheDocument();
    });

    test('handles zero max value in line chart', () => {
      const zeroMaxData = [{ label: 'Zero', value: 0 }];
      render(<LineChart data={zeroMaxData} title="Zero Max Line" />);
      expect(screen.getByText('Zero Max Line')).toBeInTheDocument();
    });

    test('handles single point line chart', () => {
      const singlePointData = [{ label: 'Point', value: 50 }];
      render(<LineChart data={singlePointData} title="Single Point" />);
      expect(screen.getByText('Single Point')).toBeInTheDocument();
      expect(screen.getByText('Point')).toBeInTheDocument();
    });

    test('handles multiple data points with same value', () => {
      const sameValueData = [
        { label: 'A', value: 10 },
        { label: 'B', value: 10 },
        { label: 'C', value: 10 },
      ];
      render(<BarChart data={sameValueData} title="Same Values" />);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    test('renders many data points', () => {
      const manyData = Array.from({ length: 10 }, (_, i) => ({
        label: `Item ${i + 1}`,
        value: i + 1,
      }));
      render(<PieChart data={manyData} title="Many Items" />);
      expect(screen.getByText('Many Items')).toBeInTheDocument();
      expect(screen.getByText('Item 1: 1')).toBeInTheDocument();
      expect(screen.getByText('Item 10: 10')).toBeInTheDocument();
    });
  });
});
