import { BaseSeletor } from "./base.seletor";

export class EstoqueSeletor extends BaseSeletor{
  cidade: string; //
	unidade: string; //
  vacina: string; //
	fabricante: string; // 
  temEstoque: Boolean;
  temOrdenacaoPorUnidade: Boolean;
  temOrdenacaoPorCidade: Boolean;
  temOrdenacaoPorVacina: Boolean;
  temOrdenacaoPorFabricante: Boolean;
}
