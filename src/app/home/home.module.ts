import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { PageComponent } from './page/page.component';

@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [PageComponent]
})
export class HomeModule { }
