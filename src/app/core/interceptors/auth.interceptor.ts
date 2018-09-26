import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../services/config.service';

/**
 * класс интерсептора для установления заголовка с токеном авторизации
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _config: ConfigService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req));
  }

  /**
   * добавляет заголовок с токеном в запрос
   * @param req запрос
   * @param token токен
   */
  addToken(req: HttpRequest<any>, token: string = localStorage.getItem(this._config.localStorageNames.accessToken)): HttpRequest<any> {
    const noAuth: boolean = req.body instanceof HttpParams &&
      req.body.has('no_auth');

    // если есть токен и нет параметра обращаться без авторизации то ставим заголовки
    if (!!token && !noAuth) {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }
    return req;
  }

}
