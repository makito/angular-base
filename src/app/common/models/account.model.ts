import { User } from '../classes/user';

/**
 * модель аккаунта пользователя
 */
export interface IAccount {

  /**
   * Идентификатор аккаунта
   */
  id: string;

  /**
   * логин аккаунта
   */
  userName: string;

  /**
   * Пользователь аккаунта
   */
  user: User;

}
