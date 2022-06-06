import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import {
    pageInfo,
    Constant,
    PlatFormType,
    PlatFormNames,
} from "src/app/common/constant/constant";
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;
        if (user) {
            // logged in so return true
            console.log("login..");
            let platformId = localStorage.getItem("platformId");
            if (platformId != '1') {
                let returnVal = this.authenticationService.checkDomain();
                return returnVal;
            }
            else {
                return true;
            }
            // return true;          
        }

        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
        let authteam = '';
        if (window.location.host == Constant.knowledgeForumHostName) {
            authteam = '1';
        }
        else {
            authteam = localStorage.getItem('teamSystem');
        }

        if (authteam) {
            this.router.navigate(['auth/integration']);
        }
        else {
            this.router.navigate(['auth']);
        }
        return false;
    }
}