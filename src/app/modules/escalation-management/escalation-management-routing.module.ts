import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EscalationMatrixComponent } from './components/escalation-matrix/escalation-matrix.component';
import { IndexComponent } from './components/escalation-matrix/index/index.component';
import { SeeMoreComponent } from './components/escalation-matrix/see-more/see-more.component';

const routes: Routes = [
  {
    path: '', component: EscalationMatrixComponent, children: [
      {path: '', component: IndexComponent},
      {path: 'escalation-matrix', component: IndexComponent},
      {path: 'escalation-tvs', component: SeeMoreComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscalationManagementRoutingModule { }
