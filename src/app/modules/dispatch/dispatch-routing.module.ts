import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchComponent } from './dispatch/dispatch.component';
import { IndexComponent } from './dispatch/index/index.component';

const routes: Routes = [
  {path: '', component: DispatchComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
  ]}
];

/* {path: '', component: ThreadspageComponent, children: [
  {path: '', component: IndexComponent, data: {reuseRoute: true}},
  {path: 'manage', component: ManageComponent},
  {path: 'manage/new', component: ManageComponent},
  {path: 'manage/edit/:id', component: ManageComponent},
  {path: 'view/:id', component: ViewComponent},
  {path: 'view/:id/:domainId', component: ViewComponent},
  {path: 'view/:id/:domainId/:userId', component: ViewComponent},
  {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
]} */

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }
