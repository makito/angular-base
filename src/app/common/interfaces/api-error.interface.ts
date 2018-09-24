import { HttpErrorResponse } from '@angular/common/http';

/**
 * модель ответа при ошибке доступа по апи
 */
export interface IApiError {

  /**
   * ответ сервера
   */
  response: HttpErrorResponse;

  /**
   * данные запроса/ответа
   */
  data?: any;

}
