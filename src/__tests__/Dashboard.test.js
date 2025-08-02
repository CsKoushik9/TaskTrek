import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';
import { storage } from '../utils/storage';

// Mock notifications
jest.mock('../utils/notifications', () => ({
  notificationService: {
    notifyWatchers: jest.fn(),
  },
}));

// Mock the storage utility
jest.mock('../utils/storage', () => ({
  storage: {
    getTasks: jest.fn(),
    saveTasks: jest.fn(),
    getProjects: jest.fn(),
    saveProjects: jest.fn(),
    getComponents: jest.fn(),
    saveComponents: jest.fn(),
    getAssignees: jest.fn(),
    saveAssignees: jest.fn(),
    getTaskHistory: () => [],
    saveTaskHistory: jest.fn(),
    getComments: jest.fn(() => []),
    saveComments: jest.fn(),
    getWatchers: jest.fn(() => []),
    saveWatchers: jest.fn(),
  },
  WORKFLOW_STATUSES: {
    SCREEN: 'screen',
    IN_PROGRESS: 'in-progress',
    CODE_REVIEW: 'code-review',
    CODE_COMPLETE: 'code-complete',
    QA_VERIFY: 'qa-verify',
    RESOLVED: 'resolved',
  },
  TASK_TYPES: {
    BUG: 'bug',
    FEATURE: 'feature',
    ENHANCEMENT: 'enhancement',
  },
}));

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'screen',
    priority: 'high',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getTasks.mockReturnValue(mockTasks);
    storage.getProjects.mockReturnValue([
      { id: 'default', name: 'Default Project' },
    ]);
    storage.getComponents.mockReturnValue([
      { id: 'frontend', name: 'Frontend', projectId: 'default' },
    ]);
    storage.getAssignees.mockReturnValue([
      { id: 'unassigned', name: 'Unassigned' },
    ]);
  });

  test('renders dashboard header correctly', () => {
    render(<Dashboard />);

    expect(screen.getByText('🚀 TaskTrek')).toBeInTheDocument();
    expect(
      screen.getByText('Project Management Made Simple')
    ).toBeInTheDocument();
  });

  test('displays task statistics correctly', () => {
    render(<Dashboard />);

    expect(screen.getByText('3')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(3); // Screen, In Progress, Resolved tasks
    expect(screen.getAllByText('Screen')).toHaveLength(7); // Stats + button + 5 selects
    expect(screen.getAllByText('In Progress')).toHaveLength(7); // Stats + button + 5 selects
    expect(screen.getAllByText('Resolved')).toHaveLength(7); // Stats + button + 5 selects
  });

  test('renders all tasks by default', () => {
    render(<Dashboard />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('filters tasks correctly', () => {
    render(<Dashboard />);

    // Filter by screen
    const screenFilter = screen.getByRole('button', { name: 'Screen' });
    fireEvent.click(screenFilter);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();

    // Filter by in-progress
    const inProgressFilter = screen.getByRole('button', {
      name: 'In Progress',
    });
    fireEvent.click(inProgressFilter);

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();

    // Filter by resolved
    const resolvedFilter = screen.getByRole('button', { name: 'Resolved' });
    fireEvent.click(resolvedFilter);

    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();

    // Show all tasks
    const allFilter = screen.getByRole('button', { name: 'All Tasks' });
    fireEvent.click(allFilter);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('displays empty state when no tasks', () => {
    storage.getTasks.mockReturnValue([]);
    render(<Dashboard />);

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(
      screen.getByText('Create your first task to get started!')
    ).toBeInTheDocument();
  });

  test('handles task creation', async () => {
    render(<Dashboard />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const createButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(storage.saveTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          ...mockTasks,
          expect.objectContaining({
            title: 'New Task',
          }),
        ])
      );
    });
  });

  test('handles task editing', async () => {
    render(<Dashboard />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();

    const titleInput = screen.getByDisplayValue('Task 1');
    const updateButton = screen.getByText('Update Task');

    fireEvent.change(titleInput, { target: { value: 'Updated Task 1' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(storage.saveTasks).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            title: 'Updated Task 1',
          }),
        ])
      );
    });
  });

  test('handles task deletion', () => {
    render(<Dashboard />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(storage.saveTasks).toHaveBeenCalledWith(
      expect.arrayContaining([mockTasks[1], mockTasks[2]])
    );
  });

  test('cancels task editing', () => {
    render(<Dashboard />);

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.queryByText('Edit Task')).not.toBeInTheDocument();
  });

  test('loads tasks from storage on mount', () => {
    render(<Dashboard />);

    expect(storage.getTasks).toHaveBeenCalled();
  });

  test('opens project manager modal', () => {
    render(<Dashboard />);

    const manageProjectsButton = screen.getByText('⚙️ Manage Projects');
    fireEvent.click(manageProjectsButton);

    expect(screen.getByText('Project Manager')).toBeInTheDocument();
  });

  test('handles status change for tasks', () => {
    render(<Dashboard />);

    const statusSelects = screen.getAllByRole('combobox');
    // Find the last combobox which should be a task status select
    const taskStatusSelect = statusSelects[statusSelects.length - 1];

    fireEvent.change(taskStatusSelect, { target: { value: 'in-progress' } });
    expect(storage.saveTasks).toHaveBeenCalled();
  });

  test('displays correct task counts for each status', () => {
    render(<Dashboard />);

    // Check that statistics are displayed
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getAllByText('Screen')).toHaveLength(7); // Stats + button + 5 selects
    expect(screen.getAllByText('In Progress')).toHaveLength(7);
    expect(screen.getAllByText('Code Review')).toHaveLength(6);
    expect(screen.getAllByText('Code Complete')).toHaveLength(6);
    expect(screen.getAllByText('QA Verify')).toHaveLength(6);
    expect(screen.getAllByText('Resolved')).toHaveLength(7);
  });

  test('filters tasks by different statuses', () => {
    render(<Dashboard />);

    // Test Code Review filter
    const codeReviewFilter = screen.getByRole('button', {
      name: 'Code Review',
    });
    fireEvent.click(codeReviewFilter);

    // Test Code Complete filter
    const codeCompleteFilter = screen.getByRole('button', {
      name: 'Code Complete',
    });
    fireEvent.click(codeCompleteFilter);

    // Test QA Verify filter
    const qaVerifyFilter = screen.getByRole('button', { name: 'QA Verify' });
    fireEvent.click(qaVerifyFilter);
  });

  test('closes project manager modal', () => {
    render(<Dashboard />);

    const manageProjectsButton = screen.getByText('⚙️ Manage Projects');
    fireEvent.click(manageProjectsButton);

    expect(screen.getByText('Project Manager')).toBeInTheDocument();

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Project Manager')).not.toBeInTheDocument();
  });
});
