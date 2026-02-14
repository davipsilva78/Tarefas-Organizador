
import React, { useState } from 'react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const days = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">&lt;</button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(d => (
          <div key={d} className="text-center font-semibold text-sm text-gray-500 dark:text-gray-400 py-2">{d}</div>
        ))}
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.toDateString() === new Date().toDateString();
          const tasksForDay = tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === d.toDateString());
          
          return (
            <div key={i} className={`border border-gray-200 dark:border-gray-700 rounded-md p-2 h-32 flex flex-col ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
              <span className={`font-semibold text-sm self-end ${isToday ? 'bg-custom-blue text-white rounded-full h-6 w-6 flex items-center justify-center' : ''} ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {d.getDate()}
              </span>
              <div className="overflow-y-auto mt-1">
                {tasksForDay.map(task => (
                  <div key={task.id} onClick={() => onTaskClick(task)} className="text-xs bg-custom-light-blue text-custom-dark-blue dark:bg-gray-700 dark:text-custom-light-blue p-1 rounded mb-1 cursor-pointer truncate">
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
