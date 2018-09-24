import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponent } from './page/page.component';
import { TT } from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
    data: {
      title: TT('Домашняя страница')
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
