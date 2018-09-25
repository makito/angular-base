/**
 * описание ошибки http от сервера
 */
export interface IHttpError {

  /**
   * тип ошибки
   */
  error: string;

  /**
   * описание ошибки
   */
  error_description: string;

}
