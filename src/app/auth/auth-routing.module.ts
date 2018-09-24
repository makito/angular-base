import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import { TT } from '@app/core';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    data: {
      title: TT('Авторизация')
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
