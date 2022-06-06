import { Component, HostListener, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Router } from "@angular/router";
import { PlatformLocation } from "@angular/common";
import { AppService } from 'src/app/modules/base/app.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { pageTitle, RedirectionPage } from 'src/app/common/constant/constant';
import { Title } from '@angular/platform-browser';
import { Subscription } from "rxjs";
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  styles: [
    `.masonry-item { width: 210px; }
      .masonry-item {
        transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
      }`
  ]
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  @Input() accessFrom: string = "documents";
  //@Input() docData: any = [];
  subscription: Subscription = new Subscription();

  public teamSystem = localStorage.getItem('teamSystem');
  public bodyElem;
  public bodyHeight: number;
  public priorityIndexValue='';
  
  public innerHeight: number = 0;
  public docRowHeight: number = 0;
  public innerRecentViewWidth: number = 0;
  public thumbView: boolean = true;
  public displayNoRecords: boolean = false;
  public loading: boolean = true;
  public fileLoader: boolean = false;
  public contentLoading: boolean = true;
  public lazyLoading: boolean = false;
  public scrollInit: number = 0;
  public fromSearchpage:string ='';
  public searchText:string ='';
  public contentTypeValue:number = 4;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public scrollPos: number = 0;
  public sconfig: PerfectScrollbarConfigInterface = {};
  public partType: string = "";
  public searchVal: string = '';
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public domainId = 1;
  public countryId;
  public apiKey: string = this.appService.appData.apiKey;
  public itemLength: number = 0;
  public itemTotal: number = 0;
  public groupInfo: any = [];
  public docApiCall;
  public docWsApiCall;
  recentViewedDocuments: any;
  recentUploadedDocuments = [];
  user: any;
  public userId: any;
  public assetPartPath: string = 'assets/images/documents/';
  public chevronImg: string = `${this.assetPartPath}chevron.png`;
  public apiData: any = [];
  roleId: any;
  files:any= [];
  folders:any = [];
  folderLists: any = [];
  subFolderLists: any = [];
  folderInfo: any = [];
  subFolderInfo: any = [];
  subFolderCount: number = 0;
  public filterOptions: any = [];
  public documentIdArrayInfo: any=[];
  public docAPiCount:any='';
  scrollCount: number = 0;
  lastFilesCount: number = 0;
  lastFoldersCount: number = 0;
  public viewTxt: string = "viewed";
  public uploadTxt: string = "uploaded";
  public recentTxt: string = "recently";
  public docInfoData: any = {};
  public folderId: any = '';
  public subFolderId: any = '';
  public pinFlag: boolean = false;
  public loadMainView: boolean = false;
  public mainView: boolean = true;
  public folderView: boolean = false;
  public subFolderView: boolean = false;
  public fileView: boolean = false;
  public folderFlag: boolean = false;
  public filesFlag: boolean = false;
  public panelFlag: boolean = false;
  public filterFlag: boolean = true;
  public tabFlag: boolean = false;
  public tab: string = this.viewTxt;
  public pushFolders: any = [];
  public docApiData: any = [];
  public recentTabs: any = [{
    control: this.viewTxt,
    href: `#${this.viewTxt}`,
    id: `${this.viewTxt}-tab`,
    selected: false,
    title: `${this.recentTxt} ${this.viewTxt}`,
    toggle: 'tab'
  },
  {
    control: this.uploadTxt,
    href: `#${this.uploadTxt}`,
    id: `${this.uploadTxt}-tab`,
    selected: false,
    title: `${this.recentTxt} ${this.uploadTxt}`,
    toggle: 'tab'
  }]; 
  public loadDataEvent: boolean=false;
  public searchnorecordflag: boolean = true;
  public searchLoading: boolean = true;
  public opacityFlag: boolean = false;
  public loadAction: string = '';
  
  constructor(
    private router: Router,
    private location: PlatformLocation,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private appService: AppService,
    private titleService: Title,
    private documentationService: DocumentationService,
    public apiUrl: ApiService) {
      this.titleService.setTitle(localStorage.getItem('platformName')+' - Documents');
      this.location.onPopState (() => {
        let url = this.router.url.split('/');
        if(url[1] == RedirectionPage.Documents) {                
          this.opacityFlag = true;
          setTimeout(() => {
            this.bodyElem = document.getElementsByTagName("body")[0];
            this.bodyElem.classList.add('landing-page');
            setTimeout(() => {
              if(this.fileView) {
                let docInfoNav = localStorage.getItem('docInfoNav');
                if(docInfoNav) {
                  setTimeout(() => {
                    localStorage.removeItem('docInfoNav');
                  }, 100);
                  let data = {
                    action: 'folder-layout',
                    access: 'folder-layout'
                  }
                  this.commonApi.emitMessageLayoutrefresh(data)
                }
                let id = localStorage.getItem('docId');
                let fileIndex = this.files.findIndex(option => option.resourceID == id);
                if(fileIndex >= 0) {
                  this.scrollToElem(id);
                }
              }
            }, 500);
          }, 5);
        }
        if(url[1] == RedirectionPage.Search) {          
          if(this.apiUrl.searchPageRedirectFlag == "1"){ 
            this.commonApi.emitSearchValuetoHeader("");
            this.apiUrl.searchPageRedirectFlag = "2";           
            this.opacityFlag = true;       
            setTimeout(() => {              
              this.bodyElem = document.getElementsByTagName("body")[0];
              this.bodyElem.classList.add('landing-page');
              this.docApiData.filterOptions ="";
              this.fromSearchpage='';
              this.docApiData.fromSearch=this.fromSearchpage; 
              this.searchText=""; 
              this.docApiData.searchText=this.searchText;
              this.priorityIndexValue ="";              
              this.docApiData.priorityIndex = this.priorityIndexValue; 
              this.docApiData.expand = false;   
              let sNavUrl = localStorage.getItem('sNavUrl'); 
              if(sNavUrl == 'documents' ){
                this.loadAction = '';               
                this.loading = false;                             
                this.mainView = true;
                this.accessFrom = 'documents';
                this.fileView =  false;
                setTimeout(() => { 
                  this.emptyPanel();  
                  this.getdocumentForTab(1, 0);
                  this.getdocumentForTab(0, 1);                      
                  setTimeout(() => {
                    this.innerRecentViewWidth = document.getElementsByClassName('document-tab')[0].clientWidth - 15;                  
                  }, 150); 
                  this.opacityFlag = false;
                  localStorage.removeItem('sNavUrl');  
                }, 500);  
              }
              else{
                this.fileView =  true;  
                this.mainView = false;
                this.accessFrom = 'landingpage';
                this.itemOffset = 0;
                this.loading = false;  
                this.contentLoading = false;
                this.loadAction = 'push';
                this.files = []; 
                setTimeout(() => { 
                  this.getDocumentList();  
                  //this.opacityFlag = false;            
                  localStorage.removeItem('sNavUrl');
              }, 150);
              }
            }, 5);
          }
        }
      });
    }

  ngOnInit(): void {
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    let tab = localStorage.getItem('documentTab');
    this.tab = (tab == 'undefined' || tab == undefined) ? this.tab : tab;
    for(let t of this.recentTabs) {
      t.selected = (t.control == this.tab) ? true : false;
    }

    // Remove when silent push enabled
    let pageIndex = pageTitle.findIndex(option => option.slug == RedirectionPage.Documents);
    let navEditText = pageTitle[pageIndex].navEdit;
    localStorage.removeItem(navEditText);

    this.apiData = {
      apiKey: this.apiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      dataId: 0,
      platformId: 3,
    };

    this.docApiData = {
      'platform': 3,
      'type': '',
      'isContentDetail': '',
      'resourceId': '',
      'recentHistory': 0,
      'offset': this.itemOffset,
      'limit': this.itemLimit,
      'apiKey': this.apiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'threadIdArray':[],
      'threadCount':'0',
      'priorityIndex':'',
      'syncWithThreadFromDoc': '',
      'folderId': '',
      'makeId': '',
      'recentUploaded': 0
    };

    this.docInfoData = {
      action: 'load',
      dataId: 0,
      docData: [],
      loading: true
    };

    console.log(564, this.accessFrom)

    this.subscription.add(
      this.commonApi.documentPanelDataReceivedSubject.subscribe((response) => {
        console.log(response)
        this.panelFlag = response['panelFlag'];
        if(!this.panelFlag) {
          this.priorityIndexValue = "1";
          this.documentIdArrayInfo=[];
          this.docAPiCount='0';
          
          console.log(this.docInfoData)
          //this.scrollToPos(this.docInfoData.docData.resourceID);
          if(this.recentViewedDocuments.length > 0) {
            this.recentViewedDocuments.forEach((v, i) => {
              let enable = (i == 0) ? 1 : 0;
              v.docData.expand = enable;
            });
          }
          if(this.recentUploadedDocuments.length > 0) {
            this.recentUploadedDocuments.forEach((u, i) => {
              let enable = (i == 0) ? 1 : 0;
              u.docData.expand = enable;
            });
          }
        } else {
          let docDetail = response['docDetail'];
          let id = docDetail.resourceID;
          this.docInfoData.action = 'load';
          this.docInfoData.docData = docDetail;
          this.emitDocInfo(id);
        }
      })
    );

    this.subscription.add(
      this.commonApi.documentListDataReceivedSubject.subscribe((docsData: any) => {
        console.log(docsData)
        this.priorityIndexValue = "1";
        this.documentIdArrayInfo=[];
        this.docAPiCount='0';
        this.loadAction = docsData['loadAction'];
        this.displayNoRecords = false;
        let action = docsData['action'];
        this.thumbView = docsData['thumbView'];
        switch (action) {
          case 'filter-toggle':
          case 'toggle':
            this.filterFlag = (action == 'filter-toggle') ? docsData['expandFlag'] : this.filterFlag;
            this.panelFlag = (action == 'toggle') ? docsData['expandFlag'] : this.panelFlag;
            console.log(this.panelFlag)
            if(action == 'toggle') {
              console.log(this.docInfoData)
              //this.scrollToPos(this.docInfoData.docData.resourceID);
            }
            this.loading = true;
            setTimeout(() => {
              this.setupRecentTabWidth(action, docsData['expandFlag']);
            }, 100);
            this.loading = false;
            break;
          case 'view':
            this.loading = false;
            break;
          case 'subFolders':
            this.subFolderCount = docsData['subFolderCount'];
            //console.log(this.subFolderId, docsData['folderId'])
            this.breadcrumb(action, this.subFolderId, docsData['folderId']);
            break;
          case 'folders':
          case 'files':
            this.opacityFlag = false;
            this.subFolderCount = docsData['subFolderCount'];  
            //this.emptyPanel();
            setTimeout(() => {
              this.breadcrumb(action, docsData['folderId']);  
            }, 50);
            break;
          case 'landingpage':  
          case 'search':
            this.loading = true;
            this.accessFrom = action;
            this.emptyPanel();
            this.fromLandingAccess(docsData);
            setTimeout(() => {
              this.loading = false;
            }, 100);
            break;  
          case 'folder-creation':
            if(this.mainView) {
              console.log('-----1-----')
              this.getDocumentList(action);
            }          
            break; 
          case 'pin':
            //this.emptyPanel();
            this.pinFlag = docsData['pinFlag'];
            action = (this.pinFlag) ? 'files' : 'main';
            this.breadcrumb(action);
            break;    
          default:
            this.emptyPanel();
            this.loading = true;
            this.filterOptions = docsData.filterOptions;
            if(action == 'filter') {
              this.itemOffset = 0;
              this.panelFlag = false;
              if(!this.mainView) {
                action = (this.folderView) ? 'folders' : (this.subFolderView) ? 'subFolders' : 'files';
                this.breadcrumb(action, this.subFolderId, this.folderId);
              } else {
                if(action != 'filter') {
                  this.tabFlag = false;
                  this.recentViewedDocuments = [];
                  this.recentUploadedDocuments = [];
                  this.docInfoData.dataId = 0;
                } else {
                  this.recentViewedDocuments.forEach(t => {
                    t.selected = false;
                  });
                  this.recentUploadedDocuments.forEach(t => {
                    t.selected = false;
                  });
                  setTimeout(() => {
                    this.setupRecentTabWidth(action, this.panelFlag);
                  }, 100);
                }      
                if(this.loadAction != 'push') {     
                  this.files = [];
                  this.folders = [];
                }
              }
            }          
            
            if(this.accessFrom == 'documents') {
              if(this.mainView) {
                if(action != 'filter') {
                  this.getdocumentForTab(1, 0);
                  this.getdocumentForTab(0, 1);
                  
                  setTimeout(() => {
                    this.innerRecentViewWidth = document.getElementsByClassName('document-tab')[0].clientWidth - 15;                  
                  }, 150);
                } else {
                  console.log('-----2-----')
                  this.getDocumentList();
                }
              }
              this.loading = false;
            } else {
              console.log(4564)
              this.fromLandingAccess(docsData);
            }         
            break;
        }
        this.bodyHeight = window.innerHeight;
        this.setScreenHeight();      
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r) => {
        let action = r['action'];
        console.log(r)
        switch(action) {
          case 'side-menu':
            let access = r['access'];
            let page = r['page'];
            console.log(access)
            if(access == 'Tech Info' || page == 'documents') {
              this.opacityFlag = false;
              let section = (this.fileView) ? 'file-layout' : 'folder-layout';
              let data = {
                action: section,
                access: section
              }
              this.commonApi.emitMessageLayoutrefresh(data);
            }
            break;
          case 'doc-push':
            let cpushData = r['pushData'];
            let folders = JSON.parse(cpushData.fileCount);
            let wsFlag = cpushData.wsFlag;
            this.contentLoading = false;
            let timeout = (this.mainView) ? 0 : 1000;
            setTimeout(() => {
              this.getdocumentForTab(0, 1, action);
              this.recentTabs[0].selected = false;
              this.recentTabs[1].selected = true;
            }, timeout);
            //setTimeout(() => {
              console.log(folders, this.folders)
              folders.forEach(item => {
                let fid = item.id;
                let fcount = item.fileCount;
                let sfcount = item.subFolderCount;
                if(this.mainView || this.folderView) {
                  let findex = this.folders.findIndex(option => option.id == fid);
                  if(findex >= 0) {
                    this.folders[findex].fileCount = fcount;
                    this.folders[findex].subFolderCount = sfcount;
                  }
                }
                
                if(this.fileView) {
                  console.log(this.subFolderId, fid)
                  this.contentLoading = false;
                  if(this.subFolderId == parseInt(fid)) {
                    console.log('-----3-----')
                    this.loadAction = 'push';
                    this.getDocumentList('push');
                  }
                }
                return false;
              });
            //}, 1000);
            break; 
          case 'silentDelete':
            let dataId = r['dataId'];
            if(this.mainView) {
              let rvIndex = this.recentViewedDocuments.findIndex(option => option.resourceID == dataId);
              if(rvIndex >= 0) {
                this.recentViewedDocuments.splice(rvIndex, 1);
              }
              let ruIndex = this.recentUploadedDocuments.findIndex(option => option.resourceID == dataId);
              if(ruIndex >= 0) {
                this.recentViewedDocuments.splice(rvIndex, 1);
              }
              setTimeout(() => {
                this.contentLoading = true;
                this.itemOffset = 0;
                this.getdocumentForTab(1, 0);
                this.getdocumentForTab(0, 1);
                this.getDocumentList();
                let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
                this.innerRecentViewWidth = documentWidth + 200;
                let section = (this.fileView) ? 'file-layout' : 'folder-layout';
                let data = {
                  action: section,
                  access: section
                }
                this.commonApi.emitMessageLayoutrefresh(data);
              }, 500);
            } else {
              let fileIndex = this.files.findIndex(option => option.resourceID === dataId);
              this.files.splice(fileIndex, 1);
              
              setTimeout(() => {
                let fileLen = this.files.length;
                console.log(fileLen)
                if(fileLen > 0) {
                  console.log('in')
                  fileIndex = (fileIndex > 0 || fileIndex == fileLen) ? fileIndex-1 : fileIndex+1;
                  console.log(fileIndex)
                  this.scrollToElem(this.files[fileIndex].resourceID);
                }
                let fileData = {
                  access: this.accessFrom,
                  items: this.files,
                  thumbView: this.thumbView
                }
                this.commonApi.emitFileList(fileData);  
              }, 100);
            }
            return false;
            break;  
          case 'updateLayout':
            this.commonApi.emitMessageLayoutChange(true);
            break;     
        }
      })
    );

    this.docApiCall = this.commonApi.documentApiCallSubject.subscribe(docsData => {
      console.log(docsData)
      this.titleService.setTitle(localStorage.getItem('platformName')+' - Workstreams');
      this.displayNoRecords = false;
      let action = docsData['action'];
      this.thumbView = docsData['thumbView'];
      this.loading = true;
      this.accessFrom = action;
      this.emptyPanel();
      this.fromLandingAccess(docsData);
      setTimeout(() => {
        this.loading = false;
        this.docApiCall.unsubscribe();
      }, 100);
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();      
    });

    this.docWsApiCall = this.commonApi.documentWSApiCallSubject.subscribe(docsData => {
      console.log(docsData)
      let action = docsData['action'];
      if(action == 'unsubscribe') {
        this.docWsApiCall.unsubscribe();
        return false;          
      } else {
        this.titleService.setTitle(localStorage.getItem('platformName')+' - Workstreams');
        this.displayNoRecords = false;
        let action = docsData['action'];
        this.thumbView = docsData['thumbView'];
        this.loading = true;
        this.accessFrom = action;
        this.emptyPanel();
        this.fromLandingAccess(docsData);
        setTimeout(() => {
          this.loading = false;
          this.docApiCall.unsubscribe();
        }, 100);
        this.bodyHeight = window.innerHeight;
        this.setScreenHeight();
      }
      setTimeout(() => {
        this.loading = false;
        this.docWsApiCall.unsubscribe();
      }, 100);
    });
    
    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r: any) => {
        if(this.mainView && (r != this.panelFlag)) {
          this.panelFlag = r;
          this.priorityIndexValue = "1";
          this.documentIdArrayInfo=[];
          this.docAPiCount='0';
          
          let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
          if(this.recentUploadedDocuments.length == 0 || this.recentViewedDocuments.length == 0) {
            this.innerRecentViewWidth = documentWidth;
          } else {
            if (!this.panelFlag) {
              let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
              this.innerRecentViewWidth = documentWidth + 200;
            } else {
              let documentWidth = document.getElementsByClassName('document-tab')[0].clientWidth;
              this.innerRecentViewWidth = documentWidth - 260;
            }
          }
        }
      })
    );

    this.subscription.add(
      this.commonApi.docScroll.subscribe((response) => {
        console.log(response, this.fileView, this.panelFlag);
        let flag = response['expand'];
        let access = response['access'];
        if(this.fileView && (access == 'files' && !this.panelFlag) || (!flag && access == 'toggle')) {
          if(this.thumbView && document.getElementsByClassName('documents-grid-row')) {
            this.docRowHeight = document.getElementsByClassName('documents-grid-row')[0].clientHeight;
            document.getElementById('documentList').style.height = `${this.docRowHeight} px`;
          }
          setTimeout(() => {
            this.scrollToPos(response['id'], flag);
          }, 750);
        }      
      })
    );    
  }

  scrollToPos(id, flag) {
    this.panelFlag = flag;
    let docElement = document.getElementById(id);
    let rmVal = (flag) ? 0 : -80;
    if(docElement != null) {
      console.log(flag, docElement.offsetTop, rmVal)
      this.scrollPos = docElement.offsetTop+rmVal;
      let secElement = document.getElementById('documentList');
      setTimeout(() => {
        secElement.scrollTop = this.scrollPos;
      }, 200);
    }
  }

  // Get Recent Document Lists
  getdocumentForTab(recentHistory, recentUploaded, action = '') {
    let expand = (this.panelFlag) ? 0 : 1;
    this.docApiData.offset = 0;
    this.docApiData.limit = 10;
    this.docApiData.folderId = 0;
    this.docApiData.makeId = 0;
    this.docApiData.type = '';
    this.docApiData.filterOptions = [];
    this.docApiData.recentHistory = recentHistory;
    this.docApiData.recentUploaded = recentUploaded;
    this.docApiData.expand = expand;
    
    this.documentationService.getALLDocument(this.docApiData).then((documents: any) => {
      let dataId = -1;
      let flag = false;
      let tabLoader = documents.loader;
      console.log(documents)
      this.tabFlag = !tabLoader;
      if(!tabLoader) {
        if (recentUploaded == 1 && action == '') {
          this.recentUploadedDocuments = documents.files;
          console.log('-----4-----')
          this.getDocumentList();
        }
        if (documents.files.length > 0) {
          if (recentHistory == 1)
            this.recentViewedDocuments = documents.files;
            setTimeout(() => {
              console.log(this.docInfoData.dataId)
              this.recentViewedDocuments = (this.recentViewedDocuments == 'undefined' || this.recentViewedDocuments == undefined) ? [] : this.recentViewedDocuments;
              if(this.docInfoData.dataId <= 0 && (this.recentViewedDocuments != 'undefined' || this.recentViewedDocuments != undefined) && (this.recentViewedDocuments.length > 0)) {
                console.log(this.recentViewedDocuments)
                //this.tabFlag = true;
                if(this.tab != 'viewed') {
                  this.recentTab('trigger', this.recentTabs[1]);
                  localStorage.removeItem('documentTab');
                }              
              }  
            }, 500);
                      
        } else {
          this.recentViewedDocuments = [];
          this.recentUploadedDocuments = [];
        }
      }      
    });
  }
  
  getDocumentList(action='') {
    console.log(action)
    let newFolder='';
    if(action=='folder-creation' || action == 'push')
    {
      this.itemOffset=0;
      this.itemLimit=1;
      setTimeout(() => {
        this.itemLimit = 20;
      }, 100);
      newFolder = (action == 'folder-creation') ? '1' : newFolder;
    }
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.contentLoading = (this.loadAction == 'push' || action == 'push') ? false : true;
    if(this.loadAction == 'load') {
      let timeout = (this.mainView) ? 0 : 500;
      setTimeout(() => {
        this.getdocumentForTab(0, 1);
        this.recentTabs[0].selected = false;
        this.recentTabs[1].selected = true;
      }, timeout);
    }
    this.fileLoader = this.contentLoading;
    setTimeout(() => {
      this.loadAction = '';
    }, 150);
    let expand = (this.panelFlag) ? 0 : 1;
    let filterOptions = JSON.stringify(this.filterOptions);
    let threadIdArrayInfo1 = JSON.stringify(this.documentIdArrayInfo);
    
    this.docApiData.offset = this.itemOffset;
    this.docApiData.limit = this.itemLimit;
    this.docApiData.type = (this.pinFlag) ? 'pinned' : '';
    this.docApiData.folderId = this.subFolderId;
   
    this.docApiData.makeId = this.folderId;
    this.docApiData.filterOptions =filterOptions;
    this.docApiData.fromSearch=this.fromSearchpage;
    this.docApiData.searchText=this.searchText;
    this.docApiData.isNewFolder=newFolder;
    this.docApiData.recentHistory = 0;
    this.docApiData.recentUploaded = 0;
    this.docApiData.expand = expand;
   
    if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {      
      this.docApiData.threadIdArray = threadIdArrayInfo1;
      this.docApiData.threadCount=this.docAPiCount;
      console.log(this.docInfoData)
      this.docApiData.groups = this.groupInfo;
      this.docApiData.fromWorkstreampage = 1;
    }
    if(this.accessFrom == 'search')
    { 
      if (this.priorityIndexValue) {
        this.docApiData.priorityIndex = this.priorityIndexValue;
      } else {       
        this.docApiData.priorityIndex = '1';
      }
    }
   
    this.documentationService.getALLDocument(this.docApiData).then((documents: any) => {
      if(this.accessFrom == 'documents') {
        //console.log(filterOptions)
        localStorage.setItem('docFilter', filterOptions);
      }
      this.contentLoading = documents.loader;
      if (!this.contentLoading) {
        console.log(documents)
        this.lazyLoading = this.contentLoading;
        this.loadDataEvent=false; 
        this.scrollCallback = true;
        
        if(this.accessFrom == 'search'){
          let priorityIndexValue = documents.priorityIndexValue;
          let threadIdArrayInfo_1 = documents.docInfoArray;
          this.docAPiCount=documents.total;
          console.log(threadIdArrayInfo_1);
          
          // Search Page - Getting 'No records found' message even if we have records -- start
          switch(priorityIndexValue){
            case "1":                       
              if (documents.total>0) { 
                this.searchnorecordflag = false;
              }                      
            break;
            case "2":               
              if (documents.total>0) { 
                this.searchnorecordflag = false;
              }         
            break;
            case "3":               
              if (documents.total>0) { 
                this.searchnorecordflag = false;
              }                      
            break;  
            case "4":               
              if (documents.total>0) {
                this.searchnorecordflag = false;
              }
              else{
                this.searchnorecordflag = false;  
              }         
            break;         
          }     
          if (priorityIndexValue < "5" && priorityIndexValue) {  
            if(!this.searchnorecordflag){
              this.searchLoading = false;            
            }             
          }
          else{  
            this.searchLoading = false;
            this.searchnorecordflag = false;
          }
                   
          // Search Page - Getting 'No records found' message even if we have records -- end

          if (threadIdArrayInfo_1 && threadIdArrayInfo_1.length>0) {             
            for (var t1 = 0; t1 < threadIdArrayInfo_1.length; t1++) {
              this.documentIdArrayInfo.push(threadIdArrayInfo_1[t1]);
            }
          }
          console.log(JSON.stringify(this.documentIdArrayInfo));
          if (priorityIndexValue < "4" && priorityIndexValue) {
            let limitoffset = this.itemOffset + this.itemLimit;
            if (documents.total == 0 || limitoffset >= documents.total) {
              priorityIndexValue = parseInt(priorityIndexValue) + 1;
  
              this.priorityIndexValue = priorityIndexValue.toString();
              this.itemOffset = 0;
              console.log('-----5-----')
              this.getDocumentList();
             
              this.loadDataEvent = true; 
            }
          }
        }
        this.scrollInit = 1;
        this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
        console.log(this.fileView)
        if(this.fileView) {
          this.itemLength += documents.files.length;
          this.loading = false; this.contentLoading = this.loading;
          if(action == 'push') {
            this.files.unshift(...documents.files);
            let fileData = {
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            this.commonApi.emitFileList(fileData);
          } else {
            this.files.push(...documents.files);
          }

          if(this.itemOffset >= this.itemLimit) {
            this.fileLoader = this.contentLoading;
            let fileData = {
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            this.commonApi.emitFileList(fileData);
          } else {
            setTimeout(() => {
              if(document.getElementsByClassName('documents-grid-row'))
              {
                this.docRowHeight = document.getElementsByClassName('documents-grid-row')[0].clientHeight;                
              }
             
              this.fileLoader = this.contentLoading;
            },100)
            if(this.files.length > 0) {
              this.opacityFlag = false;
              if(this.subFolderView) {
                this.panelFlag = true;
              }
            } else {
              this.opacityFlag = false;
              this.emptyPanel();
            }
          }
        } else {
          this.itemLength += documents.folders.length;
          this.loading = false; this.contentLoading = this.loading;
          if(this.loadAction == 'push') {
            this.folders = documents.folders;
          } else {
            this.folders.push(...documents.folders);
          }
        }
        this.folderInfo = documents.folderInfo;
        this.subFolderInfo = documents.makeInfo;
        let secElement = document.getElementById('documentList');
        setTimeout(() => {
          secElement.scrollTop = this.scrollPos;
        }, 200);

        setTimeout(() => {
          let listItemHeight;
          console.log(this.accessFrom)
          let rmHeight = 10;
          if(document.getElementsByClassName('documents-grid-row')) {
            listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)-rmHeight;
          }
        
          //let listItemHeight = (document.getElementsByClassName('documents-grid-row')[0].clientHeight)-10;
          console.log(this.itemTotal, this.itemLength, this.innerHeight, listItemHeight)
          if(this.itemTotal > this.itemLength && this.innerHeight > listItemHeight) {
            this.scrollCallback = false;
            this.lazyLoading = true;
            this.loadDataEvent = true; 
            this.itemOffset += this.itemLimit;   
            if(this.accessFrom == 'documents') {
              if(!this.thumbView && this.fileView){
                console.log('-----6-----')
                this.getDocumentPGList();
              }
              else{
                console.log('-----7-----')
                this.getDocumentList();
              } 
            }       
            else{
              console.log('-----8-----')
              setTimeout(() => {
                this.getDocumentList();
                if(this.accessFrom == 'landing') {
                  let wsResData = {
                    access: 'documents'
                  }
                  this.commonApi.emitWorkstreamListData(wsResData);
                }  
              }, 500);
            }            
            this.lastScrollTop = this.scrollTop;
          }
        }, 500)
      }
    });
  }

  // Recent Tab
  recentTab(tabAction, tab) {
    console.log(tab);
    this.panelFlag = false;
    this.setupRecentTabWidth('toggle', this.panelFlag);
    let selected = (tabAction == 'trigger') ? false : tab.selected;
    let action = tab.control;
    if(!selected) {
      let dataId = -1;
      let docAction = 'callback';
      this.docInfoData.docData = [];
      this.docInfoData.action = docAction;
      let tabData = {
        access: 'tab',
        docData: [],
        flag: false
      }
      this.commonApi.emitDocumentPanelFlag(tabData)
      this.emitDocInfo(dataId);  
      setTimeout(() => {
        this.recentTabs.forEach(t => {
          t.selected = (t.control == action) ? true : false;
        });
      }, 100);
    }
    setTimeout(() => {
      if(action == 'uploaded') {
        this.deselectTab(this.recentViewedDocuments);
      } else {
        this.deselectTab(this.recentUploadedDocuments);
      }
    }, 100);
  }

  // Deselect Tab
  deselectTab(item) {
    item.forEach(i => {
      i.selected = false;
    });
  }

  // Document Selection
  docSelection(list, item) {
    for(let d of list) {
      d.selected = (parseInt(d.resourceID) == item.resourceID) ? true : false;
    }
    console.log(list, this.panelFlag)
    //if(!this.panelFlag) {
      let data = {
        access: 'documents',
        flag: this.panelFlag,
        docData: item.docData
      }
      this.commonApi.emitDocumentPanelFlag(data);
    //}
    let timeout = (this.panelFlag) ? 0 : 100;
    setTimeout(() => {
      let id = item.resourceID
      this.docInfoData.action = 'load';
      this.docInfoData.docData = item.docData;
      this.emitDocInfo(id);      
    }, timeout);
  }

  // Emit Document Info
  emitDocInfo(dataId) {
    console.log(dataId, this.docInfoData)
    this.docInfoData.loading = true;
    this.docInfoData.dataId = dataId;
    this.commonApi.emitDocumentInfoData(this.docInfoData);
    if(this.docInfoData.action != 'empty') {
      this.apiData.dataId = dataId;
      this.documentationService.getDocumentDetail(this.apiData).then((docData: any) => {});
    }
  }

  // Clear Page
  clearSection(item = '') {
    let emptyVal = 0;
    this.scrollTop = emptyVal;
    this.scrollInit = emptyVal;
    this.lastScrollTop = emptyVal;
    this.scrollPos = emptyVal;
    this.itemOffset = emptyVal;
    this.itemLength = emptyVal;
    this.itemTotal = emptyVal;
    this.docInfoData.action = 'empty';
    this.docInfoData.docData = [];
    let dataId = -1;
    this.emitDocInfo(dataId);
  }

  breadcrumb(action, id='', sid='') {
    console.log(action, id, this.subFolderCount);
    this.panelFlag = false;
    let flag = false;
    let apiCall = true;
    this.clearSection();
    switch(action) {
      case 'subFolders':
      case 'files':
        //this.emptyPanel();  
        this.docRowHeight = 0;
        this.fileLoader = true;
        this.files = [];
        this.mainView = flag;
        this.folderView = flag;
        this.subFolderView = (action == 'subFolders') ? true : flag;
        this.fileView = true;
        this.subFolderId = id;
        this.folderId = sid;
        break;
      case 'folders':
      default:
        this.mainView = (action == 'main') ? true : false;
        this.folderView = (action == 'main') ? flag : true;
        this.subFolderView = flag;
        this.fileView = flag;
        this.subFolderId = (action == 'main') ? '' : id;
        this.folderId = '';
        this.folders = [];
        if(this.folderView || action == 'main') {
          //this.emptyPanel();
        }
        if(action == 'main') {
          let data = {
            action: action,
            docData: [],
            thumbView: this.thumbView,
          }
          this.commonApi.emitDocumentPanelFlag(data);
          let timeout = (this.panelFlag) ? 0 : 150;
          setTimeout(() => {
            console.log(this.panelFlag)
            this.getdocumentForTab(1, 0);
            this.deselectTab(this.recentViewedDocuments);
            this.deselectTab(this.recentUploadedDocuments);
            setTimeout(() => {
              this.setupRecentTabWidth('trigger', true);
            }, 500);
          }, timeout);
        }        
        break;
    }

    if(apiCall) {
      //this.docInfoData.docData = [];
      //this.emitDocInfo(0);
      this.contentLoading = true;
      console.log('-----8-----')
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      setTimeout(() => {
        this.getDocumentList();
      }, 100);
    }      
  }

  // Empty Right Panel
  emptyPanel() {
    let dataId = -1;
    this.docInfoData.action = 'empty';
    this.emitDocInfo(dataId);
  }

  // From Landing Page Access
  fromLandingAccess(docsData) {
    console.log(docsData);
    this.filterOptions = [];
    if(docsData['accessFrom']=='search') {
      this.fileView=false;
      this.folderView=false;
      if(docsData['filterOptions'] && docsData['filterOptions']!=null) {
        this.filterOptions=JSON.stringify(docsData['filterOptions']);       
      }     
      this.fromSearchpage='1';
      this.searchText=docsData['searchText']; 
      this.searchLoading = true;
      this.searchnorecordflag = true;         
    } else {
      this.groupInfo = JSON.stringify(docsData['filterOptions'].workstream);
    }
    
    this.loading = false;
    this.breadcrumb('files');
  }

  // Setup Recent Tab width
  setupRecentTabWidth(action, expandFlag) {
    console.log(action, expandFlag);
    let timeout = (action == 'trigger') ? 250 : 100;
    if(document.getElementsByClassName('document-tab')[0]) {
      this.innerRecentViewWidth = document.getElementsByClassName('document-tab')[0].clientWidth - 15;
      let actionVal;
      setTimeout(() => {
        if(this.recentUploadedDocuments.length == 0 || this.recentViewedDocuments.length == 0) {
          this.innerRecentViewWidth = this.innerRecentViewWidth+110;
        } else {
          if (expandFlag) {
            console.log(1)
            actionVal = (action == 'trigger') ? 50 : 260;
            this.innerRecentViewWidth = this.innerRecentViewWidth - actionVal;
          } else {
            console.log(1)
            actionVal = (action == 'toggle') ? 240 : (this.panelFlag) ? 160 : 210;
            this.innerRecentViewWidth = this.innerRecentViewWidth + actionVal;
          }
        }             
      }, timeout);
    }        
  }

  // Set Screen Height
  setScreenHeight() {
    let rmHeight = (this.accessFrom == 'documents') ? 0 : 70;
    rmHeight = (this.thumbView) ? rmHeight : 60;
    let headerHeight = 0;
    if(!this.teamSystem) {
      headerHeight = (document.getElementsByClassName('prob-header')[0]) ? document.getElementsByClassName('prob-header')[0].clientHeight : headerHeight;
    }
    let titleHeight = (this.accessFrom != 'documents') ? 10 : (document.getElementsByClassName('document-list-head')[0]) ? document.getElementsByClassName('document-list-head')[0].clientHeight : 10;
    titleHeight = (!this.thumbView) ? titleHeight - 55 : titleHeight + 5;
    let footerHeight = (document.getElementsByClassName('footer-content')[0]) ? document.getElementsByClassName('footer-content')[0].clientHeight : 0;
    this.innerHeight = (this.bodyHeight - (headerHeight + footerHeight + 20));
    this.innerHeight = this.innerHeight - titleHeight;
    this.innerHeight = this.innerHeight - rmHeight;
  }
  
  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    this.mainScroll(event);
  }

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let url:any = this.router.url;
    let currUrl = url.split('/');
    console.log(currUrl[1], currUrl.length)
    if(currUrl[1] == RedirectionPage.Documents && currUrl.left < 2) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      setTimeout(() => {
        //if(this.mainView) { this.setupRecentTabWidth(this.panelFlag); }
        this.commonApi.emitMessageLayoutChange(true);
      }, 50);
    }
  }

  getDocumentPGList() {
    let newFolder='';    
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;
    this.contentLoading = true;
    let expand = (this.panelFlag) ? 0 : 1;
    let filterOptions = JSON.stringify(this.filterOptions);
    this.docApiData.offset = this.itemOffset;
    this.docApiData.limit = this.itemLimit;
    this.docApiData.type = (this.pinFlag) ? 'pinned' : '';
    this.docApiData.folderId = this.subFolderId;
    this.docApiData.makeId = this.folderId;
    this.docApiData.filterOptions = filterOptions;
    this.docApiData.fromSearch=this.fromSearchpage;
    this.docApiData.searchText=this.searchText;
    this.docApiData.isNewFolder=newFolder;
    this.docApiData.recentHistory = 0;
    this.docApiData.recentUploaded = 0;
    this.docApiData.expand = expand;
    
    if(this.accessFrom == 'landingpage' || this.accessFrom == 'search') {
      console.log(this.docInfoData)
      this.docApiData.groups = this.groupInfo;
      this.docApiData.fromWorkstreampage = 1;
    }
    
    this.documentationService.getALLDocument(this.docApiData).then((documents: any) => {
      if(this.accessFrom == 'documents') {
        //console.log(filterOptions)
        localStorage.setItem('docFilter', filterOptions);
      }
      this.contentLoading = documents.loader;
      if (!this.contentLoading) {
        console.log(documents)
        this.lazyLoading = this.contentLoading;
        this.loadDataEvent=false; 
        this.scrollCallback = true;
        this.scrollInit = 1;
        this.itemTotal = (this.itemOffset == 0) ? documents.total : this.itemTotal;
        console.log(this.fileView)
        if(this.fileView) {          
          this.itemLength += documents.files.length;
          this.loading = false; this.contentLoading = this.loading;
          this.files.push(...documents.files);
          if(this.itemOffset >= this.itemLimit) {
            this.fileLoader = this.contentLoading;
            let fileData = {
              access: this.accessFrom,
              items: this.files,
              thumbView: this.thumbView
            }
            this.commonApi.emitFileList(fileData);            
          } 
        }                
      }
    });
  }
  
  // scroll event
  scrollAction(event){
    if(!this.thumbView) {
      if(this.fileView) {
        this.scrollTop = event.target.scrollTop-90;
        let totalHeight = event.target.scrollTop+event.target.offsetHeight;
        let scrollHeight = event.target.scrollHeight-10;
        console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+totalHeight+'--'+scrollHeight);
        console.log(this.itemTotal, this.itemLength)
        if((totalHeight>=scrollHeight) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false) {
          this.scrollCallback = false;
          this.lazyLoading = true;
          this.loadDataEvent = true; 
          this.itemOffset += this.itemLimit;
          this.getDocumentPGList();
          this.lastScrollTop = this.scrollTop;
          event.preventDefault;
        }
      } else {
        this.mainScroll(event);
      }
    }
  };

  mainScroll(event) {
    let isNearBottom = this.documentationService.isUserNearBottom(event);
    let isBottomVal:any = this.documentationService.isUserNearBottomVal(event);
    let threshold = 80;
    this.scrollTop = event.target.scrollTop;
    if(this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      console.log(this.itemTotal, this.itemLength)
      if (isNearBottom && this.scrollCallback && this.itemTotal > this.itemLength) { // May be check with files count also
        this.scrollCallback = false;
        this.itemOffset += this.itemLimit;
        this.lazyLoading = true;
        this.loadDataEvent = true; 
        this.scrollPos = parseInt(isBottomVal)/2;
        console.log('-----10-----')
        this.getDocumentList();
      }
    }
    this.lastScrollTop = this.scrollTop+1;
  }

  // Scroll to element
  scrollToElem(id) {
    let secElement = document.getElementById(id);
    let scrollTop = secElement.offsetTop;
    console.log(secElement, this.thumbView, scrollTop)
    let dsecElement = document.getElementById('documentList');
    //setTimeout(() => {
      dsecElement.scrollTop = scrollTop-80;
    //}, 200);
    this.opacityFlag = false;
    setTimeout(() => {
      localStorage.removeItem('docId');
    }, 100);
  }
  
  // Ondestroy
  ngOnDestroy() {
    let ws = [];
    let docFilter = JSON.parse(localStorage.getItem('docFilter'));
    if(docFilter)
    {
      if(docFilter.workstream) {
        docFilter.workstream = ws;
      }
    }
    this.subscription.unsubscribe();    
  }
}
