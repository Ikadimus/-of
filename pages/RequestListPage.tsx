import React from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../contexts/RequestContext';

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


const RequestListPage: React.FC = () => {
  const { requests, loading } = useRequests();

  if (loading) {
    return <div className="text-center p-10 text-gray-400">Carregando solicitações...</div>;
  }

  return (
    <div className="bg-zinc-900 shadow-xl rounded-lg overflow-hidden border border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
            <h1 className="text-2xl font-bold text-white">Todas as Solicitações</h1>
        </div>
        
        {requests.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
                <p>Nenhuma solicitação encontrada.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nº Pedido</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fornecedor</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Responsável</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Data Solicitação</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {requests.map((request) => (
                            <tr key={request.id} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{request.orderNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.supplier}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.responsible || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.requestDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <StatusBadge statusName={request.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/requests/${request.id}`} className="text-blue-400 hover:text-blue-300">
                                        Ver Detalhes
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
};

export default RequestListPage;