
import React, { useState, useMemo } from 'react';
import { Task, User, Priority } from '../types';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
        <div>{children}</div>
    </div>
);

const Bar: React.FC<{ label: string; value: number; maxValue: number; color: string }> = ({ label, value, maxValue, color }) => (
    <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
                className={`${color} h-4 rounded-full transition-all duration-500`} 
                style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
            ></div>
        </div>
    </div>
);

const ReportsView: React.FC<{ tasks: Task[]; users: User[] }> = ({ tasks, users }) => {
    const [selectedUserId, setSelectedUserId] = useState<string>('all');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const userMatch = selectedUserId === 'all' || (task.assignees || []).some(u => u.id === selectedUserId);
            const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
            const startDateMatch = !dateRange.start || (task.createdAt && new Date(task.createdAt) >= new Date(dateRange.start));
            const endDateMatch = !dateRange.end || (task.createdAt && new Date(task.createdAt) <= new Date(dateRange.end));
            return userMatch && priorityMatch && startDateMatch && endDateMatch;
        });
    }, [tasks, selectedUserId, selectedPriority, dateRange]);

    const tasksByStatus = useMemo(() => {
        const result = filteredTasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        // Fix: Used array indexing instead of destructuring in the sort callback to preserve type information and allow for numeric comparison.
        return Object.entries(result).sort((a, b) => b[1] - a[1]);
    }, [filteredTasks]);
    const maxStatusCount = Math.max(...tasksByStatus.map(([, count]) => count), 1);

    const tasksByUser = useMemo(() => {
        const result = users.map(user => ({
            name: user.name,
            count: filteredTasks.filter(task => (task.assignees || []).some(u => u.id === user.id)).length
        })).filter(u => u.count > 0).sort((a,b) => b.count - a.count);
        return result;
    }, [filteredTasks, users]);
    const maxUserTaskCount = Math.max(...tasksByUser.map(u => u.count), 1);
    
    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Filtros de Relatório</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsável</label>
                        <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm rounded-md">
                            <option value="all">Todos</option>
                            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prioridade</label>
                        <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm rounded-md">
                            <option value="all">Todas</option>
                            {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início</label>
                        <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} className="mt-1 block w-full pl-3 pr-1 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Fim</label>
                        <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} className="mt-1 block w-full pl-3 pr-1 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-custom-blue focus:border-custom-blue sm:text-sm rounded-md"/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Tarefas por Status">
                    {tasksByStatus.length > 0 ? tasksByStatus.map(([status, count]) => (
                        <Bar key={status} label={status} value={count} maxValue={maxStatusCount} color="bg-custom-blue" />
                    )) : <p className="text-gray-500 dark:text-gray-400">Nenhum dado encontrado para os filtros selecionados.</p>}
                </ChartCard>
                
                <ChartCard title="Tarefas por Responsável">
                    {tasksByUser.length > 0 ? tasksByUser.map(user => (
                         <Bar key={user.name} label={user.name} value={user.count} maxValue={maxUserTaskCount} color="bg-green-500" />
                    )) : <p className="text-gray-500 dark:text-gray-400">Nenhum dado encontrado para os filtros selecionados.</p>}
                </ChartCard>
            </div>
        </div>
    );
};

export default ReportsView;
