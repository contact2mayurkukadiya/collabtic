import { Component, ViewChild,HostListener, OnInit, OnDestroy } from '@angular/core';
import { Constant, filterNames, IsOpenNewTab, RedirectionPage } from 'src/app/common/constant/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from "@angular/forms";
import { ScrollTopService } from 'src/app/services/scroll-top.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PartsService } from 'src/app/services/parts/parts.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import {LandingpageService}  from 'src/app/services/landingpage/landingpage.service';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();

  public bodyClass: string = "landing-page";
  public bodyElem;
  public footerElem;
  public sidebarActiveClass: Object;

  public title: string = 'Documents';
  public pageCreateNew: string = "Add New";
  public disableOptionCentering: boolean = false;

  public headerFlag: boolean = false;
  public headerData: Object;

  public displayNoRecords: boolean = false;
  public itemEmpty: boolean = false;
  public thumbView: boolean = true;
  public groupId: number = 4;
  public filterInterval: any;
  public strlengthforuser:string ='';
  public NewFolderNumberLenth:string ='30';

  public apiKey: string = Constant.ApiKey;
  public user: any;
  public domainId;
  public userId;
  public roleId;
  public countryId;
  public apiData: Object;
  public docDetail: any = [];
  public emptyFlag: boolean = true;
  public createFolderdiaLog:boolean=false;
  public teamSystem=localStorage.getItem('teamSystem');

  public bodyHeight: number;
  public filterHeight: number;
  public innerHeight: number;

  public createAccess: boolean = true;
  public resize: boolean = false;
  public loading: boolean = false;
  public filterLoading: boolean = true;

  public docsUrl: string = "documents/manage";
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public searchVal: string = '';
  public pageAccess: string = "documents";

  public filterActiveCount: number = 0;
  public filterActions: object;
  public expandFlag: boolean = true;
  public rightPanel: boolean = false;

  public makeArr: any;
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  public years = [];
  public defaultWsVal: any;

  public section: number = 1;
  public pinType: string = "";
  public pinFlag: boolean = false;
  public pinClass: string = "normal";
  public partsList: any = [];
  public partsSelectionList: any = [];
  public itemOffset: number = 0;
  public itemTotal: number = 0;
  public fluid: boolean = false;
  public fluidManageAction: string = "";
  public fluidManageActionId: number = 0;
  public documentViewFlag: boolean = false;
  public docPanel;

  @ViewChild('ttdocuments') tooltip: NgbTooltip;
  public msTeamAccess: boolean = false;
  public thelpContentId = '';
  public thelpContentTitle = '';
  public thelpContentContent = '';
  public thelpContentIconName = '';
  public thelpContentStatus = '';
  public thelpContentFlagStatus:boolean = false;

  public docData = {
    accessFrom: this.pageAccess,
    action: 'get',
    domainId: 0,
    countryId: '',
    expandFlag: this.rightPanel,
    filterOptions: [],
    loadAction: '',
    headercheckDisplay: this.headercheckDisplay,
    headerCheck: this.headerCheck,
    section: this.section,
    thumbView: this.thumbView,
    searchVal: this.searchVal,
    userId: 0,
    pinFlag: this.pinFlag,
    type: this.pinType,
    headerFlag: this.headerFlag
  };
  @ViewChild('f') myForm;
  public resetpassvalidationmsg: string='';
  public displayValidationforreset:boolean=false;
  public filterOptions: Object = {
    'filterExpand': this.expandFlag,
    'page': this.pageAccess,
    'filterLoading': this.filterLoading,
    'filterData': [],
    'filterActive': true,
    'filterHeight': 0,
    'apiKey': '',
    'userId': '',
    'domainId': '',
    'countryId': '',
    'groupId': this.groupId,
    'threadType': '25'
  };

  public docTypeLists: any = [{
    class: 'attach',
    desc: 'You can write a note and attach variety of files formats',
    hideFlag: false,
    id: 1,
    title: 'Attach or upload document(s)',
  },
  {
    class: 'procedure',
    desc: 'Author procedures or notes with in-line attachments',
    hideFlag: true,
    id: 4,
    title: 'Create new document or procedure'
  },
  {
    class: 'bulk-upload',
    desc: 'Bowse or drag and drop multiple files',
    hideFlag: false,
    id: 3,
    title: 'Bulk upload documents'
  },
  {
    class: 'create-folder',
    desc: 'Add new folder in Documents section',
    hideFlag: false,
    id: 4,
    title: 'Create new folder'
  },
  /*{
    class: 'folder',
    desc: 'Add new folder in Documents section',
    hideFlag: true,
    id: 0,
    title: 'Create new folder',
  }*/];

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let url:any = this.router.url;
    let currUrl = url.split('/');
    if(currUrl[1] == RedirectionPage.Documents && currUrl.length < 2) {
      this.bodyHeight = window.innerHeight;
      this.setScreenHeight();
      this.filterOptions['filterExpand'] = this.expandFlag;
      this.filterLoading = false;
      setTimeout(() => {
        this.filterLoading = true;
        //this.docListCallBack('section', this.section);
      }, 50);
    } else {
      //this.commonApi.emitMessageLayoutChange(true);      
    }
  }

  newFolderForm= this.userForm.group({
    Resetradioaction:['1',Validators.required],
    Resetpasswordcontent:['',Validators.required],
  });

  constructor(
    private scrollTopService: ScrollTopService,
    private titleService: Title,
    private router: Router,
    private userForm: FormBuilder,
    private modalService: NgbModal,
    private commonApi: CommonService,
    private authenticationService: AuthenticationService,
    private partsApi: PartsService,
    private filterApi: FilterService,
    private landingpageServiceApi: LandingpageService
  ) {}

  ngOnInit(): void {
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.footerElem = document.getElementsByClassName('footer-content')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
    this.countryId = localStorage.getItem('countryId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if (authFlag) {
      //console.log(this.router.url, this.router.url.split('/').length)      
      let currUrl = this.router.url.split('/');       
      if(currUrl.length > 2) {
        this.fluid = (currUrl[2] == 'manage') ? true : false;
        this.documentViewFlag = (currUrl[2] == 'view') ? true : false;
      }
      let url:any = this.router.url;
      this.sidebarActiveClass = {
        page: currUrl[1],
        menu: currUrl[1],
      };
      /*this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': (!this.fluid) ? true : false,
        'searchVal': ''
      };*/

      this.fluidManageAction = currUrl[3];    
      console.log(this.fluidManageAction);

      if(!this.fluid){
        this.headerData = {
          'access': this.pageAccess,
          'profile': true,
          'welcomeProfile': true,
          'search': (!this.fluid) ? true : false,
          'searchVal': ''
        };
      }
      else{
        this.fluidManageAction = currUrl[3];
        let idVal = '0';  
        let actionText = '';
        let headTitleText = '';      
        switch(this.fluidManageAction){
          case 'attach':
            headTitleText = 'Attach or Upload Document(s)';
            actionText = 'new';
            break;
          case 'bulk-upload':
            headTitleText = 'Bulk Upload Documents';
            actionText = 'new';
            break;
          case 'edit':
            idVal = currUrl[4];
            headTitleText = 'Tech Info';
            actionText = 'edit';
            break;      
        }
        this.headerData = {
          title: headTitleText,
          action: actionText,
          id: idVal    
        };
        console.log(headTitleText);
        console.log(actionText);
      }

      let apiInfo = {
        'apiKey': this.apiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'isActive': 1,
        'searchKey': this.searchVal,
      }

      this.filterOptions['apiKey'] = this.apiKey;
      this.filterOptions['userId'] = this.userId;
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      this.apiData = apiInfo;

      setTimeout(() => {
        if(!this.fluid) {          
          let apiData = this.apiData;
          apiData['groupId'] = this.groupId;
          // Get Filter Widgets        
          this.commonApi.getFilterWidgets(this.apiData, this.filterOptions);
          this.filterInterval = setInterval(() => {
            let filterWidget = localStorage.getItem('filterWidget');
            let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
            if (filterWidget) {
              this.filterOptions = filterWidgetData.filterOptions;
              this.apiData = filterWidgetData.apiData;
              this.filterActiveCount = filterWidgetData.filterActiveCount;
              this.filterLoading = false;
              this.filterOptions['filterLoading'] = this.filterLoading;
              this.docData['filterOptions'] = this.apiData['filterOptions'];
              console.log(this.filterOptions, this.apiData['filterOptions']);
              localStorage.setItem('docFilter', JSON.stringify(this.apiData['filterOptions']));
              clearInterval(this.filterInterval);
              localStorage.removeItem('filterWidget');
              localStorage.removeItem('filterData');
              // Get doc List
              this.commonApi.emitDocumentListData(this.docData);
            }
          }, 50);
        }
        if(this.msTeamAccess){ this.helpContent(0);}
      }, 1500);
    } else {
      this.router.navigate(['/forbidden']);
    }
    
    // help content
    this.commonApi.welcomeContentReceivedSubject.subscribe((response) => {      
      let welcomePopupDisplay = response['welcomePopupDisplay'];
      if(welcomePopupDisplay == '1'){          
        if(this.msTeamAccess){ 
          setTimeout(() => {
            this.helpContent(0);  
          }, 900); 
        }         
      }
    });
    
    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
        //this.rightPanel = JSON.parse(flag);
        let rflag: any = flag;
        this.rightPanel = rflag;
      })
    );

    this.subscription.add(
      this.commonApi.documentPanelFlagReceivedSubject.subscribe((response) => {
        let flag = response['flag'];
        let access = response['access'];
        let docData = [];
        docData = response['docData'];
        this.docDetail = docData;
        let docLen = Object.keys(docData).length;
        console.log(response, this.rightPanel)
        if(access == 'tab' && this.rightPanel) {
          this.rightPanel = false;
        }
        if(this.rightPanel && docLen > 0) {
          let docInfo = {
            action: 'load',
            dataId: docData['resourceID'],
            docData: docData,
            loading: true
          }
          this.commonApi.emitDocumentInfoData(docInfo);
        }
        this.rightPanel = (docLen == 0) ? false : true;
        this.emptyFlag = (docLen == 0) ? true : false;
        if(this.rightPanel) {
          this.commonApi.emitMessageLayoutChange(this.rightPanel)
        }
        if(access == 'files') {
          let data = {
            access: access,
            action: 'scroll',
            expand: flag,
            id: docData['resourceID'],
          }
          this.commonApi.emitDocumentScroll(data);
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnMessageReceivedSubject.subscribe((r) => {
        console.error("-----------253-----------");
        console.log(r)
        var docPush = JSON.parse(JSON.stringify(r));
        let action = docPush.action;
        let access = docPush.access;
        if(access == 'documents') {
          docPush = (docPush == null) ? '' : docPush;
          console.log(docPush);
          if(docPush != '') {
            let action = docPush.action;
            if(action == 'silentDelete') {
              let docInfo = {
                action: 'load',
                dataId: docPush.threadId,
                docData: [],
                loading: true
              }
              let docData = {
                action: action,
                dataId: docPush.threadId,
              }
              this.commonApi.emitMessageLayoutrefresh(docData)
              setTimeout(() => {
                this.rightPanel = false;
                this.emptyFlag = true;
              }, 500);
              return false;
            }
            return false;
            let groups = JSON.parse(docPush.groups);
            let filter = JSON.parse(localStorage.getItem(filterNames.document));
            let chkWs = groups.filter(x => !filter.workstream.includes(x));
            let wsFlag = (chkWs.length > 0) ? true : false;
            //let dws = filter.workstream;
            let pushFlag = true;
            let pushText = 'push';
            if(groups.length > 0) {
              filter = JSON.parse(localStorage.getItem(filterNames.document));
              for (let ws of groups) {
                console.log(ws)
                let windex = filter.workstream.findIndex((w) => w == ws);
                console.log(windex)
                if (windex == -1) {
                  pushFlag = false;
                  pushText = 'load';
                  filter.workstream.push(ws);
                }
              }
            }
            console.log(filter)
            console.log(JSON.stringify(filter))
            localStorage.setItem(filterNames.document, JSON.stringify(filter));
            console.log(chkWs)
            if(!pushFlag) {
              setTimeout(() => {
                this.applyFilter(filter, pushText);
              }, 1500);
            } else {
              let cdata = {
                action: 'doc-push',
                pushData: docPush,
                wsFlag: wsFlag
              }
              this.commonApi.emitMessageLayoutrefresh(cdata)
            }            
          }
        }
      })
    );
    
    /* setTimeout(() => {
      let docPush:any = localStorage.getItem('docPush');
      docPush = (docPush == null) ? '' : JSON.parse(docPush);
      console.log(docPush);
      if(docPush != '') {
        let groups = JSON.parse(docPush.groups);
        let filter = JSON.parse(localStorage.getItem(filterNames.document));
        let chkWs = groups.filter(x => !filter.workstream.includes(x));
        let wsFlag = (chkWs.length > 0) ? true : false;
        //let dws = filter.workstream;
        let pushText = 'push';
        if(groups.length > 0) {
          filter = JSON.parse(localStorage.getItem(filterNames.document));
          for (let ws of groups) {
            console.log(ws)
            let windex = filter.workstream.findIndex((w) => w == ws);
            console.log(windex)
            if (windex == -1) {
              pushText = 'load';
              filter.workstream.push(ws);
            }
          }
        }
        console.log(filter)
        console.log(JSON.stringify(filter))
        localStorage.setItem(filterNames.document, JSON.stringify(filter));
        console.log(chkWs)
        //if(!pushFlag) {
          console.log(localStorage.getItem(filterNames.document));
          setTimeout(() => {
            this.applyFilter(filter, pushText);
          }, 1500);
        //}
        
        let cdata = {
          action: 'doc-push-load',
          pushData: docPush,
          wsFlag: wsFlag
        }
        //this.commonApi.emitMessageLayoutrefresh(cdata)
      }
    }, 4500); */
  }
 
  // Apply Search
  applySearch(action, val) {
    let callBack = false;
    this.searchVal = val;
    this.headercheckDisplay = "checkbox-hide";
    this.headerCheck = "unchecked";
    this.docData['headerCheck'] = this.headerCheck;
    this.docData['headercheckDisplay'] = this.headercheckDisplay;
    this.docData['searchVal'] = this.searchVal;
    this.docData['action'] = 'filter';
    switch (action) {
      case 'reset':
        setTimeout(() => {
          this.ngOnInit();    
        }, 100);     
        break;
      default:
        if (action == 'emit') {
          this.headerData['searchVal'] = this.searchVal;
          this.headerFlag = true;
        }
        console.log(this.docData)
        this.commonApi.emitDocumentListData(this.docData);
        setTimeout(() => {
          if (action == 'init') {
            this.headerFlag = true;
          }
        }, 500);
        break;
    }

    if (callBack) {
      this.commonApi.emitDocumentListData(this.docData);
    }
  }
 
  

  // Nav Page Edit or View
  navPage(type) {
    /*let currUrl = this.router.url;
    currUrl = currUrl.substr(currUrl.indexOf('/') + 1);
    localStorage.setItem('docNav', currUrl);*/
    let url;
    if(type=='create-folder')
    {
     // this.createFolderdiaLog=true;
     this.newfolderpopup();
    }
    else
    {
      this.createFolderdiaLog=false;
      url = `${this.docsUrl}/${type}`;
      if(this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      }
      else{
        window.open(url, url);
      }      
    }
  
  }

  newfolderpopup() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'New Folder';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.actionInfo = [];
    modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      //console.log(receivedService)
      const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
      msgModalRef.componentInstance.successMessage = receivedService.message;
      msgModalRef.componentInstance.type = 'password';
      setTimeout(() => {
        msgModalRef.dismiss('Cross click');
        this.docData.action = 'folder-creation';
        this.commonApi.emitDocumentListData(this.docData);
       
      }, 3000);
    });
  }

  // Pin or Unpin
  pinnedList(flag) {
    this.docData.action = 'pin';
    this.pinFlag = flag;
    this.pinType = (flag) ? 'pined' : '';
    this.pinClass = (flag) ? 'active' : 'normal';
    this.docData.thumbView = this.thumbView;
    this.docData.action = 'pin';
    this.docData.pinFlag = this.pinFlag;
    this.docData.type = this.pinType;
    this.commonApi.emitDocumentListData(this.docData);
  }

  // Change the view
  viewType(actionFlag) {
    if (!this.itemEmpty) {
      this.thumbView = (actionFlag) ? false : true;
      console.log(this.thumbView)
      let viewType = (this.thumbView) ? 'thumb' : 'list';
      localStorage.setItem('partDocumentView', viewType);
      setTimeout(() => {
        this.docData.thumbView = this.thumbView;
        this.docData.action = 'view';
        this.commonApi.emitDocumentListData(this.docData);
      }, 50);
    }
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight = 0;
    let titleHeight = 0;
    if(!this.teamSystem) {
      let docHeaderHeight = document.getElementsByClassName('prob-header');
      headerHeight = (docHeaderHeight) ? docHeaderHeight[0].clientHeight : headerHeight;
    }
    if(!this.fluid){
      let docListHeight = document.getElementsByClassName('document-list-head');
      titleHeight = (docListHeight) ? docListHeight[0].clientHeight : titleHeight;
    }
    let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight;
    this.innerHeight = (this.bodyHeight - (headerHeight + footerHeight + 30));
    this.innerHeight = this.innerHeight - titleHeight;
    this.filterHeight = (window.innerHeight);
    this.filterOptions['filterHeight'] = this.innerHeight;
  }

  // Document List Call Back
  docListCallBack(type, action) {
    this.headerFlag = (type == 'pin') ? this.headerFlag : false;
    this.section = action;
    let searchVal = '';
    this.applySearch(action, searchVal);
  }

  // Filter Toggle
  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag;
    this.docData.expandFlag = toggleFlag;
    this.docData.action = 'filter-toggle';
    this.commonApi.emitDocumentListData(this.docData);
  }

  // Apply Filter
  applyFilter(filterData, loadpush = '') {
    console.log(filterData)
    let resetFlag = filterData.reset;
    if (!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.docData['loadAction'] = (loadpush) ? loadpush : '';
      this.docData['filterOptions'] = filterData;
      this.filterActiveCount = this.commonApi.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
      this.applySearch('filter', this.searchVal);
      localStorage.setItem('docFilter', JSON.stringify(filterData));
      setTimeout(() => {
        this.filterLoading = false;
      }, 700);
    } else {
      localStorage.removeItem('docFilter');
      setTimeout(() => {
        this.resetFilter();
      }, 100);
    }
  }

  // Reset Filter
  resetFilter() {
    this.filterLoading = true;
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    this.applySearch('reset', this.searchVal);
    setTimeout(() => {
      //this.filterLoading = false;
    }, 700);
  }

  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.docData['headerCheck'] = this.headerCheck;
    this.docData['headercheckDisplay'] = this.headercheckDisplay;
    this.docData['action'] = 'clear';
    this.commonApi.emitPartListData(this.docData);
  }
  
  // Toggle Action
  toggleAction(data) {
    console.log(data)
    let flag = data.action;
    let access = data.access;
    let toggleActionFlag = true;
    this.emptyFlag = false;
    switch(access) {
      case 'info':
        let sdata = {
          access: 'toggle',
          action: 'scroll',
          expand: !this.rightPanel,
          id: data.docDetail.resourceID,
        }
        this.commonApi.emitDocumentScroll(sdata);
        break;
      case 'empty':
        toggleActionFlag = false;
        this.docDetail = [];
        this.emptyFlag = true;
        this.rightPanel = false;
        break;
      default:
        this.docDetail = [];
        break;  
    }
    if(toggleActionFlag) {
      this.docDetail = data.docDetail;
      this.toggleInfo(flag);
    }    
  }

  // Toogle Document Info
  toggleInfo(flag) {
    this.docData.action = 'toggle';
    this.docData.expandFlag = !flag;
    this.commonApi.emitDocumentListData(this.docData);
    this.commonApi.emitMessageLayoutChange(flag);
    setTimeout(() => {
      this.rightPanel = !flag;
      let docInfoData = {
        action: '',
        apiData: [],
        docDetail: [],
        loading: false,
        panelFlag: this.rightPanel   
      };
      if(!this.rightPanel) {
        docInfoData.action = 'panel';
        this.commonApi.emitDocumentPanelData(docInfoData);
      }
    }, 100);
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
              if(contentData[cd].id == '6' && contentData[cd].viewStatus == '0' ){					  
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
