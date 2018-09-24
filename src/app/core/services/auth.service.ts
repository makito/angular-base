import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Base64 } from 'js-base64';

import { IToken, Account, IJwt } from '@app/common';

/**
 * сервис авторизации
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * идентификатор приложения
   */
  private static readonly _clientId: string = 'c2339ced32ae4fd1949cc91f387100ba';

  /**
   * имя поля токена авторизации в локалсторадже
   */
  private static readonly _jwtAccessTokenKey: string = 'jwt_access_token';

  /**
   * имя поля токена рефреша в локалсторадже
   */
  private static readonly _jwtRefreshTokenKey: string = 'jwt_refresh_token';

  /**
   * имя поля сохранённого аккаунта в локалсторадже
   */
  private static readonly _recentAccountKey: string = 'recent_account';

  /**
   * основной url авторизации
   */
  private static _oauthBaseUrl = '/';

  /**
   * нераспарсенный токен
   */
  private _accessTokenRaw: string;

  /**
   * токен авторизации
   */
  private _accessToken: IToken;

  /**
   * токен рефреша
   */
  private _refreshToken: string;

  /**
   * данные залогиненного пользователя
   */
  private _account: Account;

  /**
   * ссылка с которой произошёл редирект на страницу логина
   */
  redirectUrl: string;

  /**
   * токен авторизации
   */
  get accessToken(): IToken {
    return this._accessToken;
  }

  /**
   * нераспарсенный токен
   */
  get accessTokenRaw(): string {
    return this._accessTokenRaw;
  }

  /**
   * признак авторизованности
   */
  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * аккаунт пользователя
   */
  get account(): Account {
    return this._account;
  }

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) {
    // восстанавливаем данные из стораджа
    this._accessTokenRaw = localStorage.getItem(AuthService._jwtAccessTokenKey);
    this._refreshToken = localStorage.getItem(AuthService._jwtRefreshTokenKey);

    // если в сторадже есть токен то парсим его и восстанавливаем данные пользователя
    if (!!this._accessTokenRaw) {
      this._accessToken = this._parseAccessToken();
      this._account = Account.fromAccessToken(this._accessToken);

      // обновляем токен
      this.refreshToken().subscribe();
      return;
    }

    // если в сторадже есть данные аккаунта - создаём и сохраняем его
    const accountRaw = localStorage.getItem(AuthService._recentAccountKey);
    if (!!accountRaw) {
      this._account = new Account(JSON.parse(accountRaw));
    }
  }

  /**
   * производит авторизацию пользователя
   * @param userName логин
   * @param password пароль
   */
  authenticate(userName: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('userName', userName)
      .append('password', password)
      .append('client_id', AuthService._clientId)
      .append('grant_type', 'password')
      .append('no_auth', '1');
    return this._oauthRequest(body);
  }

  /**
   * обновляет токен
   * @param token возможный refresh-токен
   */
  refreshToken(token: string = this._refreshToken): Observable<any> {
    const body = new HttpParams()
      .set('refresh_token', token)
      .append('client_id', AuthService._clientId)
      .append('grant_type', 'refresh_token')
      .append('no_auth', '1');
    return this._oauthRequest(body);
  }

  /**
   * сбрасывает признаки авторизации
   */
  reset() {
    localStorage.removeItem(AuthService._jwtAccessTokenKey);
    localStorage.removeItem(AuthService._jwtRefreshTokenKey);
    this._accessTokenRaw = null;
    this._accessToken  = null;
  }

  /**
   * сбрасывает авторизацию и редиректит на страницу логина
   */
  logout() {
    this.reset();
    this._router.navigate(['/login']);
  }

  /**
   * парсит токен и возвращает его json представление
   */
  private _parseAccessToken(): IToken {
    const jsonRaw = Base64.decode(this._accessTokenRaw.split('.')[1]);
    return JSON.parse(jsonRaw);
  }

  /**
   * производит запрос авторизации/обновления токена
   * @param body объект параметров запроса
   */
  private _oauthRequest(body: HttpParams): Observable<IJwt> {
    return this._http.post<IJwt>(`${AuthService._oauthBaseUrl}token`, body)
      .pipe(
        tap(this._onSuccessRespone.bind(this))
      );
  }

  /**
   * запись данных из токена в свойства и локалсторадж
   * @param response объект ответа
   */
  private _onSuccessRespone(response: IJwt): void {
    const jwt = response;

    this._accessTokenRaw = jwt.access_token;
    localStorage.setItem(AuthService._jwtAccessTokenKey, this._accessTokenRaw);

    this._accessToken = this._parseAccessToken();

    this._refreshToken = jwt.refresh_token;
    localStorage.setItem(AuthService._jwtRefreshTokenKey, this._refreshToken);

    this._account = Account.fromAccessToken(this._accessToken);
    localStorage.setItem(AuthService._recentAccountKey, JSON.stringify(this._account));
  }
}
