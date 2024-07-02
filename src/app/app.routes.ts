import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '', redirectTo: 'pessoa', pathMatch: 'full' },

  { path: 'pessoa', loadChildren:() => import('./pessoa/pessoa.module').then(m => m.PessoaModule) },

  { path: 'home', loadChildren:() => import('./home/home.module').then(m => m.HomeModule) },

  { path: 'login', loadChildren:() => import('./login/login.module').then(m => m.LoginModule) },

];

