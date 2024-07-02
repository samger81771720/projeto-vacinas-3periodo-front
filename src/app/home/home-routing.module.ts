import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {
        path: 'estoque',
        loadChildren: () =>
          import('../estoque/estoque.module').then((m) => m.EstoqueModule)
      },
      {
        path: 'pessoa',
        loadChildren: () =>
          import('../pessoa/pessoa.module').then((m) => m.PessoaModule)
      },
      {
        path: 'vacina',
        loadChildren: () =>
          import('../vacina/vacina.module').then((m) => m.VacinaModule)
      },
      {
        path: 'aplicacao',
        loadChildren: () =>
          import('../aplicacao/aplicacao.module').then((m) => m.AplicacaoModule)
      },
      {
        path: 'login',
        loadChildren: () =>
          import('../login/login.module').then((m) => m.LoginModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
