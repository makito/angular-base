import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { IMessage } from './message.model';

/**
 * модель ответа при ошибке доступа по апи
 */
export interface IApiError extends IMessage {

  /**
   * ответ сервера
   */
  response: HttpErrorResponse;

  /**
   * данные запроса
   */
  request?: HttpRequest<any>;

}
