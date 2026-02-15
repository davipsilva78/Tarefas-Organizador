
export enum ViewType {
  Dashboard = 'Painel',
  List = 'Lista',
  Kanban = 'Quadro Kanban',
  Gantt = 'Gráfico de Gantt',
  Calendar = 'Calendário',
  Scrum = 'Scrum',
  Team = 'Equipe',
  Chat = 'Chat',
  Reports = 'Relatórios',
  Automations = 'Automações',
  Integrations = 'Integrações',
  Documents = 'Documentos',
  Search = 'Resultados da Pesquisa',
  Settings = 'Configurações',
  About = 'Sobre o aplicativo',
}

export enum Priority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
  Urgent = 'Urgente',
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface User {
  id:string;
  name: string;
  avatarUrl: string;
  password?: string;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string; 
  priority: Priority;
  dueDate?: Date;
  startDate?: Date; 
  createdAt: Date;
  assignees?: User[];
  checklist?: ChecklistItem[];
  subtasks?: Subtask[];
  recurring?: RecurringType;
  hasReminder?: boolean;
  reminderOffset?: number;
  reminderOffsetUnit?: 'minutes' | 'hours' | 'days';
  reminderSent?: boolean;
  location?: string;
}

export type DocumentType = 'doc' | 'xlsx' | 'pdf' | 'ppt';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  content: string;
  lastModified: Date;
  sharedWith: User[];
  location?: string;
}

export interface AutomationRule {
    id: string;
    trigger: string;
    action: string;
    enabled: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  name: string;
  participantIds: string[];
  lastMessage?: string;
  lastMessageTimestamp?: Date;
}

export interface KanbanData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: KanbanColumn };
  columnOrder: string[];
}

export interface AppData extends KanbanData {
  users: { [key: string]: User };
  automations: AutomationRule[];
  documents: Document[];
  conversations: { [key: string]: ChatConversation };
  chatMessages: { [key: string]: ChatMessage };
}

export interface ScrumData extends AppData {}