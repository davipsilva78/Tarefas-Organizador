
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Icon from './Icon';

interface UserEditModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, name, avatarUrl });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Editar Perfil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex justify-center">
                <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full" />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue" required />
            </div>
             <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-1">URL da Foto de Perfil</label>
              <input type="text" id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue" required />
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

export default UserEditModal;
