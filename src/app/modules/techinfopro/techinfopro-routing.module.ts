import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from "src/app/components/techinfopro/index/index.component";
import { TechinfoproComponent } from "src/app/components/techinfopro/techinfopro.component";
import { ViewComponent } from '../../components/common/documents/view/view.component';
import { ManageDocComponent } from "src/app/components/techinfopro/manage-doc/manage-doc.component";

const routes: Routes = [
    {
        path: '', component: TechinfoproComponent, children: [
            { path: '', component: IndexComponent, data: {reuseRoute: true} },
            { path: 'manage/:access', component: ManageDocComponent },
            { path: 'manage/edit/:id', component: ManageDocComponent },
            { path : 'view/:id', component: ViewComponent },
            {path: 'view/:id/:replyId/:domainId/:userId/:workstreamId', component: ViewComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TechinfoproRoutingModule { }