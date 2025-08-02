import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock Dashboard component
jest.mock('../components/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">Dashboard Component</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('renders Dashboard component', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('has correct structure', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });
});
