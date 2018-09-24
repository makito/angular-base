import { IAccount } from '../models/account.model';
import { User } from './user';
import { BaseClass } from './base-class';
import { IToken } from '../interfaces/token.interface';
import { Role } from '../enums/role.enum';
import { UserName } from './user-name';

/**
 * аккаунт пользователя
 */
export class Account extends BaseClass implements IAccount {

  /**
   * токен
   */
  private _token: IToken;

  private _user: User = new User();

  id = '';
  userName = '';

  public get user(): User {
    return this._user;
  }
  public set user(value: User) {
    this._user = value instanceof User ?
      value :
      new User(value);
  }

  /**
   * создание объекта авторизованного пользователя по данным токена
   * @param token данные токена
   */
  static fromAccessToken(token: IToken): Account {
    const result = new Account({
      id: token.account_id,
      userName: token.name,
      user: new User({
        id: token.user_id,
        personalName: new UserName(token.name),
        roles: token.role
      })
    });
    result._token = token;
    return result;
  }

  /**
   * признак админа
   */
  get isAdmin(): boolean {
    return this.hasAnyRole([Role.Admin]);
  }

  constructor(data?: IAccount) {
    super(data);
  }

  /**
   * проверяет проходит ли пользователь по ролям
   * @param roles массив ролей на проверку
   */
  hasAnyRole(roles: Array<Role>): boolean {
    if (!this._token || !this._token.role) {
      return false;
    }

    return this._token.role.some(val => roles.indexOf(val) > -1);
  }

  toJSON(): IAccount {
    const data: any = Object.assign({}, this, {
      user: this.user
    });
    delete data._user;
    delete data._token;
    return <IAccount>data;
  }

}
