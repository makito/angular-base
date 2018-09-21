import { Injectable } from '@angular/core';

import { DescribedValue, Role } from '@app/common';
import { TT } from '../translation-marker';

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
      new DescribedValue(Role.Admin, TT('Администратор'))
    ];
  }

  constructor() { }

}
