import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterState, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { has } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [TranslatePipe],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private readonly _baseUrlTitle: string = 'angular-base';

  constructor(
    private _translatePipe: TranslatePipe,
    private _titleService: Title,
    private _router: Router
  ) { }

  ngOnInit() {
    // смена title страницы
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const pathTitle = this._getTitle(this._router.routerState, this._router.routerState.root).join(' • ');
        const title = pathTitle.length === 0 ?
          this._baseUrlTitle :
          this._baseUrlTitle + ' • ' + pathTitle;
        this._titleService.setTitle(title);
      }
    });
  }

  /**
   * получить title страницы
   * @param state состояние роута
   * @param parent родительский роут
   */
  private _getTitle(state: RouterState, parent: ActivatedRoute) {
    const data = [];
    if ( has(parent, 'snapshot.data.title') ) {
      data.push( this._translatePipe.transform(parent.snapshot.data.title) );
    }

    if (!!state && !!parent) {
      data.push(... this._getTitle(state, (state as any).firstChild(parent)));
    }
    return data;
  }

}
