import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Analytics from '../components/Analytics';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getTasks: () => mockTasks,
    getProjects: () => mockProjects,
  },
  WORKFLOW_STATUSES: {
    SCREEN: 'screen',
    IN_PROGRESS: 'in-progress',
    CODE_REVIEW: 'code-review',
    CODE_COMPLETE: 'code-complete',
    QA_VERIFY: 'qa-verify',
    RESOLVED: 'resolved',
  },
}));

// Mock Charts
jest.mock('../components/Charts', () => ({
  PieChart: ({ title }) => <div data-testid="pie-chart">{title}</div>,
  BarChart: ({ title }) => <div data-testid="bar-chart">{title}</div>,
  LineChart: ({ title }) => <div data-testid="line-chart">{title}</div>,
}));

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    status: 'screen',
    priority: 'high',
    projectId: 'default',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Task 2',
    status: 'resolved',
    priority: 'medium',
    projectId: 'default',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Task 3',
    status: 'in-progress',
    priority: 'low',
    projectId: 'default',
    createdAt: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z', // Today
    updatedAt: new Date().toISOString(),
  },
];

const mockProjects = [{ id: 'default', name: 'Default Project' }];

const mockProps = {
  onClose: jest.fn(),
};

describe('Analytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocks to default values
    const { storage } = require('../utils/storage');
    storage.getTasks = () => mockTasks;
    storage.getProjects = () => mockProjects;
  });

  test('renders analytics dashboard correctly', () => {
    render(<Analytics {...mockProps} />);

    expect(screen.getByText('📊 Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  test('displays correct task metrics', () => {
    render(<Analytics {...mockProps} />);

    expect(screen.getByText('3')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('33%')).toBeInTheDocument(); // Completion rate
    expect(screen.getByText('1')).toBeInTheDocument(); // Active projects
  });

  test('renders all chart types', () => {
    render(<Analytics {...mockProps} />);

    expect(screen.getAllByTestId('pie-chart')).toHaveLength(2);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('handles time range selection', () => {
    render(<Analytics {...mockProps} />);

    const timeRangeSelect = screen.getByDisplayValue('Last 7 days');
    fireEvent.change(timeRangeSelect, { target: { value: '30' } });

    expect(timeRangeSelect.value).toBe('30');
  });

  test('handles close button click', () => {
    render(<Analytics {...mockProps} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('displays chart titles correctly', () => {
    render(<Analytics {...mockProps} />);

    expect(screen.getByText('Tasks by Status')).toBeInTheDocument();
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
    expect(screen.getByText('Tasks by Project')).toBeInTheDocument();
    expect(screen.getByText('Tasks Created Over Time')).toBeInTheDocument();
  });

  test('handles empty tasks array', () => {
    const { storage } = require('../utils/storage');
    storage.getTasks = () => [];
    storage.getProjects = () => [];

    render(<Analytics {...mockProps} />);

    expect(screen.getAllByText('0')).toHaveLength(3); // Total tasks, avg days, active projects
    expect(screen.getByText('0%')).toBeInTheDocument(); // Completion rate
  });

  test('calculates metrics with unknown status tasks', () => {
    const { storage } = require('../utils/storage');
    storage.getTasks = () => [
      {
        id: '1',
        status: 'unknown-status',
        priority: 'unknown-priority',
        projectId: 'unknown-project',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    render(<Analytics {...mockProps} />);

    expect(screen.getAllByText('1')).toHaveLength(2); // Total tasks and active projects
  });

  test('calculates average time to complete correctly', () => {
    const { storage } = require('../utils/storage');
    storage.getTasks = () => [
      {
        id: '1',
        status: 'resolved',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z', // 1 day later
      },
      {
        id: '2',
        status: 'resolved',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-04T00:00:00.000Z', // 3 days later
      },
    ];

    render(<Analytics {...mockProps} />);

    expect(screen.getAllByText('2')).toHaveLength(2); // Total tasks and avg days
  });

  test('handles tasks without createdAt timestamp', () => {
    const { storage } = require('../utils/storage');
    storage.getTasks = () => [
      {
        id: '1',
        status: 'screen',
        priority: 'high',
        projectId: 'default',
        // Missing createdAt
      },
    ];

    render(<Analytics {...mockProps} />);

    expect(screen.getAllByText('1')).toHaveLength(2); // Total tasks and active projects
  });

  test('handles different time ranges', () => {
    render(<Analytics {...mockProps} />);

    const timeRangeSelect = screen.getByDisplayValue('Last 7 days');

    fireEvent.change(timeRangeSelect, { target: { value: '14' } });
    expect(timeRangeSelect.value).toBe('14');

    fireEvent.change(timeRangeSelect, { target: { value: '30' } });
    expect(timeRangeSelect.value).toBe('30');
  });

  test('handles projects with missing names', () => {
    const { storage } = require('../utils/storage');
    storage.getProjects = () => [{ id: 'test' }]; // Missing name
    storage.getTasks = () => [
      {
        id: '1',
        projectId: 'test',
        status: 'screen',
        priority: 'high',
      },
    ];

    render(<Analytics {...mockProps} />);

    expect(screen.getByText('📊 Analytics Dashboard')).toBeInTheDocument();
  });
});
