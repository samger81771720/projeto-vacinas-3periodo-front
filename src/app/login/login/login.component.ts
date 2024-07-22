import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../shared/service/login.service';
import { Router } from '@angular/router';
import { Pessoa } from '../../shared/model/pessoa';
import Swal from 'sweetalert2';
import { UsuarioDTO } from '../../shared/model/dto/usuario.DTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  public dto: UsuarioDTO = new UsuarioDTO();
  public usuarioAutenticado: Pessoa;
  public ehAdministrador: boolean = false;
  public ehUsuario: boolean = false;
  private readonly USUARIO: number = 1;
  private readonly ADMINISTRADOR: number = 2;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.validarTipoDeUsuario();
  }


  public realizarLogin() {
    this.loginService.autenticar(this.dto).subscribe(
      (usuarioAutenticado: Pessoa) => {
        Swal.fire('Sucesso', 'Usuário autenticado com sucesso', 'success');
        // comentário abaixo
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioAutenticado));
        }
        this.router.navigate(['login/home']);
      },
      (erro) => {
        Swal.fire('Erro', erro.error.mensagem, 'error');
      }
    )
  }

  public cadastro() {
    this.router.navigate(['/pessoa/cadastro']);
  }

  public validarTipoDeUsuario(): void {
    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');
    if(usuarioNoStorage){
      this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
      this.ehAdministrador = this.usuarioAutenticado?.tipo == this.ADMINISTRADOR;
      this.ehUsuario = this.usuarioAutenticado?.tipo == this.USUARIO;
      if(this.ehAdministrador || this.ehUsuario){
        let tipoUsuario = this.ehAdministrador ? 'Administrador' : 'Usuário';
        Swal.fire('Sr. ' + tipoUsuario + ': Você já se encontra logado. Para acessar '
                 +'a tela de login, clique na opção "Sair" na barra de menu superior da tela Home.'
                 , '', 'error');
        this.router.navigate(['login/home']);
      }
    }
  }

}

/*
Apesar da mensagem de erro, o objeto estava
sendo salvo no localStorage o que sugere que
a operação estava ocorrendo apenas no navegador,
mas a mensagem de erro era gerada durante a
renderização no servidor. A verificação
if (typeof localStorage !== 'undefined')
evita que o código que acessa localStorage
seja executado no servidor, onde ele não
está definido.

Assim, o localStorage continua funcionando
no navegador sem causar problemas durante a
renderização no servidor.
*/
