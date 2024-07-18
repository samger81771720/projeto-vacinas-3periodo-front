import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { PessoaService } from '../../shared/service/pessoa.service';
import { Pessoa } from '../../shared/model/pessoa';
import { PessoaSeletor } from '../../shared/model/seletor/pessoa.seletor';
import { Aplicacao } from '../../shared/model/aplicacao';
import { Vacina } from '../../shared/model/vacina';
import { Unidade } from '../../shared/model/unidade';
import { AplicacaoService } from '../../shared/service/aplicacao.service';
import { VacinaService } from '../../shared/service/vacina.service';
import { UnidadeService } from '../../shared/service/unidade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aplicacao-detalhe',
  templateUrl: './aplicacao-detalhe.component.html',
  styleUrl: './aplicacao-detalhe.component.scss'
})
export class AplicacaoDetalheComponent {

  public pessoas : Array<Pessoa> = new Array();
  public vacinas : Array<Vacina> = new Array();
  public unidades : Array<Unidade> = new Array();
  public seletor : PessoaSeletor = new PessoaSeletor();
  public aplicacao : Aplicacao = new Aplicacao();
  public usuarioAutenticado: Pessoa;
  public ehAdministrador: boolean = false;

  constructor(
    private pessoaService : PessoaService,
    private aplicacaoService : AplicacaoService,
    private vacinaService : VacinaService,
    private unidadeService : UnidadeService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.validacaoDeAcesso();
    if(this.ehAdministrador){
      this.consultarTodasAsUnidades();
    this.consultarTodosAsPessoas();
    this.consultarTodasAsVacinas();
    }
  }

  public compareById(r1: any, r2: any): boolean{
    return r1 && r2 ? r1.id_Pais === r2.id_Pais : r1 === r2;
  }

  public limparFormulario(): void {
    this.aplicacao = new Aplicacao();
  }

  public cadastrar(): void {
    if(this.validarFormulario()){
      this.aplicacaoService.salvar(this.aplicacao).subscribe(
        (resultado) => {
          Swal.fire('Aplicação salva com sucesso!', '', 'success');
          this.limparFormulario();
        },
        (erro) => {
          Swal.fire('Erro ao salvar a aplicação da vacina: ' + erro.error.mensagem, 'error');
        }
      );
    }
  }

  private validarFormulario(): boolean{

    const dataAtual = new Date();
    const dataAplicacao = new Date(this.aplicacao.dataAplicacao);
    const confirmaDataAtual = dataAplicacao.getFullYear() === dataAtual.getFullYear() &&
                              dataAplicacao.getMonth() === dataAtual.getMonth() &&
                              dataAplicacao.getDate() === dataAtual.getDate();

    if (!this.aplicacao.pessoaQueRecebeu){
      Swal.fire('Por favor, selecione o nome da pessoa que recebeu a vacina.', '', 'error');
      return false;
    } else if(!this.aplicacao.vacinaAplicada){
      Swal.fire('Por favor, selecione o nome da vacina aplicada.', '', 'error');
      return false;
    } else if(!this.aplicacao.unidadeOndeAplicou){
      Swal.fire('Por favor, selecione o nome da unidade onde o usuário recebeu a aplicação da vacina.', '', 'error');
      return false;
    } else if (confirmaDataAtual) {
      Swal.fire('A data da aplicação precisa ser a data atual.', '', 'error');
      return false;
    }
    return true;
  }

  public consultarTodasAsVacinas(): void{
    this.vacinaService.consultarTodas().subscribe(
      (resultado) => {
        this.vacinas = resultado;
      },
      (erro) => {
        Swal.fire('Erro ao buscar a lista de vacinas','','error');
      }
    );
  }

  public consultarTodasAsUnidades(): void{
    this.unidadeService.consultarTodas().subscribe(
      (resultado) => {
        this.unidades = resultado;
      },
      (erro) => {
        Swal.fire('Erro ao buscar a lista de unidades','','error');
      }
    );
  }

  public consultarTodosAsPessoas(): void{
    this.pessoaService.consultarTodos().subscribe(
      (resultado) => {
        this.pessoas = resultado;
      },
      (erro) => {
        Swal.fire('Erro ao buscar a lista de pessoas','','error');
      }
    );
  }

  public voltar(): void {
    this.router.navigate(['/login/home']);
  }

  public validacaoDeAcesso(): void {
    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');
    if(usuarioNoStorage){
      this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
      this.ehAdministrador = this.usuarioAutenticado?.tipo == 2;
      if(!this.ehAdministrador){
        this.router.navigate(['login/home']);
        Swal.fire('Caro Sr. Usuário: Você não tem permissão para acessar essa página. Evite problemas, e acesse apenas as opções disponíveis na tela.', '', 'error');
      }
    } else {
      this.router.navigate(['login']);
      Swal.fire('Você não é um usuário cadastrado no sistema ou não está logado. Por isso não tem permissão para acessar essa página.', '', 'error');
    }
  }

}



