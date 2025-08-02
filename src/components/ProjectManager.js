import React, { useState } from 'react';
import { storage } from '../utils/storage';

const ProjectManager = ({ onClose }) => {
  const [projects, setProjects] = useState(storage.getProjects());
  const [components, setComponents] = useState(storage.getComponents());
  const [assignees, setAssignees] = useState(storage.getAssignees());
  const [activeTab, setActiveTab] = useState('projects');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    key: '',
  });
  const [newComponent, setNewComponent] = useState({
    name: '',
    projectId: 'default',
  });
  const [newAssignee, setNewAssignee] = useState({ name: '', email: '' });

  const addProject = () => {
    if (newProject.name.trim() && newProject.key.trim()) {
      const project = {
        id: Date.now().toString(),
        ...newProject,
        key: newProject.key.toUpperCase(),
      };
      const updatedProjects = [...projects, project];
      setProjects(updatedProjects);
      storage.saveProjects(updatedProjects);
      setNewProject({ name: '', description: '', key: '' });
    }
  };

  const deleteProject = (projectId) => {
    if (projectId === 'default') return; // Can't delete default project
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    storage.saveProjects(updatedProjects);

    // Remove components for this project
    const updatedComponents = components.filter(
      (c) => c.projectId !== projectId
    );
    setComponents(updatedComponents);
    storage.saveComponents(updatedComponents);
  };

  const addComponent = () => {
    if (newComponent.name.trim()) {
      const component = {
        id: Date.now().toString(),
        ...newComponent,
      };
      const updatedComponents = [...components, component];
      setComponents(updatedComponents);
      storage.saveComponents(updatedComponents);
      setNewComponent({ name: '', projectId: 'default' });
    }
  };

  const deleteComponent = (componentId) => {
    const updatedComponents = components.filter((c) => c.id !== componentId);
    setComponents(updatedComponents);
    storage.saveComponents(updatedComponents);
  };

  const addAssignee = () => {
    if (newAssignee.name.trim()) {
      const assignee = {
        id: Date.now().toString(),
        ...newAssignee,
      };
      const updatedAssignees = [...assignees, assignee];
      setAssignees(updatedAssignees);
      storage.saveAssignees(updatedAssignees);
      setNewAssignee({ name: '', email: '' });
    }
  };

  const deleteAssignee = (assigneeId) => {
    if (assigneeId === 'unassigned') return; // Can't delete unassigned
    const updatedAssignees = assignees.filter((a) => a.id !== assigneeId);
    setAssignees(updatedAssignees);
    storage.saveAssignees(updatedAssignees);
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
    width: '80%',
    maxWidth: '800px',
    maxHeight: '80%',
    overflow: 'auto',
  };

  const tabStyle = {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    marginRight: '4px',
    borderRadius: '4px 4px 0 0',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#007bff',
    color: '#fff',
  };

  const inputStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginRight: '8px',
    marginBottom: '8px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  };

  const itemStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
          <h2>Project Manager</h2>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              backgroundColor: '#6c757d',
              color: '#fff',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            style={activeTab === 'projects' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            style={activeTab === 'components' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('components')}
          >
            Components
          </button>
          <button
            style={activeTab === 'assignees' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('assignees')}
          >
            Assignees
          </button>
        </div>

        {activeTab === 'projects' && (
          <div>
            <h3>Projects</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Project name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Project key (e.g., PROJ)"
                value={newProject.key}
                onChange={(e) =>
                  setNewProject({ ...newProject, key: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                style={inputStyle}
              />
              <button
                onClick={addProject}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#28a745',
                  color: '#fff',
                }}
              >
                Add Project
              </button>
            </div>
            {projects.map((project) => (
              <div key={project.id} style={itemStyle}>
                <div>
                  <strong>
                    {project.name} ({project.key})
                  </strong>
                  <br />
                  <small>{project.description}</small>
                </div>
                {project.id !== 'default' && (
                  <button
                    onClick={() => deleteProject(project.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#dc3545',
                      color: '#fff',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'components' && (
          <div>
            <h3>Components</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Component name"
                value={newComponent.name}
                onChange={(e) =>
                  setNewComponent({ ...newComponent, name: e.target.value })
                }
                style={inputStyle}
              />
              <select
                value={newComponent.projectId}
                onChange={(e) =>
                  setNewComponent({
                    ...newComponent,
                    projectId: e.target.value,
                  })
                }
                style={inputStyle}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addComponent}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#28a745',
                  color: '#fff',
                }}
              >
                Add Component
              </button>
            </div>
            {components.map((component) => {
              const project = projects.find(
                (p) => p.id === component.projectId
              );
              return (
                <div key={component.id} style={itemStyle}>
                  <div>
                    <strong>{component.name}</strong>
                    <br />
                    <small>Project: {project?.name || 'Unknown'}</small>
                  </div>
                  <button
                    onClick={() => deleteComponent(component.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#dc3545',
                      color: '#fff',
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'assignees' && (
          <div>
            <h3>Assignees</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Name"
                value={newAssignee.name}
                onChange={(e) =>
                  setNewAssignee({ ...newAssignee, name: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={newAssignee.email}
                onChange={(e) =>
                  setNewAssignee({ ...newAssignee, email: e.target.value })
                }
                style={inputStyle}
              />
              <button
                onClick={addAssignee}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#28a745',
                  color: '#fff',
                }}
              >
                Add Assignee
              </button>
            </div>
            {assignees.map((assignee) => (
              <div key={assignee.id} style={itemStyle}>
                <div>
                  <strong>{assignee.name}</strong>
                  <br />
                  <small>{assignee.email}</small>
                </div>
                {assignee.id !== 'unassigned' && (
                  <button
                    onClick={() => deleteAssignee(assignee.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#dc3545',
                      color: '#fff',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;
