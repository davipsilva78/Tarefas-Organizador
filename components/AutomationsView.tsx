
import React from 'react';
import { AutomationRule } from '../types';
import Icon from './Icon';

interface AutomationRuleProps {
    rule: AutomationRule;
    onToggle: (rule: AutomationRule) => void;
    onEdit: (rule: AutomationRule) => void;
    onDelete: (ruleId: string) => void;
}

const AutomationRuleDisplay: React.FC<AutomationRuleProps> = ({ rule, onToggle, onEdit, onDelete }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
            <div className="bg-custom-light-blue p-2 rounded-full mr-4">
                <Icon name="automations" className="w-6 h-6 text-custom-blue" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200">QUANDO <span className="text-custom-blue">{rule.trigger}</span></p>
                <p className="text-gray-600 dark:text-gray-400">ENTÃO <span className="text-custom-blue">{rule.action}</span></p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <button onClick={() => onEdit(rule)} className="text-gray-500 hover:text-custom-blue"><Icon name="edit" className="w-5 h-5" /></button>
            <button onClick={() => onDelete(rule.id)} className="text-gray-500 hover:text-red-500"><Icon name="trash" className="w-5 h-5" /></button>
             <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={rule.enabled} onChange={() => onToggle({ ...rule, enabled: !rule.enabled })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-custom-blue"></div>
            </label>
        </div>
    </div>
);

interface AutomationsViewProps {
    automations: AutomationRule[];
    onOpenModal: (rule: AutomationRule | null) => void;
    onUpdate: (rule: AutomationRule) => void;
    onDelete: (ruleId: string) => void;
}

const AutomationsView: React.FC<AutomationsViewProps> = ({ automations, onOpenModal, onUpdate, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Automações</h3>
            <button onClick={() => onOpenModal(null)} className="flex items-center bg-custom-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-custom-dark-blue transition-colors">
                <Icon name="plus" className="w-5 h-5 mr-2" />
                Nova Automação
            </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">Automatize tarefas repetitivas e fluxos de trabalho para economizar tempo e manter tudo organizado.</p>

        <div className="space-y-4">
            {automations.map(rule => (
                <AutomationRuleDisplay 
                    key={rule.id}
                    rule={rule}
                    onToggle={onUpdate}
                    onEdit={onOpenModal}
                    onDelete={onDelete}
                />
            ))}
             {automations.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma automação criada ainda.</p>
                    <p className="text-sm text-gray-400">Clique em "Nova Automação" para começar.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AutomationsView;
