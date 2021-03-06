import { NgModule } from "@angular/core";
import { TechinfoproComponent } from "src/app/components/techinfopro/techinfopro.component";
import { SharedModule } from '../shared/shared.module';
import { TechinfoproRoutingModule } from "./techinfopro-routing.module";
import { IndexComponent } from 'src/app/components/techinfopro/index/index.component';
import { ViewComponent } from '../../components/common/documents/view/view.component';
import { ManageDocComponent } from "src/app/components/techinfopro/manage-doc/manage-doc.component";
import { BaseModule } from "../base/base.module";
import { TableModule } from "primeng/table";

@NgModule({
    declarations: [
        TechinfoproComponent,
        IndexComponent,
        ManageDocComponent,
        ViewComponent
    ],
    imports: [
      SharedModule,
      BaseModule,
      TableModule,
      TechinfoproRoutingModule    
    ]
  })
export class  TechinfoproModule { }