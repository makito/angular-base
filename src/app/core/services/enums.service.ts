import { Injectable } from '@angular/core';

import { DescribedValue, Role } from '@app/common';

/**
 * сервис для получения значений перечислений
 */
@Injectable({
  providedIn: 'root'
})
export class EnumsService {

  /**
   * роли на проекте
   */
  get roles(): Array<DescribedValue<Role>> {
    return [
      new DescribedValue(Role.Admin, 'Администратор')
    ];
  }

  constructor() { }

}
