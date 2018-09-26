import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '@app/core';

/**
 * компонент смены языка приложения
 */
@Component({
  selector: 'lang-changer',
  templateUrl: './lang-changer.component.html',
  styleUrls: ['./lang-changer.component.scss']
})
export class LangChangerComponent implements OnInit {

  /**
   * текущий выбранный язык
   */
  get currentLang(): string {
    return this._translate.currentLang;
  }

  /**
   * доступные для выбора языки
   */
  get langs(): Array<string> {
    return this._translate.getLangs();
  }

  constructor(
    private _translate: TranslateService,
    private _config: ConfigService
  ) { }

  ngOnInit() {
  }

  /**
   * смена языка интерфейса
   * @param lang код локали
   */
  onChangeLang(lang: string) {
    this._translate.use(lang);
    localStorage.setItem(this._config.localStorageNames.language, lang);
  }

}
