import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { pageInfo, Constant, IsOpenNewTab } from "src/app/common/constant/constant";
import { FilterService } from "../../../../services/filter/filter.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { LandingpageService }  from '../../../../services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
declare var $: any;
import * as moment from "moment";
interface sortOption {
  name: string;
  code: string;
}
interface orderOption {
  name: string;
  code: string;
}

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  @ViewChild('ttarticles') tooltip: NgbTooltip;
  threadSortOptions: sortOption[];
  threadOrderOptions: orderOption[];
  public title = "Knowledge Article";
  public selectedCity1 = "";
  public enableNewThread = "";
  public yourpined = false;
  public selectedCity2: object;
  public filterInitFlag: boolean = false;
  public refreshThreads: boolean = false;
  public filterInterval: any;
  public filterLoading: boolean = true;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = true;
  public filterActiveCount: number = 0;
  pageAccess: string = "knowledgeArticles";
  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public pageData = pageInfo.knowledgeArticlePage;
  public pageOptions: object = {
    expandFlag: false,
  };
  public newThreadUrl: string = "knowledgearticles/manage";
  public groupId: number = 32;
  public threadTypesort = "";
  public historyFlag: boolean = false;
  public resetFilterFlag: boolean = false;
  public pageRefresh: object = {
    type: this.threadTypesort,
    expandFlag: this.expandFlag,
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
  public silentPushInterval: any;
  public teamSystem = localStorage.getItem("teamSystem");
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;

  constructor(
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

  ngOnInit(loadAction = ''): void {
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }
    this.threadSortOptions = [
      { name: "Sort by latest Threads", code: "sortthread" },
      { name: "Sort by latest Reply", code: "sortbyreply" },
      { name: "Your Team Threads", code: "teamthread" },
      { name: "Your Threads", code: "ownthread" },
      { name: "Most Popular", code: "popularthread" },
      { name: "Your Fixes", code: "fixes" },
      { name: "Your Pins", code: "yourpin" },
    ];
    this.threadOrderOptions = [
      { name: "Descending", code: "desc" },
      { name: "Ascending", code: "asc" },
    ];
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
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

    this.commonService._OnLayoutChangeReceivedSubject.subscribe((flag) => {
      this.rightPanel = JSON.parse(flag);
    });

    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);

    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
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
        historyFlag: this.historyFlag        
      };
      this.apiData = apiInfo;
      this.filterOptions["apiKey"] = Constant.ApiKey;
      this.filterOptions["userId"] = this.userId;
      this.filterOptions["domainId"] = this.domainId;
      this.filterOptions["countryId"] = this.countryId;     
      let year = parseInt(this.currYear);
      for (let y = year; y >= this.initYear; y--) {
        this.years.push({
          id: y,
          name: y.toString(),
        });
      }

      setTimeout(() => {
        this.silentPushInterval = setInterval(() => {
          let kaPush = localStorage.getItem('kaPush');
          if (kaPush) {
            console.log('in push', kaPush);
            let groupArr = JSON.parse(kaPush);
            let kaFilter = JSON.parse(localStorage.getItem("knowledgeArticleFilter"));
            let kaWs = kaFilter.workstream;
            let resWs = [];
            loadAction = 'push';
            if(groupArr.sort().toString() != kaWs.sort().toString()) {
              resWs = groupArr.concat(kaWs);
              kaFilter.workstream = resWs;
              localStorage.setItem("knowledgeArticleFilter", JSON.stringify(kaFilter));
            }
            setTimeout(() => {
              this.ngOnInit(loadAction);
            }, 10);
            localStorage.removeItem('kaPush');
          }
        }, 50)
      },1500);

      setTimeout(() => {
        // this.setScreenHeight();
        this.filterLoading = true;
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
            this.apiData["filterOptions"]['loadAction'] = loadAction;
            this.apiData["onload"] = true;
            this.threadFilterOptions = this.apiData["onload"];
            console.log(this.apiData);
            this.filterActiveCount = filterWidgetData.filterActiveCount;
            this.apiData["filterOptions"]["filterrecords"] = this.filterCheck();
            this.commonService.emitMessageLayoutrefresh(this.apiData["filterOptions"]);
            //  console.log(this.apiData+'---');
            console.log(this.filterOptions);           
            this.filterLoading = false;
            this.filterOptions["filterLoading"] = this.filterLoading;
            this.filterOptions["filterrecords"] = this.filterCheck();
            clearInterval(this.filterInterval);
            localStorage.removeItem("filterWidget");
            localStorage.removeItem("filterData");

            // Get Media List
          }
        }, 50);
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }
  applySearch(action, val) {}
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.pageRefresh["toggleFlag"] = toggleFlag;
    this.commonService.emitMessageLayoutChange(toggleFlag);
  }
  applyFilter(filterData) {
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.filterrecords = this.filterCheck(); 
      this.apiData["filterOptions"] = filterData;

      // Setup Filter Active Data

      this.filterActiveCount = this.commonService.setupFilterActiveData(
        this.filterOptions,
        filterData,
        this.filterActiveCount
      );
      this.filterOptions["filterActive"] =
        this.filterActiveCount > 0 ? true : false;
      // alert(filterData);
      filterData["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(filterData);
      //this.applySearch('get', this.searchVal);
      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    } else {
      this.resetFilter();
    }
    //  this.commonService.emitMessageReceived(filterData);

    //alert(JSON.stringify(filterData));
  }

  filterOutput(event) {
    let getFilteredValues = JSON.parse(
      localStorage.getItem("knowledgeArticleFilter")
    );

    this.applyFilter(getFilteredValues);
  }
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions["filterActive"] = false;
    this.currYear = moment().format("Y");

    localStorage.removeItem("knowledgeArticleFilter");
    this.ngOnInit();
    //this.commonService.emitMessageLayoutrefresh('');
  }
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
      let teamSystem = localStorage.getItem("teamSystem");
      let url = this.newThreadUrl;
      if (teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        window.open(url, IsOpenNewTab.openNewTab);
      }
    }

    //}
  }

  taponpin() {
    if (this.yourpined) {
      this.pageRefresh["type"] = "sortthread";
      this.pageRefresh["sortOrderBy"] = true;
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.yourpined = false;
    } else {
      this.pageRefresh["type"] = "pined";
      this.pageRefresh["sortOrderBy"] = true;
      this.pageRefresh["filterrecords"] = this.filterCheck();
      this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      this.yourpined = true;
    }
    //alert(1);
  }

  // if any one filter is ON
  filterCheck(){
    this.filterrecords = false;          
    if(this.pageRefresh["type"] == "pined"){
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
          if (response.status == "Success") {          
            if(id == ''){            
            let contentData = response.tooltips;
            for (var cd in contentData) { 
              let welcomePopupDisplay = localStorage.getItem('welcomePopupDisplay');
              if(welcomePopupDisplay == '1'){
                if(contentData[cd].id == '5' && contentData[cd].viewStatus == '0' ){					  
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
