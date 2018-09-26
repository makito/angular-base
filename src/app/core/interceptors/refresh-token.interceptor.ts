import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders, HttpParams, HttpClient
} from '@angular/common/http';
import { throwError as observableThrowError, Observable, BehaviorSubject, empty } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { IApiError, AuthAbstractInterceptor, IHttpError } from '@app/common';

/**
 * интерсептор рефреша токена
 */
@Injectable({
  providedIn: 'root'
})
export class RefreshTokenInterceptor extends AuthAbstractInterceptor implements HttpInterceptor {

  /**
   * признак обновления токена
   */
  private _isRefreshingToken = false;

  private _tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * сервис авторизации
   */
  private _authService: AuthService;

  /**
   * восстановление ответа сервера об ошибке из arraybuffer
   * так как ангуляр возвращает ошибку в том типе, в котором был запрос
   * @param error ошибка http
   */
  static restoreErrorFromArrayBuffer(error: HttpErrorResponse): HttpErrorResponse {
    if (!(error.error instanceof ArrayBuffer)) {
      return error;
    }

    const clonedError = { ...error };
    const decodedString = String.fromCharCode.apply(null, new Uint8Array(error.error));
    clonedError.error = JSON.parse(decodeURIComponent(escape(decodedString)));
    return new HttpErrorResponse(clonedError);
  }

  constructor(
    private _authInterceptor: AuthInterceptor
  ) {
    super();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // восстановление ошибки из arraybuffer
          error = RefreshTokenInterceptor.restoreErrorFromArrayBuffer(error);

          switch (error.status) {
            case 401:
              return this._handle401Error(req, next);
            case 500:
              return this._handle500Error(req, error);
            default:
              return this._handleError(req, error);
          }
        })
      );
  }

  /**
   * инициализация интерсептора
   * @param http класс angular для работы по http
   * @param auth сервис авторизации
   */
  init(http: HttpClient, auth: AuthService) {
    this._authService = auth;
  }

  /**
   * обработчик ошибок 401
   * @param req запрос
   * @param next обрабочик запроса
   */
  private _handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this._isRefreshingToken) {
      this._isRefreshingToken = true;
      this._tokenSubject.next(null);

      return this._authService.refreshToken()
        .pipe(
          switchMap((newToken: string): any => {
            if (!!newToken) {
              this._tokenSubject.next(newToken);
              return next.handle(this._authInterceptor.addToken(req, newToken));
            }

            return this._relogin();
          }),
          catchError(() => this._relogin()),
          finalize(() => this._isRefreshingToken = false)
        );
    } else {
      return this._tokenSubject
        .pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => next.handle(this._authInterceptor.addToken(req, token)))
        );
    }
  }

  /**
   * обработчик всех ошибок кроме 401 и 500
   * @param req объект запроса приведшего к ошибке
   * @param error объект ошибки
   */
  private _handleError(req: HttpRequest<any>, error: HttpErrorResponse): Observable<IHttpError | HttpErrorResponse> {
    // определяем есть ли заголовок молчания при ошибках
    const silent: boolean = req.headers instanceof HttpHeaders &&
      req.headers.has('silent') &&
      req.headers['silent'] === '1';

    const invalidGrant = error &&
      error.status === 400 &&
      error.error &&
      error.error.error === 'invalid_grant';
    if (invalidGrant) {
      this._relogin();
    } else if (!silent) {
      // каким то образом обрабатываем ошибки
      alert(`Ошибка ${error.status}`);
      console.log(<IApiError>{ response: error, data: (<HttpParams>req.body).toString() });
    }

    const errorEvent = <IHttpError>error.error || error;
    return observableThrowError(errorEvent);
  }

  /**
   * обработчик ошибок 500
   * @param req объект запроса приведшего к ошибке
   * @param error объект ошибки
   */
  private _handle500Error(req: HttpRequest<any>, error: HttpErrorResponse): Observable<HttpErrorResponse> {
    // обрабатываем критические ошибки
    alert(`Ошибка ${error.status}`);
    console.log(<IApiError>{ response: error, data: (<HttpParams>req.body).toString() });
    return observableThrowError(error);
  }

  /**
   * редирект на логин и проброс ошибки в поток
   */
  private _relogin(): Observable<void> {
    this._authService.logout();
    return empty();
  }

}
