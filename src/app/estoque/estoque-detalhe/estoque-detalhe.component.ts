import { Component } from '@angular/core';
import { Unidade } from '../../shared/model/unidade';
import { Estoque } from '../../shared/model/estoque';
import { UnidadeService } from '../../shared/service/unidade.service';
import Swal from 'sweetalert2';
import { Vacina } from '../../shared/model/vacina';
import { VacinaService } from '../../shared/service/vacina.service';
import { EstoqueService } from '../../shared/service/estoque.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pessoa } from '../../shared/model/pessoa';

@Component({
  selector: 'app-estoque-detalhe',
  templateUrl: './estoque-detalhe.component.html',
  styleUrl: './estoque-detalhe.component.scss'
})
export class EstoqueDetalheComponent {

  public unidades : Array<Unidade> = new Array();
  public vacinas : Array<Vacina> = new Array();
  public estoque : Estoque = new Estoque();
  public idUnidade: number;
  public idVacina: number;
  public usuarioAutenticado: Pessoa;
  public ehAdministrador: boolean = false;

  constructor(
    private unidadeService: UnidadeService,
    private vacinaService: VacinaService,
    private estoqueService: EstoqueService,
    private router: Router,
    private route: ActivatedRoute
  ){

  }

  ngOnInit(): void {

    this.validacaoDeAcesso();
    this.consultarTodasUnidades();
    this.consultarTodasVacinas();


    /*

    'idUnidade' e 'idVacina' os quais estão dentro de params['idUnidade'] e
    params['idVacina'] estão declarados dentro do arquivo de rotas do módulo:

    { path: 'cadastrar/:idUnidade/:idVacina', component: EstoqueDetalheComponent }

    */
    this.route.params.subscribe(
      (params) =>{
        this.idUnidade = params['idUnidade'];
        this.idVacina = params['idVacina'];
        if(this.idUnidade && this.idVacina) {
          this.consultarEstoquePorIds();
        }
      }
    )

  }

  public consultarTodasUnidades(){
    this.unidadeService.consultarTodas().subscribe(
      (resultado) => {
        this.unidades = resultado;
      },
      (erro) => {
        Swal.fire('Erro ao buscar a lista de unidades','','error');
      }
    );
  }

  public consultarTodasVacinas(){
    this.vacinaService.consultarTodas().subscribe(
      (resultado) => {
        this.vacinas = resultado;
      },
      (erro) => {
        Swal.fire('Erro ao buscar a lista de vacinas','','error');
      }
    );
  }

  public consultarEstoquePorIds(): void{
    this.estoqueService.consultarEstoquePorIds(this.idUnidade, this.idVacina).subscribe(
      (resultado) => {
        this.estoque = resultado;
      },
      (erro) => {
        Swal.fire('Erro ao buscar o estoque da unidade de id '
          + this.idUnidade + ' e da vacina de id ' + this.idVacina + ' no banco de dados para editá-lo',erro,'error');
      }
    )
  }

  public compareById(r1: any, r2: any): boolean{
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  public limparFormulario(): void {
    this.estoque = new Estoque();
  }

  public salvar(): void{
    if(this.idUnidade && this.idVacina && this.validarFormulario()){
      this.atualizar();
    } else {
      if(this.validarFormulario()){
        this.inserir();
      }
    }
  }

  private validarFormulario(): boolean{

    const dataAtual = new Date();
    const dataMenos60Dias = new Date();
    dataMenos60Dias.setDate(dataAtual.getDate() - 60);
    const dataMais365Dias = new Date();
    dataMais365Dias.setDate(dataAtual.getDate() + 365);

    if (!this.estoque.unidade){
      Swal.fire('Por favor, selecione a unidade onde deseja inserir o registro de estoque da vacina desejada.', '', 'error');
      return false;
    } else if(!this.estoque.vacina){
      Swal.fire('Por favor, selecione a vacina do estoque da unidade a ser cadastrado.', '', 'error');
      return false;
    } else if(!this.estoque.quantidade){
      Swal.fire('Por favor, escreva a quantidade do lote da vacina a ser cadastrado.', '', 'error');
      return false;
    } else if (new Date(this.estoque.dataLote) < dataMenos60Dias) {
      Swal.fire('A data do lote não pode ser inferior à 60 dias em relação a data atual.', '', 'error');
      return false;
    } else if (new Date(this.estoque.validade) > dataMais365Dias) {
      Swal.fire('A data da validade não pode ser superior à 1 ano em relação a data atual.', '', 'error');
      return false;
    } else if (new Date(this.estoque.dataLote) > dataAtual) {
      Swal.fire('A data do lote não pode ser superior a data atual.', '', 'error');
      return false;
    }
    return true;
  }

  public inserir(): void {
    this.estoqueService.salvar(this.estoque).subscribe(
      (resultado) => {
        if (resultado != null) {
          Swal.fire('Estoque cadastrado com sucesso!', '', 'success');
          this.limparFormulario();
        } else {
          Swal.fire('Erro ao tentar cadastrar o estoque: "No estoque dessa unidade, '
                  + 'atualmente, já existe um registro dessa vacina. Para inserir '
                  + 'mais unidades, por gentileza, atualize o registro atual do '
                  + 'estoque dessa vacina na unidade mencionada."', 'error');
        }
      },
      (erro) => {
        Swal.fire('Erro ao tentar cadastrar o estoque: ' + erro.error.mensagem, 'error');
      }
    );
  }

    public atualizar(): void {
      this.estoqueService.atualizar(this.estoque).subscribe(
        (resultado) => {
          if (resultado) {
            Swal.fire('Estoque atualizado com sucesso!', '', 'success');
            this.voltar();
          } else {
            Swal.fire('O estoque da UNIDADE ' + this.estoque.unidade.nome
                    + ' não possui nenhum lote da VACINA ' + this.estoque.vacina.nome
                    + ' para ser atualizado. Verifique os lotes disponíveis dessa unidade e tente novamente.'
                    , '', 'error');
          }
        },
        (erro) => {
          Swal.fire('Erro ao tentar atualizar o estoque. ' + erro.error.mensagem, '', 'error');
        }
      );
    }

  public voltar(): void {
    this.router.navigate(['/estoque/listagem']);
  }

  public validacaoDeAcesso(): void {

    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');

    if(usuarioNoStorage){
      this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
      this.ehAdministrador = this.usuarioAutenticado?.tipo == 2;

      if(!this.ehAdministrador){
        this.router.navigate(['login/home']);
        Swal.fire('Caro Sr. usuário: Você não tem permissão para acessar essa página. Evite problemas, e acesse apenas as opções disponíveis na tela.', '', 'error');

      } else{
        this.router.navigate(['login']);
        Swal.fire('Não foi possível acessar o cadastro de aplicações, pois não há nenhum usuário autenticado.', '', 'error');
      }
    }
  }

}
