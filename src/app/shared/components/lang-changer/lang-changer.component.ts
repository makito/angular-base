import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    private _translate: TranslateService
  ) {
    // установка языка
    this._setLanguage();
  }

  ngOnInit() {
  }

  /**
   * смена языка интерфейса
   * @param lang код локали
   */
  onChangeLang(lang: string) {
    this._translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  /**
   * производит установку языковой версии
   */
  private _setLanguage() {
    this._translate.addLangs(['en', 'ru']);
    this._translate.setDefaultLang('ru');
    const browserLang = localStorage.getItem('lang') || this._translate.getBrowserLang();
    this._translate.use(browserLang.match(/en|ru/) ? browserLang : 'ru');
    localStorage.setItem('lang', this.currentLang);
  }

}
