import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../model/dto/usuario.DTO';
import { Pessoa } from '../model/pessoa';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API = 'http://localhost:8080/projeto-vacinas-3periodo/rest/login';

  constructor(private httpClient: HttpClient) {

  }

  public autenticar(dto: UsuarioDTO): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(this.API + '/autenticar', dto);
  }

  public sair(): void{
    localStorage.removeItem('usuarioAutenticado');
  }

}
