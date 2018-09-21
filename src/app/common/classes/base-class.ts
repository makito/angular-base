/**
 * базовый класс
 */
export abstract class BaseClass {

  constructor(data?: any) {
    if (!data) {
      return;
    }

    if (typeof data !== 'object') {
      this._init(data);
      return;
    }

    Object.assign(this, data);
  }

  /**
   * представление в виде plain object при сериализации в строку
   */
  public abstract toJSON(): any;

  /**
   * инициализация инстанса данными
   * @param data данные для инициализации
   */
  protected _init(data: any): void { }

}
