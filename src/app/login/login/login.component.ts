import { Component } from '@angular/core';
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
export class LoginComponent {

  public dto: UsuarioDTO = new UsuarioDTO();

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {

  }

  public realizarLogin() {
    this.loginService.autenticar(this.dto).subscribe(
      (usuarioAutenticado: Pessoa) => {
        Swal.fire('Sucesso', 'Usuário autenticado com sucesso', 'success');
        localStorage.setItem('usuarioAutenticado', JSON.stringify(usuarioAutenticado));
        this.router.navigate(['/login/home']);
      },
      (erro) => {
        Swal.fire('Erro', erro.error.mensagem, 'error');
      }
    )
  }

  public cadastro() {
    this.router.navigate(['/login/pessoa/cadastro']);
  }

}
