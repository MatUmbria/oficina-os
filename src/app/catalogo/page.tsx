'use client';

import { useState, useEffect, FormEvent } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ItemCatalogo, TipoItem } from '@/types/os';
import Link from 'next/link';

export default function CatalogoPage() {
  const [itens, setItens] = useState<ItemCatalogo[]>([]);
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<TipoItem>('Serviço');
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);

  const carregarCatalogo = async () => {
    try {
      const q = query(collection(db, 'catalogo'), orderBy('descricao', 'asc'));
      const querySnapshot = await getDocs(q);
      const lista: ItemCatalogo[] = [];
      querySnapshot.forEach((docSnap) => {
        lista.push({ id: docSnap.id, ...docSnap.data() } as ItemCatalogo);
      });
      setItens(lista);
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCatalogo();
  }, []);

  const handleCadastrar = async (e: FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setSalvando(true);
    try {
      await addDoc(collection(db, 'catalogo'), {
        descricao: descricao.trim(),
        tipo,
      });

      setDescricao('');
      carregarCatalogo();
    } catch (error) {
      console.error('Erro ao cadastrar item:', error);
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (id: string) => {
    if (confirm('Deseja remover este item do catálogo?')) {
      try {
        await deleteDoc(doc(db, 'catalogo', id));
        carregarCatalogo();
      } catch (error) {
        console.error('Erro ao excluir item:', error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Catálogo de Peças e Serviços</h1>
            <p className="text-sm text-gray-600">Lista de checagem para o mecânico selecionar na OS</p>
          </div>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition text-sm"
          >
            ← Voltar
          </Link>
        </div>

        {/* Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Item no Catálogo</h2>
          <form onSubmit={handleCadastrar} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoItem)}
                className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="Serviço">Serviço</option>
                <option value="Peça">Peça</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Troca de Pastilha de Freio Dianteira"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md bg-white text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={salvando}
              className="md:col-span-4 bg-green-600 text-white font-semibold py-2.5 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 text-sm"
            >
              {salvando ? 'Salvando...' : '+ Cadastrar no Catálogo'}
            </button>
          </form>
        </div>

        {/* Lista do Catálogo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Itens Cadastrados ({itens.length})</h2>
          {carregando ? (
            <p className="text-gray-500 text-center py-4">Carregando catálogo...</p>
          ) : itens.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum item cadastrado no catálogo ainda.</p>
          ) : (
            <div className="space-y-2">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        item.tipo === 'Serviço'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {item.tipo}
                    </span>
                    <span className="font-medium text-gray-900">{item.descricao}</span>
                  </div>
                  {item.id && (
                    <button
                      onClick={() => handleExcluir(item.id!)}
                      className="text-red-500 hover:text-red-700 font-bold px-2 py-1 text-lg"
                      title="Excluir item"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}