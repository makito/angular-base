import { Role } from '../enums/role.enum';

/**
 * описание токена в браузере
 */
export interface IToken {

  /**
   * роль пользователя
   */
  role: Array<Role>;

  /**
   * ключ приложения
   */
  client_id?: number;

  /**
   * время жизни токена
   */
  exp: number;

  /**
   * имя авторизованного пользователя
   */
  name: string;

  /**
   * идентификатор аккаунта
   */
  account_id?: string;

  /**
   * идентификатор пользователя
   */
  user_id?: number;

}
