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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('jwt_access_token');
    const noAuth: boolean = req.body instanceof HttpParams &&
      req.body.has('no_auth');
    if (!!token && !noAuth) {
      // если есть токен и нет параметра обращаться без авторизации то ставим заголовки
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }

}
