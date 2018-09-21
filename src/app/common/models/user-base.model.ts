import { UserName } from '../classes/user-name';

/**
 * модель базового пользователя
 */
export interface IUserBase {

  /**
   * Идентификатор пользователя
   */
  id: number;

  /**
   * Полное имя
   */
  personalName: UserName;

}
