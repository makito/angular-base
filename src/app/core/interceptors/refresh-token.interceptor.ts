import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable, BehaviorSubject, empty } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { AuthAbstractInterceptor, ApiError } from '@app/common';

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

  constructor(
    private _authInterceptor: AuthInterceptor
  ) {
    super();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<ApiError | any> => {
          const apiError = new ApiError({ request, response: error });

          switch (error.status) {
            case 401:
              return this._handle401Error(request, next);
            case 500:
              return this._handle500Error(apiError);
            default:
              return this._handleError(apiError);
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
   * @param error объект ошибки
   */
  private _handleError(error: ApiError): Observable<ApiError> {
    // определяем есть ли заголовок молчания при ошибках
    const silent: boolean = error.request.headers.get('silent') === '1';

    const invalidGrant = error.code === '400' &&
      error.message === 'invalid_grant';
    if (invalidGrant) {
      this._relogin();
    } else if (!silent) {
      // обрабатываем ошибку
      alert(`Ошибка ${error.code}`);
    }

    return observableThrowError(error);
  }

  /**
   * обработчик ошибок 500
   * @param error объект ошибки
   */
  private _handle500Error(error: ApiError): Observable<ApiError> {
    // обрабатываем ошибку
    alert(`Ошибка ${error.code}`);
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
