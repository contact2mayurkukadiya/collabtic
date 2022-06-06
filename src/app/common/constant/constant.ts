export class Constant {
  public static readonly ApiKey: string = "dG9wZml4MTIz";
  public static readonly VonageApiKey: string = "47176494";
  public static readonly CollabticApiUrl: string = "https://collabtic-v2api.collabtic.com"; // New server Collabtic
  //public static readonly CollabticApiUrl: string = "https://collabtic-stageapi.collabtic.com/"; // Stage server Collabtic
  //public static readonly CollabticApiUrl: string = "http://localhost:8081"; // Local Collabtic server
  public static readonly TechproMahleApi: string = "https://techpromahleapiv2.mahleforum.com"; //New server
  //public static readonly TechproMahleApi: string = "http://localhost:8082"; //Local Mahle Server
  //public static readonly TechproMahleApi: string ="https://tvsindiaapi.mahleforum.com/"; //TVS server API
  
  //public static readonly CbaApiUri: string = "https://tacapi.mahleforum.com";
  public static readonly CbaApiUri: string = "https://tacapi-v2.mahleforum.com";
  //public static readonly CbaApiUri: string = "http://localhost:8083"; // Local Collabtic server
  public static readonly KiaApiUri: string = "https://evalapi.mahleforum.com"

  public static readonly knowledgeForumHostName: string = "knowledge.boydgroup.com";
  public static readonly knowledgeForumUrl: string = "https://knowledge.boydgroup.com";

  public static readonly forumLocal: string = "localhost";
  public static readonly mahleforumDomain: string = "mahleforum";
  public static readonly forumDev: string = "forum-dev";
  public static readonly forumDevCollabtic: string = "forum-dev-collabtic";

  public static readonly forumStage: string = "cbt-demo";
  public static readonly forumLive: string = "forum";

  public static readonly forumLiveURLLogin: string = "https://forum.collabtic.com/auth/login";
  public static readonly forumLiveURLSignup: string = "https://forum.collabtic.com/auth/signup";
  //public static readonly forumLiveURLLogin: string = "https://forum.collabtic.com/cbt-stage/auth/login";
  //public static readonly forumLiveURLSignup: string = "https://forum.collabtic.com/cbt-stage/auth/signup";

  public static readonly MahleforumLiveURLLogin: string = "auth/login";
  public static readonly MahlforumLiveURLSignup: string = "auth/signup";

  // MAHLE Settings

  //public static readonly liveSuffixURLLogin: string = "/cbt-v2/auth/login";
  //public static readonly liveSuffixURLSignup: string = "/cbt-v2/auth/signup";

  //Collabtic Settings

  public static readonly liveSuffixURLLogin: string = "/auth/login";
  public static readonly liveSuffixURLSignup: string = "/auth/signup";

  //public static readonly liveSuffixURLLogin: string = "/cbt-stage/auth/login";
  //public static readonly liveSuffixURLSignup: string = "/cbt-stage/auth/signup";

  // default country id and name
  public static readonly CountryID: string = "";
  public static readonly CountryName: string = "";

  // default language id and name
  public static readonly LanguageID: string = "1";
  public static readonly LanguageName: string = "English";

  // knowledge article urls
  public static readonly uploadUrl: string = "/accounts/UploadAttachtoSvr";

  // filter - MAHLE Europe  used POPUP
  public static readonly filterProblemCategoryApiUrl: string = "/gts/GetProdCategoryV2";
  public static readonly filterSymptomApiUrl: string = "/parts/SymptomsSelections";
  public static readonly filterLanguageApiUrl: string = "/resources/getLangUageList";
  public static readonly CommonAttributeValuesApi: string = "/forum/CommonAttributeValues";
  public static readonly filterSubProductGroupUrl: string = "/Productmatrix/GetProductTypeList";
  public static readonly partUrl: string = "/Productmatrix/getproductmatrixModelsbyMake";
  public static readonly filterCommonAttributeApiUrl: string = "/forum/CommonAttributeValues";
  public static readonly getAllTagUsersList: string = "/dashboard/getAllTagUsersList";
  public static readonly getLookupTableData: string = "/Productmatrix/getLookupTableData";
  public static readonly getRecentVins: string = "/vehicle/GetRecentVin";

  public static readonly deeplinkurl = "/deep-link";
  public static readonly DeepLinkText = "This feature is temporarily unavailable";

  public static readonly filterPlatform = "3";

  // TVS
  // TVS SSO  Process Enable, Need to set 1
  //public static readonly TVSSSO : string = "1";

  // Other domain , set 0
  public static readonly TVSSSO: string = "0";

}
export class LocalStorageItem {
  public static readonly reloadChatGroupId: string = "reloadChatGroupId";
  public static readonly reloadChatType: string = "reloadChatType";
  public static readonly themeJSON: string = "themeJSON";
  public static readonly activeTheme: string = "activeTheme";
}

