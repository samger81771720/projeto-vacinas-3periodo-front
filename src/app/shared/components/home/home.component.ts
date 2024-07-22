import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pessoa } from '../../model/pessoa';
import { CadastroService } from '../../service/cadastro.service';
import { PessoaDetalheService } from '../../service/pessoa.detalhe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit{

  public usuarioAutenticado: Pessoa;
  public ehAdministrador: boolean = false;
  public ehUsuario: boolean = false;
  public opcaoCadastroComum: boolean = false;
  private readonly USUARIO: number = 1;
  private readonly ADMINISTRADOR: number = 2;

  constructor(
    private router: Router,
    private cadastroService: CadastroService,
    private pessoaDetalheService: PessoaDetalheService
  ) {

  }

  ngOnInit(): void {
    this.identificarTipoDeUsuario();
  }

  public editarPerfilDeUsuario(): void{
    this.cadastroService.confirmarCadastro = false;
    this.router.navigate(['/pessoa/cadastro/']);
    this.pessoaDetalheService.solicitarExecucaoNgOnInit();
  }

  public cadastrarUsuarioComoAdministrador(): void{
    this.cadastroService.confirmarCadastro = true;
    this.router.navigate(['/pessoa/cadastro/']);
    this.pessoaDetalheService.solicitarExecucaoNgOnInit();
  }

  sair(){
    localStorage.removeItem('usuarioAutenticado');
    this.router.navigate(['/login']);
  }

  public identificarTipoDeUsuario(): void{
    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');
    if (usuarioNoStorage) {
        this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
        this.ehAdministrador = this.usuarioAutenticado?.tipo == this.ADMINISTRADOR;
        this.ehUsuario = this.usuarioAutenticado?.tipo == this.USUARIO;
     }
     if(!this.ehAdministrador && !this.ehUsuario){
      this.opcaoCadastroComum = true;
      this.router.navigate(['login']);
      Swal.fire('Você não é um usuário cadastrado no sistema ou não está logado, por isso não tem permissão para acessar essa página.', '', 'error');
     }
    }
}

/*
this.usuarioAutenticado?.tipo:

O operador ?. verifica se this.usuarioAutenticado não é
null ou undefined antes de tentar acessar a propriedade tipo.
Se this.usuarioAutenticado for null ou undefined, a expressão
inteira retorna undefined em vez de lançar um erro.
this.usuarioAutenticado?.tipo == 2:

Compara o valor de tipo a 2 apenas se this.usuarioAutenticado
não for null ou undefined.
Se this.usuarioAutenticado for null ou undefined, a comparação
resulta em false.
*/


/*
Para executar o método ngOnInit do componente PessoaDetalheComponent
a partir dos métodos editarPerfilDeUsuario e cadastrarUsuarioComoAdministrador
do componente HomeComponent, você pode fazer isso de algumas maneiras,
dependendo da arquitetura da sua aplicação. A mais comum é utilizar
um serviço compartilhado para comunicar a necessidade de executar ngOnInit.

Primeiro, vou mostrar como você pode criar um serviço para notificar
o componente PessoaDetalheComponent para executar ngOnInit.

Passo 1: Crie um Serviço de Comunicação
Crie um serviço chamado PessoaDetalheService que emitirá eventos
quando precisar executar o método ngOnInit em PessoaDetalheComponent.

typescript
Copiar código
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaDetalheService {
  // Este Subject será usado para emitir eventos
  private executarNgOnInit = new Subject<void>();

  // Observable para outros componentes se inscreverem
  executarNgOnInit$ = this.executarNgOnInit.asObservable();

  // Método para disparar o evento
  solicitarExecucaoNgOnInit() {
    this.executarNgOnInit.next();
  }
}
Passo 2: Modifique o PessoaDetalheComponent para Ouvir o Evento
No componente PessoaDetalheComponent, inscreva-se no Observable
do serviço para executar ngOnInit quando solicitado.

typescript
Copiar código
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PessoaDetalheService } from '../../shared/service/pessoa-detalhe.service';
// Atualize o caminho conforme necessário

@Component({
  selector: 'app-pessoa-detalhe',
  templateUrl: './pessoa-detalhe.component.html',
  styleUrl: './pessoa-detalhe.component.scss'
})
export class PessoaDetalheComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private pessoaDetalheService: PessoaDetalheService) { }

  ngOnInit(): void {
    this.subscription = this.pessoaDetalheService.executarNgOnInit$.subscribe(() => {
      this.ngOnInit();
    });

    // Código existente no ngOnInit
    // ...
  }

  ngOnDestroy(): void {
    // Evitar vazamentos de memória ao desinscrever
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Código restante do componente
  // ...
}
Passo 3: Modifique o HomeComponent para Solicitar a Execução de ngOnInit
No componente HomeComponent, injete o serviço PessoaDetalheService e
solicite a execução de ngOnInit quando necessário.

typescript
Copiar código
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pessoa } from '../../model/pessoa';
import { CadastroService } from '../../service/cadastro.service';
import { PessoaDetalheService } from '../../shared/service/pessoa-detalhe.service';
// Atualize o caminho conforme necessário

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public usuarioAutenticado: Pessoa;
  public ehAdministrador: boolean = false;
  public ehUsuario: boolean = false;
  public opcaoCadastroComum: boolean = false;

  private readonly USUARIO: number = 1;
  private readonly ADMINISTRADOR: number = 2;

  constructor(
    private router: Router,
    private cadastroService: CadastroService,
    private pessoaDetalheService: PessoaDetalheService
  ) { }

  ngOnInit(): void {
    this.identificarTipoDeUsuario();
  }

  public editarPerfilDeUsuario(): void {
    this.router.navigate(['/pessoa/cadastro/']);
    this.pessoaDetalheService.solicitarExecucaoNgOnInit();
  }

  public cadastrarUsuarioComoAdministrador(): void {
    this.cadastroService.confirmarCadastro = true;
    this.router.navigate(['/pessoa/cadastro/']);
    this.pessoaDetalheService.solicitarExecucaoNgOnInit();
  }

  sair() {
    localStorage.removeItem('usuarioAutenticado');
    this.router.navigate(['/login']);
  }

  public identificarTipoDeUsuario(): void {
    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');
    if (usuarioNoStorage) {
      this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
      this.ehAdministrador = this.usuarioAutenticado?.tipo == this.ADMINISTRADOR;
      this.ehUsuario = this.usuarioAutenticado?.tipo == this.USUARIO;
    }
    if (!this.ehAdministrador && !this.ehUsuario) {
      this.opcaoCadastroComum = true;
    }
  }
}


Resumo:

Criar um serviço de comunicação (PessoaDetalheService): Ele possui
um Subject que emite eventos para solicitar a execução de ngOnInit.
Modificar o PessoaDetalheComponent para ouvir o serviço: Inscreva-se
no Observable do serviço e chame ngOnInit quando um evento for recebido.
Modificar o HomeComponent para solicitar a execução: Injetar o serviço
PessoaDetalheService e chamar o método solicitarExecucaoNgOnInit quando
necessário.
Isso garante que sempre que você chamar editarPerfilDeUsuario ou
cadastrarUsuarioComoAdministrador, o método ngOnInit em PessoaDetalheComponent
será executado.

*/
