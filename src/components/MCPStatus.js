import React, { useState, useEffect } from 'react';

const MCPStatus = () => {
  const [mcpConnected, setMcpConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Check if MCP server data directory exists
    checkMCPStatus();

    // Set up periodic sync check
    const interval = setInterval(checkMCPStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkMCPStatus = () => {
    try {
      // In a real implementation, this would check if the MCP server is running
      // For now, we'll simulate the check
      const hasDataFiles = localStorage.getItem('tasktrek_tasks') !== null;
      setMcpConnected(hasDataFiles);
      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      setMcpConnected(false);
    }
  };

  const syncData = async () => {
    try {
      // Load data from MCP server files
      const response = await fetch('/data/tasks.json');
      if (response.ok) {
        const tasks = await response.json();
        localStorage.setItem('tasktrek_tasks', JSON.stringify(tasks));
        setLastSync(new Date().toLocaleTimeString());
        window.location.reload(); // Refresh to show new data
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  const statusStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#fff',
    border: `2px solid ${mcpConnected ? '#28a745' : '#dc3545'}`,
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '12px',
    zIndex: 1000,
  };

  const indicatorStyle = {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: mcpConnected ? '#28a745' : '#dc3545',
    marginRight: '8px',
  };

  return (
    <div style={statusStyle}>
      <div style={{ marginBottom: '8px' }}>
        <span style={indicatorStyle}></span>
        <strong>MCP Server</strong>
      </div>
      <div style={{ color: '#666' }}>
        Status: {mcpConnected ? 'Connected' : 'Disconnected'}
      </div>
      {lastSync && <div style={{ color: '#666' }}>Last sync: {lastSync}</div>}
      <button
        onClick={syncData}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          fontSize: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Sync Now
      </button>
    </div>
  );
};

export default MCPStatus;
