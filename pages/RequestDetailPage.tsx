import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequests } from '../contexts/RequestContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import NotFoundPage from './NotFoundPage';

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

const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, deleteRequest, formFields } = useRequests();
  const { isPrivilegedUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const requestId = Number(id);
  const request = getRequestById(requestId);

  if (!request) {
    return <NotFoundPage />;
  }

  const handleDelete = () => {
    deleteRequest(requestId);
    navigate('/');
  };

  const visibleFields = formFields.filter(f => f.isActive);

  const renderFieldValue = (fieldId: string, value: any) => {
      if (value === undefined || value === null || value === '') return <span className="text-gray-400 italic">Não informado</span>;
       if (fieldId === 'status') {
          return <StatusBadge statusName={String(value)} />;
      }
      return String(value);
  }

  return (
    <div className="bg-zinc-900 shadow-xl rounded-lg overflow-hidden border border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">
            Detalhes da Solicitação: {request.orderNumber}
          </h1>
          <div className="flex items-center space-x-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            {isPrivilegedUser && (
              <>
                <Button as="link" to={`/requests/edit/${request.id}`} variant="primary">
                  📝 Editar Solicitação
                </Button>
                <Button variant="danger" onClick={() => setIsModalOpen(true)}>
                  🗑️ Deletar Solicitação
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {visibleFields.map(field => (
                <div key={field.id} className="col-span-1">
                    <dt className="text-sm font-medium text-gray-400">{field.label}</dt>
                    <dd className="mt-1 text-sm text-gray-100">
                        {renderFieldValue(field.id, (request as any)[field.id] || request.customFields?.[field.id])}
                    </dd>
                </div>
            ))}
        </dl>
        
        <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Itens da Solicitação</h3>
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantidade</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status do Item</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {request.items.length > 0 ? request.items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{item.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <StatusBadge statusName={item.status} />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-gray-500">
                                    Nenhum item encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
      >
        Você tem certeza que deseja deletar a solicitação {request.orderNumber}? Esta ação não pode ser desfeita.
      </Modal>
    </div>
  );
};

export default RequestDetailPage;