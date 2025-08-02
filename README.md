# 🚀 TaskTrek

A modern, JIRA-like project management tool built with React. TaskTrek provides an intuitive interface for managing tasks, projects, and team collaboration with real-time analytics and comprehensive workflow management.

## 🤖 AI Integration Available

**TaskTrek MCP Server** is available for AI assistant integration! This allows you to manage tasks through natural language commands.

### MCP Server Repository
**🔗 [TaskTrek MCP Server](https://github.com/CsKoushik9/TaskTrekMCP)**

For detailed setup instructions, configuration, and usage examples, visit the dedicated MCP server repository.

### Quick Setup:
```bash
git clone https://github.com/CsKoushik9/TaskTrekMCP.git
cd TaskTrekMCP
npm install
npm start
```

### Supported AI Assistants:
- **Claude Desktop** (Recommended)
- **Cline** (VS Code Extension)
- **Continue.dev** (VS Code)
- Any MCP-compatible client

### Example AI Commands:
- "Create a high-priority bug task for login issues"
- "List all tasks in the default project"
- "Update task DEF-123 to in-progress status"
- "Show me a summary of all tasks"

**📖 Full Documentation**: [https://github.com/CsKoushik9/TaskTrekMCP](https://github.com/CsKoushik9/TaskTrekMCP)

## ✨ Features

### Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks with detailed information
- **Workflow States**: Complete task lifecycle from Screen → In Progress → Code Review → Code Complete → QA Verify → Resolved
- **Project Organization**: Multi-project support with customizable components and assignees
- **Real-time Analytics**: Interactive charts and metrics dashboard
- **Task Comments**: Collaborative commenting system with timestamps
- **Watcher System**: Email-based task notifications and updates
- **Task History**: Complete audit trail of all task changes

### User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Dashboard**: Clean, modern interface inspired by JIRA
- **Advanced Filtering**: Filter tasks by status, priority, project, and more
- **Visual Charts**: Pie charts, bar charts, and line graphs for data visualization
- **Modal-based Editing**: Streamlined task editing experience

### Technical Features
- **Local Storage**: Persistent data storage in browser
- **Real-time Updates**: Instant UI updates without page refresh
- **Comprehensive Testing**: 187 test cases with 93%+ coverage
- **Type Safety**: Robust error handling and validation
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Styling**: Inline styles with responsive design
- **State Management**: React Hooks (useState, useEffect)
- **Data Persistence**: Browser LocalStorage
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App
- **Linting**: ESLint
- **Formatting**: Prettier

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskTrek
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### Getting Started

1. **Dashboard Overview**: The main dashboard displays all tasks with filtering options and statistics
2. **Create Your First Task**: Click the "Create New Task" button to add a task
3. **Manage Projects**: Use the "⚙️ Manage Projects" button to set up projects, components, and assignees
4. **View Analytics**: Click "📊 Analytics" to see detailed project metrics and charts
5. **MCP Status**: Check the bottom-right corner for MCP server connection status

### Task Management

#### Creating Tasks
- Fill in task title, description, type (Bug/Feature/Enhancement)
- Set priority (Low/Medium/High/Critical)
- Assign to project, component, and team member
- Add labels for better organization

#### Task Workflow
Tasks follow a structured workflow:
1. **Screen**: Initial task review
2. **In Progress**: Active development
3. **Code Review**: Peer review phase
4. **Code Complete**: Development finished
5. **QA Verify**: Quality assurance testing
6. **Resolved**: Task completed

#### Task Details
- **Comments**: Add collaborative comments with timestamps
- **Watchers**: Add email addresses to receive notifications
- **History**: View complete audit trail of changes
- **Editing**: Inline editing of task details

### Project Management

#### Projects
- Create multiple projects with unique keys (e.g., "DEF" for Default Project)
- Each project can have multiple components and assignees
- Projects help organize tasks by business area or team

#### Components
- Define technical components (Frontend, Backend, Database, etc.)
- Associate components with specific projects
- Use for technical organization and reporting

#### Assignees
- Manage team members with names and email addresses
- Assign tasks to specific team members
- Track workload distribution

### Analytics Dashboard

#### Key Metrics
- **Total Tasks**: Overall task count
- **Completion Rate**: Percentage of resolved tasks
- **Average Days to Complete**: Time-to-completion metrics
- **Active Projects**: Number of projects with tasks

#### Visual Charts
- **Tasks by Status**: Pie chart showing workflow distribution
- **Tasks by Priority**: Priority breakdown visualization
- **Tasks by Project**: Project workload comparison
- **Tasks Created Over Time**: Trend analysis with configurable time ranges

## 🧪 Testing

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:ci
```

### Test Coverage

The project maintains high test coverage:
- **Statements**: 93.51%
- **Branches**: 89.74%
- **Functions**: 93.01%
- **Lines**: 93.71%

### Test Structure

```
src/__tests__/
├── Analytics.test.js      # Analytics dashboard tests
├── App.test.js           # Main app component tests
├── Charts.test.js        # Chart components tests
├── Dashboard.test.js     # Dashboard functionality tests
├── notifications.test.js # Notification system tests
├── ProjectManager.test.js # Project management tests
├── storage.test.js       # Data persistence tests
├── TaskCard.test.js      # Task card component tests
├── TaskDetail.test.js    # Task detail modal tests
└── TaskForm.test.js      # Task creation/editing tests
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm start          # Start development server
npm run dev        # Alias for npm start

# Building
npm run build      # Production build
npm run build:fast # Fast build without source maps

# Code Quality
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier

# CI/CD
npm run ci         # Complete CI pipeline (lint, format, build, test)
```

### Project Structure

```
TaskTrek/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Analytics.js      # Analytics dashboard
│   │   ├── Charts.js         # Chart components
│   │   ├── Dashboard.js      # Main dashboard
│   │   ├── ProjectManager.js # Project management
│   │   ├── TaskCard.js       # Task card component
│   │   ├── TaskDetail.js     # Task detail modal
│   │   └── TaskForm.js       # Task creation/editing
│   ├── utils/
│   │   ├── notifications.js  # Notification system
│   │   └── storage.js        # Data persistence
│   ├── __tests__/           # Test files
│   ├── App.js              # Main app component
│   └── index.js            # App entry point
├── package.json
└── README.md
```

### Code Style

The project uses ESLint and Prettier for consistent code formatting:
- **ESLint**: Enforces code quality and best practices
- **Prettier**: Handles code formatting automatically
- **Testing Library**: Ensures accessible and maintainable tests

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment Options

1. **Static Hosting**: Deploy to Netlify, Vercel, or GitHub Pages
2. **Web Servers**: Serve the build folder with Apache, Nginx, or similar
3. **CDN**: Upload to AWS S3 + CloudFront or similar services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint:fix`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm start
```

**Tests failing**
```bash
# Clear Jest cache
npm test -- --clearCache
# Run tests with verbose output
npm run test:ci
```

**Build issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Compatibility

TaskTrek supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Tips

- Use Chrome DevTools for performance profiling
- Monitor LocalStorage usage (5-10MB limit)
- Clear browser data if experiencing slowdowns

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Check existing documentation
- Review test files for usage examples

---

**Built with ❤️ using React and modern web technologies**