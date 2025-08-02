import React, { useState, useEffect } from 'react';
import { storage, TASK_TYPES, WORKFLOW_STATUSES } from '../utils/storage';

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: WORKFLOW_STATUSES.SCREEN,
    projectId: 'default',
    type: TASK_TYPES.FEATURE,
    componentId: 'frontend',
    assigneeId: 'unassigned',
    labels: [],
  });

  const [projects] = useState(storage.getProjects());
  const [components] = useState(storage.getComponents());
  const [assignees] = useState(storage.getAssignees());
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        labels: task.labels || [],
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const taskData = {
      ...formData,
      id: task?.id || Date.now().toString(),
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to history if editing
    if (task?.id) {
      const history = storage.getTaskHistory(task.id);
      const historyEntry = {
        id: Date.now().toString(),
        field: 'Task Updated',
        oldValue: task.title,
        newValue: formData.title,
        timestamp: new Date().toISOString(),
        author: 'Current User',
      };
      storage.saveTaskHistory(task.id, [...history, historyEntry]);
    }

    onSave(taskData);

    if (!task) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: WORKFLOW_STATUSES.SCREEN,
        projectId: 'default',
        type: TASK_TYPES.FEATURE,
        componentId: 'frontend',
        assigneeId: 'unassigned',
        labels: [],
      });
    }
  };

  const addLabel = () => {
    if (
      labelInput.trim() &&
      !(formData.labels || []).includes(labelInput.trim())
    ) {
      setFormData({
        ...formData,
        labels: [...(formData.labels || []), labelInput.trim()],
      });
      setLabelInput('');
    }
  };

  const removeLabel = (labelToRemove) => {
    setFormData({
      ...formData,
      labels: (formData.labels || []).filter(
        (label) => label !== labelToRemove
      ),
    });
  };

  const formStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    margin: '20px 0',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '12px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  };

  const labelStyle = {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    margin: '2px',
    cursor: 'pointer',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={{ marginTop: 0 }}>{task ? 'Edit Task' : 'Create New Task'}</h3>

      <input
        type="text"
        placeholder="Task title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        style={inputStyle}
        required
      />

      <textarea
        placeholder="Task description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
      />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <select
          value={formData.projectId}
          onChange={(e) =>
            setFormData({ ...formData, projectId: e.target.value })
          }
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        >
          <option value={TASK_TYPES.BUG}>🐛 Bug</option>
          <option value={TASK_TYPES.FEATURE}>✨ Feature</option>
          <option value={TASK_TYPES.ENHANCEMENT}>🚀 Enhancement</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        >
          <option value={WORKFLOW_STATUSES.SCREEN}>Screen</option>
          <option value={WORKFLOW_STATUSES.IN_PROGRESS}>In Progress</option>
          <option value={WORKFLOW_STATUSES.CODE_REVIEW}>Code Review</option>
          <option value={WORKFLOW_STATUSES.CODE_COMPLETE}>Code Complete</option>
          <option value={WORKFLOW_STATUSES.QA_VERIFY}>QA Verify</option>
          <option value={WORKFLOW_STATUSES.RESOLVED}>Resolved</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <select
          value={formData.componentId}
          onChange={(e) =>
            setFormData({ ...formData, componentId: e.target.value })
          }
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        >
          {components
            .filter((c) => c.projectId === formData.projectId)
            .map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
        </select>

        <select
          value={formData.assigneeId}
          onChange={(e) =>
            setFormData({ ...formData, assigneeId: e.target.value })
          }
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        >
          {assignees.map((assignee) => (
            <option key={assignee.id} value={assignee.id}>
              {assignee.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            placeholder="Add label"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addLabel())
            }
          />
          <button
            type="button"
            onClick={addLabel}
            style={{
              ...buttonStyle,
              backgroundColor: '#17a2b8',
              color: '#fff',
            }}
          >
            Add Label
          </button>
        </div>
        <div>
          {(formData.labels || []).map((label) => (
            <span
              key={label}
              style={labelStyle}
              onClick={() => removeLabel(label)}
            >
              {label} ×
            </span>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          style={{ ...buttonStyle, backgroundColor: '#28a745', color: '#fff' }}
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
        {task && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              ...buttonStyle,
              backgroundColor: '#6c757d',
              color: '#fff',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
