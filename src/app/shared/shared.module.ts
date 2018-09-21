import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LangChangerComponent } from './components/lang-changer/lang-changer.component';

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
    LangChangerComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    PageNotFoundComponent,
    LangChangerComponent
  ]
})
export class SharedModule { }
