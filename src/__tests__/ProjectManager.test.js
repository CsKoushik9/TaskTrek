import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectManager from '../components/ProjectManager';

// Mock storage
jest.mock('../utils/storage', () => ({
  storage: {
    getProjects: jest.fn(),
    saveProjects: jest.fn(),
    getComponents: jest.fn(),
    saveComponents: jest.fn(),
    getAssignees: jest.fn(),
    saveAssignees: jest.fn(),
  },
}));

const { storage } = require('../utils/storage');

const mockProjects = [
  {
    id: 'default',
    name: 'Default Project',
    description: 'Default project',
    key: 'DEF',
  },
  { id: 'proj1', name: 'Project 1', description: 'Test project', key: 'PROJ1' },
];

const mockComponents = [
  { id: 'frontend', name: 'Frontend', projectId: 'default' },
  { id: 'backend', name: 'Backend', projectId: 'default' },
];

const mockAssignees = [
  { id: 'unassigned', name: 'Unassigned', email: '' },
  { id: 'john', name: 'John Doe', email: 'john@example.com' },
];

const mockProps = {
  onClose: jest.fn(),
};

describe('ProjectManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getProjects.mockReturnValue(mockProjects);
    storage.getComponents.mockReturnValue(mockComponents);
    storage.getAssignees.mockReturnValue(mockAssignees);
  });

  test('renders project manager modal', () => {
    render(<ProjectManager {...mockProps} />);

    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getAllByText('Projects')).toHaveLength(2); // Tab and heading
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('Assignees')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<ProjectManager {...mockProps} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('switches between tabs', () => {
    render(<ProjectManager {...mockProps} />);

    // Default tab is projects
    expect(screen.getByText('Add Project')).toBeInTheDocument();

    // Switch to components tab
    const componentsTab = screen.getByText('Components');
    fireEvent.click(componentsTab);
    expect(screen.getByText('Add Component')).toBeInTheDocument();

    // Switch to assignees tab
    const assigneesTab = screen.getByText('Assignees');
    fireEvent.click(assigneesTab);
    expect(screen.getByText('Add Assignee')).toBeInTheDocument();
  });

  test('adds new project', () => {
    render(<ProjectManager {...mockProps} />);

    const nameInput = screen.getByPlaceholderText('Project name');
    const keyInput = screen.getByPlaceholderText('Project key (e.g., PROJ)');
    const descInput = screen.getByPlaceholderText('Description');
    const addButton = screen.getByText('Add Project');

    fireEvent.change(nameInput, { target: { value: 'New Project' } });
    fireEvent.change(keyInput, { target: { value: 'NEW' } });
    fireEvent.change(descInput, { target: { value: 'New description' } });
    fireEvent.click(addButton);

    expect(storage.saveProjects).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...mockProjects,
        expect.objectContaining({
          name: 'New Project',
          key: 'NEW',
          description: 'New description',
        }),
      ])
    );
  });

  test('deletes project', () => {
    render(<ProjectManager {...mockProps} />);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]); // Delete first non-default project

    expect(storage.saveProjects).toHaveBeenCalledWith([mockProjects[0]]);
    expect(storage.saveComponents).toHaveBeenCalled();
  });

  test('adds new component', () => {
    render(<ProjectManager {...mockProps} />);

    // Switch to components tab
    const componentsTab = screen.getByText('Components');
    fireEvent.click(componentsTab);

    const nameInput = screen.getByPlaceholderText('Component name');
    const addButton = screen.getByText('Add Component');

    fireEvent.change(nameInput, { target: { value: 'New Component' } });
    fireEvent.click(addButton);

    expect(storage.saveComponents).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...mockComponents,
        expect.objectContaining({
          name: 'New Component',
          projectId: 'default',
        }),
      ])
    );
  });

  test('deletes component', () => {
    render(<ProjectManager {...mockProps} />);

    // Switch to components tab
    const componentsTab = screen.getByText('Components');
    fireEvent.click(componentsTab);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(storage.saveComponents).toHaveBeenCalledWith([mockComponents[1]]);
  });

  test('adds new assignee', () => {
    render(<ProjectManager {...mockProps} />);

    // Switch to assignees tab
    const assigneesTab = screen.getByText('Assignees');
    fireEvent.click(assigneesTab);

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const addButton = screen.getByText('Add Assignee');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.click(addButton);

    expect(storage.saveAssignees).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...mockAssignees,
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane@example.com',
        }),
      ])
    );
  });

  test('deletes assignee', () => {
    render(<ProjectManager {...mockProps} />);

    // Switch to assignees tab
    const assigneesTab = screen.getByText('Assignees');
    fireEvent.click(assigneesTab);

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]); // Delete first non-unassigned assignee

    expect(storage.saveAssignees).toHaveBeenCalledWith([mockAssignees[0]]);
  });

  test('prevents deletion of default project', () => {
    const projectsWithDefault = [
      {
        id: 'default',
        name: 'Default Project',
        description: 'Default',
        key: 'DEF',
      },
    ];
    storage.getProjects.mockReturnValue(projectsWithDefault);

    render(<ProjectManager {...mockProps} />);

    // Should not have delete button for default project
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  test('prevents deletion of unassigned assignee', () => {
    const assigneesWithUnassigned = [
      { id: 'unassigned', name: 'Unassigned', email: '' },
    ];
    storage.getAssignees.mockReturnValue(assigneesWithUnassigned);

    render(<ProjectManager {...mockProps} />);

    // Switch to assignees tab
    const assigneesTab = screen.getByText('Assignees');
    fireEvent.click(assigneesTab);

    // Should not have delete button for unassigned
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  test('validates project input before adding', () => {
    render(<ProjectManager {...mockProps} />);

    const addButton = screen.getByText('Add Project');

    // Try to add without name and key
    fireEvent.click(addButton);

    expect(storage.saveProjects).not.toHaveBeenCalled();
  });

  test('validates component input before adding', () => {
    render(<ProjectManager {...mockProps} />);

    // Switch to components tab
    const componentsTab = screen.getByText('Components');
    fireEvent.click(componentsTab);

    const addButton = screen.getByText('Add Component');

    // Try to add without name
    fireEvent.click(addButton);

    expect(storage.saveComponents).not.toHaveBeenCalled();
  });

  test('validates assignee input before adding', () => {
    render(<ProjectManager {...mockProps} />);

    // Switch to assignees tab
    const assigneesTab = screen.getByText('Assignees');
    fireEvent.click(assigneesTab);

    const addButton = screen.getByText('Add Assignee');

    // Try to add without name
    fireEvent.click(addButton);

    expect(storage.saveAssignees).not.toHaveBeenCalled();
  });

  test('handles component project selection', () => {
    const multipleProjects = [
      ...mockProjects,
      {
        id: 'proj2',
        name: 'Project 2',
        description: 'Second project',
        key: 'PROJ2',
      },
    ];
    storage.getProjects.mockReturnValue(multipleProjects);

    render(<ProjectManager {...mockProps} />);

    // Switch to components tab
    const componentsTab = screen.getByText('Components');
    fireEvent.click(componentsTab);

    const projectSelect = screen.getByRole('combobox');
    fireEvent.change(projectSelect, { target: { value: 'proj2' } });

    expect(projectSelect.value).toBe('proj2');
  });
});
