//Core Imports
import {
  CommonModule
} from '@angular/common';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

//Third-Party Imports
import {
  ChartsModule
} from 'ng2-charts';

import {
  CollapseModule
} from 'ngx-bootstrap/collapse/collapse.module';

import {
  ModalModule,
  PopoverModule,
  TooltipModule
} from 'ngx-bootstrap';

//Application Imports
import {
  PageNotFoundComponent
} from 'shared/pages';

@NgModule({
  imports: [
    CollapseModule.forRoot(),
    CommonModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    CollapseModule,
    CommonModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    PopoverModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  declarations: [PageNotFoundComponent]
})
export class SharedModule { }
