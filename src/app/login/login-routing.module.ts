import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from '../home/home/home.component';

const routes: Routes = [

  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'pessoa',
        loadChildren: () => import('../pessoa/pessoa.module').then(m => m.PessoaModule)
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  },
  /*{ path: '', component: LoginComponent },

  { path: 'home', component: HomeComponent },*/

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LoginRoutingModule { }
