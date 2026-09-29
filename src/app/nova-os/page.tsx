'use client';

import { useState, FormEvent } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { ItemOS, TipoItem } from '@/types/os';

export default function NovaOS() {
  const router = useRouter();
  const [salvando, setSalvando] = useState<boolean>(false);

  // Dados do Cliente e Veículo
  const [cliente, setCliente] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [veiculo, setVeiculo] = useState<string>('');
  const [placa, setPlaca] = useState<string>('');
  const [km, setKm] = useState<string>('');

  // Lista dinâmica de Itens
  const [itens, setItens] = useState<ItemOS[]>([
    { tipo: 'Serviço', descricao: '', quantidade: 1, valorUnitario: 0 }
  ]);

  const adicionarItem = () => {
    setItens([...itens, { tipo: 'Serviço', descricao: '', quantidade: 1, valorUnitario: 0 }]);
  };

  const removerItem = (index: number) => {
    const novosItens = itens.filter((_, i) => i !== index);
    setItens(novosItens);
  };

  const atualizarItem = (index: number, campo: keyof ItemOS, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = {
      ...novosItens[index],
      [campo]: valor
    };
    setItens(novosItens);
  };

  // Cálculos
  const totalServicos = itens
    .filter((item) => item.tipo === 'Serviço')
    .reduce((acc, item) => acc + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0), 0);

  const totalPecas = itens
    .filter((item) => item.tipo === 'Peça')
    .reduce((acc, item) => acc + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0), 0);

  const valorTotal = totalServicos + totalPecas;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (itens.length === 0) {
      alert('Adicione pelo menos um item à Ordem de Serviço.');
      return;
    }

    setSalvando(true);

    try {
      const docRef = await addDoc(collection(db, 'ordens_servico'), {
        cliente,
        telefone,
        veiculo,
        placa: placa.toUpperCase(),
        km: Number(km) || 0,
        itens,
        totalServicos,
        totalPecas,
        valorTotal,
        status: 'Aberto',
        criadoEm: serverTimestamp()
      });

      alert('Ordem de Serviço salva com sucesso!');
      router.push(`/os/${docRef.id}`);
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error);
      alert('Ocorreu um erro ao salvar a OS.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
          Nova Ordem de Serviço
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Dados do Cliente e Veículo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="(00) 90000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Veículo / Modelo</label>
                <input
                  type="text"
                  required
                  value={veiculo}
                  onChange={(e) => setVeiculo(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Honda Civic 2.0"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    required
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="ABC-1D23"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">KM Atual</label>
                  <input
                    type="number"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="85000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">2. Itens da OS (Serviços e Peças)</h2>
              <button
                type="button"
                onClick={adicionarItem}
                className="text-sm bg-green-600 text-white font-medium px-3 py-1.5 rounded-md hover:bg-green-700 transition"
              >
                + Adicionar Item
              </button>
            </div>

            <div className="space-y-3">
              {itens.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-2 items-center bg-gray-50 p-3 rounded-md border border-gray-200">
                  <select
                    value={item.tipo}
                    onChange={(e) => atualizarItem(index, 'tipo', e.target.value as TipoItem)}
                    className="w-full md:w-32 p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white font-medium outline-none"
                  >
                    <option value="Serviço">Serviço</option>
                    <option value="Peça">Peça</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Descrição do serviço ou peça"
                    required
                    value={item.descricao}
                    onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                    className="w-full md:flex-1 p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white outline-none"
                  />

                  <div className="flex gap-2 w-full md:w-auto">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      required
                      value={item.quantidade}
                      onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                      className="w-20 p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white text-center outline-none"
                    />

                    <input
                      type="number"
                      step="0.01"
                      placeholder="R$ Unit."
                      required
                      value={item.valorUnitario}
                      onChange={(e) => atualizarItem(index, 'valorUnitario', Number(e.target.value))}
                      className="w-28 p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white text-right outline-none"
                    />

                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        className="text-red-500 hover:text-red-700 px-2 text-xl font-bold"
                        title="Remover Item"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Total em Mão de Obra / Serviços:</span>
              <span className="font-semibold text-gray-900">R$ {totalServicos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Total em Peças / Insumos:</span>
              <span className="font-semibold text-gray-900">R$ {totalPecas.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-xl font-bold text-gray-900">
              <span>Valor Total da OS:</span>
              <span className="text-blue-600">R$ {valorTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {salvando ? 'Salvando no Firebase...' : 'Salvar Ordem de Serviço'}
          </button>
        </form>
      </div>
    </main>
  );
}