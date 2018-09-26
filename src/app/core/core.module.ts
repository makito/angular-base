import { NgModule, Optional, SkipSelf, Injector } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LangInterceptor } from './interceptors/lang.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AuthAbstractInterceptor } from '@app/common';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LangInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    AuthGuard,
    ApiService,
    ConfigService
  ],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    injector: Injector,
    auth: AuthService,
    http: HttpClient
  ) {
    // собираем все интерсепторы и инициализируем их без циклических зависимостей
    const interceptors = injector.get<AuthAbstractInterceptor[]>(HTTP_INTERCEPTORS)
      .filter(i => !!i.init);
    interceptors.forEach(i => i.init(http, auth));

    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
