// API layer for TaskTrek to sync with MCP server
import { storage } from './storage';

const DATA_DIR = '../data';

// Sync localStorage data to JSON files for MCP server
export const syncToFiles = () => {
  try {
    const fs = require('fs');
    const path = require('path');

    const dataPath = path.join(__dirname, '..', '..', 'data');

    // Ensure data directory exists
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }

    // Sync tasks
    const tasks = storage.getTasks();
    fs.writeFileSync(
      path.join(dataPath, 'tasks.json'),
      JSON.stringify(tasks, null, 2)
    );

    // Sync projects
    const projects = storage.getProjects();
    fs.writeFileSync(
      path.join(dataPath, 'projects.json'),
      JSON.stringify(projects, null, 2)
    );

    // Sync components
    const components = storage.getComponents();
    fs.writeFileSync(
      path.join(dataPath, 'components.json'),
      JSON.stringify(components, null, 2)
    );

    // Sync assignees
    const assignees = storage.getAssignees();
    fs.writeFileSync(
      path.join(dataPath, 'assignees.json'),
      JSON.stringify(assignees, null, 2)
    );

    console.log('Data synced to files successfully');
  } catch (error) {
    console.error('Error syncing data to files:', error);
  }
};

// Load data from JSON files to localStorage
export const loadFromFiles = () => {
  try {
    const fs = require('fs');
    const path = require('path');

    const dataPath = path.join(__dirname, '..', '..', 'data');

    // Load tasks
    const tasksFile = path.join(dataPath, 'tasks.json');
    if (fs.existsSync(tasksFile)) {
      const tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
      storage.saveTasks(tasks);
    }

    // Load projects
    const projectsFile = path.join(dataPath, 'projects.json');
    if (fs.existsSync(projectsFile)) {
      const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
      storage.saveProjects(projects);
    }

    // Load components
    const componentsFile = path.join(dataPath, 'components.json');
    if (fs.existsSync(componentsFile)) {
      const components = JSON.parse(fs.readFileSync(componentsFile, 'utf8'));
      storage.saveComponents(components);
    }

    // Load assignees
    const assigneesFile = path.join(dataPath, 'assignees.json');
    if (fs.existsSync(assigneesFile)) {
      const assignees = JSON.parse(fs.readFileSync(assigneesFile, 'utf8'));
      storage.saveAssignees(assignees);
    }

    console.log('Data loaded from files successfully');
  } catch (error) {
    console.error('Error loading data from files:', error);
  }
};

// Auto-sync data when localStorage changes
export const enableAutoSync = () => {
  // Override storage methods to auto-sync
  const originalSaveTasks = storage.saveTasks;
  const originalSaveProjects = storage.saveProjects;
  const originalSaveComponents = storage.saveComponents;
  const originalSaveAssignees = storage.saveAssignees;

  storage.saveTasks = (tasks) => {
    originalSaveTasks(tasks);
    syncToFiles();
  };

  storage.saveProjects = (projects) => {
    originalSaveProjects(projects);
    syncToFiles();
  };

  storage.saveComponents = (components) => {
    originalSaveComponents(components);
    syncToFiles();
  };

  storage.saveAssignees = (assignees) => {
    originalSaveAssignees(assignees);
    syncToFiles();
  };
};
