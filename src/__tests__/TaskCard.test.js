import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getProjects: () => [
      { id: 'default', name: 'Default Project', key: 'DEF' },
      { id: 'other', name: 'Other Project', key: 'OTH' },
    ],
    getComponents: () => [
      { id: 'frontend', name: 'Frontend', projectId: 'default' },
      { id: 'backend', name: 'Backend', projectId: 'default' },
    ],
    getAssignees: () => [
      { id: 'unassigned', name: 'Unassigned' },
      { id: 'john', name: 'John Doe' },
    ],
  },
  TASK_TYPES: {
    BUG: 'bug',
    FEATURE: 'feature',
    ENHANCEMENT: 'enhancement',
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

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'in-progress',
  priority: 'high',
  projectId: 'default',
  type: 'feature',
  componentId: 'frontend',
  assigneeId: 'unassigned',
  labels: ['test', 'frontend'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockProps = {
  task: mockTask,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onStatusChange: jest.fn(),
};

describe('TaskCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Priority: high')).toBeInTheDocument();
    expect(screen.getByText('✨ DEF-1')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<TaskCard {...mockProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<TaskCard {...mockProps} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('calls onStatusChange when status dropdown changes', () => {
    render(<TaskCard {...mockProps} />);

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });

    expect(mockProps.onStatusChange).toHaveBeenCalledWith('1', 'resolved');
  });

  test('displays correct status colors', () => {
    render(<TaskCard {...mockProps} />);
    const statusElements = screen.getAllByText('In Progress');
    const statusBadge = statusElements.find((el) => el.tagName === 'SPAN');
    expect(statusBadge).toHaveStyle('background-color: #007bff');
  });

  test('displays correct priority colors', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText('Priority: high')).toHaveStyle('color: #dc3545');
  });

  test('displays task labels', () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('frontend')).toBeInTheDocument();
  });

  test('displays project key and task ID', () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.getByText(/DEF-1/)).toBeInTheDocument();
  });

  test('displays component and assignee info', () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.getByText(/📦 Frontend/)).toBeInTheDocument();
    expect(screen.getByText(/👤 Unassigned/)).toBeInTheDocument();
  });

  test('handles missing component gracefully', () => {
    const taskWithMissingComponent = {
      ...mockTask,
      componentId: 'nonexistent',
    };
    render(<TaskCard {...mockProps} task={taskWithMissingComponent} />);

    expect(screen.getByText(/Unknown/)).toBeInTheDocument();
  });

  test('displays correct task type icon', () => {
    render(<TaskCard {...mockProps} />);
    expect(screen.getByText(/✨/)).toBeInTheDocument();

    const bugTask = { ...mockTask, type: 'bug' };
    const { rerender } = render(<TaskCard {...mockProps} task={bugTask} />);
    expect(screen.getByText(/🐛/)).toBeInTheDocument();

    const enhancementTask = { ...mockTask, type: 'enhancement' };
    rerender(<TaskCard {...mockProps} task={enhancementTask} />);
    expect(screen.getByText(/🚀/)).toBeInTheDocument();
  });

  test('displays all workflow status options in dropdown', () => {
    render(<TaskCard {...mockProps} />);

    const statusSelect = screen.getByRole('combobox');
    expect(statusSelect).toBeInTheDocument();

    // Check that all status options are available by checking the select options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(6);
    expect(screen.getByRole('option', { name: 'Screen' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'In Progress' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Code Review' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Code Complete' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'QA Verify' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Resolved' })
    ).toBeInTheDocument();
  });

  test('displays different priority colors', () => {
    const mediumTask = { ...mockTask, priority: 'medium' };
    const { rerender } = render(<TaskCard {...mockProps} task={mediumTask} />);
    expect(screen.getByText('Priority: medium')).toHaveStyle('color: #ffc107');

    const lowTask = { ...mockTask, priority: 'low' };
    rerender(<TaskCard {...mockProps} task={lowTask} />);
    expect(screen.getByText('Priority: low')).toHaveStyle('color: #28a745');

    const criticalTask = { ...mockTask, priority: 'critical' };
    rerender(<TaskCard {...mockProps} task={criticalTask} />);
    expect(screen.getByText('Priority: critical')).toHaveStyle(
      'color: #dc3545'
    );
  });

  test('displays different status colors', () => {
    const resolvedTask = { ...mockTask, status: 'resolved' };
    const { rerender } = render(
      <TaskCard {...mockProps} task={resolvedTask} />
    );
    const statusElements = screen.getAllByText('Resolved');
    const statusBadge = statusElements.find((el) => el.tagName === 'SPAN');
    expect(statusBadge).toHaveStyle('background-color: #28a745');

    const codeReviewTask = { ...mockTask, status: 'code-review' };
    rerender(<TaskCard {...mockProps} task={codeReviewTask} />);
    const codeReviewElements = screen.getAllByText('Code Review');
    const codeReviewBadge = codeReviewElements.find(
      (el) => el.tagName === 'SPAN'
    );
    expect(codeReviewBadge).toHaveStyle('background-color: #fd7e14');
  });

  test('handles task without labels', () => {
    const taskWithoutLabels = { ...mockTask, labels: undefined };
    render(<TaskCard {...mockProps} task={taskWithoutLabels} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('handles empty labels array', () => {
    const taskWithEmptyLabels = { ...mockTask, labels: [] };
    render(<TaskCard {...mockProps} task={taskWithEmptyLabels} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('test')).not.toBeInTheDocument();
  });

  test('calls onView when view button is clicked', () => {
    const onView = jest.fn();
    render(<TaskCard {...mockProps} onView={onView} />);

    const viewButton = screen.getByText('View');
    fireEvent.click(viewButton);

    expect(onView).toHaveBeenCalled();
  });

  test('does not render view button when onView is not provided', () => {
    render(<TaskCard {...mockProps} />);

    expect(screen.queryByText('View')).not.toBeInTheDocument();
  });

  test('displays default type icon for unknown type', () => {
    const unknownTypeTask = { ...mockTask, type: 'unknown' };
    render(<TaskCard {...mockProps} task={unknownTypeTask} />);

    expect(screen.getByText(/📝/)).toBeInTheDocument();
  });

  test('displays default status color for unknown status', () => {
    const unknownStatusTask = { ...mockTask, status: 'unknown' };
    render(<TaskCard {...mockProps} task={unknownStatusTask} />);

    const statusElements = screen.getAllByText('unknown');
    const statusBadge = statusElements.find((el) => el.tagName === 'SPAN');
    expect(statusBadge).toHaveStyle('background-color: #6c757d');
  });

  test('handles missing project gracefully', () => {
    const taskWithMissingProject = {
      ...mockTask,
      projectId: 'nonexistent',
    };
    render(<TaskCard {...mockProps} task={taskWithMissingProject} />);

    expect(screen.getByText(/DEF/)).toBeInTheDocument(); // Falls back to 'DEF'
  });

  test('handles missing assignee gracefully', () => {
    const taskWithMissingAssignee = {
      ...mockTask,
      assigneeId: 'nonexistent',
    };
    render(<TaskCard {...mockProps} task={taskWithMissingAssignee} />);

    expect(screen.getByText(/Unassigned/)).toBeInTheDocument(); // Falls back to 'Unassigned'
  });

  test('displays screen status correctly', () => {
    const screenTask = { ...mockTask, status: 'screen' };
    render(<TaskCard {...mockProps} task={screenTask} />);

    const statusElements = screen.getAllByText('Screen');
    const statusBadge = statusElements.find((el) => el.tagName === 'SPAN');
    expect(statusBadge).toHaveStyle('background-color: #6c757d');
  });

  test('displays qa-verify status correctly', () => {
    const qaTask = { ...mockTask, status: 'qa-verify' };
    render(<TaskCard {...mockProps} task={qaTask} />);

    const statusElements = screen.getAllByText('QA Verify');
    const statusBadge = statusElements.find((el) => el.tagName === 'SPAN');
    expect(statusBadge).toHaveStyle('background-color: #ffc107');
  });

  test('displays code-complete status correctly', () => {
    const codeCompleteTask = { ...mockTask, status: 'code-complete' };
    render(<TaskCard {...mockProps} task={codeCompleteTask} />);

    const statusElements = screen.getAllByText('Code Complete');
    const statusBadge = statusElements.find((el) => el.tagName === 'SPAN');
    expect(statusBadge).toHaveStyle('background-color: #20c997');
  });
});
