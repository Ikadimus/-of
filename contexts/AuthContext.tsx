
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Sector } from '../types';
import { supabase } from '../lib/supabaseClient';
import { initialUsers, initialSectors } from '../constants';

interface AuthContextType {
  user: User | null;
  users: User[];
  sectors: Sector[];
  isPrivilegedUser: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, updatedUser: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  addSector: (sector: Omit<Sector, 'id'>) => Promise<void>;
  updateSector: (id: string, updatedSector: Partial<Sector>) => Promise<void>;
  deleteSector: (id: string) => Promise<void>;
  loading: boolean;
  connectionError: string | null;
  missingTables: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [missingTables, setMissingTables] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setConnectionError(null);
    setMissingTables(false);

    try {
      // --- USERS ---
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (usersError) {
        // Códigos de erro Postgres para "Tabela não existe"
        if (usersError.code === 'PGRST205' || usersError.code === '42P01') {
            setMissingTables(true);
            setLoading(false);
            return;
        }

        const errorMsg = `Erro Users: ${JSON.stringify(usersError)}`;
        console.error(errorMsg);
        setConnectionError("Falha ao conectar com o banco de dados. Verifique a URL e a CHAVE API.");
        setLoading(false);
        return; 
      }

      if (usersData && usersData.length === 0) {
          // AUTO-SEED: Se a tabela estiver vazia, popula com o admin inicial
          console.log("Banco de usuários vazio. Populando dados iniciais...");
          for (const u of initialUsers) {
              await supabase.from('users').insert(u);
          }
          const { data: newUsers } = await supabase.from('users').select('*');
          setUsers(newUsers || []);
      } else {
          setUsers(usersData || []);
      }

      // --- SECTORS ---
      const { data: sectorsData, error: sectorsError } = await supabase
        .from('sectors')
        .select('*');
      
      if (sectorsError) {
         if (sectorsError.code !== 'PGRST205' && sectorsError.code !== '42P01') {
             console.error(`Erro Sectors: ${JSON.stringify(sectorsError)}`);
         }
      } else {
        if (sectorsData && sectorsData.length === 0) {
            // AUTO-SEED Sectors
            console.log("Banco de setores vazio. Populando dados iniciais...");
            for (const s of initialSectors) {
                await supabase.from('sectors').insert(s);
            }
             const { data: newSectors } = await supabase.from('sectors').select('*');
             setSectors(newSectors || []);
        } else {
            setSectors(sectorsData || []);
        }
      }

    } catch (error: any) {
      console.error("Erro geral ao buscar dados:", error);
      setConnectionError(error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Inscrever para atualizações em tempo real apenas se não houver erro de tabela
    if (!missingTables) {
        const usersSubscription = supabase
        .channel('public:users')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
            supabase.from('users').select('*').then(({ data }) => {
                if (data) setUsers(data);
            });
        })
        .subscribe();

        const sectorsSubscription = supabase
        .channel('public:sectors')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sectors' }, () => {
            supabase.from('sectors').select('*').then(({ data }) => {
                if (data) setSectors(data);
            });
        })
        .subscribe();

        return () => {
        supabase.removeChannel(usersSubscription);
        supabase.removeChannel(sectorsSubscription);
        };
    }
  }, [missingTables]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (missingTables) return false;

    // Busca usuário no banco de dados REAL
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .single();

    if (error) {
        console.error("Erro no login:", JSON.stringify(error));
    }

    if (data && !error) {
      const userToStore = { ...data };
      delete userToStore.password;
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isPrivilegedUser = user?.role === 'admin';

  const addUser = async (newUser: Omit<User, 'id'>) => {
    const userPayload = { ...newUser, id: Date.now() }; 
    await supabase.from('users').insert(userPayload);
  };

  const updateUser = async (id: number, updatedUser: Partial<User>) => {
    await supabase.from('users').update(updatedUser).eq('id', id);
  };

  const deleteUser = async (id: number) => {
    await supabase.from('users').delete().eq('id', id);
  };
  
  const addSector = async (newSector: Omit<Sector, 'id'>) => {
    const sectorPayload = { ...newSector, id: `sector-${Date.now()}` };
    await supabase.from('sectors').insert(sectorPayload);
  };

  const updateSector = async (id: string, updatedSector: Partial<Sector>) => {
    await supabase.from('sectors').update(updatedSector).eq('id', id);
  };

  const deleteSector = async (id: string) => {
    await supabase.from('sectors').delete().eq('id', id);
  };

  return (
    <AuthContext.Provider value={{ user, users, sectors, isPrivilegedUser, login, logout, addUser, updateUser, deleteUser, addSector, updateSector, deleteSector, loading, connectionError, missingTables }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
