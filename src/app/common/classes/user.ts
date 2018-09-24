import { UserBase } from './user-base';
import { IUser } from '../models/user.model';
import { Role } from '../enums/role.enum';

/**
 * пользователь
 */
export class User extends UserBase implements IUser {

  roles: Array<Role> = [];

  constructor(data?: IUser) {
    super(data);
  }

  toJSON(): IUser {
    const data: any = Object.assign({}, this, {
      personalName: this.personalName
    });
    delete data._personalName;
    return <IUser>data;
  }

}
