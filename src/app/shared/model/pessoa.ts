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

  constructor() {
    // comentário 1
    this.enderecoDaPessoa = new Endereco();
    this.contatoDaPessoa = new Contato();
  }
}
/*
    "comentário 1"

    ex.:  [(ngModel)]="pessoa.enderecoDaPessoa.bairro" ou
          [(ngModel)]="pessoa.contatoDaPessoa.telefone"

    "Dentro do corpo do método construtor da classe para que os objetos Endereco e
    Contato possam ser lidos quando o objeto Pessoa for instanciado, ou seja,
    inicializar os objetos Endereco e Contato quando o objeto Pessoa for inicializado."

    */

