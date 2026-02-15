
import React from 'react';
import Icon from './Icon';

interface TutorialCardProps {
  title: string;
  icon: string;
  description: string;
  steps: string[];
  imagePlaceholderText: string;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ title, icon, description, steps, imagePlaceholderText }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Icon name={icon} className="w-8 h-8 text-custom-blue mr-4" />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Como usar:</h4>
          <ul className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 bg-custom-light-blue dark:bg-gray-700 text-custom-blue dark:text-gray-200 font-bold rounded-full h-6 w-6 text-sm flex items-center justify-center mr-3 mt-1">
                  {index + 1}
                </div>
                <span className="text-gray-700 dark:text-gray-300">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 h-full flex items-center justify-center">
          <p className="text-center text-gray-500 dark:text-gray-400 italic">{imagePlaceholderText}</p>
        </div>
      </div>
    </div>
  </div>
);

const AboutView: React.FC = () => {
  const tutorials: TutorialCardProps[] = [
    {
      title: 'Quadro Kanban',
      icon: 'kanban',
      description: 'Organize suas tarefas de forma visual e intuitiva. Mova cartões entre colunas para acompanhar o progresso do seu trabalho, desde "A Fazer" até "Concluído".',
      steps: [
        'Clique na aba "Quadro Kanban" na barra lateral.',
        'Visualize suas tarefas organizadas em colunas (ex: A Fazer, Em Progresso).',
        'Arraste e solte um cartão de tarefa de uma coluna para outra para atualizar seu status.',
        'Clique em um cartão para abrir o modal e ver mais detalhes.',
      ],
      imagePlaceholderText: 'Figura: Um quadro com colunas como "A Fazer" e "Em Progresso", e cartões de tarefas sendo movidos entre elas.',
    },
    {
        title: 'Criação de Tarefas',
        icon: 'plus',
        description: 'Adicione novas tarefas rapidamente através de um formulário completo, definindo todos os detalhes importantes como prazos, responsáveis e prioridade.',
        steps: [
          'Clique no botão "+ Nova Tarefa" no cabeçalho.',
          'Preencha o título, descrição, data de vencimento e prioridade.',
          'Atribua a tarefa a um ou mais membros da equipe.',
          'Adicione subtarefas, lembretes e status (como "Conclusão Parcial").',
        ],
        imagePlaceholderText: 'Figura: O modal de criação de tarefas com campos para título, descrição, responsáveis e datas.',
    },
    {
      title: 'Gráfico de Gantt',
      icon: 'gantt',
      description: 'Planeje o cronograma de seus projetos com uma visão de linha do tempo. O Gráfico de Gantt ajuda a visualizar a duração e a sobreposição das tarefas.',
      steps: [
        'Acesse a aba "Gráfico de Gantt".',
        'Visualize todas as tarefas com datas de início e fim em uma linha do tempo.',
        'A barra de cada tarefa representa sua duração.',
        'Use o gráfico para identificar gargalos e gerenciar prazos do projeto.',
      ],
      imagePlaceholderText: 'Figura: Uma linha do tempo horizontal com barras coloridas representando a duração de cada tarefa.',
    },
    {
        title: 'Personalização',
        icon: 'settings',
        description: 'Adapte o Task Pro ao seu gosto e necessidade. Altere o tema de cores do aplicativo e escolha quais módulos devem aparecer na barra lateral.',
        steps: [
          'Vá para "Configurações" na barra lateral.',
          'Na seção "Aparência", clique em um tema para mudar as cores do app.',
          'Na seção "Módulos da Barra Lateral", ative ou desative as ferramentas que você mais usa para uma navegação mais limpa.',
        ],
        imagePlaceholderText: 'Figura: A tela de configurações mostrando as paletas de cores e os interruptores para ativar/desativar módulos como Gantt e Scrum.',
      },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Guia do Usuário - Task Pro</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Aprenda a usar as principais funcionalidades para maximizar sua produtividade.</p>
      
      <div className="space-y-8">
        {tutorials.map((tutorial, index) => (
          <TutorialCard key={index} {...tutorial} />
        ))}
      </div>
    </div>
  );
};

export default AboutView;
