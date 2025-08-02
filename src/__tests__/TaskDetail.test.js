import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskDetail from '../components/TaskDetail';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getTasks: () => [mockTask],
    saveTasks: jest.fn(),
    getProjects: () => [{ id: 'default', name: 'Default Project', key: 'DEF' }],
    getComponents: () => mockComponents,
    getAssignees: () => mockAssignees,
    getComments: () => [],
    saveComments: jest.fn(),
    getWatchers: () => [],
    saveWatchers: jest.fn(),
    getTaskHistory: () => [],
    saveTaskHistory: jest.fn(),
  },
}));

// Mock notifications
jest.mock('../utils/notifications', () => ({
  notificationService: {
    notifyWatchers: jest.fn(),
    validateEmail: jest.fn(() => true),
    requestPermission: jest.fn(),
  },
}));

// Mock Date.now for consistent timestamps
const mockDateNow = jest.spyOn(Date, 'now').mockReturnValue(1640995200000);

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
  labels: ['test'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockComponents = [
  { id: 'frontend', name: 'Frontend', projectId: 'default' },
  { id: 'backend', name: 'Backend', projectId: 'default' },
];

const mockAssignees = [
  { id: 'unassigned', name: 'Unassigned' },
  { id: 'john', name: 'John Doe' },
];

const mockProps = {
  taskId: '1',
  onClose: jest.fn(),
  onUpdate: jest.fn(),
};

describe('TaskDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure Date.now is properly mocked
    Date.now = jest.fn(() => 1640995200000);
  });

  test('renders task detail correctly', () => {
    render(<TaskDetail {...mockProps} />);

    expect(screen.getByText('DEF-1')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('handles close button click', () => {
    render(<TaskDetail {...mockProps} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('adds comment successfully', () => {
    render(<TaskDetail {...mockProps} />);

    const commentInput = screen.getByPlaceholderText('Add a comment...');
    const addButton = screen.getByText('Add Comment');

    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    fireEvent.click(addButton);

    expect(commentInput.value).toBe('');
  });

  test('shows error for invalid email', () => {
    const { notificationService } = require('../utils/notifications');
    notificationService.validateEmail.mockReturnValue(false);

    render(<TaskDetail {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const addButton = screen.getByText('Add Watcher');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(addButton);

    expect(
      screen.getByText('Please enter a valid email address')
    ).toBeInTheDocument();
  });

  test('enters edit mode and saves changes', () => {
    render(<TaskDetail {...mockProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const titleInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  test('cancels edit mode', () => {
    render(<TaskDetail {...mockProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('returns null for non-existent task', () => {
    render(<TaskDetail {...mockProps} taskId="999" />);
    expect(screen.queryByText('DEF-999')).not.toBeInTheDocument();
  });

  test('removes watcher successfully', () => {
    const { storage } = require('../utils/storage');
    storage.getWatchers = () => [
      { id: '1', name: 'Test User', email: 'test@example.com' },
    ];

    render(<TaskDetail {...mockProps} />);

    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);

    expect(storage.saveWatchers).toHaveBeenCalled();
  });

  test('does not add comment when empty', () => {
    render(<TaskDetail {...mockProps} />);

    const addButton = screen.getByText('Add Comment');
    fireEvent.click(addButton);

    const { storage } = require('../utils/storage');
    expect(storage.saveComments).not.toHaveBeenCalled();
  });

  test('shows error for empty email', () => {
    render(<TaskDetail {...mockProps} />);

    const addButton = screen.getByText('Add Watcher');
    fireEvent.click(addButton);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  test('shows error for duplicate email', () => {
    const { storage } = require('../utils/storage');
    const { notificationService } = require('../utils/notifications');
    storage.getWatchers = () => [
      { id: '1', name: 'Test User', email: 'test@example.com' },
    ];
    // Ensure email validation passes first
    notificationService.validateEmail.mockReturnValue(true);

    render(<TaskDetail {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const addButton = screen.getByText('Add Watcher');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(addButton);

    expect(
      screen.getByText('This email is already watching this task')
    ).toBeInTheDocument();
  });

  test('clears email error when typing', () => {
    render(<TaskDetail {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const addButton = screen.getByText('Add Watcher');

    fireEvent.click(addButton);
    expect(screen.getByText('Email is required')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  test('updates task status', () => {
    render(<TaskDetail {...mockProps} />);

    const statusSelect = screen.getByDisplayValue('In Progress');
    fireEvent.change(statusSelect, { target: { value: 'resolved' } });

    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  test('updates task priority', () => {
    render(<TaskDetail {...mockProps} />);

    const prioritySelect = screen.getByDisplayValue('High');
    fireEvent.change(prioritySelect, { target: { value: 'low' } });

    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  test('updates task component', () => {
    render(<TaskDetail {...mockProps} />);

    const componentSelect = screen.getByDisplayValue('Frontend');
    fireEvent.change(componentSelect, { target: { value: 'frontend' } });

    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  test('updates task assignee', () => {
    render(<TaskDetail {...mockProps} />);

    const assigneeSelect = screen.getByDisplayValue('Unassigned');
    fireEvent.change(assigneeSelect, { target: { value: 'unassigned' } });

    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  test('renders comments correctly', () => {
    const { storage } = require('../utils/storage');
    storage.getComments = () => [
      {
        id: '1',
        text: 'Test comment',
        author: 'Test User',
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    ];

    render(<TaskDetail {...mockProps} />);

    expect(screen.getByText('Test comment')).toBeInTheDocument();
    expect(
      screen.getByText(/Test User.*1\/1\/2024.*5:30:00/)
    ).toBeInTheDocument();
  });

  test('renders history correctly', () => {
    const { storage } = require('../utils/storage');
    storage.getTaskHistory = () => [
      {
        id: '1',
        field: 'Status',
        oldValue: 'todo',
        newValue: 'done',
        timestamp: '2024-01-01T00:00:00.000Z',
        author: 'Test User',
      },
    ];

    render(<TaskDetail {...mockProps} />);

    expect(screen.getByText(/Status: todo → done/)).toBeInTheDocument();
    expect(
      screen.getByText(/Test User.*1\/1\/2024.*5:30:00/)
    ).toBeInTheDocument();
  });

  test('edits task description', () => {
    render(<TaskDetail {...mockProps} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    const descriptionInput = screen.getByDisplayValue('Test Description');
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated Description' },
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockProps.onUpdate).toHaveBeenCalled();
  });
});
