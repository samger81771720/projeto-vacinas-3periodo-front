import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RodapeComponent } from './components/rodape/rodape.component';
import { HomeComponent } from '../home/home/home.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RodapeComponent, HomeComponent],
  exports: [RodapeComponent, HomeComponent]
})
export class SharedModule { }
