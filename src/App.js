import React, { useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {
  useEffect(() => {
    // Initialize data sync for MCP server integration
    const syncData = async () => {
      try {
        // Check if data directory exists and load from files
        const response = await fetch('/data/tasks.json').catch(() => null);
        if (response && response.ok) {
          const tasks = await response.json();
          localStorage.setItem('tasktrek_tasks', JSON.stringify(tasks));
        }

        const projectsResponse = await fetch('/data/projects.json').catch(
          () => null
        );
        if (projectsResponse && projectsResponse.ok) {
          const projects = await projectsResponse.json();
          localStorage.setItem('tasktrek_projects', JSON.stringify(projects));
        }
      } catch (error) {
        console.log('MCP sync not available:', error);
      }
    };

    syncData();
    // Set up periodic sync every 5 seconds
    const interval = setInterval(syncData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
