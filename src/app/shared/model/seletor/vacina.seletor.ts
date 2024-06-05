import { BaseSeletor } from "./base.seletor";


export class VacinaSeletor extends BaseSeletor{
  nomeVacina: string;
	categoria: string;
	idadeMinima: number;
	idadeMaxima: number;
	contraIndicacao: boolean;
	nomeFabricante: string;
	nomeUnidade: string;
	nomeBairro: string;
	numeroCep: string;
}