export enum ChatType {
  Workstream = "1",
  GroupChat = "3",
  DirectMessage = "2",
}

export enum ContentTypeValues {
  Threads = "2",
  Documents = "4",
  Parts = "6",
  KnowledgeArticles = "7",
  GTS = "8",
  Announcement = "23",
  KnowledgeBase = "28",
  SIB = "30",
}


export enum DefaultNewImages {
  Threads = "assets/images/threads-blank-page.png",
  Parts = "assets/images/parts-blank-page.png",
  Documents = "assets/images/documents-blank-page.png",
  chatPage = "assets/images/chat-blank-page.png",
  KnowledgeArticles = "assets/images/ka-blank-page.png",
  KnowledgeBase = "assets/images/knowledge-base/no-kb.png",
  SIB = "assets/images/sib-blank-page.png",
}

export enum DefaultNewCreationText {
  Threads = "New Thread",
  Parts = "New Part",
  Documents = "New Document",
  KnowledgeArticles = "New Knowledge Article",
  chatpage = "Go to Chat",
  SIB = "New SIB Cut Off",
  KnowledgeBase = "New Knowledge Base",
}

export enum PlatFormType {
  Collabtic = "1",
  MahleForum = "2",
  CbaForum = "3",
  KiaForum = "4",
}

export enum domainNames {
  viaTek = "60",
}

export enum PlatFormNames {
  Collabtic = "Collabtic",
  MahleForum = "MAHLE Forum",
  Tvs = "TVS",
  CbaForum = "CBA",
  KiaForum = "KIA",
}
export enum PlatFormDomains {
  CollabticDomain = ".collabtic.com",
  mahleDomain = ".mahleforum.com",
  CbaForum = "CBA",
  KiaForum = "KIA",
}

export enum PlatFormDomainsIdentity {
  CollabticDomain = "collabtic.com",
  mahleDomain = "mahleforum.com",
  CbaForum = "CBA",
  KiaForum = "KIA",
}

export enum notificationType {
  thread = "1",
  reply = "2",
  announcement = "3",
  document = "7",
  groupChat = "4",
  follower = "6",
}

export enum forumPageAccess {
  threadpage = "threads/view/",
  replypage = "threads/view/",
  threadpageNew = "threads/view/",
  replypageNew = "threads/view/",
  partsViewPage = "parts/view/",
  documentViewPage = "documents/view/",
  announcementPage = "announcements/view/",
  gtsViewPage = "gts/view/",
  kbViewPage = "kb/view/",
  sibViewPage = "sib/view/",
  chatpage = "/workstream-chat",
  chatpageNew = "chat-page",
  profilePage = "profile/",
  dashboardPage = "/dashboard-v1",
  configurationNotifyPage = "/configure-notifications-metro",
  announcementall = "/announcement-older?param=all",
  forumSearch = "/forum_search_stream",
  newSearch = "search-page",
  knowledgeArticlePageNew = "knowledgearticles/view/",
  homePage = "landing-page",
  PPFRPDFviewer = "/pdfconvert/index2.php?thread_id=",
}


export enum chatMessageType {
  normalMessage = "1",
  attachmentImage = "2",
  announcementFile = "3",
}
export enum escalationSendEmailType {
  addnewmember = "1",
  actionPlanuUdate = "2",
}
export enum AttachmentType {
  image = 1,
  video = 2,
  voice = 3,
  other = 4,
}

export enum threadBulbStatusText {
  proposedFix = "Thread with proposed FIX",
  shareFix = "Shared Fix",
  summitFix = "Shared Fix",
  threadwithFix = "Thread with FIX",
  threadwithHelpfulFix = "Thread with Helpful/Possible FIX",
  threadwithNotFix = "Thread with Do not FIX",
  threadCloseTxt = "Thread Closed",
}

export enum pageInfo {
  landingPage = "1",
  workstreamPage = "2",
  chatPage = "3",
  threadsPage = "4",
  dashboard = "5",
  searchPage = "6",
  partsPage = "7",
  mediaManagerPage = "8",
  knowledgeArticlePage = "9",
  documentPage = "0",
  knowledgeBasePage = "0",
  sibPage = "0",
  gtsPage = "0"
}

export enum MediaTypeInfo {
  Image = "1",
  Video = "2",
  Audio = "3",
  Pdf = "4",
  Documents = "5",
  Link = "6",
  ProcessingTxt = "Processing.."
}

