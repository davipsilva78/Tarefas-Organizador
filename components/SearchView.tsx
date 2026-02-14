
import React, { useState, useEffect } from 'react';
import Icon from './Icon';

export interface SearchFilters {
  keyword: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface SearchViewProps {
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
}

const SAVED_SEARCHES_KEY = 'taskAppSavedSearches';

const SearchView: React.FC<SearchViewProps> = ({ onClose, onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({ keyword: '', startDate: '', endDate: '', location: '' });
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem(SAVED_SEARCHES_KEY);
    if (storedSearches) {
      setSavedSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleSaveSearch = () => {
    if (filters.keyword && !savedSearches.includes(filters.keyword)) {
      const newSavedSearches = [...savedSearches, filters.keyword];
      setSavedSearches(newSavedSearches);
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(newSavedSearches));
    }
  };
  
  const handleRemoveSearch = (searchTerm: string) => {
    const newSavedSearches = savedSearches.filter(s => s !== searchTerm);
    setSavedSearches(newSavedSearches);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(newSavedSearches));
  };
  
  const applySavedSearch = (searchTerm: string) => {
    setFilters({ ...filters, keyword: searchTerm });
    onSearch({ ...filters, keyword: searchTerm });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <input type="text" name="keyword" placeholder="Pesquisar por palavras-chave em tarefas e documentos..." value={filters.keyword} onChange={handleInputChange} className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-l-md shadow-sm text-lg p-3 focus:ring-custom-blue focus:border-custom-blue" />
            <button onClick={handleSaveSearch} className="p-3 border-y border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" title="Salvar pesquisa">
                Salvar
            </button>
             <button onClick={onClose} className="p-3 border-y border-r border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md" title="Fechar">
                <Icon name="x" className="w-6 h-6"/>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início</label>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} className="mt-1 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm"/>
             </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Fim</label>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} className="mt-1 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm"/>
             </div>
             <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Localização</label>
                <input type="text" name="location" value={filters.location} onChange={handleInputChange} placeholder="Ex: Escritório" className="mt-1 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm"/>
             </div>
          </div>

          {savedSearches.length > 0 && (
            <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Atalhos de pesquisa</h4>
                <div className="flex flex-wrap gap-2">
                    {savedSearches.map(term => (
                        <div key={term} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full">
                            <button onClick={() => applySavedSearch(term)} className="px-3 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-full">{term}</button>
                            <button onClick={() => handleRemoveSearch(term)} className="px-2 py-1 hover:bg-red-100 dark:hover:bg-gray-600/50 rounded-r-full">
                                <Icon name="x" className="w-4 h-4 text-gray-500 hover:text-red-600"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button onClick={handleSearch} className="px-6 py-2 bg-custom-blue text-white rounded-md font-semibold hover:bg-custom-dark-blue">
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchView;
