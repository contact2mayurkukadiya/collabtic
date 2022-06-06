import { Component, ElementRef, EventEmitter, HostListener, OnInit, OnDestroy, Input, Output, ViewChild } from "@angular/core";
import { PlatformLocation } from "@angular/common";
import * as moment from "moment";
import { GtsService } from "src/app/services/gts/gts.service";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ConfirmationComponent } from "src/app/components/common/confirmation/confirmation.component";
import { SubmitLoaderComponent } from "src/app/components/common/submit-loader/submit-loader.component";
import { SuccessModalComponent } from "src/app/components/common/success-modal/success-modal.component";
import { ProbingQuestionsService } from "src/app/services/probing-questions/probing-questions.service";
import { Constant, pageInfo, RedirectionPage, windowHeight } from "src/app/common/constant/constant";
import { CommonService } from "src/app/services/common/common.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NgxMasonryComponent } from "ngx-masonry";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import { Subscription } from "rxjs";
import { Table } from "primeng/table";

@Component({
  selector: "app-gts-lists",
  templateUrl: "./gts-lists.component.html",
  styleUrls: ["./gts-lists.component.scss"],
})
export class GtsListsComponent implements OnInit, OnDestroy {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Input() pageDataInfo:any = pageInfo.gtsPage;
  @Output("gtsCreateAccess") gtsCreateAccess = new EventEmitter();
  public baseUrl: string = "gts";
  @ViewChild("top", { static: false }) top: ElementRef;
  @ViewChild("table", { static: false }) table: Table;
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  
  public pageGtsUrl: string = `${this.baseUrl}`;
  public viewGtsUrl: string = `${this.baseUrl}/view`;
  public editGtstUrl: string = `${this.baseUrl}/edit`;
  public newGtsUrl: string = `${this.baseUrl}/new`;
  public duplicatePath: string = `${this.baseUrl}/duplicate`;
  public title: string = "GTS List";
  public apiKey: string = Constant.ApiKey;
  public lazyLoading: boolean = false;
  public filterOptions: any = [];
  public bodyClass: string = "web-probing";
  public bodyClass1: string = "submit-loader";
  public bodyClass2: string = "parts-list";
  public bodyElem;
  public footerElem;
  public updateMasonryLayout: boolean = false;
  public expandFlag: boolean = true;

  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public resize: boolean = false;
  public gtsSelectAll: boolean = false;
  gtsListColumns: any = [];

  public gtsFilter = [];
  public prodTypes = [];
  public emissions = [];
  public models = [];
  public years = [];
  public imgUrl: string = "assets/images/gts/gts-placeholder.png";
  public chevronImg: string = "assets/images/parts/chevron.png";
  public navAction: string = "single";
  public createAccess: boolean = false;
  public successFlag: boolean = false;
  public successMsg: string = "";
  pageAccess: string = "gtsList";
  public rightPanel: boolean = true;
  public section: number = 1;
  public gtsType: string = "";
  public gtsStatus: string = "";
  public searchVal: string = "";
  public userId;
  public roleId;
  gtsList: any = [];

  public headerData: Object;
  public apiData: Object;
  public domainId;
  public countryId = localStorage.getItem('countryId');
  public make: string = "TVS";
  public multipleHtml: string = "Multiple";
  public tooltipClearFlag: boolean = true;
  public gtsTooltip: boolean = false;
  public customTooltip: boolean = false;
  public positionTop: number;
  public positionLeft: number;
  public gtsActionPosition: string;
  public pageloadedhere: string;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public itemLength: number = 0;
  public itemTotal: number;
  public itemList: object;
  public itemResponse = [];
  public ItemEmpty: boolean = false;
  public loading: boolean = true;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public headerFlag: boolean = false;

  public bodyHeight: number;
  public innerHeight: number;
  public innerHeightnew: number;

  public duplicateRedirect: string;
  public editAccess: boolean;
  public gtsId: number;
  public gtsIndex: number;
  public platformId;
  public tvsFlag: boolean = false;
  public DICVDomain: boolean = false;
  public makeTitle: string = "";

