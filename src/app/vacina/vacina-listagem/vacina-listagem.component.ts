import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacinaSeletor } from '../../shared/model/seletor/vacina.seletor';
import { VacinaDTO } from '../../shared/model/dto/vacina.DTO';
import Swal from 'sweetalert2';
import { EstoqueService } from '../../shared/service/estoque.service';
import { Vacina } from '../../shared/model/vacina';
import { VacinaService } from '../../shared/service/vacina.service';
import { FabricanteService } from '../../shared/service/fabricante.service';
import { Fabricante } from '../../shared/model/fabricante';
import { UnidadeService } from '../../shared/service/unidade.service';
import { Unidade } from '../../shared/model/unidade';

@Component({
  selector: 'app-vacina-listagem',
  templateUrl: './vacina-listagem.component.html',
  styleUrl: './vacina-listagem.component.scss'
})
export class VacinaListagemComponent implements OnInit{

    public vacinaSeletor: VacinaSeletor = new VacinaSeletor();
    public listaVacinasDTO : Array<VacinaDTO> = new Array();
    public listaDeVacinas : Array<Vacina> = new Array();
    public listaDeCategorias : Array<string> = new Array();
    public listaDeFabricantes : Array<Fabricante> = new Array();
    public listaDeUnidades : Array<Unidade> = new Array();
    public mostrarTabela: boolean = true;

    constructor(
      private estoqueService : EstoqueService,
      private vacinaService : VacinaService,
      private fabricanteService : FabricanteService,
      private unidadeService : UnidadeService,
      private router: Router
    ){
    }

  ngOnInit(): void {
    this.mostrarTabela = false;
    this.vacinaSeletor.pagina = 1;
    this.consultarTodasVacinas();
    this.consultarTodasCategorias();
    this.consultarTodosFabricantes();
    this.consultarTodasUnidades();
    this.pesquisarComFiltros();
  }


  private consultarTodasVacinas(): void{
    this.vacinaService.consultarTodas().subscribe(
      (resultado => this.listaDeVacinas = resultado),
      (erro => Swal.fire('Erro ao consultar a lista de vacinas para preencher o combo box','','error'))
    );
  }

  private consultarTodasCategorias(): void{
    this.vacinaService.consultarTodasCategorias().subscribe(
      (resultado) => {
        this.listaDeCategorias = resultado;
        this.listaDeCategorias.sort();
      },
      (erro => Swal.fire('Erro ao consultar a lista de categorias para preencher o combo box','','error'))
    );
  }

  private consultarTodosFabricantes(): void{
    this.fabricanteService.consultarTodos().subscribe(
      (resultado => this.listaDeFabricantes = resultado),
      (erro => Swal.fire('Erro ao consultar a lista de fabricantes para preencher o combo box','','error'))
    );
  }

  private consultarTodasUnidades(): void{
    this.unidadeService.consultarTodas().subscribe(
      (resultado => this.listaDeUnidades = resultado),
      (erro => Swal.fire('Erro ao consultar a lista de unidades para preencher o combo box','','error'))
    );
  }

  public pesquisarSemFiltros(): void {
    this.vacinaSeletor = new VacinaSeletor();
    this.pesquisarComFiltros();
    this.mostrarTabela = true;
  }

  public pesquisarComFiltros(): void {
    this.estoqueService.consultarComFiltros(this.vacinaSeletor).subscribe(
      (resultado => this.listaVacinasDTO = resultado),
      (erro => Swal.fire('Erro ao consultar a lista de vacinas com o(s) filtro(s) selecionado(s). ','','error'))
    );
    this.mostrarTabela = true;
  }
/*
  public pesquisarComFiltros(): void{
    this.estoqueService.consultarComFiltros(this.vacinaSeletor).subscribe(
      (resultado) => {
        if(resultado.length > 0){
          this.listaVacinasDTO = resultado;
        } else{
          this.vacinaSeletor.pagina--;
          Swal.fire('Não há mais registros de vacinas a serem exibidas com o seletor.');
        }
      },
      (erro) => {
        Swal.fire('Erro ao consultar a lista de vacinas com o(s) filtro(s) selecionado(s). ','','error');
      }
    );
  }
*/

  public voltar(): void {
    this.router.navigate(['/vacina']);
  }

  public limpar(): void {
    this.vacinaSeletor = new VacinaSeletor();
    this.listaVacinasDTO = new Array();
    this.mostrarTabela = false;
  }

  public anterior(): void{
    this.vacinaSeletor.pagina--;
    if(this.vacinaSeletor.pagina < 1){
      this.vacinaSeletor.pagina = 1;
      this.pesquisarComFiltros();
      this.mostrarTabela = true;
    } else{
      this.pesquisarComFiltros();
      this.mostrarTabela = true;
    }
  }

  public posterior(): void{

    this.vacinaSeletor.pagina++;
    this.pesquisarComFiltros();
    if(this.pesquisarComFiltros()){
      this.mostrarTabela = true;
    } else{
      this.voltar();
    }
  }

  atualizarQtdeRegistrosPorPagina() {
    this.pesquisarComFiltros();
    this.mostrarTabela = true;
  }

}
