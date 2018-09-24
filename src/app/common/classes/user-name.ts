import { IUserName } from '../models/user-name.model';
import { BaseClass } from './base-class';

/**
 * класс имени пользователя
 */
export class UserName extends BaseClass implements IUserName {

  /**
   * максимальная длина поля фамилии
   */
  static readonly maxLastNameLength: number = 40;

  /**
   * максимальная длина поля имени
   */
  static readonly maxFirstNameLength: number = 20;

  /**
   * максимальная длина поля отчества
   */
  static readonly maxMiddleNameLength: number = 20;

  lastName = '';
  firstName = '';
  middleName = '';

  constructor(data?: IUserName | string) {
    super(data);
  }

  toString(): string {
    return `${this.lastName || ''} ${this.firstName || ''} ${this.middleName || ''}`.trim();
  }

  toJSON(): IUserName {
    return Object.assign({}, this);
  }

  /**
   * инициализация инстанса если в конструктор передана строка
   * @param data строка имени
   */
  protected _init(data: string): void {
    this.firstName = data;
  }

}
