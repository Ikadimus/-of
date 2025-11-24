// Fix: Provide full content for constants.ts to define initial data for the application.
import { Request, FormField, Status, User, Sector } from './types';

export const initialSectors: Sector[] = [
  { id: 'sector-1', name: 'TI', description: 'Tecnologia da Informação' },
  { id: 'sector-2', name: 'RH', description: 'Recursos Humanos' },
  { id: 'sector-3', name: 'Financeiro', description: 'Departamento Financeiro' },
];

export const initialUsers: User[] = [
  { id: 1, name: 'Administrador', email: 'admin@empresa.com', password: 'admin123', role: 'admin', sector: 'TI' },
  { id: 2, name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user', sector: 'RH' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', password: 'password', role: 'user', sector: 'Financeiro' },
];

export const initialStatuses: Status[] = [
    { id: 'status-1', name: 'Pendente', color: 'yellow' },
    { id: 'status-2', name: 'Em Andamento', color: 'blue' },
    { id: 'status-3', name: 'Aguardando Peças', color: 'purple' },
    { id: 'status-4', name: 'Entregue', color: 'green' },
    { id: 'status-5', name: 'Cancelado', color: 'red' },
];

export const initialFormFields: FormField[] = [
    { id: 'orderNumber', label: 'Nº do Pedido', type: 'text', isActive: true, required: true, isStandard: true },
    { id: 'requestDate', label: 'Data da Solicitação', type: 'date', isActive: true, required: true, isStandard: true },
    { id: 'sector', label: 'Setor', type: 'select', isActive: true, required: true, isStandard: true },
    { id: 'supplier', label: 'Fornecedor', type: 'text', isActive: true, required: true, isStandard: true },
    { id: 'deliveryDate', label: 'Previsão de Entrega', type: 'date', isActive: true, required: false, isStandard: true },
    { id: 'status', label: 'Status', type: 'select', isActive: true, required: true, isStandard: true },
    { id: 'responsible', label: 'Responsável', type: 'select', isActive: true, required: true, isStandard: true },
    { id: 'notes', label: 'Observações', type: 'textarea', isActive: false, required: false, isStandard: false },
];

export const initialRequests: Request[] = [
  {
    id: 1,
    orderNumber: 'PED-001',
    requestDate: '2023-10-01',
    sector: 'TI',
    supplier: 'Fornecedor A',
    deliveryDate: '2023-10-10',
    status: 'Entregue',
    responsible: 'Administrador',
    items: [
      { id: 'item-1', name: 'Mouse Gamer', quantity: 5, status: 'Entregue' },
      { id: 'item-2', name: 'Teclado Mecânico', quantity: 5, status: 'Entregue' },
    ],
    customFields: { notes: 'Urgente' }
  },
  {
    id: 2,
    orderNumber: 'PED-002',
    requestDate: '2023-10-02',
    sector: 'RH',
    supplier: 'Fornecedor B',
    deliveryDate: '2023-10-15',
    status: 'Em Andamento',
    responsible: 'John Doe',
    items: [
      { id: 'item-3', name: 'Cadeira de Escritório', quantity: 2, status: 'Em Andamento' },
    ],
  },
  {
    id: 3,
    orderNumber: 'PED-003',
    requestDate: '2023-10-03',
    sector: 'Financeiro',
    supplier: 'Fornecedor C',
    deliveryDate: '2023-10-20',
    status: 'Pendente',
    responsible: 'Jane Smith',
    items: [
      { id: 'item-4', name: 'Calculadora HP 12C', quantity: 10, status: 'Pendente' },
    ],
    customFields: { notes: 'Compra para o time novo.' }
  },
];