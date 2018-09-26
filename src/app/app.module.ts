import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeRu from '@angular/common/locales/ru';
import localeRuExtra from '@angular/common/locales/extra/ru';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslatePoHttpLoader } from '@biesbjerg/ngx-translate-po-http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { CoreModule, ConfigService } from '@app/core';
import { SharedModule } from './shared';
import { preloadTranslates } from '@app/common';

/**
 * загрузчик переводов интерфейса приложения
 * @param http модуль http
 */
export const createTranslateLoader = (http: HttpClient) => new TranslatePoHttpLoader(http, 'assets/i18n', '.po');

/**
 * загрузчик конфигурации
 * @param config сервис конфигурации
 */
export const initConfig = (config: ConfigService) => () => config.load();

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru-RU' },
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ConfigService], multi: true },
    { provide: APP_INITIALIZER, useFactory: preloadTranslates, deps: [TranslateService, Injector, ConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
