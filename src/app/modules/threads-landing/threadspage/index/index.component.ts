import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab, ManageTitle } from "src/app/common/constant/constant";
import { FilterService } from "../../../../services/filter/filter.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
import * as moment from "moment";
import { AngularFireMessaging } from '@angular/fire/messaging';

interface sortOption {
  name: string;
  code: string;
}
interface orderOption {
  name: string;
  code: string;
}
interface feedbackOption {
  name: string;
  code: string;
}
@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit , OnDestroy{
  @ViewChild('ttthreads') tooltip: NgbTooltip;
  threadSortOptions: sortOption[];
  threadOrderOptions: orderOption[];
  public threadFeedbackSortOptions: feedbackOption[];
  public title = "Threads";
  public headTitle: string = "";
  public newThreadTxt: string = ManageTitle.actionNew;
  public selectedCity1 = "";
  public selectedCity3 = "";
  public enableNewThread = "";
  public yourpined = false;
  public selectedCity2: object;
  public filterInitFlag: boolean = false;
  public refreshThreads: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public filterActions: object;
  public expandFlag: boolean = true;
  public filterActiveCount: number = 0;
  pageAccess: string = "threads";
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public pageData = pageInfo.threadsPage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "threads/manage";
  public groupId: number = 2;
  public threadTypesort = "sortthread";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
    orderBy: 'desc'
  };
  public filterrecords: boolean = false;
  public filterOptions: Object = {
    filterExpand: this.expandFlag,
    page: this.pageAccess,
    initFlag: this.filterInitFlag,
    filterLoading: this.filterLoading,
    filterData: [],
    filterActive: true,
    filterHeight: 0,
    apiKey: "",
    userId: "",
    domainId: "",
    countryId: "",
    groupId: this.groupId,
    threadType: "25",
    action: "init",
    reset: this.resetFilterFlag,
    historyFlag: this.historyFlag,
    filterrecords: false
  };
  public headerData: Object;
  
  public thumbView: boolean = true;
  public threadFilterOptions;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public menuListloaded;
  public getcontentTypesArr = [];
  public roleId;
  public apiData: Object;
  public searchVal;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public currentContentTypeId: number = 2;
  public msTeamAccess: boolean = false;
  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public teamSystem = localStorage.getItem("teamSystem");
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;
  public enableDesktopPush: boolean = false;
  public access: string;
  public activePageAccess = "0";
  public msTeamAccessMobile: boolean = false;
  constructor(
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    private router: Router,
    private commonService: CommonService,
    private filterApi: FilterService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private landingpageServiceApi: LandingpageService    
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(action = ''): void {    
    if (this.teamSystem) {
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;       
      }
      else{
        this.msTeamAccessMobile = false; 
      }
    } else {
      this.msTeamAccess = false;
      this.msTeamAccessMobile = false; 
    }
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      this.enableNewThread = "activenew";
    } else {
      this.enableNewThread = "";
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;

    let industryType = this.commonService.getIndustryType();
    this.headTitle = (industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : ManageTitle.thread;
    this.newThreadTxt = `${this.newThreadTxt} ${this.headTitle}`;
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + `${this.headTitle}s`
    );    

   // help content
    this.commonService.welcomeContentReceivedSubject.subscribe((response) => {      
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if(welcomePopupDisplay == '1'){          
        if(this.msTeamAccess){ 
          setTimeout(() => {
            this.helpContent(0);  
          }, 900); 
        }         
      }
    });
   
   
    this.threadSortOptions = [
      { name: `Sort by latest ${this.headTitle}s`, code: "sortthread" },
      { name: "Sort by latest Reply", code: "sortbyreply" },
      { name: `Your Team ${this.headTitle}s`, code: "teamthread" },
      { name: `Your ${this.headTitle}s`, code: "ownthread" },
      { name: "Most Popular", code: "popularthread" },
      { name: "Your Fixes", code: "fixes" },
      { name: "Your Pins", code: "yourpin" },
    ];
  
    this.threadFeedbackSortOptions = [
      { name: "All feedback", code: "all" },
      { name: "Resolved and Support Helpful", code: "1" },
      { name: "Resolved Ourself; Support Received Late", code: "2" },
      { name: "Not Resolved", code: "3" },
      { name: "Not Sure", code: "4" },
     
    ];
    this.threadOrderOptions = [
      { name: "Descending", code: "desc" },
      { name: "Ascending", code: "asc" },
    ];
    /*
let threadSortFilter=localStorage.getItem('threadSortFilter');
if(threadSortFilter)
{
 let threadSortOpt= JSON.parse(threadSortFilter);
 this.selectedCity1=threadSortOpt;
}
let threadOrderFilter=localStorage.getItem('threadOrderFilter');
if(threadOrderFilter)
{
 let threadOrderopt= JSON.parse(threadOrderFilter);
 this.selectedCity2=threadOrderopt;
}
*/
    //this.selectedCity1='Your Pins';
    //this.selectedCity2={name: 'Desendng', code: 'desc'};
    
    if(this.domainId=='52')
    {
     
      this.threadSortOptions = [
        { name: "Sort by latest Threads", code: "sortthread" },
        { name: "Sort by latest Reply", code: "sortbyreply" },
        { name: "Your Team Threads", code: "teamthread" },
        { name: "Your Threads", code: "ownthread" },
        { name: "Most Popular", code: "popularthread" },
        { name: "Your Fixes", code: "fixes" },
        { name: "Your Pins", code: "yourpin" },
        { name: "Escalation Level 1", code: "escL1" },
        { name: "Escalation Level 2", code: "escL2" },
        { name: "Escalation Level 3", code: "escL3" },
      ];
    }
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);

    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {

      /* let listView = localStorage.getItem("threadViewType");
      this.thumbView =
      listView == "undefined" || listView == undefined || listView == "thumb"
        ? true
        : false; */    
        
      this.thumbView = true; 
      let threadViewType:any = this.thumbView ? "thumb" : "list";
      this.pageRefresh["threadViewType"] = threadViewType;
      console.log(this.thumbView);
      
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
      };

      let url:any = this.router.url;
      let currUrl = url.split('/');
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };
      let apiInfo = {
        apiKey: Constant.ApiKey,
        userId: this.userId,
        domainId: this.domainId,
        countryId: this.countryId,
        searchKey: this.searchVal,
        historyFlag: this.historyFlag,
        pushAction: false
      };
      this.apiData = apiInfo;
      this.filterOptions["apiKey"] = Constant.ApiKey;
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;
      let viewType = this.thumbView ? "thumb" : "list";
      this.filterOptions["threadViewType"] = viewType;
     
      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }
      setTimeout(() => {
        this.apiData["groupId"] = this.groupId;
        this.apiData["mediaId"] = 0;        
        // Get Filter Widgets
        this.commonService.getFilterWidgets(this.apiData, this.filterOptions);

        this.filterInterval = setInterval(() => {
          let filterWidget = localStorage.getItem("filterWidget");
          let filterWidgetData = JSON.parse(localStorage.getItem("filterData"));

          if (filterWidget) {
            console.log(this.filterOptions, filterWidgetData);
            this.filterOptions = filterWidgetData.filterOptions;
            this.apiData = filterWidgetData.apiData;
            //this.apiData['filterOptions']['workstream'] = ["1", "2"];
            this.threadFilterOptions = this.apiData["filterOptions"];
            this.apiData["onload"] = true;
            this.threadFilterOptions = this.apiData["onload"];            
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
            this.apiData["filterOptions"] = this.apiData["filterOptions"];
            this.apiData["filterOptions"]["action"] = action;
            console.log(this.apiData);
            this.commonService.emitMessageLayoutrefresh(
              this.apiData["filterOptions"]
            );
            //  console.log(this.apiData+'---');
            // console.log(this.filterOptions);
            this.filterLoading = false;
            this.filterOptions["filterLoading"] = this.filterLoading;
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");

            // Get Media List
          }
        }, 50);
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);

      setTimeout(() => {
        let chkData = localStorage.getItem('threadPushItem');
        let data = JSON.parse(chkData);
        if(data) {
          data.action = 'silentCheck';
        }
        //this.commonService.emitMessageReceived(data);
      }, 15000);
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  taponnewThread(event) {
    if (this.enableNewThread) {
      var aurl = "/new-threadv2";
      window.open(aurl, "_blank");
    }
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }
  applyFilter(filterData,loadpush='') {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck(); 
      if(loadpush)
      {
        console.log(filterData)
        filterData["loadAction"] = 'push';
        //filterData["filterOptions"]['loadAction'] = 'push';
        this.apiData['pushAction'] = true;
        let filterOptionData = this.filterOptions['filterData'];
        if(filterData.startDate != undefined || filterData.startDate != 'undefined') {
          let sindex = filterOptionData.findIndex(option => option.selectedKey == 'startDate');
          if(sindex >= 0) {
            filterOptionData[sindex].value = filterData.startDate; 
          }
          let eindex = filterOptionData.findIndex(option => option.selectedKey == 'endDate');
          if(eindex >= 0) {
            filterOptionData[eindex].value = filterData.endDate; 
          }
        }
      }
      this.apiData["filterOptions"] = filterData;
      setTimeout(() => {
        filterData["loadAction"] = '';
      }, 500);
    
      // Setup Filter Active Data
      //console.log(filterData);
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions["filterActive"] = this.filterActiveCount > 0 ? true : false;
      // alert(filterData);
      let viewType = this.thumbView ? "thumb" : "list";
      filterData["threadViewType"] = viewType;
      filterData["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(filterData);
      //this.applySearch('get', this.searchVal);
      setTimeout(() => {
        this.filterLoading = false;
      }, 1000);
    } else {
      this.resetFilter();
    }
    //  this.commonService.emitMessageReceived(filterData);

    //alert(JSON.stringify(filterData));
  }

  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem("threadFilter");
    this.ngOnInit('reset');
    //this.commonService.emitMessageLayoutrefresh('');
  }
  taponpin() {
    if (this.yourpined) {
      this.pageRefresh["type"] = "sortthread";
      this.pageRefresh["sortOrderBy"] = true;
      let viewType = this.thumbView ? "thumb" : "list";
      this.pageRefresh["threadViewType"] = viewType;   
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.yourpined = false;
    } else {
      this.pageRefresh["type"] = "yourpin";
      this.pageRefresh["sortOrderBy"] = true;
      let viewType = this.thumbView ? "thumb" : "list";
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.pageRefresh["threadViewType"] = viewType;
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.yourpined = true;
    }
    //alert(1);
  }
 // Change the view
 viewType(actionFlag) {
    this.thumbView = actionFlag ? false : true;
    let viewType = this.thumbView ? "thumb" : "list";  
    setTimeout(() => {
      this.pageRefresh["action"] = 'view';
      this.pageRefresh["threadViewType"] = viewType;  
      this.pageRefresh["filterrecords"] = this.filterCheck(); 
      localStorage.setItem("threadViewType",viewType);
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
    }, 100);
  }
  selectEventSort(event)
  {
    this.threadTypesort=event;
    //localStorage.setItem('threadSortFilter',JSON.stringify(event.value));
    this.pageRefresh['type']=event.value.code;     
    this.pageRefresh['sortOrderBy']=true; 
    let viewType = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = viewType;
    this.pageRefresh["filterrecords"] = this.filterCheck(); 
    this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
  }
  selectEventFilterOrder(event)
  {
    this.threadTypesort=event;
    //localStorage.setItem('threadSortFilter',JSON.stringify(event.value));
    this.pageRefresh['feedbackStatus']=event.value.code;     
    this.pageRefresh['sortOrderBy']=false; 
    let viewType = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = viewType;
    this.pageRefresh["filterrecords"] = this.filterCheck(); 
    this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
  }
  selectEventOrder(event)
  {    
    this.threadTypesort=event;
   // localStorage.setItem('threadOrderFilter',JSON.stringify(event.value));
    this.pageRefresh['orderBy']=event.value.code; 
    this.pageRefresh['sortOrderBy']=true; 
    let viewType = this.thumbView ? "thumb" : "list";
    this.pageRefresh["threadViewType"] = viewType;
    this.pageRefresh["filterrecords"] = this.filterCheck();  
    this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
    this.applyFilter(getFilteredValues,event);
  }

   // if any one filter is ON
   filterCheck(){
    this.filterrecords = false;
    if(this.pageRefresh['orderBy'] != 'desc'){
      this.filterrecords = true;
    }
    if(this.pageRefresh['type'] != 'sortthread'){
      this.filterrecords = true;
    }     
    if(this.filterActiveCount > 0){
      this.filterrecords = true;
    }   
    console.log("**********************");
    console.log(this.filterrecords);
    console.log("**********************");   
    return this.filterrecords;
  }

  // nav search page
  taponSearchPage(){
    let url = "search-page";
    this.router.navigate([url]);
  }


  
  // Nav Part Edit or View
  navPart() {
    //if(this.enableNewThread) {
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      if (this.userId) {
        let url = this.newThreadUrl;
        window.open(url, IsOpenNewTab.openNewTab);
      } else {
        localStorage.setItem("prod_type", "2");
        var aurl = "/new-threadv2";
        window.open(aurl, "_blank");
      }
    } else {
      let url = this.newThreadUrl;
      if (this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    }

    //}
  }
  // helpContent list and view
  helpContent(id){	 
    id = (id>0) ? id : '';  
    const apiFormData = new FormData();  
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('tooltipId', id);
  
    this.landingpageServiceApi.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
      console.log('TOOLTIPPPPPPPP response: ', response);
      if (response.status == "Success") {          
        if(id == ''){            
        let contentData = response.tooltips;
        for (var cd in contentData) { 
          let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
          if(welcomePopupDisplay == '1'){
            if(contentData[cd].id == '7' && contentData[cd].viewStatus == '0' ){					  
              console.log(contentData[cd].title);
              this.thelpContentStatus = contentData[cd].viewStatus;              				
              this.thelpContentFlagStatus = true;				  
              this.thelpContentId = contentData[cd].id;              
              this.thelpContentTitle = contentData[cd].title;
              this.thelpContentContent = contentData[cd].content;
              this.thelpContentIconName = contentData[cd].itemClass;  
            }
          }
        }				
        if(this.thelpContentFlagStatus){
            this.tooltip.open();
        }
        }
        else{
        console.log(response.result);
        this.tooltip.close();
        }         
      }
    });
    } 


    requestPermission(state) {

      this.angularFireMessaging.requestToken.subscribe(
        (token) => {
          if (token && token != null) {
            this.enableDesktopPush = false;
          }
          else {
            this.enableDesktopPush = true;
          }
  
          console.log(token);
          let fcmAction = '';
          let fcmOldToken = '';
          let tokenKey = token;
  
          let fcmToken = localStorage.getItem('fcm_token');
  
          if (fcmToken == null) {
            localStorage.setItem('fcm_token', token);
          } else if (fcmToken != null && token != fcmToken) {
            fcmAction = 'update';
            fcmOldToken = fcmToken;
            localStorage.setItem('fcm_token', token);
          }
  
          const apiFormData = new FormData();
          apiFormData.append('apiKey', Constant.ApiKey);
          apiFormData.append('domainId', this.domainId);
          apiFormData.append('countryId', this.countryId);
          apiFormData.append('userId', this.userId);
          apiFormData.append('deviceName', this.browserDetection());
          apiFormData.append('appVersion', '1.0');
          apiFormData.append('type', 'w');
          apiFormData.append('token', tokenKey);
          apiFormData.append('status', state);
          if (fcmAction == 'update') {
            apiFormData["oldToken"] = fcmOldToken;
          }
  
  
          //console.log(apiFormData);
  
          this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {
  
            //console.log(response);
          });
  
  
        },
        (err) => {
          this.enableDesktopPush = true;
          console.log('Unable to get permission to notify.', err);
        }
      );
    }

      /* FCM SETUP */
  browserDetection() {
    let browserName = '';
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
      // insert conditional IE code here
      browserName = "MSIE";
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
      // insert conditional Chrome code here
      browserName = "Chrome";
    }
    //Check if browser is Firefox 
    else if (navigator.userAgent.search("Firefox") >= 0) {
      // insert conditional Firefox Code here
      browserName = "Firefox";
    }
    //Check if browser is Safari
    else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    }

    else {
      browserName = "others";
    }
    return browserName;
  }

   
  requestActivePageAccess(state) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        //console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('pageAccess', this.access);
        apiFormData.append('isActivePage', this.activePageAccess);
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        //console.log(apiFormData);

        this.landingpageAPI.ActiveDevicesOnPageWeb(apiFormData).subscribe((response) => {

          //console.log(response);
        });


      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  //logout
  msLoginOut() {
    this.requestPermission(0);
    this.requestActivePageAccess(0);
    this.authenticationService.logout();
  }
    
  ngOnDestroy(): void {
    localStorage.removeItem("threadViewType");
  }
}
