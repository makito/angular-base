import { UserName } from './user-name';
import { IUserBase } from '../models/user-base.model';

/**
 * базовый пользователь
 */
export abstract class UserBase implements IUserBase {

  /**
   * имя пользователя
   */
  private _personalName: UserName = new UserName();

  id: number = null;

  /**
   * имя пользователя
   */
  public get personalName(): UserName {
    return this._personalName;
  }
  public set personalName(value: UserName) {
    this._personalName = this._setName(value);
  }

  /**
   * создаёт объект имени пльзователя
   * @param name строка или объект имени
   */
  protected _setName(name: UserName | string): UserName {
    return name instanceof UserName ?
      name :
      new UserName(name);
  }

}
