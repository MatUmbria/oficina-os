'use client';

import { ItemOS } from '@/types/os';
import { DadosOficina } from '@/types/oficina';

interface ImpressaoOSProps {
  id: string;
  criadoEm: string;
  cliente: string;
  telefone: string;
  veiculo: string;
  ano: string;
  placa: string;
  km: string;
  status: string;
  itens: ItemOS[];
  dadosOficina: DadosOficina | null;
}

export default function ImpressaoOS({
  id,
  criadoEm,
  cliente,
  telefone,
  veiculo,
  ano,
  placa,
  km,
  status,
  itens,
  dadosOficina,
}: ImpressaoOSProps) {
  const pecas = itens.filter((i) => i.tipo === 'Peça');
  const servicos = itens.filter((i) => i.tipo === 'Serviço');

  const totalServicos = servicos.reduce((acc, i) => acc + (Number(i.quantidade) || 0) * (Number(i.valorUnitario) || 0), 0);
  const totalPecas = pecas.reduce((acc, i) => acc + (Number(i.quantidade) || 0) * (Number(i.valorUnitario) || 0), 0);
  const valorTotal = totalServicos + totalPecas;

  return (
    <div className="print-only p-4 max-w-4xl mx-auto border-2 border-black text-black">
      {/* Cabeçalho com Logo e Dados Dinâmicos */}
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
        <div className="flex items-center gap-4">
          {dadosOficina?.logoUrl ? (
            <img src={dadosOficina.logoUrl} alt="Logo" className="w-20 h-20 object-contain" />
          ) : (
            <div className="text-3xl font-black">🛠️</div>
          )}
          <div>
            <h1 className="text-xl font-bold uppercase">{dadosOficina?.nome || 'OFICINA MECÂNICA'}</h1>
            <p className="text-xs uppercase">{dadosOficina?.subtitulo || ''}</p>
            <p className="text-xs">{dadosOficina?.endereco} {dadosOficina?.bairroCidadeUf && `- ${dadosOficina.bairroCidadeUf}`}</p>
            <p className="text-xs">{dadosOficina?.email}</p>
          </div>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold text-sm">{dadosOficina?.telefone1}</p>
          <p className="font-bold text-sm">{dadosOficina?.telefone2}</p>
        </div>
      </div>

      {/* Título da OS */}
      <div className="flex justify-between items-center border-b border-black pb-1 mb-2 font-bold text-sm">
        <span>ORDEM DE SERVIÇO Nº {id?.slice(0, 6).toUpperCase()}</span>
        <span>Data: {criadoEm || new Date().toLocaleDateString('pt-BR')}</span>
      </div>

      {/* Dados do Cliente e Veículo */}
      <div className="text-xs space-y-1 border-b border-black pb-2 mb-2">
        <div className="flex justify-between">
          <span><strong>Cliente:</strong> {cliente || '----------------------'}</span>
          <span><strong>Contato:</strong> {telefone || '----------------------'}</span>
        </div>
        <div className="flex justify-between border-b border-black pb-1 mb-2 text-xs">
          <span><strong>PLACA DO VEÍCULO:</strong> {placa || '-------'}</span>
          <span><strong>VEÍCULO:</strong> {veiculo || '----------------------'}</span>
          <span><strong>ANO:</strong> {ano || '----'}</span>
          <span><strong>KM ATUAL:</strong> {km || '-----'}</span>
        </div>
      </div>

      {/* Tabela de Itens */}
      <table className="w-full text-xs text-left mb-2 border-collapse">
        <thead>
          <tr className="border-b-2 border-black uppercase">
            <th className="py-1">Descrição do Item</th>
            <th className="py-1 text-center w-12">Unil</th>
            <th className="py-1 text-right w-20">Valor</th>
            <th className="py-1 text-center w-16">Quantia</th>
            <th className="py-1 text-right w-24">Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Peças */}
          {pecas.length > 0 && (
            <>
              {pecas.map((item, idx) => (
                <tr key={`p-${idx}`} className="border-b border-gray-300">
                  <td className="py-1 uppercase">{item.descricao}</td>
                  <td className="py-1 text-center">UNI</td>
                  <td className="py-1 text-right">{item.valorUnitario?.toFixed(2)}</td>
                  <td className="py-1 text-center">{item.quantidade}</td>
                  <td className="py-1 text-right">{(item.quantidade * item.valorUnitario)?.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={4} className="text-right py-1">Total das Peças R$</td>
                <td className="text-right py-1">{totalPecas.toFixed(2)}</td>
              </tr>
            </>
          )}

          {/* Serviços */}
          {servicos.length > 0 && (
            <>
              {servicos.map((item, idx) => (
                <tr key={`s-${idx}`} className="border-b border-gray-300">
                  <td className="py-1 uppercase">{item.descricao}</td>
                  <td className="py-1 text-center">UNI</td>
                  <td className="py-1 text-right">{item.valorUnitario?.toFixed(2)}</td>
                  <td className="py-1 text-center">{item.quantidade}</td>
                  <td className="py-1 text-right">{(item.quantidade * item.valorUnitario)?.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={4} className="text-right py-1">Total dos Serviços R$</td>
                <td className="text-right py-1">{totalServicos.toFixed(2)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Resumo Financeiro */}
      <div className="border-t-2 border-black pt-2 mt-4 flex justify-between items-end text-xs">
        <div>
          <p><strong>Situação Atual:</strong> {status}</p>
          <p className="mt-2 font-bold uppercase">Obrigado pela preferência!</p>
        </div>

        <div className="text-right space-y-0.5 text-xs">
          <p>VALOR PRODUTOS R$: {totalPecas.toFixed(2)}</p>
          <p>VALOR SERVICOS R$: {totalServicos.toFixed(2)}</p>
          <p className="font-bold text-sm border-t border-black pt-0.5 mt-0.5">
            VALOR TOTAL R$: {valorTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Assinatura */}
      <div className="mt-12 flex justify-end">
        <div className="w-64 text-center border-t border-black pt-1 text-xs">
          Visto / Assinatura do Cliente
        </div>
      </div>
    </div>
  );
}