
import { AppData, Priority, User, Task } from '../types';

export const initialUsers: { [key: string]: User } = {
  'user-1': { id: 'user-1', name: 'Ana Silva', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', password: '123' },
  'user-2': { id: 'user-2', name: 'Bruno Costa', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', password: '123' },
  'user-3': { id: 'user-3', name: 'Carla Dias', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', password: '123' },
};

const tasks: { [key: string]: Task } = {
  'task-1': {
    id: 'task-1',
    title: 'Desenvolver a página de login',
    description: 'Criar a interface e a lógica de autenticação.',
    status: 'A Fazer',
    priority: Priority.High,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    startDate: new Date(),
    createdAt: new Date(),
    assignees: [initialUsers['user-1'], initialUsers['user-3']],
    subtasks: [
      { id: 'sub-1-1', text: 'Desenhar wireframe', completed: true },
      { id: 'sub-1-2', text: 'Implementar front-end', completed: false },
      { id: 'sub-1-3', text: 'Conectar com back-end', completed: false },
    ],
    recurring: 'none',
    hasReminder: true,
    reminderOffset: 1,
    reminderOffsetUnit: 'days',
  },
  'task-2': {
    id: 'task-2',
    title: 'Configurar o banco de dados',
    status: 'Em Progresso',
    priority: Priority.Urgent,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    assignees: [initialUsers['user-2']],
    recurring: 'none',
  },
  'task-3': {
    id: 'task-3',
    title: 'Reunião de alinhamento com o cliente',
    status: 'Concluído',
    priority: Priority.Medium,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    assignees: [initialUsers['user-1']],
    recurring: 'weekly',
  },
  'task-4': {
    id: 'task-4',
    title: 'Testar a integração da API',
    description: 'Verificar se todos os endpoints estão funcionando corretamente.',
    status: 'Conclusão Parcial',
    priority: Priority.High,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    createdAt: new Date(),
    assignees: [initialUsers['user-3']],
    recurring: 'none',
  },
  'task-5': {
    id: 'task-5',
    title: 'Atualizar a documentação do projeto',
    status: 'A Fazer',
    priority: Priority.Low,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    recurring: 'monthly',
  },
   'task-6': {
    id: 'task-6',
    title: 'Deploy em ambiente de homologação',
    status: 'Revisão',
    priority: Priority.Urgent,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    startDate: new Date(),
    createdAt: new Date(),
    assignees: [initialUsers['user-2']],
    recurring: 'none',
  },
};

export const initialData: AppData = {
  tasks,
  users: initialUsers,
  columns: {
    'col-1': { id: 'col-1', title: 'A Fazer', taskIds: ['task-1', 'task-5'] },
    'col-2': { id: 'col-2', title: 'Em Progresso', taskIds: ['task-2'] },
    'col-5': { id: 'col-5', title: 'Conclusão Parcial', taskIds: ['task-4'] },
    'col-3': { id: 'col-3', title: 'Revisão', taskIds: ['task-6'] },
    'col-4': { id: 'col-4', title: 'Concluído', taskIds: ['task-3'] },
  },
  columnOrder: ['col-1', 'col-2', 'col-5', 'col-3', 'col-4'],
  automations: [
    { id: 'auto-1', trigger: "o status de uma tarefa mudar para 'Concluído'", action: "arquivar a tarefa automaticamente", enabled: true },
    { id: 'auto-2', trigger: "uma nova tarefa for atribuída a um membro", action: "enviar uma notificação por e-mail", enabled: true },
    { id: 'auto-3', trigger: "uma tarefa se aproximar da data de vencimento", action: "mudar a prioridade para 'Urgente'", enabled: false },
  ],
  documents: [
      { id: 'doc-1', name: 'Planejamento Sprint Q3', type: 'doc', content: '## Objetivos da Sprint\n\n- Finalizar o fluxo de checkout.\n- Aumentar a performance da dashboard em 20%.', lastModified: new Date(), sharedWith: [initialUsers['user-1'], initialUsers['user-2']] },
      { id: 'doc-2', name: 'Orçamento de Marketing', type: 'xlsx', content: 'Dados da planilha aqui...', lastModified: new Date(), sharedWith: [initialUsers['user-1']] },
      { id: 'doc-3', name: 'Apresentação para Investidores', type: 'ppt', content: 'Slide 1: Introdução...', lastModified: new Date(), sharedWith: Object.values(initialUsers) },
  ],
};
