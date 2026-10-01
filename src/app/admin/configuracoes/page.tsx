'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import RotaProtegida from '@/components/RotaProtegida';
import { DadosOficina } from '@/types/oficina';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  return (
    <RotaProtegida>
      <ConteudoConfiguracoes />
    </RotaProtegida>
  );
}

function ConteudoConfiguracoes() {
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';

  const [dados, setDados] = useState<DadosOficina>({
    nome: 'MINHA OFICINA MECÂNICA',
    subtitulo: 'Centro Automotivo Especializado',
    endereco: 'Rua Principal, 100',
    bairroCidadeUf: 'Centro - Cidade / UF',
    telefone1: '(00) 00000-0000',
    telefone2: '(00) 90000-0000',
    email: 'contato@minhaoficina.com',
    logoUrl: '',
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const docRef = doc(db, 'configuracoes', 'oficina');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDados(docSnap.data() as DadosOficina);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da oficina:', error);
      } finally {
        setCarregando(false);
      }
    }
    carregarConfiguracoes();
  }, []);

  const handleUploadLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Por favor, selecione uma imagem menor que 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDados((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await setDoc(doc(db, 'configuracoes', 'oficina'), dados);
      alert('Dados da oficina atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados da oficina:', error);
      alert('Erro ao salvar as configurações.');
    } finally {
      setSalvando(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Acesso restrito apenas para Administradores.
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 font-medium">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dados da Oficina</h1>
            <p className="text-xs text-gray-500">Informações que aparecerão no cabeçalho da impressão da OS</p>
          </div>
          <Link href="/" className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-300 transition font-medium">
            ← Voltar
          </Link>
        </div>

        <form onSubmit={handleSalvar} className="space-y-4">
          
          {/* Logo */}
          <div className="border p-4 rounded-lg bg-gray-50 flex flex-col md:flex-row items-center gap-4">
            <div className="w-28 h-28 border rounded-lg bg-white flex items-center justify-center overflow-hidden border-gray-300">
              {dados.logoUrl ? (
                <img src={dados.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400 text-center px-2">Sem Logo</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo da Oficina (PNG/JPG até 1MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadLogo}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {dados.logoUrl && (
                <button
                  type="button"
                  onClick={() => setDados({ ...dados, logoUrl: '' })}
                  className="mt-2 text-xs text-red-600 underline font-medium"
                >
                  Remover Logo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome da Oficina</label>
              <input
                type="text"
                required
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subtítulo / Slogan</label>
              <input
                type="text"
                value={dados.subtitulo}
                onChange={(e) => setDados({ ...dados, subtitulo: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço (Rua e Número)</label>
              <input
                type="text"
                value={dados.endereco}
                onChange={(e) => setDados({ ...dados, endereco: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro / Cidade / UF</label>
              <input
                type="text"
                value={dados.bairroCidadeUf}
                onChange={(e) => setDados({ ...dados, bairroCidadeUf: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone Principal</label>
              <input
                type="text"
                value={dados.telefone1}
                onChange={(e) => setDados({ ...dados, telefone1: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone Secundário / WhatsApp</label>
              <input
                type="text"
                value={dados.telefone2}
                onChange={(e) => setDados({ ...dados, telefone2: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">E-mail de Contato</label>
              <input
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 mt-4"
          >
            {salvando ? 'Salvando Configurações...' : 'Salvar Dados da Oficina'}
          </button>
        </form>
      </div>
    </main>
  );
}