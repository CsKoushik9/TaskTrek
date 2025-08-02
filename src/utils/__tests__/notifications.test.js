import { notificationService } from '../notifications';

// Mock Notification API
global.Notification = jest.fn();
global.Notification.permission = 'granted';
global.Notification.requestPermission = jest.fn();

describe('notifications.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('sendSMTP executes without throwing', async () => {
    await expect(
      notificationService.sendSMTP('test@example.com', 'message', '123')
    ).resolves.toBeUndefined();
  });

  test('sendSendGrid executes without throwing', async () => {
    await expect(
      notificationService.sendSendGrid('test@example.com', 'message', '123')
    ).resolves.toBeUndefined();
  });

  test('sendAWSSES executes without throwing', async () => {
    await expect(
      notificationService.sendAWSSES('test@example.com', 'message', '123')
    ).resolves.toBeUndefined();
  });

  test('validateEmail validates email format', () => {
    expect(notificationService.validateEmail('test@example.com')).toBe(true);
    expect(notificationService.validateEmail('invalid-email')).toBe(false);
  });
});
