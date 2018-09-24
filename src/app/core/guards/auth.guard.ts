import { Injectable } from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad,
  Router, Route
} from '@angular/router';
import { Observable } from 'rxjs';
import { has } from 'lodash';

import { AuthService } from '../services/auth.service';
import { Role } from '@app/common';

/**
 * гард для требующих авторизации страниц
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private _router: Router,
    private _authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._checkPermissions(next, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this._checkPermissions(childRoute, state);
  }

  canLoad(route: Route): boolean {
    return this._checkPermissions(route, null);
  }

  /**
   * проверяет возможность доступа для текущего пользователя на роут
   * @param route роут к которому идёт попытка обращения
   * @param state снапшот роута
   */
  private _checkPermissions(
    route: ActivatedRouteSnapshot | Route,
    state: RouterStateSnapshot | null
  ): boolean {
    // сохраняем урл страницы для возврата на неё в случае проблем с авторизацией
    this._authService.redirectUrl = state && state.url;

    // если токена нет в сторадже, значит пользователь не авторизован - редиректим на форму логина
    const accessToken = this._authService.accessToken;
    if (!accessToken) {
      this._router.navigate(['/login']);
      return false;
    }

    // пользователь с паравами администратора имеет доступ везде
    if (this._authService.account.isAdmin) {
      return true;
    }

    // если у роута нет особых требований к роли пользователя
    if (!has(route, 'data.roles')) {
      return true;
    }

    // смотрим на особые роли для роута
    const specRoles: Array<Role> = route.data.roles;

    // запрещен доступ по роли
    const accessDeniedByRole = specRoles.length > 0 &&
      !this._authService.account.hasAnyRole(specRoles);

    // если пользователь не проходит по роли на роут - запрет входа и редирект на home
    if (accessDeniedByRole) {
      this._router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
