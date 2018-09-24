import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * класс интерсептора для установки заголовка с локалью
 */
@Injectable()
export class LangInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const langReq = req.clone({
      setHeaders: {
        'Accept-Language': localStorage.getItem('lang') || 'ru-RU'
      }
    });
    return next.handle(langReq);
  }

}
