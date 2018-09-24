import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';

/**
 * модуль страниц авторизации
 */
@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [LoginPageComponent]
})
export class AuthModule { }
