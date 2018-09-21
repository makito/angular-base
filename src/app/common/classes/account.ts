import { IAccount } from '../models/account.model';
import { User } from './user';
import { BaseClass } from './base-class';

/**
 * аккаунт пользователя
 */
export class Account extends BaseClass implements IAccount {

  id = '';
  userName = '';
  user: User = new User();

  constructor(data?: IAccount) {
    super(data);
  }

  /**
   * представление в виде
   */
  toJSON(): any {
    return Object.assign({}, this);
  }

}
