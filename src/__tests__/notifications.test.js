import { notificationService } from '../utils/notifications';

// Mock browser Notification API
global.Notification = jest.fn();
global.Notification.permission = 'granted';
global.Notification.requestPermission = jest.fn(() =>
  Promise.resolve('granted')
);

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Ensure window.Notification exists
Object.defineProperty(window, 'Notification', {
  value: global.Notification,
  writable: true,
});

// Mock console.log and console.error
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Notification Service', () => {
  beforeEach(() => {
    global.Notification.permission = 'granted';
    global.window = { Notification: global.Notification };
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key.includes('watchers')) return '[]';
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.Notification.permission = 'granted';
    global.window = { Notification: global.Notification };
  });

  describe('validateEmail', () => {
    test('validates correct email format', () => {
      expect(notificationService.validateEmail('test@example.com')).toBe(true);
      expect(notificationService.validateEmail('user.name@domain.co.uk')).toBe(
        true
      );
      expect(notificationService.validateEmail('user+tag@example.com')).toBe(
        true
      );
      expect(notificationService.validateEmail('123@456.com')).toBe(true);
    });

    test('rejects invalid email format', () => {
      expect(notificationService.validateEmail('invalid-email')).toBe(false);
      expect(notificationService.validateEmail('test@')).toBe(false);
      expect(notificationService.validateEmail('@domain.com')).toBe(false);
      expect(notificationService.validateEmail('')).toBe(false);
      expect(notificationService.validateEmail('   ')).toBe(false);
      expect(notificationService.validateEmail('user space@example.com')).toBe(
        false
      );
      expect(notificationService.validateEmail('user@@example.com')).toBe(
        false
      );
    });
  });

  describe('sendNotification', () => {
    test('sends notification to watchers', async () => {
      const watchers = [
        { email: 'user1@example.com', name: 'User 1' },
        { email: 'user2@example.com', name: 'User 2' },
      ];
      jest.clearAllMocks();

      await notificationService.sendNotification(
        watchers,
        'task-1',
        'Task updated'
      );

      expect(global.console.log).toHaveBeenCalledWith(
        '📧 Email sent to user1@example.com: Task updated for task task-1'
      );
      expect(global.console.log).toHaveBeenCalledWith(
        '📧 Email sent to user2@example.com: Task updated for task task-1'
      );
      expect(global.Notification).toHaveBeenCalledTimes(2);
    });

    test('handles empty watchers array', async () => {
      jest.clearAllMocks();
      await notificationService.sendNotification([], 'task-1', 'Task updated');
      expect(global.console.log).not.toHaveBeenCalled();
      expect(global.Notification).not.toHaveBeenCalled();
    });

    test('creates browser notification when permission granted', async () => {
      global.Notification.permission = 'granted';
      const watchers = [{ email: 'test@example.com', name: 'Test User' }];
      jest.clearAllMocks();

      await notificationService.sendNotification(
        watchers,
        'task-1',
        'Task updated'
      );

      expect(global.Notification).toHaveBeenCalledWith(
        'TaskTrek Notification',
        {
          body: 'Task updated for task task-1',
          icon: '/favicon.ico',
        }
      );
    });

    test('does not create browser notification when permission denied', async () => {
      global.Notification.permission = 'denied';
      const watchers = [{ email: 'test@example.com', name: 'Test User' }];
      jest.clearAllMocks();

      await notificationService.sendNotification(
        watchers,
        'task-1',
        'Task updated'
      );

      expect(global.Notification).not.toHaveBeenCalled();
      expect(global.console.log).toHaveBeenCalledWith(
        '📧 Email sent to test@example.com: Task updated for task task-1'
      );
    });
  });

  describe('notifyWatchers', () => {
    test('notifies watchers when they exist', () => {
      const watchers = [{ email: 'test@example.com', name: 'Test User' }];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(watchers));
      jest.clearAllMocks();

      notificationService.notifyWatchers('task-1', 'updated', 'Test Task');

      expect(global.console.log).toHaveBeenCalledWith(
        '📧 Email sent to test@example.com: Task "Test Task" has been updated for task task-1'
      );
      expect(global.Notification).toHaveBeenCalledWith(
        'TaskTrek Notification',
        {
          body: 'Task "Test Task" has been updated for task task-1',
          icon: '/favicon.ico',
        }
      );
    });

    test('does nothing when no watchers exist', () => {
      mockLocalStorage.getItem.mockReturnValue('[]');
      jest.clearAllMocks();

      notificationService.notifyWatchers('task-1', 'updated', 'Test Task');

      expect(global.console.log).not.toHaveBeenCalled();
      expect(global.Notification).not.toHaveBeenCalled();
    });

    test('handles invalid JSON in localStorage', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      jest.clearAllMocks();

      expect(() => {
        notificationService.notifyWatchers('task-1', 'updated', 'Test Task');
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error parsing watchers from localStorage:',
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('requestPermission', () => {
    test('requests notification permission when default', () => {
      global.Notification.permission = 'default';
      global.window = { Notification: global.Notification };
      jest.clearAllMocks();

      notificationService.requestPermission();
      expect(global.Notification.requestPermission).toHaveBeenCalled();
    });

    test('does not request permission when already granted', () => {
      global.Notification.permission = 'granted';
      global.window = { Notification: global.Notification };
      jest.clearAllMocks();

      notificationService.requestPermission();
      expect(global.Notification.requestPermission).not.toHaveBeenCalled();
    });

    test('does not request permission when denied', () => {
      global.Notification.permission = 'denied';
      global.window = { Notification: global.Notification };
      jest.clearAllMocks();

      notificationService.requestPermission();
      expect(global.Notification.requestPermission).not.toHaveBeenCalled();
    });

    test('handles missing Notification API', () => {
      const originalNotification = global.Notification;
      const originalWindow = global.window;

      global.window = {};
      delete global.Notification;
      jest.clearAllMocks();

      expect(() => {
        notificationService.requestPermission();
      }).not.toThrow();

      global.Notification = originalNotification;
      global.window = originalWindow;
    });
  });

  describe('error handling', () => {
    test('handles localStorage errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      jest.clearAllMocks();

      expect(() => {
        notificationService.notifyWatchers('task-1', 'updated', 'Test Task');
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error parsing watchers from localStorage:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    test('handles null localStorage value', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      jest.clearAllMocks();

      expect(() => {
        notificationService.notifyWatchers('task-1', 'updated', 'Test Task');
      }).not.toThrow();

      expect(global.console.log).not.toHaveBeenCalled();
    });
  });
});
