import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  pageInfo,
  Constant,
  PlatFormType,
} from "src/app/common/constant/constant";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  public searchFromPageNameClose: boolean = false;
  public searchPageRedirectFlag: string = "0";
  public uploadURL: string;
  public userName: string = "";
  public profileImage: string = "";

  public collabticApi: string;

  public collabticForumApi: string;
  public collabticLandingApi: string;

  public reviewApi: string;
  public collabticDashApi: string;
  public collabticProbingApi: string;
  public collabticVehicleApi: string;
  public collabticGTSApi: string;
  public collabticAccountsApi: string;
  public productInfoApi: string;
  public escalationV2Api: string;
  public productmakeApi: string;
  public partsApi: string;
  public knowledgeBaseApi: string;
  public knowledgeArticleApi: string;
  public resourceApi: string;
  public searchApi: string;
  public uploadApi: string;
  public mediaApi: string;
  public mediaUploadApi: string;
  public testApi: string;
  public vimeoApi: string;
  public notificationApi: string;
  public pushApi: string;
  public threadPostApi: string;
  public threadPostApi2: string;
  public langApi: string;
  public platformInfo = localStorage.getItem("platformId");
  public demoGtsMahale: string = Constant.TechproMahleApi;
  public jobStatusApi: string;
  public modalapi : string;

  constructor(private router: Router, private route: ActivatedRoute) {
    let platformId = localStorage.getItem("platformId");
    if (platformId == null || platformId == 'null') {
      platformId = PlatFormType.Collabtic;
      //platformId=PlatFormType.MahleForum;
      // platformId=PlatFormType.CbaForum;
    }
    if (platformId == PlatFormType.Collabtic) {
      this.collabticApi = Constant.CollabticApiUrl;
    } else if (platformId == PlatFormType.MahleForum) {
      this.collabticApi = Constant.TechproMahleApi;
    } else if (platformId == PlatFormType.CbaForum) {
      this.collabticApi = Constant.CbaApiUri;
    } else if (platformId == PlatFormType.KiaForum) {
      this.collabticApi = Constant.KiaApiUri;
    } else {
      this.collabticApi = Constant.CollabticApiUrl;
    }

    // set upload url for ckeditor
    this.uploadURL = `${this.collabticApi}/accounts/UploadAttachtoSvr`;

    //this.collabticApi = Constant.TechproMahleApi;
    this.collabticForumApi = `${this.collabticApi}/forum`;
    this.collabticLandingApi = `${this.collabticApi}/Landingpage`;
    this.collabticDashApi = `${this.collabticApi}/dashboard`;
    this.productInfoApi = `${this.collabticApi}/Productmatrix`;
    this.escalationV2Api = `${this.collabticApi}/Escalation`;
    this.partsApi = `${this.collabticApi}/parts`;
    this.knowledgeBaseApi = `${this.collabticApi}/knowledgebase`;
    this.knowledgeArticleApi = `${this.collabticApi}/softwaredl`;
    this.resourceApi = `${this.collabticApi}/resources`;
    this.searchApi = `${this.collabticApi}/search`;
    this.productmakeApi = `${this.collabticApi}/vehicle`;
    this.collabticAccountsApi = `${this.collabticApi}/accounts`;
    this.uploadApi = `${this.collabticApi}/threadpost/Attachmentupload`;
    this.mediaApi = `${this.collabticApi}/media`;
    //this.mediaUploadApi = `${this.mediaApi}/UpdateandUploadattachments`;
    this.modalapi = `${this.collabticApi}/productmatrix`

    this.mediaUploadApi = `${this.collabticApi}/threadpost/Attachmentupload`;

    this.vimeoApi = "http://vimeo.com/api/v2/video";
    this.notificationApi = `${this.collabticApi}/forumnewversion`;
    this.pushApi = `${this.collabticApi}/push`;
    this.threadPostApi = `${this.collabticApi}/threadpost/ChatFileUpload`;
    this.threadPostApi2 = `${this.collabticApi}/threadpost/`;
    this.langApi = `${this.resourceApi}/getLangUageList`;
    this.jobStatusApi = `${this.collabticForumApi}/getawsvideojobstatus`;
  }

  // Base Collabtic Forum API URL
  apiCollabticBaseUrl() {
    return `${this.collabticApi}`;
  }

  // Base Dashboard API URL
  apiDashboardBaseUrl() {
    return `${this.collabticDashApi}`;
  }

  // Get Lang Api URL
  getLangApiUrl() {
    return `${this.langApi}`;
  }

  // Get Dashboard Filter Widget Lists
  apiGetDashboardFilterWidgets() {
    return `${this.collabticDashApi}/dashboardFilterWidgets`;
  }

  // Dashboard
  apiDashboard() {
    return `${this.collabticDashApi}/userDashboardreportv2updated`;
  }

  // Chart Details
  apiChartDetail() {
    return `${this.collabticDashApi}/ChartDetails`;
  }

  // Geographical Lists
  apiGeoList() {
    return `${this.collabticDashApi}/geographicalwidgets`;
  }

  // Export Dealer Activity
  apiExportDealerActivity() {
    return `${this.collabticDashApi}/useractivityfilterexport`;
  }

  // Get User Profile
  apiUserProfile() {
    return `${this.collabticApi}/user/getuserdetails`;
  }

  // New Probing Question
  apiNewProbingQuest() {
    return `${this.collabticProbingApi}/createProbingQuestions`;
  }

  // Get Probing Lists
  apiGetProbingLists() {
    return `${this.collabticProbingApi}/GetProbingquestionsList`;
  }

  // Delete Probing Question
  apiDeleteProbingQuest() {
    return `${this.collabticProbingApi}/deleteProbingQuestions`;
  }

  // Get Workstream Lists
  apiGetWorkstreamLists() {
    return `${this.collabticForumApi}/GetworkstreamsList`;
  }

  apiGetWorkstreamListsAPI() {
    return `${this.collabticForumApi}/GetworkstreamsAPI`;
  }
  apiGetworkstreamswithCount() {
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.CbaForum) {
      return `${this.collabticForumApi}/GetworkstreamsV3`;
    } else {
      return `${this.collabticForumApi}/GetworkstreamsAPI`;
    }
  }
  // Landing page widgets
  apiGetLandingpageOptions() {
    return `${this.collabticLandingApi}/GetLandingPagewidgets`;
  }
  apiGetRecentViews() {
    return `${this.collabticLandingApi}/GetRecentViews`;
  }

  apiManualsAndAnnouncementList() {
    return `${this.resourceApi}/ManualsAndAnnouncementList`;
  }

  apigetescalatethreadsAPI() {
    return `${this.collabticForumApi}/getescalatethreadsAPI`;
  }

  apigetusersearchHistory() {
    return `${this.searchApi}/GetusersearchHistory`;
  }
  apithreadwithWorkstreams() {
    return `${this.searchApi}/threadwithWorkstreams`;
  }
  apiclearsearchhistory() {
    return `${this.searchApi}/clearsearchhistory`;
  }


  apiEnhancedSearchAPI() {
    return `${this.searchApi}/EnhancedsearchAPI`;
  }
  apiGetAlldomainUsers() {
    return `${this.collabticForumApi}/GetAlldomainUsersAPI`;
  }

  readandDeleteNotification() {
    return `${this.collabticApi}/forumnewversion/ReadandDeleteNotificationAPI`;
  }

  apiThreadCharts() {
    return `${this.collabticDashApi}/threadsCharts`;
  }
  // Get Product Type Lists
  apiGetProdTypeLists() {
    return `${this.collabticForumApi}/getProdTypeList`;
  }
  //for getting knowledge articles
  getAllKnowledgeArticle() {
    return `${this.collabticApi}/softwaredl/getKnowledgeArticlesList`;
  }
  // for manage knowledge article new and edit
  apiManageKnowledgeType() {
    return `${this.collabticApi}/softwaredl/SaveArticleV2`;
  }
  //for deleting knowledge articles
  apiDeleteKnowledgeArticle() {
    return `${this.collabticApi}/softwaredl/deleteArticles`;
  }
  getKnowledgeArticlesDetails() {
    return `${this.collabticApi}/softwaredl/getKnowledgeArticlesDetails`;
  }
  // Get Workstream Detail
  apiGetWorkstreamDetail() {
    return `${this.collabticForumApi}/LoadWorkstreamDetail`;
  }

  // Get Workstream Users
  apiGetWorkstreamUsers() {
    return `${this.collabticForumApi}/LoadWorkstreamDetailUsers`;
  }

  // Check Workstream Name Exists
  apiCheckWorkstreamName() {
    return `${this.collabticForumApi}/CheckWorkstreamTitle`;
  }

  // New Workstream
  apiNewWorkstream() {
    return `${this.collabticForumApi}/createWorkstreams`;
  }

  // Save Workstream
  apiSaveWorkstream() {
    return `${this.collabticForumApi}/SaveWorkstreammembers`;
  }

  // Get Vehicle Model Lists
  apiGetVehicleModelLists() {
    return `${this.collabticVehicleApi}/getmodelAPI`;
  }

  // Get GTS Lists
  apiGetGTSLists() {
    return `${this.collabticApi}/GTS/GetGTSProcedureListingWeb`;
  }

  // Update GTS Status
  apiUpdateGTSStatus() {
    return `${this.collabticApi}/GTS/GTSUpdateExitStatus`;
  }

  //remove attachment
  apiDeleteAttachmentInfo() {
    return `${this.collabticApi}/Gts/DeleteAttachmentInfo`;
  }

  // Get Recent Frame Selection
  apiGetGTSRecentFrameSelection() {
    return `${this.collabticApi}/GTS/GetRecentFrameNoSelection`;
  }

  apiUpdateGTSCheckAction() {
    return `${this.collabticApi}/Gts/GTSUpdateCheckActions`;
  }

  apiGTSUpdateUserInputCheckActions() {
    return `${this.collabticApi}/Gts/GTSUpdateUserInputCheckActions`;
  }

  // Get Vehicle Model Lists
  apiGetVehicleModelListsGTS() {
    return `${this.collabticApi}/vehicle/getmodelAPI`;
  }

  // Get GTS BaseInfo
  apiGetGtsBaseInfo() {
    return `${this.collabticApi}/GTS/GetGTSAttributesInfo`;
  }

  // Get Product Category & Types
  apiGetProdCatg() {
    return `${this.collabticApi}/GTS/GetGTSProdCategoryandType`;
  }

  // Get Module Manufacture
  apiGetModMft() {
    return `${this.collabticApi}/GTS/GetGTSProdCategoryandType`;
  }

  // Get DTC Info
  apiGetDtcInfo() {
    return `${this.collabticApi}/GTS/GetDTCInfo`;
  }

  // GET DTC Attributes
  apiGetDtcAttributes() {
    return `${this.collabticApi}/GTS/GetDTCAttributesInfo`;
  }

  // GTS Procedure Creation and Update
  apiManageGts() {
    return `${this.collabticApi}/GTS/SaveGTSProcedure`;
  }

  // Delete DTS Procedure
  apiDeleteGts() {
    return `${this.collabticApi}/GTS/DeleteGTSProcedure`;
  }

  // Add or Save Manufacturer
  apiManageMFG() {
    return `${this.collabticApi}/GTS/SaveprodMfg`;
  }

  // Add or Save System
  apiManageSystem() {
    return `${this.collabticApi}/GTS/SaveprodSystem`;
  }

  // Add or Save DTC Code
  apiManageDTC() {
    return `${this.collabticApi}/GTS/SaveprodDtc`;
  }

  // Check DTC Code Exists
  apiCheckDTC() {
    return `${this.collabticApi}/GTS/CheckDTCAvailablity`;
  }

  // Add or Save Tag
  apiManageTagGTS() {
    return `${this.collabticApi}/GTS/SaveprodTags`;
  }

  // Add or Save Product Category
  apiManageProblemCatg() {
    return `${this.collabticApi}/GTS/SaveprodCategory`;
  }

  // Add or Save ECU Type
  apiManageECUType() {
    return `${this.collabticApi}/GTS/SaveprodECUType`;
  }

  // Get Product Matrix Lists
  apiGetProductLists() {
    return `${this.productInfoApi}/getProductMatrix`;
  }

  // Check Model Exists
  apiCheckModelExists() {
    return `${this.productInfoApi}/CheckMakeModelExist`;
  }

  // Check Model Exists
  apicheckModelAutoComplete() {
    return `${this.productInfoApi}/getproductModelListautoComplete`;
  }

  // Add or Save Product Matrix
  apiManageProductMatrix() {
    return `${this.productInfoApi}/SaveproductMatrix`;
  }

  apiUpdateProductMatrixByModel() {
    return `${this.productInfoApi}/updateProductMatrixByModel`;
  }
  apiSaveproductMatrixBYModel() {
    return `${this.productInfoApi}/SaveproductMatrixBYModel`;
  }

  apigetPMColumns() {
    return `${this.productInfoApi}/getPMColumns`;
  }

  apigetEscalationColumns() {
    return `${this.escalationV2Api}/getPMColumns`;
  }
  apiGetEmployeeEscalation() {
    return `${this.escalationV2Api}/GetEscalationDataMetrics`;
  }
  apiupdateEscalationData() {
    return `${this.escalationV2Api}/updateEscalationData`;
  }
  apiGetAllEscalationUsers() {
    return `${this.escalationV2Api}/getallEscalationUsers`;
  }
  apigetEscalationLookupTableData() {
    return `${this.collabticForumApi}/CommonAttributeValues`;
  }
  apigetEscalationConfigData() {
    return `${this.escalationV2Api}/EscalationConfig`;
  }
  apigetAlertEscalationConfigData() {
    return `${this.escalationV2Api}/EscalationreminderAlertConfig`;
  }

  //Escalations By Levels
  apiGetEscalationsByLevels() {
    return `${this.collabticForumApi}/GetEscalationsByLevels`;
  }


  apiGetGTSProcedures() {
    return `${this.collabticApi}/Gts/GetGtsProcedures`
  }
  apiGetUploadAttachments() {
    return `${this.collabticApi}/GtsAttachment/uploadAttachments`
  }

  apiGTSFrameDecode() {
    return `${this.collabticApi}/Gts/FrameDecode`
  }

  apicheckHeaderExists() {
    return `${this.productInfoApi}/checkHeaderExists`;
  }

  apiupdatePlaceholderByHeader() {
    return `${this.productInfoApi}/updatePlaceholderByHeader`;
  }

  apiAddNewColumn() {
    return `${this.productInfoApi}/AddNewColumn`;
  }

  apigetLookupTableData() {
    return `${this.productInfoApi}/getLookupTableData`;
  }
  apiManageLookUpdata() {
    return `${this.productInfoApi}/SaveLoopUpdata`;
  }

  apigetPMColumnsValues() {
    return `${this.productInfoApi}/getPMColumnsValues`;
  }

  // Active or Deactive Product Matrix
  apiActionProductMatrix() {
    return `${this.productInfoApi}/UpdateModelmakeStatus`;
  }

  // Get Product Make Lists
  apiGetProductmakeList() {
    return `${this.productInfoApi}/getproductmakeList`;
  }

  // Get Product Type
  apiGetProductSubGroupList() {
    return `${this.productInfoApi}/GetProductTypeList`;
  }

  // Get Product Sub Group
  apiGetProductTypeList() {
    return `${this.productInfoApi}/productTypeListDoc`;
  }

  // Add or Save Make
  apiActionMake() {
    return `${this.productInfoApi}/Saveproductmake`;
  }

  // Show Category and Subcategory
  apigetproductCategandSubcat() {
    return `${this.productInfoApi}/getproductCategandSubcat`;
  }

  // Get Menu Lists
  apiGetMenuLists() {
    return `${this.collabticAccountsApi}/getHeaderandsideMenuAPIv2`;
  }

  // Get Dashboard Menu Lists
  apiGetDashMenuLists() {
    return `${this.collabticAccountsApi}/getHeaderandsideMenuAPI`;
  }

  // Delete Workstream
  apiDeleteWorkstream() {
    return `${this.collabticForumApi}/DeleteWorkstreamItems`;
  }

  apigetUserListDashboard() {
    if (this.platformInfo != "1") {
      return `${this.collabticDashApi}/getuserlistAPI`;
    } else {
      return `${this.collabticDashApi}/getuserlist`;
    }
  }

  apiUpdateUserDashstatus() {
    if (this.platformInfo != "1") {
      return `${this.collabticDashApi}/updateusersAPI`;
    } else {
      return `${this.collabticDashApi}/updateusers`;
    }
  }
  apiGetUserManagersList() {
    return `${this.collabticDashApi}/getmanagerlistV2`;
  }

  apiDeleteAccountUserInfo() {
    return `${this.collabticAccountsApi}/DeleteAccountUserInfo`;
  }

  apiUpdateUserpasswordbyAdmin() {
    return `${this.collabticAccountsApi}/adminChangepassword`;
  }

  apiupdateuserInfobyAdmin() {
    return `${this.collabticAccountsApi}/updateuserInfo`;
  }

  apiAddInviteUserbyAdmin() {
    return `${this.collabticAccountsApi}/bussinessInviteRegister`;
  }
  apiCheckemailstatus() {
    return `${this.collabticAccountsApi}/Checkemailstatus`;
  }
  apiLikePinKnowledgeArticleAction() {
    return `${this.knowledgeArticleApi}/AddLikePins`;
  }
  /*** Parts API Start ***/
  // Get Parts List
  apiGetPartsList() {
    return `${this.partsApi}/GetPartsListingweb`;
  }

  // Get Part Attributes
  apiGetPartBaseInfo() {
    return `${this.partsApi}/GePartsAttributesInfo`;
  }

  // Get Parts Detail
  apiGetPartsDetail() {
    return `${this.partsApi}/GetPartsDetailsweb`;
  }

  // Check part no duplicate
  apiCheckPartNoIsExist() {
    return `${this.partsApi}/CheckPartNoIsExist`;
  }

  // Manage Parts Create or Edit
  apiManageParts() {
    return `${this.partsApi}/SaveParts`;
  }

  // Get Model List By Make
  apiGetModels() {
    return `${this.productmakeApi}/GetModelformakeAPI`;
  }

  apiGetuserExportAll() {
    return `${this.collabticDashApi}/getuserlistexcelupdated`;
  }

  apiGetuserExportThread() {
    return `${this.collabticForumApi}/GetallThreadExportHeaders`;
  }

  apiGetallThreadExportData() {
    return `${this.collabticForumApi}/GetallThreadExportData`;
  }

  /*** Parts API End ***/

  // Get Tags List
  apiGetTagList() {
    return `${this.resourceApi}/gettagslists`;
  }

  // Add or Save Tag
  apiManageTag() {
    return `${this.partsApi}/SaveprodTags`;
  }
  // delete Tag
  deleteTag() {
    return `${this.resourceApi}/DeleteTagsInfo`;
  }

  // Get Related Thread Lists
  apiGetRelatedThreads() {
    return `${this.collabticForumApi}/ReleatedThreadsWeb`;
  }

  // Get Error Codes List
  apiGetErrorCodes() {
    return `${this.collabticForumApi}/ErrorCodes`;
  }

  // Manage Error Code
  apiManageErrorCode() {
    return `${this.partsApi}/saveErrorCode`;
  }

  // Manage Part Type
  apiManagePartType() {
    return `${this.partsApi}/savePartType`;
  }

  // Manage Part System
  apiManagePartSystem() {
    return `${this.partsApi}/SavepartSystem`;
  }

  // Manage Part Assembly
  apiManagePartAssembly() {
    return `${this.partsApi}/savepartAssembly`;
  }

  // Update Part Status
  apiUpdatePartStatus() {
    return `${this.partsApi}/UpdatePartStatus`;
  }

  // Get Filter Widgets
  apiGetFilterWidgets() {
    return `${this.collabticAccountsApi}/FilterWidgets`;
  }

  // Manage Filter Settings
  apiManageFilterSettings() {
    return `${this.collabticAccountsApi}/SaveFilterSettings`;
  }

  // Get Upload URL
  apiGetUploadURL() {
    return this.uploadApi;
  }

  // Get Recent Part View Lists
  apiRecentPartViews() {
    return `${this.partsApi}/GetPartRecentViews`;
  }

  // Like & Pin Actions
  apiLikePinAction() {
    return `${this.partsApi}/AddLikePins`;
  }

  // Delate Part
  apiDeletePart() {
    return `${this.partsApi}/DeletePartInfo`;
  }

  // Delate SIB
  apiDeleteSib() {
    return `${this.demoGtsMahale}/sib/DeleteSIBInfo`;
  }

  // Get Vimeo Video Thumb
  apiGetVimeoThumb(vid) {
    return `${this.vimeoApi}/${vid}.json`;
  }

  /* Media Manager API */

  // Get Media Lists
  apiGetMediaLists() {
    return `${this.mediaApi}/GetMediaList`;
  }

  // Check Media Name
  apiCheckMediaName() {
    return `${this.mediaApi}/CheckforDuplicatesMedia`;
  }

  // Save Media
  apiSaveMedia() {
    return `${this.mediaApi}/saveMedia`;
  }

  // Get Media Upload URL
  apiGetMediaUploadURL() {
    //return `${this.mediaApi}/UpdateandUploadattachments`;
    return `${this.collabticApi}/threadpost/Attachmentupload`;
  }
  // Get Media Upload file URL
  apiCheckUploadMedia() {
    //return `${this.mediaApi}/UpdateandUploadattachments`;
    return `${this.collabticApi}/threadpost/Attachmentupload`;
  }

  // Delete Media Api
  apiDeleteMedia() {
    return `${this.mediaApi}/DeleteMediaInfo`;
  }

  // Get Site Logo
  apiGetSiteLogo() {
    return `${this.collabticForumApi}/getLinkInfo`;
  }

  // Get user notifications
  apiusernotifications() {
    return `${this.notificationApi}/DisplayNotificationmobile`;
  }

  //FCM save User Token for sending and receive push
  apiregisterdevicetoken() {
    return `${this.pushApi}/registerdevicetokenWeb`;
  }
  apiActiveDevicesOnPageWeb() {
    return `${this.pushApi}/ActiveDevicesOnPageWeb`;
  }

  // Reset user notifications
  apiresetusernotifications() {
    return `${this.notificationApi}/Notificationcountreset`;
  }

  // Read or Delete user notifications
  apiReadandDeleteNotification() {
    return `${this.notificationApi}/ReadandDeleteNotificationAPI`;
  }

  // Delete All user notifications
  apiDismissallnotifications() {
    return `${this.notificationApi}/dismissallnotificationsAPI`;
  }

  // Like & Pin Actions
  apiMediaLikePinAction() {
    return `${this.mediaApi}/AddLikePins`;
  }

  /* Escalations API */

  // Get Escalation API
  apiGetEscalationLists() {
    return `${this.collabticForumApi}/GetEscalationexcelData`;
  }

  // Get Escalation PPFR API
  apiGetEscalationListsPPFR() {
    return `${this.collabticForumApi}/EscformListing`;
  }

  // Save Escalation API
  apiSaveEscalation() {
    return `${this.collabticForumApi}/SaveEscalationMData`;
  }

  // Escalation Notification API
  apiEscalationNotify() {
    return `${this.collabticForumApi}/SendMEscalationNotifications`;
  }

  apigetWorksteamOrGroupChat() {
    return `${this.collabticForumApi}/Getworkstramschat`;
  }
  apigetWorksteamOrGroupChatV2() {
    return `${this.collabticForumApi}/GetworkstramschatAPI`;
  }

  apigetDomainUserList() {
    return `${this.collabticForumApi}/GetAlldomainUsersAPI`;
  }

  apiAddworkstreamChat() {
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      return `${this.collabticForumApi}/addworkstreamchatAPI`;
    } else {
      return `${this.collabticForumApi}/addworkstreamchat`;
    }
  }
  apiAddPostNotification() {
    return `${this.notificationApi}/pushnotificationGroupmessage`;
  }
  apiGetChatUploadURL() {
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      return `${this.threadPostApi2}ChatFileUploadAPI`;
    } else {
      return `${this.threadPostApi}/ChatFileUpload`;
    }
  }
  apiDeleteworkstreamChat() {
    let platformId = localStorage.getItem("platformId");
    if (platformId == "1") {
      return `${this.collabticForumApi}/Deleteworkstreamchat`;
    } else {
      return `${this.collabticForumApi}/DeleteworkstreamchatAPI`;
    }
  }
  /*** Authentication ***/
  // validate domain name
  apivalidateSubDomain() {
    return `${this.collabticAccountsApi}/ValidatesubdomainAPI`;
  }
  //validate email id / user name and password
  apiLogin() {
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.CbaForum) {
      return `${this.collabticAccountsApi}/loginApiV2`;
    } else {
      return `${this.collabticAccountsApi}/loginApi`;
    }
  }
  //validate email id / user name and password
  apiSignup() {
    return `${this.collabticAccountsApi}/checkValidUser`;
  }
  //validate email id - password reset
  apiResetPassword() {
    return `${this.collabticAccountsApi}/ResetpasswordApp`;
  }
  //reset password
  apiChangePassword() {
    return `${this.collabticAccountsApi}/changepassword`;
  }
  apiNewBusinessSignup() {
    return `${this.collabticAccountsApi}/NewBusinessRegister`;
  }
  /*** Authentication ***/

  // Change password
  apiChangeUserPassword() {
    return `${this.collabticAccountsApi}/changepasswordApp`;
  }

  // Save Folders (Add and Update and Delete)
  apiSaveDocumentFolder() {
    return `${this.resourceApi}/SaveDocumentFolder`;
  }

  //get manager list
  apiGetManagerList() {
    return `${this.collabticAccountsApi}/getmanagerList`;
  }

  //update manager
  apiUpdateManagerList() {
    return `${this.collabticAccountsApi}/updateuersignupinfo`;
  }

  //landing page reports
  apiLandingreports() {
    return `${this.collabticAccountsApi}/getReportsAttr`;
  }

  //reset verification email
  apiResetVerificationEmail() {
    return `${this.collabticAccountsApi}/resendEmail`;
  }

  //user checked verification email
  apiVerifiedEmail() {
    return `${this.collabticAccountsApi}/EmailVerificationStatus`;
  }

  // get language list
  apiGetLangUageList() {
    return `${this.resourceApi}/getLangUageList`;
  }

  // set language list
  apiSaveUserLanguageOption() {
    return `${this.collabticAccountsApi}/SaveUserLanguageOption`;
  }

  //profile upload
  apifileUpload() {
    return `${this.collabticAccountsApi}/profilephoto`;
  }

  //user checked verification email
  apiGetPolicyContent() {
    return `${this.collabticAccountsApi}/TVSIBPrivacyPolicy`;
  }

  /*** Authentication ***/

  /*** Profile */

  apiGetUserProfile() {
    return `${this.collabticAccountsApi}/GetUserprofile`;
  }
  apiUpdateUserProfile() {
    return `${this.collabticAccountsApi}/UpdateprofileUserV2`;
  }
  apiUpdateStagename() {
    return `${this.collabticAccountsApi}/UpdateStagename`;
  }
  apiGetProfileMetrics() {
    return `${this.collabticForumApi}/ProfileMetrics`;
  }
  apiGetCertificationList() {
    return `${this.collabticAccountsApi}/certificationlistAPI`;
  }
  apiSelectUserCertificationList() {
    return `${this.collabticAccountsApi}/selectusercertificationsAPI`;
  }
  apiSaveUserCertificationList() {
    return `${this.collabticAccountsApi}/SaveusercertificationsAPI`;
  }
  apiGetuserFollowerFollowing() {
    return `${this.collabticAccountsApi}/GetuserFollowerFollowing`;
  }
  apiUserFollowMethod() {
    return `${this.collabticForumApi}/UserFollowMethod`;
  }
  /*** Profile ***/

  /** Manage Thread API */

  // Thread Field API
  apiGetThreadFields() {
    return `${this.collabticAccountsApi}/accountConfigUpdatedV3`;
  }

  // Thread Creation API
  apiCreateThread() {
    return `${this.collabticForumApi}/createThreadV2`;
  }

  // Thread Update API
  apiUpdateThread() {
    return `${this.collabticForumApi}/updateThreadV2`;
  }

  // Thread Push Api
  apiThreadPush() {
    return `${this.pushApi}/SendbulkPushFromApp`;
  }

  // Document Notification Api
  apiDocumentNotification() {
    return `${this.resourceApi}/sendingdocumentnotification`;
  }

  // Announcement Push Api
  apiAnnouncementPush() {
    return `${this.pushApi}/SendbulkPushAnnouncement`;
  }

  // Document/Announcement Update API
  apiUpdateTechInfo() {
    return `${this.resourceApi}/UpdateManualsandannouncement`;
  }

  apiGetGroupAndDirectMessagewithCount() {
    return `${this.collabticForumApi}/GetChatListing`;
  }

  /*** Thread-Post ***/

  // get thread detail
  apiGetthreadDetailsios() {
    return `${this.collabticForumApi}/GetthreadDetailsios`;
  }

  // get post list
  apiPostList() {
    return `${this.collabticForumApi}/PostListAPI`;
  }

  // new post
  apiReplyPost() {
    return `${this.collabticForumApi}/ReplyPostApi`;
  }

  // new post
  apiUpdatePost() {
    return `${this.collabticForumApi}/updatePostAPI`;
  }

  // close thread
  apiCloseThread() {
    return `${this.collabticForumApi}/CloseThreadAPI`;
  }

  apigetAllTagUsersList() {
    return `${this.collabticDashApi}/getAllTagUsersList`;
  }

  // re-open thread
  apiReopenThread() {
    return `${this.collabticForumApi}/updateclosethreads`;
  }

  // delete thread/post
  apiDeleteThreadPost() {
    return `${this.collabticApi}/threadpost/threadpostupdatedeletestatus`;
  }

  // delete thread/post
  apiSolutionStatusAPI() {
    return `${this.collabticForumApi}/SolutionStatusAPI`;
  }

  // Thread AddLike, Pin and OnePlus
  apiAddLikePinOnePlus() {
    return `${this.collabticForumApi}/AddLikePins`;
  }

  // Send Reminder (MOBILE PUSH)
  apiSendPushtoMobile() {
    return `${this.notificationApi}/sendPushtoMobile`;
  }

  // Add Reminder
  apiAddReminder() {
    return `${this.collabticForumApi}/SendRemindertoUsers`;
  }

  // Send Reminder (MOBILE PUSH)
  apiSendReminder() {
    return `${this.pushApi}/SendRemindertBulkPush`;
  }

  // Thread and post dashboard users
  apiDashboardUsersList() {
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.Collabtic) {
      return `${this.collabticForumApi}/dashboardusers`;
    } else {
      return `${this.collabticForumApi}/dashboardusersAPI`;
    }
  }

  /*** Thread-Post ***/
  apiAddMementToGroup() {
    return `${this.collabticForumApi}/AddMemberstochat`;
  }

  // Thread Creation API
  apiCreateDoc() {
    return `${this.resourceApi}/CreateManualsandAnnouncement`;
  }

  /*** Announcement ***/

  // get announcment detail
  apiGetAnnouncementDetail() {
    return `${this.resourceApi}/GetManualDetails`;
  }
  apigetUploadMediaStatus() {
    return `${this.collabticForumApi}/getawsvideojobstatus`;
  }

  // announcment AddLike
  apiResourceAddLike() {
    return `${this.resourceApi}/AddLikePins`;
  }

  // announcement dashboard
  apiLoadAnnounceDashboard() {
    return `${this.collabticForumApi}/LoadAnnounceDashboard`;
  }

  // announcement dashboard
  apiDismissManuals() {
    return `${this.resourceApi}/DismissManuals`;
  }

  // announcement archive
  apiArchiveAnnouncements() {
    return `${this.resourceApi}/archiveAnnouncement`;
  }

  // announcement archive
  apiUpdateUserScrollPopup() {
    return `${this.collabticAccountsApi}/UpdateUserScrollPopup`;
  }

  // Get Product/Vehicle Banner Image
  apiGetBanner() {
    return `${this.productmakeApi}/getBannerImage`;
  }

  // update helpcontent
  apitooltipconfigWeb() {
    return `${this.collabticAccountsApi}/tooltipconfigWeb`;
  }

  // Get SIB Lists
  apiGetSibLists() {
    return `${this.demoGtsMahale}/sib/SIBListing`;
  }

  // Create SIB
  apiCreateSIB() {
    return `${this.demoGtsMahale}/sib/saveSIB`;
  }

  // GEt SIB Details
  apiGetSibDetail() {
    return `${this.demoGtsMahale}/sib/SIBDetailsAPI`;
  }

  // Like & Pin Actions
  apiSibLikePinAction() {
    return `${this.demoGtsMahale}/sib/AddLikePins`;
  }

  // Delate document
  apiDeleteDocument() {
    return `${this.resourceApi}/DeleteDocumentInfo`;
  }

  // Save PPFR Form API
  apiSavePPFRFormData() {
    return `${this.collabticForumApi}/EscFeedbackFormAction`;
  }

  // PPFR Form detail API
  apiGetEscalateThreadDetails() {
    return `${this.collabticForumApi}/FindEscFeedbackFormDetails`;
  }

  // dealer area and dealer code
  apiUsagemetricsfiltercontent() {
    return `${this.collabticForumApi}/Usagemetricsfiltercontent`;
  }

  // Get Video Job Status
  apiVideoJobStatus() {
    return `${this.jobStatusApi}`;
  }

  // dealer area and dealer code
  apiManageTokBoxsession() {
    return `${this.collabticForumApi}/ManageTokBoxsession`;
  }
  /*** KnowledgeBase API Start ***/
  // Get KnowledgeBase List
  apiGetKnowledgeBaseList() {
    return `${this.knowledgeBaseApi}/KnowledgeBaseList`;
  }

  // Knowledge Base Creation API
  apiCreateKB() {
    return `${this.knowledgeBaseApi}/SaveKnowledgeBase`;
  }

  // Knowledge Base Creation API
  apiViewKB() {
    return `${this.collabticForumApi}/ViewContentDetails`;
  }

  // Delate KB
  apiDeleteKB() {
    return `${this.knowledgeBaseApi}/DeleteKBInfo`;
  }

  // Social Actions KB
  apiSocialActionKB() {
    return `${this.knowledgeBaseApi}/AddLikePins`;
  }
  //
  apiTVSSSOLogin() {
    return `${this.collabticAccountsApi}/TVSLoginSSO`;
  }

  //
  apiTVSSSODealerLogin() {
    return `${this.collabticAccountsApi}/TVSDealerSSO`;
  }

  // Get dealer Info
  apiTVSSSOGetEmployeeInfo() {
    return `${this.collabticAccountsApi}/GetDealerEmployeeInfo`;
  }

  // Get dealer Info
  apiTVSSSOGetDealerInfo() {
    return `${this.collabticAccountsApi}/GetDealerInfo`;
  }

  apiLeaderBoard() {
    return `${this.collabticForumApi}/getleaderboardV2`;
  }

  // Get DTC Lists
  apiDtcList() {
    return `${this.collabticForumApi}/DtcTypeLists`;
  }

  // GET DTC Create URL
  apiGetCreateDTC() {
    return `${this.collabticForumApi}/CreateErrorCode`;
  }
  //
  apiNewBusinessSetup() {
    return `${this.collabticAccountsApi}/NewBusinessSetup`;
  }
  //
  apiSaveBusinessOptions() {
    return `${this.collabticAccountsApi}/SaveBusinessOptions`;
  }
  //
  apiBusinessInviteNewMembers() {
    return `${this.collabticAccountsApi}/BusinessInviteNewMembers`;
  }
  //
  apiDecodeEmailaddress() {
    return `${this.collabticAccountsApi}/DecodeEmailaddress`;
  }
  
  apiUpdateConfigSettings() {
    return `${this.collabticForumApi}/UpdateChatConfigSettings`;
  }

  apiServiceList(){
    return `https://collabtic-v3api.collabtic.com/v1/services/list`;
  }

  apiShopList(){
    return `https://collabtic-v3api.collabtic.com/v1/shop`;
  }

  apiStatusList(){
    return `https://collabtic-v3api.collabtic.com/v1/services/schedule-status-list`;
  }

  apiManageService(){
    return `https://collabtic-v3api.collabtic.com/v1/services/manage`;
  }

  apiServiceCategory(){
    return `https://collabtic-v3api.collabtic.com/v1/service-type`;
  }

  apiVehiclebyVIN(){
    return `${this.productmakeApi}/VehicleInfobyVIN`;
  }

  apiModels(){
    return `${this.modalapi}/getproductmatrixModelsbyMake`;
  }
}
