import { HttpClient } from '@angular/common/http';

import { AuthService } from '@app/core';

/**
 * абстрактный класс интерсепторов задействованных при авторизации
 */
export abstract class AuthAbstractInterceptor {

  /**
   * инициализация
   */
  abstract init(http: HttpClient, auth: AuthService);

}
