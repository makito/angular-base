import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * класс интерсептора для установления заголовка с токеном авторизации
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  /**
   * добавляет заголовок с токеном в запрос
   * @param req запрос
   * @param token токен
   */
  static addToken(req: HttpRequest<any>, token: string = localStorage.getItem('jwt_access_token')): HttpRequest<any> {
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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(AuthInterceptor.addToken(req));
  }

}
