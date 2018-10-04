import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Message } from './message';
import { IApiError } from '../models/api-error.model';
import { IHttpError } from '../interfaces/http-error.interface';
import { TT } from '../misc/localization';

/**
 * класс ошибки при обращении к апи
 */
export class ApiError extends Message implements IApiError {

  response: HttpErrorResponse;
  request: HttpRequest<any>;

  /**
   * код ошибки
   */
  get code(): string {
    return !!this.response ?
      this.response.status.toString() :
      'unknown';
  }
  set code(val: string) {}

  /**
   * сообщение ошибки
   */
  get message(): string {
    if (!this.response) {
      return TT('Неустановленная ошибка');
    } else if (this.code === '404') {
      return this.response.message;
    } else {
      return this.errorDescription.error;
    }
  }
  set message(val: string) {}

  /**
   * описание ошибки
   */
  get errorDescription(): IHttpError {
    return this.response.error;
  }

  /**
   * признак критической ошибки
   */
  get criticalError(): boolean {
    return this.code === '500';
  }

  constructor(data?: IApiError) {
    super();

    if (!data) {
      return;
    }

    // преобразуем ошибку из arraybuffer
    data.response = this._restoreErrorFromArrayBuffer(data.response);
    Object.assign(this, data);
  }

  toJSON(): IApiError {
    const data: IApiError = Object.assign({}, this, {
      code: this.code,
      message: this.message
    });
    return data;
  }

  /**
   * восстановление ответа сервера об ошибке из arraybuffer
   * так как ангуляр возвращает ошибку в том типе, в котором был запрос
   * @param error ошибка http
   */
  private _restoreErrorFromArrayBuffer(error: HttpErrorResponse): HttpErrorResponse {
    if (!(error.error instanceof ArrayBuffer)) {
      return error;
    }

    const clonedError = { ...error };
    const decodedString = String.fromCharCode.apply(null, new Uint8Array(error.error));
    clonedError.error = JSON.parse(decodeURIComponent(escape(decodedString)));
    return new HttpErrorResponse(clonedError);
  }

}
