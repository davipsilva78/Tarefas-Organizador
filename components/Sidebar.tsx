
import React from 'react';
import { ViewType } from '../types';
import Icon from './Icon';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const mainNavItems = [
    { view: ViewType.Dashboard, icon: 'dashboard' },
    { view: ViewType.List, icon: 'list' },
    { view: ViewType.Kanban, icon: 'kanban' },
    { view: ViewType.Gantt, icon: 'gantt' },
    { view: ViewType.Calendar, icon: 'calendar' },
    { view: ViewType.Scrum, icon: 'scrum' },
  ];

  const toolsNavItems = [
    { view: ViewType.Team, icon: 'team' },
    { view: ViewType.Reports, icon: 'reports' },
    { view: ViewType.Documents, icon: 'document' },
    { view: ViewType.Automations, icon: 'automations' },
    { view: ViewType.Integrations, icon: 'integrations' },
  ];

  const NavList: React.FC<{ items: { view: ViewType; icon: string }[] }> = ({ items }) => (
    <ul>
      {items.map((item) => (
        <li key={item.view}>
          <button
            onClick={() => setCurrentView(item.view)}
            className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
              currentView === item.view
                ? 'bg-custom-light-blue text-custom-blue font-semibold dark:bg-gray-700 dark:text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon name={item.icon} className="w-6 h-6" />
            <span className="hidden md:block ml-4">{item.view}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="w-16 md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex flex-col shadow-lg">
      <div className="flex items-center justify-center md:justify-start md:px-6 h-20 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-custom-blue p-2 rounded-lg">
          <Icon name="check" className="w-6 h-6 text-white" />
        </div>
        <h1 className="hidden md:block ml-3 text-xl font-bold text-gray-700 dark:text-gray-300">Task Pro</h1>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-4 overflow-y-auto">
        <NavList items={mainNavItems} />
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <h3 className="hidden md:block px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ferramentas</h3>
        <NavList items={toolsNavItems} />
      </nav>
      <div className="px-4 pb-4">
        <div className="bg-custom-light-blue dark:bg-gray-700 p-4 rounded-lg text-center hidden md:block">
            <h3 className="font-bold text-custom-dark-blue dark:text-white">Atualize para Pro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Desbloqueie todo o potencial e a produtividade da sua equipa.</p>
            <button className="bg-custom-blue text-white w-full mt-4 py-2 rounded-lg hover:bg-custom-dark-blue transition-colors">
                Atualizar
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
