import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VacinaRoutingModule } from './vacina-routing.module';
import { FormsModule } from '@angular/forms';
import { VacinaListagemComponent } from './vacina-listagem/vacina-listagem.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    VacinaListagemComponent
  ],
  imports: [
    CommonModule,
    VacinaRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ]
})
export class VacinaModule { }
