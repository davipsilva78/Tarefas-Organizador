
import React, { useState, useEffect } from 'react';
import { ViewType, Task, AppData, User, AutomationRule, Document } from './types';
import { initialData } from './data/mockData';
import { themes } from './data/themes';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import GanttChart from './components/GanttChart';
import ScrumBoard from './components/ScrumBoard';
import TaskModal from './components/TaskModal';
import Login from './components/Login';
import TeamView from './components/TeamView';
import ReportsView from './components/ReportsView';
import AutomationsView from './components/AutomationsView';
import IntegrationsView from './components/IntegrationsView';
import UserEditModal from './components/UserEditModal';
import AutomationModal from './components/AutomationModal';
import ConfirmationModal from './components/ConfirmationModal';
import DocumentsView from './components/DocumentsView';
import DocumentEditorModal from './components/DocumentEditorModal';
import SearchView, { SearchFilters } from './components/SearchView';
import SearchResultsView from './components/SearchResultsView';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(() => {
    const savedData = localStorage.getItem('taskAppData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (!Array.isArray(parsedData.automations)) parsedData.automations = [];
      if (!Array.isArray(parsedData.documents)) parsedData.documents = [];
      return parsedData;
    }
    return initialData;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.Dashboard);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [activeTheme, setActiveTheme] = useState<string>(() => localStorage.getItem('appTheme') || 'blue');
  const [visibleViews, setVisibleViews] = useState<{ [key in ViewType]?: boolean }>(() => {
    const savedViews = localStorage.getItem('visibleViews');
    if (savedViews) {
        return JSON.parse(savedViews);
    }
    // Default: all views are visible
    return Object.values(ViewType).reduce((acc, view) => {
        acc[view] = true;
        return acc;
    }, {} as { [key in ViewType]: boolean });
  });
  
  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationRule | null>(null);
  const [isDocEditorOpen, setIsDocEditorOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{tasks: Task[], documents: Document[]}>({ tasks: [], documents: [] });
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });


  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('taskAppUsers') || '{}');
    if (Object.keys(allUsers).length === 0) {
      localStorage.setItem('taskAppUsers', JSON.stringify(initialData.users));
    }
    const loggedInUserId = localStorage.getItem('taskAppCurrentUser');
    if (loggedInUserId) {
      setCurrentUser(allUsers[loggedInUserId] || null);
    }
    
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('taskAppData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const themeColors = themes[activeTheme]?.colors;
    if (themeColors) {
      Object.entries(themeColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      localStorage.setItem('appTheme', activeTheme);
    }
  }, [activeTheme]);
  
  useEffect(() => {
    localStorage.setItem('visibleViews', JSON.stringify(visibleViews));
  }, [visibleViews]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleVisibleViewsChange = (view: ViewType, isVisible: boolean) => {
    setVisibleViews(prev => ({
        ...prev,
        [view]: isVisible
    }));
  };

  // Reminder check effect
  useEffect(() => {
    const checkReminders = () => {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        const now = new Date();
        const tasksToUpdate: Task[] = [];

        // Fix: Explicitly type 'task' as 'Task' to resolve property access errors.
        Object.values(data.tasks).forEach((task: Task) => {
            if (!task.hasReminder || !task.dueDate || task.reminderSent) {
                return;
            }

            const dueDate = new Date(task.dueDate);
            let offsetMillis = 0;
            const offset = task.reminderOffset || 0;

            if (task.reminderOffsetUnit === 'minutes') {
                offsetMillis = offset * 60 * 1000;
            } else if (task.reminderOffsetUnit === 'hours') {
                offsetMillis = offset * 60 * 60 * 1000;
            } else if (task.reminderOffsetUnit === 'days') {
                offsetMillis = offset * 24 * 60 * 60 * 1000;
            }

            const reminderTime = new Date(dueDate.getTime() - offsetMillis);
            
            if (reminderTime <= now && dueDate > now) {
                new Notification('Lembrete de Tarefa - Task Pro', {
                    body: `Sua tarefa "${task.title}" precisa de atenção!`,
                    icon: '/vite.svg' 
                });
                tasksToUpdate.push({ ...task, reminderSent: true });
            }
        });

        if (tasksToUpdate.length > 0) {
            setData(prev => {
                const newTasks = { ...prev.tasks };
                tasksToUpdate.forEach(t => {
                    newTasks[t.id] = t;
                });
                return { ...prev, tasks: newTasks };
            });
        }
    };

    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, [data.tasks]);

  // Search Handler
  const handleSearch = (filters: SearchFilters) => {
    const { keyword, startDate, endDate, location } = filters;
    const keywordLower = keyword.toLowerCase();

    // Fix: Explicitly type 'task' as 'Task' to resolve property access errors.
    const filteredTasks = Object.values(data.tasks).filter((task: Task) => {
        const keywordMatch = !keywordLower || task.title.toLowerCase().includes(keywordLower) || (task.description && task.description.toLowerCase().includes(keywordLower));
        const startDateMatch = !startDate || (task.createdAt && new Date(task.createdAt) >= new Date(startDate));
        const endDateMatch = !endDate || (task.createdAt && new Date(task.createdAt) <= new Date(endDate));
        const locationMatch = !location || (task.location && task.location.toLowerCase().includes(location.toLowerCase()));
        return keywordMatch && startDateMatch && endDateMatch && locationMatch;
    });

    const filteredDocuments = data.documents.filter(doc => {
        const keywordMatch = !keywordLower || doc.name.toLowerCase().includes(keywordLower) || doc.content.toLowerCase().includes(keywordLower);
        const startDateMatch = !startDate || (doc.lastModified && new Date(doc.lastModified) >= new Date(startDate));
        const endDateMatch = !endDate || (doc.lastModified && new Date(doc.lastModified) <= new Date(endDate));
        const locationMatch = !location || (doc.location && doc.location.toLowerCase().includes(location.toLowerCase()));
        return keywordMatch && startDateMatch && endDateMatch && locationMatch;
    });

    setSearchResults({ tasks: filteredTasks, documents: filteredDocuments });
    setCurrentView(ViewType.Search);
    setIsSearchOpen(false);
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('taskAppCurrentUser', user.id);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('taskAppCurrentUser');
  };

  // Task Handlers
  const handleUpdateTask = (updatedTask: Task) => {
    setData(prev => ({ ...prev, tasks: { ...prev.tasks, [updatedTask.id]: updatedTask }}));
  };
  
  const handleOpenTaskModal = (task: Task | null) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleSaveTask = (taskToSave: Task) => {
    if (selectedTask || taskToSave.id) {
       const taskData = taskToSave.id ? taskToSave : { ...taskToSave, id: selectedTask!.id };
       handleUpdateTask(taskData);
    } else {
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = { ...taskToSave, id: newTaskId, createdAt: new Date() };
      setData(prev => {
        const todoColId = Object.keys(prev.columns).find(id => prev.columns[id].title === 'A Fazer') || 'col-1';
        return { ...prev, tasks: { ...prev.tasks, [newTaskId]: newTask }, columns: { ...prev.columns, [todoColId]: { ...prev.columns[todoColId], taskIds: [...prev.columns[todoColId].taskIds, newTaskId] } } }
      });
    }
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };
  
  // User Handlers
  const handleAddUser = (newUser: User) => {
    const allUsers = JSON.parse(localStorage.getItem('taskAppUsers') || '{}');
    allUsers[newUser.id] = newUser;
    localStorage.setItem('taskAppUsers', JSON.stringify(allUsers));
    setData(prev => ({ ...prev, users: { ...prev.users, [newUser.id]: newUser } }));
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    const allUsers = JSON.parse(localStorage.getItem('taskAppUsers') || '{}');
    allUsers[updatedUser.id] = { ...allUsers[updatedUser.id], ...updatedUser };
    localStorage.setItem('taskAppUsers', JSON.stringify(allUsers));
    setData(prev => ({ ...prev, users: { ...prev.users, [updatedUser.id]: updatedUser } }));
    if(currentUser?.id === updatedUser.id) { setCurrentUser(updatedUser); }
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };
  
  const executeDeleteUser = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('taskAppUsers') || '{}');
    delete allUsers[userId];
    localStorage.setItem('taskAppUsers', JSON.stringify(allUsers));
    
    setData(prev => {
        const newUsers = { ...prev.users };
        delete newUsers[userId];
        const newTasks = { ...prev.tasks };
        // Fix: Explicitly type 'task' as 'Task' to resolve property access errors.
        Object.values(newTasks).forEach((task: Task) => {
            if (task.assignees?.some(u => u.id === userId)) {
                task.assignees = task.assignees.filter(u => u.id !== userId);
            }
        });
        const newDocuments = prev.documents.map(doc => ({
            ...doc,
            sharedWith: doc.sharedWith.filter(u => u.id !== userId)
        }));
        return { ...prev, users: newUsers, tasks: newTasks, documents: newDocuments };
    });
  };

  const requestDeleteUser = (user: User) => {
      if (user.id === currentUser?.id) { alert("Você não pode remover a si mesmo."); return; }
      setConfirmModalState({
          isOpen: true,
          title: 'Remover Membro',
          message: `Tem certeza que deseja remover ${user.name}? Esta ação não pode ser desfeita.`,
          onConfirm: () => executeDeleteUser(user.id)
      });
  };
  
  const openUserModal = (user: User | null) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // Automation Handlers
  const handleSaveAutomation = (ruleToSave: AutomationRule) => {
      setData(prev => {
          const automations = Array.isArray(prev.automations) ? prev.automations : [];
          const existingRuleIndex = automations.findIndex(r => r.id === ruleToSave.id);
          if (existingRuleIndex > -1) {
              const newAutomations = [...automations];
              newAutomations[existingRuleIndex] = ruleToSave;
              return { ...prev, automations: newAutomations };
          } else {
              return { ...prev, automations: [...automations, ruleToSave] };
          }
      });
      setIsAutomationModalOpen(false);
      setSelectedAutomation(null);
  };
  
  const handleUpdateAutomation = (updatedRule: AutomationRule) => { handleSaveAutomation(updatedRule); };
  const handleDeleteAutomation = (ruleId: string) => { setData(prev => ({...prev, automations: prev.automations.filter(r => r.id !== ruleId)})); };
  const openAutomationModal = (rule: AutomationRule | null) => { setSelectedAutomation(rule); setIsAutomationModalOpen(true); };

  // Document Handlers
  const handleOpenDocument = (doc: Document) => { setSelectedDocument(doc); setIsDocEditorOpen(true); };
  const handleSaveDocumentContent = (docId: string, content: string) => { setData(prev => ({ ...prev, documents: prev.documents.map(d => d.id === docId ? { ...d, content, lastModified: new Date() } : d) })); };
  const handleSaveDocument = (doc: Document) => {
      setData(prev => {
          const existingDocIndex = prev.documents.findIndex(d => d.id === doc.id);
          if (existingDocIndex > -1) {
              const newDocs = [...prev.documents];
              newDocs[existingDocIndex] = { ...doc, lastModified: new Date() };
              return { ...prev, documents: newDocs };
          } else {
              return { ...prev, documents: [...prev.documents, { ...doc, lastModified: new Date() }] };
          }
      });
  };

  // Render view
  const renderView = () => {
    const tasksArray = Object.values(data.tasks);
    switch (currentView) {
      case ViewType.Dashboard: return <Dashboard tasks={tasksArray} />;
      case ViewType.Kanban: return <KanbanBoard data={data} setData={setData} onTaskClick={handleOpenTaskModal} />;
      case ViewType.List: return <TaskList tasks={tasksArray} onTaskClick={handleOpenTaskModal} />;
      case ViewType.Calendar: return <CalendarView tasks={tasksArray} onTaskClick={handleOpenTaskModal} />;
      case ViewType.Gantt: return <GanttChart tasks={tasksArray} />;
      case ViewType.Scrum: return <ScrumBoard data={data} setData={setData} onTaskClick={handleOpenTaskModal} />;
      case ViewType.Team: return <TeamView users={Object.values(data.users)} onAddUser={handleAddUser} onEditUser={openUserModal} onDeleteUserRequest={requestDeleteUser} />;
      case ViewType.Reports: return <ReportsView tasks={tasksArray} users={Object.values(data.users)} />;
      case ViewType.Automations: return <AutomationsView automations={data.automations || []} onOpenModal={openAutomationModal} onUpdate={handleUpdateAutomation} onDelete={handleDeleteAutomation} />;
      case ViewType.Integrations: return <IntegrationsView />;
      case ViewType.Documents: return <DocumentsView documents={data.documents || []} users={Object.values(data.users)} onOpen={handleOpenDocument} onSave={handleSaveDocument} />;
      case ViewType.Search: return <SearchResultsView results={searchResults} onTaskClick={handleOpenTaskModal} onDocumentClick={handleOpenDocument} />;
      case ViewType.Settings: return <SettingsView themes={themes} activeTheme={activeTheme} onThemeChange={setActiveTheme} visibleViews={visibleViews} onVisibleViewsChange={handleVisibleViewsChange} />;
      default: return <Dashboard tasks={tasksArray} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} visibleViews={visibleViews} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            currentUser={currentUser} 
            currentView={currentView} 
            onAddTask={() => handleOpenTaskModal(null)} 
            onLogout={handleLogout} 
            onEditProfile={() => openUserModal(currentUser)} 
            onSearchClick={() => setIsSearchOpen(true)}
            theme={theme}
            toggleTheme={toggleTheme} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
          {renderView()}
        </main>
      </div>
      {isTaskModalOpen && <TaskModal task={selectedTask} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} users={Object.values(data.users)} />}
      {isUserModalOpen && <UserEditModal user={selectedUser} onClose={() => setIsUserModalOpen(false)} onSave={handleUpdateUser} />}
      {isAutomationModalOpen && <AutomationModal rule={selectedAutomation} onClose={() => setIsAutomationModalOpen(false)} onSave={handleSaveAutomation} />}
      {isDocEditorOpen && <DocumentEditorModal document={selectedDocument!} onClose={() => setIsDocEditorOpen(false)} onSave={handleSaveDocumentContent} />}
      {isSearchOpen && <SearchView onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />}
      <ConfirmationModal 
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
        onConfirm={confirmModalState.onConfirm}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmText="Remover"
      />
    </div>
  );
};

export default App;
