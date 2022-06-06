import { Injectable } from "@angular/core";
import * as moment from "moment";
import {HttpClient, HttpParams } from "@angular/common/http";
import { industryTypes,PlatFormType, Constant, silentItems, pageTitle, RedirectionPage } from "../../common/constant/constant";
import { ApiService } from "../api/api.service";
import { FilterService } from "../.../../../services/filter/filter.service";
import { DashboardService } from "../.../../../services/dashboard/dashboard.service";
import { WorkstreamService } from "../.../../../services/workstream/workstream.service";
import { MediaManagerService } from "../.../../../services/media-manager/media-manager.service";
import { FormControl } from "@angular/forms";
import { Subject, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private messageSource = new Subject();
  public _OnMessageReceivedSubject: Subject<string>;

  public _OnLeftSideMenuBarSubject: Subject<string>;
  public _OnWorkstreamMessageReceivedSubject: Subject<string>;
  public _OnLayoutStatusReceivedSubject: Subject<string>;
  public _toreceiveSearchValuetoHeader: Subject<string>;
  public _toreceiveSearchEmptyValuetoHeader: Subject<string>;
  public notificationHeaderSubject: Subject <string>;

  public _OnLayoutChangeReceivedSubject: Subject<string>;
  public mediaDataReceivedSubject: Subject<string>;
  public knowledgeBaseViewDataReceivedSubject: Subject<string>;
  public knowledgeBasePushDataReceivedSubject: Subject<string>;
  public knowledgeBaseListDataReceivedSubject: Subject<string>;
  public knowledgeBaseListWsDataReceivedSubject: Subject<string>;
  public tvsSSODataReceivedSubject: Subject<string>;
  public partListDataReceivedSubject: Subject<string>;    
  public partListWsDataReceivedSubject: Subject<string>;
  public gtsListDataReceivedSubject: Subject<string>;
  public gtsListWsDataReceivedSubject: Subject<string>;  
  public knowledgeArticleDataReceivedSubject: Subject<string>;
  public knowledgeArticleWsDataReceivedSubject: Subject<string>;
  public knowledgeBaseLayoutDataReceivedSubject: Subject<string>;
  public partLayoutDataReceivedSubject: Subject<string>;
  public dynamicFieldDataReceivedSubject: Subject<string>;
  public dynamicFieldDataResponseSubject: Subject<string>;
  public documentListDataReceivedSubject: Subject<string>;
  public documentApiCallSubject: Subject<string>;
  public documentWSApiCallSubject: Subject<string>;
  public documentFileListData: Subject<string>;
  public documentInfoDataReceivedSubject: Subject<string>;
  public documentPanelDataReceivedSubject: Subject<string>;
  public documentPanelFlagReceivedSubject: Subject<string>;
  public docScroll: Subject<string>;
  public postDataReceivedSubject: Subject<string>;
  public welcomeContentReceivedSubject: Subject<string>;
  public helpContentReceivedSubject: Subject<string>;
  public escalationLevelDataReceivedSubject: Subject<string>;
  public announcementListDataReceivedSubject: Subject<string>;
  public announcementLayoutDataReceivedSubject: Subject<string>;
  public announcementFilterData: Subject<string>;
  public detailData: Subject<string>;
  public sibListDataReceivedSubject: Subject<string>;
  public sibListWsDataReceivedSubject: Subject<string>;
  public sibLayoutDataReceivedSubject: Subject<string>;
  public workstreamListDataReceivedSubject: Subject<string>;
  public sidebarMenuDataReceivedSubject: Subject<string>;
  public docViewLoadSubject: Subject<string>;
  public mediaUploadDataSubject: Subject<string>;
  public searchInfoDataReceivedSubject: Subject<string>;
  public threadListData: Subject<string>;
  currentMessage = this.messageSource.asObservable();

  public units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  private searchFlag: any = null;
  private wsFlag: any = null;
  public wsStatus: any = "";
  public wsLoading: boolean = true;

  public currYear: any = moment().add(2, 'years').format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;
  public CBADomian: boolean = false;

  public searchRes = {
    total: 0,
    length: 0,
    userList: [],
  };

  constructor(
    private http: HttpClient,
    private apiUrl: ApiService,
    private dashboardApi: DashboardService,
    private wsApi: WorkstreamService,
    private filterApi: FilterService,
    private mediaApi: MediaManagerService,
    private router: Router
  ) {
    this._OnMessageReceivedSubject = new Subject<string>();
    this._OnLeftSideMenuBarSubject = new Subject<string>();
    this._OnWorkstreamMessageReceivedSubject = new Subject<string>();
    this.notificationHeaderSubject = new Subject<string>();
    this._OnLayoutStatusReceivedSubject = new Subject<string>();
    this._toreceiveSearchValuetoHeader = new Subject<string>();
    this._toreceiveSearchEmptyValuetoHeader = new Subject<string>();
    this._OnLayoutChangeReceivedSubject = new Subject<string>();
    this.mediaDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseViewDataReceivedSubject = new Subject<string>();
    this.knowledgeBasePushDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseListDataReceivedSubject = new Subject<string>();
    this.partListDataReceivedSubject = new Subject<string>();    
    this.tvsSSODataReceivedSubject = new Subject<string>();
    this.gtsListDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseListWsDataReceivedSubject = new Subject<string>();
    this.partListWsDataReceivedSubject = new Subject<string>();
    this.knowledgeArticleWsDataReceivedSubject = new Subject<string>();
    this.gtsListWsDataReceivedSubject = new Subject<string>();
    this.knowledgeArticleDataReceivedSubject = new Subject<string>();
    this.knowledgeBaseLayoutDataReceivedSubject = new Subject<string>();
    this.partLayoutDataReceivedSubject = new Subject<string>();
    this.dynamicFieldDataReceivedSubject = new Subject<string>();
    this.dynamicFieldDataResponseSubject = new Subject<string>();
    this.documentListDataReceivedSubject = new Subject<string>();
    this.documentApiCallSubject = new Subject<string>();
    this.documentWSApiCallSubject = new Subject<string>();
    this.documentFileListData = new Subject<string>();
    this.documentInfoDataReceivedSubject = new Subject<string>();
    this.documentPanelDataReceivedSubject = new Subject<string>();
    this.documentPanelFlagReceivedSubject = new Subject<string>();
    this.docScroll = new Subject<string>();
    this.postDataReceivedSubject = new Subject<string>();
    this.welcomeContentReceivedSubject = new Subject<string>();
    this.escalationLevelDataReceivedSubject = new Subject<string>();
    this.helpContentReceivedSubject = new Subject<string>();
    this.announcementListDataReceivedSubject = new Subject<string>();
    this.announcementLayoutDataReceivedSubject = new Subject<string>();
    this.announcementFilterData = new Subject<string>();
    this.detailData = new Subject<string>();
    this.sibListDataReceivedSubject = new Subject<string>();
    this.sibListWsDataReceivedSubject = new Subject<string>();
    this.sibLayoutDataReceivedSubject = new Subject<string>();
    this.workstreamListDataReceivedSubject = new Subject<string>();
    this.sidebarMenuDataReceivedSubject = new Subject<string>();
    this.docViewLoadSubject = new Subject<string>();
    this.mediaUploadDataSubject = new Subject<string>();
    this.searchInfoDataReceivedSubject = new Subject<string>();
    this.threadListData = new Subject<string>();
  }

  //TVS SSO Data Receive
  public emittvsSSOData(data: any): void {
    this.tvsSSODataReceivedSubject.next(data);
  }

  public emitOnLeftSideMenuBarSubject(msg: any): void {
    this._OnLeftSideMenuBarSubject.next(msg);
  }

  public emitMessageReceived(msg: any): void {
    this._OnMessageReceivedSubject.next(msg);
  }

  public emitWorkstreamReceived(msg: any): void {
    this._OnWorkstreamMessageReceivedSubject.next(msg);
  }
  public emitMessageLayoutrefresh(msg: any): void {
    this._OnLayoutStatusReceivedSubject.next(msg);
  }

  // Emit search value from search History to header
  public emitSearchValuetoHeader(msg: any): void {
    this._toreceiveSearchValuetoHeader.next(msg);
  }

  // Emit search value from search History to header
  public emitSearchEmptyValuetoHeader(msg: any): void {
    this._toreceiveSearchEmptyValuetoHeader.next(msg);
  }

  public emitMessageLayoutChange(msg: any): void {
    this._OnLayoutChangeReceivedSubject.next(msg);
  }

  // Media List Data Receive
  public emitMediaData(data: any): void {
    this.mediaDataReceivedSubject.next(data);
  }

  //knowledgebase Base View Detail Info Data Receive
  public emitKnowledgeBaseViewData(data: any): void {
    this.knowledgeBaseViewDataReceivedSubject.next(data);
  }

  //knowledgebase PUSH List Info Data Receive
  public emitKnowledgeBasePushData(data: any): void {
    this.knowledgeBasePushDataReceivedSubject.next(data);
  }

  //knowledgebase List Info Data Receive
  public emitKnowledgeBaseListData(data: any): void {
    this.knowledgeBaseListDataReceivedSubject.next(data);
  }

  // Knowledge Base List WS Info Data Receive
  public emiKnowledgeBaseListWsData(data: any): void {
    this.knowledgeBaseListWsDataReceivedSubject.next(data);
  }

  // Part List Info Data Receive
  public emitPartListData(data: any): void {
    this.partListDataReceivedSubject.next(data);
  }

  // Part List WS Info Data Receive
  public emitPartListWsData(data: any): void {
    this.partListWsDataReceivedSubject.next(data);
  }

  //GTS List Info Data Resolve
  public emitGTSLIstData(data: any): void {
    this.gtsListDataReceivedSubject.next(data);
  }

  // Part List WS Info Data Receive
  public emitGTSLIstWsData(data: any): void {
    this.gtsListWsDataReceivedSubject.next(data);
  }

  // KA List Info Data Receive
  public emitKnowledgeListData(data: any): void {
    this.knowledgeArticleDataReceivedSubject.next(data);
  }

  // KA List WS Info Data Receive
  public emitKnowledgeListWsData(data: any): void {
    this.knowledgeArticleWsDataReceivedSubject.next(data);
  }

  // Document List Info Data Receive
  public emitDocumentListData(data: any): void {
    this.documentListDataReceivedSubject.next(data);
  }

  // Document Api Call Data Receive
  public emitDocumentApiCallData(data: any): void {
    this.documentApiCallSubject.next(data);
  }

  // Document Workstream Api Call Data Receive
  public emitDocumentWsApiCallData(data: any): void {
    this.documentWSApiCallSubject.next(data);
  }

  // Document File List Data Receive
  public emitFileList(data: any): void {
    this.documentFileListData.next(data);
  }

  // Document Info Data Receive
  public emitDocumentInfoData(data: any): void {
    this.documentInfoDataReceivedSubject.next(data);
  }

  // Document Panel Data Receive
  public emitDocumentPanelData(data: any): void {
    this.documentPanelDataReceivedSubject.next(data);
  }

  // Document Panel Flag Data Receive
  public emitDocumentPanelFlag(data: any): void {
    this.documentPanelFlagReceivedSubject.next(data);
  }

  // Document Scroll to file
  public emitDocumentScroll(data: any): void {
    this.docScroll.next(data);
  }

  // Part Layout Info Data Receive
  public emitPartLayoutData(data: any): void {
    this.partLayoutDataReceivedSubject.next(data);
  }
  
  // KnowledgeBase Layout Info Data Receive
  public emitKnowledgeBaseLayoutData(data: any): void {
    this.knowledgeBaseLayoutDataReceivedSubject.next(data);
  }

  // Dynamic Field Data Receive
  public emitDynamicFieldData(data: any): void {
    this.dynamicFieldDataReceivedSubject.next(data);
  }

  // Dynamic Field Data Response
  public emitDynamicFieldResponse(data: any): void {
    this.dynamicFieldDataResponseSubject.next(data);
  }

  // post data response
  public emitPostData(data: any): void {
    this.postDataReceivedSubject.next(data);
  }

  // Part Layout Info Data Receive
  public emitAnnouncementLayoutData(data: any): void {
    this.announcementLayoutDataReceivedSubject.next(data);
  }

  // Announcement List Info Data Receive
  public emitAnnouncementListData(data: any): void {
    this.announcementListDataReceivedSubject.next(data);
  }

  // Announcement Filer
  public emitAnnouncementFilterData(data: any): void {
    this.announcementFilterData.next(data);
  }

  // welcome content
  public emitWelcomeContentView(data: any): void {
    this.welcomeContentReceivedSubject.next(data);
  }

   // welcome content
   public emitEscalationLevelView(data: any): void {
    this.escalationLevelDataReceivedSubject.next(data);
  }
  
  // help content
  public emitHelpContentView(data: any): void {
    this.helpContentReceivedSubject.next(data);
  }

  // Detail Data
  public emitDetailData(data: any): void {
    this.detailData.next(data);
  }

  // SIB List Info Data Receive
  public emitSibListData(data: any): void {
    this.sibListDataReceivedSubject.next(data);
  }

  // SIB List WS Info Data Receive
  public emitSibListWsData(data: any): void {
    this.partListWsDataReceivedSubject.next(data);
  }

  // SIB Layout Info Data Receive
  public emitSibLayoutData(data: any): void {
    this.sibLayoutDataReceivedSubject.next(data);
  }

  public emitWorkstreamListData(data: any): void {
    this.workstreamListDataReceivedSubject.next(data);
  }

  // Sidebar Menu icon update
  public emitSidebarMenuData(data: any): void {
    this.sidebarMenuDataReceivedSubject.next(data);
  }

  // Document View Load on close window on nav edit
  public emitDocViewLoad(data: any): void {
    this.docViewLoadSubject.next(data);
  }

  // Media Upload Data
  public emitMediaUploadData(data: any): void {
    this.mediaUploadDataSubject.next(data);
  }

  // Notification Header on/off
  public emitNotificationHeader(data: any): void {
    this.notificationHeaderSubject.next(data);
  }

  // Search Info Data
  public emitSearchInfoData(data: any): void {
    this.searchInfoDataReceivedSubject.next(data);
  }

  // Change Message
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  // get thread list
  public emitThreadListData(msg: any): void {
    this.threadListData.next(msg);
  }

  // Get Menu List
  getMenuLists(probingData, access = "") {
    if (access == "dashboard") {
      return this.http.post<any>(
        this.apiUrl.apiGetDashMenuLists(),
        probingData
      );
    } else {
      return this.http.post<any>(this.apiUrl.apiGetMenuLists(), probingData);
    }
  }

  checkUsername(control: FormControl): any {
    return new Promise((resolve) => {
      //Fake a slow response from server
      setTimeout(() => {
        if (control.value === "greg") {
          resolve(true);
        } else {
          resolve(null);
        }
      }, 2000);
    });
  }

  getModifiedThreadData(threadInfo, threadListData, threadType) {
    let threadLists = threadInfo[0] == "exportThread" ? [] : threadInfo[1];
    for (var i in threadListData) {
      let createdDate = moment.utc(threadListData[i].created_on).toDate();
      let localCreatedDate = moment(createdDate)
        .local()
        .format("MMM DD, YYYY h:mm A");
      let proposedFixCreatedDate = moment
        .utc(threadListData[i].proposedFix_createdOn)
        .toDate();
      let localProposedFixCreatedDate = moment(proposedFixCreatedDate)
        .local()
        .format("MMM DD, YYYY h:mm A");
      threadListData[i].created_on =
        threadListData[i].created_on == ""
          ? threadListData[i].created_on
          : localCreatedDate;
      threadListData[i].proposedFix_createdOn =
        threadListData[i].proposedFix_createdOn == ""
          ? threadListData[i].proposedFix_createdOn
          : localProposedFixCreatedDate;
      if (threadType == "closed" || threadListData[i].close_status == 1) {
        let closedDate = moment.utc(threadListData[i].close_date).toDate();
        let localClosedDate = moment(closedDate)
          .local()
          .format("MMM DD, YYYY h:mm A");
        threadListData[i].close_date =
          threadListData[i].close_date == ""
            ? threadListData[i].close_date
            : localClosedDate;
        let timeToClose;
        let closeTimeTxt;
        if (threadListData[i].close_date != "") {
          timeToClose = moment(localClosedDate)
            .utc()
            .diff(localCreatedDate, "hours");
          if (timeToClose == 0) {
            let timeToCloeMin = moment(localClosedDate)
              .utc()
              .diff(localCreatedDate, "minutes");
            if (timeToCloeMin == 0) {
              timeToClose = "-";
            } else {
              closeTimeTxt = timeToCloeMin > 1 ? " mins" : " min";
              timeToClose = timeToCloeMin + closeTimeTxt;
            }
          } else {
            closeTimeTxt = timeToClose > 1 ? " hrs" : " hr";
            timeToClose = timeToClose + closeTimeTxt;
          }
        } else {
          timeToClose = "-";
        }
        threadListData[i]["timeToClose"] = timeToClose;
      }
      let timeToRespond;
      let timeTxt;

      if (threadListData[i].proposedFix_createdOn != "") {
        timeToRespond = moment(localProposedFixCreatedDate)
          .utc()
          .diff(localCreatedDate, "hours");
        if (timeToRespond == 0) {
          let timeToRespondMin = moment(localProposedFixCreatedDate)
            .utc()
            .diff(localCreatedDate, "minutes");
          if (timeToRespondMin == 0) {
            timeToRespond = "-";
          } else {
            timeTxt = timeToRespondMin > 1 ? " hr" : " hr";
            timeToRespondMin = timeToRespondMin / 60;
            let timeToRespondMin2 = timeToRespondMin.toFixed(1);
            timeToRespond = timeToRespondMin2 + timeTxt;
          }
        } else {
          timeTxt = timeToRespond > 1 ? " hrs" : " hr";
          timeToRespond = timeToRespond + timeTxt;
        }
      } else {
        timeToRespond = "-";
      }
      threadListData[i]["timeToRespond"] = timeToRespond;
      threadListData[i]["tmName"] = threadListData[i]["territory_manager"];
      threadListData[i]["prodOwnerEmail"] =
        threadListData[i].productOwner["assigneeEmail"];
      threadListData[i]["prodOwnerPhone"] =
        threadListData[i].productOwner["assigneePhone"];
      threadListData[i]["tmEmail"] =
        threadListData[i].tm_manager["assigneeEmail"];
      threadListData[i]["tmPhone"] =
        threadListData[i].tm_manager["assigneePhone"];
      threadLists.push(threadListData[i]);
    }
    return threadLists;
  }

  // Search Dashboard Input
  dashboardSearch(apiData) {
    let result;
    if (this.searchFlag) {
      this.searchFlag.unsubscribe();
      result = this.fetchData(apiData);
    } else {
      this.fetchData(apiData);
    }
    return result;
  }

  fetchData(apiData) {
    this.searchRes["userList"] = [];
    this.searchFlag = this.dashboardApi
      .apiChartDetail(apiData)
      .subscribe((response) => {
        let responseData = response.data;
        let searchResultData = responseData.chartdetails;
        let searchNoDataFlag =
          responseData.total == 0 || searchResultData.length == 0
            ? true
            : false;
        this.searchRes["total"] = responseData.total;
        this.searchRes["length"] = searchResultData.length;
        if (!searchNoDataFlag) {
          for (var user of searchResultData) {
            let id = user.userType == 2 ? user.dealerCode : user.userId;
            let name = user.userType == 2 ? user.dealerName : user.userName;
            this.searchRes["userList"].push({
              id: id,
              name: name,
            });
          }
        }
      });
    return this.searchRes;
  }

  // Check Workstream Name Exists
  checkWorkstreamName(apiData) {
    let wsNameData = new FormData();
    wsNameData.append("apiKey", apiData.apiKey);
    wsNameData.append("userId", apiData.userId);
    wsNameData.append("domainId", apiData.domainId);
    wsNameData.append("countryId", apiData.countryId);
    wsNameData.append("workstreamId", apiData.workstreamId);
    wsNameData.append("title", apiData.title);
    let result;
    if (this.wsFlag) {
      this.wsFlag.unsubscribe();
      result = this.fetchWsData(wsNameData);
    } else {
      this.fetchWsData(wsNameData);
    }
    //if(!this.wsLoading) {
    return result;
    //}
  }

  fetchWsData(apiData) {
    this.wsFlag = this.wsApi
      .checkWorkstreamName(apiData)
      .subscribe((response) => {
        this.wsStatus = response.status == "Success" ? false : true;
        this.wsLoading = false;
      });
    //if(!this.wsLoading) {
    return this.wsStatus;
    //}
  }

  // Get Tags List
  getTagList(tagData) {
    const params = new HttpParams()
      .set("apiKey", tagData.apiKey)
      .set("userId", tagData.userId)
      .set("domainId", tagData.domainId)
      .set("countryId", tagData.countryId)
      .set("groupId", tagData.groupId)
      .set("searchKey", tagData.searchKey)
      .set("offset", tagData.offset)
      .set("limit", tagData.limit);
    const body = JSON.stringify(tagData);

    return this.http.post<any>(this.apiUrl.apiGetTagList(), body, {
      params: params,
    });
  }

  getLoopUpDataList(loopUpData) {
    const params = new HttpParams()
      .set("apiKey", loopUpData.apiKey)
      .set("userId", loopUpData.userId)
      .set("domainId", loopUpData.domainId)
      .set("countryId", loopUpData.countryId)
      .set("loopUpData", loopUpData.lookUpdataId)
      .set("searchKey", loopUpData.searchKey)
      .set("isActivetrue", loopUpData.isInActive)
      .set("offset", loopUpData.offset)
      .set("limit", loopUpData.limit);
    const body = JSON.stringify(loopUpData);

    return this.http.post<any>(this.apiUrl.apigetLookupTableData(), body, {
      params: params,
    });
  }

  getEscalationLoopUpDataList(loopUpData) {
    let makeVal = loopUpData.make != undefined ? loopUpData.make : '';
    const params = new HttpParams()
      .set("apiKey", loopUpData.apiKey)
      .set("userId", loopUpData.userId)
      .set("domainId", loopUpData.domainId)
      .set("countryId", loopUpData.countryId)
      .set("commonApiValue", loopUpData.commonApiValue)
      .set("searchKey", loopUpData.searchKey)
      .set("make", makeVal)      
      .set("offset", loopUpData.offset)
      .set("limit", loopUpData.limit);      

    const body = JSON.stringify(loopUpData);

    return this.http.post<any>(this.apiUrl.apigetEscalationLookupTableData(), body, {
      params: params,
    });
  }

  // Add or Save Tag
  manageTag(tagData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageTag(), tagData);
  }

  //deleteTag
  apiDeleteTag(data): Observable<any> {
    return this.http.post<any>(this.apiUrl.deleteTag(), data);
  }

  ManageLookUpdata(LookupData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageLookUpdata(), LookupData);
  }

  // Get Related Thread Lists
  getRelatedThreads(threadData) {
    const params = new HttpParams()
      .set("apiKey", threadData.apiKey)
      .set("userId", threadData.userId)
      .set("domainId", threadData.domainId)
      .set("countryId", threadData.countryId)
      .set("searchKey", threadData.searchKey)
      .set("vehicleInfo", threadData.vehicleInfo)
      .set("offset", threadData.offset)
      .set("limit", threadData.limit);
    const body = JSON.stringify(threadData);

    return this.http.post<any>(this.apiUrl.apiGetRelatedThreads(), body, {
      params: params,
    });
  }

  // Get Error Codes List
  getErrorCodes(errorData) {
    console.log(errorData)
    const params = new HttpParams()
      .set("apiKey", errorData.apiKey)
      .set("userId", errorData.userId)
      .set("domainId", errorData.domainId)
      .set("countryId", errorData.countryId)
      .set("type", errorData.type)
      .set("typeId", errorData.typeId)
      .set("searchKey", errorData.searchKey)
      .set("vehicleInfo", errorData.vehicleInfo)
      .set("offset", errorData.offset)
      .set("limit", errorData.limit);
    const body = JSON.stringify(errorData);

    return this.http.post<any>(this.apiUrl.apiGetErrorCodes(), body, {
      params: params,
    });
  }

  // Manage Error Code
  manageErrorCode(errorData) {
    return this.http.post<any>(this.apiUrl.apiManageErrorCode(), errorData);
  }

  // Manage Part Type
  managePartType(typeData) {
    return this.http.post<any>(this.apiUrl.apiManagePartType(), typeData);
  }

  // Manage Part system
  managePartSystem(systemData) {
    return this.http.post<any>(this.apiUrl.apiManagePartSystem(), systemData);
  }

  // Manage Part Assembly
  managePartAssembly(assemblyData) {
    return this.http.post<any>(
      this.apiUrl.apiManagePartAssembly(),
      assemblyData
    );
  }

  // Get Vimeo Video Thumb
  getVimeoThumb(vid) {
    return this.http.get<any>(this.apiUrl.apiGetVimeoThumb(vid));
  }

  // Get Workstream Count
  GetworkstreamswithCount(typeData) {
    return this.http.post<any>(
      this.apiUrl.apiGetworkstreamswithCount(),
      typeData
    );
  }

  // Get Product/Vehicle Banner Image
  getBannerImage(bannerData) {
    return this.http.post<any>(this.apiUrl.apiGetBanner(), bannerData);
  }

  // Check youtube link
  matchYoutubeUrl(url) {
    var p =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
      return matches[1];
    }
    return false;
  }

  // Check vimeo link
  matchVimeoUrl(url) {
    const regExp =
      /(?:https?:\/\/(?:www\.)?)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[3] : false;
  }

  // Convert File Size
  niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    //include a decimal point and a tenths-place digit if presenting
    //less than ten of KB or greater units
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + this.units[l];
  }

  // Allow only numeric
  public restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  // Get Filter Widgets
  getFilterWidgets(apiData, filterOptions, escInit = null) {
    console.log(apiData);
    apiData['platform'] = Constant.filterPlatform;
    //console.log(filterOptions)
    let cyear = parseInt(this.currYear);
    for (let y = cyear; y >= this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString(),
      });
    }
    this.filterApi.getFilterWidgets(apiData).subscribe((response) => {
      if (response.status == "Success") {
        let responseData = response.data;
        filterOptions["filterData"] = responseData;
        let filterLoading = false;
        filterOptions["filterLoading"] = filterLoading;
        let groupId = apiData.groupId;
        let access = filterOptions.page;
        let getFilteredValues;
        let defaultWsVal = "",
          wsVal,
          defaultMake = "",
          makeVal = "",
          defaultModel = "",
          modelVal = "";
        let yearVal = moment().format("Y");
        let filterActiveCount = 0;
        let filterValues: any = "";

        let landingNav = localStorage.getItem("landingNav");
        let landingFlag = landingNav != null ? true : false;
        let wsNav = localStorage.getItem("workstreamNav");
        let wsFlag = wsNav != null ? true : false;
        //wsFlag = false;
        let filter = "";
        switch (groupId) {
          case 4:
            filter = "docFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 6:
            filter = "partFilter";
            console.error("part filter---", landingFlag, filter);
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            console.log(getFilteredValues);
            break;
          case 20:
            filter = (apiData.accessPage == 'media') ? 'mediaFilter' : 'mediaUploadFilter';
            //filter = "mediaFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 2:
            filter = "threadFilter";
            let sfilter = silentItems.silentThreadFilter;
            let sfilterItem = localStorage.getItem(sfilter);
            console.log(sfilterItem, sfilter)
            landingFlag = (sfilterItem == null || sfilterItem == 'undefined' || sfilterItem == undefined) ? landingFlag : false; 
            filter = (sfilterItem == null || sfilterItem == 'undefined' || sfilterItem == undefined) ? filter : sfilter;
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            setTimeout(() => {
              localStorage.removeItem(sfilter);
            }, 500);
            console.log(filter, getFilteredValues)
            break;
          case 21:
            filter = "escalationFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 30:
            filter = "searchPageFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 31:
            switch (access) {
              case "more":
                filter = "moreAnnouncementFilter";
                break;
              case "dismiss":
                filter = "dismissedAnnouncementFilter";
                break;
              default:
                filter = "dashboardAnnouncementFilter";
                break;
            }
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            console.log(getFilteredValues);
            break;
          case 33:
            filter = "escalationPPFRFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 32:
            filter = "knowledgeArticleFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 34:
            filter = "gtsFilter";
            console.error("gts filter---", landingFlag, filter);
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            console.error("gts filter---", getFilteredValues);
            break;
          case 35:
            filter = "sibFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
          case 36:
            filter = "knowledgeBaseFilter";
            getFilteredValues = this.getFilterValues(landingFlag, filter);
            break;
        }

        let i = 0;
        for (var res of responseData) {
          let wid = parseInt(res.id);
          let widgetsFlag = parseInt(res.widgetsFlag) == 1 ? true : false;
          switch (wid) {
            case 1:
              if (widgetsFlag) {
                if (getFilteredValues != null) {
                  if (getFilteredValues.make != undefined) {
                    apiData["filterOptions"] = { make: getFilteredValues.make };
                    makeVal = getFilteredValues.make;
                    if (makeVal.length > 0) {
                      ++filterActiveCount;
                    }
                  } else {
                    apiData["filterOptions"] = { make: [] };
                  }
                } else {
                  apiData["filterOptions"] = { make: [] };
                }
              }
              break;
            case 2:
              if (widgetsFlag) {
                if (getFilteredValues != null) {
                  console.log(getFilteredValues.model);
                  if (getFilteredValues.model != undefined) {
                    apiData["filterOptions"]["model"] = getFilteredValues.model;
                    modelVal = getFilteredValues.model;
                    if (modelVal.length > 0) {
                      ++filterActiveCount;
                    }
                  } else {
                    apiData["filterOptions"]["model"] = "";
                  }
                } else {
                  apiData["filterOptions"]["model"] = "";
                }
              }
              break;
            case 3:
              if (widgetsFlag) {
                filterOptions["filterData"][i]["valueArray"] = this.years;
                let year = [];
                if (getFilteredValues != null) {
                  year =
                    getFilteredValues.year == undefined
                      ? year
                      : getFilteredValues.year;
                  if (year.length > 0) {
                    ++filterActiveCount;
                  }
                }

                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["year"] = year;
                } else {
                  apiData["filterOptions"] = { year: year };
                }
              }
              break;
            case 4:
              if (widgetsFlag) {
                let accWsId: any = 0;
                console.log(groupId);
                if (groupId == 2 || groupId == 6) {
                  accWsId = localStorage.getItem("accessWorkstreamId");
                  accWsId =
                    accWsId == "undefined" || accWsId == undefined
                      ? 0
                      : accWsId;

                  console.log(accWsId);
                  setTimeout(() => {
                    localStorage.removeItem("accessWorkstreamId");
                  }, 150);
                }
                let wsItems = [];
                let wsLen = res.valueArray.length;
                for (let ws of res.valueArray) {
                  console.log(JSON.stringify(res.valueArray));
                  localStorage.setItem('threadsPageSubTypeData', JSON.stringify(res.valueArray))
                  //wsItems.push(ws.workstreamId);
                  if (accWsId > 1) {
                    ws.defaultValue = 0;
                    if (ws.workstreamId == accWsId) {
                      wsItems = [ws.workstreamId];
                      defaultWsVal = wsItems.toString();
                      this.defaultWsVal = defaultWsVal;
                    }
                  } else {
                    /*if (ws.defaultValue == 1) {
                      wsItems = [ws.workstreamId];
                      defaultWsVal = wsItems.toString();
                      this.defaultWsVal = defaultWsVal;
                    }*/
                  }
                }

                if (wsFlag) {
                  wsItems = JSON.parse(localStorage.getItem("landing-ws"));
                  console.log(wsItems);
                  if (wsItems.length > 0) {
                    ++filterActiveCount;
                  }
                  setTimeout(() => {
                    localStorage.removeItem("landing-ws");
                    localStorage.removeItem("workstreamNav");
                  }, 50);
                } else {
                  console.log(1321564, getFilteredValues, accWsId)
                  //if (accWsId < 1 && getFilteredValues != null) {
                  if (getFilteredValues != null) {
                    console.log(24465465)
                    wsItems =
                      accWsId > 0 ||
                      getFilteredValues.workstream == undefined ||
                      getFilteredValues.workstream == "undefined"
                        ? wsItems
                        : getFilteredValues.workstream;
                    console.log(wsItems)
                    if (wsItems.length > 0) {
                      ++filterActiveCount;
                    }
                  }
                }

                wsVal = wsItems.toString();
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  console.log(14);
                  apiData["filterOptions"]["workstream"] = wsItems;
                } else {
                  console.log(24);
                  apiData["filterOptions"] = { workstream: wsItems };
                }
                console.log(wsItems);
                console.log(apiData);
              }
              break;
            case 5:
              if (widgetsFlag) {
                let tagItems = [];
                let tags = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tags"] = tags;
                  apiData["filterOptions"]["tagItems"] = tagItems;
                } else {
                  apiData["filterOptions"] = { tags: tags };
                  apiData["filterOptions"] = { tagItems: tagItems };
                }

                if (getFilteredValues != null) {
                  tags =
                    getFilteredValues.tags == undefined ||
                    getFilteredValues.tags == "undefined"
                      ? tags
                      : getFilteredValues.tags;
                  tagItems =
                    getFilteredValues.tagItems == undefined ||
                    getFilteredValues.tagItems == "undefined"
                      ? tagItems
                      : getFilteredValues.tagItems;
                  if (tags.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tags"] = tags;
                  apiData["filterOptions"]["tagItems"] = tagItems;
                } else {
                  apiData["filterOptions"] = { tags: tags };
                  apiData["filterOptions"] = { tagItems: tagItems };
                }
              }
              break;
            case 6:
              if (widgetsFlag) {
                let mediaTypes = [];
                let mediaTypeItems =
                  filterOptions["filterData"][i]["valueArray"];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["mediaTypes"] = mediaTypes;
                } else {
                  apiData["filterOptions"] = { mediaTypes: mediaTypes };
                }
                for (let m of mediaTypeItems) {
                  mediaTypes.push({
                    id: m,
                    name: m,
                  });
                }

                filterOptions["filterData"][i]["valueArray"] = mediaTypes;

                if (getFilteredValues != null) {
                  mediaTypes =
                    getFilteredValues.mediaTypes == undefined ||
                    getFilteredValues.mediaTypes == "undefined"
                      ? mediaTypes
                      : getFilteredValues.mediaTypes;
                  if (mediaTypes.length > 0) {
                    ++filterActiveCount;
                  }
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["mediaTypes"] = mediaTypes;
                  } else {
                    apiData["filterOptions"] = { mediaTypes: mediaTypes };
                  }
                } else {
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["mediaTypes"] = [];
                  } else {
                    apiData["filterOptions"] = { mediaTypes: [] };
                  }
                }
              }
              break;
            case 7:
              if (widgetsFlag) {
                let startDate = "";
                let sDate;
                console.log(getFilteredValues);
                if (getFilteredValues != null) {
                  sDate =
                    getFilteredValues.startDate == undefined ||
                    getFilteredValues.startDate == "undefined"
                      ? startDate
                      : getFilteredValues.startDate;
                } else {
                  sDate = startDate;
                }
                if (filterOptions["searchBg"]) {
                  sDate = startDate;
                }

                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["startDate"] = sDate;
                } else {
                  apiData["filterOptions"] = { startDate: sDate };
                }
                console.log(sDate, filterOptions, apiData)
                if(sDate != '') {
                  ++filterActiveCount;
                }
                filterOptions["filterData"][i]["value"] = sDate;
              }
              break;
            case 8:
              if (widgetsFlag) {
                let endDate = "";
                let eDate;
                if (getFilteredValues != null) {
                  eDate =
                    getFilteredValues.endDate == undefined ||
                    getFilteredValues.endDate == "undefined"
                      ? endDate
                      : getFilteredValues.endDate;
                } else {
                  eDate = endDate;
                }
                if (filterOptions["searchBg"]) {
                  eDate = endDate;
                }

                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["endDate"] = eDate;
                } else {
                  apiData["filterOptions"] = { endDate: eDate };
                }

                if(eDate != '') {
                  ++filterActiveCount;
                }
                filterOptions["filterData"][i]["value"] = eDate;
              }
              break;
            case 11:
              if (widgetsFlag) {
                let territories = [];
                let territoryItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["territories"] = territories;
                  apiData["filterOptions"]["territoryItems"] = territoryItems;
                } else {
                  apiData["filterOptions"] = { territories: territories };
                  apiData["filterOptions"] = { territoryItems: territoryItems };
                }
                if (getFilteredValues != null) {
                  territories =
                    getFilteredValues.territories == undefined ||
                    getFilteredValues.territories == "undefined"
                      ? territories
                      : getFilteredValues.territories;
                  territoryItems =
                    getFilteredValues.territoryItems == undefined ||
                    getFilteredValues.territoryItems == "undefined"
                      ? territories
                      : getFilteredValues.territoryItems;
                }

                if (filterOptions["searchBg"]) {
                  territories = [];
                  territoryItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["territories"] = territories;
                  apiData["filterOptions"]["territoryItems"] = territoryItems;
                } else {
                  apiData["filterOptions"] = { territories: territories };
                  apiData["filterOptions"] = { territoryItems: territoryItems };
                }

                if (territories.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 12:
              if (widgetsFlag) {
                let locations = [];
                let locationItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["locations"] = locations;
                  apiData["filterOptions"]["locationItems"] = locationItems;
                } else {
                  apiData["filterOptions"] = { locations: locations };
                  apiData["filterOptions"] = { locationItems: locationItems };
                }
                if (getFilteredValues != null) {
                  locations =
                    getFilteredValues.locations == undefined ||
                    getFilteredValues.locations == "undefined"
                      ? locations
                      : getFilteredValues.locations;
                  locationItems =
                    getFilteredValues.locationItems == undefined ||
                    getFilteredValues.locationItems == "undefined"
                      ? locationItems
                      : getFilteredValues.locationItems;
                }

                if (filterOptions["searchBg"]) {
                  locations = [];
                  locationItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["locations"] = locations;
                  apiData["filterOptions"]["locationItems"] = locationItems;
                } else {
                  apiData["filterOptions"] = { locations: locations };
                  apiData["filterOptions"] = { locationItems: locationItems };
                }

                if (locations.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 13:
              if (widgetsFlag) {
                let customers = [];
                let customerItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["customers"] = customers;
                  apiData["filterOptions"]["customerItems"] = customerItems;
                } else {
                  apiData["filterOptions"] = { customers: customers };
                  apiData["filterOptions"] = { customerItems: customerItems };
                }
                if (getFilteredValues != null) {
                  customers =
                    getFilteredValues.customers == undefined ||
                    getFilteredValues.customers == "undefined"
                      ? customers
                      : getFilteredValues.customers;
                  customerItems =
                    getFilteredValues.customerItems == undefined ||
                    getFilteredValues.customerItems == "undefined"
                      ? customerItems
                      : getFilteredValues.customerItems;
                }
                if (filterOptions["searchBg"]) {
                  customers = [];
                  customerItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["customers"] = customers;
                  apiData["filterOptions"]["customerItems"] = customerItems;
                } else {
                  apiData["filterOptions"] = { customers: customers };
                  apiData["filterOptions"] = { customerItems: customerItems };
                }

                if (customers.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 14:
              if (widgetsFlag) {
                let technicians = [];
                let technicianItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["technicians"] = technicians;
                  apiData["filterOptions"]["technicianItems"] = technicianItems;
                } else {
                  apiData["filterOptions"] = { technicians: technicians };
                  apiData["filterOptions"] = {
                    technicianItems: technicianItems,
                  };
                }
                if (escInit == 1) {
                  let tech = filterOptions["filterData"][i]["selectedUsers"];
                  for (let t of tech) {
                    technicians.push(t.userId);
                    technicianItems.push(t.firstLastName);
                  }
                }
                //console.log(technicians)
                //console.log(technicianItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let techDataId = [];
                  let techDataItem = [];
                  if (escInit < 1) {
                    technicians =
                      getFilteredValues.technicians == undefined ||
                      getFilteredValues.technicians == "undefined"
                        ? technicians
                        : getFilteredValues.technicians;
                    technicianItems =
                      getFilteredValues.technicianItems == undefined ||
                      getFilteredValues.technicianItems == "undefined"
                        ? technicianItems
                        : getFilteredValues.technicianItems;
                  } else {
                    techDataId =
                      getFilteredValues.csm == undefined ||
                      getFilteredValues.csm == "undefined"
                        ? techDataId
                        : getFilteredValues.technicians;
                    techDataItem =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.technicianItems == "undefined"
                        ? techDataItem
                        : getFilteredValues.technicianItems;
                    technicians =
                      techDataId.length == 0 ? technicians : techDataId;
                    technicianItems =
                      techDataId.length == 0 ? technicianItems : techDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  technicians = [];
                  technicianItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["technicians"] = technicians;
                  apiData["filterOptions"]["technicianItems"] = technicianItems;
                } else {
                  apiData["filterOptions"] = { technicians: technicians };
                  apiData["filterOptions"] = {
                    technicianItems: technicianItems,
                  };
                }

                if (technicians.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 15:
              if (widgetsFlag) {
                let csm = [];
                let csmItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["csm"] = csm;
                  apiData["filterOptions"]["csmItems"] = csmItems;
                } else {
                  apiData["filterOptions"] = { csm: csm };
                  apiData["filterOptions"] = { csmItems: csmItems };
                }

                if (escInit == 1) {
                  let cmsUsers =
                    filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of cmsUsers) {
                    csm.push(c.userId);
                    csmItems.push(c.firstLastName);
                  }
                }
                //console.log(csm)
                //console.log(csmItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let csmDataId = [];
                  let csmDataItem = [];
                  if (escInit < 1) {
                    csm =
                      getFilteredValues.csm == undefined ||
                      getFilteredValues.csm == "undefined"
                        ? csmDataId
                        : getFilteredValues.csm;
                    csmItems =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.csmItems == "undefined"
                        ? csmDataItem
                        : getFilteredValues.csmItems;
                  } else {
                    csmDataId =
                      getFilteredValues.csm == undefined ||
                      getFilteredValues.csm == "undefined"
                        ? csmDataId
                        : getFilteredValues.csm;
                    csmDataItem =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.csmItems == "undefined"
                        ? csmDataItem
                        : getFilteredValues.csmItems;
                    csm = csmDataId.length == 0 ? csm : csmDataId;
                    csmItems = csmDataId.length == 0 ? csmItems : csmDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  csm = [];
                  csmItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["csm"] = csm;
                  apiData["filterOptions"]["csmItems"] = csmItems;
                } else {
                  apiData["filterOptions"] = { csm: csm };
                  apiData["filterOptions"] = { csmItems: csmItems };
                }

                if (csm.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 16:
              if (widgetsFlag) {
                let status = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["status"] = status;
                } else {
                  apiData["filterOptions"] = { status: status };
                }
                if (getFilteredValues != null) {
                  status =
                    getFilteredValues.status == undefined ||
                    getFilteredValues.status == "undefined"
                      ? status
                      : getFilteredValues.status;
                }

                //console.log(status)

                if (filterOptions["searchBg"]) {
                  status = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["status"] = status;
                } else {
                  apiData["filterOptions"] = { status: status };
                }

                if (status.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;

            case 17:
              if (widgetsFlag) {
                let otherUsers = [];
                let otherUserItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["otherUsers"] = otherUsers;
                  apiData["filterOptions"]["otherUserItems"] = otherUserItems;
                } else {
                  apiData["filterOptions"] = { otherUsers: otherUsers };
                  apiData["filterOptions"] = { otherUserItems: otherUserItems };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    otherUsers.push(c.userId);
                    otherUserItems.push(c.firstLastName);
                  }
                }

                //console.log(otherUsers)
                //console.log(otherUserItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let otherUserDataId = [];
                  let otherUserDataItem = [];
                  if (escInit < 1) {
                    otherUsers =
                      getFilteredValues.otherUsers == undefined ||
                      getFilteredValues.otherUsers == "undefined"
                        ? otherUserDataId
                        : getFilteredValues.otherUsers;
                    otherUserItems =
                      getFilteredValues.otherUserItems == undefined ||
                      getFilteredValues.otherUserItems == "undefined"
                        ? otherUserDataItem
                        : getFilteredValues.otherUserItems;
                  } else {
                    otherUserDataId =
                      getFilteredValues.otherUsers == undefined ||
                      getFilteredValues.otherUsers == "undefined"
                        ? otherUserDataId
                        : getFilteredValues.otherUsers;
                    otherUserDataItem =
                      getFilteredValues.csmItems == undefined ||
                      getFilteredValues.csmItems == "undefined"
                        ? otherUserDataItem
                        : getFilteredValues.otherUserItems;
                    otherUsers =
                      otherUserDataId.length == 0
                        ? otherUsers
                        : otherUserDataId;
                    otherUserItems =
                      otherUserDataId.length == 0
                        ? otherUserItems
                        : otherUserDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  otherUsers = [];
                  otherUserItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["otherUsers"] = otherUsers;
                  apiData["filterOptions"]["otherUserItems"] = otherUserItems;
                } else {
                  apiData["filterOptions"] = { otherUsers: otherUsers };
                  apiData["filterOptions"] = { otherUserItems: otherUserItems };
                }

                if (otherUsers.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 18:
              if (widgetsFlag) {
                let threadStatus = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["threadStatus"] = threadStatus;
                } else {
                  apiData["filterOptions"] = { threadStatus: threadStatus };
                }
                if (getFilteredValues != null) {
                  threadStatus =
                    getFilteredValues.threadStatus == undefined ||
                    getFilteredValues.threadStatus == "undefined"
                      ? threadStatus
                      : getFilteredValues.threadStatus;
                }

                //console.log(status)

                if (filterOptions["searchBg"]) {
                  threadStatus = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["threadStatus"] = threadStatus;
                } else {
                  apiData["filterOptions"] = { threadStatus: threadStatus };
                }

                if (threadStatus.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 19:
              if (widgetsFlag) {
                let errorCodes = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["errorCode"] = errorCodes;
                } else {
                  apiData["filterOptions"] = { errorCode: errorCodes };
                }
                if (getFilteredValues != null) {
                  errorCodes =
                    getFilteredValues.errorCode == undefined ||
                    getFilteredValues.errorCode == "undefined"
                      ? errorCodes
                      : getFilteredValues.errorCode;
                }

                //console.log(status)

                if (filterOptions["searchBg"]) {
                  errorCodes = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["errorCode"] = errorCodes;
                } else {
                  apiData["filterOptions"] = { errorCode: errorCodes };
                }

                if (errorCodes.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 20:
              if (widgetsFlag) {
                let dealerNames = [];
                let dealerNameItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerNames"] = dealerNames;
                  apiData["filterOptions"]["dealerNameItems"] = dealerNameItems;
                } else {
                  apiData["filterOptions"] = { dealerNames: dealerNames };
                  apiData["filterOptions"] = {
                    dealerNameItems: dealerNameItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    dealerNames.push(c.userId);
                    dealerNameItems.push(c.firstLastName);
                  }
                }

                //console.log(dealerNames)
                //console.log(dealerNameItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let dealerNameDataId = [];
                  let dealerNameDataItem = [];
                  if (escInit < 1) {
                    dealerNames =
                      getFilteredValues.dealerNames == undefined ||
                      getFilteredValues.dealerNames == "undefined"
                        ? dealerNameDataId
                        : getFilteredValues.dealerNames;
                    dealerNameItems =
                      getFilteredValues.dealerNameItems == undefined ||
                      getFilteredValues.dealerNameItems == "undefined"
                        ? dealerNameDataItem
                        : getFilteredValues.dealerNameItems;
                  } else {
                    dealerNameDataId =
                      getFilteredValues.dealerNames == undefined ||
                      getFilteredValues.dealerNames == "undefined"
                        ? dealerNameDataId
                        : getFilteredValues.dealerNames;
                    dealerNameDataItem =
                      getFilteredValues.dealerNameItems == undefined ||
                      getFilteredValues.dealerNameItems == "undefined"
                        ? dealerNameDataItem
                        : getFilteredValues.dealerNameItems;
                    dealerNames =
                      dealerNameDataId.length == 0
                        ? dealerNames
                        : dealerNameDataId;
                    dealerNameItems =
                      dealerNameDataId.length == 0
                        ? dealerNameItems
                        : dealerNameDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  dealerNames = [];
                  dealerNameItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerNames"] = dealerNames;
                  apiData["filterOptions"]["dealerNameItems"] = dealerNameItems;
                } else {
                  apiData["filterOptions"] = { dealerNames: dealerNames };
                  apiData["filterOptions"] = {
                    dealerNameItems: dealerNameItems,
                  };
                }

                if (dealerNames.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 21:
              if (widgetsFlag) {
                let dealerCities = [];
                let dealerCityItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerCities"] = dealerCities;
                  apiData["filterOptions"]["dealerCityItems"] = dealerCityItems;
                } else {
                  apiData["filterOptions"] = { dealerCities: dealerCities };
                  apiData["filterOptions"] = {
                    dealerCityItems: dealerCityItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    dealerCities.push(c.userId);
                    dealerCityItems.push(c.firstLastName);
                  }
                }

                //console.log(dealerCities)
                //console.log(dealerCityItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let dealerCitiesDataId = [];
                  let dealerCitiesDataItem = [];
                  if (escInit < 1) {
                    dealerCities =
                      getFilteredValues.dealerCities == undefined ||
                      getFilteredValues.dealerCities == "undefined"
                        ? dealerCitiesDataId
                        : getFilteredValues.dealerCities;
                    dealerCityItems =
                      getFilteredValues.dealerCityItems == undefined ||
                      getFilteredValues.dealerCityItems == "undefined"
                        ? dealerCitiesDataItem
                        : getFilteredValues.dealerCityItems;
                  } else {
                    dealerCitiesDataId =
                      getFilteredValues.dealerCities == undefined ||
                      getFilteredValues.dealerCities == "undefined"
                        ? dealerCitiesDataId
                        : getFilteredValues.dealerCities;
                    dealerCitiesDataItem =
                      getFilteredValues.dealerCityItems == undefined ||
                      getFilteredValues.dealerCityItems == "undefined"
                        ? dealerCitiesDataItem
                        : getFilteredValues.dealerCityItems;
                    dealerCities =
                      dealerCitiesDataId.length == 0
                        ? dealerCities
                        : dealerCitiesDataId;
                    dealerCityItems =
                      dealerCitiesDataId.length == 0
                        ? dealerCityItems
                        : dealerCitiesDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  dealerCities = [];
                  dealerCityItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerCities"] = dealerCities;
                  apiData["filterOptions"]["dealerCityItems"] = dealerCityItems;
                } else {
                  apiData["filterOptions"] = { dealerCities: dealerCities };
                  apiData["filterOptions"] = {
                    dealerCityItems: dealerCityItems,
                  };
                }

                if (dealerCities.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 22:
              if (widgetsFlag) {
                let dealerArea = [];
                let dealerAreaItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerArea"] = dealerArea;
                  apiData["filterOptions"]["dealerAreaItems"] = dealerAreaItems;
                } else {
                  apiData["filterOptions"] = { dealerArea: dealerArea };
                  apiData["filterOptions"] = {
                    dealerAreaItems: dealerAreaItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    dealerArea.push(c.userId);
                    dealerAreaItems.push(c.firstLastName);
                  }
                }

                //console.log(dealerArea)
                //console.log(dealerAreaItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let dealerAreaDataId = [];
                  let dealerAreaDataItem = [];
                  if (escInit < 1) {
                    dealerArea =
                      getFilteredValues.dealerArea == undefined ||
                      getFilteredValues.dealerArea == "undefined"
                        ? dealerAreaDataId
                        : getFilteredValues.dealerArea;
                    dealerAreaItems =
                      getFilteredValues.dealerAreaItems == undefined ||
                      getFilteredValues.dealerAreaItems == "undefined"
                        ? dealerAreaDataItem
                        : getFilteredValues.dealerAreaItems;
                  } else {
                    dealerAreaDataId =
                      getFilteredValues.dealerArea == undefined ||
                      getFilteredValues.dealerArea == "undefined"
                        ? dealerAreaDataId
                        : getFilteredValues.dealerArea;
                    dealerAreaDataItem =
                      getFilteredValues.dealerAreaItems == undefined ||
                      getFilteredValues.dealerAreaItems == "undefined"
                        ? dealerAreaDataItem
                        : getFilteredValues.dealerAreaItems;
                    dealerArea =
                      dealerAreaDataId.length == 0
                        ? dealerArea
                        : dealerAreaDataId;
                    dealerAreaItems =
                      dealerAreaDataId.length == 0
                        ? dealerAreaItems
                        : dealerAreaDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  dealerArea = [];
                  dealerAreaItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["dealerArea"] = dealerArea;
                  apiData["filterOptions"]["dealerAreaItems"] = dealerAreaItems;
                } else {
                  apiData["filterOptions"] = { dealerArea: dealerArea };
                  apiData["filterOptions"] = {
                    dealerAreaItems: dealerAreaItems,
                  };
                }

                if (dealerArea.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 23:
              if (widgetsFlag) {
                let productCoor = [];
                let productCoorItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["productCoor"] = productCoor;
                  apiData["filterOptions"]["productCoorItems"] =
                    productCoorItems;
                } else {
                  apiData["filterOptions"] = { productCoor: productCoor };
                  apiData["filterOptions"] = {
                    productCoorItems: productCoorItems,
                  };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    productCoor.push(c.userId);
                    productCoorItems.push(c.firstLastName);
                  }
                }

                //console.log(productCoor)
                //console.log(productCoorItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let productCoorDataId = [];
                  let productCoorDataItem = [];
                  if (escInit < 1) {
                    productCoor =
                      getFilteredValues.productCoor == undefined ||
                      getFilteredValues.productCoor == "undefined"
                        ? productCoorDataId
                        : getFilteredValues.productCoor;
                    productCoorItems =
                      getFilteredValues.productCoorItems == undefined ||
                      getFilteredValues.productCoorItems == "undefined"
                        ? productCoorDataItem
                        : getFilteredValues.productCoorItems;
                  } else {
                    productCoorDataId =
                      getFilteredValues.productCoor == undefined ||
                      getFilteredValues.productCoor == "undefined"
                        ? productCoorDataId
                        : getFilteredValues.productCoor;
                    productCoorDataItem =
                      getFilteredValues.productCoorItems == undefined ||
                      getFilteredValues.productCoorItems == "undefined"
                        ? productCoorDataItem
                        : getFilteredValues.productCoorItems;
                    productCoor =
                      productCoorDataId.length == 0
                        ? productCoor
                        : productCoorDataId;
                    productCoorItems =
                      productCoorDataId.length == 0
                        ? productCoorItems
                        : productCoorDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  productCoor = [];
                  productCoorItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["productCoor"] = productCoor;
                  apiData["filterOptions"]["productCoorItems"] =
                    productCoorItems;
                } else {
                  apiData["filterOptions"] = { productCoor: productCoor };
                  apiData["filterOptions"] = {
                    productCoorItems: productCoorItems,
                  };
                }

                if (productCoor.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 24:
              if (widgetsFlag) {
                let tmanagers = [];
                let tmanagersItems = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tmanagers"] = tmanagers;
                  apiData["filterOptions"]["tmanagersItems"] = tmanagersItems;
                } else {
                  apiData["filterOptions"] = { tmanagers: tmanagers };
                  apiData["filterOptions"] = { tmanagersItems: tmanagersItems };
                }

                if (escInit == 1) {
                  let otUsers = filterOptions["filterData"][i]["selectedUsers"];
                  for (let c of otUsers) {
                    tmanagers.push(c.userId);
                    tmanagersItems.push(c.firstLastName);
                  }
                }

                //console.log(tmanagers)
                //console.log(tmanagersItems)

                if (
                  getFilteredValues != null &&
                  !filterOptions["historyFlag"]
                ) {
                  let tmanagersDataId = [];
                  let tmanagersDataItem = [];
                  if (escInit < 1) {
                    tmanagers =
                      getFilteredValues.tmanagers == undefined ||
                      getFilteredValues.tmanagers == "undefined"
                        ? tmanagersDataId
                        : getFilteredValues.tmanagers;
                    tmanagersItems =
                      getFilteredValues.tmanagersItems == undefined ||
                      getFilteredValues.tmanagersItems == "undefined"
                        ? tmanagersDataItem
                        : getFilteredValues.tmanagersItems;
                  } else {
                    tmanagersDataId =
                      getFilteredValues.tmanagers == undefined ||
                      getFilteredValues.tmanagers == "undefined"
                        ? tmanagersDataId
                        : getFilteredValues.tmanagers;
                    tmanagersDataItem =
                      getFilteredValues.tmanagersItems == undefined ||
                      getFilteredValues.tmanagersItems == "undefined"
                        ? tmanagersDataItem
                        : getFilteredValues.tmanagersItems;
                    tmanagers =
                      tmanagersDataId.length == 0 ? tmanagers : tmanagersDataId;
                    tmanagersItems =
                      tmanagersDataId.length == 0
                        ? tmanagersItems
                        : tmanagersDataItem;
                  }
                }

                if (filterOptions["searchBg"]) {
                  tmanagers = [];
                  tmanagersItems = [];
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["tmanagers"] = tmanagers;
                  apiData["filterOptions"]["tmanagersItems"] = tmanagersItems;
                } else {
                  apiData["filterOptions"] = { tmanagers: tmanagers };
                  apiData["filterOptions"] = { tmanagersItems: tmanagersItems };
                }

                if (tmanagers.length > 0) {
                  ++filterActiveCount;
                }
              }
              break;
            case 25:                
                break;
            case 26:
              if(groupId == '36'){
                if (widgetsFlag) {
                  let probCatgItems = [];
                  let probCatg = [];
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["probCatg"] = probCatg;
                    apiData["filterOptions"]["probCatgItems"] = probCatgItems;
                  } else {
                    apiData["filterOptions"] = { probCatg: probCatg };
                    apiData["filterOptions"] = { probCatgItems: probCatgItems };
                  }
  
                  if (getFilteredValues != null) {
                    probCatg =
                      getFilteredValues.probCatg == undefined ||
                      getFilteredValues.probCatg == "undefined"
                        ? probCatg
                        : getFilteredValues.probCatg;
                    probCatgItems =
                      getFilteredValues.probCatgItems == undefined ||
                      getFilteredValues.probCatgItems == "undefined"
                        ? probCatgItems
                        : getFilteredValues.probCatgItems;
                    if (probCatg.length > 0) {
                      ++filterActiveCount;
                    }
                  }
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["probCatg"] = probCatg;
                    apiData["filterOptions"]["probCatgItems"] = probCatgItems;
                  } else {
                    apiData["filterOptions"] = { probCatg: probCatg };
                    apiData["filterOptions"] = { probCatgItems: probCatgItems };
                  }
                }
              }
              else{ 
                if (widgetsFlag) {
                  let complaintCategoryItems = [];
                  let complaintCategory = [];
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["complaintCategory"] = complaintCategory;
                    apiData["filterOptions"]["complaintCategoryItems"] = complaintCategoryItems;
                  } else {
                    apiData["filterOptions"] = { complaintCategory: complaintCategory };
                    apiData["filterOptions"] = { complaintCategoryItems: complaintCategoryItems };
                  }
  
                  if (getFilteredValues != null) {
                    complaintCategory =
                      getFilteredValues.complaintCategory == undefined ||
                      getFilteredValues.complaintCategory == "undefined"
                        ? complaintCategory
                        : getFilteredValues.complaintCategory;
                        complaintCategoryItems =
                      getFilteredValues.complaintCategoryItems == undefined ||
                      getFilteredValues.complaintCategoryItems == "undefined"
                        ? complaintCategoryItems
                        : getFilteredValues.complaintCategoryItems;
                    if (complaintCategory.length > 0) {
                      ++filterActiveCount;
                    }
                  }
                  if (
                    apiData["filterOptions"] != undefined &&
                    Object.keys(apiData["filterOptions"]).length > 0
                  ) {
                    apiData["filterOptions"]["complaintCategory"] = complaintCategory;
                    apiData["filterOptions"]["complaintCategoryItems"] = complaintCategoryItems;
                  } else {
                    apiData["filterOptions"] = { complaintCategory: complaintCategory };
                    apiData["filterOptions"] = { complaintCategoryItems: complaintCategoryItems };
                  }
                }
              }
              break;
            case 27:
              if (widgetsFlag) {
                let symtomItems = [];
                let symtoms = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["symtoms"] = symtoms;
                  apiData["filterOptions"]["symtomItems"] = symtomItems;
                } else {
                  apiData["filterOptions"] = { symtoms: symtoms };
                  apiData["filterOptions"] = { symtomItems: symtomItems };
                }

                if (getFilteredValues != null) {
                  symtoms =
                    getFilteredValues.symtoms == undefined ||
                    getFilteredValues.symtoms == "undefined"
                      ? symtoms
                      : getFilteredValues.symtoms;
                      symtomItems =
                    getFilteredValues.symtomItems == undefined ||
                    getFilteredValues.symtomItems == "undefined"
                      ? symtomItems
                      : getFilteredValues.symtomItems;
                  if (symtoms.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["symtoms"] = symtoms;
                  apiData["filterOptions"]["symtomItems"] = symtomItems;
                } else {
                  apiData["filterOptions"] = { symtoms: symtoms };
                  apiData["filterOptions"] = { symtomItems: symtomItems };
                }
              }
              break;
            case 28:
              if (widgetsFlag) {
                let subProductGroupItems = [];
                let subProductGroup = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["subProductGroup"] = subProductGroup;
                  apiData["filterOptions"]["subProductGroupItems"] = subProductGroupItems;
                } else {
                  apiData["filterOptions"] = { subProductGroup: subProductGroup };
                  apiData["filterOptions"] = { subProductGroupItems: subProductGroupItems };
                }

                if (getFilteredValues != null) {
                  subProductGroup =
                    getFilteredValues.subProductGroup == undefined ||
                    getFilteredValues.subProductGroup == "undefined"
                      ? subProductGroup
                      : getFilteredValues.subProductGroup;
                      subProductGroupItems =
                    getFilteredValues.subProductGroupItems == undefined ||
                    getFilteredValues.subProductGroupItems == "undefined"
                      ? subProductGroupItems
                      : getFilteredValues.subProductGroupItems;
                  if (subProductGroup.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["subProductGroup"] = subProductGroup;
                  apiData["filterOptions"]["subProductGroupItems"] = subProductGroupItems;
                } else {
                  apiData["filterOptions"] = { subProductGroup: subProductGroup };
                  apiData["filterOptions"] = { subProductGroupItems: subProductGroupItems };
                }
              }
              break;
            case 29:
              if (widgetsFlag) {
                let languageItems = [];
                let language = [];
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["language"] = language;
                  apiData["filterOptions"]["languageItems"] = languageItems;
                } else {
                  apiData["filterOptions"] = { language: language };
                  apiData["filterOptions"] = { languageItems: languageItems };
                }

                if (getFilteredValues != null) {
                  language =
                    getFilteredValues.language == undefined ||
                    getFilteredValues.language == "undefined"
                      ? language
                      : getFilteredValues.language;
                      languageItems =
                    getFilteredValues.languageItems == undefined ||
                    getFilteredValues.languageItems == "undefined"
                      ? languageItems
                      : getFilteredValues.languageItems;
                  if (language.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (
                  apiData["filterOptions"] != undefined &&
                  Object.keys(apiData["filterOptions"]).length > 0
                ) {
                  apiData["filterOptions"]["language"] = language;
                  apiData["filterOptions"]["languageItems"] = languageItems;
                } else {
                  apiData["filterOptions"] = { language: language };
                  apiData["filterOptions"] = { languageItems: languageItems };
                }
              }
              break;
            case 30:
              if (widgetsFlag) {
                let partTypeItems = [];
                let partType = [];
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partType"] = partType;
                  apiData["filterOptions"]["partTypeItems"] = partTypeItems;
                } else {
                  apiData["filterOptions"] = { partType: partType };
                  apiData["filterOptions"] = { partTypeItems: partTypeItems };
                }

                if (getFilteredValues != null) {
                  partType = getFilteredValues.partType == undefined || getFilteredValues.partType == "undefined" ? partType : getFilteredValues.partType;
                  partTypeItems = getFilteredValues.partTypeItems == undefined || getFilteredValues.partTypeItems == "undefined" ? partTypeItems : getFilteredValues.partTypeItems;
                  if (partType.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partType"] = partType;
                  apiData["filterOptions"]["partTypeItems"] = partTypeItems;
                } else {
                  apiData["filterOptions"] = { partType: partType };
                  apiData["filterOptions"] = { partTypeItems: partTypeItems };
                }
              }
              break;
            case 31:
              if (widgetsFlag) {
                let partAssemblyItems = [];
                let partAssembly = [];
                if ( apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partAssembly"] = partAssembly;
                  apiData["filterOptions"]["partAssemblyItems"] = partAssemblyItems;
                } else {
                  apiData["filterOptions"] = { partAssembly: partAssembly };
                  apiData["filterOptions"] = { partAssemblyItems: partAssemblyItems };
                }

                if (getFilteredValues != null) {
                  partAssembly = getFilteredValues.partAssembly == undefined || getFilteredValues.partAssembly == "undefined" ? partAssembly : getFilteredValues.partAssembly;
                  partAssemblyItems = getFilteredValues.partAssemblyItems == undefined || getFilteredValues.partAssemblyItems == "undefined" ? partAssemblyItems : getFilteredValues.partAssemblytems;
                  if (partAssembly.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partAssembly"] = partAssembly;
                  apiData["filterOptions"]["partAssemblyItems"] = partAssemblyItems;
                } else {
                  apiData["filterOptions"] = { partAssembly: partAssembly };
                  apiData["filterOptions"] = { partAssemblyItems: partAssemblyItems };
                }
              }
              break;
            case 32:
              if (widgetsFlag) {
                let partSystemItems = [];
                let partSystem = [];
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partSystem"] = partSystem;
                  apiData["filterOptions"]["partSystemItems"] = partSystemItems;
                } else {
                  apiData["filterOptions"] = { partSystem: partSystem };
                  apiData["filterOptions"] = { partSystemItems: partSystemItems };
                }

                if (getFilteredValues != null) {
                  partSystem = getFilteredValues.partSystem == undefined || getFilteredValues.partSystem == "undefined" ? partSystem : getFilteredValues.partSystem;
                  partSystemItems = getFilteredValues.partSystemItems == undefined || getFilteredValues.partSystemItems == "undefined" ? partSystemItems : getFilteredValues.partSystemItems;
                  if (partSystem.length > 0) {
                    ++filterActiveCount;
                  }
                }
                if (apiData["filterOptions"] != undefined && Object.keys(apiData["filterOptions"]).length > 0) {
                  apiData["filterOptions"]["partSystem"] = partSystem;
                  apiData["filterOptions"]["partSystemItems"] = partSystemItems;
                } else {
                  apiData["filterOptions"] = { partSystem: partSystem };
                  apiData["filterOptions"] = { partSystemItems: partSystemItems };
                }
              }
              break;
          }
          i++;
        }

        //console.log(apiData)

        if (filterActiveCount == 0) {
          filterOptions["filterActive"] = false;
        }

        //console.log(apiData)
        let flag: any = true;
        let filterData = {
          filterOptions: filterOptions,
          apiData: apiData,
          filterActiveCount: filterActiveCount,
        };
        localStorage.removeItem("landingNav");
        localStorage.setItem("filterWidget", flag);
        localStorage.setItem("filterData", JSON.stringify(filterData));
      }
    });
  }

  // Setup Filter Active Data
  setupFilterActiveData(filterOptions, filterData, filterActiveCount) {
    if (filterData.make != "undefined" && filterData.make != undefined) {
      if (filterData.make.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.model != "" && filterData.model != "undefined" && filterData.model != undefined) {
      if (filterData.model.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.year != "undefined" && filterData.year != undefined) {
      if (filterData.year.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.workstream != "undefined" && filterData.workstream != undefined) {
      if (filterData.workstream.length == 1 && filterData.workstream.length != this.defaultWsVal) {
        ++filterActiveCount;
      } else if (filterData.workstream.length > 1) {
        ++filterActiveCount;
      }
    }

    if (filterData.tags != "undefined" && filterData.tags != undefined) {
      if (filterData.tags.length > 0) {
        ++filterActiveCount;
      }
    }

    if (
      filterData.mediaTypes != "undefined" &&
      filterData.mediaTypes != undefined
    ) {
      if (filterData.mediaTypes.length > 0) {
        ++filterActiveCount;
      }
    }

    if (
      filterData.startDate != "undefined" &&
      filterData.startDate != undefined
    ) {
      if (filterData.startDate != "") {
        for (let f of filterOptions["filterData"]) {
          if (f.id == 7) {
            f.value = filterData.startDate;
          }
        }
        ++filterActiveCount;
      }
    }

    if (filterData.endDate != "undefined" && filterData.endDate != undefined) {
      if (filterData.endDate != "") {
        for (let f of filterOptions["filterData"]) {
          if (f.id == 8) {
            f.value = filterData.endDate;
          }
        }
        ++filterActiveCount;
      }
    }

    if (filterData.territories != "undefined" && filterData.territories != undefined) {
      if (filterData.territories.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.locations != "undefined" && filterData.locations != undefined) {
      if (filterData.locations.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.customers != "undefined" && filterData.customers != undefined) {
      if (filterData.customers.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.technicians != "undefined" && filterData.technicians != undefined) {
      if (filterData.technicians.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.csm != "undefined" && filterData.csm != undefined) {
      if (filterData.csm.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.status != "undefined" && filterData.status != undefined) {
      if (filterData.status.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.threadStatus != "undefined" && filterData.threadStatus != undefined) {
      if (filterData.threadStatus.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.errorCode != "undefined" && filterData.errorCode != undefined) {
      if (filterData.errorCode.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.otherUsers != "undefined" && filterData.otherUsers != undefined) {
      if (filterData.otherUsers.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.dealerNames != "undefined" && filterData.dealerNames != undefined) {
      if (filterData.dealerNames.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.dealerCities != "undefined" && filterData.dealerCities != undefined) {
      if (filterData.dealerCities.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.dealerArea != "undefined" && filterData.dealerArea != undefined) {
      if (filterData.dealerArea.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.productCoor != "undefined" && filterData.productCoor != undefined) {
      if (filterData.productCoor.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.tmanagers != "undefined" && filterData.tmanagers != undefined) {
      if (filterData.tmanagers.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.probCatg != "undefined" && filterData.probCatg != undefined) {
      if (filterData.probCatg.length > 0) {
        ++filterActiveCount;
      }
    }

    if (filterData.complaintCategory != "undefined" && filterData.complaintCategory != undefined) {
      if (filterData.complaintCategory.length > 0) {
        ++filterActiveCount;
      }
    }
    
    if (filterData.symtoms != "undefined" && filterData.symtoms != undefined) {
      if (filterData.symtoms.length > 0) {
        ++filterActiveCount;
      }
    }
    
    if (filterData.language != "undefined" && filterData.language != undefined) {
      if (filterData.language.length > 0) {
        ++filterActiveCount;
      }
    }   
    
    if (filterData.subProductGroup != "undefined" && filterData.subProductGroup != undefined) {
      if (filterData.subProductGroup.length > 0) {
        ++filterActiveCount;
      }
    }
    
    if (filterData.partType != "undefined" && filterData.partType != undefined) {
      if (filterData.partType.length > 0) {
        ++filterActiveCount;
      }
    }
    
    if (filterData.partAssembly != "undefined" && filterData.partAssembly != undefined) {
      if (filterData.partAssembly.length > 0) {
        ++filterActiveCount;
      }
    }
    
    if (filterData.partSystem != "undefined" && filterData.partSystem != undefined) {
      if (filterData.partSystem.length > 0) {
        ++filterActiveCount;
      }
    }
    return filterActiveCount;
  }

  // Get Site Logo
  /*getSiteLogo(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("link", data.link);
    const body = JSON.stringify(data);
    return this.http.post<any>(this.apiUrl.apiGetSiteLogo(), body, {
      params: params,
    });
  }*/
  
    // Thread Creation API
  getSiteLogo(data) {
    return this.http.post<any>(this.apiUrl.apiGetSiteLogo(), data);
  }
  
  GetGroupAndDirectMessagewithCount(typeData) {
    return this.http.post<any>(
      this.apiUrl.apiGetGroupAndDirectMessagewithCount(),
      typeData
    );
  }

  apiCall(url, data) {
    console.log(url, data);
    return this.http.post<any>(url, data);
  }

  // Create Document
  createDocument(docData) {
    return this.http.post<any>(this.apiUrl.apiCreateDoc(), docData);
  }

  unique(arr, keyProps) {
    const kvArray = arr.map((entry) => {
      const key = keyProps.map((k) => entry[k]).join("|");
      return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
  }

  // Get Filter Values
  getFilterValues(landingFlag, filter) {
    console.log
    let getFilteredValues = null;
    if (landingFlag) {
      localStorage.removeItem(filter);
    } else {
      let filterValues = localStorage.getItem(filter);
      getFilteredValues = JSON.parse(filterValues);
    }
    return getFilteredValues;
  }

  // Get Industry Type
  getIndustryType() {
    let industryType: any = localStorage.getItem("industryType");
    industryType =
      industryType == "undefined" || industryType == undefined
        ? 1
        : industryType;
    let typeIndex = industryTypes.findIndex(
      (option) => option.id == industryType
    );
    let type = typeIndex >= 0 ? industryTypes[typeIndex] : industryTypes[0];
    return type;
  }

  // Number With Commas
  numberWithCommas(num) {
    //return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    var res = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
  }

  // Number With Commas
  numberWithCommasTwoDigit(x) {
    x=x.toString();
    var lastThree = x.substring(x.length-3);
    var otherNumbers = x.substring(0,x.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
  }

  // Number With Commas
  numberWithCommasThreeDigit(num) {
    var res = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
  }

  // Remove Commas from number
  removeCommaNum(num) {
    console.log(num);
    let re = /\,/gi;
    console.log(num.replace(re, ""));
    return num.replace(re, "");

  }

  // Split Current Url
  splitCurrUrl(url) {
    let currUrl = url.split('/');
    let navFrom = currUrl[1];
    return navFrom;
  }

  // Set List Page Local Storage
  setListPageLocalStorage(wsFlag, navFrom, scrollTop) {
    localStorage.setItem('wsNav', wsFlag);
    localStorage.setItem('wsNavUrl', navFrom);
    localStorage.setItem('wsScrollPos', scrollTop);
  }

  // Set Search Page Local Storage
  setSearchPageLocalStorageNew(navFrom, scrollTop, offset, data) {    
    localStorage.setItem('sNavUrl', navFrom);
    localStorage.setItem('sScrollPos', scrollTop);
    localStorage.setItem('sOffset', offset);
    localStorage.setItem('sListData', data);
  }

   // Set Search Page Local Storage
   setSearchPageLocalStorage(navFrom, scrollTop) {    
    localStorage.setItem('sNavUrl', navFrom);
    localStorage.setItem('sScrollPos', scrollTop);    
  }

  // set Local storage item
  setlocalStorageItem(item, val) {
    localStorage.setItem(item, val);
  }

  // Check Video Job Status
  checkJobStatus(jobData) {
    const params = new HttpParams()
    .set('apiKey', jobData.apiKey)
    .set('jobId', jobData.jobId)
    .set('userId', localStorage.getItem('userId'))
    .set('domainId', localStorage.getItem('domainId'))
    const body = JSON.stringify(jobData);

    return this.http.post<any>(this.apiUrl.apiVideoJobStatus(), body, {'params': params})
  }

  // Checking filter applied
  checkFilterApply(fields, chkFields) {
    console.log(fields, chkFields)
    let filterCount = 0;
    let clearItems:any = [];
    Object.entries(fields).forEach((item) => {
      let key:any = item[0];
      let val:any = item[1];
      let ValueType = Array.isArray(val);
      let chkIndex = chkFields.findIndex(option => option == key);
      if(chkIndex < 0) {
        if(ValueType) {
          if(val.length > 0) {
            clearItems.push(key);
            filterCount++;
          }
        } else {
          let isBooleanFlag: any = (typeof(item[1]) === "boolean") ? true : false;
          if(!isBooleanFlag && val != null && val != 0) {
            console.log(key, val, isBooleanFlag)
            clearItems.push(key);
            filterCount++;
          }
        }
      }
    });
    let data = {
      filterCount: filterCount,
      clearItems: clearItems
    }
    return data;
  }

  // Clear Filter Values
  clearFilterValues(fields, clearItems) {
    Object.entries(fields).forEach((item) => {
      let key = item[0];
      let val:any = item[1];
      let chkIndex = clearItems.findIndex(option => option == key);
      if(chkIndex >= 0) {
        let ValueType = Array.isArray(val);
        if(ValueType) {
          val = [];
        } else {
          let isBooleanFlag: any = (typeof(item[1]) === "boolean") ? true : false;
          if(!isBooleanFlag && val != null && val != 0) {
            val = '';
            console.log(key, isBooleanFlag, val)
          }        
        }
        fields[key] = val; 
      }
    });
    return fields;
  }

  // Check navigation edit
  checkNavEdit(curl = '') {
    console.log(curl)
    let wsNav:any = localStorage.getItem('wsNav');
    let landingRecentNav = localStorage.getItem('landingRecentNav');
    let wsNavUrl = (landingRecentNav) ? RedirectionPage.Home : localStorage.getItem('wsNavUrl');
    let url = ((wsNav || landingRecentNav) && curl == '') ? wsNavUrl : curl;
    console.log(url)
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let routeLoadIndex = pageDataIndex;    
    let navText = pageTitle[pageDataIndex].navEdit;
    let navFromEdit:any = localStorage.getItem(navText);
    if(landingRecentNav) {
      let routerText = pageTitle[pageDataIndex].routerText;
      localStorage.setItem(routerText, 'true');
    }
    setTimeout(() => {
      localStorage.removeItem(navText);
      localStorage.removeItem('landingRecentNav');
    }, 100);
    let data = {
      navEditText: navText,
      url: url,
      navFromEdit: navFromEdit,
      routeLoadIndex: routeLoadIndex,
    };
    return data;
  }

  hasBlankSpaces(str){
    return  str.match(/^\s+$/) !== null;
  }

  // GET DTC Lists
  getDTCLists(dtcData): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', dtcData.apiKey)
      .set('userId', dtcData.userId)
      .set('domainId', dtcData.domainId)
      .set('countryId', dtcData.countryId)
      .set('type', dtcData.type)
      .set('searchKey', dtcData.searchKey)
      .set('offset', dtcData.offset)
      .set('limit', dtcData.limit)
    const body = JSON.stringify(dtcData);

    return this.http.post<any>(this.apiUrl.apiDtcList(),  body, {'params': params})    
  }
}
