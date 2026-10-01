export type TipoItem = 'Serviço' | 'Peça';
export type CargoUsuario = 'admin' | 'mecanico';

export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  cargo: CargoUsuario;
  ativo: boolean;
  criadoEm?: any;
}

export interface ItemCatalogo {
  id?: string;
  tipo: TipoItem;
  descricao: string;
}

export interface ItemOS {
  tipo: TipoItem;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export interface OrdemServico {
  id?: string;
  cliente: string;
  telefone: string;
  veiculo: string;
  placa: string;
  km: number;
  itens: ItemOS[];
  totalServicos: number;
  totalPecas: number;
  valorTotal: number;
  status: 'Aberto' | 'Finalizado' | 'Cancelado';
  criadoPorUid?: string;
  mecanicoResponsavel?: string;
  criadoEm?: any;
}