export enum DocfileExtensionTypes {
  docx = "docx",
  doc = "doc",
  ppt = "ppt",
  pptx = "pptx",
  xls = "xls",
  xlsx = "xlsx",
  html = "html",
}
export enum windowHeight {
  height = window.innerHeight - 100,
  heightMsTeam = window.innerHeight - 120,
}

export enum IsOpenNewTab {
  teamOpenNewTab = "_self",
  openNewTab = "_blank",
}

export enum MahleKIAaccess {
  kiaUrl = "https://mahleforum.com/login-newv2",
}
export enum MessageUserType {
  self = "1",
  other = "2",
}

export enum MessageType {
  systemMessage = "1",
  attachment = "2",
  normalMessage = "3",
}

// Media Types Size
export enum MediaTypeSizes {
  fileSize = "1073741824",
  //imageSize = fileSize,
  //audioSize = fileSize,
  //videoSize = fileSize,
  //docSize = fileSize,
  fileSizeTxt = "1 GB",
}
export enum SendPushType {
  GroupManage = "1",
  RemoveUser = "2",
  GroupLastNameChannge = "3",
  UploadGroupIcon = "4",
  NormalMessage = "5",
}

// Industry Types
export const industryTypes = [
  { id: 1, type: "Printing & Imaging", slug: "printing", class: "printing-image" },
  { id: 2, type: "Automobile", slug: "automobile", class: "automobile" },
  { id: 3, type: "TVS", slug: "tvs", class: "tvs" },
  { id: 4, type: "Product Support", slug: "product-support", class: "product-support" },
  { id: 5, type: "Service Equipment", slug: "service-equipment", class: "service-equipment" }
];

export const frameRange = [
  { id: 1, name: '1 Month' },
  { id: 2, name: '2 Months' },
  { id: 3, name: '3 Months' },
  { id: 4, name: '4 Months' },
  { id: 5, name: '5 Months' },
  { id: 6, name: '6 Months' },
  { id: 7, name: '7 Months' },
  { id: 8, name: '8 Months' },
  { id: 9, name: '9 Months' },
  { id: 10, name: '10 Months' },
  { id: 11, name: '11 Months' },
  { id: 12, name: '12 Months' },
  { id: 13, name: '13 Months' },
  { id: 14, name: '14 Months' },
  { id: 15, name: '15 Months' },
  { id: 16, name: '16 Months' },
  { id: 17, name: '17 Months' },
  { id: 18, name: '18 Months' },
  { id: 19, name: '19 Months' },
  { id: 20, name: '20 Months' },
  { id: 21, name: '21 Months' },
  { id: 22, name: '22 Months' },
  { id: 23, name: '23 Months' },
  { id: 24, name: '24 Months' },
]

export const countryCodes = [
  { cname: 'Afghanistan', id: 93, name: 93 },
  { cname: 'Australia', id: 61, name: 61 },
  { cname: 'Colombia', id: 57, name: 57 },
  { cname: 'France', id: 33, name: 33 },
  { cname: 'Germany', id: 49, name: 49 },
  { cname: 'India', id: 91, name: 91 },
  { cname: 'Nigeria', id: 234, name: 234 },
];

