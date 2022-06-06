import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { Router, RoutesRecognized } from "@angular/router";
import { PlatformLocation } from '@angular/common';
import { pageInfo, Constant, PushTypes, pageTitle, PlatFormType, forumPageAccess, LocalStorageItem, IsOpenNewTab, RedirectionPage, RouterText } from "src/app/common/constant/constant";
import { CommonService } from "src/app/services/common/common.service";
import { Subscription } from "rxjs";
import { filter, pairwise } from 'rxjs/operators';
import { GtsService } from "src/app/services/gts/gts.service";
import { ApiService } from '../.../../../services/api/api.service';
@Component({
  selector: "app-thread-detail-header",
  templateUrl: "./thread-detail-header.component.html",
  styleUrls: ["./thread-detail-header.component.scss"],
})
export class ThreadDetailHeaderComponent implements OnInit, OnDestroy {
  @Input() pageData;
  @Output() threadHeaderActionEmit: EventEmitter<any> = new EventEmitter();
  public platformName = "Collabtic";
  public reopenThread: boolean = false;
  public displayLogoutPopup: boolean = false;
  public navUrl: string = "";
  public reopenTextFlag: boolean = false;
  public reminderShow: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public title: string = "";
  public editFlag: boolean = true;
  public loading: boolean = false;
  public techSubmmit: boolean = false;
  public ppfrAvailable;
  public ppfrText: string = '';
  public ppfrAccess: boolean = false;
  public newTab: boolean = false;
  public navFromEdit: boolean = false;
  public pageDataInfoText: string = "";
  public dataInfo: any = {};
  public msTeamAccessMobile: boolean = false;
  public dialogData: any = {
    access: '',
    navUrl: this.navUrl,
    platformName: '',
    teamSystem: this.teamSystem,
    visible: true
  };
  subscription: Subscription = new Subscription();

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setScreenResize();
  }

  constructor(public apiUrl: ApiService,private commonApi: CommonService, private router: Router, private location: PlatformLocation, public gtsAPI: GtsService) { }
  @HostListener("document:visibilitychange", ["$event"])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  closewindowPopup(data) {
    this.displayLogoutPopup = false;
    if (this.teamSystem) {
      window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
    } else {
      if (data.closeFlag) {
        window.close();
      }
      location.reload();
    }
  }
  checkHiddenDocument() {
    if (document.hidden) {
    } else {
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }
    }
  }
  ngOnInit(): void {
    if (this.teamSystem) {
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }
      else {
        this.msTeamAccessMobile = false;
      }
    }
    console.log(this.msTeamAccessMobile);
    console.log(this.pageData);
    this.techSubmmit = this.pageData.techSubmmit ? true : false;
    console.log("techSubmmit ---- " + this.techSubmmit);
    this.ppfrAccess = this.pageData.ppfrAccess ? true : false;
    let newTab: any = localStorage.getItem('viewOpenTab');
    this.newTab = (newTab == null) ? this.newTab : newTab;
    console.log(newTab)
    if (this.ppfrAccess) {
      this.ppfrAvailable = this.pageData.ppfrAvailable;
      this.ppfrText = this.ppfrAvailable == '1' ? 'Edit' : 'Create';
    }
    console.log("PPFR Access  ---- " + this.ppfrText);
    console.log("PPFR Access  ---- " + this.ppfrAccess);

    let infoFlag = true;
    let access = this.pageData.pageName;
    console.log(access);
    switch (access) {
      case "knowledgearticles":
        this.navUrl = `/${access}`;
        break;
      case "announcement":
        infoFlag = false;
        this.navUrl = `/${access}s/${this.pageData.navSection}`;
        break;
      default:
        this.navUrl = (access == "part" || access == "thread") ? `/${access}s` : `/${access}`;
        this.title = access;
        this.loading = access == "part" ? true : this.loading;
        break;
    }

    if (infoFlag) {
      let url = this.navUrl.split('/');
      console.log(url)
      let pageDataIndex = pageTitle.findIndex(option => option.slug == url[1]);
      console.log(this.navUrl, pageTitle, pageDataIndex)
      if (pageDataIndex >= 0) {
        let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
        let dataInfo = localStorage.getItem(pageDataInfo);
        if (dataInfo != null || dataInfo != undefined || dataInfo != 'undefined') {
          this.dataInfo = JSON.parse(dataInfo);
        }
      }
    }

    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        let prevUrl: any = events[0].urlAfterRedirects;
        console.log('previous url', prevUrl);
        console.log('current url', events[1].urlAfterRedirects);
        prevUrl = prevUrl.split('/');
        console.log(prevUrl)
        if (prevUrl.length > 1) {
          switch (prevUrl[1]) {
            case 'threads':
              /*case 'parts':
              case 'documents':  
              case 'gts':
              case 'knowledgearticles':
              case 'knowledge-base':
              case 'sib':*/
              console.log(prevUrl[3])
              let chkAction = (prevUrl[1] == 'gts') ? prevUrl[2] : prevUrl[3];
              if (chkAction == 'edit') {
                let navFromEdit: any = true;
                this.navFromEdit = navFromEdit;
                let pageDataIndex = pageTitle.findIndex(option => option.slug == prevUrl[1]);
                let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
                localStorage.setItem(pageTitle[pageDataIndex].navEdit, navFromEdit);
                let dataInfo = localStorage.getItem(pageDataInfo);
                if (dataInfo != null || dataInfo != undefined || dataInfo != 'undefined') {
                  this.dataInfo = JSON.parse(dataInfo);
                }
              }
              break;
          }
        }
      });
    this.platformName = localStorage.getItem("platformName");
    this.dialogData.platformName = this.platformName;
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.Collabtic) {
      this.reminderShow = true;
    }
    this.subscription.add(
      this.commonApi.detailData.subscribe((response) => {
        console.log(response);
        this.loading = response["loading"];
        this.editFlag = response["editAccess"];
      })
    );
  }
  setScreenResize() {
    if (this.teamSystem) {
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;
      }
      else {
        this.msTeamAccessMobile = false;
      }
      console.log(this.msTeamAccessMobile);
    }
  }
  closeWindow() {
    let access = this.pageData.pageName;
    let getRecentView = localStorage.getItem('landingRecentNav');
    let recentNavFlag: any = false;
    let checkItem = `${this.pageData.threadId}-new-tab`;
    let checkNewTab = localStorage.getItem(checkItem);
    console.log(access, checkNewTab, checkItem)
    if (access == 'thread' && (checkNewTab != null || checkNewTab != undefined || checkNewTab != undefined) && checkItem == checkNewTab) {
      localStorage.removeItem(checkItem);
      setTimeout(() => {
        window.close();
        window.location.reload();
      }, 10);
      return false;
    }

    if (getRecentView != null || getRecentView != undefined || getRecentView != undefined) {
      recentNavFlag = true;
      setTimeout(() => {
        localStorage.removeItem('landingRecentNav');
      }, 100);
    }

    console.log(this.pageData);
    if (this.dataInfo == null) {
      let pageDataIndex = pageTitle.findIndex(option => option.slug == this.navUrl);
      if (pageDataIndex >= 0) {
        let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
        this.dataInfo = JSON.parse(localStorage.getItem(pageDataInfo));
      }
    }
    console.log(this.dataInfo)
    //navFromEdit = this.navFromEdit;
    let sindex, silentCountTxt, silentLoadCount: any, pageInfo, routeLoadIndex, routeText;

    console.log(access);
    let loadFlag = true;
    switch (access) {
      case "ppfr":
        this.navUrl = "ppfr";
        break;        
      case "announcement":
        this.navUrl = "announcements/" + this.pageData.navSection;
        break;
      case "thread":
        loadFlag = false;
        this.navUrl = (access == 'knowledgearticles') ? access : `${access}s`;
        let pageDataIndex = pageTitle.findIndex(option => option.slug == this.navUrl);
        let navText = pageTitle[pageDataIndex].navEdit;
        console.log(navText)
        let navFromEdit: any = localStorage.getItem(navText);
        console.log(navFromEdit)
        setTimeout(() => {
          localStorage.removeItem(navText);
        }, 100);
        navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
        console.log(navFromEdit)
        sindex = PushTypes.findIndex(option => option.url == this.navUrl);
        pageInfo = PushTypes[sindex].pageInfo;
        silentCountTxt = PushTypes[sindex].silentCount;
        silentLoadCount = localStorage.getItem(silentCountTxt);
        silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
        console.log(silentLoadCount)
        this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag, this.navUrl);
        if (silentLoadCount > 0 && !recentNavFlag) {
          console.log(45646)
          let data = {
            action: 'silentLoad',
            access: this.navUrl,
            pushAction: 'load',
            pageInfo: pageInfo,
            silentLoadCount: silentLoadCount
          }
          setTimeout(() => {
            this.commonApi.emitMessageReceived(data);
          }, 100);
        }
        break;
      case "part":
      case "knowledgearticles":
      case "document":
        loadFlag = false;
        this.navUrl = (access == 'knowledgearticles') ? access : `${access}s`;
        //if(access == 'document' || access == 'part') {          
            let data = {
              action: 'updateLayout'
            }
            this.commonApi.emitMessageLayoutrefresh(data);                   
        //}
        // Remove when implement silent push
        this.setupRouteLoad(this.navUrl, recentNavFlag);
        //this.router.navigate([this.navUrl]);
        break;
      case "gts":
      case "sib":
      case "knowledge-base":       
        loadFlag = false;
        this.navUrl = access;
        //setTimeout(() => {
          let data1 = {
            action: 'updateLayout'
          }
          this.commonApi.emitMessageLayoutrefresh(data1); 
        //}, 1);        
        // Remove when implement silent push
        this.setupRouteLoad(this.navUrl, recentNavFlag);
        //this.router.navigate([this.navUrl]);
        /* // Resuse startegy
        setTimeout(() => {
          localStorage.removeItem(navText);
        }, 100);
        navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
        sindex = PushTypes.findIndex(option => option.url == this.navUrl);
        pageInfo = PushTypes[sindex].pageInfo;
        silentCountTxt = PushTypes[sindex].silentCount;
        silentLoadCount = localStorage.getItem(silentCountTxt);
        silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
        this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag); */
        break;
      default:
        loadFlag = false;
        this.navUrl = `${access}s`;
        // Remove when implement silent push
        this.setupRouteLoad(this.navUrl, recentNavFlag);
        //this.router.navigate([this.navUrl]);
        /* // Resuse startegy
        sindex = PushTypes.findIndex(option => option.url == this.navUrl);
        pageInfo = PushTypes[sindex].pageInfo;
        silentCountTxt = PushTypes[sindex].silentCount;
        silentLoadCount = localStorage.getItem(silentCountTxt);
        silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
        this.setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag); */
        break;
    }
    console.log(this.navUrl);
    if (loadFlag) {
      if (this.teamSystem) {
        window.open(this.navUrl, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.close();
      }
    }
  }
  viewThread(threadId) {
    let url = `threads/view/${threadId}`;
    let flag: any = true;
    localStorage.setItem('viewOpenTab', flag)
    //window.open(url, IsOpenNewTab.openNewTab);
    this.router.navigate([url]);
    //this.location.back();
  }
  editThread(threadId, type, action = "") {
    let url, surl, storage;
    let navOpenFlag = true;
    switch (type) {
      case "thread":
        navOpenFlag = false;
        storage = "threadNav";
        url = `threads/manage/edit/${threadId}`;
        surl = `threads/view/${threadId}`;
        break;
      case "knowledgearticles":
        navOpenFlag = false;
        storage = "knowledgearticles";
        url = `knowledgearticles/manage/edit/${threadId}`;
        surl = `knowledgearticles/view/${threadId}`;
        break;
      case "gts":
        navOpenFlag = false;
        storage = "gts";
        url = "gts/edit/" + threadId;
        surl = "gts/view/" + threadId;
        let wsNav: any = localStorage.getItem('wsFlag');
        localStorage.setItem('wsNav', wsNav);
        setTimeout(() => {
          localStorage.removeItem('wsFlag');
        }, 100);
        break;
      case "document":
        navOpenFlag = false;
        storage = "docNav";
        url = `documents/manage/edit/${threadId}`;
        surl = `documents/view/${threadId}`;
        break;
      case "part":
        navOpenFlag = false;
        let actionUrl = action == "" ? "edit" : action;
        storage = "partNav";
        url = `parts/manage/${actionUrl}/${threadId}`;
        surl = `parts/view/${threadId}`;
        if (action != '')
          localStorage.setItem("partNav", surl);
        break;
      case "sib":
        navOpenFlag = false;
        let sactionUrl = action == "" ? "edit" : action;
        storage = "sibNav";
        url = `sib/manage/${sactionUrl}/${threadId}`;
        surl = `sib/view/${threadId}`;
        break;
      default:
        storage = "ancNav";
        url = `announcements/manage/edit/${threadId}`;
        surl = `announcements/view/${threadId}`;
        break;
    }
    localStorage.setItem(storage, surl);
    if (navOpenFlag) {
      if (this.teamSystem || action == "duplicate") {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    } else {
      this.router.navigate([url]);
    }
  }
  threadHeaderEvent(event) {
    if ("reopen") {
      this.reopenTextFlag = true;
      setTimeout(() => {
        this.pageData.reopenThread = false;
        this.reopenTextFlag = false;
      }, 1500);
    }
    this.threadHeaderActionEmit.emit(event);
  }
  duplicateRecord(event) {
    this.threadHeaderActionEmit.emit(event);
  }

  // Set Navigation
  setNavigation(navFromEdit, silentCountTxt, silentLoadCount, pageInfo, recentNavFlag, curl = '') {
    let wsNav: any = localStorage.getItem('wsNav');
    let wsNavUrl = localStorage.getItem('wsNavUrl');
    let url = (wsNav) ? wsNavUrl : this.navUrl;
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
    let chkRouteLoad;
    if (routeLoadIndex >= 0) {
      let routeText = pageTitle[routeLoadIndex].routerText;
      chkRouteLoad = localStorage.getItem(routeText);
    }
    let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad;
    console.log(this.navFromEdit, navFromEdit, url)
    let title = localStorage.getItem('platformName');
    let titleIndex = pageTitle.findIndex(option => option.slug == url);
    title = `${title} - ${pageTitle[titleIndex].name}`;
    let pageIndex = pageTitle.findIndex(option => option.slug == curl);
    let chkIndex = (curl != '') ? pageIndex : titleIndex;
    let pageDataInfo = pageTitle[chkIndex].dataInfo;
    this.dataInfo = JSON.parse(localStorage.getItem(pageDataInfo));
    document.title = title;
    url = (recentNavFlag) ? RedirectionPage.Home : url;
    let navCancelText = pageTitle[chkIndex].navCancel;
    let navCancelFlag: any = localStorage.getItem(navCancelText);
    setTimeout(() => {
      localStorage.removeItem(navCancelText)
    }, 100);
    console.log(recentNavFlag, navCancelFlag, navFromEdit)
    //return false;
    if (recentNavFlag && !navCancelFlag && navFromEdit) {
      console.log('in')
      let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
      let chkRouteLoad;
      console.log(routeLoadIndex)
      if (routeLoadIndex >= 0) {
        routeLoad = true;
        let routeText = pageTitle[routeLoadIndex].routerText;
        chkRouteLoad = localStorage.setItem(routeText, routeLoad);
      }
    }
    if (navFromEdit || routeLoad) {
      console.log(recentNavFlag, this.dataInfo)
      let timeOut = 0;
      if (navFromEdit && Object.keys(this.dataInfo).length > 0) {
        timeOut = 50;
        let data = {
          action: 'silentUpdate',
          access: url,
          pushAction: 'load',
          pageInfo: pageInfo,
          silentLoadCount: silentLoadCount,
          dataId: this.pageData.threadId,
          dataInfo: this.dataInfo
        }
        this.commonApi.emitMessageReceived(data);
      }
      setTimeout(() => {
        this.router.navigate([url]);
      }, timeOut);
    } else {
      console.log(this.dataInfo)
      let timeOut = 0;
      if (navFromEdit && Object.keys(this.dataInfo).length > 0) {
        timeOut = 50;
        let data = {
          action: 'silentUpdate',
          access: url,
          pushAction: 'load',
          pageInfo: pageInfo,
          silentLoadCount: silentLoadCount,
          dataId: this.pageData.threadId,
          dataInfo: this.dataInfo
        }
        this.commonApi.emitMessageReceived(data);
        setTimeout(() => {
          this.router.navigate([url]);
        }, timeOut);
      } else {
        if (navCancelFlag && recentNavFlag) {
          this.router.navigate([url]);
        } else {
          this.location.back();
        }
      }
      //this.location.back();
    }
    setTimeout(() => {
      localStorage.removeItem('wsNav');
      localStorage.removeItem('wsNavUrl');
      localStorage.removeItem(silentCountTxt);
    }, 100);
  }

  setupRouteLoad(url, recentNav) {
    console.log(url)
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
    console.log(routeLoadIndex)
    let wsNav: any = localStorage.getItem('wsNav');
    let wsNavUrl = localStorage.getItem('wsNavUrl');
    this.navUrl = (wsNav) ? wsNavUrl : this.navUrl;

    setTimeout(() => {
      localStorage.removeItem('wsNav');
      localStorage.removeItem('wsNavUrl');
    }, 100);
    if (routeLoadIndex >= 0) {
      let routeNavText = pageTitle[routeLoadIndex].routerText;
      let navEditText = pageTitle[routeLoadIndex].navEdit;
      let navCancelText = pageTitle[routeLoadIndex].navCancel;
      let navEditFlag = localStorage.getItem(navEditText);
      let navCancelFlag = localStorage.getItem(navCancelText);
      setTimeout(() => {
        localStorage.removeItem(navEditText);
        localStorage.removeItem(navCancelText);
      }, 100);
      console.log(navEditFlag, navCancelFlag)
      let chkLandingRecentFlag: any = recentNav;
      let landingNav = RedirectionPage.Home;
      let navUrl = (chkLandingRecentFlag) ? landingNav : this.navUrl;
      console.log(navUrl)
      if (navEditFlag) {
        routeNavText = (chkLandingRecentFlag) ? RouterText.HOME : routeNavText;
        localStorage.setItem(routeNavText, 'true');
        if (this.navUrl == 'documents') {
          //this.router.navigate([navUrl]);
          let data = {
            docId: this.pageData.threadId,
            action: 'load'
          }
          this.commonApi.emitDocViewLoad(data)
          window.location.href = this.navUrl;
        } else {
          this.router.navigate([navUrl]);
        }
      } else {
        if (navCancelFlag) {
          this.router.navigate([navUrl]);
        } else {
          this.router.navigate([navUrl]);
        }
      }
    }
  }

  startGTS() {
    this.router.navigate([`gts/start/${this.pageData.threadId}`]);
  }

  ngOnDestroy() {
    //localStorage.removeItem('viewOpenTab');
    this.subscription.unsubscribe();
  }
}
