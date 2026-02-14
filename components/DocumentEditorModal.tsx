
import React, { useState, useEffect } from 'react';
import { Document } from '../types';
import Icon from './Icon';

interface DocumentEditorModalProps {
  document: Document;
  onClose: () => void;
  onSave: (docId: string, content: string) => void;
}

const DocumentEditorModal: React.FC<DocumentEditorModalProps> = ({ document, onClose, onSave }) => {
    const [content, setContent] = useState(document.content);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (content !== document.content) {
                onSave(document.id, content);
            }
        }, 1000); // Auto-save after 1 second of inactivity

        return () => clearTimeout(timer);
    }, [content, document, onSave]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <div className="flex items-center">
                        <Icon name="document" className="w-6 h-6 text-gray-700 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-800">{document.name}</h3>
                    </div>
                    <div className="flex items-center">
                         <div className="flex -space-x-2 mr-4">
                            {document.sharedWith.map(user => (
                                <img key={user.id} src={user.avatarUrl} title={user.name} className="w-8 h-8 rounded-full ring-2 ring-white"/>
                            ))}
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <Icon name="x" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue resize-none p-4"
                        placeholder="Comece a digitar..."
                    />
                </div>
                 <div className="flex justify-end items-center p-4 border-t bg-gray-50 flex-shrink-0">
                    <span className="text-sm text-gray-500 mr-4">Salvo automaticamente</span>
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-custom-blue text-white rounded-md text-sm font-medium hover:bg-custom-dark-blue">Fechar</button>
                </div>
            </div>
        </div>
    );
};

export default DocumentEditorModal;
