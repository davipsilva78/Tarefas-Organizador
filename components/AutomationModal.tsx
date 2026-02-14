
import React, { useState, useEffect } from 'react';
import { AutomationRule } from '../types';
import Icon from './Icon';

interface AutomationModalProps {
  rule: AutomationRule | null;
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
}

const triggers = [
    "o status de uma tarefa mudar para 'Concluído'",
    "uma nova tarefa for atribuída a um membro",
    "uma tarefa se aproximar da data de vencimento",
    "uma nova tarefa for criada",
];

const actions = [
    "arquivar a tarefa automaticamente",
    "enviar uma notificação por e-mail",
    "mudar a prioridade para 'Urgente'",
    "adicionar um comentário padrão",
];


const AutomationModal: React.FC<AutomationModalProps> = ({ rule, onClose, onSave }) => {
  const [trigger, setTrigger] = useState(triggers[0]);
  const [action, setAction] = useState(actions[0]);

  useEffect(() => {
    if (rule) {
      setTrigger(rule.trigger);
      setAction(rule.action);
    }
  }, [rule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ruleToSave: AutomationRule = {
        id: rule ? rule.id : `auto-${Date.now()}`,
        trigger,
        action,
        enabled: rule ? rule.enabled : true,
    };
    onSave(ruleToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{rule ? 'Editar Automação' : 'Nova Automação'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="trigger" className="block text-sm font-medium text-gray-700 mb-1">QUANDO (Gatilho)</label>
              <select id="trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue">
                {triggers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">ENTÃO (Ação)</label>
              <select id="action" value={action} onChange={(e) => setAction(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-custom-blue focus:border-custom-blue">
                {actions.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 border-t bg-gray-50">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 mr-2">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-custom-blue text-white rounded-md text-sm font-medium hover:bg-custom-dark-blue">Salvar Automação</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutomationModal;
