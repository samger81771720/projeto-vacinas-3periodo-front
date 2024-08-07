
import { Component, OnInit } from '@angular/core';
import { Estoque } from '../../shared/model/estoque';
import { EstoqueService } from '../../shared/service/estoque.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Pessoa } from '../../shared/model/pessoa';
import { EstoqueSeletor } from '../../shared/model/seletor/estoque.seletor';
import { Vacina } from '../../shared/model/vacina';
import { VacinaService } from '../../shared/service/vacina.service';
import { Unidade } from '../../shared/model/unidade';
import { Endereco } from '../../shared/model/endereco';
import { Fabricante } from '../../shared/model/fabricante';
import { UnidadeService } from '../../shared/service/unidade.service';
import { FabricanteService } from '../../shared/service/fabricante.service';
import { EstoqueDTO } from '../../shared/model/dto/estoque.DTO';

@Component({
  selector: 'app-estoque-listagem',
  templateUrl: './estoque-listagem.component.html',
  styleUrl: './estoque-listagem.component.scss'
})
export class EstoqueListagemComponent implements OnInit{

  public listaDeEstoques : Array<Estoque> = new Array();
  public listaDeVacinas : Array<Vacina> = new Array();
  public listaDeUnidades : Array<Unidade> = new Array();
  public listaDeCidades : Array<Endereco> = new Array();
  public listaDeFabricantes : Array<Fabricante> = new Array();
  public estoque: Estoque | null = null;
  public estoqueDTO: EstoqueDTO | null = null;
  public estoqueSeletor: EstoqueSeletor = new EstoqueSeletor();
  public mostrarTabela: boolean = true;
  public usuarioAutenticado: Pessoa = new Pessoa();
  public ehAdministrador: boolean = false;
  public ehUsuario: boolean = false;
  private readonly USUARIO: number = 1;
  private readonly ADMINISTRADOR: number = 2;


  constructor(
    private estoqueService : EstoqueService,
    private vacinaService : VacinaService,
    private unidadeService : UnidadeService,
    private fabricanteService : FabricanteService,
    private router: Router
  ){

  }

  ngOnInit(): void{

    this.validacaoDeAcesso();

    if(!this.ehUsuario && !this.ehAdministrador){
      this.router.navigate(['login']);
      Swal.fire('Você não é um usuário cadastrado no sistema ou não está logado. '
              + 'Por isso não tem permissão para acessar essa página.', '', 'error');
    }

    this.consultarListaDeVacinas();
    this.consultarListaDeUnidades();
    this.consultarListaDeFabricantes();
  }

  private consultarListaDeVacinas(): void{
    this.vacinaService.consultarTodas().subscribe(
      resultado => this.listaDeVacinas = resultado,
      () => Swal.fire('Erro ao consultar a lista de vacinas','','error')
    );
  }

  private consultarListaDeUnidades(): void{
    this.unidadeService.consultarTodas().subscribe(
      resultado => this.listaDeUnidades = resultado,
      () => Swal.fire('Erro ao consultar a lista de unidades','','error')
    );
  }

  private consultarListaDeFabricantes(): void{
    this.fabricanteService.consultarTodos().subscribe(
      resultado => this.listaDeFabricantes = resultado,
      () => Swal.fire('Erro ao consultar a lista de fabricantes de vacinas','','error')
    );
  }

  public editar(estoque: Estoque): void{
    this.router.navigate(['/estoque/cadastrar/', estoque.unidade.id, estoque.vacina.id]);
  }

  public excluir(estoqueSelecionado: Estoque): void{
    Swal.fire({
      title: 'Sr. gestor(a) da unidade: Deseja realmente excluir o estoque da vacina '
      + estoqueSelecionado.vacina.nome + '?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.estoqueService.excluir(estoqueSelecionado.unidade.id, estoqueSelecionado.vacina.id).subscribe(
          resultado => {
            Swal.fire('Estoque excluído com sucesso!','','success');
            this.estoque = null;
            this.pesquisarComFiltros();
          },
          erro => {
            Swal.fire('Erro!', 'Erro ao excluir o estoque selecionado: ' + erro.error.mensagem, 'error');
          }
        );
      }
    });
  }


    public pesquisarComFiltros(): void{
      this.estoqueService.consultarComFiltrosComoAdmin(this.estoqueSeletor).subscribe(
        (resultado) => {
          if(resultado.length > 0){
            this.listaDeEstoques = resultado;
            this.mostrarTabela = true;
          } else{
            Swal.fire('"Infelizmente não existe nenhum resultado disponível de acordo com a sua busca. Tente outras opções"');
          }
        },
        (erro) => {
          Swal.fire('Erro ao buscar todas os estoques com o seletor.','','error');
        }
      );
    }

    public limpar(): void {
      this.mostrarTabela = false;
      this.estoqueSeletor = new EstoqueSeletor();
    }


  definirTipoDaExibicao(): Estoque[] {
    if (this.estoque) {
      return [this.estoque];
    } else {
      return this.listaDeEstoques;
    }
  }

  public validacaoDeAcesso(): void {
    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');
    if(usuarioNoStorage){
      this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
      this.ehAdministrador = this.usuarioAutenticado?.tipo == this.ADMINISTRADOR;
      this.ehUsuario = this.usuarioAutenticado?.tipo == this.USUARIO;
      if(!this.ehAdministrador){
        this.router.navigate(['login/home']);
        Swal.fire('Caro Sr. usuário: Você não tem permissão para acessar essa página. Evite problemas, e acesse apenas as opções disponíveis na tela.', '', 'error');
      }
    }
  }

}

