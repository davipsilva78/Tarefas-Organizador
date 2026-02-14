
import React from 'react';
import Icon from './Icon';

const IntegrationCard: React.FC<{ name: string; description: string; icon: string; url: string; }> = ({ name, description, icon, url }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center flex flex-col">
        <div className="bg-white dark:bg-gray-600 border dark:border-gray-500 inline-block p-4 rounded-full mb-4 self-center">
           <Icon name={icon} className="w-8 h-8 text-gray-700 dark:text-gray-200" />
        </div>
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">{name}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 mb-4 flex-grow">{description}</p>
        <button 
            onClick={() => window.open(url, '_blank')}
            className="w-full mt-auto bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
        >
            Conectar
        </button>
    </div>
);

const IntegrationsView: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Integrações</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Conecte o Task Pro com as ferramentas que você já usa para criar um fluxo de trabalho unificado.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <IntegrationCard 
                name="Slack"
                description="Receba notificações e crie tarefas diretamente do Slack."
                icon="bell"
                url="https://slack.com"
            />
             <IntegrationCard 
                name="Google Calendar"
                description="Sincronize as datas de vencimento das tarefas com sua agenda."
                icon="calendar"
                url="https://calendar.google.com"
            />
             <IntegrationCard 
                name="WhatsApp"
                description="Envie lembretes e atualizações de tarefas via WhatsApp."
                icon="check"
                url="https://whatsapp.com"
            />
              <IntegrationCard 
                name="GitHub"
                description="Vincule commits e pull requests às suas tarefas."
                icon="kanban"
                url="https://github.com"
            />
             <IntegrationCard 
                name="Google Drive"
                description="Anexe arquivos do Google Drive diretamente às tarefas."
                icon="list"
                url="https://drive.google.com"
            />
             <IntegrationCard 
                name="Zendesk"
                description="Crie tarefas a partir de tickets de suporte."
                icon="team"
                url="https://www.zendesk.com"
            />
        </div>
    </div>
  );
};

export default IntegrationsView;
