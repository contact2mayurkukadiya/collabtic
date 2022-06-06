import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadspageComponent } from './threadspage/threadspage.component';
import { IndexComponent } from './threadspage/index/index.component';
import { ManageComponent } from './threadspage/manage/manage.component';
import { ViewComponent } from './threadspage/view/view.component';

const routes: Routes = [
    {path: '', component: ThreadspageComponent, children: [
    {path: '', component: IndexComponent, data: {reuseRoute: true}},
    {path: 'manage', component: ManageComponent},
    {path: 'manage/new', component: ManageComponent},
    {path: 'manage/edit/:id', component: ManageComponent},
    {path: 'view/:id', component: ViewComponent},
    {path: 'view/:id/:domainId', component: ViewComponent},
    {path: 'view/:id/:domainId/:userId', component: ViewComponent},
    {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreadsLandingRoutingModule { }
