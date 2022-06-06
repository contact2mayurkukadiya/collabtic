import { Component, OnInit, OnDestroy, HostListener, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { trigger, transition, style, animate, sequence } from "@angular/animations";
import * as moment from "moment";
import { Router,NavigationEnd } from '@angular/router';
import { PlatFormType, windowHeight, threadBulbStatusText, Constant, RedirectionPage, pageTitle, PageTitleText, ContentTypeValues, DefaultNewImages, DefaultNewCreationText,
  forumPageAccess,
  MediaTypeInfo,
  ManageTitle,
  DocfileExtensionTypes,
  firebaseCredentials,
  pageInfo,
  PushTypes
} from "src/app/common/constant/constant";
import { CommonService } from "../../../services/common/common.service";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { ApiService } from '../../../services/api/api.service';
import { NgxMasonryComponent } from "ngx-masonry";
import { Subscription } from "rxjs";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database
import { AngularFireAuth } from  "@angular/fire/auth";
import { PlatformLocation } from "@angular/common";
import { Observable } from 'rxjs';
import { Table } from "primeng/table";
import { retry } from "rxjs/operators";

declare var $: any;
@Component({
  selector: "app-threads-page",
  templateUrl: "./threads-page.component.html",
  styles: [
    `
      .masonry-item {
        width: 268px;
      }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }
    `,
  ],
  animations: [
    trigger("threadsTab", [
      transition("* => void", [
        style({
          height: "*",
          opacity: "1",
          transform: "translateX(0)",
          "box-shadow": "0 1px 4px 0 rgba(0, 0, 0, 0.3)",
        }),
        sequence([
          animate(
            ".25s ease",
            style({
              height: "*",
              opacity: ".2",
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
          animate(
            ".1s ease",
            style({
              height: "0",
              opacity: 0,
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
        ]),
      ]),
      transition("void => active", [
        style({
          height: "0",
          opacity: "0",
          transform: "translateX(20px)",
          "box-shadow": "none",
        }),
        sequence([
          animate(
            ".1s ease",
            style({
              height: "*",
              opacity: ".2",
              transform: "translateX(20px)",
              "box-shadow": "none",
            })
          ),
          animate(
            ".35s ease",
            style({
              height: "*",
              opacity: 1,
              transform: "translateX(0)",
              "box-shadow": "0 1px 4px 0 rgba(0, 0, 0, 0.3)",
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class ThreadsPageComponent implements OnInit, OnDestroy {
  public sconfig: PerfectScrollbarConfigInterface = {};
  @Input() parentData;
  @Input() fromOthersTab;
  @Input() pageDataInfo;
  @Input() fromSearchPage;
  @Input() tapfromheader;
  //@Input() threadFilterOptions:any=[];
  @Input() filterOptions;
  @Output() filterOutput: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  @ViewChild("listDiv", { static: false }) listDiv: ElementRef;
  subscription: Subscription = new Subscription();
  public pageTitleText='';
  public redirectionPage='';
  public priorityIndexValue='';
  public threadIdArrayInfo=[];
  public countryId;
  public domainId;
  public firebaseAuthcreds;
  public threadsAPIcall;
  public pageInfo: any = pageInfo.threadsPage;
  public windowsItems = [];
  public nothingtoshow: boolean = false;
  public loadedthreadAPI: boolean = false;
  public menuListloaded = [];
  public loadingelanding: boolean = true;
  public tvsFlag: boolean = false;
  public platformId = 0;
  public threadFilterOptions;
  public industryType: any = [];
  public userId;
  public roleId;
  public myOptions;
  public fromfirebaseData=0;
  public midHeight;
  public listHeight;
  public pTableHeight = '450px';
  public listWidth;
  public onInitload = false;
  public threadListArray = [];
  public threadListArrayNew = [];
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public loadingthread: boolean = false;
  public updateMasonryLayout: boolean = false;
  public loadingthreadmore: boolean = false;
  public centerloading: boolean = false;
  public itemLimitTotal: number = 10;
  public itemLimit: number = 10;
  public itemwidthLimit;
  public displayNoRecords: boolean = false;
  public displayNoRecordsDefault: boolean = false;
  public newThreadInfo = "";
  public displayNoRecordsShow = 0;
  public contentTypeValue;
  public contentTypeDefaultNewImg;
  public contentTypeDefaultNewText;
  public contentTypeDefaultNewTextDisabled: boolean = false;
  public createThreadUrl = "threads/manage";
  public proposedFixTxt = "";
  public threadwithFixTxt = "";
  public shareFixTxt = "";
  public shareSummitFixTxt = "";
  public threadwithHelpfulFixTxt = "";
  public threadwithNotFixTxt = "";
  public threadCloseTxtTxt = "";
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number = 0;
  public scrollCallback: boolean = false;
  public ItemArray = [];
  public workstreamFilterArr = [];
  public outputFilterData: boolean = false;
  public makeNameArr = [];
   notes_Firebase_Data :AngularFireList<any>;

  notes_angular :Observable<any[]>;
  public optionFilter = "";
  public itemTotal: number;
  public apiData: Object;
  public threadSortType = "sortthread";
  public threadOrderByType = "desc";
  public feedbackStatus='all';
  public searchValue = "";
  public MediaTypeInfo = MediaTypeInfo;
  public DocfileExtensionTypes = DocfileExtensionTypes;
  public user: any;
  public errorDtcActiveIcon: string =
    "assets/images/workstreams-page/error-alert-icon-2.svg";
  public errorDtcIcon: string =
    "assets/images/workstreams-page/no_error_code.png";
  public techSubmmitFlag: boolean = false;

  public thumbView: boolean = true;
  public bodyClass1: string = "parts-list";
  public bodyClass2: string = "parts";
  public bodyElem;
  public opacityFlag: boolean = false;
  public hideFlag: boolean = false;
  public cols: any[];
  public CBADomian: boolean = false;
  public threadSubTypeData: any[];
  public threadSubTypeDataArr = [];
  public threadSubType = [];
  public threadSubTypeFlag: boolean = false;
  public setTWidth;
  public setTWidthDuplicateFlag:boolean = false;
  public rmHeight: any = 160; 
  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      if (this.pageDataInfo == this.pageInfo || this.pageDataInfo == pageInfo.searchPage) {
        setTimeout(() => {
          let rmListHeight = 10;
          let containerHeight = document.getElementsByClassName('thread-container')[0];
          if(containerHeight) {
            this.listHeight = containerHeight.clientHeight - rmListHeight;
            this.pTableHeight = parseInt(this.listHeight)-53+'px';
            let listItemHeight;
            if (this.thumbView) {
              listItemHeight = document.getElementsByClassName("masonry-item-container")[0].clientHeight;
            } else {
              listItemHeight = document.getElementsByClassName("thread-list-table")[0].clientHeight;
            }
            if(containerHeight >= listItemHeight) {
              this.loadingthreadmore = true;
              console.log('in', this.itemOffset)
              this.loadThreadsPage();  
              this.itemOffset += this.itemLimit;
            }
            console.log(containerHeight, listItemHeight)  
          }
        }, 500);        
      } else {
        if (this.pageDataInfo == "4") {
          //this.midHeight = windowHeight.height - 90;
          this.midHeight = 210;
          this.listHeight = windowHeight.height - 95;
        } else if (this.pageDataInfo == "6") {
          //this.midHeight = windowHeight.height - 90;
          this.midHeight = 210;
          this.listHeight = windowHeight.height - 95;
        } else {
          //this.midHeight = windowHeight.height - 127;
          this.midHeight = 210;
          this.listHeight = windowHeight.height - 105;  
        } 
      }     
      //this.getnorows();
    }, 50);

    setTimeout(() => {
      //this.loadThreadsPage();     
      setTimeout(() => {
        if (this.listDiv != undefined && !this.thumbView) {
          let listWidth1 = this.listDiv.nativeElement.clientWidth;  
          let listWidth2 = document.getElementsByClassName("mat-table")[0].clientWidth;
          this.listWidth = listWidth1 > listWidth2 ? listWidth1 : listWidth1;
          $(".mat-inner-container").css("width", this.listWidth);          
          console.log(this.listWidth);           
        }            
      }, 1000);
    }, 200);
  }

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    private router: Router,
    public sharedSvc: CommonService,
    private getMenuListingApi: CommonService,
    private authenticationService: AuthenticationService,
    private dbF: AngularFireDatabase,
    public afAuth:  AngularFireAuth,
    private location: PlatformLocation,
    public apiUrl: ApiService,
  ) {
    
    this.location.onPopState (() => { 

      if(!document.body.classList.contains(this.bodyClass1)) {
        document.body.classList.add(this.bodyClass1);
      } 
      if(!document.body.classList.contains(this.bodyClass2)) {
        document.body.classList.add(this.bodyClass2);
      }      
      let url = this.router.url.split('/');   
      if(url[1] == RedirectionPage.Threads) { 
          this.opacityFlag = true;
          this.backScroll(); 
      }  
      if(url[1] == RedirectionPage.Search ) {                
        let sNavUrl = localStorage.getItem('sNavUrl');    
        if(sNavUrl == 'threads'){ 
          if(this.apiUrl.searchPageRedirectFlag == "1"){
            this.apiUrl.searchPageRedirectFlag = "2";
            this.opacityFlag = true;
            this.backSearchScroll();
          }
        }
        else{
          this.loadingthread = false; 
          this.opacityFlag = false;
          this.backSearchHomeScroll();
        }
      }    
    });    
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.bodyElem.classList.add(this.bodyClass1);
    this.bodyElem.classList.add(this.bodyClass2);
    this.onInitload = false;
    let filterrecords = false;
    this.countryId = localStorage.getItem('countryId');
    this.cols = [
      { field: 'userName', header: 'Technician', columnpclass:'w1 header thl-col-1 col-sticky' },
      { field: 'threadTitle', header: 'Problem Title', columnpclass:'w2 header thl-col-2 col-sticky' },
      { field: 'currentDtc', header: 'Error Code', columnpclass:'w3 header thl-col-3' },
      { field: 'threadId', header: 'Id', columnpclass:'w4 header thl-col-4'},
      { field: 'make', header: 'Make', columnpclass:'w5 header thl-col-5'},
      { field: 'model', header: 'Model',columnpclass:'w6 header thl-col-6' },
      { field: 'date', header: 'Created On',columnpclass:'w7 header thl-col-7' },
      { field: 'shareFix', header: 'Fix Status',columnpclass:'w8 header thl-col-8 '},
      { field: 'threadStatus', header: 'Status',columnpclass:'w9 header thl-col-9 status-col col-sticky'},
    ];
    this.industryType = this.sharedSvc.getIndustryType();
    if (this.industryType.id == 2) {
      this.errorDtcActiveIcon = "assets/images/common/engine-icon.png";
      this.errorDtcIcon = "assets/images/common/engine-gray-icon.png";
    }
    let platformId: any = localStorage.getItem('platformId');
    let domainId: any = localStorage.getItem('domainId')
    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.tvsFlag = (this.platformId == 2 && domainId == 52) ? true : false;
    this.CBADomian = (platformId == PlatFormType.CbaForum) ? true : false;
    this.pageTitleText = (this.industryType.id == 3 && domainId == 97) ? `${ManageTitle.feedback}s` : this.pageTitleText;
    console.log(this.pageTitleText, this.industryType.id, domainId)
    this.newThreadInfo = `This is where your ${this.pageTitleText} will appear as you collaborate with your colleagues during a diagnostics and repair process. Get started by tapping on ‘New’.`;
    if(this.pageDataInfo == pageInfo.workstreamPage) {
      this.rmHeight = 230;
    }

    this.subscription.add(
      this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {        
        console.log("-----------253-----------", r);
        this.priorityIndexValue = "1";
        this.threadIdArrayInfo = [];
        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        let pushAction = setdata.pushAction;
        let action = setdata.action;
        let access = setdata.access;
        let cpageInfo = setdata.pageInfo;
        if(action == 'silentUpdate' && !this.thumbView) {
          this.opacityFlag = true;
          this.loadThreadsPage();
          this.backScroll();
          return false;
        }
        cpageInfo = (cpageInfo != '') ? cpageInfo : this.pageDataInfo;
        console.log(cpageInfo, pageInfo.threadsPage)
        if((access == 'threads' || cpageInfo == pageInfo.threadsPage) && pushAction == 'load') {
          switch(action) {
            case 'silentCheck':
              console.log(setdata)
              let pushFlag = true;
              var checkgroups = setdata.groups;
              let make = setdata.makeName;
              let clearFields = ['workstream', 'make'];
              let groupArr = JSON.parse(checkgroups);
              let threadWs = groupArr;
              if (checkgroups) {
                let fthreadFilter = JSON.parse(
                  localStorage.getItem("threadFilter")
                );

                console.log(fthreadFilter)

                for (let ws of threadWs) {
                  let windex = fthreadFilter.workstream.findIndex(
                    (w) => w == ws
                  );
                  if (windex == -1) {
                    pushFlag = false;
                    fthreadFilter.workstream.push(ws);
                  }
                }
                let tws = fthreadFilter.workstream;
                console.log(pushFlag)
                if(fthreadFilter.make) {
                  if(pushFlag) {
                    clearFields = (fthreadFilter.make[0] == make) ? clearFields : [];
                    let chkFilterData = this.sharedSvc.checkFilterApply(fthreadFilter, clearFields);
                    if(fthreadFilter.make.length > 0 && chkFilterData.filterCount > 0) {
                      let clearItems = chkFilterData.clearItems;
                      let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                      fthreadFilter = updatedFilter;
                      console.log(updatedFilter);
                      let currUrl = this.router.url.split('/');
                      let navFrom = currUrl[1]
                      if(navFrom == 'threads') {
                        setTimeout(() => {
                          this.filterOutput.emit("push");
                        }, 1500);
                      }
                    } else {
                      this.loadThreadsPage(pushFlag);
                    }
                  } else {
                    let clearItems:any = [];
                    Object.entries(fthreadFilter).forEach((item) => {
                      let key = item[0];
                      if(key != 'workstream') {
                        clearItems.push(item[0]);
                      }
                      let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                      fthreadFilter = updatedFilter;
                    });
                    
                    localStorage.setItem(
                      "threadFilter",
                      JSON.stringify(fthreadFilter)
                    );
                    let currUrl = this.router.url.split('/');
                    let navFrom = currUrl[1];
                    console.log(4564, navFrom)
                    if(navFrom == 'threads') {
                      this.itemOffset = 0;
                      this.apiData['offset'] = this.itemOffset;
                      this.threadListArray = [];
                      this.threadListArrayNew = [];
                      this.apiData = apiInfo;
                      setTimeout(() => {
                        this.filterOutput.emit("push");
                      }, 1500);
                    }

                    /* this.itemOffset = 0;
                    this.apiData['offset'] = this.itemOffset;
                    this.threadListArray = [];
                    this.threadListArrayNew = [];
                    this.apiData = apiInfo;
                    this.loadingthread = true;
                    this.loadThreadsPage(); */
                  }
                }
                
                console.log(tws, pushFlag);
                console.log(JSON.stringify(fthreadFilter));
                
                this.outputFilterData = true;
                console.log(this.outputFilterData);

                localStorage.setItem(
                  "threadFilter",
                  JSON.stringify(fthreadFilter)
                );
              }
              return false;
              break;
            case 'silentLoad':
              if(setdata.silentLoadCount > 0) {
                if(!document.body.classList.contains(this.bodyClass1)) {
                  document.body.classList.add(this.bodyClass1);
                }
                /* this.opacityFlag = false;
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
                setTimeout(() => {
                  this.updateMasonryLayout = false;
                  this.hideFlag = true;
                }, 750); */
                let limit = setdata.silentLoadCount;
                this.loadThreadsPage(true, limit);
                return false;
              }
              break;
            case 'silentDelete':
              let threadIndex = this.threadListArray.findIndex(option => option.threadId === setdata.threadId);
              this.threadListArray.splice(threadIndex, 1);
              setTimeout(() => {
                if(this.thumbView) {
                  this.masonry.reloadItems();
                  this.masonry.layout();
                  this.updateMasonryLayout = true;
                  setTimeout(() => {
                    this.updateMasonryLayout = false;
                  }, 750);
                }  
              }, 100);
              
              console.log(setdata.threadId, threadIndex, this.threadListArray);
              this.itemTotal -= 1;
              this.itemLength -= 1; 
              break; 
            case 'silentUpdate':
              console.log(456)
              this.opacityFlag = true;
              setTimeout(() => {
                let threadId = parseInt(setdata.dataId);
                let dataInfo = setdata.dataInfo;
                console.log(dataInfo)
                let uthreadIndex = this.threadListArray.findIndex(option => option.threadId === threadId);
                let flag: any = false;
                let pageDataIndex = pageTitle.findIndex(option => option.slug == this.redirectionPage);
                let pageDataInfo = pageTitle[pageDataIndex].dataInfo; 
                localStorage.removeItem(pageDataInfo);
                if(this.thumbView) {
                  this.setupThreadData(action, flag, dataInfo, uthreadIndex, uthreadIndex);                
                }
              }, 500);
              return false;
              break;   
          }
          console.log(setdata, this.pageDataInfo, cpageInfo);
          if (this.pageDataInfo == cpageInfo) {
            let sindex = PushTypes.findIndex(option => option.url == this.redirectionPage);
            let silentCountTxt = PushTypes[sindex].silentCount;
            localStorage.removeItem(silentCountTxt);
            var checkpushtype = setdata.pushType;
            var checkmessageType = setdata.messageType;
            var checkgroups = setdata.groups;
            let make = setdata.makeName;
            let clearFields = ['workstream', 'make', 'action', 'threadViewType', 'loadAction'];
            let additionalFields = ['action', 'threadViewType', 'loadAction'];
            //var checkgroups='["11"]';
            let fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
            let twsLen:any = (fthreadFilter.workstream) ? fthreadFilter.workstream.length : 0;
            let emptyArray = [];
            let chkFilter = this.sharedSvc.checkFilterApply(fthreadFilter, additionalFields);
            let chkFilterCount:any = chkFilter.filterCount;
            console.log(twsLen, chkFilterCount)
            console.log(fthreadFilter);
            console.log("message received! ####", r);
            if (
              (checkpushtype == 1 && checkmessageType == 1) ||
              checkpushtype == 12
            ) {
              if (checkgroups) {
                let groupArr = JSON.parse(checkgroups);
                console.log(groupArr);
                if (groupArr) {
                  console.log(fthreadFilter.workstream);
                  let findgroups:any = 0;
                  let notifyScreen = (fthreadFilter.workstream) ? true : false;
                  if (fthreadFilter.workstream) {
                    let arrworkstm = fthreadFilter.workstream;
                    findgroups = groupArr.filter(x => !arrworkstm.includes(x));
                    if(checkpushtype == 1) {
                      findgroups = (findgroups.length == 0) ? 0 : -1;
                      notifyScreen = (findgroups == -1 && chkFilterCount == 1) ? false : notifyScreen;
                    }
                  }
                  console.log(checkpushtype, findgroups);
                  if (checkpushtype == 12) {
                    //localStorage.setItem('threadPushItem', JSON.stringify(r));
                    let threadWs = groupArr;
                    let pushFlag = true;
                    if (threadWs.length > 0) {
                      let fthreadFilter = JSON.parse(
                        localStorage.getItem("threadFilter")
                      );
                      console.log(twsLen, chkFilterCount);
                      for (let ws of threadWs) {
                        let windex = fthreadFilter.workstream.findIndex(
                          (w) => w == ws
                        );
                        if (windex == -1) {
                          pushFlag = false;
                          fthreadFilter.workstream.push(ws);
                        }
                      }

                      let tws = fthreadFilter.workstream;
                      console.log(tws, pushFlag);
                      console.log(JSON.stringify(fthreadFilter));
                      
                      this.outputFilterData = true;
                      console.log(this.outputFilterData);

                      if((twsLen == 0 && chkFilterCount == 0) || (twsLen == 1 && chkFilterCount == 1 && pushFlag && fthreadFilter.make.length == 0)) {
                        let flag: any = true;
                        setTimeout(() => {
                          this.loadThreadsPage(flag);
                        }, 1500);
                        return false;
                      }

                      localStorage.setItem(
                        "threadFilter",
                        JSON.stringify(fthreadFilter)
                      );

                      let currUrl = this.router.url.split('/');
                      let navFrom = currUrl[1];
                      console.log(pushFlag)
                      if(pushFlag) {
                        fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
                        if(fthreadFilter.make) {
                          console.log(fthreadFilter, fthreadFilter.make[0])
                          clearFields = (fthreadFilter.make[0] == make) ? clearFields : additionalFields;
                          let chkFilterData = this.sharedSvc.checkFilterApply(fthreadFilter, clearFields);
                          console.log(navFrom, fthreadFilter.make.length, chkFilterData)
                          if(navFrom == 'threads' && fthreadFilter.make.length > 0 && chkFilterData.filterCount > 0) {
                            console.log('in');
                            let clearItems = chkFilterData.clearItems;
                            clearItems = clearItems.filter(item => item !== 'workstream');
                            let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                            if(fthreadFilter.make[0] == make) {
                              updatedFilter.make = [make];
                            }
                            fthreadFilter = updatedFilter;
                            console.log(updatedFilter);
                            localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));
                            setTimeout(() => {
                              this.filterOutput.emit("push");
                            }, 1500);
                          } else {
                            if(make != '' && fthreadFilter.make[0] != make) {
                              fthreadFilter.workstream = [];
                              localStorage.setItem("threadFilter", JSON.stringify(fthreadFilter));
                              setTimeout(() => {
                                this.filterOutput.emit("push");
                              }, 1500);
                            } else {
                              setTimeout(() => {
                                this.loadThreadsPage(pushFlag);
                              }, 1500);
                            }
                          }
                        }                        
                      } else {
                        if(navFrom == 'threads') {
                          fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
                          let clearItems:any = ['action', 'threadViewType'];
                          let sameMake = (fthreadFilter.make.length > 0 && fthreadFilter.make[0] == make) ? true : false;
                          let makeFlag:any = (chkFilterCount == 1 && sameMake) ? true : false;
                          if(makeFlag) {
                            setTimeout(() => {
                              this.loadThreadsPage(makeFlag);
                            }, 1500);
                            return false;
                          }                          
                          Object.entries(fthreadFilter).forEach((item) => {
                            let key = item[0];
                            console.log(sameMake)
                            clearItems.push(key);
                          });
                          if(sameMake) {
                            clearItems = clearItems.filter(item => item !== 'make');
                          }
                          console.log(clearItems)
                          let updatedFilter = this.sharedSvc.clearFilterValues(fthreadFilter,clearItems);
                          fthreadFilter = updatedFilter;
                          localStorage.setItem(
                            "threadFilter",
                            JSON.stringify(fthreadFilter)
                          );
                          setTimeout(() => {
                            this.filterOutput.emit("push");
                          }, 500);                                                   
                        }
  
                        this.itemOffset = 0;
                        this.apiData['offset'] = this.itemOffset;
                        this.threadListArray = [];
                        this.threadListArrayNew = [];
                        this.apiData = apiInfo;
                        if(navFrom != 'threads') {
                          this.loadingthread = true;
                          this.loadThreadsPage();
                        }
                      }
                    }
                  }

                  if (findgroups != -1 || notifyScreen) {
                    if (checkpushtype != 12) {
                      this.loadThreadsPage(true);
                    }
                  }
                }
              }
            }
          }

          setTimeout(() => {
          // this.sharedSvc.emitOnLeftSideMenuBarSubject('');
            },4000);
        }
      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {        
        console.log("-----------353-----------", r);
        let action = r['action'];
        console.log(action)
        this.thumbView = (action == '' && r['threadViewType'] == 'thumb') ? true : this.thumbView;
        this.rmHeight = 160;
        if(r['threadViewType'] != undefined && r['threadViewType'] != 'undefined') {
          this.rmHeight = (r['threadViewType'] == 'thumb') ? this.rmHeight : this.rmHeight-20;
        }
        switch(action) {
          case 'view':
            let viewType = r['threadViewType']; 
            this.thumbView = (viewType == 'list') ? false : true;
            let rmListHeight = (this.thumbView) ? 95 : 20;
            let containerHeight = document.getElementsByClassName('thread-container')[0].clientHeight;
            console.log(containerHeight)
            this.listHeight = containerHeight + rmListHeight;
            this.pTableHeight = parseInt(this.listHeight)-53+'px';
            if (this.threadSubTypeFlag) {        
              let rmListHeight = (this.thumbView) ? 159 : 134;
              //this.midHeight = windowHeight.height - rmMidHeight;
              this.midHeight = 210;
              this.listHeight = windowHeight.height - rmListHeight;
              this.pTableHeight = parseInt(this.listHeight)-53+'px';
            }

            if(this.thumbView) {
              this.rmHeight += 20;
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 750);
            }
            setTimeout(() => {
              this.scrollTop = 0;
              let id = 'thread-data-container';
              this.scrollToElem(id);
            }, 100);
            return false;
          break;
          case 'side-menu':
            let access = r['access'];
            let page = r['page'];
            if(access == 'Threads' || page == 'threads') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.opacityFlag = false;
              this.masonry.reloadItems();
              this.masonry.layout();
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
                this.hideFlag = true;
              }, 750);
            }
            return false;
            break;
          case 'folder-layout':
          case 'file-layout':
            return false;
            break;
          case 'get':
          case 'reset':  
            this.scrollTop = 0;
            let id = (this.thumbView) ? 'thread-data-container' : 'matrixTable';
            this.scrollToElem(id);
            break;    
        }
        this.priorityIndexValue = "1";
        this.threadIdArrayInfo = [];
        if (this.threadsAPIcall) {
          this.threadsAPIcall.unsubscribe();
          this.loadingthread = true;
        }

        this.itemLength = 0;
        var setdata = JSON.parse(JSON.stringify(r));
        filterrecords = setdata.filterrecords;
        if(this.pageDataInfo == pageInfo.searchPage) {
          this.rmHeight = this.rmHeight+32;
        }
        if (this.pageDataInfo == pageInfo.searchPage && (setdata.reset == false || setdata.reset == true) ) {
          this.setTWidthDuplicateFlag = false;
          localStorage.setItem("searchPageFilter", JSON.stringify(r));
        }

        let filterData;
        let threadSortType = this.threadSortType;
        let threadOrderType = this.threadOrderByType;

        let searchValue = this.searchValue;
        if (searchValue && (searchValue != undefined || searchValue != "undefined" || searchValue != null)) {
          searchValue = this.searchValue;
        } else {
          searchValue = "";
        }
        let actionload = setdata.action;

        if (setdata.sortOrderBy) {
          actionload = "get";
          if (setdata.type) {
            threadSortType = setdata.type;
          } else {
            let threadSortFilter = localStorage.getItem("threadSortFilter");
            if (
              threadSortFilter &&
              threadSortFilter != null &&
              threadSortFilter != "undefined" &&
              threadSortFilter != "null"
            ) {
              let sortOpt = JSON.parse(threadSortFilter);
              if (sortOpt) {
                if (sortOpt.code) {
                  threadSortType = sortOpt.code;
                }
              }
            }
          }

          if (setdata.orderBy) {
            actionload = "get";
            threadOrderType = setdata.orderBy;
          } else {
            let threadOrderFilter = localStorage.getItem("threadOrderFilter");

            if (
              threadOrderFilter &&
              threadOrderFilter != null &&
              threadOrderFilter != "undefined" &&
              threadOrderFilter != "null"
            ) {
              let orderOpt = JSON.parse(threadOrderFilter);
              if (orderOpt) {
                if (orderOpt.code) {
                  threadOrderType = orderOpt.code;
                }
              }
            }
          }

          filterData = localStorage.getItem("threadFilter");
        } else {
          let threadSortFilter = localStorage.getItem("threadSortFilter");
          if (
            threadSortFilter &&
            threadSortFilter != null &&
            threadSortFilter != "undefined" &&
            threadSortFilter != "null"
          ) {
            let sortOpt = JSON.parse(threadSortFilter);
            if (sortOpt) {
              if (sortOpt.code) {
                threadSortType = sortOpt.code;
              }
            }
          }
          let threadOrderFilter = localStorage.getItem("threadOrderFilter");

          if (
            threadOrderFilter &&
            threadOrderFilter != null &&
            threadOrderFilter != "undefined" &&
            threadOrderFilter != "null"
          ) {
            let orderOpt = JSON.parse(threadOrderFilter);
            if (orderOpt) {
              if (orderOpt.code) {
                threadOrderType = orderOpt.code;
              }
            }
          }

          console.log(localStorage.getItem("threadFilter"));
          if (filterData == true) {
            filterData = JSON.stringify(r);
          } else {
            if (this.pageDataInfo == pageInfo.searchPage) {
              filterData = localStorage.getItem("threadFilter");
            } else {
              filterData = JSON.stringify(r);
            }
          }

          console.log(filterData);
        }
        //console.log(setdata+'--'+this.pageDataInfo);        
          console.log(setdata.threadViewType);
          if(setdata.feedbackStatus)
          {
            this.feedbackStatus= setdata.feedbackStatus;   
          }
         
        if(setdata.threadViewType == 'list' ){
          this.thumbView = false;                 
        } 
        this.threadFilterOptions = setdata;
        if (this.pageDataInfo == this.pageInfo || this.pageDataInfo == pageInfo.searchPage) {
          if (actionload == "get") {
          }

          var data_prod_values = JSON.stringify(this.workstreamFilterArr);
          this.ItemArray = [];
          this.ItemArray.push({
            groups: data_prod_values,
            likespins: [],
            make_models: [],
            rankby: [],
            Fixstatus: [],
          });
          this.itemOffset = 0;
          this.optionFilter = JSON.stringify(this.ItemArray);
          if (setdata.sortOrderBy) {
          } else {
            localStorage.setItem("threadFilter", filterData);
          }

          if (this.pageDataInfo == pageInfo.searchPage) {
            filterData = localStorage.getItem("searchPageFilter");
          }

          console.log(this.pageDataInfo, filterData,setdata.filterrecords)

          if(this.CBADomian){
            let threadsPageSubType = JSON.parse(localStorage.getItem("threadsPageSubTypeData"));
            let fthreadFilter = JSON.parse(localStorage.getItem("threadFilter"));
            
            let workstreamArr = fthreadFilter.workstream;

            this.threadSubTypeDataArr = [];
            this.threadSubType = [];  
            let rmMidHeight = (this.thumbView) ? 90 : 70;
            let rmListHeight = (this.thumbView) ? 95 : 70;
            //this.midHeight = windowHeight.height - rmMidHeight;
            this.midHeight = 210;
            this.listHeight = windowHeight.height - rmListHeight;
            this.pTableHeight = parseInt(this.listHeight)-53+'px';

            this.threadSubTypeFlag = false;

            if(workstreamArr.length>0){
              for(let wsa of workstreamArr){                             
                for(let tsub of threadsPageSubType){                  
                  if(wsa == tsub.workstreamId){
                    console.log(wsa,tsub.workstreamId);
                    console.log(tsub.threadSubTypeData);
                    if(tsub.threadSubTypeData != ''){
                      this.getThreadSubTypeData(tsub.threadSubTypeData);
                    }                                        
                  }
                }
              }
            }
          }
          else{
            localStorage.removeItem("threadsPageSubTypeData");
          }

          let apiInfo = {
            apiKey: Constant.ApiKey,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId,
            escalationType: 1,
            limit: this.itemLimit,
            offset: this.itemOffset,
            type: threadSortType,
            orderBy: threadOrderType,
            optionFilter: this.optionFilter,
            filterOptions: filterData,
            feedbackStatus:this.feedbackStatus,  
            searchText: searchValue,
            filterrecords: setdata.filterrecords,         
          };
          this.threadListArray = [];
          this.threadListArrayNew = [];
          this.apiData = apiInfo;
          this.loadingthread = true;
          this.loadThreadsPage();
          setTimeout(() => {
            if (this.top != undefined) {
              this.top.nativeElement.scroll({
                top: 0,
                left: 0,
                behavior: "auto",
              }); 
              setTimeout(() => {
                if (this.listDiv != undefined  && !this.thumbView) {
                  /*let listWidth1 = this.listDiv.nativeElement.clientWidth;  
                  let listWidth2 = document.getElementsByClassName("mat-table")[0].clientWidth;
                  this.listWidth = listWidth1 > listWidth2 ? listWidth1 : listWidth1;
                  $(".mat-inner-container").css("width", this.listWidth);          
                  console.log(this.listWidth);*/
                }            
              }, 1000);
            }
          }, 1000);
          this.onInitload = true;
        }
      })
    );

    this.subscription.add(
      this.sharedSvc._OnLayoutChangeReceivedSubject.subscribe((r) => {
        setTimeout(() => {
          if (this.listDiv != undefined  && !this.thumbView) {
            let listWidth1 = this.listDiv.nativeElement.clientWidth;  
            let listWidth2 = document.getElementsByClassName("mat-table")[0].clientWidth;
            this.listWidth = listWidth1 > listWidth2 ? listWidth1 : listWidth1;
            $(".mat-inner-container").css("width", this.listWidth);          
            console.log(this.listWidth);           
          }            
        }, 1000);
        console.error("-----------547-----------");
        console.error("_OnLayoutChangeReceivedSubject");
        this.updateMasonryLayout = true;
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 1500);
      })
    );

    this.subscription.add(
      this.sharedSvc._OnWorkstreamMessageReceivedSubject.subscribe((r) => {
        console.log(JSON.stringify(r));        
        this.priorityIndexValue = "1";
        this.threadIdArrayInfo = [];
        this.itemLength = 0;
        console.error("_OnWorkstreamMessageReceivedSubject");
        console.error("-----------562-----------");
        var setdata = JSON.parse(JSON.stringify(r));
        console.log(setdata);
        if(this.CBADomian){  
          this.threadSubTypeDataArr = [];
          this.threadSubType = [];  
          //this.midHeight = windowHeight.height;   
          //this.midHeight = this.midHeight - 127;
          this.midHeight = 210;
          this.threadSubTypeFlag = false; 
          if(parseInt(setdata.contentType[0].contentTypeId) == 2){  
            console.log(setdata.contentType[0].threadSubTypeData);           
            if(setdata.contentType[0].threadSubTypeData != undefined){
              console.log(setdata.contentType[0].threadSubTypeData); 
              if(setdata.contentType[0].threadSubTypeData.length>0){                
                console.log(setdata.contentType[0].threadSubTypeData);                
                this.getThreadSubTypeData(setdata.contentType[0].threadSubTypeData);                
              }              
              console.log(this.threadSubTypeDataArr);
              console.log(this.threadSubType);
            }
          }          
        }
        let pageInfo = setdata.pageInfo;
        pageInfo = (pageInfo == null || pageInfo == undefined || pageInfo == 'undefined') ? this.pageInfo : pageInfo;
        console.log(r, setdata, this.pageDataInfo, pageInfo)
        setTimeout(() => {
          this.scrollTop = 0;
          let id = (this.thumbView) ? 'thread-data-container' : 'matrixTable';
          this.scrollToElem(id);
        }, 1000);
        //if (this.pageDataInfo != pageInfo) {
          this.loadingthread = true;
          if (setdata.id) {
            // $('.masonry-item').html('');
			      if(this.thumbView){
              this.masonry.reloadItems();
              this.masonry.layout();
            }
            this.workstreamFilterArr = [];
            this.workstreamFilterArr.push(setdata.id);
          }
          if (this.workstreamFilterArr) {
            var data_prod_values = JSON.stringify(this.workstreamFilterArr);
            this.ItemArray = [];
            this.ItemArray.push({
              groups: data_prod_values,
              likespins: [],
              make_models: [],
              rankby: [],
              Fixstatus: [],
            });
            this.itemOffset = 0;
            this.optionFilter = JSON.stringify(this.ItemArray);
            let apiInfo = {
              apiKey: Constant.ApiKey,
              userId: this.userId,
              domainId: this.domainId,
              countryId: this.countryId,
              escalationType: 1,
              limit: this.itemLimit,
              offset: this.itemOffset,
              type: this.threadSortType,
              optionFilter: this.optionFilter,
              orderBy: this.threadOrderByType,
              feedbackStatus:this.feedbackStatus,  
              filterrecords: setdata.filterrecords
            };

            this.apiData = apiInfo;

            if (setdata.newthreadpush == true) {
              this.loadThreadsPage(true);
             // this.dbrecordchange(true);
            } else {
              this.threadListArray = [];
              this.threadListArrayNew = [];
              this.loadingthread = true;
              this.threadsAPIcall.unsubscribe();
              this.loadThreadsPage();
              //this.dbrecordchange('');
              
             // this.fromfirebaseData=0;
             // this.loadThreadsPage();
              setTimeout(() => {
                /* if (this.top != undefined) {
                  this.top.nativeElement.scroll({
                    top: 0,
                    left: 0,
                    behavior: "auto",
                  });
                } */
              }, 100);
            }
          }
        /* } else {
          return false;
        } */
      })
    );

    this.subscription.add(
      (this.sharedSvc.searchInfoDataReceivedSubject.subscribe(
        (r) => {           
          if(this.apiUrl.searchPageRedirectFlag == "1"){             
            this.apiUrl.searchPageRedirectFlag = "2";      
            let navPage = r['navPage'];               
            let scrollTop:any = this.scrollTop;
            let tArray = JSON.stringify(this.threadListArray);  
            this.sharedSvc.setSearchPageLocalStorageNew(navPage, scrollTop, this.itemOffset, tArray);
          }
        })
      )
    );

    this.getnorows();    
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;

   // this.firebaseAuthcreds=this.authenticationService.fbDataValue;
    console.log(this.firebaseAuthcreds);
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    if (this.teamSystem && this.pageDataInfo == this.pageInfo) {
      this.getlandingpagewidgets();
      this.getHeadMenuLists();
    }

    let defaultWorkstream = localStorage.getItem("defaultWorkstream");
    let rmMidHeight, rmListHeight;
    if (this.teamSystem) {
      rmMidHeight = 20;
      rmListHeight = 25;
      //this.midHeight = windowHeight.height - rmMidHeight;
      this.midHeight = 210;
		  this.listHeight = windowHeight.height - rmListHeight;
        if(this.msTeamAccessMobile){
          rmMidHeight = 10;
          rmListHeight = 15;
          //this.midHeight = windowHeight.height + rmMidHeight;
          this.midHeight = 210;
          this.listHeight = windowHeight.height + rmListHeight;
        }
    } else {
      if (this.pageDataInfo == this.pageInfo) {
        rmMidHeight = (this.thumbView) ? 90 : 70;
        rmListHeight = (this.thumbView) ? 95 : 70;
        //this.midHeight = windowHeight.height - rmMidHeight;
        this.midHeight = 210;
		    this.listHeight = windowHeight.height - rmListHeight;
        this.pTableHeight = parseInt(this.listHeight)-53+'px';
      } else if (this.pageDataInfo == pageInfo.searchPage) {
        let headerHeight = document.getElementsByClassName('head-brand')[0].clientHeight;         
        if(headerHeight>0){
          headerHeight = headerHeight; 
          rmMidHeight = 120 + headerHeight;
        }    
        else{
          rmMidHeight = 127;
        }        
        rmListHeight = 110;
        //this.midHeight = windowHeight.height - rmMidHeight;
        this.midHeight = 210;
		    this.listHeight = windowHeight.height - rmListHeight;
      } else {        
        rmMidHeight = 127;
        rmListHeight = 105;
        //this.midHeight = windowHeight.height - rmMidHeight;
        this.midHeight = 210;
		    this.listHeight = windowHeight.height - rmListHeight;        
      }
    }
    let landingpageworkstream = localStorage.getItem("landing-page-workstream");
    if (this.tapfromheader && this.tapfromheader != undefined) {
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(this.tapfromheader.id);
    } else if (landingpageworkstream) {
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(landingpageworkstream);
    } else if (defaultWorkstream) {
      this.workstreamFilterArr = [];
      this.workstreamFilterArr.push(defaultWorkstream);
    }
    if (this.workstreamFilterArr) {
      var data_prod_values = JSON.stringify(this.workstreamFilterArr);
      this.ItemArray = [];
      this.ItemArray.push({
        groups: data_prod_values,
        likespins: [],
        make_models: [],
        rankby: [],
        Fixstatus: [],
      });
    }

    this.optionFilter = JSON.stringify(this.ItemArray);
    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      escalationType: 1,
      limit: this.itemLimit,
      offset: this.itemOffset,
      type: this.threadSortType,
      optionFilter: this.optionFilter,
      orderBy: this.threadOrderByType,
    };
    this.apiData = apiInfo;

    if (this.pageDataInfo == pageInfo.workstreamPage || this.fromOthersTab) {
      this.loadingthread = true;
      this.loadedthreadAPI = true;
      if(this.CBADomian){
        var data = localStorage.getItem('threadSubTypeData');        
        data = data != null ? data : '';
        this.threadSubTypeDataArr = [];
        this.threadSubType = [];  
        //this.midHeight = windowHeight.height;   
        //this.midHeight = this.midHeight - 127;
        this.midHeight = 210;
        this.threadSubTypeFlag = false;
        if(data != ''){
          this.getThreadSubTypeData(JSON.parse(data));
        }        
        setTimeout(() => {
          this.loadThreadsPage();
        }, 1000);
      }
      else{
        this.loadThreadsPage();
      }      
    }

    this.proposedFixTxt = threadBulbStatusText.proposedFix;
    this.threadwithFixTxt = threadBulbStatusText.threadwithFix;
    this.shareFixTxt = threadBulbStatusText.shareFix;
    this.shareSummitFixTxt = threadBulbStatusText.summitFix;
    this.threadwithHelpfulFixTxt = threadBulbStatusText.threadwithHelpfulFix;
    this.threadwithNotFixTxt = threadBulbStatusText.threadwithNotFix;
    this.threadCloseTxtTxt = threadBulbStatusText.threadCloseTxt;
  }

  ChatUCode(t) {
    var S = "";
    for (var a = 0; a < t.length; a++) {
      if (t.charCodeAt(a) > 255) {
        S +=
          "\\u" +
          ("0000" + t.charCodeAt(a).toString(16)).substr(-4, 4).toUpperCase();
      } else {
        S += t.charAt(a);
      }
    }
    console.log(S);
    return S;
  }

  convertunicode(val) {
    val = val.replace(/\\n/g, "");
    if (val == undefined || val == null) {
      return val;
    }
    //val = "hirisjh \uD83D\uDE06 dfg dfg dd df g";
    if (val.indexOf("\\uD") != -1 || val.indexOf("\\u") != -1) {
      JSON.stringify(val);
      //console.log(JSON.parse('"\\uD83D\\uDE05\\uD83D\\uDE04"'));

      //console.log(JSON.parse("'" +"\\uD83D\\uDE05\\uD83D\\uDE04"+"'"));
      return JSON.parse('"' + val.replace(/\"/g, '\\"' + '"') + '"');
    } else {
      return val;
    }
  }

  getHeadMenuLists() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);

    this.getMenuListingApi.getMenuLists(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let menuListloaded = response.sideMenu;

        for (let menu of menuListloaded) {
          let urlpathreplace = menu.urlPath;

          let urlActivePathreplace = menu.urlActivePath;
          let submenuimageClass = menu.submenuimageClass;
          let urlpth = "";
          let urlActivePath = "";

          urlpth = urlpathreplace.replace(".png", ".svg");
          urlActivePath = urlActivePathreplace.replace(".png", ".svg");

          this.menuListloaded.push({
            id: menu.id,
            disableContentType: menu.disableContentType,
            slug: menu.slug,
            contentTypeId: menu.contentTypeId,
            name: menu.name,
            urlPath: urlpth,
            urlActivePath: urlActivePath,
            submenuimageClass: submenuimageClass,
          });
        }

        localStorage.setItem(
          "sideMenuValues",
          JSON.stringify(this.menuListloaded)
        );
        // console.log(this.menuListloaded);
      }
    });
  }

  getlandingpagewidgets() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);

    this.LandingpagewidgetsAPI.GetLandingpageOptions(apiFormData).subscribe(
      (response) => {
        let rstatus = response.status;
        let rtotal = response.total;
        if (rstatus == "Success") {
          if (rtotal > 0) {
            let rlandingPage = {
              componentName: "RecentSearchesWidgetsComponent",
              id: "4",
              imageClass: "recentsearch-land-icon",
              name: "Search History",
              placeholder: "Search History",
              shortName: "search-widget",
            };
            const rcomponentName = rlandingPage.componentName;
            const rplaceholder = rlandingPage.placeholder;
            const rwid = rlandingPage.id;

            localStorage.setItem(
              "landingpage_attr" + rwid + "",
              JSON.stringify(rlandingPage)
            );

            this.loadingelanding = false;
          } else {
            this.loadingelanding = false;
          }
        } else {
          this.loadingelanding = false;
        }
      }
    );
  }

  getnorows() {
    let x = 200;
    let xy = 248;
    var elmnt = document.getElementById("thread-data-container");
    let itemLimitwidth = elmnt.offsetWidth / xy;
    //let itemLimitwidth = window.innerWidth / xy;
    let totalrows = Math.trunc(itemLimitwidth);
    let itemLimit1 = window.innerHeight / x;
    let totalCols = Math.trunc(itemLimit1);

    this.itemwidthLimit = totalrows * totalCols;
    console.log(this.itemwidthLimit + "-itemWidth");
    if (totalrows > 3) {
      var newrows = 2;
      this.itemLimit = newrows * totalCols;
      if (this.itemLimit <= 9) {
        this.itemLimit = 10;
      }
    } else {
      this.itemLimit = totalrows * totalCols;
      if (this.itemLimit <= 9) {
        this.itemLimit = 10;
      }
    }
  }
  onDrop(ev) {}
  @HostListener("scroll", ["$event"])
  onScroll(event) {
    this.scroll(event);  
  }

  
  dbrecordchange(push)
  {
   
    if(!this.firebaseAuthcreds)
    { 
      this.afAuth.signInWithEmailAndPassword(firebaseCredentials.emailAddress, firebaseCredentials.password).then((userValue) => {
        this.firebaseAuthcreds= userValue.user.uid;
        console.log(this.firebaseAuthcreds);
       
        this.loadThreadsPageFire('');
   
       });
    }
    else
    {
      this.loadThreadsPageFire('');
    }
    
  }



  loadThreadsPageFire(wid) {
    this.displayNoRecords = false;
    this.displayNoRecordsDefault = false;
    this.loadingthreadmore = true;
    this.loadingthread = true;
    this.centerloading = true;
    let push=false;
if(wid=='')
   {
    wid=localStorage.getItem('firstWorkstream');
   }
    /*
    this.afAuth.signInWithEmailAndPassword(firebaseCredentials.emailAddress, firebaseCredentials.password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log(user);
*/
if(this.firebaseAuthcreds){
  console.log(this.firebaseAuthcreds);
      if(wid)
      {
        this.notes_Firebase_Data = this.dbF.list('contentTypes/threads',ref=>ref.orderByChild('w_'+wid+'').startAt(''+wid+'-'+this.domainId+'').limitToLast(100));
        this.notes_angular=this.notes_Firebase_Data.valueChanges();
      }

      console.log(this.notes_angular);
      
       this.notes_angular.subscribe(response=> {
         
       
           let threadInfoData = response;
           this.itemOffset=threadInfoData.length;
           this.fromfirebaseData=1;
           if (threadInfoData.length > 0) {

            threadInfoData.sort((a, b) => new Date(b.createdOnNew).getTime() - new Date(a.createdOnNew).getTime());
             this.loadingthread = false;
             this.displayNoRecords = false;
             let loadItems = false;
             for (var t = 0; t < threadInfoData.length; t++) {
     
               let threadUserId = threadInfoData[t].userId;         
               let threadAcces = (this.userId == threadUserId || this.userId == '3') ? true : false;
               threadInfoData[t].threadAcces = threadAcces;
               let threadId = threadInfoData[t].threadId;
               // let threadTitle = this.ChatUCode(threadInfoData[t].threadTitle);
               let threadTitle = this.authenticationService.convertunicode(
                 this.authenticationService.ChatUCode(threadInfoData[t].threadTitle)
               );
               let threadStatus = threadInfoData[t].threadStatus;
               let threadStatusBgColor = threadInfoData[t].threadStatusBgColor;
               let threadStatusColorValue = threadInfoData[t].threadStatusColorValue;
               //let profileImage = threadInfoData[t].profileImage;
               //let userName = threadInfoData[t].userName;
               let availability = threadInfoData[t].availability;
               let badgeStatus = threadInfoData[t].badgeStatus;
               //let postedFrom = threadInfoData[t].postedFrom;
               let summitFix = threadInfoData[t].summitFix;
               let scorePoint = threadInfoData[t].scorePoint;
               let profileImage = "";
               let userName = "";
               let postedFrom = "";
               if (summitFix == "1") {
                 let techinfo = threadInfoData[t].technicianInfo[0];
                 profileImage = techinfo.profileImg;
                 userName = techinfo.name;
                 let dealerInfo = threadInfoData[t].dealerInfo[0];
                 postedFrom =
                   dealerInfo.dealerName != ""
                     ? dealerInfo.dealerName
                     : threadInfoData[t].postedFrom;
               } else {
                 profileImage = threadInfoData[t].profileImage;
                 userName = threadInfoData[t].userName;
                 postedFrom = threadInfoData[t].postedFrom;
               }
               //let make = threadInfoData[t].make;
               let make = threadInfoData[t].genericProductName;
               let model = threadInfoData[t].model;
               let year = threadInfoData[t].year;
               let currentDtc = threadInfoData[t].currentDtc;
               let viewCount = threadInfoData[t].viewCount;
               let likeCount = threadInfoData[t].likeCount;
               let pinCount = threadInfoData[t].pinCount;
               let replyCount = threadInfoData[t].comment;
               let closeStatus = threadInfoData[t].closeStatus;
               let newThreadTypeSelect = threadInfoData[t].newThreadTypeSelect;
               let uploadContents = threadInfoData[t].uploadContents;
               let moreAttachments = false;
               if(uploadContents)
               { 
                 if (uploadContents.length > 1) {
                   moreAttachments = true;
                 }
               }
              
               let shareFix = false;
               if (newThreadTypeSelect == "share") {
                 shareFix = true;
               } else {
                 shareFix = false;
               }
               let fixStatus = threadInfoData[t].fixStatus;
               let fixPostStatus = threadInfoData[t].fixPostStatus;
               let postId = threadInfoData[t].postId;
               let pinStatus = threadInfoData[t].pinStatus;
               let likeStatus = threadInfoData[t].likeStatus;
     
               let curentDtclength = 0;
               if (currentDtc) {
                 curentDtclength = currentDtc.length;
               }
               threadInfoData[t].curentDtclength = curentDtclength
               let createdOnNew = threadInfoData[t].createdOnNew;
     
               let createdOnDate = moment.utc(createdOnNew).toDate();
               let localcreatedOnDate = moment(createdOnDate)
                 .local()
                 .format("MMM DD, YYYY . h:mm A");
               let dateTime = localcreatedOnDate.split(" . ");
               console.log(dateTime);
     
               threadInfoData[t].date = dateTime[0];
               threadInfoData[t].time = dateTime[1];
     
               if (push == true) {
                 this.threadListArray.unshift({
                   threadId: threadId,
                   threadTitle: threadTitle,
                   threadStatus: threadStatus,
                   threadStatusBgColor: threadStatusBgColor,
                   threadStatusColorValue: threadStatusColorValue,
                   profileImage: profileImage,
                   availability: availability,
                   badgeStatus: badgeStatus,
                   postedFrom: postedFrom,
                   userName: userName,
                   createdOn: localcreatedOnDate,
                   date: dateTime[0],
                   time: dateTime[1],
                   make: make,
                   model: model,
                   year: year,
                   threadAcces: threadAcces,
                   currentDtc: currentDtc,
                   curentDtclength: curentDtclength,
                   viewCount: viewCount,
                   likeCount: likeCount,
                   pinCount: pinCount,
                   replyCount: replyCount,
                   closeStatus: closeStatus,
                   newThreadTypeSelect: newThreadTypeSelect,
                   summitFix: summitFix,
                   scorePoint: scorePoint,
                   fixStatus: fixStatus,
                   fixPostStatus: fixPostStatus,
                   postId: postId,
                   likeStatus: likeStatus,
                   shareFix: shareFix,
                   pinStatus: pinStatus,
                   uploadContents: uploadContents,
                   moreAttachments: moreAttachments,
                   newNotificationState: "newthreadnotify",
     
                   state: "active",
                 });
               } else {
                 this.threadListArray.push({
                   threadId: threadId,
                   threadTitle: threadTitle,
                   threadStatus: threadStatus,
                   threadStatusBgColor: threadStatusBgColor,
                   threadStatusColorValue: threadStatusColorValue,
                   profileImage: profileImage,
                   availability: availability,
                   badgeStatus: badgeStatus,
                   postedFrom: postedFrom,
                   userName: userName,
                   createdOn: localcreatedOnDate,
                   date: dateTime[0],
                   time: dateTime[1],
                   make: make,
                   model: model,
                   year: year,
                   threadAcces: threadAcces,
                   currentDtc: currentDtc,
                   curentDtclength: curentDtclength,
                   viewCount: viewCount,
                   likeCount: likeCount,
                   pinCount: pinCount,
                   replyCount: replyCount,
                   closeStatus: closeStatus,
                   newThreadTypeSelect: newThreadTypeSelect,
                   summitFix: summitFix,
                   scorePoint: scorePoint,
                   fixStatus: fixStatus,
                   fixPostStatus: fixPostStatus,
                   postId: postId,
                   likeStatus: likeStatus,
                   shareFix: shareFix,
                   pinStatus: pinStatus,
                   uploadContents: uploadContents,
                   moreAttachments: moreAttachments,
                   newNotificationState: "",
                   state: "active",
                 });
              }
     
              this.threadListArrayNew.push();            
              if ((t) + 1 + "==" + threadInfoData.length) {
                loadItems = true;
              }
            }
            if(this.thumbView){
              setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                // this.loadingthread = false;
                this.loadingthreadmore = false;
                this.updateMasonryLayout = true;
              }, 2000);
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 2200);
            }
            else{
              this.loadingthreadmore = false;
            }

             this.loadingthread = false;
             this.centerloading = false;
           }
           else {
            this.displayNoRecords = true;
            this.displayNoRecordsDefault = true;
            this.displayNoRecordsShow = 1;
            this.loadingthread = false;
            this.centerloading = false;
            this.loadingthreadmore = false;
            this.updateMasonryLayout = true;
          if(this.thumbView){
            setTimeout(() => {
              this.masonry.reloadItems();
              this.masonry.layout();
              // this.loadingthread = false;
              this.loadingthreadmore = false;
              this.updateMasonryLayout = true;
            }, 2000);
            setTimeout(() => {
              this.updateMasonryLayout = false;
            }, 2200);
          }
          else{
            this.loadingthreadmore = false;
          }
        }
           //this.itemOffset += this.itemLimit;
           
           this.scrollCallback = true;
           this.scrollInit = 1;
           this.itemLength += threadInfoData.length;
         })
        }
  //  }) 
  }
  loadThreadsPage(push = false, limit:any = '') {

    //alert(this.itemOffset+'--start');
    console.log(push, this.apiData)
    let searchValue = localStorage.getItem("searchValue");
    console.log(this.apiData["filterrecords"]);    
    //this.apiData['searchText'] = '';
    if (
      searchValue &&
      (searchValue != undefined ||
        searchValue != "undefined" ||
        searchValue != null)
    ) {
      searchValue = localStorage.getItem("searchValue");
    } else {
      searchValue = "";
    }
    //this.apiData['limit'] = this.itemLimit;
    console.log(this.apiData["filterrecords"]);    
    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    if (push == true) {
      let itemLimit:any = (limit == '') ? 1 : limit;
      apiFormData.append("limit", itemLimit);
      this.apiData["offset"] = 0;
    } else {
      apiFormData.append("limit", this.apiData["limit"]);

      this.apiData["offset"] = this.itemOffset;
    }
    if(this.CBADomian){      
      if (this.threadSubType && this.threadSubType.length > 0) {
        apiFormData.append(
          "threadSubType",
          JSON.stringify(this.threadSubType)
        );
        this.apiData["offset"] = 0;
      }
    }
    apiFormData.append("offset", this.apiData["offset"]);
    apiFormData.append("type", this.apiData["type"]);
    apiFormData.append("orderBy", this.apiData["orderBy"]);
    apiFormData.append("feedbackStatus", this.apiData["feedbackStatus"]);
    if (searchValue && this.pageDataInfo == pageInfo.searchPage) {
     
      apiFormData.append("searchText", searchValue);
      if (this.threadIdArrayInfo && this.threadIdArrayInfo.length > 0) {
        apiFormData.append(
          "threadIdArray",
          JSON.stringify(this.threadIdArrayInfo)
        );
      }
      if (this.priorityIndexValue) {
        apiFormData.append("priorityIndex", this.priorityIndexValue);
      } else {
        apiFormData.append("priorityIndex", "1");
      }
    }

    apiFormData.append("platform", "3");
    console.log(this.pageDataInfo)

    if (this.pageDataInfo == pageInfo.workstreamPage) {
      apiFormData.append("optionFilter", this.apiData["optionFilter"]);
    }
    
    let pushType = '';
    if (push == true && this.pageDataInfo != pageInfo.workstreamPage) {
      apiFormData.append("filterOptions", localStorage.getItem("threadFilter"));
    } else if (this.apiData["filterOptions"]) {
      let apiFilterOptions = JSON.parse(this.apiData["filterOptions"]);
      console.timeLog(apiFilterOptions, apiFilterOptions.loadAction)
      let loadAction = apiFilterOptions.loadAction;
      pushType = (loadAction != undefined || loadAction != "undefined" || loadAction != null) ? loadAction : pushType;
      console.log(loadAction, pushType)
      apiFormData.append("filterOptions", this.apiData["filterOptions"]);
    } else {
      if (localStorage.getItem("searchPageFilter") && this.fromSearchPage) {
        apiFormData.append(
          "filterOptions",
          localStorage.getItem("searchPageFilter")
        );
      } else if(this.pageDataInfo != pageInfo.workstreamPage) {
        apiFormData.append("filterOptions", localStorage.getItem("threadFilter"));
      }
    }

    this.threadsAPIcall = this.LandingpagewidgetsAPI.threadspageAPI(
      apiFormData
    ).subscribe((response) => {

      if(this.fromfirebaseData)
      {
        return false;
      }
     
      let rstatus = response.status;
      let rtdata = response.data;
      let threadInfototal = rtdata.total;
      let rresult = response.result;
      let newThreadInfoText = response.newInfoText;
      this.newThreadInfo = newThreadInfoText != undefined ? newThreadInfoText : this.newThreadInfo;
      this.redirectionPage = RedirectionPage.Threads;
      this.pageTitleText = (this.industryType.id == 3 && this.domainId == 97) ? `${ManageTitle.feedback}s` : PageTitleText.Threads;
      this.contentTypeValue = ContentTypeValues.Threads;
      this.contentTypeDefaultNewImg = DefaultNewImages.Threads;
      this.contentTypeDefaultNewText = (this.industryType.id == 3 && this.domainId == 97) ? `${ManageTitle.actionNew} ${ManageTitle.feedback}` : DefaultNewCreationText.Threads;

      

      /* if (threadInfototal == 0 && this.threadIdArrayInfo.length==0 && response.priorityIndexValue==4) {
        this.loadingthread = false;
        this.nothingtoshow = true;
      }
      */
      let threadInfoData = rtdata.thread;
      this.itemTotal = threadInfototal;
      if (
        threadInfototal == 0 &&
        this.apiData["offset"] == 0 &&
        response.priorityIndexValue == 4
      ) {
        this.loadingthread = false;
      }
      if (
        threadInfototal == 0 &&
        
        this.apiData["offset"] == 0 &&
        this.pageDataInfo != pageInfo.searchPage
      ) {
        response.priorityIndexValue = 4;
      }

      if (
        threadInfototal == 0 &&
        this.apiData["offset"] == 0 &&
        this.threadIdArrayInfo.length == 0 &&
        response.priorityIndexValue == 4
      ) {
        if (searchValue) {
          this.displayNoRecords = true;
          this.displayNoRecordsDefault = false;
          this.displayNoRecordsShow = 1;
          this.loadingthread = false;
          this.centerloading = false;
          this.loadingthreadmore = false;
          this.updateMasonryLayout = true;
        } else {
          let teamSystem = localStorage.getItem("teamSystem");
          if (teamSystem) {
            if (this.apiData["type"] != "sortthread") {
              this.displayNoRecords = true;
              this.displayNoRecordsDefault = false;
              this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;              
              this.loadingthread = false;
              this.centerloading = false;
              this.loadingthreadmore = false;
              this.updateMasonryLayout = true;
            } else {
              this.displayNoRecords = false;                       
              this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;                            
              this.contentTypeDefaultNewTextDisabled = true;
            }

            this.displayNoRecordsDefault = true;
          } else {
            this.displayNoRecords = true;
            this.displayNoRecordsDefault = true;
            this.displayNoRecordsShow = (this.apiData["filterrecords"]) ? 1 : 2;            
            this.loadingthread = false;
            this.centerloading = false;
            this.loadingthreadmore = false;
            this.updateMasonryLayout = true;
          }
        }
      } else {
        this.displayNoRecords = false;
        this.displayNoRecordsDefault = false;
        this.displayNoRecordsShow = 0;
        // update 04-04-22
        if (response.priorityIndexValue == "4" && response.priorityIndexValue) {
          this.itemOffset += this.itemLimit;
        }
        // update 04-04-22
      }
      
      if (this.pageDataInfo == pageInfo.searchPage) {
        
        let priorityIndexValue = response.priorityIndexValue;
        let threadIdArrayInfo = response.threadIdArrayInfo;
        if (threadIdArrayInfo) {
          for (var t1 = 0; t1 < threadIdArrayInfo.length; t1++) {
            this.threadIdArrayInfo.push(threadIdArrayInfo[t1]);
          }
        }
        
        let limitoffset = this.itemOffset + this.itemLimit;
        if (priorityIndexValue < "4" && priorityIndexValue) {
          
          this.itemOffset += this.itemLimit;

          if (threadInfototal == 0 || limitoffset >= threadInfototal) {
            priorityIndexValue = parseInt(priorityIndexValue) + 1;
            this.setTWidthDuplicateFlag = false;
            this.priorityIndexValue = priorityIndexValue.toString();
            this.itemOffset = 0;
           //alert(priorityIndexValue);          
            this.loadThreadsPage();
            this.loadingthread = true;
          this.scrollCallback = false;
          }
          else
          {
          //this.scrollCallback = true;
          }
        }
      }
      else
      {
        this.scrollCallback = true;
        this.itemOffset += this.itemLimit; 
      }
    
      if (threadInfoData.length > 0) {
        this.loadingthread = false;
        this.displayNoRecords = false;
        let loadItems = false;
        let action = 'init';
        let initIndex = -1;
        for (var t = 0; t < threadInfoData.length; t++) {
          this.setupThreadData(action, push, threadInfoData[t], initIndex, t, pushType);
          this.threadListArrayNew.push(threadInfoData[t]);            
          if ((t) + 1 + "==" + threadInfoData.length) {
            loadItems = true;
          }
        }

        if(this.thumbView){
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.loadingthread = false;
            this.loadingthreadmore = false;
            this.updateMasonryLayout = true;
          }, 2000);
        }
      else{
          this.loadingthreadmore = false;
        }
      } else {
        if(this.thumbView){
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            // this.loadingthread = false;
           // this.loadingthreadmore = false;
            this.updateMasonryLayout = true;
          }, 2000);
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 2200);
        }
        else{
          this.loadingthreadmore = false;         
        }
        if(this.priorityIndexValue>='4')
        {
          this.nothingtoshow = true;
        }
        
      }
      if (
        this.itemOffset < this.itemwidthLimit &&
        threadInfoData.length > 0 &&
        threadInfoData.length > 9
      ) {
        this.scrollCallback = false;
        setTimeout(() => {
          
          if(!this.setTWidthDuplicateFlag && this.pageDataInfo == pageInfo.searchPage){
            //this.itemOffset = 10;
         
            this.setTWidthDuplicateFlag =  true;
          }
         
          this.loadingthreadmore = true;
          this.loadThreadsPage();        
        
                   
          this.centerloading = true;
        }, 1000);
      } else {
        this.scrollCallback = true;
        this.centerloading = false;
      }
 
      


      

    
      
      
      this.scrollInit = 1;
      this.itemLength += threadInfoData.length;
      let currUrl = this.router.url.split('/');
      let navFrom = currUrl[1];
      let wsResData = {
        access: 'threads'
      }
      if(navFrom != 'threads') {
        this.sharedSvc.emitWorkstreamListData(wsResData);
      }
      console.log(threadInfoData);
      console.log(this.apiData["filterrecords"]);
    });
  }

  expandAction(status) {
    if (status) {
      this.updateMasonryLayout = true;
    }
  }
  threadClick(thread, event, action='same') {    
    $(".bg-image-new-thread" + thread.threadId + "").removeClass(
      "newthreadnotify"
    );

    if (this.domainId == 1 || this.domainId == 60 || this.userId == 100) {
      var aurl = forumPageAccess.threadpageNew + thread.threadId;
    } else {
      //var aurl = forumPageAccess.threadpage + thread.threadId;
      var aurl = forumPageAccess.threadpageNew + thread.threadId;
    }

    let item = `${thread.threadId}-new-tab`;
    let checkNewTab = localStorage.getItem(item);
    if(action == 'new' || (event.ctrlKey) || ((checkNewTab != null || checkNewTab != undefined || checkNewTab != undefined) && item == checkNewTab)) {
      localStorage.setItem(item, item);
      window.open(aurl, aurl);
    } else {
      let navFrom = this.sharedSvc.splitCurrUrl(this.router.url);
      let wsFlag: any = (navFrom == ' threads') ? false : true;
      let scrollTop:any = this.scrollTop;
      this.sharedSvc.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
      this.router.navigate([aurl]);
    }
  }

  navThread(action, id) {
    let url;
    switch (action) {
      case "edit":     
        url = "threads/manage/edit/"+id;        
        break;
      default:        
        break;
    }
    setTimeout(() => {
      let teamSystem = localStorage.getItem("teamSystem");
      this.router.navigate([url]);
    }, 50);
  }

  // Scroll to element
  scrollToElem(id, threadId = 0) {
    let secElement = document.getElementById(id);
    console.log(id, secElement.offsetTop, this.thumbView, this.scrollTop)
    if(this.thumbView) {
      secElement.scrollTop = this.scrollTop;
    } else {
      this.table.scrollTo({'top': this.scrollTop});
    }
    
    if(threadId == 0) {
      this.opacityFlag = false;      
    }
  }

  setupThreadData(action, push, threadInfoData, index = 0, findex = -1, pushType = '') {
    //console.log(push, pushType, index, findex, threadInfoData)
    let newPushClass = (push || (pushType != '' && findex == 0)) ? 'newthreadnotify' : '';
    let threadUserId = threadInfoData.userId;         
    let threadAcces = (this.userId == threadUserId || this.userId == '3') ? true : false;
    threadInfoData.threadAcces = threadAcces;
    let threadId = threadInfoData.threadId;
    // let threadTitle = this.ChatUCode(threadInfoData.threadTitle);
    let threadTitle = this.authenticationService.convertunicode(
      this.authenticationService.ChatUCode(threadInfoData.threadTitle)
    );
    let threadStatus = threadInfoData.threadStatus;
    let badgeTopUser=0;
    if(threadInfoData.badgeTopUser)
    {
      badgeTopUser = threadInfoData.badgeTopUser;
    }
    console.log(badgeTopUser);
    
    let threadStatusBgColor = threadInfoData.threadStatusBgColor;
    let threadStatusColorValue = threadInfoData.threadStatusColorValue;
    //let profileImage = threadInfoData.profileImage;
    //let userName = threadInfoData.userName;
    let availability = threadInfoData.availability;
    let badgeStatus = threadInfoData.badgeStatus;
    //let postedFrom = threadInfoData.postedFrom;
    let summitFix = threadInfoData.summitFix;
    let scorePoint = threadInfoData.scorePoint;
    let escalateStatus=threadInfoData.escalateStatusLand;
    let escColorCodes=threadInfoData.escColorCodes;
    let escColorCodesValue=threadInfoData.escColorCodesValue;
    
    let profileImage = "";
    let userName = "";
    let postedFrom = "";
    if (summitFix == "1") {
      let techinfo = threadInfoData.technicianInfo[0];
      profileImage = techinfo.profileImg;
      userName = techinfo.name;
      let dealerInfo = threadInfoData.dealerInfo[0];
      postedFrom =
        dealerInfo.dealerName != ""
          ? dealerInfo.dealerName
          : threadInfoData.postedFrom;
    } else {
      profileImage = threadInfoData.profileImage;
      userName = threadInfoData.userName;
      postedFrom = threadInfoData.postedFrom;
    }
    //let make = threadInfoData.make;
    let make = threadInfoData.genericProductName;
    let model = threadInfoData.model;
    let year = threadInfoData.year;
    let currentDtc = threadInfoData.currentDtc;
    let viewCount = threadInfoData.viewCount;
    let likeCount = threadInfoData.likeCount;
    let pinCount = threadInfoData.pinCount;
    let replyCount = threadInfoData.comment;
    let closeStatus = threadInfoData.closeStatus;
    let newThreadTypeSelect = threadInfoData.newThreadTypeSelect;
    let uploadContents = threadInfoData.uploadContents;
    let moreAttachments = false;
    if (uploadContents.length > 1) {
      moreAttachments = true;
    }
    let shareFix = false;
    if (newThreadTypeSelect == "share") {
      shareFix = true;
    } else {
      shareFix = false;
    }
    let fixStatus = threadInfoData.fixStatus;
    let fixPostStatus = threadInfoData.fixPostStatus;
    let postId = threadInfoData.postId;
    let pinStatus = threadInfoData.pinStatus;
    let likeStatus = threadInfoData.likeStatus;

    let curentDtclength = 0;
    if (currentDtc.length > 0) {
      curentDtclength = currentDtc.length;
    }
    threadInfoData.curentDtclength = curentDtclength
    let createdOnNew = threadInfoData.createdOnNew;

    let createdOnDate = moment.utc(createdOnNew).toDate();
    let localcreatedOnDate = moment(createdOnDate)
      .local()
      .format("MMM DD, YYYY . h:mm A");
    let dateTime = localcreatedOnDate.split(" . ");
    //console.log(dateTime, index);

    threadInfoData.date = dateTime[0];
    threadInfoData.time = dateTime[1];
    if(index >= 0) {
      let threadInfo = [];
      /* threadInfo.push({
        threadId: threadId,
        threadTitle: threadTitle,
        threadStatus: threadStatus,
        threadStatusBgColor: threadStatusBgColor,
        threadStatusColorValue: threadStatusColorValue,
        profileImage: profileImage,
        availability: availability,
        badgeStatus: badgeStatus,
        postedFrom: postedFrom,
        userName: userName,
        createdOn: localcreatedOnDate,
        date: dateTime[0],
        time: dateTime[1],
        make: make,
        model: model,
        year: year,
        threadAcces: threadAcces,
        currentDtc: currentDtc,
        curentDtclength: curentDtclength,
        viewCount: viewCount,
        likeCount: likeCount,
        pinCount: pinCount,
        replyCount: replyCount,
        closeStatus: closeStatus,
        newThreadTypeSelect: newThreadTypeSelect,
        summitFix: summitFix,
        scorePoint: scorePoint,
        fixStatus: fixStatus,
        fixPostStatus: fixPostStatus,
        postId: postId,
        likeStatus: likeStatus,
        shareFix: shareFix,
        pinStatus: pinStatus,
        uploadContents: uploadContents,
        moreAttachments: moreAttachments,
        newNotificationState: "",
        state: "active",
      }); */
      //this.threadListArray[index] = threadInfo[0];
      this.threadListArray[index].threadId = threadId;
      this.threadListArray[index].threadTitle = threadTitle;
      this.threadListArray[index].threadStatus = threadStatus;
      this.threadListArray[index].badgeTopUser = badgeTopUser;
      this.threadListArray[index].threadStatusBgColor = threadStatusBgColor;
      this.threadListArray[index].threadStatusColorValue = threadStatusColorValue;
      this.threadListArray[index].profileImage = profileImage;
      this.threadListArray[index].availability = availability;
      this.threadListArray[index].badgeStatus = badgeStatus;
      this.threadListArray[index].postedFrom = postedFrom;
      this.threadListArray[index].userName = userName;
      this.threadListArray[index].createdOn =localcreatedOnDate;
      this.threadListArray[index].date =dateTime[0];
      this.threadListArray[index].time =dateTime[1];
      this.threadListArray[index].make =make;
      this.threadListArray[index].model =model;
      this.threadListArray[index].year =year;
      this.threadListArray[index].threadAcces =threadAcces;
      this.threadListArray[index].currentDtc =currentDtc;
      this.threadListArray[index].curentDtclength =curentDtclength;
      this.threadListArray[index].viewCount =viewCount;
      this.threadListArray[index].likeCount =likeCount;
      this.threadListArray[index].pinCount =pinCount;
      this.threadListArray[index].replyCount =replyCount;
      this.threadListArray[index].closeStatus =closeStatus;
      this.threadListArray[index].newThreadTypeSelect =newThreadTypeSelect;
      this.threadListArray[index].summitFix =summitFix;
      this.threadListArray[index].scorePoint =scorePoint;
      this.threadListArray[index].escalateStatus =escalateStatus;
      this.threadListArray[index].escColorCodes =escColorCodes;
      this.threadListArray[index].escColorCodesValue =escColorCodesValue;
      this.threadListArray[index].fixStatus =fixStatus;
      this.threadListArray[index].fixPostStatus =fixPostStatus;
      this.threadListArray[index].postId =postId;
      this.threadListArray[index].likeStatus =likeStatus;
      this.threadListArray[index].shareFix =shareFix;
      this.threadListArray[index].pinStatus =pinStatus;
      this.threadListArray[index].uploadContents =uploadContents;
      this.threadListArray[index].moreAttachments = moreAttachments;
      this.threadListArray[index].newNotificationState = "";
      this.threadListArray[index].state = "active";
      console.log(this.thumbView)
      if(this.thumbView) {
        this.backScroll();
      }
    } else {
      if (push == true) {
        console.log(13456)
        this.threadListArray.unshift({
          threadId: threadId,
          threadTitle: threadTitle,
          threadStatus: threadStatus,
          badgeTopUser: badgeTopUser,
          threadStatusBgColor: threadStatusBgColor,
          threadStatusColorValue: threadStatusColorValue,
          profileImage: profileImage,
          availability: availability,
          badgeStatus: badgeStatus,
          postedFrom: postedFrom,
          userName: userName,
          createdOn: localcreatedOnDate,
          date: dateTime[0],
          time: dateTime[1],
          make: make,
          model: model,
          year: year,
          threadAcces: threadAcces,
          currentDtc: currentDtc,
          curentDtclength: curentDtclength,
          viewCount: viewCount,
          likeCount: likeCount,
          pinCount: pinCount,
          replyCount: replyCount,
          closeStatus: closeStatus,
          newThreadTypeSelect: newThreadTypeSelect,
          summitFix: summitFix,
          scorePoint: scorePoint,
          escalateStatus: escalateStatus,
          escColorCodes: escColorCodes,
          escColorCodesValue: escColorCodesValue,
          fixStatus: fixStatus,
          fixPostStatus: fixPostStatus,
          postId: postId,
          likeStatus: likeStatus,
          shareFix: shareFix,
          pinStatus: pinStatus,
          uploadContents: uploadContents,
          moreAttachments: moreAttachments,
          newNotificationState: newPushClass,
          state: "active",
        });
        if(this.thumbView) {
          this.masonry.reloadItems();
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.opacityFlag = false;
            this.updateMasonryLayout = false;
          }, 50);
        }
      } else {
        //console.log(newPushClass)
        this.threadListArray.push({
          threadId: threadId,
          threadTitle: threadTitle,
          threadStatus: threadStatus,
          badgeTopUser: badgeTopUser,
          threadStatusBgColor: threadStatusBgColor,
          threadStatusColorValue: threadStatusColorValue,
          profileImage: profileImage,
          availability: availability,
          badgeStatus: badgeStatus,
          postedFrom: postedFrom,
          userName: userName,
          createdOn: localcreatedOnDate,
          date: dateTime[0],
          time: dateTime[1],
          make: make,
          model: model,
          year: year,
          threadAcces: threadAcces,
          currentDtc: currentDtc,
          curentDtclength: curentDtclength,
          viewCount: viewCount,
          likeCount: likeCount,
          pinCount: pinCount,
          replyCount: replyCount,
          closeStatus: closeStatus,
          newThreadTypeSelect: newThreadTypeSelect,
          summitFix: summitFix,
          scorePoint: scorePoint,
          escalateStatus: escalateStatus,
          escColorCodes: escColorCodes,
          escColorCodesValue: escColorCodesValue,
          fixStatus: fixStatus,
          fixPostStatus: fixPostStatus,
          postId: postId,
          likeStatus: likeStatus,
          shareFix: shareFix,
          pinStatus: pinStatus,
          uploadContents: uploadContents,
          moreAttachments: moreAttachments,
          newNotificationState: newPushClass,
          state: "active",
        });
      }
    }
  }

  backScroll(threadId = 0) {
    let scrollPos = localStorage.getItem('wsScrollPos');
    let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
    this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
    console.log(this.scrollTop, threadId)
    setTimeout(() => {
      localStorage.removeItem('wsScrollPos');
      //if(threadId == 0) {
        this.updateMasonryLayout = true;
        setTimeout(() => {
          this.updateMasonryLayout = false;
        }, 50);
      //}
      setTimeout(() => {
        let id = (this.thumbView) ? 'thread-data-container' : 'file-datatable';
        this.scrollToElem(id, threadId);
      }, 500);
    }, 5);
  }
  backSearchScroll() { 
      let sListData = localStorage.getItem('sListData');
      this.threadListArray = [];
      if(!this.thumbView) {
        this.table.reset(); 
      }
      this.threadListArray = (sListData == null) ? this.threadListArray : JSON.parse(sListData);
      console.log(this.threadListArray);
      if(this.threadListArray.length==0){
        this.displayNoRecords = true;
        this.displayNoRecordsDefault = true;
        this.displayNoRecordsShow = 1;            
        this.loadingthread = false;
        this.centerloading = false;
        this.loadingthreadmore = false;
        this.updateMasonryLayout = true;
        this.opacityFlag = false;
      }
      else{  
      let itemOffset = localStorage.getItem('sOffset');    
      this.itemOffset = (itemOffset == null) ? this.itemOffset : parseInt(itemOffset);
      console.log(this.itemOffset);
      let scrollPos = localStorage.getItem('sScrollPos');
      let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
      this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
      console.log(this.scrollTop);
      setTimeout(() => {        
        localStorage.removeItem('sScrollPos');
        localStorage.removeItem('sOffset');
        localStorage.removeItem('sListData'); 
        localStorage.removeItem('sNavUrl'); 
        let timedelay1 = 0;       
        let timedelay2 = 0;       
        let timedelay3 = 0; 
        if(this.tvsFlag){
          timedelay1 = 1500;
          timedelay2 = 1700;
          timedelay3 = 2200;
        } 
        else{
          timedelay1 = 500;
          timedelay2 = 700;
          timedelay3 = 1200;
        }     
        if(this.thumbView) {
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.loadingthreadmore = false;
            this.updateMasonryLayout = true;
          }, timedelay1);
          setTimeout(() => {
            this.updateMasonryLayout = false;            
          }, timedelay2);
        }  
        setTimeout(() => {
          let id = (this.thumbView) ? 'thread-data-container' : 'file-datatable';
          this.scrollToElem(id, 0);
        }, timedelay3);    
      }, 5);   
    }             
  }
  backSearchHomeScroll() {
    this.masonry.reloadItems();
    this.masonry.layout();
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 100);
  }
  scroll = (event: any): void => {
    if(event.target.id == 'thread-data-container' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      this.nothingtoshow = false;
      var scrollLeftevt = event.target.scrollLeft;
      var scrollTopevt = event.target.scrollTop;
      console.log(scrollTopevt+'---scrollTopevt');
      if (scrollTopevt < 2) {
        $(".workstream-page-center-menu-inner").removeClass("scroll-bg");
      } else {
        $(".workstream-page-center-menu-inner").addClass("scroll-bg");
      }
      console.log("scrolling");
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 12;
      this.scrollTop = event.target.scrollTop - 80;
      let scrollTop1 = event.target.scrollTop - 250;

      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        console.log(
          "scrolling -inner" +
            this.scrollCallback +
            this.itemTotal +
            "----" +
            this.itemLength
        );
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.fromfirebaseData=0;
          this.scrollCallback = false;
          console.log("bottom reached");
          
          this.loadThreadsPage();
          this.loadingthreadmore = true;
        }
      }
      //console.log(this.itemTotal + "--" + this.itemTotal + "-" + this.itemOffset);
      if (this.itemTotal && this.itemTotal < this.itemOffset) {
        if (inHeight >= totalHeight) {
          this.nothingtoshow = true;
        } else {
          this.nothingtoshow = false;
        }
      }
    }
  };

  // change SUBTAB
  onChangeSubTab(id, flag){
    console.log(JSON.stringify(this.threadSubTypeDataArr));
    if(flag){
      let index = this.threadSubType.indexOf(id);
      this.threadSubType.splice(index, 1);   
      var objIndex = this.threadSubTypeDataArr.findIndex((obj => obj.subThreadType == id)); 
      this.threadSubTypeDataArr[objIndex].selected = false;
    }
    else{
      this.threadSubType.push(id); 
      var objIndex = this.threadSubTypeDataArr.findIndex((obj => obj.subThreadType == id)); 
      this.threadSubTypeDataArr[objIndex].selected = true;
    }
    console.log(id);
    console.log(JSON.stringify(this.threadSubType));
    console.log(JSON.stringify(this.threadSubTypeDataArr));
    
    this.threadListArray = [];
    this.threadListArrayNew = [];
    this.loadingthread = true;
    this.threadsAPIcall.unsubscribe();
    this.loadThreadsPage();
  }
  getThreadSubTypeData(data){
    this.threadSubTypeFlag = true; 
    if (this.pageDataInfo == "4") {        
      let rmMidHeight = (this.thumbView) ? 154 : 134;
      let rmListHeight = (this.thumbView) ? 159 : 134;
      //this.midHeight = windowHeight.height - rmMidHeight;
      this.midHeight = 210;
      this.listHeight = windowHeight.height - rmListHeight; 
      this.pTableHeight = parseInt(this.listHeight)-53+'px';            
    }
    else if (this.pageDataInfo == "6") {
      //this.midHeight = windowHeight.height;   
      //this.midHeight = this.midHeight - 189; 
      this.midHeight = 210;
    }
    else{
      //this.midHeight = windowHeight.height;   
      //this.midHeight = this.midHeight - 189; 
      this.midHeight = 210;
    }      
    this.threadSubTypeData = data;  
    for(let subdata of this.threadSubTypeData){
      console.log(subdata.subThreadType);
      this.threadSubType.push(subdata.subThreadType);
      this.threadSubTypeDataArr.push({
        id: subdata.id,
        name: subdata.name,
        subThreadType: subdata.subThreadType,
        threadType: subdata.threadType,
        selected: true
      });
    }
    setTimeout(() => {      
      let listWidth = document.getElementsByClassName("sub-group-inner-container")[0].clientWidth;  
      this.setTWidth = listWidth;      
    }, 1600);
  }

  ngOnDestroy() {
    let flag = false;
    this.loadingthread = flag;
    this.centerloading = flag; 
    this.subscription.unsubscribe();
    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove(this.bodyClass2);
  }
}