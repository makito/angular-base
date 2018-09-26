import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../services/config.service';

/**
 * класс интерсептора для установки заголовка с локалью
 */
@Injectable()
export class LangInterceptor implements HttpInterceptor {

  constructor(
    private _config: ConfigService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const langReq = req.clone({
      setHeaders: {
        'Accept-Language': localStorage.getItem(this._config.localStorageNames.language) || 'ru-RU'
      }
    });
    return next.handle(langReq);
  }

}
