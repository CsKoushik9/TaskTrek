import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import ProjectManager from './ProjectManager';
import TaskDetail from './TaskDetail';
import Analytics from './Analytics';
import { storage, WORKFLOW_STATUSES } from '../utils/storage';
import { notificationService } from '../utils/notifications';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTasks(storage.getTasks());
  }, [refreshKey]);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const saveTask = (task) => {
    const updatedTasks = editingTask
      ? tasks.map((t) => (t.id === task.id ? task : t))
      : [...tasks, task];

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const updatedTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);

    // Notify watchers about task deletion
    if (taskToDelete) {
      notificationService.notifyWatchers(taskId, 'deleted', taskToDelete.title);
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const updatedTask = {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        // Add to history
        const history = storage.getTaskHistory(taskId);
        const historyEntry = {
          id: Date.now().toString(),
          field: 'Status',
          oldValue: t.status,
          newValue: newStatus,
          timestamp: new Date().toISOString(),
          author: 'Current User',
        };
        storage.saveTaskHistory(taskId, [...history, historyEntry]);

        // Notify watchers
        notificationService.notifyWatchers(
          taskId,
          `moved to ${newStatus}`,
          t.title
        );

        return updatedTask;
      }
      return t;
    });
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      screen: tasks.filter((t) => t.status === WORKFLOW_STATUSES.SCREEN).length,
      inProgress: tasks.filter(
        (t) => t.status === WORKFLOW_STATUSES.IN_PROGRESS
      ).length,
      codeReview: tasks.filter(
        (t) => t.status === WORKFLOW_STATUSES.CODE_REVIEW
      ).length,
      codeComplete: tasks.filter(
        (t) => t.status === WORKFLOW_STATUSES.CODE_COMPLETE
      ).length,
      qaVerify: tasks.filter((t) => t.status === WORKFLOW_STATUSES.QA_VERIFY)
        .length,
      resolved: tasks.filter((t) => t.status === WORKFLOW_STATUSES.RESOLVED)
        .length,
    };
  };

  const counts = getTaskCounts();

  const headerStyle = {
    backgroundColor: '#0052cc',
    color: '#fff',
    padding: '20px',
    marginBottom: '20px',
  };

  const statsStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const statCardStyle = {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '120px',
    textAlign: 'center',
  };

  const filterStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const filterButtonStyle = {
    padding: '8px 16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  };

  const activeFilterStyle = {
    ...filterButtonStyle,
    backgroundColor: '#0052cc',
    color: '#fff',
    borderColor: '#0052cc',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={headerStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>🚀 TaskTrek</h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
              Project Management Made Simple
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAnalytics(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                color: '#0052cc',
                border: '2px solid #fff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setShowProjectManager(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                color: '#0052cc',
                border: '2px solid #fff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ⚙️ Manage Projects
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={statsStyle}>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
              {counts.total}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Total Tasks
            </p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#6c757d' }}>
              {counts.screen}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Screen</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#007bff' }}>
              {counts.inProgress}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              In Progress
            </p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#fd7e14' }}>
              {counts.codeReview}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Code Review
            </p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#20c997' }}>
              {counts.codeComplete}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Code Complete
            </p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#ffc107' }}>
              {counts.qaVerify}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              QA Verify
            </p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 8px 0', color: '#28a745' }}>
              {counts.resolved}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Resolved
            </p>
          </div>
        </div>

        <TaskForm
          task={editingTask}
          onSave={saveTask}
          onCancel={() => setEditingTask(null)}
        />

        <div style={filterStyle}>
          <button
            style={filter === 'all' ? activeFilterStyle : filterButtonStyle}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            style={
              filter === WORKFLOW_STATUSES.SCREEN
                ? activeFilterStyle
                : filterButtonStyle
            }
            onClick={() => setFilter(WORKFLOW_STATUSES.SCREEN)}
          >
            Screen
          </button>
          <button
            style={
              filter === WORKFLOW_STATUSES.IN_PROGRESS
                ? activeFilterStyle
                : filterButtonStyle
            }
            onClick={() => setFilter(WORKFLOW_STATUSES.IN_PROGRESS)}
          >
            In Progress
          </button>
          <button
            style={
              filter === WORKFLOW_STATUSES.CODE_REVIEW
                ? activeFilterStyle
                : filterButtonStyle
            }
            onClick={() => setFilter(WORKFLOW_STATUSES.CODE_REVIEW)}
          >
            Code Review
          </button>
          <button
            style={
              filter === WORKFLOW_STATUSES.CODE_COMPLETE
                ? activeFilterStyle
                : filterButtonStyle
            }
            onClick={() => setFilter(WORKFLOW_STATUSES.CODE_COMPLETE)}
          >
            Code Complete
          </button>
          <button
            style={
              filter === WORKFLOW_STATUSES.QA_VERIFY
                ? activeFilterStyle
                : filterButtonStyle
            }
            onClick={() => setFilter(WORKFLOW_STATUSES.QA_VERIFY)}
          >
            QA Verify
          </button>
          <button
            style={
              filter === WORKFLOW_STATUSES.RESOLVED
                ? activeFilterStyle
                : filterButtonStyle
            }
            onClick={() => setFilter(WORKFLOW_STATUSES.RESOLVED)}
          >
            Resolved
          </button>
        </div>

        <div>
          {filteredTasks.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ color: '#666' }}>No tasks found</h3>
              <p style={{ color: '#999' }}>
                Create your first task to get started!
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
                onView={() => setSelectedTaskId(task.id)}
              />
            ))
          )}
        </div>
      </div>

      {showProjectManager && (
        <ProjectManager
          onClose={() => {
            setShowProjectManager(false);
            refreshData();
          }}
        />
      )}

      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={refreshData}
        />
      )}

      {showAnalytics && <Analytics onClose={() => setShowAnalytics(false)} />}
    </div>
  );
};

export default Dashboard;
