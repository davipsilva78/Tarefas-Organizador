
import React from 'react';
import { themes, Theme } from '../data/themes';
import { ViewType } from '../types';
import Icon from './Icon';

interface SettingsViewProps {
  themes: { [key: string]: Theme };
  activeTheme: string;
  onThemeChange: (themeKey: string) => void;
  visibleViews: { [key in ViewType]?: boolean };
  onVisibleViewsChange: (view: ViewType, isVisible: boolean) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ themes, activeTheme, onThemeChange, visibleViews, onVisibleViewsChange }) => {
  const toggleableViews: ViewType[] = [
    ViewType.List,
    ViewType.Kanban,
    ViewType.Gantt,
    ViewType.Calendar,
    ViewType.Scrum,
    ViewType.Team,
    ViewType.Reports,
    ViewType.Documents,
    ViewType.Automations,
    ViewType.Integrations,
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Configurações</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Aparência</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Personalize as cores e a aparência do seu Task Pro.</p>

        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cor do Tema</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(themes).map(([key, theme]) => (
                    <button 
                        key={key}
                        onClick={() => onThemeChange(key)}
                        className={`p-4 rounded-lg border-2 transition-all ${activeTheme === key ? 'border-custom-blue ring-2 ring-custom-blue' : 'border-gray-200 dark:border-gray-700 hover:border-custom-blue'}`}
                    >
                        <div className="flex items-center justify-center">
                            <div 
                                className="w-8 h-8 rounded-full mr-3" 
                                // FIX: Cast 'theme' to 'Theme' to access its 'colors' property.
                                style={{ backgroundColor: (theme as Theme).colors['--custom-blue'] }}
                            ></div>
                            {/* FIX: Cast 'theme' to 'Theme' to access its 'name' property. */}
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{(theme as Theme).name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div className="border-t dark:border-gray-700 mt-8 pt-6">
             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Módulos da Barra Lateral</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6">Ative ou desative módulos para personalizar sua barra de navegação.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {toggleableViews.map(view => (
                    <div key={view} className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">{view}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={visibleViews[view] !== false}
                                onChange={(e) => onVisibleViewsChange(view, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-custom-blue"></div>
                        </label>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
