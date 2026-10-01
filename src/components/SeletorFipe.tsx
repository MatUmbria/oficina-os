'use client';

import { useState, useEffect } from 'react';

interface ItemFipe {
  codigo: string | number;
  nome: string;
}

interface SeletorFipeProps {
  onVeiculoSelecionado: (nomeVeiculo: string, anoVeiculo: string) => void;
}

export default function SeletorFipe({ onVeiculoSelecionado }: SeletorFipeProps) {
  const [marcas, setMarcas] = useState<ItemFipe[]>([]);
  const [modelos, setModelos] = useState<ItemFipe[]>([]);
  const [anos, setAnos] = useState<ItemFipe[]>([]);

  const [marcaSel, setMarcaSel] = useState('');
  const [modeloSel, setModeloSel] = useState('');
  const [anoSel, setAnoSel] = useState('');

  const [loadingMarcas, setLoadingMarcas] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loadingAnos, setLoadingAnos] = useState(false);

  useEffect(() => {
    async function carregarMarcas() {
      setLoadingMarcas(true);
      try {
        const res = await fetch('/api/fipe?tipo=marcas');
        if (res.ok) setMarcas(await res.json());
      } catch (err) {
        console.error('Erro ao carregar marcas:', err);
      } finally {
        setLoadingMarcas(false);
      }
    }
    carregarMarcas();
  }, []);

  const handleMarcaChange = async (marcaId: string) => {
    setMarcaSel(marcaId);
    setModelos([]);
    setAnos([]);
    setModeloSel('');
    setAnoSel('');

    if (!marcaId) return;

    setLoadingModelos(true);
    try {
      const res = await fetch(`/api/fipe?tipo=modelos&marcaId=${marcaId}`);
      if (res.ok) setModelos(await res.json());
    } catch (err) {
      console.error('Erro ao carregar modelos:', err);
    } finally {
      setLoadingModelos(false);
    }
  };

  const handleModeloChange = async (modeloId: string) => {
    setModeloSel(modeloId);
    setAnos([]);
    setAnoSel('');

    if (!modeloId) return;

    // Atualiza nome do veículo imediatamente com Marca + Modelo
    const marcaObj = marcas.find((m) => String(m.codigo) === marcaSel);
    const modeloObj = modelos.find((m) => String(m.codigo) === modeloId);
    if (marcaObj && modeloObj) {
      onVeiculoSelecionado(`${marcaObj.nome} ${modeloObj.nome}`, anoSel);
    }

    setLoadingAnos(true);
    try {
      const res = await fetch(`/api/fipe?tipo=anos&marcaId=${marcaSel}&modeloId=${modeloId}`);
      if (res.ok) setAnos(await res.json());
    } catch (err) {
      console.error('Erro ao carregar anos:', err);
    } finally {
      setLoadingAnos(false);
    }
  };

  const handleAnoChange = (anoCodigo: string) => {
    setAnoSel(anoCodigo);

    const marcaObj = marcas.find((m) => String(m.codigo) === marcaSel);
    const modeloObj = modelos.find((m) => String(m.codigo) === modeloSel);
    const anoObj = anos.find((a) => String(a.codigo) === anoCodigo);

    if (marcaObj && modeloObj) {
      const nomeCompleto = `${marcaObj.nome} ${modeloObj.nome}`;
      const anoTexto = anoObj ? anoObj.nome.split(' ')[0] : ''; // Extrai apenas o ano (ex: "2021 Gasolina" -> "2021")
      onVeiculoSelecionado(nomeCompleto, anoTexto);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
      <div>
        <label className="block font-medium text-gray-700 mb-1">Marca (FIPE)</label>
        <select
          value={marcaSel}
          onChange={(e) => handleMarcaChange(e.target.value)}
          disabled={loadingMarcas}
          className="w-full p-2 border border-gray-300 rounded-md bg-white outline-none"
        >
          <option value="">{loadingMarcas ? 'Carregando...' : 'Selecione a marca'}</option>
          {marcas.map((m) => (
            <option key={m.codigo} value={m.codigo}>{m.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">Modelo (FIPE)</label>
        <select
          value={modeloSel}
          onChange={(e) => handleModeloChange(e.target.value)}
          disabled={!marcaSel || loadingModelos}
          className="w-full p-2 border border-gray-300 rounded-md bg-white outline-none disabled:bg-gray-100"
        >
          <option value="">{loadingModelos ? 'Carregando...' : 'Selecione o modelo'}</option>
          {modelos.map((mod) => (
            <option key={mod.codigo} value={mod.codigo}>{mod.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">Ano (FIPE)</label>
        <select
          value={anoSel}
          onChange={(e) => handleAnoChange(e.target.value)}
          disabled={!modeloSel || loadingAnos}
          className="w-full p-2 border border-gray-300 rounded-md bg-white outline-none disabled:bg-gray-100"
        >
          <option value="">{loadingAnos ? 'Carregando...' : 'Selecione o ano'}</option>
          {anos.map((a) => (
            <option key={a.codigo} value={a.codigo}>{a.nome}</option>
          ))}
        </select>
      </div>
    </div>
  );
}