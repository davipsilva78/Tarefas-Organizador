
import React from 'react';
import { Task } from '../types';
import Icon from './Icon';

interface DashboardProps {
  tasks: Task[];
}

const FeatureCard: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-2 bg-custom-light-blue rounded-full">
            <div className="w-4 h-4 text-custom-blue" />
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const features = [
    "Tarefas", "Listas de verificação", "Automação de tarefas", "Tarefas recorrentes", "Lousas",
    "Acompanhamento do tempo da tarefa", "Calendário", "API e integrações", "Eficiência das tarefas e KPI", "Fluxos",
    "Quadro Kanban", "Relatórios de tarefas", "Armazenamento de arquivos", "Usuários externos", "Documentos on-line",
    "Gráfico de Gantt", "Modelos de tarefa", "Messenger", "Base de conhecimento", "Scrum", "Permissões de acesso"
  ];

  const tasksDueToday = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const completedTasks = tasks.filter(t => t.status === 'Concluído').length;
  const inProgressTasks = tasks.filter(t => t.status === 'Em Progresso').length;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Bem-vindo ao seu Organizador!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Tarefas</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{tasks.length}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                  <Icon name="list" className="w-6 h-6 text-blue-500 dark:text-blue-300" />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Em Progresso</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{inProgressTasks}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
                  <Icon name="clock" className="w-6 h-6 text-yellow-500 dark:text-yellow-300" />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vencem Hoje</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{tasksDueToday}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                  <Icon name="calendar" className="w-6 h-6 text-red-500 dark:text-red-300" />
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Concluídas</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{completedTasks}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                  <Icon name="check" className="w-6 h-6 text-green-500 dark:text-green-300" />
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Ferramentas Disponíveis</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Explore todas as funcionalidades para organizar seu trabalho da melhor forma.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
             <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="w-2 h-2 rounded-full bg-custom-blue mr-3"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
