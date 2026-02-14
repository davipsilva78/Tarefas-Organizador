
import React from 'react';
import { Task, Document } from '../types';
import Icon from './Icon';

interface SearchResultsViewProps {
  results: {
    tasks: Task[];
    documents: Document[];
  };
  onTaskClick: (task: Task) => void;
  onDocumentClick: (doc: Document) => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({ results, onTaskClick, onDocumentClick }) => {
  const totalResults = results.tasks.length + results.documents.length;

  return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </h2>

        {totalResults === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-lg text-gray-600">Nenhum item corresponde à sua pesquisa.</p>
                <p className="text-gray-400">Tente ajustar seus filtros ou palavras-chave.</p>
            </div>
        ) : (
            <div className="space-y-8">
                {results.tasks.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Tarefas ({results.tasks.length})</h3>
                        <ul className="divide-y divide-gray-200">
                            {results.tasks.map(task => (
                                <li key={task.id} onClick={() => onTaskClick(task)} className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                                    <div>
                                        <p className="font-semibold text-custom-blue">{task.title}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">Vencimento: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/D'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {results.documents.length > 0 && (
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Documentos ({results.documents.length})</h3>
                        <ul className="divide-y divide-gray-200">
                            {results.documents.map(doc => (
                                <li key={doc.id} onClick={() => onDocumentClick(doc)} className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <Icon name="document" className="w-5 h-5 mr-3 text-gray-400" />
                                        <p className="font-semibold text-custom-blue">{doc.name}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">Última modificação: {new Date(doc.lastModified).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default SearchResultsView;
