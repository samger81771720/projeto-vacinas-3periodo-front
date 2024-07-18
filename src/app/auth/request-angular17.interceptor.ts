// Importa classes para manipulação de erros HTTP e definição de interceptores
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

// Importa operadores RxJS para manipulação de erros
import { catchError, throwError } from 'rxjs';

// Importa a declaração para injeção de dependências
import { inject } from '@angular/core';

import { Router } from '@angular/router';



import { LoginService } from '../shared/service/login.service';



export const requestAngular17Interceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router); // Injeta a dependência do Router
  const loginService = inject(LoginService); // Injeta a dependência do LoginService
  let authReq = req; // Define uma variável authReq inicialmente igual à requisição original

  if (typeof window !== 'undefined' && window.localStorage) {
    const usuarioAutenticado = localStorage.getItem('usuarioAutenticado');

    if (usuarioAutenticado) {
      const usuario = JSON.parse(usuarioAutenticado);
      authReq = req.clone({// Clona a requisição original e adiciona um cabeçalho 'idSessao'
        setHeaders: { idSessao: usuario.idSessao }
      });
    }
  }

  /*Passa a requisição (original ou modificada) para
  o próximo manipulador na cadeia de interceptores*/
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {// Captura qualquer erro HTTP que ocorra durante a requisição
      if (
           error.status === 401 ||
           error.status === 403
        ) {
        loginService.sair();
        router.navigate(['/login']);
      }
      return throwError(error);// Lança o erro novamente para que outras partes do código possam lidar com ele
    })
  );

};


