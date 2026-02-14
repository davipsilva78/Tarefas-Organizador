
import React from 'react';
import Icon from './Icon';

const IntegrationCard: React.FC<{ name: string; description: string; icon: string; url: string; }> = ({ name, description, icon, url }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center flex flex-col">
        <div className="bg-white border inline-block p-4 rounded-full mb-4 self-center">
           {/* Placeholder for actual logos */}
           <Icon name={icon} className="w-8 h-8 text-gray-700" />
        </div>
        <h4 className="text-lg font-bold text-gray-800">{name}</h4>
        <p className="text-gray-600 text-sm mt-2 mb-4 flex-grow">{description}</p>
        <button 
            onClick={() => window.open(url, '_blank')}
            className="w-full mt-auto bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
            Conectar
        </button>
    </div>
);

const IntegrationsView: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Integrações</h3>
        <p className="text-gray-600 mb-6">Conecte o Task Pro com as ferramentas que você já usa para criar um fluxo de trabalho unificado.</p>

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
