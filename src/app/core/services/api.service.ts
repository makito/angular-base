import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { IApiFileRequest } from '@app/common';

/**
 * сервис доступа к api
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /**
   * ответ сервера вместе с названием файла с верным расширением по заголовку ответа
   * @param response полный ответ сервера с заголовками
   * @param fileName имя скачиваемого файла
   */
  private static _responseWithFileName(response: HttpResponse<any>, fileName: string): IApiFileRequest {
    // узнаем из заголовков тип файла и выставляем расширение файла
    const ext = response.headers.get('Content-Type').split('/')[1];
    return {
      fileName: `${fileName}.${ext}`,
      file: response.body
    };
  }

  /**
   * скачивание файла
   * @param file блоб файла
   * @param fileName имя файла
   */
  static downloadFile(file: Blob, fileName: string) {
    // для ie
    if (!!window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(file, fileName);
    } else {
      // для всех остальных браузеров
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = fileName;
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', false, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      link.dispatchEvent(event);
    }
  }

  constructor(
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  /**
   * метод доступа к апи сервера
   * @param action экшн к апи
   * @param body данные запроса
   * @param method метод для обращения к серверу
   * @param responseType тип ответа
   * @param downloadFileName имя файла для сохранения результата
   * @param silent признак игнорирования ошибок при обращении к апи
   */
  request<T, V>(
    action: string = '',
    body?: V,
    method: 'post' | 'get' = 'post',
    responseType: 'json' | 'arraybuffer' | 'text' = 'json',
    downloadFileName: string = '',
    silent: boolean = false
  ): Observable<T> {
    if (downloadFileName.length > 0) {
      responseType = 'arraybuffer';
    }

    const opts: any = {
      responseType,
      observe: 'response',
      headers: new HttpHeaders({ silent: silent ? '1' : '0' })
    };
    const req = method === 'get' ?
      this._http.get<T>(action, opts) :
      this._http.post<T>(action, body, opts);
    return req
      .pipe(
        map((response: HttpResponse<any>) => {
          // если это не запрос файла по get, отдаём тело ответа, иначе весь ответ,
          // так как нужен заголовок для определения типа файла
          return responseType === 'arraybuffer' && method === 'get' ?
            ApiService._responseWithFileName(response, downloadFileName) :
            response.body;
        }),
        tap((response: any) => {
          // если происходит сохранение в файл - создаём ссылку и загружаем ресурс
          if (responseType === 'arraybuffer' && method !== 'get') {
            ApiService.downloadFile(new Blob([response]), downloadFileName);
          }
        })
      );
  }

}
