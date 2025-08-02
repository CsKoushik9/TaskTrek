import { storage, TASK_TYPES, WORKFLOW_STATUSES } from '../utils/storage';

describe('Constants', () => {
  test('TASK_TYPES exports correct values', () => {
    expect(TASK_TYPES.BUG).toBe('bug');
    expect(TASK_TYPES.FEATURE).toBe('feature');
    expect(TASK_TYPES.ENHANCEMENT).toBe('enhancement');
  });

  test('WORKFLOW_STATUSES exports correct values', () => {
    expect(WORKFLOW_STATUSES.SCREEN).toBe('screen');
    expect(WORKFLOW_STATUSES.IN_PROGRESS).toBe('in-progress');
    expect(WORKFLOW_STATUSES.CODE_REVIEW).toBe('code-review');
    expect(WORKFLOW_STATUSES.CODE_COMPLETE).toBe('code-complete');
    expect(WORKFLOW_STATUSES.QA_VERIFY).toBe('qa-verify');
    expect(WORKFLOW_STATUSES.RESOLVED).toBe('resolved');
  });
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utility', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    // Reset getItem to return null by default
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('getTasks', () => {
    test('returns empty array when no tasks in storage', () => {
      const tasks = storage.getTasks();
      expect(tasks).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('tasktrek_tasks');
    });

    test('returns parsed tasks from storage', () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo' },
        { id: '2', title: 'Task 2', status: 'done' },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTasks));

      const tasks = storage.getTasks();
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('saveTasks', () => {
    test('saves tasks to localStorage', () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo' },
        { id: '2', title: 'Task 2', status: 'done' },
      ];

      storage.saveTasks(mockTasks);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_tasks',
        JSON.stringify(mockTasks)
      );
    });

    test('saves empty array', () => {
      storage.saveTasks([]);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_tasks',
        JSON.stringify([])
      );
    });

    test('saves null value', () => {
      storage.saveTasks(null);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_tasks',
        'null'
      );
    });
  });

  describe('getProjects', () => {
    test('returns default project when no projects in storage', () => {
      const projects = storage.getProjects();

      expect(projects).toEqual([
        {
          id: 'default',
          name: 'Default Project',
          description: 'Default project for tasks',
          key: 'DEF',
        },
      ]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_projects'
      );
    });

    test('returns parsed projects from storage', () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', description: 'First project' },
        { id: '2', name: 'Project 2', description: 'Second project' },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProjects));

      const projects = storage.getProjects();
      expect(projects).toEqual(mockProjects);
    });
  });

  describe('saveProjects', () => {
    test('saves projects to localStorage', () => {
      const mockProjects = [
        { id: '1', name: 'Project 1', description: 'First project' },
        { id: '2', name: 'Project 2', description: 'Second project' },
      ];

      storage.saveProjects(mockProjects);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_projects',
        JSON.stringify(mockProjects)
      );
    });

    test('saves empty projects array', () => {
      storage.saveProjects([]);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_projects',
        JSON.stringify([])
      );
    });
  });

  describe('getComponents', () => {
    test('returns default components when no components in storage', () => {
      const components = storage.getComponents();

      expect(components).toEqual([
        { id: 'frontend', name: 'Frontend', projectId: 'default' },
        { id: 'backend', name: 'Backend', projectId: 'default' },
        { id: 'database', name: 'Database', projectId: 'default' },
      ]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_components'
      );
    });

    test('returns parsed components from storage', () => {
      const mockComponents = [{ id: 'test', name: 'Test', projectId: 'proj1' }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockComponents));

      const components = storage.getComponents();

      expect(components).toEqual(mockComponents);
    });
  });

  describe('saveComponents', () => {
    test('saves components to localStorage', () => {
      const components = [{ id: 'test', name: 'Test', projectId: 'proj1' }];

      storage.saveComponents(components);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_components',
        JSON.stringify(components)
      );
    });

    test('saves empty components array', () => {
      storage.saveComponents([]);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_components',
        JSON.stringify([])
      );
    });
  });

  describe('getAssignees', () => {
    test('returns default assignees when no assignees in storage', () => {
      const assignees = storage.getAssignees();

      expect(assignees).toEqual([
        { id: 'unassigned', name: 'Unassigned', email: '' },
        { id: 'john', name: 'John Doe', email: 'john@example.com' },
        { id: 'jane', name: 'Jane Smith', email: 'jane@example.com' },
      ]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_assignees'
      );
    });

    test('returns parsed assignees from storage', () => {
      const mockAssignees = [
        { id: 'test', name: 'Test User', email: 'test@example.com' },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAssignees));

      const assignees = storage.getAssignees();

      expect(assignees).toEqual(mockAssignees);
    });
  });

  describe('saveAssignees', () => {
    test('saves assignees to localStorage', () => {
      const assignees = [
        { id: 'test', name: 'Test User', email: 'test@example.com' },
      ];

      storage.saveAssignees(assignees);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_assignees',
        JSON.stringify(assignees)
      );
    });

    test('saves empty assignees array', () => {
      storage.saveAssignees([]);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_assignees',
        JSON.stringify([])
      );
    });
  });

  describe('Comments', () => {
    test('getComments returns empty array when no comments', () => {
      expect(storage.getComments('task1')).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_comments_task1'
      );
    });

    test('getComments returns parsed comments from storage', () => {
      const mockComments = [
        {
          id: '1',
          text: 'Test comment',
          author: 'User',
          timestamp: '2024-01-01',
        },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockComments));

      const comments = storage.getComments('task1');
      expect(comments).toEqual(mockComments);
    });

    test('saveComments saves to localStorage', () => {
      const comments = [{ id: '1', text: 'Test comment' }];
      storage.saveComments('task1', comments);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_comments_task1',
        JSON.stringify(comments)
      );
    });

    test('saveComments saves empty array', () => {
      storage.saveComments('task1', []);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_comments_task1',
        JSON.stringify([])
      );
    });
  });

  describe('Watchers', () => {
    test('getWatchers returns empty array when no watchers', () => {
      expect(storage.getWatchers('task1')).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_watchers_task1'
      );
    });

    test('getWatchers returns parsed watchers from storage', () => {
      const mockWatchers = [
        { id: '1', name: 'Test User', email: 'test@example.com' },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockWatchers));

      const watchers = storage.getWatchers('task1');
      expect(watchers).toEqual(mockWatchers);
    });

    test('saveWatchers saves to localStorage', () => {
      const watchers = [{ id: '1', email: 'test@example.com' }];
      storage.saveWatchers('task1', watchers);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_watchers_task1',
        JSON.stringify(watchers)
      );
    });

    test('saveWatchers saves empty array', () => {
      storage.saveWatchers('task1', []);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_watchers_task1',
        JSON.stringify([])
      );
    });
  });

  describe('Task History', () => {
    test('getTaskHistory returns empty array when no history', () => {
      expect(storage.getTaskHistory('task1')).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_history_task1'
      );
    });

    test('getTaskHistory returns parsed history from storage', () => {
      const mockHistory = [
        {
          id: '1',
          field: 'status',
          oldValue: 'todo',
          newValue: 'done',
          timestamp: '2024-01-01',
          author: 'User',
        },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const history = storage.getTaskHistory('task1');
      expect(history).toEqual(mockHistory);
    });

    test('saveTaskHistory saves to localStorage', () => {
      const history = [
        { id: '1', field: 'status', oldValue: 'todo', newValue: 'done' },
      ];
      storage.saveTaskHistory('task1', history);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_history_task1',
        JSON.stringify(history)
      );
    });

    test('saveTaskHistory saves empty array', () => {
      storage.saveTaskHistory('task1', []);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_history_task1',
        JSON.stringify([])
      );
    });
  });

  describe('storage keys', () => {
    test('uses correct storage keys', () => {
      storage.getTasks();
      storage.getProjects();
      storage.getComponents();
      storage.getAssignees();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('tasktrek_tasks');
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_projects'
      );
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_components'
      );
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'tasktrek_assignees'
      );
    });
  });

  describe('error handling', () => {
    test('handles JSON parse errors in getTasks', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      expect(() => storage.getTasks()).toThrow();
    });

    test('handles JSON parse errors in getProjects', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'tasktrek_projects') return 'invalid-json';
        return null;
      });

      expect(() => storage.getProjects()).toThrow();
    });

    test('handles JSON parse errors in getComponents', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'tasktrek_components') return 'invalid-json';
        return null;
      });

      expect(() => storage.getComponents()).toThrow();
    });

    test('handles JSON parse errors in getAssignees', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'tasktrek_assignees') return 'invalid-json';
        return null;
      });

      expect(() => storage.getAssignees()).toThrow();
    });

    test('handles JSON parse errors in getComments', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      expect(() => storage.getComments('task1')).toThrow();
    });

    test('handles JSON parse errors in getWatchers', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      expect(() => storage.getWatchers('task1')).toThrow();
    });

    test('handles JSON parse errors in getTaskHistory', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      expect(() => storage.getTaskHistory('task1')).toThrow();
    });
  });

  describe('edge cases', () => {
    test('handles null values from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      expect(storage.getTasks()).toEqual([]);
      expect(storage.getComments('task1')).toEqual([]);
      expect(storage.getWatchers('task1')).toEqual([]);
      expect(storage.getTaskHistory('task1')).toEqual([]);
    });

    test('handles empty string from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('');

      expect(storage.getTasks()).toEqual([]);
      expect(storage.getComments('task1')).toEqual([]);
      expect(storage.getWatchers('task1')).toEqual([]);
      expect(storage.getTaskHistory('task1')).toEqual([]);
    });

    test('saves complex data structures', () => {
      const complexTasks = [
        {
          id: '1',
          title: 'Complex Task',
          nested: { data: { value: 123 } },
          array: [1, 2, 3],
          nullValue: null,
          boolValue: true,
        },
      ];

      storage.saveTasks(complexTasks);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_tasks',
        JSON.stringify(complexTasks)
      );
    });

    test('handles undefined values in save operations', () => {
      storage.saveTasks(undefined);
      storage.saveProjects(undefined);
      storage.saveComponents(undefined);
      storage.saveAssignees(undefined);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_tasks',
        undefined
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_projects',
        undefined
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_components',
        undefined
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'tasktrek_assignees',
        undefined
      );
    });

    test('handles special characters in task IDs', () => {
      const specialTaskId = 'task-with-special-chars-@#$%';
      const comments = [{ id: '1', text: 'Test comment' }];
      const watchers = [{ id: '1', email: 'test@example.com' }];
      const history = [
        { id: '1', field: 'status', oldValue: 'todo', newValue: 'done' },
      ];

      storage.saveComments(specialTaskId, comments);
      storage.saveWatchers(specialTaskId, watchers);
      storage.saveTaskHistory(specialTaskId, history);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `tasktrek_comments_${specialTaskId}`,
        JSON.stringify(comments)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `tasktrek_watchers_${specialTaskId}`,
        JSON.stringify(watchers)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `tasktrek_history_${specialTaskId}`,
        JSON.stringify(history)
      );
    });
  });
});
