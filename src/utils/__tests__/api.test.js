import { syncToFiles, loadFromFiles, enableAutoSync } from '../api';

describe('api.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('syncToFiles executes without throwing', () => {
    expect(() => syncToFiles()).not.toThrow();
  });

  test('loadFromFiles executes without throwing', () => {
    expect(() => loadFromFiles()).not.toThrow();
  });

  test('enableAutoSync executes without throwing', () => {
    expect(() => enableAutoSync()).not.toThrow();
  });
});
