import { Contato } from "./contato";
import { Endereco } from "./endereco";

export class Pessoa{
  id: number;
	enderecoDaPessoa: Endereco;
	contatoDaPessoa: Contato;
	nome: string;
	dataNascimento: Date;
	sexo: string;
	cpf: string;
	login: string;
	senha: string;
	tipo: number;
	doencaPreexistente: boolean;
}


