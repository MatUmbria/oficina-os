'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import RotaProtegida from '@/components/RotaProtegida';
import { ItemOS, TipoItem, ItemCatalogo } from '@/types/os';
import { DadosOficina } from '@/types/oficina';
import FormularioOS from '@/components/FormularioOS';
import ImpressaoOS from '@/components/ImpressaoOS';

export default function DetalhesOSPage() {
  return (
    <RotaProtegida>
      <ConteudoOS />
    </RotaProtegida>
  );
}

function ConteudoOS() {
  const { id } = useParams();
  const router = useRouter();
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  

  // Dados da Oficina
  const [dadosOficina, setDadosOficina] = useState<DadosOficina | null>(null);

  // Dados da OS
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [status, setStatus] = useState('Aberto');
  const [criadoEm, setCriadoEm] = useState('');
  const [itens, setItens] = useState<ItemOS[]>([]);
  const [defeitoRelatado, setDefeitoRelatado] = useState('');
  const [obsMecanico, setObsMecanico] = useState('');

  // Modal do Catálogo
  const [modalAberto, setModalAberto] = useState(false);
  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>([]);
  const [buscaCatalogo, setBuscaCatalogo] = useState('');

  // Carrega OS e Configurações da Oficina
  useEffect(() => {
    async function carregarDados() {
      if (!id) return;
      try {
        // Carrega OS
        const docRefOS = doc(db, 'ordens_servico', id as string);
        const snapOS = await getDoc(docRefOS);

        if (snapOS.exists()) {
          const dados = snapOS.data();
          setCliente(dados.cliente || '');
          setTelefone(dados.telefone || '');
          setVeiculo(dados.veiculo || '');
          setAno(dados.ano || '');
          setPlaca(dados.placa || '');
          setKm(dados.km || '');
          setStatus(dados.status || 'Aberto');
          setItens(dados.itens || []);
          setDefeitoRelatado(dados.defeitoRelatado || '');
          setObsMecanico(dados.obsMecanico || '');

          if (dados.criadoEm) {
            const dataObj = dados.criadoEm.toDate ? dados.criadoEm.toDate() : new Date(dados.criadoEm);
            setCriadoEm(dataObj.toLocaleDateString('pt-BR'));
          } else {
            setCriadoEm(new Date().toLocaleDateString('pt-BR'));
          }
        } else {
          alert('Ordem de Serviço não encontrada.');
          router.push('/');
        }

        // Carrega dados da Oficina
        const docRefOficina = doc(db, 'configuracoes', 'oficina');
        const snapOficina = await getDoc(docRefOficina);
        if (snapOficina.exists()) {
          setDadosOficina(snapOficina.data() as DadosOficina);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [id, router]);

  // Carrega Catálogo
  useEffect(() => {
    async function carregarCatalogo() {
      try {
        const q = query(collection(db, 'catalogo'), orderBy('descricao', 'asc'));
        const querySnapshot = await getDocs(q);
        const lista: ItemCatalogo[] = [];
        querySnapshot.forEach((docSnap) => {
          lista.push({ id: docSnap.id, ...docSnap.data() } as ItemCatalogo);
        });
        setCatalogo(lista);
      } catch (error) {
        console.error('Erro ao carregar catálogo:', error);
      }
    }
    carregarCatalogo();
  }, []);

  const adicionarItemManual = () => {
    setItens([...itens, { tipo: 'Serviço', descricao: '', quantidade: 1, valorUnitario: 0 }]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: keyof ItemOS, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    setItens(novosItens);
  };

  const toggleItemCatalogo = (itemCat: ItemCatalogo) => {
    const jaExiste = itens.some((i) => i.descricao === itemCat.descricao);
    if (jaExiste) {
      setItens(itens.filter((i) => i.descricao !== itemCat.descricao));
    } else {
      setItens([
        ...itens,
        {
          tipo: itemCat.tipo,
          descricao: itemCat.descricao,
          quantidade: 1,
          valorUnitario: 0,
        },
      ]);
    }
  };

  const totalServicos = itens
    .filter((item) => item.tipo === 'Serviço')
    .reduce((acc, item) => acc + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0), 0);

  const totalPecas = itens
    .filter((item) => item.tipo === 'Peça')
    .reduce((acc, item) => acc + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0), 0);

  const valorTotal = totalServicos + totalPecas;

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const docRef = doc(db, 'ordens_servico', id as string);

      const dadosAtualizados = isAdmin
        ? {
            cliente,
            telefone,
            veiculo,
            ano,
            placa: placa.toUpperCase(),
            km: Number(km) || 0,
            status,
            itens,
            totalServicos,
            totalPecas,
            valorTotal,
          }
        : {
            defeitoRelatado,
            obsMecanico,
            itens,
            totalServicos,
            totalPecas,
            valorTotal,
          };

      await updateDoc(docRef, dadosAtualizados);
      alert('Ordem de Serviço atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar OS:', error);
      alert('Erro ao salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  const catalogoFiltrado = catalogo.filter((i) =>
    i.descricao.toLowerCase().includes(buscaCatalogo.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 font-medium">Carregando dados da OS...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-family: 'Courier New', Courier, monospace, sans-serif !important;
            font-size: 12px !important;
          }
          nav, .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>

      {/* Componente de Impressão */}
      <ImpressaoOS
        id={id as string}
        criadoEm={criadoEm}
        cliente={cliente}
        telefone={telefone}
        veiculo={veiculo}
        ano={ano}
        placa={placa}
        km={km}
        status={status}
        itens={itens}
        dadosOficina={dadosOficina}
      />

      {/* Componente do Formulário Web */}
      <FormularioOS
        id={id as string}
        userData={userData}
        isAdmin={isAdmin}
        cliente={cliente}
        setCliente={setCliente}
        telefone={telefone}
        setTelefone={setTelefone}
        veiculo={veiculo}
        setVeiculo={setVeiculo}
        ano={ano}
        setAno={setAno}
        placa={placa}
        setPlaca={setPlaca}
        km={km}
        setKm={setKm}
        status={status}
        setStatus={setStatus}
        itens={itens}
        adicionarItemManual={adicionarItemManual}
        removerItem={removerItem}
        atualizarItem={atualizarItem}
        toggleItemCatalogo={toggleItemCatalogo}
        totalServicos={totalServicos}
        totalPecas={totalPecas}
        valorTotal={valorTotal}
        salvando={salvando}
        handleSalvar={handleSalvar}
        modalAberto={modalAberto}
        setModalAberto={setModalAberto}
        catalogoFiltrado={catalogoFiltrado}
        buscaCatalogo={buscaCatalogo}
        setBuscaCatalogo={setBuscaCatalogo}
        defeitoRelatado={defeitoRelatado}
        setDefeitoRelatado={setDefeitoRelatado}
        obsMecanico={obsMecanico}
        setObsMecanico={setObsMecanico}
      />
    </>
  );
}