import React, { useState, useEffect } from 'react';
import { storage, WORKFLOW_STATUSES } from '../utils/storage';
import { PieChart, BarChart, LineChart } from './Charts';

const Analytics = ({ onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [timeRange, setTimeRange] = useState('7'); // days

  useEffect(() => {
    setTasks(storage.getTasks());
    setProjects(storage.getProjects());
  }, []);

  const getStatusData = () => {
    const statusCounts = {};
    Object.values(WORKFLOW_STATUSES).forEach((status) => {
      statusCounts[status] = 0;
    });

    tasks.forEach((task) => {
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      }
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      label: status.replace('-', ' ').toUpperCase(),
      value: count,
    }));
  };

  const getPriorityData = () => {
    const priorityCounts = { high: 0, medium: 0, low: 0 };

    tasks.forEach((task) => {
      if (priorityCounts.hasOwnProperty(task.priority)) {
        priorityCounts[task.priority]++;
      }
    });

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      label: priority.toUpperCase(),
      value: count,
    }));
  };

  const getProjectData = () => {
    const projectCounts = {};

    projects.forEach((project) => {
      projectCounts[project.id] = 0;
    });

    tasks.forEach((task) => {
      if (projectCounts.hasOwnProperty(task.projectId)) {
        projectCounts[task.projectId]++;
      }
    });

    return Object.entries(projectCounts).map(([projectId, count]) => {
      const project = projects.find((p) => p.id === projectId);
      return {
        label: project?.name || 'Unknown',
        value: count,
      };
    });
  };

  const getTimelineData = () => {
    const days = parseInt(timeRange);
    const timeline = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const tasksCreated = tasks.filter(
        (task) => task.createdAt && task.createdAt.startsWith(dateStr)
      ).length;

      timeline.push({
        label: date.getDate().toString(),
        value: tasksCreated,
      });
    }

    return timeline;
  };

  const getCompletionRate = () => {
    const completed = tasks.filter((task) => task.status === 'resolved').length;
    const total = tasks.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getAverageTimeToComplete = () => {
    const completedTasks = tasks.filter((task) => task.status === 'resolved');
    if (completedTasks.length === 0) return 0;

    const totalTime = completedTasks.reduce((sum, task) => {
      const created = new Date(task.createdAt);
      const updated = new Date(task.updatedAt);
      return sum + (updated - created);
    }, 0);

    const avgTime = totalTime / completedTasks.length;
    return Math.round(avgTime / (1000 * 60 * 60 * 24)); // Convert to days
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '90%',
    overflow: 'auto',
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2>📊 Analytics Dashboard</h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>

        {/* Key Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
              {tasks.length}
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Total Tasks</p>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
              {getCompletionRate()}%
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Completion Rate</p>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>
              {getAverageTimeToComplete()}
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Avg Days to Complete</p>
          </div>
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>
              {projects.length}
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Active Projects</p>
          </div>
        </div>

        {/* Charts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <PieChart data={getStatusData()} title="Tasks by Status" />
          </div>
          <div
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <PieChart data={getPriorityData()} title="Tasks by Priority" />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
          }}
        >
          <div
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <BarChart data={getProjectData()} title="Tasks by Project" />
          </div>
          <div
            style={{
              border: '1px solid #ddd',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <label style={{ marginRight: '10px' }}>Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px' }}
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
            <LineChart
              data={getTimelineData()}
              title="Tasks Created Over Time"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
