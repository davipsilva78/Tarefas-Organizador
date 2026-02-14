
import React from 'react';
import { Task, Priority } from '../types';
import Icon from './Icon';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const priorityColors: { [key in Priority]: string } = {
  [Priority.Low]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  [Priority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  [Priority.High]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  [Priority.Urgent]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const subtaskProgress = task.subtasks ? (task.subtasks.filter(i => i.completed).length / task.subtasks.length) * 100 : -1;

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 cursor-pointer hover:shadow-md hover:border-custom-blue transition-all duration-200">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">{task.title}</h4>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <Icon name="dots" className="w-5 h-5"/>
        </button>
      </div>
      {task.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{task.description}</p>}
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Icon name="clock" className="w-4 h-4 mr-1" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
         <div className="mt-4">
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Subtarefas</span>
                <span>{task.subtasks.filter(i => i.completed).length}/{task.subtasks.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div className="bg-custom-blue h-1.5 rounded-full" style={{ width: `${subtaskProgress}%` }}></div>
            </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           {task.recurring && task.recurring !== 'none' && (
                <Icon name="automations" className="w-5 h-5 text-gray-400" title={`Tarefa recorrente: ${task.recurring}`} />
            )}
            {task.hasReminder && (
                <Icon name="bell" className="w-5 h-5 text-yellow-500" title={`Lembrete ativado`} />
            )}
        </div>
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-2">
            {task.assignees.map(assignee => (
              <img
                key={assignee.id}
                src={assignee.avatarUrl}
                alt={assignee.name}
                title={assignee.name}
                className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
