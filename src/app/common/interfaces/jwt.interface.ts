/**
 * описание токена авторизации
 */
export interface IJwt {

  /**
   * токен доступа
   */
  access_token: string;

  /**
   * тип токена
   */
  token_type: string;

  /**
   * время жизни токена
   */
  expires_in: number;

  /**
   * рефреш токен
   */
  refresh_token: string;

}
