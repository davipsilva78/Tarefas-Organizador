
import React from 'react';
import { themes, Theme } from '../data/themes';
import Icon from './Icon';

interface SettingsViewProps {
  themes: { [key: string]: Theme };
  activeTheme: string;
  onThemeChange: (themeKey: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ themes, activeTheme, onThemeChange }) => {
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
                                style={{ backgroundColor: theme.colors['--custom-blue'] }}
                            ></div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{theme.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div className="border-t dark:border-gray-700 mt-8 pt-6">
             <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Funções (Em Breve)</h3>
             <p className="text-gray-500 dark:text-gray-400">Em breve, você poderá ativar ou desativar módulos específicos, como Gráfico de Gantt, Scrum e mais, para personalizar sua barra lateral.</p>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
