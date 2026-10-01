'use client';

import { useState, FormEvent } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

// Instância temporária para não deslogar o ADM ao criar nova conta
const secondaryApp = getApps().length > 1 
  ? getApps()[1] 
  : initializeApp(
      {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      },
      'Secondary'
    );
const secondaryAuth = getAuth(secondaryApp);

export default function CadastrarUsuario() {
  const { userData } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'admin' | 'mecanico'>('mecanico');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  if (userData?.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Acesso restrito apenas para Administradores.
      </div>
    );
  }

  const handleCadastrar = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    setCarregando(true);

    try {
      // 1. Cria a conta de acesso no Firebase Auth usando a segunda instância
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, senha);
      const novoUid = userCredential.user.uid;

      // 2. Salva o perfil e role no Firestore
      await setDoc(doc(db, 'usuarios', novoUid), {
        uid: novoUid,
        nome,
        email,
        role,
        criadoEm: new Date(),
      });

      setMensagem({ tipo: 'sucesso', texto: `Usuário ${nome} (${role}) cadastrado com sucesso!` });
      setNome('');
      setEmail('');
      setSenha('');
      setRole('mecanico');
    } catch (err: any) {
      console.error(err);
      setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar usuário. Verifique se o e-mail já existe.' });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Cadastrar Novo Usuário</h1>

        {mensagem.texto && (
          <div className={`p-3 rounded-md text-sm mb-4 ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleCadastrar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Funcionário</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              placeholder="Ex: Carlos Mecânico"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail de Acesso</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              placeholder="carlos@oficina.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha Inicial</label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Perfil de Acesso</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'mecanico')}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none bg-white font-medium"
            >
              <option value="mecanico">Mecânico (Apenas Itens e Quantidades)</option>
              <option value="admin">Administrador (Acesso Total + Valores)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </form>
      </div>
    </main>
  );
}