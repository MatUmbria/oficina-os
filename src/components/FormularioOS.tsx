'use client';

import { FormEvent } from 'react';
import { ItemOS, TipoItem, ItemCatalogo } from '@/types/os';
import Link from 'next/link';
import SeletorFipe from '@/components/SeletorFipe';

interface FormularioOSProps {
  id: string;
  userData: any;
  isAdmin: boolean;
  cliente: string;
  setCliente: (v: string) => void;
  telefone: string;
  setTelefone: (v: string) => void;
  veiculo: string;
  setVeiculo: (v: string) => void;
  ano: string;
  setAno: (v: string) => void;
  placa: string;
  setPlaca: (v: string) => void;
  km: string;
  setKm: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  itens: ItemOS[];
  adicionarItemManual: () => void;
  removerItem: (i: number) => void;
  atualizarItem: (i: number, campo: keyof ItemOS, valor: any) => void;
  toggleItemCatalogo: (item: ItemCatalogo) => void;
  totalServicos: number;
  totalPecas: number;
  valorTotal: number;
  salvando: boolean;
  handleSalvar: (e: FormEvent) => void;
  modalAberto: boolean;
  setModalAberto: (v: boolean) => void;
  catalogoFiltrado: ItemCatalogo[];
  buscaCatalogo: string;
  setBuscaCatalogo: (v: string) => void;
  defeitoRelatado: string;
  setDefeitoRelatado: (v: string) => void;
  obsMecanico: string;
  setObsMecanico: (v: string) => void;
}

