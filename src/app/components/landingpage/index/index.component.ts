import { Component, OnInit, OnDestroy, HostListener, Input, Inject, Injector, Injectable, InjectionToken } from '@angular/core';
import { PlatformLocation } from "@angular/common";
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { AnnouncementWidgetsComponent } from '../../../components/common/announcement-widgets/announcement-widgets.component';
import { EscalationWidgetsComponent } from '../../../components/common/escalation-widgets/escalation-widgets.component';
import { RecentViewedWidgetsComponent } from '../../../components/common/recent-viewed-widgets/recent-viewed-widgets.component';
import { RecentSearchesWidgetsComponent } from '../../../components/common/recent-searches-widgets/recent-searches-widgets.component';
import { MyMetricsWidgetsComponent } from '../../../components/common/my-metrics-widgets/my-metrics-widgets.component';
import { LandingReportWidgtsComponent } from '../../../components/common/landing-report-widgts/landing-report-widgts.component';
import { pageInfo, Constant } from 'src/app/common/constant/constant';
import { Subscription } from "rxjs";
import { SupportRequestWidgetComponent } from '../../common/support-request-widget/support-request-widget.component';

export const TITLE = new InjectionToken<string>('title', { providedIn: 'root', factory: () => 'title' });

@Injectable()
class UsefulService {
}
@Injectable()
class NeedsService {
  constructor(public service: UsefulService) { }
}
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title: string = 'Home';
  public scrollTop: number = 0;

  message;
  //outlet = DynamicComponent;
  public dummyComponent = [AnnouncementWidgetsComponent, EscalationWidgetsComponent];

  public frompageCheck = pageInfo.landingPage;
  dynamicComponentInjector: Injector;
  public bodyElem;
  public footerElem;
  public announcevar = 'announcement-widgets';
  public landingpageWidgets = [];
  /* basic setup */
  public headerFlag: boolean = false;
  public loadingelanding: boolean = true;

  public pageInfo = pageInfo.landingPage;
  public midHeight;
  public headerData: Object;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public userId;
  public roleId;
  public apiData: Object;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  pageAccess: string = "landingpage";
  public bodyClass: string = "landing-page";
  public user: any;
  /*
    set dynamicComponentInputTitle(title) {
      this.dynamicComponentInjector = ReflectiveInjector.resolveAndCreate([{ provide: TITLE, useValue: title }], this.parentInjector);
    }
    */
  /* basic setup */
  constructor(
    /* basic setup */
    private titleService: Title,
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private commonService: CommonService,
    private location: PlatformLocation,
    private inj: Injector,
    private authenticationService: AuthenticationService,

    // private parentInjector: Injector
    /* basic setup */

  ) {
    this.titleService.setTitle(localStorage.getItem('platformName') + ' - Home');

    //let title = 'My dynamic title works!';
    //this.dynamicComponentInputTitle = title;

    this.location.onPopState(() => {
      let id = "recentView";
      setTimeout(() => {
        this.scrollToElem(id);
      }, 100);
    });

  }
  createInjector(item) {
    const injector = Injector.create({
      providers:
        [{ provide: NeedsService, deps: [UsefulService] }, { provide: UsefulService, deps: [] }]
    });
    return injector;
  }
  ngOnInit(): void {

    localStorage.removeItem('searchValue');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'isActive': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset

    }
    let teamSystem = localStorage.getItem('teamSystem');
    this.midHeight = (teamSystem) ? 95 : 95;

    this.apiData = apiInfo;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if (authFlag) {
      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true
      };
      let url: any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
        pageInfo: pageInfo.landingPage
      };

      this.getlandingpagewidgets();
    }
    else {
      this.router.navigate(['/forbidden']);
    }
    /* basic setup */

  }


  getlandingpagewidgets() {
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);


    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe((response) => {

      let rstatus = response.status;
      let rtotal = response.total;
      if (rstatus == 'Success') {
        if (rtotal > 0) {
          let rlandingPage = response.landingPage;

          for (var wi in rlandingPage) {

            var rcomponentName = rlandingPage[wi].componentName;
            var rplaceholder = rlandingPage[wi].placeholder;
            var rwid = rlandingPage[wi].id;

            localStorage.setItem('landingpage_attr' + rwid + '', JSON.stringify(rlandingPage[wi]));
            //localStorage.removeItem('landingpage_attr'+rwid+'');
            //localStorage.removeItem('landingpage_attr');
            if (rwid == 1) {

              this.landingpageWidgets.push({ componentName: AnnouncementWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 2) {

              this.landingpageWidgets.push({ componentName: EscalationWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 3) {

              this.landingpageWidgets.push({ componentName: RecentViewedWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 4) {

              this.landingpageWidgets.push({ componentName: RecentSearchesWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 5) {

              this.landingpageWidgets.push({ componentName: MyMetricsWidgetsComponent, placeholder: rplaceholder });
            }
            if (rwid == 7) {

              this.landingpageWidgets.push({ componentName: SupportRequestWidgetComponent, placeholder: rplaceholder });
            }
            if (rwid == 6) {

              this.landingpageWidgets.push({ componentName: LandingReportWidgtsComponent, placeholder: rplaceholder });
            }

          }

          let rlandingPage1 = {
            'componentName': "RecentSearchesWidgetsComponent",
            'id': "4",
            'imageClass': "recentsearch-land-icon",
            'imageUrl': "landing-recent-search.svg",
            'name': "Search History",
            'placeholder': "Search History",
            'shortName': "search-widget"
          }

          const rwid1 = rlandingPage1.id;

          localStorage.setItem('landingpage_attr' + rwid1 + '', JSON.stringify(rlandingPage1));

          this.loadingelanding = false;
        }
        else {
          this.loadingelanding = false;
        }

      }
      else {
        this.loadingelanding = false;
      }


    });
  }

  applySearch(action, val) {
  }

  // Scroll to element
  scrollToElem(id) {
    let scrollPos = localStorage.getItem('homeScroll');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos) + inc;
    let secElement = document.getElementById(id);
    secElement.scrollTop = this.scrollTop;
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.scrollTop = event.target.scrollTop - 80;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
