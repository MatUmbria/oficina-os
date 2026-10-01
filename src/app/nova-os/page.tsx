'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import RotaProtegida from '@/components/RotaProtegida';
import SeletorFipe from '@/components/SeletorFipe';
import Link from 'next/link';

export default function NovaOSPage() {
  return (
    <RotaProtegida>
      <ConteudoNovaOS />
    </RotaProtegida>
  );
}

function ConteudoNovaOS() {
  const router = useRouter();
  const { userData } = useAuth();

  // Dados da OS
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [ano, setAno] = useState('');
  const [placa, setPlaca] = useState('');
  const [km, setKm] = useState('');
  const [defeitoRelatado, setDefeitoRelatado] = useState('');
  const [obsMecanico, setObsMecanico] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleCriarOS = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const docRef = await addDoc(collection(db, 'ordens_servico'), {
        cliente,
        telefone,
        veiculo,
        ano,
        placa: placa.toUpperCase(),
        km: Number(km) || 0,
        defeitoRelatado,
        obsMecanico,
        status: 'Aberto',
        criadoEm: serverTimestamp(),
        criadoPor: userData?.nome || 'Anônimo',
        itens: [],
        totalServicos: 0,
        totalPecas: 0,
        valorTotal: 0,
      });

      router.push(`/os/${docRef.id}`);
    } catch (error) {
      console.error('Erro ao criar OS:', error);
      alert('Erro ao criar Ordem de Serviço.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Abrir Nova Ordem de Serviço</h1>
            <p className="text-xs text-gray-500">Cadastre o cliente e o veículo para iniciar a avaliação</p>
          </div>
          <Link
            href="/"
            className="text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-300 transition font-medium"
          >
            ← Voltar
          </Link>
        </div>

        <form onSubmit={handleCriarOS} className="space-y-5">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800 border-b pb-1">1. Dados do Cliente</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
              <input
                type="text"
                required
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="(41) 99999-9999"
              />
            </div>
          </div>

          {/* Dados do Veículo */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-semibold text-gray-800 border-b pb-1">2. Dados do Veículo</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                🔍 Seleção Rápida no Catálogo FIPE
              </label>
              <SeletorFipe
                onVeiculoSelecionado={(nomeVeiculo, anoVeiculo) => {
                setVeiculo(nomeVeiculo);
                if (anoVeiculo) setAno(anoVeiculo);
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Veículo / Modelo</label>
              <input
                type="text"
                required
                value={veiculo}
                onChange={(e) => setVeiculo(e.target.value)}
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                placeholder="Ex: CHEVROLET ONIX 1.0 TURBO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ano</label>
              <input
                type="text"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none bg-white text-center font-medium"
                placeholder="Ex: 2021"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Placa</label>
                <input
                  type="text"
                  required
                  maxLength={7}
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white uppercase font-bold text-center tracking-wider"
                  placeholder="ABC1D23"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">KM Atual</label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="85000"
                />
              </div>
            </div>
          </div>

          {/* Defeitos Relatados e Observações Internas */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-semibold text-gray-800 border-b pb-1">3. Relato e Observações</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Solicitação do Cliente / Defeitos Relatados <span className="text-xs text-gray-500">(Sai no impresso)</span>
              </label>
              <textarea
                rows={3}
                value={defeitoRelatado}
                onChange={(e) => setDefeitoRelatado(e.target.value)}
                className="mt-1 w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                placeholder="Ex: Barulho na suspensão dianteira ao passar em lombadas, luz da injeção acesa..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações Internas para o Mecânico <span className="text-xs text-red-500 font-semibold">(NÃO sai na impressão)</span>
              </label>
              <textarea
                rows={3}
                value={obsMecanico}
                onChange={(e) => setObsMecanico(e.target.value)}
                className="mt-1 w-full p-2.5 border border-amber-300 bg-amber-50/50 rounded-md outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                placeholder="Ex: Verificar também pivô esquerdo, cliente tem pressa para o fim da tarde..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 mt-4 text-base shadow-sm"
          >
            {salvando ? 'Abrindo OS...' : 'Criar Ordem de Serviço'}
          </button>
        </form>
      </div>
    </main>
  );
}