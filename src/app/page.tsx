'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { OrdemServico } from '@/types/os';

export default function Home() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [busca, setBusca] = useState<string>('');

  useEffect(() => {
    async function carregarOrdens() {
      try {
        const q = query(collection(db, 'ordens_servico'), orderBy('criadoEm', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const lista: OrdemServico[] = [];
        querySnapshot.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() } as OrdemServico);
        });
        
        setOrdens(lista);
      } catch (error) {
        console.error('Erro ao buscar ordens:', error);
      } finally {
        setCarregando(false);
      }
    }

    carregarOrdens();
  }, []);

  const ordensFiltradas = ordens.filter((os) => {
    const termo = busca.toLowerCase();
    return (
      (os.cliente || '').toLowerCase().includes(termo) ||
      (os.veiculo || '').toLowerCase().includes(termo) ||
      (os.placa || '').toLowerCase().includes(termo)
    );
  });

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Ordens de Serviço</h1>
            <p className="text-sm text-gray-600">Oficina Mecânica</p>
          </div>
          
          <Link
            href="/nova-os"
            className="w-full md:w-auto bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-center shadow-sm"
          >
            + Nova Ordem de Serviço
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <input
            type="text"
            placeholder="Buscar por cliente, veículo ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {carregando ? (
            <div className="p-8 text-center text-gray-600">Carregando Ordens de Serviço...</div>
          ) : ordensFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {busca ? 'Nenhuma OS encontrada para a busca.' : 'Nenhuma Ordem de Serviço cadastrada ainda.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                  <tr>
                    <th className="p-4">Nº OS</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Veículo / Placa</th>
                    <th className="p-4">Data</th>
                    <th className="p-4 text-right">Valor Total</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ordensFiltradas.map((os) => (
                    <tr key={os.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono font-bold text-blue-600">
                        #{os.id?.substring(0, 6).toUpperCase()}
                      </td>
                      <td className="p-4 font-medium">{os.cliente}</td>
                      <td className="p-4 text-gray-600">
                        {os.veiculo} <span className="uppercase text-xs font-mono bg-gray-100 px-2 py-0.5 rounded border">{os.placa}</span>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        {os.criadoEm?.toDate ? new Date(os.criadoEm.toDate()).toLocaleDateString('pt-BR') : 'Recente'}
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900">
                        R$ {Number(os.valorTotal || 0).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/os/${os.id}`}
                          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded border border-gray-300 transition"
                        >
                          👁️ Ver / PDF
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}