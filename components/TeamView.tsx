
import React, { useState } from 'react';
import { User } from '../types';
import Icon from './Icon';

interface TeamViewProps {
  users: User[];
  onAddUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUserRequest: (user: User) => void;
}

const TeamView: React.FC<TeamViewProps> = ({ users, onAddUser, onEditUser, onDeleteUserRequest }) => {
    const [newUserName, setNewUserName] = useState('');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserName.trim()) return;

        const newUserId = `user-${Date.now()}`;
        const newUser: User = {
            id: newUserId,
            name: newUserName,
            password: '123', // Default password for simplicity
            avatarUrl: `https://i.pravatar.cc/150?u=${newUserId}`
        };
        onAddUser(newUser);
        setNewUserName('');
    };

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Adicionar Novo Membro</h3>
                <form onSubmit={handleAddUser} className="flex items-center space-x-4">
                    <input 
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Nome do novo membro"
                        className="flex-grow border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue"
                    />
                    <button type="submit" className="flex items-center bg-custom-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-custom-dark-blue transition-colors">
                        <Icon name="plus" className="w-5 h-5 mr-2" />
                        Adicionar
                    </button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Membros da Equipe ({users.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                            <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full mb-4" />
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Membro</p>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={() => onEditUser(user)} className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500">Editar</button>
                                <button onClick={() => onDeleteUserRequest(user)} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200">Remover</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamView;
