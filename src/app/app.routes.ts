import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login',loadChildren:() => import('./login/login.module').then(m => m.LoginModule) },

  { path: 'pessoa' ,loadChildren:() => import('./pessoa/pessoa.module').then(m => m.PessoaModule) },

  { path: 'aplicacao' ,loadChildren:() => import('./aplicacao/aplicacao.module').then(m => m.AplicacaoModule) },

  { path: 'estoque' ,loadChildren:() => import('./estoque/estoque.module').then(m => m.EstoqueModule) },

  { path: 'vacina' ,loadChildren:() => import('./vacina/vacina.module').then(m => m.VacinaModule) }

];

