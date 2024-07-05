
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { LoginService } from "../shared/service/login.service";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {     // Método intercepta requisições HTTP e retorna um Observable de eventos HTTP
    const usuarioAutenticado = localStorage.getItem('usuarioAutenticado');              // Obtém a informação do usuário autenticado armazenada no localStorage
    let authReq = req;                                                                  // Cria uma variável authReq que inicialmente é a requisição original

    if (usuarioAutenticado) {
      authReq = req.clone({                                                             // Clona a requisição original para criar uma nova requisição
        setHeaders: { idSessao: JSON.parse(usuarioAutenticado).idSessao }               // Adiciona um cabeçalho personalizado 'idSessao' à nova requisição e  O valor de 'idSessao' é extraído do objeto JSON 'usuarioAutenticado' armazenado no localStorage.
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.loginService.sair();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );

  }

}


