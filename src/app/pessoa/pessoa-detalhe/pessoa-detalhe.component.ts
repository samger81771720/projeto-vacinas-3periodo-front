import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pessoa } from '../../shared/model/pessoa';
import { PessoaService } from '../../shared/service/pessoa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CEPErrorCode, NgxViacepService } from "@brunoc/ngx-viacep";
import { Endereco, CEPError } from "@brunoc/ngx-viacep";
import { EMPTY, catchError } from 'rxjs';
import { CadastroService } from '../../shared/service/cadastro.service';
import { PessoaDetalheService } from '../../shared/service/pessoa.detalhe.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-pessoa-detalhe',
  templateUrl: './pessoa-detalhe.component.html',
  styleUrl: './pessoa-detalhe.component.scss'
})
export class PessoaDetalheComponent implements OnInit, OnDestroy{

  public idPessoa: number;
  public pessoa: Pessoa = new Pessoa();
  private readonly USUARIO: number = 1;
  private readonly ADMINISTRADOR: number = 2;
  public ehAdministrador: boolean = false;
  public ehUsuario: boolean = false;
  public usuarioAutenticado: Pessoa = new Pessoa();
  public permitirOpcaoAdministrador: boolean = true;

  /* Observe no import { Endereco, CEPError } from "@brunoc/ngx-viacep"
import { LoginComponent } from '../../login/login/login.component';
import { SharedModule } from '../../shared/shared.module';
  que essa classe Endereco pertence a outra interface */
  public listaDeEnderecos: Endereco[] = [];
  private subscription: Subscription;

  constructor(
    private pessoaService : PessoaService,
    private router: Router,
    private viacep: NgxViacepService,
    /*
    Como o componente home está sendo utilizado dentro de um módulo compartilhado(Shared)
    foi então necessário criar uma classe service "CadastroService" para pode usar um "Serviço
    para Compartilhar Um Estado", pois não foi possível fazer isso diretamente via HomeComponent.
    */
    private cadastroService: CadastroService,

    private pessoaDetalheService: PessoaDetalheService

  ){

  }

  ngOnInit(): void {

    this.subscription = this.pessoaDetalheService.executarNgOnInit$.subscribe(
      () => {
      this.ngOnInit();
    });

    this.verificarTipoUsuarioLogado();

    if(this.cadastroService.confirmarCadastro && this.ehAdministrador){
      this.pessoa = new Pessoa();
    }

    if(!this.cadastroService.confirmarCadastro && (this.ehAdministrador || this.ehUsuario)){
      this.idPessoa = this.usuarioAutenticado.id;
      this.consultarPessoaPorId();
    }

    if(!this.ehAdministrador){
      this.permitirOpcaoAdministrador = false;
      this.pessoa.tipo = this.USUARIO;
    }

  }

