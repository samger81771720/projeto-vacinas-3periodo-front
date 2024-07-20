import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoaDetalheService {
  /*
  Este Subject será usado para emitir eventos ou  seja a classe
   Subject de "private executarNgOnInit = new Subject<void>();"
   permite emitir eventos que podem ser observados por outros
   componentes ou serviços, facilitando a comunicação e
   acionamento de métodos como ngOnInit.*/
  private executarNgOnInit = new Subject<void>();

  /*
  Observable para outros componentes se inscreverem

  O sufixo $ é uma convenção comum em JavaScript/TypeScript
  para indicar que a variável contém um Observable.
  
  */
  executarNgOnInit$ = this.executarNgOnInit.asObservable();

  /*

  "Método para disparar o evento"

  O método next() no contexto this.executarNgOnInit.next();
  emite um evento através do Subject, notificando todos os
  observadores inscritos que um evento ocorreu, permitindo
  que eles respondam a essa emissão.

  */
  solicitarExecucaoNgOnInit() {
    this.executarNgOnInit.next();
  }

}
