import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditComponent } from "./gts/edit/edit.component";
import { GtsComponent } from "./gts/gts.component";
import { IndexComponent } from "./gts/index/index.component";
import { NewComponent } from "./gts/new/new.component";
import { StartComponent } from './gts/start/start.component';
import { ViewComponent } from "./gts/view/view.component";
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: "",
    component: GtsComponent,
    children: [
      { path: "", component: IndexComponent, data: { reuseRoute: true } },
      { path: "new", component: NewComponent },
      { path: "view/:gid", component: ViewComponent },
      { path: "edit/:gid", component: EditComponent },
      { path: "edit/:gid/:actionId", component: EditComponent },
      { path: "duplicate/:gid", component: EditComponent },
      { path: 'start/:gid', component: LayoutComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GtsRoutingModule { }
