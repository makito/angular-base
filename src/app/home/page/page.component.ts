import { Component, OnInit } from '@angular/core';

import { AuthService } from '@app/core';

/**
 * главная страница приложения
 */
@Component({
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  constructor(
    private _authService: AuthService
  ) { }

  ngOnInit() {
  }

  logout(e: Event) {
    e.preventDefault();
    this._authService.logout();
  }

}
