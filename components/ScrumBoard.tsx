
import React, { useMemo } from 'react';
import { AppData, Task } from '../types';
import KanbanBoard from './KanbanBoard';

interface ScrumBoardProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onTaskClick: (task: Task) => void;
}

const ScrumBoard: React.FC<ScrumBoardProps> = ({ data, setData, onTaskClick }) => {
  const scrumData = useMemo<AppData>(() => {
    const scrumColumns = {
      'scrum-col-1': { id: 'scrum-col-1', title: 'Backlog do Produto', taskIds: [] },
      'scrum-col-2': { id: 'scrum-col-2', title: 'Backlog da Sprint', taskIds: [] },
      'scrum-col-3': { id: 'scrum-col-3', title: 'Em Progresso', taskIds: [] },
      'scrum-col-4': { id: 'scrum-col-4', title: 'Revisão da Sprint', taskIds: [] },
      'scrum-col-5': { id: 'scrum-col-5', title: 'Concluído', taskIds: [] },
    };
    const scrumColumnOrder = Object.keys(scrumColumns);

    const statusToScrumColumn: { [key: string]: string } = {
        'A Fazer': 'scrum-col-2',
        'Backlog da Sprint': 'scrum-col-2',
        'Em Progresso': 'scrum-col-3',
        'Revisão': 'scrum-col-4',
        'Revisão da Sprint': 'scrum-col-4',
        'Concluído': 'scrum-col-5'
    };

    // Fix: Explicitly type 'task' as 'Task' to resolve property access errors.
    Object.values(data.tasks).forEach((task: Task) => {
        const columnId = statusToScrumColumn[task.status] || 'scrum-col-1';
        scrumColumns[columnId as keyof typeof scrumColumns].taskIds.push(task.id);
    });

    return {
      ...data,
      columns: scrumColumns,
      columnOrder: scrumColumnOrder
    };
  }, [data]);
  
  return (
    <div>
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Sprint Atual: "Fênix"</h3>
            <p className="text-gray-600 dark:text-gray-400">Faltam 8 dias. Foco em melhorar a experiência do usuário.</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className="bg-custom-blue h-2.5 rounded-full" style={{width: "45%"}}></div>
            </div>
        </div>
        <KanbanBoard data={scrumData} setData={setData} onTaskClick={onTaskClick} />
    </div>
  );
};

export default ScrumBoard;
