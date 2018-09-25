import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LangChangerComponent } from './components/lang-changer/lang-changer.component';
import { MaxLengthDirective } from './directives/max-length.directive';
import { DisableControlDirective } from './directives/disable-control.directive';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { PreventDefaultDirective } from './directives/prevent-default.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    PageNotFoundComponent,
    LangChangerComponent,
    MaxLengthDirective,
    DisableControlDirective,
    StopPropagationDirective,
    PreventDefaultDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    PageNotFoundComponent,
    LangChangerComponent,
    MaxLengthDirective,
    DisableControlDirective,
    StopPropagationDirective,
    PreventDefaultDirective
  ]
})
export class SharedModule { }
