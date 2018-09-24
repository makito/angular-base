/**
 * модель имени пользователя
 */
export interface IUserName {

  /**
   * фамилия
   */
  lastName: string;

  /**
   * имя
   */
  firstName: string;

  /**
   * отчество
   */
  middleName?: string;

}
