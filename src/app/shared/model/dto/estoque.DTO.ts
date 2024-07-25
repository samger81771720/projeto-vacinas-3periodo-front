import { UnidadeService } from "../../service/unidade.service";
import { Endereco } from "../endereco";
import { Estoque } from "../estoque";
import { Fabricante } from "../fabricante";
import { Vacina } from "../vacina";

export class EstoqueDTO {
  unidade: UnidadeService;
  endereco: Endereco;
  vacina: Vacina;
  fabricante: Fabricante;
  estoque: Estoque;
}
