import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Base64 } from 'js-base64';
import { environment } from '@env/environment';

import { IToken, Account, IJwt } from '@app/common';
import { ConfigService } from './config.service';

/**
 * сервис авторизации
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
    private _router: Router,
    private _config: ConfigService
  ) {
    // восстанавливаем данные из стораджа
    this._accessTokenRaw = localStorage.getItem(this._config.localStorageNames.accessToken);
    this._refreshToken = localStorage.getItem(this._config.localStorageNames.refreshToken);

    // если в сторадже есть токен то парсим его и восстанавливаем данные пользователя
    if (!!this._accessTokenRaw) {
      this._accessToken = this._parseAccessToken();
      this._account = Account.fromAccessToken(this._accessToken);

      // обновляем токен
      this.refreshToken().subscribe();
      return;
    }

    // если в сторадже есть данные аккаунта - создаём и сохраняем его
    const accountRaw = localStorage.getItem(this._config.localStorageNames.account);
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
      .append('client_id', this._config.clientId)
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
      .append('client_id', this._config.clientId)
      .append('grant_type', 'refresh_token')
      .append('no_auth', '1');
    return this._oauthRequest(body);
  }

  /**
   * сбрасывает признаки авторизации
   */
  reset() {
    localStorage.removeItem(this._config.localStorageNames.accessToken);
    localStorage.removeItem(this._config.localStorageNames.refreshToken);
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
    return this._http.post<IJwt>(`${environment.authUrl}token`, body)
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
    localStorage.setItem(this._config.localStorageNames.accessToken, this._accessTokenRaw);

    this._accessToken = this._parseAccessToken();

    this._refreshToken = jwt.refresh_token;
    localStorage.setItem(this._config.localStorageNames.refreshToken, this._refreshToken);

    this._account = Account.fromAccessToken(this._accessToken);
    localStorage.setItem(this._config.localStorageNames.account, JSON.stringify(this._account));
  }
}
