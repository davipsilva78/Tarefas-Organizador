
import React, { useState } from 'react';
import { Document, User, DocumentType } from '../types';
import Icon from './Icon';

interface DocumentModalProps {
  doc: Document | null;
  users: User[];
  onClose: () => void;
  onSave: (doc: Document) => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ doc, users, onClose, onSave }) => {
  const [name, setName] = useState(doc?.name || '');
  const [type, setType] = useState<DocumentType>(doc?.type || 'doc');
  const [sharedWith, setSharedWith] = useState<User[]>(doc?.sharedWith || []);
  const [location, setLocation] = useState(doc?.location || '');

  const handleShareChange = (userId: string) => {
    const isShared = sharedWith.some(u => u.id === userId);
    if (isShared) {
      setSharedWith(sharedWith.filter(u => u.id !== userId));
    } else {
      const userToAdd = users.find(u => u.id === userId);
      if (userToAdd) setSharedWith([...sharedWith, userToAdd]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const docToSave: Document = {
      id: doc?.id || `doc-${Date.now()}`,
      name,
      type,
      sharedWith,
      content: doc?.content || '',
      lastModified: new Date(),
      location: location
    };
    onSave(docToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{doc ? 'Editar Documento' : 'Novo Documento'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><Icon name="x" className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Documento</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" required />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Arquivo</label>
              <select id="type" value={type} onChange={e => setType(e.target.value as DocumentType)} className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm">
                <option value="doc">Documento (.doc)</option>
                <option value="xlsx">Planilha (.xlsx)</option>
                <option value="ppt">Apresentação (.ppt)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
             <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Localização</label>
                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ex: Escritório de São Paulo" className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compartilhar com</label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 max-h-40 overflow-y-auto">
                    {users.map(user => (
                        <div key={user.id} className="flex items-center py-1">
                            <input type="checkbox" id={`share-${user.id}`} checked={sharedWith.some(u => u.id === user.id)} onChange={() => handleShareChange(user.id)} className="h-4 w-4 rounded border-gray-300 text-custom-blue focus:ring-custom-blue"/>
                            <label htmlFor={`share-${user.id}`} className="ml-3 flex items-center text-sm text-gray-700 dark:text-gray-300">
                                <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full mr-2"/>
                                {user.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 mr-2">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-custom-blue text-white rounded-md text-sm font-medium hover:bg-custom-dark-blue">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentModal;
