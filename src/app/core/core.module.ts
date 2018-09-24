import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { LangInterceptor } from './interceptors/lang.interceptor';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
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
    AuthService,
    AuthGuard
  ],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
