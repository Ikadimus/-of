import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Sector } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const UserFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    user: User | null;
    sectors: Sector[];
}> = ({ isOpen, onClose, onSave, user, sectors }) => {
    const [formData, setFormData] = useState<Partial<User>>({});

    React.useEffect(() => {
        setFormData(user || {});
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };
    
    const isEditing = !!user?.id;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Preencha os dados do usuário</p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-300">Nome</label>
                                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300">Email</label>
                                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md text-sm" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300">Senha</label>
                                <input type="password" name="password" onChange={handleChange} required={!isEditing} placeholder={isEditing ? 'Deixe em branco para não alterar' : ''} className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Função</label>
                                    <select name="role" value={formData.role || 'user'} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md text-sm">
                                        <option value="user">Usuário</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Setor</label>
                                    <select name="sector" value={formData.sector || 'Nenhum'} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 rounded-md text-sm">
                                        <option value="Nenhum">Nenhum</option>
                                        {sectors.map(sector => (
                                            <option key={sector.id} value={sector.name}>{sector.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-800/50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">{isEditing ? 'Salvar' : 'Criar'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UsersPage: React.FC = () => {
    const { users, sectors, addUser, updateUser, deleteUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleOpenModal = (user: User | null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (user: User) => {
        if (user.id) {
            const { password, ...userData } = user;
            if(password) {
                updateUser(user.id, user);
            } else {
                updateUser(user.id, userData);
            }
        } else {
            addUser(user);
        }
        handleCloseModal();
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };
    
    const confirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
                    <p className="text-gray-400">Adicione e gerencie usuários do sistema.</p>
                </div>
                <Button onClick={() => handleOpenModal(null)}>+ Novo Usuário</Button>
            </div>
            
            <div className="bg-zinc-900 shadow-xl rounded-lg overflow-hidden border border-zinc-800">
                 <div className="p-4">
                     <p className="text-sm text-gray-400">Total de {users.length} usuários cadastrados</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-800">
                        <thead className="bg-zinc-800/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Função</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Setor</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-600/50 text-blue-300' : 'bg-gray-600/50 text-gray-300'}`}>
                                            {user.role === 'admin' ? 'Admin' : 'Usuário'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.sector || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handleOpenModal(user)} className="text-blue-400 hover:text-blue-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteClick(user)} className="text-red-400 hover:text-red-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} user={selectedUser} sectors={sectors} />

            <Modal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirmar Exclusão"
            >
                Você tem certeza que deseja deletar o usuário {userToDelete?.name}? Esta ação não pode ser desfeita.
            </Modal>
        </div>
    );
};

export default UsersPage;
