import React from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../contexts/RequestContext';
import { useAuth } from '../contexts/AuthContext';
import { Request } from '../types';
import Button from '../components/ui/Button';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className="text-gray-500 bg-zinc-800 p-3 rounded-full">
      {icon}
    </div>
  </div>
);

const StatusBadge: React.FC<{ statusName: string }> = ({ statusName }) => {
    const { statuses } = useRequests();
    const status = statuses.find(s => s.name === statusName);
    const color = status?.color || 'gray';

    const statusStyles: Record<string, string> = {
        yellow: 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30',
        blue: 'bg-blue-900/50 text-blue-300 border border-blue-500/30',
        purple: 'bg-purple-900/50 text-purple-300 border border-purple-500/30',
        green: 'bg-green-900/50 text-green-300 border border-green-500/30',
        red: 'bg-red-900/50 text-red-300 border border-red-500/30',
        gray: 'bg-gray-700 text-gray-300 border border-gray-500/30',
    };
    return (
        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[color]}`}>
            {statusName}
        </span>
    );
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

const DashboardPage: React.FC = () => {
  const { requests, loading } = useRequests();
  const { user } = useAuth();

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Carregando...</div>;
  }
  
  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Pendente').length;
  const inProgress = requests.filter(r => r.status === 'Em Andamento').length;
  const concluded = requests.filter(r => r.status === 'Entregue').length;
  
  const recentRequests = requests.slice(0, 5);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-400">Visão geral das solicitações de suprimentos</p>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Solicitações" value={total} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>} />
        <StatCard title="Pendentes" value={pending} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
        <StatCard title="Em Andamento" value={inProgress} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>} />
        <StatCard title="Concluídas" value={concluded} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
      </div>

      {/* Recent Requests Table */}
       <div className="bg-zinc-900 shadow-xl rounded-lg overflow-hidden border border-zinc-800">
        <div className="p-6 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-white">Solicitações Recentes</h2>
                <p className="text-sm text-gray-400">
                    {user?.role === 'admin' ? 'Visão geral de todos os setores' : `Apenas solicitações do setor ${user?.sector}`}
                </p>
            </div>
          <Button as="link" to="/requests" variant="secondary">Ver Todas</Button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-800/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nº Pedido</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fornecedor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Responsável</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Previsão de Entrega</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                 <tbody className="divide-y divide-zinc-800">
                    {recentRequests.length > 0 ? recentRequests.map((request) => {
                        const isOverdue = request.deliveryDate && request.deliveryDate < today && request.status !== 'Entregue';
                        return (
                        <tr key={request.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{request.orderNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.supplier}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.responsible || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <StatusBadge statusName={request.status} />
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-300'}`}>
                                {formatDate(request.deliveryDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/requests/${request.id}`} className="text-blue-400 hover:text-blue-300">
                                    Ver
                                </Link>
                            </td>
                        </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-500">
                                Nenhuma solicitação encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;