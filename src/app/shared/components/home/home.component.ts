import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pessoa } from '../../model/pessoa';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit{

  public usuarioAutenticado: Pessoa;
  public ehAdministrador: boolean = false;
  public opcaoCadastro: boolean = true;



  constructor(private router: Router) {

  }

  ngOnInit(): void {

    let usuarioNoStorage = localStorage.getItem('usuarioAutenticado');

    if(usuarioNoStorage){

      this.usuarioAutenticado = JSON.parse(usuarioNoStorage) as Pessoa;
      this.ehAdministrador = this.usuarioAutenticado?.tipo == 2; // explicação abaixo do uso abaixo operador de encadeamento opcional.

      if(!this.ehAdministrador){
        this.opcaoCadastro = false;
      }


    } else {
      this.router.navigate(['/login']);
    }

  }

  public editarPerfilDeUsuario(pessoaSelecionada: Pessoa): void{
    this.router.navigate(['/pessoa/cadastro/', pessoaSelecionada.id]);
  }

  logout(){
    localStorage.removeItem('usuarioAutenticado');
    this.router.navigate(['/login']);
  }

}

/*
this.usuarioAutenticado?.tipo:

O operador ?. verifica se this.usuarioAutenticado não é null ou undefined antes de tentar acessar a propriedade tipo.
Se this.usuarioAutenticado for null ou undefined, a expressão inteira retorna undefined em vez de lançar um erro.
this.usuarioAutenticado?.tipo == 2:

Compara o valor de tipo a 2 apenas se this.usuarioAutenticado não for null ou undefined.
Se this.usuarioAutenticado for null ou undefined, a comparação resulta em false.
*/