export enum firebaseCredentials {
  emailAddress = "system.integration@collabtic.com",
  password = "collabticintegration2021!",
}
export enum constText {
  silent = "Silent",
  filter = "filter",
  thread = "thread",
  document = "document",
  part = "part",
  ka = "ka",
  kb = "kb",
  sib = "sib",
  gts = "gts"
}
export enum filterNames {
  thread = 'threadFilter',
  document = 'docFilter',
  part = 'partFilter',
  mediaManager = 'mediaFilter',
  escalation = 'escalationFilter',
  search = 'searchPageFilter',
  moreAnnouncement = 'moreAnnouncementFilter',
  dismissedAnnouncement = 'dismissedAnnouncementFilter',
  dashboardAnnouncement = 'dashboardAnnouncementFilter',
  escalationPPFR = 'escalationPPFRFilter',
  knowledgeArticle = 'knowledgeArticleFilter',
  gts = 'gtsFilter',
  sib = 'sibFilter',
  knowledgeBase = 'knowledgeBaseFilter'
}
export enum PageTitleText {
  Home = "Home",
  Threads = "Threads",
  Parts = "Parts",
  Documents = "Documents",
  TechInfo = "Tech Info",
  KnowledgeArticles = "Knowledge Articles",
  KnowledgeBase = "Knowledge Base",
  SIB = "SIB",
  GTS = "GTS",
  Workstreams = "Workstreams",
  MediaManager = "Media Manager",
  Search = "Search",
  DTC = "DTC List"
}
export enum RedirectionPage {
  Home = "landing-page",
  Threads = "threads",
  Parts = "parts",
  Documents = "documents",
  KnowledgeArticles = "knowledgearticles",
  KnowledgeBase = "knowledge-base",
  SIB = "sib",
  GTS = "gts",
  Workstream = "workstreams-page",
  ManageWorkstream = "workstreams",
  MediaManager = "media-manager",
  Search = "search-page",
  Dtc = "dtc"
}
export enum RouterText {
  HOME = "landing-router",
  Threads = "threads-router",
  Parts = "parts-router",
  Documents = "documents-router",
  KnowledgeArticles = "knowledgearticles-router",
  KnowledgeBase = "knowledge-base-router",
  SIB = "sib-router",
  GTS = "gts-router",
  Workstream = "workstreams-page-router",
  MediaManager = "media-manager-router",
  SearchRouter = 'search-router'
}
export const pageTitle = [
  { slug: RedirectionPage.Home, name: PageTitleText.Home, dataInfo: '', routerText: RouterText.HOME, navEdit: RedirectionPage.Home + '-edit', navCancel: RedirectionPage.Home + '-cancel' },
  { slug: RedirectionPage.Threads, name: PageTitleText.Threads, dataInfo: 'threadDataInfo', routerText: RouterText.Threads, navEdit: RedirectionPage.Threads + '-edit', navCancel: RedirectionPage.Threads + '-cancel' },
  { slug: RedirectionPage.Parts, name: PageTitleText.Parts, dataInfo: 'partDataInfo', routerText: RouterText.Parts, navEdit: RedirectionPage.Parts + '-edit', navCancel: RedirectionPage.Parts + '-cancel' },
  { slug: RedirectionPage.Documents, name: PageTitleText.Documents, dataInfo: 'docDataInfo', routerText: RouterText.Documents, navEdit: RedirectionPage.Documents + '-edit', navCancel: RedirectionPage.Documents + '-cancel' },
  { slug: RedirectionPage.Documents, name: PageTitleText.TechInfo, dataInfo: 'docDataInfo', routerText: RouterText.Documents, navEdit: RedirectionPage.Documents + '-edit', navCancel: RedirectionPage.Documents + '-cancel' },
  { slug: RedirectionPage.KnowledgeArticles, name: PageTitleText.KnowledgeArticles, dataInfo: 'kaDataInfo', routerText: RouterText.KnowledgeArticles, navEdit: RedirectionPage.KnowledgeArticles + '-edit', navCancel: RedirectionPage.KnowledgeArticles + '-cancel' },
  { slug: RedirectionPage.KnowledgeBase, name: PageTitleText.KnowledgeBase, dataInfo: 'kbDataInfo', routerText: RouterText.KnowledgeBase, navEdit: RedirectionPage.KnowledgeBase + '-edit', navCancel: RedirectionPage.KnowledgeBase + '-cancel' },
  { slug: RedirectionPage.SIB, name: PageTitleText.SIB, dataInfo: 'sibDataInfo', routerText: RouterText.SIB, navEdit: RedirectionPage.SIB + '-edit', navCancel: RedirectionPage.SIB + '-cancel' },
  { slug: RedirectionPage.GTS, name: PageTitleText.GTS, dataInfo: 'gtsDataInfo', routerText: RouterText.GTS, navEdit: RedirectionPage.GTS + '-edit', navCancel: RedirectionPage.GTS + '-cancel' },
  { slug: RedirectionPage.Workstream, name: PageTitleText.Workstreams, dataInfo: '', routerText: RouterText.Workstream, navEdit: RedirectionPage.Workstream + '-edit', navCancel: RedirectionPage.Workstream + '-cancel' },
  { slug: RedirectionPage.Search, name: PageTitleText.Search, dataInfo: '', routerText: RouterText.SearchRouter, navEdit: RedirectionPage.Search + '-edit', navCancel: RedirectionPage.Search + '-cancel' },
  { slug: RedirectionPage.MediaManager, name: PageTitleText.MediaManager, dataInfo: '', routerText: RouterText.MediaManager, navEdit: RedirectionPage.MediaManager + '-edit', navCancel: RedirectionPage.MediaManager + '-cancel' },
];
export enum silentItems {
  silentThreadFilter = "silentThreadFilter",
  silentPartFilter = "silentPartFilter",
  silentDocumentFilter = "silentDocumentFilter",
  silentKAFilter = "silentKAFilter",
  silentKBFilter = "silentKBFilter",
  silentSIBFilter = "silentSIBFilter",
  silentGTSFilter = "silentGTSFilter",
  silentThreadCount = "silentThreadCount",
  silentPartCount = "silentPartCount",
  silentDocumentCount = "silentDocumentCount",
  silentKACount = "silentKaCount",
  silentKBCount = "silentKBCount",
  silentSIBCount = "silentSIBCount",
  silentGTSCount = "silentGTSCount"
}
export const PushTypes = [
  { id: 12, type: 'silent', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 1, type: 'normal', url: RedirectionPage.Threads, filter: filterNames.thread, silentFilter: silentItems.silentThreadFilter, silentCount: silentItems.silentThreadCount, pageInfo: pageInfo.threadsPage },
  { id: 22, type: 'silent', url: RedirectionPage.Documents, filter: filterNames.document, silentFilter: silentItems.silentDocumentFilter, silentCount: silentItems.silentDocumentCount, pageInfo: pageInfo.documentPage },
  { id: 23, type: 'normal', url: RedirectionPage.Documents, filter: filterNames.document, silentFilter: silentItems.silentDocumentFilter, silentCount: silentItems.silentDocumentCount, pageInfo: pageInfo.documentPage },
  { id: 24, type: 'silent', url: RedirectionPage.Parts, filter: filterNames.part, silentFilter: silentItems.silentPartFilter, silentCount: silentItems.silentPartCount, pageInfo: pageInfo.partsPage },
  { id: 0, type: 'normal', url: RedirectionPage.Parts, filter: filterNames.part, silentFilter: silentItems.silentPartFilter, silentCount: silentItems.silentPartCount, pageInfo: pageInfo.partsPage },
  { id: 25, type: 'silent', url: RedirectionPage.KnowledgeArticles, filter: filterNames.knowledgeArticle, silentFilter: silentItems.silentKAFilter, silentCount: silentItems.silentKACount, pageInfo: pageInfo.knowledgeArticlePage },
  { id: 0, type: 'normal', url: RedirectionPage.KnowledgeArticles, filter: filterNames.knowledgeArticle, silentFilter: silentItems.silentKAFilter, silentCount: silentItems.silentKACount, pageInfo: pageInfo.knowledgeArticlePage },
  { id: 26, type: 'silent', url: RedirectionPage.GTS, filter: filterNames.gts, silentFilter: silentItems.silentGTSFilter, silentCount: silentItems.silentGTSCount, pageInfo: pageInfo.gtsPage },
  { id: 0, type: 'normal', url: RedirectionPage.GTS, filter: filterNames.gts, silentFilter: silentItems.silentGTSFilter, silentCount: silentItems.silentGTSCount, pageInfo: pageInfo.gtsPage },
  { id: 27, type: 'silent', url: RedirectionPage.SIB, filter: filterNames.sib, silentFilter: silentItems.silentSIBFilter, silentCount: silentItems.silentSIBCount, pageInfo: pageInfo.sibPage },
  { id: 0, type: 'normal', url: RedirectionPage.SIB, filter: filterNames.sib, silentFilter: silentItems.silentSIBFilter, silentCount: silentItems.silentSIBCount, pageInfo: pageInfo.sibPage },
  { id: 28, type: 'silent', url: RedirectionPage.KnowledgeBase, filter: filterNames.knowledgeBase, silentFilter: silentItems.silentKBFilter, silentCount: silentItems.silentKBCount, pageInfo: pageInfo.knowledgeBasePage },
  { id: 0, type: 'normal', url: RedirectionPage.KnowledgeBase, filter: filterNames.knowledgeBase, silentFilter: silentItems.silentKBFilter, silentCount: silentItems.silentKBCount, pageInfo: pageInfo.knowledgeBasePage },
  { id: 9, type: 'social', url: '', filter: '', silentFilter: '', silentCount: '', pageInfo: '' },
  { id: 10, type: 'silent', url: '', filter: '', silentFilter: '', silentCount: '', pageInfo: '' }
]

export enum GTSPage {
  start = 'start-page',
  procedure = 'procedure-page',
  gts = 'gts-page'

}

export enum ManageTitle {
  actionNew = 'New',
  actionEdit = 'Edit',
  actionDelete = 'Delete',
  thread = 'Thread',
  feedback = 'Feedback'
}

export const MediaUpload = [
  {tab: 'media', title: "Media Manager", isSelected: true, isActive: true, class: "tab-col media"},
  {tab: 'google-drive', title: "Google Drive", isSelected: false, isActive: false, class: "tab-col google-drive disable"},
  {tab: 'drop-box', title: "Dropbox", isSelected: false, isActive: false, class: "tab-col drop-box disable"},
]