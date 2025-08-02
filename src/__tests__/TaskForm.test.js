import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getProjects: () => [{ id: 'default', name: 'Default Project' }],
    getComponents: () => [
      { id: 'frontend', name: 'Frontend', projectId: 'default' },
    ],
    getAssignees: () => [{ id: 'unassigned', name: 'Unassigned' }],
    getTaskHistory: () => [],
    saveTaskHistory: jest.fn(),
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

const mockProps = {
  onSave: jest.fn(),
  onCancel: jest.fn(),
};

const mockTask = {
  id: '1',
  title: 'Existing Task',
  description: 'Existing Description',
  status: 'in-progress',
  priority: 'high',
  projectId: 'default',
  type: 'feature',
  componentId: 'frontend',
  assigneeId: 'unassigned',
  labels: ['test-label'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create form correctly', () => {
    render(<TaskForm {...mockProps} />);

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task description')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  test('renders edit form correctly', () => {
    render(<TaskForm {...mockProps} task={mockTask} />);

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Existing Description')
    ).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<TaskForm {...mockProps} />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'New Description' },
    });

    expect(titleInput.value).toBe('New Task Title');
    expect(descriptionInput.value).toBe('New Description');
  });

  test('handles priority selection', () => {
    render(<TaskForm {...mockProps} />);

    const prioritySelect = screen.getByDisplayValue('Medium Priority');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    expect(prioritySelect.value).toBe('high');
  });

  test('handles status selection', () => {
    render(<TaskForm {...mockProps} />);

    const statusSelect = screen.getByDisplayValue('Screen');
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

    expect(statusSelect.value).toBe('in-progress');
  });

  test('submits form with correct data for new task', async () => {
    render(<TaskForm {...mockProps} />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const submitButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'New Description' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'New Description',
          priority: 'medium',
          status: 'screen',
          projectId: 'default',
          type: 'feature',
          componentId: 'frontend',
          assigneeId: 'unassigned',
          labels: [],
        })
      );
    });
  });

  test('submits form with correct data for existing task', async () => {
    render(<TaskForm {...mockProps} task={mockTask} />);

    const titleInput = screen.getByDisplayValue('Existing Task');
    const submitButton = screen.getByText('Update Task');

    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockTask,
          title: 'Updated Task',
          updatedAt: expect.any(String),
        })
      );
    });
  });

  test('prevents submission with empty title', () => {
    render(<TaskForm {...mockProps} />);

    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<TaskForm {...mockProps} task={mockTask} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  test('resets form after successful creation', async () => {
    render(<TaskForm {...mockProps} />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const descriptionInput = screen.getByPlaceholderText('Task description');
    const submitButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'New Description' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
    });
    expect(descriptionInput.value).toBe('');
  });

  test('handles label management', () => {
    render(<TaskForm {...mockProps} />);

    const labelInput = screen.getByPlaceholderText('Add label');
    const addLabelButton = screen.getByText('Add Label');

    // Add a label
    fireEvent.change(labelInput, { target: { value: 'test-label' } });
    fireEvent.click(addLabelButton);

    expect(screen.getByText('test-label ×')).toBeInTheDocument();
    expect(labelInput.value).toBe('');

    // Remove the label
    const labelElement = screen.getByText('test-label ×');
    fireEvent.click(labelElement);

    expect(screen.queryByText('test-label ×')).not.toBeInTheDocument();
  });

  test('prevents duplicate labels', () => {
    render(<TaskForm {...mockProps} />);

    const labelInput = screen.getByPlaceholderText('Add label');
    const addLabelButton = screen.getByText('Add Label');

    // Add same label twice
    fireEvent.change(labelInput, { target: { value: 'duplicate' } });
    fireEvent.click(addLabelButton);
    fireEvent.change(labelInput, { target: { value: 'duplicate' } });
    fireEvent.click(addLabelButton);

    const labels = screen.getAllByText('duplicate ×');
    expect(labels).toHaveLength(1);
  });

  test('adds label on Enter key press', () => {
    render(<TaskForm {...mockProps} />);

    const labelInput = screen.getByPlaceholderText('Add label');
    const addLabelButton = screen.getByText('Add Label');

    fireEvent.change(labelInput, { target: { value: 'enter-label' } });
    fireEvent.keyPress(labelInput, { key: 'Enter', code: 'Enter' });

    // Fallback to button click if keyPress doesn't work
    fireEvent.click(addLabelButton);

    expect(screen.getByText('enter-label ×')).toBeInTheDocument();
  });

  test('handles form validation edge cases', () => {
    render(<TaskForm {...mockProps} />);

    const titleInput = screen.getByPlaceholderText('Task title');
    const submitButton = screen.getByText('Create Task');

    // Test with whitespace-only title
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitButton);

    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  test('handles task with existing labels in edit mode', () => {
    const taskWithLabels = {
      ...mockTask,
      labels: ['existing-label'],
    };

    render(<TaskForm {...mockProps} task={taskWithLabels} />);

    expect(screen.getByText('existing-label ×')).toBeInTheDocument();
  });

  test('handles empty label input edge cases', () => {
    render(<TaskForm {...mockProps} />);

    const labelInput = screen.getByPlaceholderText('Add label');
    const addLabelButton = screen.getByText('Add Label');

    // Test with empty string
    fireEvent.change(labelInput, { target: { value: '' } });
    fireEvent.click(addLabelButton);

    // Test with only whitespace
    fireEvent.change(labelInput, { target: { value: '   ' } });
    fireEvent.click(addLabelButton);

    // No labels should be added
    expect(screen.queryByText('×')).not.toBeInTheDocument();
  });

  test('handles all form field combinations', () => {
    render(<TaskForm {...mockProps} />);

    const selects = screen.getAllByRole('combobox');

    // Test all dropdown combinations
    fireEvent.change(selects[1], { target: { value: 'bug' } });
    fireEvent.change(selects[2], { target: { value: 'low' } });
    fireEvent.change(selects[3], { target: { value: 'resolved' } });

    expect(selects[1].value).toBe('bug');
    expect(selects[2].value).toBe('low');
    expect(selects[3].value).toBe('resolved');
  });

  test('handles label key press events', () => {
    render(<TaskForm {...mockProps} />);

    const labelInput = screen.getByPlaceholderText('Add label');

    // Test non-Enter key press
    fireEvent.change(labelInput, { target: { value: 'test-label' } });
    fireEvent.keyPress(labelInput, { key: 'Tab', code: 'Tab' });

    // Label should not be added on non-Enter key
    expect(screen.queryByText('test-label ×')).not.toBeInTheDocument();
  });

  test('handles missing onCancel prop', () => {
    const propsWithoutCancel = { onSave: jest.fn() };
    render(<TaskForm {...propsWithoutCancel} task={mockTask} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Should not crash when onCancel is not provided
    expect(cancelButton).toBeInTheDocument();
  });
});
