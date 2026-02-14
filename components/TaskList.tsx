
import React from 'react';
import { Task, Priority } from '../types';
import Icon from './Icon';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const priorityClasses: { [key in Priority]: { dot: string, text: string } } = {
    [Priority.Urgent]: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
    [Priority.High]: { dot: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
    [Priority.Medium]: { dot: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
    [Priority.Low]: { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Mobile View - Cards */}
      <div className="md:hidden">
        <div className="p-4 space-y-4">
          {tasks.map(task => (
            <div key={task.id} onClick={() => onTaskClick(task)} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                 <p className="font-semibold text-gray-800 dark:text-white">{task.title}</p>
                 <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${priorityClasses[task.priority].dot}`}></div>
                    <span className={`text-sm ${priorityClasses[task.priority].text}`}>{task.priority}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>{task.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Vencimento:</span>
                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/D'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Responsáveis:</span>
                   {task.assignees && task.assignees.length > 0 ? (
                    <div className="flex items-center -space-x-2">
                      {task.assignees.map(user => (
                         <img key={user.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src={user.avatarUrl} alt={user.name} title={user.name} />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">N/D</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 w-2/5">Tarefa</th>
              <th scope="col" className="px-6 py-3">Responsáveis</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Prioridade</th>
              <th scope="col" className="px-6 py-3">Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} onClick={() => onTaskClick(task)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center">
                        {task.hasReminder && <Icon name="bell" className="w-4 h-4 mr-2 text-yellow-500" title="Lembrete ativado" />}
                        {task.title}
                    </div>
                </td>
                <td className="px-6 py-4">
                  {task.assignees && task.assignees.length > 0 ? (
                    <div className="flex items-center -space-x-2">
                      {task.assignees.map(user => (
                         <img key={user.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src={user.avatarUrl} alt={user.name} title={user.name} />
                      ))}
                       {task.assignees.length > 3 && <span className="pl-3 text-sm font-medium text-gray-500">+{task.assignees.length - 3}</span>}
                    </div>
                  ) : (
                    <span className="text-gray-400">N/D</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{task.status}</span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${priorityClasses[task.priority].dot}`}></div>
                        <span className={priorityClasses[task.priority].text}>{task.priority}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : <span className="text-gray-400">N/D</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
