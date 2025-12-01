
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
    const [formData, setFormData] = useState<Partial<User>>({ role: 'user', sector: 'Nenhum' });

    React.useEffect(() => {
        if (isOpen) {
            setFormData(user || { role: 'user', sector: 'Nenhum' });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Garante que valores padrão sejam enviados se o usuário não mexer nos selects
        const finalData = {
            ...formData,
            role: formData.role || 'user',
            sector: formData.sector || 'Nenhum'
        };
        onSave(finalData as User);
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
                                <input type="password" name="password" onChange={handleChange} required={!isEditing} placeholder={isEditing ? 'Deixe em branco para não alterar' : ''} className="mt-1 block w-full px-3 py-2 border