  ngOnDestroy(): void {
    // Evitar vazamentos de memória ao desinscrever
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public consultarPessoaPorId(): void{
    this.pessoaService.consultarPorId(this.idPessoa).subscribe(
      (resultado) => {
        this.pessoa = resultado;
        this.pessoa.senha = '';
      },
      (erro) => {
        Swal.fire(
          'Erro ao buscar o usuário ' + this.pessoa.nome
          + ' no banco de dados para editá-la',erro,'error'
        );
      }
    )
  }

  public salvar(): void{
    if(this.idPessoa && this.validarFormulario()){
      this.atualizar();
    } else {
      if(this.validarFormulario()){
        this.inserir();
      }
    }
  }

  public inserir(): void {
    this.pessoaService.salvar(this.pessoa).subscribe(
      (resultado) => {
        Swal.fire(
          this.pessoa.nome + ' você foi cadastrado(a) com sucesso no sistema!','', 'success'
        );
        this.pessoa = new Pessoa();
        // "this.definirRotaParaTipoDeUsuario()" é necessário caso seja o primeiro cadastro de usuário no sistema
        this.definirRotaParaTipoDeUsuario();
      },
      (erro) => {
        Swal.fire(
          this.pessoa.nome + ' houve um erro ao tentar efetuar o seu cadastro no sistema: '
        + erro.error.mensagem, 'error' + ' Tente novamente.'
        );
      }
    );
  }

  private validarFormulario(): boolean{
    if(!this.pessoa.nome){
      Swal.fire('Por favor, preencha o campo nome.', '', 'warning');
      return false;
    } else if(!this.pessoa.dataNascimento){
      Swal.fire('Por favor, insira a sua data de nascimento.', '', 'warning');
      return false;
    } else if(!this.pessoa.tipo){
      Swal.fire('Por favor, selecione o tipo.', '', 'warning');
      return false;
    } else if(!this.pessoa.sexo){
      Swal.fire('Por favor, selecione uma opção no campo sexo.', '', 'warning');
      return false;
    } else if(!this.pessoa.cpf) {
      Swal.fire('Por favor, insira o número do seu cpf.', '', 'warning');
      return false;
    } else if(!this.pessoa.login) {
      Swal.fire('Por favor, preencha o campo login.', '', 'warning');
      return false;
    } else if(!this.pessoa.senha) {
      Swal.fire('Por favor, preencha o campo senha.', '', 'warning');
      return false;
    } else if(this.pessoa.doencaPreexistente == null) {
      Swal.fire('Por favor, preencha o campo doença preexistente.', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.cep) {
      Swal.fire('Por favor, preencha o campo CEP. Caso não saiba o número do seu cep, preencha os campos: "Estado", "Cidade" e "Logradouro" e clique no botão "Buscar Endereço".', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.pais) {
      Swal.fire('Por favor, preencha o campo País.', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.estado) {
      Swal.fire('Por favor, preencha o campo estado.', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.localidade) {
      Swal.fire('Por favor, preencha o campo cidade.', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.bairro) {
      Swal.fire('Por favor, preencha o campo bairro.', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.logradouro) {
      Swal.fire('Por favor, preencha o campo logradouro.', '', 'warning');
      return false;
    } else if(!this.pessoa.enderecoDaPessoa.numero) {
      Swal.fire('Por favor, preencha o campo número.', '', 'warning');
      return false;
    } else if(!this.pessoa.contatoDaPessoa.telefone) {
      Swal.fire('Por favor, preencha o campo telefone.', '', 'warning');
      return false;
    } else if(!this.pessoa.contatoDaPessoa.email) {
      Swal.fire('Por favor, preencha o campo email.', '', 'warning');
      return false;
    }
    return true;
  }

  public atualizar(): void {
    this.pessoaService.atualizar(this.pessoa).subscribe(
      (resultado) => {
        Swal.fire(this.pessoa.nome
          + ' o seu cadastro foi atualizado com sucesso no sistema!','', 'success');
          this.router.navigate(['pessoa/listagem']);
      },
      (erro) => {
        Swal.fire(this.pessoa.nome
          + ' houve um erro ao tentar atualizar o seu cadastro no sistema: '
          + erro.error.mensagem, 'error' + ' Tente novamente.');
          this.ngOnInit();
      }
    );
  }

  public voltar(): void {
    this.router.navigate(['/login/home']);
  }

  public limparFormulario(): void {
    this.pessoa = new Pessoa();
    this.listaDeEnderecos = [];
  }

  public buscarCEP(): void {
    if (this.pessoa.enderecoDaPessoa.cep) {
      this.viacep.buscarPorCep(this.pessoa.enderecoDaPessoa.cep)
        .pipe(
          catchError((error: CEPError) => {
            Swal.fire('Erro ao buscar CEP! Por favor, digite "apenas números" e "sem espaços em branco" . '
                     +'\n\nCaso não seja isso, observe o tipo do erro na última linha e tente novamente .'
                     +'\n\nSe ainda sim o erro persistir preencha os campos: "Estado", "Cidade" e '
                     +' "Logradouro" e clique no botão "Buscar Endereço".', error.message, 'error');
            return EMPTY;
          })
        )
        .subscribe((endereco: Endereco) => {
          this.pessoa.enderecoDaPessoa.logradouro = endereco.logradouro;
          this.pessoa.enderecoDaPessoa.complemento = endereco.complemento;
          this.pessoa.enderecoDaPessoa.bairro = endereco.bairro;
          this.pessoa.enderecoDaPessoa.localidade = endereco.localidade;
          this.pessoa.enderecoDaPessoa.estado = endereco.uf;
          this.pessoa.enderecoDaPessoa.pais = 'Brasil';
        });
    }
  }

  public buscarEnderecoPorDados(): void {

    const estado = this.pessoa.enderecoDaPessoa.estado;
    const cidade = this.pessoa.enderecoDaPessoa.localidade;
    const logradouro = this.pessoa.enderecoDaPessoa.logradouro;

    this.viacep.buscarPorEndereco(estado, cidade, logradouro).pipe(
      catchError((error: CEPError) => {
        return EMPTY;
      })
    ).subscribe((enderecos: Endereco[]) => {
      if(this.listaDeEnderecos.length > 0){
        this.listaDeEnderecos = enderecos;
      } else{
        Swal.fire('Erro ao buscar o CEP pelo endereço informado. Tente novamente', 'error');
      }

    });
  }

  /*
  Verificar se essa classe "CEPErrorCode" é necessária para exibir erros uma vez que essa "CEPError"
  é utilizada com sucesso para exibir os erros nos métodos "buscarEnderecoPorDados" e
  */
  identificarErro(erroDoCodigo: CEPErrorCode) {
    switch (erroDoCodigo) {
      case CEPErrorCode.CEP_NAO_ENCONTRADO:
        Swal.fire('cep não encontrado');
        break;
      case CEPErrorCode.CEP_VAZIO:
        console.log("CEP está vazio.");
        break;
      case CEPErrorCode.CEP_INVALIDO:
        console.log("CEP inválido.");
        break;
      case CEPErrorCode.CEP_MUITO_CURTO:
        console.log("CEP muito curto.");
        break;
      case CEPErrorCode.CEP_MUITO_LONGO:
        console.log("CEP muito longo.");
        break;
      case CEPErrorCode.UF_VAZIA:
        console.log("Por favor, informe a UF :P");
        break;
      case CEPErrorCode.UF_MUITO_CURTA:
        console.log("UF muito curta.");
        break;
      case CEPErrorCode.UF_MUITO_LONGA:
        console.log("UF muito longa.");
        break;
      case CEPErrorCode.UF_NAO_EXISTE:
        console.log("A UF informada não existe :/");
        break;
      case CEPErrorCode.MUNICIPIO_VAZIO:
        console.log("O município está vazio.");
        break;
      case CEPErrorCode.MUNICIPIO_MUITO_CURTO:
        console.log("Município muito curto.");
        break;
      case CEPErrorCode.LOGRADOURO_VAZIO:
        console.log("O logradouro está vazio.");
        break;
      case CEPErrorCode.LOGRADOURO_MUITO_CURTO:
        console.log("Logradouro muito curto.");
        break;
      case CEPErrorCode.ERRO_SERVIDOR:
        console.log("Erro interno no servidor.");
        break;
      default:
        console.log("Erro desconhecido.");
        break;
    }
  }

  public verificarTipoUsuarioLogado(): void{
    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');
    if (usuarioNoStorage) {
        this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
        this.ehUsuario = this.usuarioAutenticado?.tipo == this.USUARIO;
        this.ehAdministrador = this.usuarioAutenticado?.tipo == this.ADMINISTRADOR;
     }
  }

   public definirRotaParaTipoDeUsuario(): void {
    if (this.ehAdministrador) {
      this.router.navigate(['login/home']);
    } else {
      this.router.navigate(['login']);
    }
  }

}






