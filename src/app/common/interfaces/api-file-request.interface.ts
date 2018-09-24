/**
 * обёртка для ответа сервера на запрос файла
 */
export interface IApiFileRequest {

  /**
   * имя файла
   */
  fileName: string;

  /**
   * сам файл
   */
  file: ArrayBuffer;

}
