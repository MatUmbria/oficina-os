'use client';

import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { OrdemServico, ItemOS } from '@/types/os';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetalhesOS({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [os, setOs] = useState<OrdemServico | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    async function buscarOS() {
      try {
        const docRef = doc(db, 'ordens_servico', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOs({ id: docSnap.id, ...docSnap.data() } as OrdemServico);
        } else {
          console.error('OS não encontrada');
        }
      } catch (error) {
        console.error('Erro ao buscar OS:', error);
      } finally {
        setCarregando(false);
      }
    }

    if (id) buscarOS();
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <p className="text-lg font-medium">Carregando dados da Ordem de Serviço...</p>
      </div>
    );
  }

  if (!os) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 gap-4">
        <p className="text-xl font-bold text-red-600">Ordem de Serviço não encontrada.</p>
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  const servicos = os.itens?.filter((item: ItemOS) => item.tipo === 'Serviço') || [];
  const pecas = os.itens?.filter((item: ItemOS) => item.tipo === 'Peça') || [];

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/"
          className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition"
        >
          ← Voltar
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition flex items-center gap-2"
        >
          🖨️ Imprimir / Salvar PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 print:shadow-none print:border-none print:max-w-full print:p-0">
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">Oficina Mecânica</h1>
            <p className="text-sm text-gray-600">Rua das Oficinas, 123 - Centro</p>
            <p className="text-sm text-gray-600">Tel / WhatsApp: (41) 99999-8888</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-100 text-blue-800 font-bold text-sm px-3 py-1 rounded-full border border-blue-300 print:border-gray-400">
              Nº OS: {os.id?.substring(0, 8).toUpperCase()}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              Data: {os.criadoEm?.toDate ? new Date(os.criadoEm.toDate()).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
          <div>
            <p><strong className="text-gray-700">Cliente:</strong> {os.cliente}</p>
            <p><strong className="text-gray-700">Telefone:</strong> {os.telefone || 'Não informado'}</p>
          </div>
          <div>
            <p><strong className="text-gray-700">Veículo:</strong> {os.veiculo}</p>
            <p><strong className="text-gray-700">Placa:</strong> <span className="uppercase font-mono">{os.placa}</span> | <strong className="text-gray-700">KM:</strong> {os.km} km</p>
          </div>
        </div>

        {servicos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md font-bold text-gray-800 bg-gray-100 p-2 rounded border border-gray-200 mb-2 uppercase text-xs tracking-wider">
              1. Mão de Obra e Serviços
            </h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-center w-20">Qtd</th>
                  <th className="py-2 text-right w-28">Val. Unit.</th>
                  <th className="py-2 text-right w-28">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {servicos.map((item: ItemOS, index: number) => {
                  const subtotal = (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0);
                  return (
                    <tr key={index}>
                      <td className="py-2">{item.descricao}</td>
                      <td className="py-2 text-center">{item.quantidade}</td>
                      <td className="py-2 text-right">R$ {Number(item.valorUnitario).toFixed(2)}</td>
                      <td className="py-2 text-right font-medium">R$ {subtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pecas.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md font-bold text-gray-800 bg-gray-100 p-2 rounded border border-gray-200 mb-2 uppercase text-xs tracking-wider">
              2. Peças e Insumos
            </h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-center w-20">Qtd</th>
                  <th className="py-2 text-right w-28">Val. Unit.</th>
                  <th className="py-2 text-right w-28">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pecas.map((item: ItemOS, index: number) => {
                  const subtotal = (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0);
                  return (
                    <tr key={index}>
                      <td className="py-2">{item.descricao}</td>
                      <td className="py-2 text-center">{item.quantidade}</td>
                      <td className="py-2 text-right">R$ {Number(item.valorUnitario).toFixed(2)}</td>
                      <td className="py-2 text-right font-medium">R$ {subtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mb-8">
          <div className="w-64 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Total Serviços:</span>
              <span>R$ {Number(os.totalServicos || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Peças:</span>
              <span>R$ {Number(os.totalPecas || 0).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total Geral:</span>
              <span className="text-blue-600 print:text-black">R$ {Number(os.valorTotal || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t grid grid-cols-2 gap-8 text-center text-xs text-gray-600">
          <div>
            <div className="border-b border-gray-400 mb-2 w-3/4 mx-auto"></div>
            <p>Assinatura do Cliente</p>
          </div>
          <div>
            <div className="border-b border-gray-400 mb-2 w-3/4 mx-auto"></div>
            <p>Responsável Técnico / Oficina</p>
          </div>
        </div>

      </div>
    </main>
  );
}