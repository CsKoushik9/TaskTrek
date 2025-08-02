import React from 'react';
import { storage, TASK_TYPES, WORKFLOW_STATUSES } from '../utils/storage';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onView }) => {
  const projects = storage.getProjects();
  const components = storage.getComponents();
  const assignees = storage.getAssignees();

  const project = projects.find((p) => p.id === task.projectId);
  const component = components.find((c) => c.id === task.componentId);
  const assignee = assignees.find((a) => a.id === task.assigneeId);

  const getStatusColor = (status) => {
    switch (status) {
      case WORKFLOW_STATUSES.SCREEN:
        return '#6c757d';
      case WORKFLOW_STATUSES.IN_PROGRESS:
        return '#007bff';
      case WORKFLOW_STATUSES.CODE_REVIEW:
        return '#fd7e14';
      case WORKFLOW_STATUSES.CODE_COMPLETE:
        return '#20c997';
      case WORKFLOW_STATUSES.QA_VERIFY:
        return '#ffc107';
      case WORKFLOW_STATUSES.RESOLVED:
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case TASK_TYPES.BUG:
        return '🐛';
      case TASK_TYPES.FEATURE:
        return '✨';
      case TASK_TYPES.ENHANCEMENT:
        return '🚀';
      default:
        return '📝';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case WORKFLOW_STATUSES.SCREEN:
        return 'Screen';
      case WORKFLOW_STATUSES.IN_PROGRESS:
        return 'In Progress';
      case WORKFLOW_STATUSES.CODE_REVIEW:
        return 'Code Review';
      case WORKFLOW_STATUSES.CODE_COMPLETE:
        return 'Code Complete';
      case WORKFLOW_STATUSES.QA_VERIFY:
        return 'QA Verify';
      case WORKFLOW_STATUSES.RESOLVED:
        return 'Resolved';
      default:
        return status;
    }
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px 0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  };

  const statusStyle = {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: getStatusColor(task.status),
    textTransform: 'uppercase',
  };

  const priorityStyle = {
    color:
      task.priority === 'critical'
        ? '#dc3545'
        : task.priority === 'high'
          ? '#dc3545'
          : task.priority === 'medium'
            ? '#ffc107'
            : '#28a745',
    fontWeight: 'bold',
  };

  const labelStyle = {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '10px',
    margin: '2px',
  };

  const metaStyle = {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  };

  return (
    <div style={cardStyle}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={metaStyle}>
            <span>
              {getTypeIcon(task.type)} {project?.key || 'DEF'}-{task.id}
            </span>
            <span style={{ marginLeft: '8px' }}>
              📦 {component?.name || 'Unknown'}
            </span>
            <span style={{ marginLeft: '8px' }}>
              👤 {assignee?.name || 'Unassigned'}
            </span>
          </div>

          <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{task.title}</h4>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
            {task.description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={statusStyle}>{getStatusLabel(task.status)}</span>
            <span style={priorityStyle}>Priority: {task.priority}</span>
          </div>

          {task.labels && task.labels.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              {task.labels.map((label) => (
                <span key={label} style={labelStyle}>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            style={{
              padding: '4px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '12px',
            }}
          >
            <option value={WORKFLOW_STATUSES.SCREEN}>Screen</option>
            <option value={WORKFLOW_STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={WORKFLOW_STATUSES.CODE_REVIEW}>Code Review</option>
            <option value={WORKFLOW_STATUSES.CODE_COMPLETE}>
              Code Complete
            </option>
            <option value={WORKFLOW_STATUSES.QA_VERIFY}>QA Verify</option>
            <option value={WORKFLOW_STATUSES.RESOLVED}>Resolved</option>
          </select>
          {onView && (
            <button
              onClick={() => onView()}
              style={{
                padding: '4px 8px',
                backgroundColor: '#17a2b8',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              View
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
