export type TipoItem = 'Serviço' | 'Peça';

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
  criadoEm?: any;
}