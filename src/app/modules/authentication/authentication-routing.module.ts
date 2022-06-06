import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ResetpasswordComponent } from './components/auth/resetpassword/resetpassword.component';
import { EmailverificationComponent } from './components/auth/emailverification/emailverification.component';
import { UrlnotfoundComponent } from './components/auth/urlnotfound/urlnotfound.component';
import { IntegrationComponent } from './components/auth/integration/integration.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      {path: '', component: LoginComponent},
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'resetpassword', component: ResetpasswordComponent},
      {path: 'emailverification', component: EmailverificationComponent},
      {path: 'urlnotfound', component: UrlnotfoundComponent},
      {path: 'integration', component: IntegrationComponent}    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
