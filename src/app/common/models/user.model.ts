import { IUserBase } from './user-base.model';
import { Role } from '../enums/role.enum';

/**
 * модель пользователя
 */
export interface IUser extends IUserBase {

  /**
   * роли пользователя
   */
  roles: Array<Role>;

}
