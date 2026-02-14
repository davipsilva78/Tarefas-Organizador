
import React, { useMemo } from 'react';
import { Task } from '../types';

interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const { chartStartDate, chartEndDate, totalDays, tasksWithDates } = useMemo(() => {
    const tasksWithDates = tasks.filter(t => t.startDate && t.dueDate);
    if (tasksWithDates.length === 0) {
      const today = new Date();
      return {
          chartStartDate: new Date(today.getFullYear(), today.getMonth(), 1),
          chartEndDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
          totalDays: 30,
          tasksWithDates: [],
      };
    }

    let minDate = new Date(tasksWithDates[0].startDate!);
    let maxDate = new Date(tasksWithDates[0].dueDate!);

    tasksWithDates.forEach(task => {
      if (task.startDate! < minDate) minDate = new Date(task.startDate!);
      if (task.dueDate! > maxDate) maxDate = new Date(task.dueDate!);
    });

    const chartStartDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const chartEndDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
    const totalDays = Math.ceil((chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24));
    
    return { chartStartDate, chartEndDate, totalDays, tasksWithDates };
  }, [tasks]);

  const daysHeader = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(chartStartDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getTaskPosition = (task: Task) => {
    if (!task.startDate || !task.dueDate) return { left: 0, width: 0 };
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.dueDate);

    const startOffset = Math.ceil((taskStart.getTime() - chartStartDate.getTime()) / (1000 * 3600 * 24));
    const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 3600 * 24)) + 1;

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left, width };
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
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
        <div className="relative">
           {tasksWithDates.map((task, index) => {
            const { left, width } = getTaskPosition(task);
            return (
              <div key={task.id} className="flex h-12 items-center border-b border-gray-200 dark:border-gray-700">
                <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 px-4 truncate">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.title}</p>
                </div>
              </div>
            );
           })}
           
           {/* Bars overlay */}
           <div className="absolute top-0 left-64 right-0 bottom-0">
               {tasksWithDates.map((task, index) => {
                 const { left, width } = getTaskPosition(task);
                 return (
                    <div key={task.id} className="absolute h-12 flex items-center" style={{ top: `${index * 3}rem`, left: `${left}%`, width: `${width}%`}}>
                        <div
                          className="h-8 bg-custom-blue rounded-md w-full flex items-center px-2 relative group"
                          title={`${task.title}: ${task.startDate?.toLocaleDateString()} - ${task.dueDate?.toLocaleDateString()}`}
                        >
                          <span className="text-white text-xs font-semibold truncate hidden sm:inline">{task.title}</span>
                          {/* Fix: Changed task.assignee to task.assignees to match the Task type and render the first assignee's avatar. */}
                          {task.assignees && task.assignees.length > 0 && <img src={task.assignees[0].avatarUrl} alt={task.assignees[0].name} title={task.assignees[0].name} className="w-6 h-6 rounded-full absolute right-1 border-2 border-white dark:border-gray-800"/>}
                        </div>
                    </div>
                 );
               })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
