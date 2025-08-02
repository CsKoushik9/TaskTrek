import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import App from '../App';

// Mock child components
jest.mock('../components/Dashboard', () => () => <div>Dashboard</div>);

// Mock fetch
global.fetch = jest.fn();

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('handles successful data sync', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', title: 'Test Task' }]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', name: 'Test Project' }]),
      });

    render(<App />);

    await waitFor(() => {
      expect(localStorage.getItem('tasktrek_tasks')).toBeTruthy();
    });

    await waitFor(() => {
      expect(localStorage.getItem('tasktrek_projects')).toBeTruthy();
    });
  });

  test('handles fetch errors gracefully', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    render(<App />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
