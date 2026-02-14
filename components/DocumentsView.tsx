
import React, { useState } from 'react';
import { Document, User, DocumentType } from '../types';
import Icon from './Icon';
import DocumentModal from './DocumentModal';

interface DocumentsViewProps {
  documents: Document[];
  users: User[];
  onOpen: (doc: Document) => void;
  onSave: (doc: Document) => void;
}

const docTypeDetails: { [key in DocumentType]: { icon: string; color: string } } = {
    doc: { icon: 'doc', color: 'text-blue-500' },
    xlsx: { icon: 'xlsx', color: 'text-green-500' },
    pdf: { icon: 'pdf', color: 'text-red-500' },
    ppt: { icon: 'ppt', color: 'text-orange-500' },
};

const DocumentsView: React.FC<DocumentsViewProps> = ({ documents, users, onOpen, onSave }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveDoc = (doc: Document) => {
        onSave(doc);
        setIsModalOpen(false);
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Documentos</h3>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-custom-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-custom-dark-blue transition-colors">
                    <Icon name="plus" className="w-5 h-5 mr-2" />
                    Novo Documento
                </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">Crie, edite e compartilhe documentos com sua equipe. Todos os arquivos são salvos na nuvem e podem ser editados colaborativamente.</p>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
                {documents.map(doc => (
                    <div key={doc.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <Icon name={docTypeDetails[doc.type].icon} className={`w-6 h-6 mr-3 ${docTypeDetails[doc.type].color}`} />
                                <p className="font-semibold text-gray-800 dark:text-white">{doc.name}</p>
                            </div>
                             <button onClick={() => onOpen(doc)} className="font-medium text-custom-blue hover:underline text-sm">Abrir</button>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Compartilhado com:</span>
                                <div className="flex items-center -space-x-2">
                                    {doc.sharedWith.map(user => (
                                        <img key={user.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src={user.avatarUrl} alt={user.name} title={user.name} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Última Modificação:</span>
                                <span>{new Date(doc.lastModified).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-2/5">Nome do Documento</th>
                            <th scope="col" className="px-6 py-3">Compartilhado com</th>
                            <th scope="col" className="px-6 py-3">Última Modificação</th>
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Icon name={docTypeDetails[doc.type].icon} className={`w-6 h-6 mr-3 ${docTypeDetails[doc.type].color}`} />
                                        {doc.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center -space-x-2">
                                        {doc.sharedWith.map(user => (
                                            <img key={user.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src={user.avatarUrl} alt={user.name} title={user.name} />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{new Date(doc.lastModified).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => onOpen(doc)} className="font-medium text-custom-blue hover:underline">Abrir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(documents.length === 0) && (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">Nenhum documento encontrado.</p>
                    <p className="text-sm text-gray-400">Clique em "Novo Documento" para começar.</p>
                </div>
            )}
            
            {isModalOpen && <DocumentModal doc={null} users={users} onClose={() => setIsModalOpen(false)} onSave={handleSaveDoc} />}
        </div>
    );
};

export default DocumentsView;
