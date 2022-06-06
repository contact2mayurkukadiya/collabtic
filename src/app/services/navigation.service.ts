import { Injectable } from '@angular/core';
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private history: string[] = []
  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
  }

  back(): void {
    let aurl = 'threads';
    let sNavUrl = localStorage.getItem('sNavUrl');
    aurl = (sNavUrl != null) ? sNavUrl : aurl;       
    history.pushState(null, null, "/"+aurl);
    history.pushState(null, null, "/search-page");      
    setTimeout(() => {
      this.location.back(); 
    }, 10);           
  }
}
