import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Location, PlatformLocation } from "@angular/common";
import { Router } from "@angular/router";
import { CommonService } from "../../services/common/common.service";
import { LandingpageService } from "../../services/landingpage/landingpage.service";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { Constant, PushTypes, windowHeight, pageTitle, LocalStorageItem } from '../../common/constant/constant';
declare var $: any;
declare var window: any;
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() accessModule;
  @Input() pageData;
  @Input() contentTypeId;

  public footerElem;
  public probContElem;
  public productContElem;

  public bodyHeight: number;
  public sidebarHeight: number;
  public platformId = localStorage.getItem('platformId');
  public dashSidebar: boolean;
  public escDashSidebar: boolean;
  public probingListSidebar: boolean;
  public landingListSidebar: boolean;
  public productListSidebar: boolean;
  public dashImgPath = "assets/images/dashboard/";

  public sidebarText = "sidebar";
  public sidebarActiveText = "sidebar-active";
  public summaryText: string = "Summary";
  public usageTypeText: string = "Usage";
  public escalationText: string = "Escalation";
  public threadText: string = "Threads";
  public gtsText: string = "GTS";
  public svcProText: string = "Probing";
  public eventMetricsText: string = "Events";
  public leaderBoardtext: string = 'Leaderboard';
  public arrowClass: string;
  public arrowText: string;

  public expandFlag: boolean = false;
  public summaryFlag: boolean = false;
  public usageTypeFlag: boolean = false;
  public escalationFlag: boolean = false;
  public threadFlag: boolean = false;
  public gtsFlag: boolean = false;
  public svcProFlag: boolean = false;
  public eventFlag: boolean = false;
  public leaderboardFlag: boolean = false;
  public user: any;
  public domainId;
  public userId;
  public countryId;
  public apiData: Object;
  public menuListloaded = [];
  public homeText: string = "Home";
  public chatText: string = "Chat";
  public techIssueText: string = "Issues";
  public manualText: string = "Manuals";
  public documentText: string = "Document";
  public articleText: string = "Articles";
  public probingText: string = "Probings";
  public dashboardText: string = "Dashboard";

  public currUrl: string;
  public homeFlag: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public chatFlag: boolean = false;
  public techIssueFlag: boolean = false;
  public manualFlag: boolean = false;
  public documentFlag: boolean = false;
  public articleFlag: boolean = false;
  public probingFlag: boolean = false;
  public landingFlag: boolean = false;
  public dashboardFlag: boolean = false;
  public noload: boolean = false;
  public helpContent = [];
  public tooltipFlag: boolean = false;
  public helpContentName = "";
  public currentDisplayTNameFlag: boolean = false;
  public msTeamAccess: boolean = false;
  public sideMenu: boolean = true;
  public ttApiCall;

  constructor(
    private location: Location,
    private router: Router,
    private getMenuListingApi: CommonService,
    private changeDetector: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService,
    private platformLocation: PlatformLocation
  ) { }

  ngOnInit() {
    let rmVal = this.accessModule == "dashboard" ? 0 : 100;
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }

    this.sidebarHeight = window.innerHeight - rmVal;
    this.getMenuListingApi._OnMessageReceivedSubject.subscribe((r) => {
      //console.log(r)
      var setdata = JSON.parse(JSON.stringify(r));
      //alert(setdata);
      //  alert(1);

      this.noload = true;
      console.log(this.noload + "-----------In");
      //alert(1);
    });

    // welcome popup content check
    this.ttApiCall = this.getMenuListingApi.welcomeContentReceivedSubject.subscribe(
      (response) => {
        console.log(response);
        let welcomePopupDisplay = response["welcomePopupDisplay"];
        console.log(welcomePopupDisplay)
        if (welcomePopupDisplay == "1") {
          console.log(welcomePopupDisplay)
          this.menuListloaded[1]['helpContentFlagStatus'] = true;
          this.tooltipFlag = true;
          this.helpContentName = "chat";
          localStorage.setItem("helpContentName", this.helpContentName);
          let element: HTMLElement = document.getElementById(
            this.helpContentName
          ) as HTMLElement;
          element.click();
          setTimeout(() => {
            this.ttApiCall.unsubscribe();
          }, 100);
        }
      }
    );

    console.log(this.pageData, "--");
    this.arrowText = this.expandFlag ? "Collapse" : "Expand";
    this.arrowClass = this.expandFlag ? "collapse" : "expand";
    this.dashSidebar = false;
    this.escDashSidebar = false;

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.countryId = localStorage.getItem('countryId');
    //this.apiData = {};
    this.bodyHeight = screen.height;
    this.bodyHeight = window.innerHeight;
    //alert(this.bodyHeight);
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    };
    this.apiData = apiInfo;
    this.probingListSidebar = false;
    this.landingListSidebar = false;
    this.productListSidebar = false;
    let url = location.pathname;
    this.currUrl = url.substr(url.indexOf("/") + 1);
    //this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.probContElem = document.getElementsByClassName("probing-content")[0];
    //this.productContElem = document.getElementsByClassName('product-matrix-content')[0];

    //this.footerElem.classList.remove(this.sidebarText);
    //this.footerElem.classList.remove(this.sidebarActiveText);
    console.log(this.accessModule + "------", this.pageData);
    switch (this.accessModule) {
      case "dashboard":
        this.dashSidebar = true;
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case "escalation":
        this.escDashSidebar = true;
        setTimeout(() => {
          this.setSidebarHeight();
        }, 500);
        break;
      case "web-probing":
      case "web-probing-list":
      case "mis/web-probing":
      case "landing-page":
      case "parts-list":
      case "sib-list":
      case "cbt-v2/landing-page":
      case "landing-page":
      case "mis/web-probing-list":
        //alert(this.currUrl);
        this.probingListSidebar =
          this.currUrl == "probing-questions" || "mis/probing-questions"
            ? true
            : false;
        this.landingListSidebar =
          this.currUrl == "landing-page" || "cbt-v2/landing-page"
            ? true
            : false;
        if (this.probingListSidebar || this.landingListSidebar) {
          let addFooterClass = this.expandFlag
            ? this.sidebarActiveText
            : this.sidebarText;
          //this.footerElem.classList.add(addFooterClass);
          // alert(this.probingListSidebar);
          if (!this.landingListSidebar) {
            this.probContElem.classList.add(addFooterClass);
          }
          setTimeout(() => {
            this.setSidebarHeight();
          }, 500);

          break;
        }

      case "product-matrix-list":
        this.productListSidebar =
          this.currUrl == "product-matrix" || "mis/product-matrix"
            ? true
            : false;
        if (this.productListSidebar) {
          let addFooterClass = this.expandFlag
            ? this.sidebarActiveText
            : this.sidebarText;
          //this.footerElem.classList.add(addFooterClass);
          this.probContElem.classList.add(addFooterClass);
          setTimeout(() => {
            this.setSidebarHeight();
          }, 500);
        }
    }
    console.log(this.noload + "-----------fa");
    if (!this.noload) {
      this.getHeadMenuLists();
    }

    setTimeout(() => {
      this.setActiveRoute(this.currUrl);
    }, 500);
  }

  // helpContentOrder
  updateHelpContentOrder(id) {
    const apiFormData = new FormData();

    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("tooltipId", id);

    this.landingpageServiceApi
      .updateTooltipconfigWeb(apiFormData)
      .subscribe((response) => {
        if (response.status == "Success") {
          console.log(response.result);
        }
      });
  }

  // load tooltips
  nextTooltip(id, name) {
    // update help content status
    for (let menu of this.menuListloaded) {
      if (menu.helpContentId == id) {
        menu.helpContentStatus = "1";
        menu.helpContentFlagStatus = false;
      }
    }

    switch (name) {
      case "chat":
        let element: HTMLElement = document.getElementById(
          "chat"
        ) as HTMLElement;
        element.click();
        this.updateHelpContentOrder(id);
        localStorage.setItem("helpContentName", "threads");
        let element1: HTMLElement = document.getElementById(
          "threads"
        ) as HTMLElement;
        element1.click();
        break;
      case "threads":
        let element2: HTMLElement = document.getElementById(
          "threads"
        ) as HTMLElement;
        element2.click();
        this.updateHelpContentOrder(id);
        localStorage.setItem("helpContentName", "techinfo");
        let element3: HTMLElement = document.getElementById(
          "techinfo"
        ) as HTMLElement;
        element3.click();
        break;
      case "techinfo":
        let element4: HTMLElement = document.getElementById(
          "techinfo"
        ) as HTMLElement;
        element4.click();
        this.updateHelpContentOrder(id);
        let platformId = localStorage.getItem("platformId");
        if (platformId == "1") {
          localStorage.setItem("helpContentName", "articles");
          let element5: HTMLElement = document.getElementById(
            "articles"
          ) as HTMLElement;
          element5.click();
        } else {
          localStorage.setItem("helpContentName", "parts");
          let element7: HTMLElement = document.getElementById(
            "parts"
          ) as HTMLElement;
          element7.click();
        }
        break;
      case "articles":
        let element6: HTMLElement = document.getElementById(
          "articles"
        ) as HTMLElement;
        element6.click();
        this.updateHelpContentOrder(id);
        localStorage.setItem("helpContentName", "parts");
        let element7: HTMLElement = document.getElementById(
          "parts"
        ) as HTMLElement;
        element7.click();
        break;
      case "parts":
        let element8: HTMLElement = document.getElementById(
          "parts"
        ) as HTMLElement;
        element8.click();
        this.updateHelpContentOrder(id);
        localStorage.setItem("helpContentName", "media");
        let element9: HTMLElement = document.getElementById(
          "media"
        ) as HTMLElement;
        element9.click();
        break;
      case "media":
        let element10: HTMLElement = document.getElementById(
          "media"
        ) as HTMLElement;
        element10.click();
        this.updateHelpContentOrder(id);
        localStorage.setItem("helpContentName", "workstreams");
        let data = {
          helpContentName: "workstreams",
        };
        this.getMenuListingApi.emitHelpContentView(data);
        break;
    }
  }

  getHeadMenuLists() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    apiFormData.append("limit", this.apiData["limit"]);
    apiFormData.append("offset", this.apiData["offset"]);
    if (this.contentTypeId) {
      apiFormData.append("contentTypeId", this.contentTypeId);
    }
    this.getMenuListingApi
      .getMenuLists(apiFormData, this.accessModule)
      .subscribe((response) => {
        if (response.status == "Success") {
          let menuListloaded = response.sideMenu;
          this.helpContentName = "";
          for (let menu of menuListloaded) {
            let urlpathreplace = menu.urlPath;

            let urlActivePathreplace = menu.urlActivePath;
            let submenuimageClass = menu.submenuimageClass;

            let toolTips = menu.toolTips;
            console.log(toolTips);
            this.tooltipFlag =
              toolTips == undefined ||
                toolTips == "undefined" ||
                toolTips == "null" ||
                toolTips == null
                ? false
                : true;
            console.log(this.tooltipFlag);
            let helpContentId = "";
            let helpContentTitle = "";
            let helpContentContent = "";
            let helpContentIconName = "";
            let helpContentStatus = "";
            let helpContentFlagStatus = false;
            if (this.tooltipFlag) {
              if (toolTips.length > 0) {
                this.helpContent = toolTips[0];
                helpContentId = this.helpContent["id"];
                helpContentTitle = this.helpContent["title"];
                helpContentContent = this.helpContent["content"];
                helpContentIconName = this.helpContent["itemClass"];
                helpContentStatus = this.helpContent["viewStatus"];
                helpContentFlagStatus =
                  this.helpContent["viewStatus"] == "0" ? true : false;
              }
            }

            let urlpth = "";
            let urlActivePath = "";
            if (
              this.accessModule == "dashboard" ||
              this.accessModule == "escalation"
            ) {
              urlpth = urlpathreplace;
              urlActivePath = urlActivePathreplace;
            } else {
              urlpth = urlpathreplace.replace(".png", ".svg");
              urlActivePath = urlActivePathreplace.replace(".png", ".svg");
            }
            this.menuListloaded.push({
              id: menu.id,
              disableContentType: menu.disableContentType,
              slug: menu.slug,
              contentTypeId: menu.contentTypeId,
              name: menu.name,
              urlPath: urlpth,
              urlActivePath: urlActivePath,
              submenuimageClass: submenuimageClass,
              helpContentId: helpContentId,
              helpContentTitle: helpContentTitle,
              helpContentContent: helpContentContent,
              helpContentIconName: helpContentIconName,
              helpContentStatus: helpContentStatus,
              helpContentFlagStatus: helpContentFlagStatus,
            });

            if (this.tooltipFlag) {
              if (!this.currentDisplayTNameFlag) {
                if (helpContentStatus == "0") {
                  this.helpContentName = helpContentIconName;
                  localStorage.setItem("helpContentName", this.helpContentName);
                  this.currentDisplayTNameFlag = true;
                }
              }
            }
            //console.error("menu loaded us ", this.menuListloaded);
          }

          let urlVal = this.router.url;
          console.log(urlVal);
          // welcome popup show    
          if(urlVal == '/landing-page'){
            setTimeout(() => {
              if (this.tooltipFlag) {
                let welcomePopupDisplay = localStorage.getItem(
                  "welcomePopupDisplay"
                );
                console.log("sdfds" + welcomePopupDisplay);
                if (welcomePopupDisplay == "1") {
                  if (this.helpContentName != "") {
                    let element: HTMLElement = document.getElementById(
                      this.helpContentName
                    ) as HTMLElement;
                    element.click();
                  } else {
                    if (!this.currentDisplayTNameFlag) {
                      localStorage.setItem("helpContentName", "workstreams");
                    }
                  }
                }
              }
            }, 1500);
          }

          localStorage.setItem(
            "sideMenuValues",
            JSON.stringify(this.menuListloaded)
          );
          console.log(this.menuListloaded);

          let url = this.currUrl.replace("mis/", "");
          for (let menu of this.menuListloaded) {
            menu.activeClass = url == menu.urlPath ? 1 : 0;
          }

          let currMenu = this.pageData?.page;
          console.log(currMenu)
          switch (currMenu) {
            case 'landing-page':
            case 'threads':
            case 'documents':
            case 'parts':
            case 'gts':
            case 'media-manager':
            case 'knowledgearticles':
            case 'knowledge-base':
            case 'sib':
              this.menuListloaded.forEach((item) => {
                item.activeClass = (item.slug == currMenu) ? 1 : 0;
              });
              let checkArr = ['id', 'slug'];
              let unique = this.getMenuListingApi.unique(this.menuListloaded, checkArr);
              this.menuListloaded = unique;
              console.log(this.menuListloaded)
              break;
          }
        }
        this.sideMenu = true;
      });
  }

  checkforaction(event: any) {
    // let urlpth = event.urlPath.replace(".png", ".svg");
    // let urlActivePath = event.urlActivePath.replace(".png", ".svg");
    //alert(urlActivePath);
    $(".menuListicon" + event.id + "").attr("src", "assets/images/landing-page/side-menu/" + event.urlActivePath + "");
  }

  checkforactionleave(event: any) {
    // if (event.id != 43) {
    // let urlpth = event.urlPath.replace(".png", ".svg");
    // let urlActivePath = event.urlActivePath.replace(".png", ".svg");
    //alert(urlActivePath);
    $(".menuListicon" + event.id + "").attr("src", "assets/images/landing-page/side-menu/" + event.urlPath + "");
    // }
  }

  // Expand or Collapse
  expandAction() {
    this.expandFlag = this.expandFlag ? false : true;
    if (this.probingListSidebar || this.landingListSidebar) {
      let addFooterClass = this.expandFlag
        ? this.sidebarActiveText
        : this.sidebarText;
      /* this.footerElem.classList.add(addFooterClass);
      if (!this.expandFlag) {
        this.footerElem.classList.remove(this.sidebarActiveText);
      } */
      let currUrl = location.pathname;
      currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
      switch (this.accessModule) {
        case "web-probing":
        case "landing-page":
        case "cbt-v2/landing-page":
        case "mis/web-probing":
          currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
          this.probingListSidebar =
            currUrl == "probing-questions" || "mis/probing-questions"
              ? true
              : false;
          this.landingListSidebar =
            currUrl == "landing-page" || "cbt-v2/landing-page" ? true : false;
          if (this.probingListSidebar || this.landingListSidebar) {
            this.probContElem.classList.add(addFooterClass);
            if (!this.expandFlag) {
              this.probContElem.classList.remove(this.sidebarActiveText);
            }
          }
          break;
        case "product-matrix-list":
          currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
          this.probingListSidebar =
            this.currUrl == "product-matrix" || "mis/product-matrix"
              ? true
              : false;
          if (this.probingListSidebar) {
            this.probContElem.classList.add(addFooterClass);
            if (!this.expandFlag) {
              this.probContElem.classList.remove(this.sidebarActiveText);
            }
          }
      }
    }
  }

  // Page Navigation
  navigatePageUrl(type) {
    console.log(type)
    let aurl = "";
    let platformId: any = parseInt(localStorage.getItem("platformId"));
    let sameTabFlag = false;
    let navUrl: any = type.slug;
    let title = localStorage.getItem('platformName');
    if (!type.disableContentType) {
      console.log(15645)
      sameTabFlag = false;
      let nav: any = 1;
      let contentTypeId = type.contentTypeId;
      let contentTypeName = type.name;
      let page = type.slug;
      if (contentTypeId >= 0) {
        let routeLoadText;
        let routeLoadIndex = pageTitle.findIndex(option => option.slug == page);
        if (routeLoadIndex >= 0) {
          routeLoadText = pageTitle[routeLoadIndex].routerText;
        }
        if (contentTypeId > 1) {
          localStorage.setItem("landingNav", nav);
        }
        switch (page) {
          case 'landing-page':
            sameTabFlag = true;
            let menuId = `accord-menu-1`;
            let menuClass = document.getElementsByClassName(menuId);
            setTimeout(() => {
              console.log(menuClass)
              menuClass[0].classList.add('active')
            }, 50);
            break;
          case 'dashboard':
          case 'chat-page':
            localStorage.removeItem('landing-page-workstream');
            localStorage.removeItem(LocalStorageItem.reloadChatGroupId);
            localStorage.removeItem(LocalStorageItem.reloadChatType);
            sameTabFlag = false;
            break;
          case 'threads':
            localStorage.removeItem("threadOrderFilter");
            localStorage.removeItem("threadSortFilter");
            localStorage.removeItem("threadViewType");
            break;
          case 'documents':
            let docNav = localStorage.getItem('wsDocNav');
            if (docNav) {
              localStorage.removeItem('wsDocNav');
              localStorage.setItem(routeLoadText, 'true');
            }
            break;
        }
        console.log(platformId)
        if (platformId == 2) {
          if (contentTypeId == 7) {
            navUrl = "/mis/home/" + this.domainId + "/" + this.userId + "/2";
          }
          if (contentTypeId == 8) {
            aurl = "knowledgearticles";
            //   window.open(aurl, '_blank');
          }
          if (contentTypeId == 26) {
            aurl = "http://training.mahleforum.com";
            // window.open(aurl, '_blank');
          }
          // alert(contentTypeId);

        } else {

          if (contentTypeId == 26) {
            aurl = "http://training.collabtic.com";
            // window.open(aurl, '_blank');
          }
          if (contentTypeId == 7) {
            aurl = "knowledgearticles";
            localStorage.setItem("landingNav", nav);
            // window.open(aurl, '_blank');
          }
        }
        if (contentTypeId == 23) {
          if (platformId == 2) {
            navUrl = "/mis/home/" + this.domainId + "/" + this.userId + "/1";
          } else {
            aurl = "mis/dashboard";
          }
          //  window.open(aurl, '_blank');
        }
      }

      if (!sameTabFlag) {
        navUrl = (navUrl == '') ? aurl : navUrl;
        setTimeout(() => {
          
          if(navUrl=='chat-page')
          {
            if (!window.chatPage || window.chatPage.closed)
            {
              window.chatPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.chatPage.focus();
            }

          }
          else if(navUrl=='threads')
          {
            if (!window.threadsPage || window.threadsPage.closed)
            {
              window.threadsPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.threadsPage.focus();
            }

          }
          else if(navUrl=='documents')
          {
            if (!window.documentsPage || window.documentsPage.closed)
            {
              window.documentsPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.documentsPage.focus();
            }

          }
          else if(navUrl=='parts')
          {
            if (!window.partsPage || window.partsPage.closed)
            {
              window.partsPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.partsPage.focus();
            }

          }
          else if(navUrl=='gts')
          {
            if (!window.gtsPage || window.gtsPage.closed)
            {
              window.gtsPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.gtsPage.focus();
            }
            
          }
          else if(navUrl=='knowledgearticles')
          {
            if (!window.knowledgearticlesPage || window.knowledgearticlesPage.closed)
            {
              window.knowledgearticlesPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.knowledgearticlesPage.focus();
            }
            
          }
          else if(navUrl=='media-manager')
          {
            if (!window.mediamanagerPage || window.mediamanagerPage.closed)
            {
              window.mediamanagerPage=window.open(navUrl,'_blank' +navUrl);
             
            }
            else
            {
              window.mediamanagerPage.focus();
            }
            
          }
          else
          {
            window.open(navUrl, "_blank" + navUrl).focus();
          }
         
        }, 10);
        // newWindow.focus();
      } else {
        navUrl = (navUrl == '') ? aurl : navUrl;
        let sindex = PushTypes.findIndex(option => option.url == navUrl);
        let silentCountTxt, silentLoadCount: any = 0, pageInfo = '';
        let titleIndex = pageTitle.findIndex(option => option.slug == page);
        title = `${title} - ${pageTitle[titleIndex].name}`;
        document.title = title;

        if (sindex >= 0) {
          pageInfo = PushTypes[sindex].pageInfo;
          silentCountTxt = PushTypes[sindex].silentCount;
          silentLoadCount = localStorage.getItem(silentCountTxt);
          silentLoadCount = localStorage.getItem(silentCountTxt);
          silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
          setTimeout(() => {
            localStorage.removeItem(silentCountTxt);
          }, 500);
        }
        let routeLoadIndex = pageTitle.findIndex(option => option.slug == page);
        let chkRouteLoad;
        if (routeLoadIndex >= 0) {
          let routeText = pageTitle[routeLoadIndex].routerText;
          chkRouteLoad = localStorage.getItem(routeText);
        }
        let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad;
        console.log(routeLoad, sindex, silentLoadCount)
        if (!routeLoad && sindex >= 0 && silentLoadCount > 0) {
          let data = {
            access: navUrl,
            action: 'silentLoad',
            pushAction: 'load',
            pageInfo: pageInfo,
            silentLoadCount: silentLoadCount
          }
          this.getMenuListingApi.emitMessageReceived(data);
        } else {
          let data = {
            action: 'side-menu',
            access: 'side-menu',
            page: page
          }
          this.getMenuListingApi.emitMessageLayoutrefresh(data);
        }
        this.router.navigateByUrl(navUrl);
      }
    }
  }
  navigatePage(url) {
    this.setActiveRoute(url);
    this.router.navigate([url]);
    if (this.dashSidebar) {
      let navPage = "true";
      localStorage.setItem("navPage", navPage);
      let currUrl = location.pathname;
      currUrl = currUrl.substr(currUrl.indexOf("/") + 1);
      console.log(currUrl);
      if (currUrl == "dashboard" || currUrl == "mis/dashboardnew") {
        localStorage.setItem("accessFrom", "dashboard");
        localStorage.setItem("navFrom", "summary");
      }
    }
  }

  setActiveRoute(url) {
    if (this.dashSidebar) {
      this.summaryFlag = false;
      this.usageTypeFlag = false;
      this.escalationFlag = false;
      this.threadFlag = false;
      this.gtsFlag = false;
      this.svcProFlag = false;
      this.eventFlag = false;
      this.leaderboardFlag = false;

      switch (url) {
        case "dashboard/v1":
        case "mis/dashboard":
          this.summaryFlag = true;
          break;
        case "mis/dashboard/dealer-usage":
          this.usageTypeFlag = true;
          break;
        case "mis/dashboard/threads":
          this.threadFlag = true;
          break;
        case "mis/dashboard/leaderboard":
          this.leaderboardFlag = true;
          break;
        case "mis/dashboard/escalations":
        case "mis/dashboard/escalation/models":
        case "mis/dashboard/escalation/region":
        case "mis/dashboard/escalation/monthly":
        case "mis/dashboard/escalation/active":
          this.escalationFlag = true;
          break;
        case "mis/dashboard/gts":
          this.gtsFlag = true;
          break;
        case "mis/dashboard/service-probing":
          this.svcProFlag = true;
          break;
        default:
          this.eventFlag = true;
          break;
      }
    }

    if (this.probingListSidebar) {
      this.homeFlag = false;
      this.chatFlag = false;
      this.techIssueFlag = false;
      this.manualFlag = false;
      this.documentFlag = false;
      this.articleFlag = false;
      this.probingFlag = false;
      this.landingFlag = false;
      this.dashboardFlag = false;
      switch (url) {
        case "probing-questions":
          this.probingFlag = true;
          break;
      }
    }
    if (this.landingListSidebar) {
      this.homeFlag = false;
      this.chatFlag = false;
      this.techIssueFlag = false;
      this.manualFlag = false;
      this.documentFlag = false;
      this.articleFlag = false;
      this.probingFlag = false;
      this.landingFlag = false;
      this.dashboardFlag = false;
      switch (url) {
        case "landing-page":
        case "cbt-v2/landing-page":
          this.landingFlag = true;
          break;
      }
    }
  }

  // ngAfterViewInit()
  // {
  //   this.setSidebarHeight();
  // }
  // Set Sidebar Height
  setSidebarHeight() {
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      let innetHeight = 0;
      innetHeight = windowHeight.heightMsTeam + 80;
      this.sidebarHeight = innetHeight;
    } else {
      let headerHeight =
        document.getElementsByClassName("prob-header")[0].clientHeight;
      let innetHeight = 0;
      if (!this.landingListSidebar) {
        if (document.getElementsByClassName("probing-content")[0])
          innetHeight =
            document.getElementsByClassName("probing-content")[0].clientHeight;
      } else {
        innetHeight = this.bodyHeight;
      }

      switch (this.accessModule) {
        case "dashboard":
        case "escalation":
          this.sidebarHeight = window.innerHeight;
          break;
        default:
          this.sidebarHeight = innetHeight + headerHeight;
          break;
      }
      //this.sidebarHeight = innetHeight;
      //alert(this.sidebarHeight);
    }
  }

  sideMenuAction() {
    let currMenu = this.pageData.page;
    console.log(currMenu)
    switch (currMenu) {
      case 'landing-page':
      case 'threads':
        this.menuListloaded.forEach((item) => {
          item.activeClass = (item.slug == currMenu) ? 1 : 0;
        });
        let checkArr = ['id', 'slug'];
        let unique = this.getMenuListingApi.unique(this.menuListloaded, checkArr);
        this.menuListloaded = unique;
        console.log(this.menuListloaded)
        break;
    }
  }
}
