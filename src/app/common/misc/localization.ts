import { Injector } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '@app/core';

/**
 * специальная функция-маркер для извлечения строк перевода из кода
 * @param str строка перевода
 */
export const TT = (str: string): string => str;

/**
 * фабрика установки дефолтной локали и предзагрузки переводов приложения
 * @param translate сервис переводов
 * @param injector инжектор
 * @param config сервис конфигурации приложения
 */
export const preloadTranslates = (translate: TranslateService, injector: Injector, config: ConfigService) => {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      // доступные переводы
      const availableLangs = ['ru', 'en'];
      const defLang = availableLangs[0];
      translate.addLangs(availableLangs);
      const browserLang = localStorage.getItem(config.localStorageNames.language) ||
        translate.getBrowserLang();
      const useLang = browserLang.match(/en|ru/) ?
        browserLang :
        defLang;
      translate.use(useLang)
        .subscribe(
          () => localStorage.setItem(config.localStorageNames.language, translate.currentLang),
          () => console.error(`Problem with '${defLang}' language initialization.'`),
          () => resolve(null)
        );
    });
  });
};
