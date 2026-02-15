


import React from 'react';
import { AppData, Task, KanbanColumn } from '../types';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onTaskClick: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ data, setData, onTaskClick }) => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = data.tasks[taskId];
    const destinationColumn = data.columns[columnId];

    if (!task || !destinationColumn) return;

    // Find the source column
    // FIX: Explicitly type 'col' as 'KanbanColumn' to allow accessing its properties without TypeScript errors.
    const sourceColumnId = Object.values(data.columns).find((col: KanbanColumn) => col.taskIds.includes(taskId))?.id;
    if (!sourceColumnId) return;
    
    const sourceColumn = data.columns[sourceColumnId];

    // If dropped in the same column, do nothing.
    if (sourceColumnId === columnId) return;

    // Move task
    const newSourceTaskIds = sourceColumn.taskIds.filter(id => id !== taskId);
    const newDestinationTaskIds = [...destinationColumn.taskIds, taskId];
    
    const updatedTask = { ...task, status: destinationColumn.title };

    setData(prevData => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [taskId]: updatedTask
      },
      columns: {
        ...prevData.columns,
        [sourceColumnId]: {
          ...sourceColumn,
          taskIds: newSourceTaskIds,
        },
        [columnId]: {
          ...destinationColumn,
          taskIds: newDestinationTaskIds,
        },
      },
    }));
  };

  return (
    <div className="flex space-x-4 overflow-x-auto h-full pb-4">
      {data.columnOrder.map(columnId => {
        const column = data.columns[columnId];
        const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

        return (
          <div
            key={column.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
            className="bg-gray-100 dark:bg-gray-900/50 rounded-lg p-3 w-72 sm:w-80 flex-shrink-0 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">{column.title}</h3>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-semibold px-2 py-1 rounded-full">{tasks.length}</span>
            </div>
            <div className="overflow-y-auto flex-1">
              {tasks.map(task => (
                task && (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                  >
                    <TaskCard task={task} onClick={() => onTaskClick(task)} />
                  </div>
                )
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
