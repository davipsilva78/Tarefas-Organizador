
import React, { useState, useRef, useEffect } from 'react';
import { ViewType, User } from '../types';
import Icon from './Icon';

interface HeaderProps {
  currentView: ViewType;
  currentUser: User | null;
  onAddTask: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onSearchClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, currentUser, onAddTask, onLogout, onEditProfile, onSearchClick, theme, toggleTheme }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{currentView}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
            <button onClick={onSearchClick} className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 hover:border-custom-blue focus:outline-none focus:ring-2 focus:ring-custom-blue">
                Pesquisar tarefas...
            </button>
            <Icon name="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <button onClick={onAddTask} className="flex items-center bg-custom-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-custom-dark-blue transition-colors duration-200">
          <Icon name="plus" className="w-5 h-5 mr-2" />
          <span>Nova Tarefa</span>
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Icon name="bell" className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <img
              src={currentUser?.avatarUrl || "https://i.pravatar.cc/150?u=admin"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                <p className="font-semibold">{currentUser?.name}</p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600"></div>
               <button
                onClick={onEditProfile}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Icon name="edit" className="w-5 h-5 mr-2" />
                Editar Perfil
              </button>
              <button
                onClick={onLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <Icon name="logout" className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
