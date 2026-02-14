
import React, { useState, useEffect } from 'react';
import { Task, User, Priority, Subtask, RecurringType } from '../types';
import Icon from './Icon';

interface TaskModalProps {
  task: Task | null;
  users: User[];
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, users, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [subtaskText, setSubtaskText] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        startDate: task.startDate ? new Date(task.startDate) : undefined,
        assignees: task.assignees || [],
        subtasks: task.subtasks || [],
        recurring: task.recurring || 'none',
        hasReminder: task.hasReminder || false,
        reminderOffset: task.reminderOffset || 15,
        reminderOffsetUnit: task.reminderOffsetUnit || 'minutes',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: Priority.Medium,
        status: 'A Fazer',
        assignees: [],
        subtasks: [],
        dueDate: undefined,
        startDate: undefined,
        recurring: 'none',
        hasReminder: false,
        reminderOffset: 15,
        reminderOffsetUnit: 'minutes',
      });
    }
  }, [task]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
  };
  
  const handleAssigneeChange = (userId: string) => {
    setFormData(prev => {
        const currentAssignees = prev.assignees || [];
        const isAssigned = currentAssignees.some(u => u.id === userId);
        if (isAssigned) {
            return { ...prev, assignees: currentAssignees.filter(u => u.id !== userId) };
        } else {
            const userToAdd = users.find(u => u.id === userId);
            return { ...prev, assignees: [...currentAssignees, userToAdd!] };
        }
    });
  };

  const handleAddSubtask = () => {
    if (!subtaskText.trim()) return;
    const newSubtask: Subtask = {
        id: `sub-${Date.now()}`,
        text: subtaskText,
        completed: false
    };
    setFormData(prev => ({ ...prev, subtasks: [...(prev.subtasks || []), newSubtask]}));
    setSubtaskText('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setFormData(prev => ({
        ...prev,
        subtasks: (prev.subtasks || []).map(st => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
    }));
  };
  
  const handleRemoveSubtask = (subtaskId: string) => {
    setFormData(prev => ({ ...prev, subtasks: (prev.subtasks || []).filter(st => st.id !== subtaskId) }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // For privacy/simplicity, we'll just use a placeholder.
                // A real app might use a reverse geocoding API.
                const location = `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`;
                setFormData(prev => ({ ...prev, location }));
            },
            () => {
                alert("Não foi possível obter a localização.");
            }
        );
    } else {
        alert("Geolocalização não é suportada por este navegador.");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onSave({
        ...formData,
        reminderSent: task?.dueDate !== formData.dueDate ? false : task?.reminderSent, // Reset if due date changes
    } as Task);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue" required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="description" id="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue"></textarea>
            </div>
            
            {/* Subtasks */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtarefas</label>
                <div className="space-y-2">
                    {(formData.subtasks || []).map(st => (
                        <div key={st.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                            <div className="flex items-center">
                                <input type="checkbox" checked={st.completed} onChange={() => handleToggleSubtask(st.id)} className="h-4 w-4 rounded border-gray-300 text-custom-blue focus:ring-custom-blue" />
                                <span className={`ml-3 text-sm ${st.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{st.text}</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="text-gray-400 hover:text-red-500">
                                <Icon name="trash" className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center mt-2">
                    <input type="text" value={subtaskText} onChange={e => setSubtaskText(e.target.value)} placeholder="Adicionar nova subtarefa" className="flex-grow border-gray-300 rounded-l-md shadow-sm focus:ring-custom-blue focus:border-custom-blue text-sm" />
                    <button type="button" onClick={handleAddSubtask} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 font-semibold text-sm">Adicionar</button>
                </div>
            </div>

             <div className="border-t pt-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                <div className="flex items-center">
                    <input type="text" name="location" id="location" value={formData.location || ''} onChange={handleInputChange} placeholder="Ex: Escritório, Casa" className="flex-grow border-gray-300 rounded-md shadow-sm"/>
                    <button type="button" onClick={handleGetCurrentLocation} className="ml-2 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200">Usar localização atual</button>
                </div>
            </div>

            {/* Reminders */}
            <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lembretes</label>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="hasReminder" name="hasReminder" type="checkbox" checked={formData.hasReminder || false} onChange={handleInputChange} className="focus:ring-custom-blue h-4 w-4 text-custom-blue border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="hasReminder" className="font-medium text-gray-700">Receber lembrete para esta tarefa</label>
                        {formData.hasReminder && (
                            <div className="mt-2 flex items-center space-x-2">
                                <span>Lembrar</span>
                                <input type="number" name="reminderOffset" value={formData.reminderOffset} onChange={handleInputChange} className="w-20 border-gray-300 rounded-md shadow-sm text-sm" min="1"/>
                                <select name="reminderOffsetUnit" value={formData.reminderOffsetUnit} onChange={handleInputChange} className="border-gray-300 rounded-md shadow-sm text-sm">
                                    <option value="minutes">minutos</option>
                                    <option value="hours">horas</option>
                                    <option value="days">dias</option>
                                </select>
                                <span>antes do vencimento.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsáveis</label>
                <div className="border border-gray-300 rounded-md p-2 max-h-32 overflow-y-auto">
                    {users.map(user => (
                        <div key={user.id} className="flex items-center py-1">
                            <input type="checkbox" id={`user-${user.id}`} checked={(formData.assignees || []).some(u => u.id === user.id)} onChange={() => handleAssigneeChange(user.id)} className="h-4 w-4 rounded border-gray-300 text-custom-blue focus:ring-custom-blue" />
                            <label htmlFor={`user-${user.id}`} className="ml-3 flex items-center text-sm text-gray-700">
                                <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full mr-2"/>
                                {user.name}
                            </label>
                        </div>
                    ))}
                </div>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                <select name="priority" id="priority" value={formData.priority} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue">
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                 <label htmlFor="recurring" className="block text-sm font-medium text-gray-700 mb-1 mt-4">Recorrência</label>
                 <select name="recurring" id="recurring" value={formData.recurring} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue">
                    <option value="none">Nenhuma</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                </select>
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''} onChange={handleDateChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue" />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                <input type="date" name="dueDate" id="dueDate" value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''} onChange={handleDateChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue" />
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 border-t bg-gray-50">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-custom-blue text-white rounded-md text-sm font-medium hover:bg-custom-dark-blue">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
