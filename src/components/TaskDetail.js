import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { notificationService } from '../utils/notifications';

const TaskDetail = ({ taskId, onClose, onUpdate }) => {
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [watchers, setWatchers] = useState([]);
  const [history, setHistory] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newWatcherEmail, setNewWatcherEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const projects = storage.getProjects();
  const components = storage.getComponents();
  const assignees = storage.getAssignees();

  useEffect(() => {
    const tasks = storage.getTasks();
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
      setEditForm(foundTask);
      setComments(storage.getComments(taskId));
      setWatchers(storage.getWatchers(taskId));
      setHistory(storage.getTaskHistory(taskId));
    }
  }, [taskId]);

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      author: 'Current User',
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    storage.saveComments(taskId, updatedComments);

    // Notify watchers about new comment
    notificationService.notifyWatchers(taskId, 'commented on', task.title);

    setNewComment('');
  };

  const addWatcher = () => {
    if (!newWatcherEmail.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!notificationService.validateEmail(newWatcherEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (watchers.find((w) => w.email === newWatcherEmail)) {
      setEmailError('This email is already watching this task');
      return;
    }

    const newWatcher = {
      id: Date.now().toString(),
      name: newWatcherEmail.split('@')[0],
      email: newWatcherEmail,
    };

    const updatedWatchers = [...watchers, newWatcher];
    setWatchers(updatedWatchers);
    storage.saveWatchers(taskId, updatedWatchers);
    setNewWatcherEmail('');
    setEmailError('');
  };

  const removeWatcher = (watcherId) => {
    const updatedWatchers = watchers.filter((w) => w.id !== watcherId);
    setWatchers(updatedWatchers);
    storage.saveWatchers(taskId, updatedWatchers);
  };

  const saveTask = () => {
    const tasks = storage.getTasks();
    const updatedTasks = tasks.map((t) =>
      t.id === taskId ? { ...editForm, updatedAt: new Date().toISOString() } : t
    );

    // Add to history
    const historyEntry = {
      id: Date.now().toString(),
      field: 'Task Updated',
      oldValue: task.title,
      newValue: editForm.title,
      timestamp: new Date().toISOString(),
      author: 'Current User',
    };

    const updatedHistory = [...history, historyEntry];
    setHistory(updatedHistory);
    storage.saveTaskHistory(taskId, updatedHistory);

    storage.saveTasks(updatedTasks);
    setTask(editForm);
    setIsEditing(false);

    // Notify watchers about task update
    notificationService.notifyWatchers(taskId, 'updated', editForm.title);

    onUpdate();
  };

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const component = components.find((c) => c.id === task.componentId);
  const assignee = assignees.find((a) => a.id === task.assigneeId);

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
    maxWidth: '1000px',
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
            marginBottom: '20px',
          }}
        >
          <h2>
            {project?.key}-{task.id}
          </h2>
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
          }}
        >
          <div>
            {isEditing ? (
              <div>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    fontSize: '18px',
                  }}
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    height: '100px',
                    marginBottom: '10px',
                  }}
                />
                <button
                  onClick={saveTask}
                  style={{
                    marginRight: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Edit
                </button>
              </div>
            )}

            <div style={{ marginTop: '30px' }}>
              <h4>Comments</h4>
              <div style={{ marginBottom: '15px' }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    height: '80px',
                    marginBottom: '10px',
                  }}
                />
                <button
                  onClick={addComment}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Add Comment
                </button>
              </div>

              {comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {comment.author} -{' '}
                    {new Date(comment.timestamp).toLocaleString()}
                  </div>
                  <div>{comment.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              <h4>Details</h4>
              <p>
                <strong>Type:</strong> {task.type}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={task.status}
                  onChange={(e) => {
                    const updatedTask = {
                      ...task,
                      status: e.target.value,
                      updatedAt: new Date().toISOString(),
                    };
                    setTask(updatedTask);
                    const tasks = storage.getTasks();
                    const updatedTasks = tasks.map((t) =>
                      t.id === taskId ? updatedTask : t
                    );
                    storage.saveTasks(updatedTasks);
                    onUpdate();
                  }}
                  style={{ marginLeft: '10px', padding: '2px' }}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="code-review">Code Review</option>
                  <option value="code-complete">Code Complete</option>
                  <option value="qa-verify">QA Verify</option>
                  <option value="resolved">Resolved</option>
                </select>
              </p>
              <p>
                <strong>Priority:</strong>
                <select
                  value={task.priority}
                  onChange={(e) => {
                    const updatedTask = {
                      ...task,
                      priority: e.target.value,
                      updatedAt: new Date().toISOString(),
                    };
                    setTask(updatedTask);
                    const tasks = storage.getTasks();
                    const updatedTasks = tasks.map((t) =>
                      t.id === taskId ? updatedTask : t
                    );
                    storage.saveTasks(updatedTasks);
                    onUpdate();
                  }}
                  style={{ marginLeft: '10px', padding: '2px' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </p>
              <p>
                <strong>Component:</strong>
                <select
                  value={task.componentId}
                  onChange={(e) => {
                    const updatedTask = {
                      ...task,
                      componentId: e.target.value,
                      updatedAt: new Date().toISOString(),
                    };
                    setTask(updatedTask);
                    const tasks = storage.getTasks();
                    const updatedTasks = tasks.map((t) =>
                      t.id === taskId ? updatedTask : t
                    );
                    storage.saveTasks(updatedTasks);
                    onUpdate();
                  }}
                  style={{ marginLeft: '10px', padding: '2px' }}
                >
                  {components.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Assignee:</strong>
                <select
                  value={task.assigneeId}
                  onChange={(e) => {
                    const updatedTask = {
                      ...task,
                      assigneeId: e.target.value,
                      updatedAt: new Date().toISOString(),
                    };
                    setTask(updatedTask);
                    const tasks = storage.getTasks();
                    const updatedTasks = tasks.map((t) =>
                      t.id === taskId ? updatedTask : t
                    );
                    storage.saveTasks(updatedTasks);
                    onUpdate();
                  }}
                  style={{ marginLeft: '10px', padding: '2px' }}
                >
                  {assignees.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Created:</strong>{' '}
                {new Date(task.createdAt).toLocaleDateString()}{' '}
                {new Date(task.createdAt).toLocaleTimeString()}
              </p>
              <p>
                <strong>Updated:</strong>{' '}
                {new Date(task.updatedAt).toLocaleDateString()}{' '}
                {new Date(task.updatedAt).toLocaleTimeString()}
              </p>
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              <h4>Watchers</h4>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newWatcherEmail}
                  onChange={(e) => {
                    setNewWatcherEmail(e.target.value);
                    setEmailError('');
                  }}
                  style={{
                    padding: '4px 8px',
                    marginRight: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    width: '200px',
                  }}
                />
                <button
                  onClick={addWatcher}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Add Watcher
                </button>
                {emailError && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '5px',
                    }}
                  >
                    {emailError}
                  </div>
                )}
              </div>
              {watchers.map((watcher) => (
                <div
                  key={watcher.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px',
                    padding: '5px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{watcher.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {watcher.email}
                    </div>
                  </div>
                  <button
                    onClick={() => removeWatcher(watcher.id)}
                    style={{
                      padding: '2px 6px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      fontSize: '12px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                borderRadius: '4px',
              }}
            >
              <h4>History</h4>
              {history.map((entry) => (
                <div
                  key={entry.id}
                  style={{ marginBottom: '10px', fontSize: '12px' }}
                >
                  <div>
                    <strong>{entry.author}</strong> -{' '}
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div>
                    {entry.field}: {entry.oldValue} → {entry.newValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
