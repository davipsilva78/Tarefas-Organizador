
import React, { useMemo } from 'react';
import { Task } from '../types';
import Icon from './Icon';

interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const { chartStartDate, totalDays, tasksWithDates } = useMemo(() => {
    const validTasks = tasks.filter(t => t.startDate && t.dueDate && new Date(t.dueDate) >= new Date(t.startDate));
    
    if (validTasks.length === 0) {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
          chartStartDate: firstDay,
          totalDays: lastDay.getDate(),
          tasksWithDates: [],
      };
    }

    let minDate = new Date(validTasks[0].startDate!);
    let maxDate = new Date(validTasks[0].dueDate!);

    validTasks.forEach(task => {
      const taskStartDate = new Date(task.startDate!);
      const taskDueDate = new Date(task.dueDate!);
      if (taskStartDate < minDate) minDate = taskStartDate;
      if (taskDueDate > maxDate) maxDate = taskDueDate;
    });

    const chartStartDate = new Date(minDate);
    chartStartDate.setDate(chartStartDate.getDate() - 2); // Add some padding
    const chartEndDate = new Date(maxDate);
    chartEndDate.setDate(chartEndDate.getDate() + 2); // Add some padding
    
    const totalDays = Math.ceil((chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24));
    
    return { chartStartDate, totalDays, tasksWithDates: validTasks };
  }, [tasks]);

  const daysHeader = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(chartStartDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTaskPosition = (task: Task) => {
    const taskStart = new Date(task.startDate!);
    const taskEnd = new Date(task.dueDate!);

    const startOffset = Math.max(0, (taskStart.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24));
    const duration = Math.max(1, (taskEnd.getTime() - taskStart.getTime()) / (1000 * 3600 * 24));

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left, width };
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
      {tasksWithDates.length === 0 ? (
        <div className="text-center py-10">
          <Icon name="gantt" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">Gráfico de Gantt Vazio</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Adicione datas de início e fim às suas tarefas para visualizá-las aqui.</p>
        </div>
      ) : (
        <div className="relative" style={{ minWidth: `${totalDays * 40}px` }}>
          {/* Header */}
          <div className="flex sticky top-0 bg-white dark:bg-gray-800 z-10 border-b-2 border-gray-300 dark:border-gray-600">
            <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 py-2 px-4">
              <h4 className="font-bold text-gray-700 dark:text-gray-300">Tarefas</h4>
            </div>
            <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(40px, 1fr))` }}>
              {daysHeader.map(day => (
                <div key={day.toISOString()} className="text-center border-r border-gray-200 dark:border-gray-700 py-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{day.toLocaleString('default', { month: 'short' })}</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">{day.getDate()}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Rows */}
          <div>
            {tasksWithDates.map(task => {
              const { left, width } = getTaskPosition(task);
              return (
                <div key={task.id} className="flex h-12 items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 px-4 truncate h-full flex items-center">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                  </div>
                  <div className="flex-1 h-full relative">
                     <div 
                        className="absolute h-8 bg-custom-blue rounded-md flex items-center px-2 group top-1/2 -translate-y-1/2"
                        style={{ left: `${left}%`, width: `${width}%` }}
                        title={`${task.title}: ${new Date(task.startDate!).toLocaleDateString()} - ${new Date(task.dueDate!).toLocaleDateString()}`}
                      >
                        <span className="text-white text-xs font-semibold truncate">{task.title}</span>
                         {task.assignees && task.assignees.length > 0 && <img src={task.assignees[0].avatarUrl} alt={task.assignees[0].name} title={task.assignees[0].name} className="w-6 h-6 rounded-full absolute right-1 border-2 border-white dark:border-gray-800"/>}
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GanttChart;
