import { Injectable } from '@angular/core';

/**
 * сервис конфигурации приложения
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  /**
   * имена полей в локалсторадже
   */
  readonly localStorageNames = {
    /**
     * имя поля токена авторизации в локалсторадже
     */
    accessToken: 'jwt_access_token',
    /**
     * имя поля токена рефреша в локалсторадже
     */
    refreshToken: 'jwt_refresh_token',
    /**
     * имя поля сохранённого аккаунта в локалсторадже
     */
    account: 'recent_account',
    /**
     * имя поля выбранного языка в локалсторадже
     */
    language: 'lang'
  };

  /**
   * идентификатор приложения
   */
  readonly clientId = 'app_client_id';

  constructor() { }

  load(): Promise<any> {
    return new Promise(resolve => resolve(true));
  }
}
