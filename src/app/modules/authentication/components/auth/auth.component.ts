import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Constant, IsOpenNewTab, windowHeight } from '../../../../common/constant/constant';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  public bodyClass:string = "auth";
  public bodyElem;
  public footerElem;
  public redirectUrl = "landing-page";
  public redirectUrlTeam = "threads";
  public userId: any = '0';
  public loading: boolean = true;
  public teamSystem = localStorage.getItem("teamSystem");
 
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {

    // check fieldpulse or not...
    let currentURL = window.location.href;
    //console.log(currentURL);
    let splittedURL1 = currentURL.split("://");
    //console.log(splittedURL1);
    //splittedURL1[1] = "collabtic.fieldpulse.co";
    let splittedURL2 = splittedURL1[1].split(".");
    
    let splittedDomainURL1 = splittedURL2[0];
    let splittedDomainURL2 = splittedURL2[1];
    //console.log(splittedDomainURL1);
    //console.log(splittedDomainURL2);
    
    let splittedDomainURL = splittedURL2[0];
    let splittedDomainURLLocal = splittedDomainURL.split(":");
    //console.log(splittedDomainURLLocal[0] + "---" + Constant.forumLocal);

    if( splittedDomainURL2 == 'fieldpulse' || splittedDomainURLLocal[0] == Constant.forumLocal ){ /* fieldpulse ms integration */  }
    else{
      var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        /* your code here */
        //alert("Mobile");
        if (window.screen.width < 800) {
          // do something
          let deeplinkURL = Constant.deeplinkurl;
          this.router.navigate([deeplinkURL]);  
        }      
      }
      else{
        //alert("Desktop");      
      }
    }       
        
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.remove('parts-list');  
    this.bodyElem.classList.add(this.bodyClass);

    this.userId = this.getQueryParamFromMalformedURL('userid');          
    //console.log( this.userId);
    //console.log(this.authenticationService.userValue);

    if(this.userId == '0'){
      if (this.authenticationService.userValue) {     
        let teamSystem= localStorage.getItem('teamSystem');
        if(teamSystem){
          this.router.navigate([this.redirectUrlTeam]);   
        }
        else{
          this.router.navigate([this.redirectUrl]);   
        } 
      }
      else{
        this.loading = false;
      }
    }
    else
    {
      this.loading = false;
    }

  }

  getQueryParamFromMalformedURL(userid) {
    const results = new RegExp('[\\?&]' + userid + '=([^&#]*)').exec(decodeURIComponent(this.router.url)); // or window.location.href
    if (!results) {
        return 0;
    }
    return results[1] || 0;
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass); 
    this.loading = false;   
  }

}