  public displayNoRecords: boolean = false; 
  public thumbView: boolean = true;
  public opacityFlag: boolean = false;
  public currentPage = "";
  public gtsData = {
    accessFrom: this.pageAccess,
    action: "get",
    domainId: 0,
    countryId: this.countryId,
    expandFlag: this.rightPanel,
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    section: this.section,
    thumbView: this.thumbView,
    searchVal: this.searchVal,
    userId: 0,
    partType: this.gtsType,
    partStatus: this.gtsStatus,
    headerFlag: this.headerFlag,
    filterrecords:false,
    gtsaction:"init"
  };
  public user: any;

  // Scroll Down
  @HostListener("scroll", ["$event"])
  onScroll(event: any) {
    this.scroll(event);
  }

  // Resize Widow
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 100);
    this.resize = true;
  }
  constructor(
    private gtsListingApi: GtsService,
    private probingApi: ProbingQuestionsService,
    private modalService: NgbModal,
    private commonApi: CommonService,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: PlatformLocation
  ) {
    this.location.onPopState (() => {
      let url = this.router.url.split('/');
      console.log(url)
      if(url[1] == RedirectionPage.GTS) {
        let scrollPos = localStorage.getItem('wsScrollPos');
        let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
        this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
        this.opacityFlag = true;
        setTimeout(() => {
          this.updateMasonryLayout = true;
          setTimeout(() => {
            this.updateMasonryLayout = false;
          }, 50);
            
          setTimeout(() => {
            let id = (this.thumbView) ? 'partList' : 'matrixTable';
            this.scrollToElem(id);
          }, 500);
        }, 5);
      }
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.bodyHeight = window.innerHeight;
    this.bodyElem = document.getElementsByTagName("body")[0];
    let platformId = localStorage.getItem('platformId');

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;

    if(this.domainId == 98){
      console.log(this.domainId);      
      this.DICVDomain = true;
    }

    this.platformId = (platformId == 'undefined' || platformId == undefined) ? this.platformId : parseInt(platformId);
    this.tvsFlag = (this.platformId == 2 && this.domainId == 52) ? true : false;
    if(this.tvsFlag){
      this.makeTitle = "Product Type";
    }
    else{
      this.makeTitle = "Make"
    }

    console.log(this.tvsFlag)
    if(!this.tvsFlag && !this.DICVDomain) {
      this.gtsListColumns = [
        { field: 'productCategoryName', header: 'Problem Category', columnpclass:'w1 header thl-col-1 col-sticky' },
        { field: 'name', header: 'GTS Procedure Title', columnpclass:'w2 header thl-col-2 col-sticky' },
        { field: 'systemSelection', header: 'System',columnpclass:'w3 header thl-col-3'},
        { field: 'procedureId', header: 'Procedure ID',columnpclass:'w4 header thl-col-4'},
        { field: 'workstreams', header: 'Workstream Name',columnpclass:'w5 header thl-col-5'},
        { field: 'productType', header: this.makeTitle,columnpclass:'w6 header thl-col-6'},
        { field: 'model', header: 'Model',columnpclass:'w7 header thl-col-7'},
        { field: 'year', header: 'Year',columnpclass:'w8 header thl-col-8'},
        { field: 'createdOn', header: 'Created On',columnpclass:'w9 header thl-col-9'},
        { field: 'createdBy', header: 'Created By',columnpclass:'w10 header thl-col-10'},
        { field: 'updatedOn', header: 'Modified On',columnpclass:'w11 header thl-col-11'},
        { field: 'updatedBy', header: 'Modified By',columnpclass:'w12 header thl-col-12'},
        { field: 'gtsStatus', header: 'Status',columnpclass:'w13 header thl-col-13 status-col col-sticky'},
      ];
    }else if(!this.tvsFlag && this.DICVDomain) {
      this.gtsListColumns = [
        { field: 'productCategoryName', header: 'Problem Category', columnpclass:'w1 header thl-col-1 col-sticky' },
        { field: 'name', header: 'GTS Procedure Title', columnpclass:'w2 header thl-col-2 col-sticky' },
        { field: 'systemSelection', header: 'System',columnpclass:'w3 header thl-col-3'},
        { field: 'procedureId', header: 'Procedure ID',columnpclass:'w4 header thl-col-4'},
        { field: 'workstreams', header: 'Workstream Name',columnpclass:'w5 header thl-col-5'},
        { field: 'productType', header: this.makeTitle,columnpclass:'w6 header thl-col-6'},
        { field: 'emission', header: 'Emission',columnpclass:'w7 header thl-col-7'},
        { field: 'model', header: 'Model',columnpclass:'w8 header thl-col-8'},
        { field: 'year', header: 'Year',columnpclass:'w9 header thl-col-9'},
        { field: 'createdOn', header: 'Created On',columnpclass:'w10 header thl-col-10'},
        { field: 'createdBy', header: 'Created By',columnpclass:'w11 header thl-col-11'},
        { field: 'updatedOn', header: 'Modified On',columnpclass:'w12 header thl-col-12'},
        { field: 'updatedBy', header: 'Modified By',columnpclass:'w13 header thl-col-13'},
        { field: 'gtsStatus', header: 'Status',columnpclass:'w14 header thl-col-14 status-col col-sticky'},
      ];
    } else {
      this.gtsListColumns = [
        { field: 'productCategoryName', header: 'Problem Category', columnpclass:'w1 header thl-col-1 col-sticky' },
        { field: 'name', header: 'GTS Procedure Title', columnpclass:'w2 header thl-col-2 col-sticky' },
        { field: 'productModuleType', header: 'Module Type', columnpclass:'w3 header thl-col-3' },
        { field: 'productModuleMfg', header: 'Module Mfg', columnpclass:'w4 header thl-col-4' },
        { field: 'dtcCode', header: 'DTC', columnpclass:'w5 header thl-col-5'},
        { field: 'dtcDesc', header: 'DTS Description',columnpclass:'w6 header thl-col-6' },
        { field: 'systemSelection', header: 'System',columnpclass:'w7 header thl-col-7' },
        { field: 'procedureId', header: 'Procedure ID',columnpclass:'w8 header thl-col-8' },
        { field: 'workstreams', header: 'Workstream Name',columnpclass:'w9 header thl-col-9' },
        { field: 'productType', header: this.makeTitle,columnpclass:'w10 header thl-col-10' },
        { field: 'model', header: 'Model',columnpclass:'w11 header thl-col-11' },
        { field: 'year', header: 'Year',columnpclass:'w12 header thl-col-12' },
        { field: 'createdOn', header: 'Created On',columnpclass:'w13 header thl-col-13' },
        { field: 'createdBy', header: 'Created By',columnpclass:'w14 header thl-col-14' },
        { field: 'updatedOn', header: 'Modified On',columnpclass:'w15 header thl-col-15' },
        { field: 'updatedBy', header: 'Modified By',columnpclass:'w16 header thl-col-16' },
        { field: 'gtsStatus', header: 'Status',columnpclass:'w17 header thl-col-17 status-col col-sticky' },
      ];
    }

    this.subscription.add(
      this.commonApi.gtsListDataReceivedSubject.subscribe((data: any) => {
        console.error("data is called", data);
        if (data && data.accessFrom && data.accessFrom == "landing") {
          this.currentPage = data.accessFrom;
          this.loading = true;
          this.setScreenHeight();        
        }   

        switch(data['gtsaction']){
          case 'filter':          
            setTimeout(() => {
              this.top.nativeElement.scroll({
                top: 0,  
                left: 0,
                behavior: 'auto'  
              });
            }, 1000);  
            this.getGTSLists(data); 
          break;
          case 'view':
            if(this.itemOffset == 20){
              //this.getGTSLists(data); 
            }
            this.thumbView = data["thumbView"]; 
            if (this.thumbView) {
              setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
              }, 500);
            }  
          break;
          default:
            this.getGTSLists(data); 
          break;
          }
      })
    );

    this.subscription.add(
      this.commonApi.gtsListWsDataReceivedSubject.subscribe((data) => {
        this.loading = true;
        this.setScreenHeight();
        this.getGTSLists(data);      
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r) => {
        let action = r['action'];
        let access = r['access'];
        let page = r['page'];       
        switch(action) {
          case 'updateLayout':           
            let scrollPos = localStorage.getItem('wsScrollPos');
            let inc = (scrollPos != null && parseInt(scrollPos) > 0) ? 80 : 0;
            this.scrollTop = (scrollPos == null) ? this.scrollTop : parseInt(scrollPos)+inc;
            this.opacityFlag = true;
            setTimeout(() => {
              localStorage.removeItem('wsScrollPos');
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 100);
                
              setTimeout(() => {
                let id = (this.thumbView) ? 'partList' : 'matrixTable';
                this.scrollToElem(id);
              }, 500);
            }, 5);
          break;
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
        let action = r['action'];
        let access = r['access'];
        let page = r['page'];       
        switch(action) {          
          case 'side-menu':
            if(access == 'GTS' || page == 'gts') {
              if(!document.body.classList.contains(this.bodyClass2)) {
                document.body.classList.add(this.bodyClass2);
              }
              this.opacityFlag = false;
              this.masonry.reloadItems();
              this.masonry.layout();
              this.updateMasonryLayout = true;
              setTimeout(() => {
                this.updateMasonryLayout = false;
              }, 500);
            }
            return false;
            break;
           
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        var setdata = JSON.parse(JSON.stringify(r));
        let action = setdata.action;
        switch(action) {
          case 'silentDelete':
            let gtsIndex = this.gtsList.findIndex(option => option.procedureId == setdata.gtsId);
            this.gtsList.splice(gtsIndex, 1);
            this.itemTotal -= 1;
            this.itemLength -= 1; 
            return false;
            break;  
        }
      })
    );

    if(this.pageDataInfo == 2) {
      setTimeout(() => {
        this.scrollTop = 0;
        let id = (this.thumbView) ? 'partList' : 'matrixTable';
        this.scrollToElem(id);  
      }, 1000);
    }
  }
  // View Probing Questions
  viewGtsProcedure(action, id, length = 0) {
    if(length > 1) {
      console.log(length)
      return false;
    }
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' parts') ? false : true;
    let scrollTop:any = this.scrollTop;
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
    let url = `${this.viewGtsUrl}/${id}`;
    if (action == "single") {
      this.router.navigate([url]);
    }
    if (
      action != "Multiple" &&
      action == "Multiple Product Types" &&
      action != "Multiple Models" &&
      action != "Multiple Years"
    ) {
      this.router.navigate([url]);
    }
  }
  // Set Screen Height
  setScreenHeight() {
    /* let headerHeight =
      document.getElementsByClassName("prob-header")[0].clientHeight;
    let footerHeight =
      document.getElementsByClassName("footer-content")[0].clientHeight;
    this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 60);
    this.innerHeight = this.bodyHeight > 1420 ? 980 : this.innerHeight-10; */
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam + 80;
    } else {
      let rmHeight = this.thumbView ? 0 : 0;
      let headerHeight = document.getElementsByClassName("prob-header")[0].clientHeight;
      let titleHeight = 0;
      titleHeight = !this.thumbView ? titleHeight - 25 : titleHeight - 15;
      let footerHeight =
        document.getElementsByClassName("footer-content")[0].clientHeight;
      let pmsgHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
    this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 90 + pmsgHeight);
      this.innerHeight = this.innerHeight - (titleHeight+rmHeight);
    }
  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 500);
  }
  // Get GTS Lists
  getGTSLists(gtsData?, showLoading = false) {
    this.headerFlag = false;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;

    console.error("----gtsData----", gtsData);    
    if (gtsData == undefined) {
      // this.userId = gtsData["userId"];
      // this.domainId = gtsData["domainId"];
      // this.filterOptions = gtsData["filterOptions"];
      // this.thumbView = gtsData["thumbView"];
      this.displayNoRecords = false;
    } else {
      this.userId = gtsData["userId"];
      //this.domainId = gtsData["domainId"];
      this.countryId = gtsData["countryId"];
      this.filterOptions = gtsData["filterOptions"];      
      this.thumbView = gtsData["thumbView"];      
      console.log(gtsData["offset"]);
      if (gtsData["offset"] != undefined) {
        this.itemOffset = gtsData["offset"];
      }  
      if (gtsData["searchKey"] != undefined) {
        this.searchVal = gtsData["searchKey"];
      }    
    }
    
    let apiInfo = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      isActive: 1,
      searchKey: this.searchVal,
      filterOptions: this.filterOptions,
      limit: this.itemLimit,
    };
    this.apiData = apiInfo;

    this.apiData["offset"] = this.itemOffset;
    if(this.itemOffset == 0){
      this.gtsList = [];
    }

    const apiFormData = new FormData();
    apiFormData.append("apiKey", this.apiData["apiKey"]);
    apiFormData.append("domainId", this.apiData["domainId"]);
    apiFormData.append("countryId", this.apiData["countryId"]);
    apiFormData.append("userId", this.apiData["userId"]);
    apiFormData.append("searchKey", this.apiData["searchKey"]);
    apiFormData.append("limit", this.apiData["limit"]);
    apiFormData.append("offset", this.apiData["offset"]);
    //apiFormData.append("type", this.apiData["pinned"]);
    apiFormData.append(
      "filterOptions",
      JSON.stringify(this.apiData["filterOptions"])
    );
    if (this.apiData["filterOptions"]) {
      localStorage.setItem(
        "gtsFilter",
        JSON.stringify(this.apiData["filterOptions"])
      );
    }
    if (showLoading) this.loading = true;

    this.gtsListingApi.getGTSLists(apiFormData).subscribe((response) => {
      if (response.status == "Success") {
        let skey = this.apiData["searchKey"];
        skey = skey != undefined ? skey : '';
        let skeylength = skey != '' ? skey.length : 0 ;
        this.headerFlag = true;
        this.createAccess = response.gtsCreateAccesss == 1 ? true : false;
        this.gtsCreateAccess.emit(this.createAccess);
        let resultData = response.procedure;
        if (resultData == "") {
          this.ItemEmpty = true; 
          this.displayNoRecords = (gtsData["filterrecords"] || skeylength>0 ) ? true: false;
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.loading = false;
          this.ItemEmpty = false; 
          this.displayNoRecords = false;         
          this.itemResponse = resultData;
          this.itemTotal = response.total;
          this.itemLength += resultData.length;
          this.itemOffset += this.itemLimit;

          let loadItems = false;
          for (var i in resultData) {            
            resultData[i].isSelected = false;
            let ws = resultData[i].workstreams;
            let wsTxt = "";
            let sep = ", ";
            let wsLen = ws.length;
            for (var w in ws) {
              sep = parseInt(w) + 1 == wsLen ? "" : sep;
              wsTxt += ws[w].name + sep;
            }
            resultData[i].isDefaultImg = resultData[i].gtsImg == "" ? true : false;
            console.log(resultData[i].isDefaultImg)
            resultData[i].gtsImg = resultData[i].gtsImg == "" ? this.imgUrl : resultData[i].gtsImg;
            resultData[i].dtcCode = resultData[i].dtcCode == "" ? "-" : resultData[i].dtcCode;
            resultData[i].dtcDesc = resultData[i].dtcDesc == "" ? "-" : resultData[i].dtcDesc;
            resultData[i].workstreams = resultData[i].workstreamsList;
            let createdDate = moment.utc(resultData[i].createdOn).toDate();
            let localCreatedDate = moment(createdDate).local().format("MMM DD, YYYY h:mm A");
            let updatedDate = moment.utc(resultData[i].updatedOn).toDate();
            let localUpdatedDate = moment(updatedDate).local().format("MMM DD, YYYY h:mm A");
            resultData[i].createdOn = resultData[i].createdOn == "" ? "-" : localCreatedDate;
            resultData[i].updatedOn = resultData[i].updatedOn == "" ? "-" : localUpdatedDate;
            resultData[i].gtsBaseImg = resultData[i].gtsBaseImg == "" ? this.imgUrl : resultData[i].gtsImg;
            resultData[i].systemSelection = resultData[i].systemSelection == "" ? "-" : resultData[i].systemSelection;
            resultData[i].createdBy = resultData[i].createdBy == "" ? "-" : resultData[i].createdBy;
            resultData[i].modifiedBy = resultData[i].modifiedBy == "" ? "-" : resultData[i].modifiedBy;
            resultData[i].activeMore = false;
            resultData[i].actionFlag = this.roleId == 3 || this.userId == resultData[i].createdById ? true : false;
            /*resultData[i].editAccess = resultData[i].editAccess == 1 ? true : false;*/
            resultData[i].editAccess = this.roleId == '3' || this.userId == resultData[i].createdById ? true : false;
            resultData[i].viewAccess = resultData[i].viewAccess == 1 ? true : false;

            let productType = resultData[i].productType;
            if (productType == "") {
              let vehicleInfo =
                resultData[i].vehicleDetails == "" ? resultData[i].vehicleDetails : JSON.parse(resultData[i].vehicleDetails);
              console.log(JSON.stringify(vehicleInfo))
                switch (vehicleInfo.length) {
                case 0:
                  resultData[i].productType = "-";
                  resultData[i].model = (this.tvsFlag) ? "All Models" : "-";   
                  if(this.DICVDomain){              
                    resultData[i].emissionName = "-";  
                    resultData[i].emissionList = [];
                  }               
                  resultData[i].year = "-";
                  resultData[i].modelList = [];                  
                  resultData[i].year = "-";
                  resultData[i].yearList = [];
                  break;
                case 1:
                  resultData[i].productType = vehicleInfo.length == 1 ? vehicleInfo[0].productType : "-";
                  resultData[i].productTypeList = vehicleInfo;
                  if(this.DICVDomain){
                    console.log("checking");
                    if(resultData[i].emissionName != undefined){
                      console.log(vehicleInfo[0].emissionName.length);
                      resultData[i].emissionName = vehicleInfo[0].emissionName.length > 1 ? this.multipleHtml + " Emissions" : vehicleInfo[0].emissionName[0];
                      resultData[i].emissionList = vehicleInfo[0].emissionName;                    
                    }
                    else{
                      resultData[i].emissionName = "-";  
                      resultData[i].emissionList = [];
                    }
                  }
                  resultData[i].model = vehicleInfo[0].model.length > 1 ? this.multipleHtml + " Models" : vehicleInfo[0].model[0];
                  resultData[i].modelList = vehicleInfo[0].model;
                  let yearVal = vehicleInfo[0].year == 0 && vehicleInfo[0].year != '' ? 'All' : vehicleInfo[0].year;                  
                  resultData[i].year = vehicleInfo[0].year.length > 1 ? this.multipleHtml + " Years" : yearVal;
                  resultData[i].yearList = vehicleInfo[0].year.length > 1 ? this.multipleHtml : yearVal;
                  break;
                default:
                  resultData[i].makeDCIVFlag = false;
                  if(this.tvsFlag){
                    resultData[i].productType = this.multipleHtml + " Product Types";
                  }
                  else{                    
                    if(this.DICVDomain){
                      resultData[i].productType = 
                    this.multipleHtml + " Makes";                    
                      /*for( let vi of vehicleInfo){
                        if(vi.productType == 'DICV'){
                          resultData[i].productType = 'DICV';
                          resultData[i].makeDCIVFlag = true;
                        }            
                      }*/
                    }
                    else{
                      resultData[i].productType =
                    this.multipleHtml + " Makes";
                    } 

                  }
                  resultData[i].productTypeList = vehicleInfo;
                  if(this.DICVDomain){                    
                    resultData[i].emissionName = this.multipleHtml + " Emissions";
                    resultData[i].emissionList = vehicleInfo;
                  }                  
                  resultData[i].model = this.multipleHtml + " Models";
                  resultData[i].modelList = vehicleInfo;
                  resultData[i].year = this.multipleHtml + " Years";
                  resultData[i].yearList = vehicleInfo;
                  break;
              }
            }

            resultData[i].workstreamLists = ws;
            resultData[i].workstreams =
              wsLen > 1 ? this.multipleHtml : ws[0].name;
            resultData[i].workstreamsLen = wsLen;
            this.gtsList.push(resultData[i]);
            setTimeout(() => {           
              /*this.top.nativeElement.scroll({
                top: 0,  
                left: 0,
                behavior: 'auto'  
              });*/
            }, 100);

            if (parseInt(i) + 1 + "==" + resultData.length) {
              loadItems = true;
            }
          }

          if (this.thumbView) {
            setTimeout(() => {
              this.masonry.reloadItems();
              this.masonry.layout();              
                this.updateMasonryLayout = true;
                setTimeout(() => {
                  this.updateMasonryLayout = false;
                }, 50);
            }, 2000);
          }

           setTimeout(() => {
            if(!this.ItemEmpty) {
              let listItemHeight;
              if(this.thumbView) {
                listItemHeight = (document.getElementsByClassName('gts-grid-row')[0].clientHeight)+50; 
              } else {
                listItemHeight = (document.getElementsByClassName('gts-list-row')[0].clientHeight)+50;
              }
              //console.log(this.innerHeight+'::'+listItemHeight)
              if(resultData.length > 0 && this.gtsList.length != this.itemTotal && this.innerHeight >= listItemHeight) {
                this.scrollCallback = false;
                this.getGTSLists();
                this.lazyLoading = true;
                this.lastScrollTop = this.scrollTop; 
              }
            }
          }, 1500);

        }
        this.loading = false;
        this.lazyLoading = false;
        this.setScreenHeight();
      }

      // Get Product Types
      //this.getProdTypes();
    });
  }

  // Get Product Types
  getProdTypes() {
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      make: this.make,
    };

    this.probingApi.getProdTypeLists(apiData).subscribe((response) => {
      if (response.status == "Success") {
        this.loading = false;
        let resultData = response.data;

        for (let p of resultData) {
          if (p.prodType != "None") {
            this.prodTypes.push({
              id: p.prodType,
              name: p.prodType,
            });
          }
        }
      }
    });
  }

  // Get Vehicle Models
  getVehicleModels(value) {
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      make: this.make,
      prodType: value,
    };

    this.probingApi.getVehicleModels(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let resultData = response.data.model;
        for (let m of resultData) {
          this.models.push({
            id: m.model_name,
            name: m.model_name,
          });
        }
      }
    });
  }

  // Delete GTS
  deleteRequest(gtsId) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.config);
    modalRef.componentInstance.access = "Delete";
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {
      modalRef.dismiss("Cross click");
      if (!recivedService) {
        return;
      } else {
        this.deleteGts(gtsId);
      }
    });
  }

  deleteGts(gtsId) {
    this.bodyElem.classList.add(this.bodyClass1);
    const modalRef = this.modalService.open(SubmitLoaderComponent, this.config);
    let gtsFormData = new FormData();
    gtsFormData.append("apiKey", this.apiData["apiKey"]);
    gtsFormData.append("domainId", this.apiData["domainId"]);
    gtsFormData.append("countryId", this.apiData["countryId"]);
    gtsFormData.append("userId", this.apiData["userId"]);
    gtsFormData.append("procedureId", gtsId);

    this.gtsList.splice(this.gtsIndex, 1);
    if(this.gtsList.length == 0) {                   
      this.ItemEmpty = true;
    }

    this.gtsListingApi.deleteGts(gtsFormData).subscribe((response) => {
      modalRef.dismiss("Cross click");
      this.bodyElem.classList.remove(this.bodyClass1);
      this.successMsg = response.result;
      const msgModalRef = this.modalService.open(
        SuccessModalComponent,
        this.config
      );
      msgModalRef.componentInstance.successMessage = this.successMsg;
      setTimeout(() => {
        msgModalRef.dismiss("Cross click");
        let gtsIndex = this.gtsList.findIndex(option => option.procedureId == gtsId);
        this.gtsList.splice(gtsIndex, 1);

        if(this.gtsList.length == 0) {                   
          this.ItemEmpty = true;
        }
      }, 3000);
    });
  }
  // New Navigation
  pageGts() {
    let url = `${this.pageGtsUrl}`;
    window.open(url, "_blank");
  }
  // New Navigation
  newGTS() {
    let url = `${this.newGtsUrl}`;
    window.open(url, "_blank");
  }
  // Edit Navigation
  editGTS(id) {
    let url = `${this.editGtstUrl}/${id}`;
    window.open(url, "_blank");
  }

  // duplicateRequest Navigation
  duplicateRequest(id) {
    let url = `${this.duplicatePath}/${id}`;
    window.open(url, "_blank");
  }
  
  // Custom Tooltip Content
  getCustTooltip(col, data, event) {
    console.error(col, data, event);
    setTimeout(() => {
      this.gtsActionPosition = "bs-popover-right";
      this.customTooltip = true;
      let element = document.getElementById("custom-popover-cont");
      element.innerHTML = "";
      this.positionLeft = event.clientX + 30;
      this.positionTop = event.clientY - 10;
      switch (col) {
        case "prodType":
          let prodList = "<ul>";
          for (let d of data) {
            let prodType = d.productType.replace(/\s/g, "").toLowerCase();
            prodList +=
              "<li class='vehicle " + prodType + "'>" + d.productType + "</li>";
          }
          prodList += "</ul>";
          element.innerHTML = prodList;
          break;
        case "workstream":
          let wsList = "<ul>";
          for (let d of data) {
            let ws = d.name;
            wsList += "<li>" + ws + "</li>";
          }
          wsList += "</ul>";
          element.innerHTML = wsList;
          break;
        case "model":
        case "year":
          let list = "<ul>";
          for (let d of data) {
            let prodType = d.productType.replace(/\s/g, "").toLowerCase();
            let innerData = col == "model" ? d.model : d.year;
            list +=
              "<li class='vehicle " +
              prodType +
              "'>" +
              d.productType +
              '<ul class="inner-list">';
            for (let i of innerData) {
              list += "<li>" + i + "</li>";
            }
            list += "</ul>";
          }
          list += "</ul>";
          element.innerHTML = list;
          break;
      }
    }, 100);
  }

  // Custom Action Tooltip Content
  getActionTooltip(index, id, event) {
    this.gtsList[index].activeMore = true;
    let actionFalg = this.gtsList[index].actionFlag;
    let timeout = 100;
    this.duplicateRedirect = "";
    for (let part of this.gtsList) {
      part.activeMore = false;
    }
    this.gtsList[index].activeMore = true;
    setTimeout(() => {
      this.editAccess = this.gtsList[index].editAccess;
      this.gtsTooltip = true;
      this.duplicateRedirect = `${this.duplicatePath}/${id}`;
      this.gtsId = id;
      this.gtsIndex = index;
      this.gtsActionPosition = "bs-popover-left";
      this.positionLeft = event.clientX - 120;
      this.positionTop = event.clientY - 80;
    }, timeout);
  }

  // Onclick Outside
  onClickedOutside() {
    if (this.tooltipClearFlag && (this.gtsTooltip || this.customTooltip)) {
      this.gtsTooltip = false;
      this.customTooltip = false;
      let element = document.getElementById("custom-popover-cont");
      element.innerHTML = "";
      this.positionLeft = 0;
      this.positionTop = 0;

      for (let gt of this.gtsList) {
        gt.activeMore = false;
      }
    }
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    console.log(secElement, this.thumbView, this.scrollTop)
    if(this.thumbView) {
      secElement.scrollTop = this.scrollTop;
    } else {
      this.table.scrollTo({'top': this.scrollTop});
    }
    this.opacityFlag = false;
  }

  // Onscroll
  scroll = (event: any): void => {
    if(event.target.id=='partList' || event.target.className=='p-datatable-scrollable-body ng-star-inserted') {
      let inHeight = event.target.offsetHeight + event.target.scrollTop;
      let totalHeight = event.target.scrollHeight - this.itemOffset * 8;
      this.scrollTop = event.target.scrollTop - 80;
      if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
        if (
          inHeight >= totalHeight &&
          this.scrollCallback &&
          this.itemTotal > this.itemLength
        ) {
          this.scrollCallback = false;
          this.lazyLoading = true;          
          this.getGTSLists();          
        }
      }
      this.lastScrollTop = this.scrollTop;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}