import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollTopService } from '../../../services/scroll-top.service';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
  public bodyClass: string;
  public wrapperClass: string;
  public bodyElem;

  constructor(   private scrollTopService: ScrollTopService, private router: Router) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    //this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.scrollTopService.setScrollTop();
    let url = this.router.url;
    
    switch (url) {
      case '/dispatch':
        this.bodyClass = "dispatch";
        this.wrapperClass = "wrapper-landingpage";
        break;
    
      default:
        this.bodyClass = "manage-dispatch";
        this.wrapperClass = "wrapper";
        break;
    }
    this.bodyElem.classList.add(this.bodyClass);
  }

  ngOnDestroy(): void {
    this.bodyElem.classList.remove(this.bodyClass);
    //this.footerElem.classList.remove("sidebar");
    //this.footerElem.classList.remove("sidebar-active");
  }
}
