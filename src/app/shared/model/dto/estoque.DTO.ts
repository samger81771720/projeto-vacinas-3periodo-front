import { Endereco } from "../endereco";
import { Estoque } from "../estoque";
import { Fabricante } from "../fabricante";
import { Unidade } from "../unidade";
import { Vacina } from "../vacina";

export class EstoqueDTO {
  unidade: Unidade;
  endereco: Endereco;
  vacina: Vacina;
  fabricante: Fabricante;
  estoque: Estoque;
}
