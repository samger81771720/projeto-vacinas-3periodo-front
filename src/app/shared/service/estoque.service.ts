import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Estoque } from '../model/estoque';
import { VacinaSeletor } from '../model/seletor/vacina.seletor';
import { VacinaDTO } from '../model/dto/vacina.DTO';
import { Observable, throwError } from 'rxjs';
import { EstoqueSeletor } from '../model/seletor/estoque.seletor';
import { EstoqueDTO } from '../model/dto/estoque.DTO';

@Injectable({
  providedIn: 'root'
})

export class EstoqueService {

  constructor(private httpClient: HttpClient) {

  }

  private readonly API: string = 'http://localhost:8080/projeto-vacinas-3periodo/rest/restrito/estoque';

  public consultarTodos(): Observable<Array<Estoque>>{
    return this.httpClient.get<Array<Estoque>>(this.API + '/consultarTodos');
  }

  public excluir(idUnidade: number, idVacina: number): Observable<boolean>{
    return this.httpClient.delete<boolean>(this.API
                                            + '/' + idUnidade + '/' + idVacina);
  }

  public atualizar(estoque: Estoque): Observable<boolean>{
    return this.httpClient.put<boolean>(this.API, estoque);
  }

  public salvar(estoque: Estoque): Observable<Estoque>{
    return this.httpClient.post<Estoque>(this.API, estoque);
  }

  public consultarComFiltros(vacinaSeletor: VacinaSeletor): Observable<Array<VacinaDTO>>{
    return this.httpClient.post<Array<VacinaDTO>>(this.API
                                + '/filtro-Vacinas-EstoqueDaUnidade', vacinaSeletor);
  }

  public consultarComFiltrosComoAdmin(estoqueSeletor: EstoqueSeletor): Observable<Array<EstoqueDTO>>{
    return this.httpClient.post<Array<EstoqueDTO>>(this.API
                                + '/consultarEstoquesComFiltrosComoAdministrador', estoqueSeletor);
  }

  public consultarEstoquePorIds(idUnidade: number, idVacina: number): Observable<Estoque>{
    return this.httpClient.get<Estoque>(this.API + '/' + idUnidade + '/' + idVacina);
  }


  public consultarEstoquesDaUnidadePorId(estoque: Estoque): Observable<Array<Estoque>>{
    return this.httpClient.post<Array<Estoque>>(this.API
                                + '/consultarEstoquesDaUnidadePorId', estoque);
  }

}
