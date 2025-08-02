// Local storage utilities for TaskTrek
const STORAGE_KEYS = {
  TASKS: 'tasktrek_tasks',
  PROJECTS: 'tasktrek_projects',
  COMPONENTS: 'tasktrek_components',
  ASSIGNEES: 'tasktrek_assignees',
};

const DEFAULT_PROJECTS = [
  {
    id: 'default',
    name: 'Default Project',
    description: 'Default project for tasks',
    key: 'DEF',
  },
];

const DEFAULT_COMPONENTS = [
  { id: 'frontend', name: 'Frontend', projectId: 'default' },
  { id: 'backend', name: 'Backend', projectId: 'default' },
  { id: 'database', name: 'Database', projectId: 'default' },
];

const DEFAULT_ASSIGNEES = [
  { id: 'unassigned', name: 'Unassigned', email: '' },
  { id: 'john', name: 'John Doe', email: 'john@example.com' },
  { id: 'jane', name: 'Jane Smith', email: 'jane@example.com' },
];

export const TASK_TYPES = {
  BUG: 'bug',
  FEATURE: 'feature',
  ENHANCEMENT: 'enhancement',
};

export const WORKFLOW_STATUSES = {
  SCREEN: 'screen',
  IN_PROGRESS: 'in-progress',
  CODE_REVIEW: 'code-review',
  CODE_COMPLETE: 'code-complete',
  QA_VERIFY: 'qa-verify',
  RESOLVED: 'resolved',
};

export const storage = {
  getTasks: () => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },

  saveTasks: (tasks) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getProjects: () => {
    const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return projects ? JSON.parse(projects) : DEFAULT_PROJECTS;
  },

  saveProjects: (projects) => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },

  getComponents: () => {
    const components = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
    return components ? JSON.parse(components) : DEFAULT_COMPONENTS;
  },

  saveComponents: (components) => {
    localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(components));
  },

  getAssignees: () => {
    const assignees = localStorage.getItem(STORAGE_KEYS.ASSIGNEES);
    return assignees ? JSON.parse(assignees) : DEFAULT_ASSIGNEES;
  },

  saveAssignees: (assignees) => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNEES, JSON.stringify(assignees));
  },

  getComments: (taskId) => {
    const comments = localStorage.getItem(`tasktrek_comments_${taskId}`);
    return comments ? JSON.parse(comments) : [];
  },

  saveComments: (taskId, comments) => {
    localStorage.setItem(
      `tasktrek_comments_${taskId}`,
      JSON.stringify(comments)
    );
  },

  getWatchers: (taskId) => {
    const watchers = localStorage.getItem(`tasktrek_watchers_${taskId}`);
    return watchers ? JSON.parse(watchers) : [];
  },

  saveWatchers: (taskId, watchers) => {
    localStorage.setItem(
      `tasktrek_watchers_${taskId}`,
      JSON.stringify(watchers)
    );
  },

  getTaskHistory: (taskId) => {
    const history = localStorage.getItem(`tasktrek_history_${taskId}`);
    return history ? JSON.parse(history) : [];
  },

  saveTaskHistory: (taskId, history) => {
    localStorage.setItem(`tasktrek_history_${taskId}`, JSON.stringify(history));
  },
};