export default function FormularioOS({
  id,
  userData,
  isAdmin,
  cliente,
  setCliente,
  telefone,
  setTelefone,
  veiculo,
  setVeiculo,
  ano,
  setAno,
  placa,
  setPlaca,
  km,
  setKm,
  status,
  setStatus,
  itens,
  adicionarItemManual,
  removerItem,
  atualizarItem,
  toggleItemCatalogo,
  totalServicos,
  totalPecas,
  valorTotal,
  salvando,
  handleSalvar,
  modalAberto,
  setModalAberto,
  catalogoFiltrado,
  buscaCatalogo,
  setBuscaCatalogo,
  defeitoRelatado,
  setDefeitoRelatado,
  obsMecanico,
  setObsMecanico,
}: FormularioOSProps) {
  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900 no-print">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ordem de Serviço #{id?.slice(0, 6)}</h1>
            <p className="text-xs text-gray-500">
              Usuário: <strong>{userData?.nome}</strong> ({isAdmin ? 'Administrador' : 'Mecânico'})
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="text-sm bg-gray-800 text-white font-medium px-3 py-1.5 rounded-md hover:bg-gray-900 transition flex items-center gap-1"
            >
              🖨️ Imprimir / PDF
            </button>
            <Link href="/" className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-300 transition font-medium">
              ← Voltar
            </Link>
          </div>
        </div>

        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Dados do Cliente e Veículo */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Dados do Cliente e Veículo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500 outline-none"
                />
              </div>

              {isAdmin && (
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">🔍 Busca Rápida por Modelo FIPE</label>
                  <SeletorFipe onVeiculoSelecionado={(nomeVeiculo) => setVeiculo(nomeVeiculo)} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Veículo / Modelo</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={veiculo}
                  onChange={(e) => setVeiculo(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500 outline-none"
                  placeholder="Ex: CHEVROLET ONIX 1.0 TURBO"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano</label>
                  <input
                    type="number"
                    disabled={!isAdmin}
                    value={ano}
                    onChange={(e) => setAno(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500 outline-none"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Placa</label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500 uppercase outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">KM</label>
                  <input
                    type="number"
                    disabled={!isAdmin}
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 disabled:text-gray-500 outline-none"
                  />
                </div>
              </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Relato do Cliente e Obs. Internas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Solicitação do Cliente / Defeitos Relatados <span className="text-xs text-gray-500">(Impresso)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={defeitoRelatado}
                          onChange={(e) => setDefeitoRelatado(e.target.value)}
                          className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white outline-none text-sm"
                          placeholder="Ex: Barulho ao frear..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Obs. Internas para o Mecânico <span className="text-xs text-red-500 font-semibold">(Oculto na Impressão)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={obsMecanico}
                          onChange={(e) => setObsMecanico(e.target.value)}
                          className="mt-1 w-full p-2 border border-amber-300 bg-amber-50/50 rounded-md outline-none text-sm"
                          placeholder="Ex: Verificar pastilha e disco..."
                        />
                      </div>
                    </div>
                </div>
            </div>
          </div>
          

          {/* Avaliação Técnica */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
              <h2 className="text-lg font-semibold text-gray-800">2. Avaliação Técnica (Serviços e Peças)</h2>
              
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setModalAberto(true)}
                  className="text-sm bg-blue-600 text-white font-medium px-3 py-1.5 rounded-md hover:bg-blue-700 transition flex items-center gap-1"
                >
                  📋 Checkbox do Catálogo
                </button>
                <button
                  type="button"
                  onClick={adicionarItemManual}
                  className="text-sm bg-green-600 text-white font-medium px-3 py-1.5 rounded-md hover:bg-green-700 transition"
                >
                  + Item Avulso
                </button>
              </div>
            </div>

            {itens.length === 0 ? (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                Nenhum item adicionado. Clique em <strong>📋 Checkbox do Catálogo</strong> para selecionar os itens.
              </div>
            ) : (
              <div className="space-y-3">
                {itens.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-2 items-end bg-gray-50 p-3 rounded-md border border-gray-200">
                    
                    <div className="w-full md:w-32">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Tipo</label>
                      <select
                        value={item.tipo}
                        onChange={(e) => atualizarItem(index, 'tipo', e.target.value as TipoItem)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white font-medium outline-none"
                      >
                        <option value="Serviço">Serviço</option>
                        <option value="Peça">Peça</option>
                      </select>
                    </div>

                    <div className="w-full md:flex-1">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={item.descricao}
                        onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white outline-none"
                      />
                    </div>

                    <div className="w-full md:w-24">
                      <label className="block text-[11px] font-medium text-gray-500 mb-1 md:text-center">Qtd</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white md:text-center outline-none"
                      />
                    </div>

                    {isAdmin && (
                      <div className="w-full md:w-32">
                        <label className="block text-[11px] font-medium text-gray-500 mb-1 md:text-right">R$ Unit.</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => atualizarItem(index, 'valorUnitario', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white md:text-right outline-none"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removerItem(index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 text-xl font-bold rounded hover:bg-red-50 transition mb-0.5"
                      title="Remover Item"
                    >
                      ×
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totais (Apenas ADM) */}
          {isAdmin && (
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
          )}

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>

      {/* Modal de Checklist */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Checklist de Peças e Serviços</h3>
                <p className="text-xs text-gray-500">Marque os itens necessários para este veículo</p>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Buscar serviço ou peça..."
              value={buscaCatalogo}
              onChange={(e) => setBuscaCatalogo(e.target.value)}
              className="w-full p-2.5 mb-4 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {catalogoFiltrado.length === 0 ? (
                <p className="text-gray-500 text-center py-6 text-sm">
                  Nenhum item encontrado no catálogo.
                </p>
              ) : (
                catalogoFiltrado.map((item) => {
                  const estaSelecionado = itens.some((i) => i.descricao === item.descricao);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                        estaSelecionado ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={estaSelecionado}
                          onChange={() => toggleItemCatalogo(item)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold ${
                            item.tipo === 'Serviço' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {item.tipo}
                        </span>
                        <span className="font-medium text-gray-900 text-sm">{item.descricao}</span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Concluído ({itens.length} {itens.length === 1 ? 'item' : 'itens'} selecionados)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}