import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { tap, concatMap, finalize } from 'rxjs/operators';

import { TT, AuthService } from '@app/core';
import { User, IHttpError } from '@app/common';

/**
 * страница авторизации
 */
@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, AfterViewChecked {

  /**
   * элемент для фокуса ввода
   */
  private _elementToFocus: ElementRef;

  /**
   * компонент поля логина
   */
  @ViewChild('userName') private _userNameElement: ElementRef;

  /**
   * компонент поля пароля
   */
  @ViewChild('password') private _passwordElement: ElementRef;

  /**
   * признак асинхронных действий
   */
  isLoading = false;

  /**
   * отображаемая ошибка
   */
  error = '';

  /**
   * данные последнего авторизованного пользователя
   */
  recentUser: User;

  /**
   * форма логина
   */
  loginForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    // создаём форму
    this.loginForm = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // подписываемся на изменение формы
    this.loginForm.statusChanges.subscribe(() => this.error = '');

    // сбрасываем авторизацию
    this._authService.reset();
    const recentAccount = this._authService.account;

    // если в сторадже нет пользователя - ставим фокус в поле логина
    if (!recentAccount) {
      this._elementToFocus = this._userNameElement;
      return;
    }

    const login = this.loginForm.get('userName');
    this.recentUser = recentAccount.user;
    login.patchValue(recentAccount.userName);
    login.updateValueAndValidity();
    this._elementToFocus = this._passwordElement;
  }

  ngAfterViewChecked() {
    // ставим фокус в нужное поле
    if (!!this._elementToFocus) {
      this._elementToFocus.nativeElement.focus();
      this._elementToFocus = null;
    }
  }

  /**
   * авторизация пользователя
   * @param userName логин
   * @param password пароль
   */
  login(userName: string, password: string) {
    of(this.isLoading = true)
      .pipe(
        tap(() => this.error = ''),
        concatMap(() => this._authService.authenticate(userName, password)),
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        // если был редирект на форму логина то возвращаем после авторизации обратно
        if (!!this._authService.redirectUrl) {
          this._router.navigateByUrl(this._authService.redirectUrl);
        } else {
          this._router.navigate(['/']);
        }
        }, (error: IHttpError | HttpErrorResponse) => {
          this.error = (<IHttpError>error).error_description || TT('Неправильный логин или пароль');
          this._elementToFocus = this._passwordElement;
        }
      );
  }

}
