import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ThreadsLandingRoutingModule } from './threads-landing-routing.module';
import { ThreadspageComponent } from './threadspage/threadspage.component';
import { IndexComponent } from './threadspage/index/index.component';
import {DropdownModule} from 'primeng/dropdown';
import { ManageComponent } from './threadspage/manage/manage.component';
import { ViewComponent } from './threadspage/view/view.component';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [ThreadspageComponent,IndexComponent, ManageComponent, ViewComponent],
  imports: [
    CommonModule,
    ThreadsLandingRoutingModule,
    SharedModule,
    DropdownModule,
    NgxPrintModule
  ]
})
export class ThreadsLandingModule { }
