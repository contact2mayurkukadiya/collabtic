import { Component, OnInit, HostListener,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common/common.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { pageInfo, Constant } from 'src/app/common/constant/constant';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
declare var $:any;
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import * as moment from 'moment';
import { ApiService } from '../../../../services/api/api.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  host: {'window:beforeunload':'doSomething'}
})
export class IndexComponent implements OnInit, OnDestroy {
public title='Search';
public docDetail: any = [];


public sconfig: PerfectScrollbarConfigInterface = {};
  public filterLoading: boolean = true;
  public emptyFlag: boolean = false;
  public expandFlag: boolean = true;
  public searchFlag: boolean=true;
  public showSearchRes: boolean=true;
  public fromSearchPage:boolean=true;
  public teamSystem=localStorage.getItem('teamSystem');
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public comefromOthersTab:boolean=false;
  public searchPlacehoder: string = 'Search';
  public searchVal: string = '';
  public activePageAccess="0";
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public searchReadonlyFlag: boolean=false;
  public searchBgFlag: boolean = false;
  public assetPath: string = "assets/images";
  public assetPathplatform: string = "assets/images/";
  public searchImg: string = `${this.assetPath}/search-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close.png`;
  public filterInterval: any;
  public initYear: number = 1960;
  public years = [];
  public currYear: any = moment().format("Y");
  public filterActiveCount: number = 0;
  public threadFilterOptions;
  public headerData: Object;
  public outputContentTypedata:object;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public pageData=pageInfo.searchPage;
  public docLoading: boolean = true;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public loadLeftside=true;
  public menuListloaded;
  public getcontentTypesArr=[];
  public roleId;
  public apiData: Object;
  public bodyHeight: number;
  public innerHeight: number = 0; 
  public workstreamId;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public currentContentTypeId:number=2;
  pageAccess: string = "search";
  public bodyClass:string = "landing-page";
  public bodyClass1:string = "knowledge-base";
  public bodyClass2:string = "search-page";
  public bodyElem;
  public thumbView: boolean = true;
  folders = [];
  files = [];
  scrollCount: number = 0;
  public filterInitFlag: boolean = false;
  public threadTypesort='';
  public groupId: number = 30;
  public pageRefresh:object={
    'type': this.threadTypesort,
    'expandFlag':this.expandFlag,
   }
   public partData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };
  public kbData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };

  public sibData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };

  public kaData = {
    accessFrom: 'landing',
    action: 'get',
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: '',
    section: 1,
    thumbView: true,
    userId: 0
  };

  public rightPanel: boolean = false;
  public docData = {
    accessFrom: this.pageAccess,
    action: 'files',
    domainId: 0,
    countryId: "",
    expandFlag: this.rightPanel,
    filterOptions: [],
    thumbView: this.thumbView,
    searchVal: '',
    userId: 0,
    partType: '',
    headerFlag: this.headerFlag
  };
  
  public historyFlag:boolean=false;
  public resetFilterFlag:boolean=false;
    public filterOptions: Object = {
      'filterExpand': this.expandFlag,
      'page': this.pageAccess,
      'initFlag': this.filterInitFlag,
      'filterLoading': this.filterLoading,
      'filterData': [],
      'filterActive': true,
      'filterHeight': 0,
      'apiKey': '',
      'userId': '',
      'domainId': '',
      'countryId': "",
      'groupId': this.groupId,
      'threadType': '25',
      'action': 'init',
      'reset':this.resetFilterFlag,
      'historyFlag': this.historyFlag,
      
    };
  constructor(
    private router: Router,
    private commonService: CommonService,
    private titleService: Title,
    private authenticationService: AuthenticationService, 
    private formBuilder: FormBuilder,
    private documentationService: DocumentationService,
    public apiUrl: ApiService,
  ) {
    console.log("index of search page");
    this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
   }

  ngOnInit(): void {
    
    var id = localStorage.getItem('currentContentType') != null && localStorage.getItem('currentContentType') != undefined ? localStorage.getItem('currentContentType') : this.currentContentTypeId.toString();
    this.currentContentTypeId = parseInt(id);
    
    if(this.teamSystem){
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;  
        if(this.searchVal)
        {
          this.applySearch('', this.searchVal,'');          
        }
       
      }
    }

    if(this.searchVal)
    {
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.searchBgFlag = true;
      this.showSearchRes=true;
      this.searchTick = (this.searchVal.length > 0) ? true : false;
      this.searchClose = this.searchTick;
      this.emptyFlag = true;
    this.rightPanel = false;
    }
    else
    {
      this.searchImg = `${this.assetPath}/search-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close.png`;  
      this.searchBgFlag = false;
      this.showSearchRes=false;
      this.emptyFlag = true;
    this.rightPanel = false;
    }

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;    
    this.sibData.domainId=this.domainId;
    this.sibData.userId=this.userId;
    this.kaData.domainId=this.domainId;
    this.kaData.userId=this.userId;
   
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');   
    
    this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.add(this.bodyClass);
      this.bodyElem.classList.add(this.bodyClass1);
      this.bodyElem.classList.add(this.bodyClass2);
    
      let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
      if(authFlag) {
        let searchKey = localStorage.getItem('searchValue');
       
        let searchBg = (searchKey == undefined || searchKey == 'undefined' || searchKey == 'null' || searchKey == null || searchKey == '') ? false : true;
        this.partData['domainId'] = this.domainId;
        this.partData['countryId'] = this.countryId;
        this.partData['userId'] = this.userId;
     
        this.kbData['domainId'] = this.domainId;
        this.kbData['countryId'] = this.countryId;
        this.kbData['userId'] = this.userId;

        this.headerData = {
        'access': this.pageAccess,
        'profile': false,
        'welcomeProfile': false,
        'search': true,
        'searchBg': searchBg
      };
      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'searchKey': this.searchVal,
        'historyFlag': this.historyFlag
      }
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
      this.apiData = apiInfo;
      this.filterOptions['apiKey'] = Constant.ApiKey;
      this.filterOptions['userId'] = this.userId;
      this.filterOptions['domainId'] = this.domainId;
      this.filterOptions['countryId'] = this.countryId;
      let year = parseInt(this.currYear);
    for(let y=year; y>=this.initYear; y--) {
      this.years.push({
        id: y,
        name: y.toString()
      });
    }
    setTimeout(() => {
       this.setScreenHeight();
 
       this.apiData['groupId'] = this.groupId;
       this.apiData['mediaId'] = 0;
       // Get Filter Widgets
       this.commonService.getFilterWidgets(this.apiData, this.filterOptions);
       
       this.filterInterval = setInterval(()=>{
         let filterWidget = localStorage.getItem('filterWidget');
         let filterWidgetData = JSON.parse(localStorage.getItem('filterData'));
         if(filterWidget) {
           console.log(this.filterOptions)
           this.filterOptions = filterWidgetData.filterOptions;
           this.apiData = filterWidgetData.apiData;

           this.threadFilterOptions=this.apiData['filterOptions'];
           this.apiData['onload']=true;
           this.threadFilterOptions=this.apiData['onload'];

          // this.commonService.emitMessageLayoutrefresh(this.threadFilterOptions);
         //  console.log(this.apiData+'---');
          // console.log(this.filterOptions);
           this.filterActiveCount = filterWidgetData.filterActiveCount;
           this.filterLoading = false;
           this.filterOptions['filterLoading'] = this.filterLoading;
           clearInterval(this.filterInterval);
           localStorage.removeItem('filterWidget');
           localStorage.removeItem('filterData');
           
           // Get Media List

          
         }
       },50);
     }, 1500);



     this.commonService.documentPanelFlagReceivedSubject.subscribe((response) => {
      console.log(response)
      let flag = response['flag'];
      let access = response['access'];
      switch (access) {
        case 'documents':
          this.docDetail = [];
          this.rightPanel = !flag;
          break;
        default:
          this.docDetail = response['docData'];
          this.emptyFlag = false;
          console.log(this.rightPanel)
          if(!this.rightPanel) {
            this.rightPanel = true;
          }
          this.emitDocInfo(this.docDetail);         
          break;  
      }
    });

      var menuListloaded=localStorage.getItem('sideMenuValues');
      console.log(menuListloaded);
      this.getcontentTypesArr=[];
    //console.log(menuListloaded+'--------storage');
    var menuListloadedArr= JSON.parse(menuListloaded);
    console.log(menuListloadedArr);
    for(let menu of menuListloadedArr) {
      if(menu.contentTypeId)
      {
      let urlpathreplace= menu.urlPath;
      let urlActivePathreplace= menu.urlActivePath;
      let submenuimageClass= menu.submenuimageClass;
     let urlpth= urlpathreplace.replace('.png','.svg');
     let urlActivePath= urlActivePathreplace.replace('.png','.svg');
     if(menu.contentTypeId!=26  && menu.contentTypeId!=20  && menu.contentTypeId!=23 && menu.contentTypeId!=1 && menu.contentTypeId!=5 && menu.contentTypeId!=8 && menu.contentTypeId!=6)
     {
       console.log(menu.name);
      this.getcontentTypesArr.push({
        contentTypeId:menu.contentTypeId,
        name:menu.name,
        urlPath:urlpth,
        urlActivePath:urlActivePath,
        submenuimageClass:submenuimageClass
        });
     }

      }
    }
    let loadPageMenu = localStorage.getItem('loadMenuPageName');  
    let sideMenuValuesArr = this.getcontentTypesArr; 
    for(let smv of sideMenuValuesArr){
      if(loadPageMenu == smv.name){
        this.currentContentTypeId = smv.contentTypeId;
      }   
    }
    }
    else
  {
    this.router.navigate(['/forbidden']);
  }
      
  }

  emitDocInfo(docData) {
    let data = {
      action: 'load',
      loading: true,
      dataId: docData.resourceID,
      docData: docData
    }
    this.commonService.emitDocumentInfoData(data);
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let isNearBottom = this.documentationService.isUserNearBottom(event);
    if (isNearBottom) {
      this.scrollCount = this.scrollCount + 1;
      this.itemOffset = this.scrollCount * 10;
      this.getDocumentList(this.currentContentTypeId);
    }
  }

 
  applySearch(action, val,filterData='') {
    
    let url = this.router.url.split('/');

    var id = localStorage.getItem('currentContentType') != null && localStorage.getItem('currentContentType') != undefined ? localStorage.getItem('currentContentType') : this.currentContentTypeId.toString();
    this.currentContentTypeId = parseInt(id);

    //alert(this.currentContentTypeId);   
    //alert(this.apiUrl.searchFromPageNameClose);   

    if(this.apiUrl.searchFromPageNameClose){
      localStorage.removeItem('currentContentType');
      this.apiUrl.searchFromPageNameClose = false; 
    }

//("applySearch");
   //alert(this.currentContentTypeId);
   if(val || action=='filter')
   {
    this.searchVal = val;
    this.submitted = true;
    let searchKey=val;
    let searchBg = (searchKey == undefined || searchKey == 'undefined' || searchKey == 'null' || searchKey == null || searchKey == '') ? false : true;
        this.partData['domainId'] = this.domainId;
        this.partData['countryId'] = this.countryId;
        this.partData['userId'] = this.userId;
     
        this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true,
        'searchBg': searchBg,
        'searchValue': this.searchVal
      };
     this.showSearchRes=true;
     //alert(this.showSearchRes);
     this.emptyFlag = true;
      this.rightPanel = false;
     if(val)
     {
      localStorage.setItem('searchValue',val);
     }
     
   }
   
   else
   {
    this.showSearchRes=false;
    this.emptyFlag = true;
    this.rightPanel = false;
   /*
    let resetFlag =  this.apiData['filterOptions'].reset;
    if(!resetFlag) {
      this.filterActiveCount = 0;
      //this.filterLoading = true;
      this.commonService.emitMessageLayoutrefresh(this.apiData['filterOptions']);
    }
    else
    {
      this.showSearchRes=false;
    }
    */

     
   }
   if(this.showSearchRes)
   {

    //alert(1);
   
    setTimeout(() => {
   // this.pageRefresh['type']=val; 
   
     this.searchBgFlag = true;
     this.searchImg = `${this.assetPath}/search-white-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close-white.png`;

    this.searchTick = true ;
      this.searchClose = this.searchTick;
     

    this.pageRefresh['searchOption']=true;
    
    if(this.currentContentTypeId==2)
    {
      if(action=='filter')
      {
        this.commonService.emitMessageLayoutrefresh(filterData);
      }
      else
      {
        this.commonService.emitMessageLayoutrefresh(this.pageRefresh);
      }
     
    }
   else if(this.currentContentTypeId==11)
    {
      this.partData['searchVal'] = val;
      this.partData['accessFrom'] = this.pageAccess;
     
  
      let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));

      //let searchPageFilter=localStorage.getItem('searchPageFilter');
  if(searchPageFilter)
  {
    this.partData['filterOptions']=searchPageFilter;
  }
  else
  {
    this.partData['filterOptions']='';
  }
      this.partData['searchVal'] = val;
      this.partData['accessFrom'] = this.pageAccess;
      this.getPartList();
    }
    else if(this.currentContentTypeId==16)
    {
      this.sibData['searchVal'] = val;
      this.sibData['accessFrom'] = this.pageAccess;
     
  
      let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));

      //let searchPageFilter=localStorage.getItem('searchPageFilter');
  if(searchPageFilter)
  {
    this.sibData['filterOptions']=searchPageFilter;
  }
  else
  {
    this.sibData['filterOptions']='';
  }
      this.sibData['searchVal'] = val;
      this.sibData['accessFrom'] = this.pageAccess;
      this.getSibList();
    }
    else if(this.currentContentTypeId==7)
    {
      //alert(this.currentContentTypeId);
      this.kaData['searchVal'] = val;
      this.kaData['accessFrom'] = this.pageAccess;
     
  
      let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));

      //let searchPageFilter=localStorage.getItem('searchPageFilter');
  if(searchPageFilter)
  {
    this.kaData['filterOptions']=searchPageFilter;
  }
  else
  {
    this.kaData['filterOptions']='';
  }
      this.kaData['searchVal'] = val;
      this.kaData['accessFrom'] = this.pageAccess;
      this.getKaList();
    }
    else if(this.currentContentTypeId==28)
    {
      this.kbData['searchVal'] = val;
      this.kbData['accessFrom'] = this.pageAccess;
     
  
      let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));

      //let searchPageFilter=localStorage.getItem('searchPageFilter');
  if(searchPageFilter)
  {
    this.kbData['filterOptions']=searchPageFilter;
  }
  else
  {
    this.kbData['filterOptions']='';
  }
      this.kbData['searchVal'] = val;
      this.kbData['accessFrom'] = this.pageAccess;
      this.getKbList();
    }
    else if(this.currentContentTypeId==4)
    {
      this.partData['searchVal'] = val;
      this.partData['accessFrom'] = this.pageAccess;
      this.files=[];
      this.getDocumentList(this.currentContentTypeId);
    }

   
    },700);
  }
    
  }



  toggleAction(data) {
    console.log(data)
    let flag = data.action;
    let access = data.access;
    let toggleActionFlag = false;
    switch(access) {
      case 'info':
        this.docDetail = data.docDetail;  
        this.emptyFlag = false;
        this.rightPanel = !flag;
        break;
      case 'empty':
        this.docDetail = [];
        this.emptyFlag = true;
        this.rightPanel = !flag;
        break;
      default:
        toggleActionFlag = true;
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
    this.commonService.emitDocumentListData(this.docData);
    this.commonService.emitMessageLayoutChange(flag);
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
        this.commonService.emitDocumentPanelData(docInfoData);
      }
    }, 100);
  }

  applyFilter(filterData) {
    console.log(filterData)
    this.itemOffset=0;
    let resetFlag = filterData.reset;
    if(!resetFlag) {
      this.filterActiveCount = 0;
      this.filterLoading = true;
      this.apiData['filterOptions'] = filterData;
      this.filterOptions['filterOptions'] = filterData;
      // Setup Filter Active Data
      this.filterActiveCount = this.commonService.setupFilterActiveData(this.filterOptions, filterData, this.filterActiveCount);
      this.filterOptions['filterActive'] = (this.filterActiveCount > 0) ? true : false;
      // alert(filterData);
      let searchValue=localStorage.getItem('searchValue');

      localStorage.setItem('searchPageFilter', JSON.stringify(filterData));
      //this.commonService.emitMessageLayoutrefresh(filterData);
      if(searchValue) {
        this.applySearch('filter','',filterData);
      }
      
      //this.applySearch('get', this.searchVal);
      setTimeout(() => {
        this.filterLoading = false;
      }, 1500);
      
    }
    else

    {
      this.resetFilter();

    }
  //  this.commonService.emitMessageReceived(filterData);
    
    //alert(JSON.stringify(filterData));

  }

  resetFilter() {
   
    this.filterLoading = true;
    this.filterOptions['reset'] = true;
    this.filterOptions['filterActive'] = false;
    this.currYear = moment().format("Y");
    localStorage.removeItem('searchPageFilter');
   
     let searchValue=localStorage.getItem('searchValue');
     if(searchValue && searchValue!='')
     {
      this.showSearchRes=true;
      this.applySearch('filter','','');
     }
     else
     {
      this.showSearchRes=false;
      this.emptyFlag = true;
    this.rightPanel = false;
     }
      
   
   // this.ngOnInit();
    
   //this.applySearch('filter','','');
    //this.ngOnInit();
    //this.commonService.emitMessageLayoutrefresh('');
  }

  RealoadChatPageData(item:any){

    //alert(item.wsId);
        console.log(item.contentType+'---wsdata');
        this.outputContentTypedata=item.contentType;
        this.workstreamId = item.wsId;
    
        this.commonService.emitWorkstreamReceived(item);
        //alert(this.workstreamId);
        
      }

      taponContent(Id)
  {
    //alert(Id);
    this.rightPanel=false;
    this.emptyFlag=true;
    //alert(Id);
    let platformId= localStorage.getItem('platformId');
    //alert(Id);
    if(Id==1)
    {
      var aurl = 'chat-page';
     // var aurl = '/workstream-chats';
      window.open(aurl, '_blank');
    }
    else if(Id==2)
    {
      //alert(Id);
      if(this.currentContentTypeId != Id) {

        this.pageRefresh['type']=localStorage.getItem('searchValue'); 
   
        this.pageRefresh['searchOption']=true;
        
       this.comefromOthersTab=true;
      
       
          this.currentContentTypeId=Id; 

      }
      else
      {
        //var aurl = 'threads';
       // window.open(aurl, '_blank');
      }
      
    }

   else if(platformId=='2')
    {
     if (Id == 7) {
      var aurl = '/mis/home/' + this.domainId + '/' + this.userId + '/2';
       //var aurl = '/mis/probing-questions';
       window.open(aurl, '_blank');
     } 
     if (Id == 8) {
       var aurl = '/knowledgearticles';
       window.open(aurl, '_blank');

     } 
     else  if (Id == 6) {
     // var aurl = '/mis/home/' + this.domainId + '/' + this.userId + '/4';
      //var aurl = '/mis/';
     // window.open(aurl, '_blank');
    }
    else if(Id==11)
    {
     


        this.currentContentTypeId=Id;
      this.partData['searchVal']='';
      if(localStorage.getItem('searchValue'))
      {
        this.partData['searchVal'] = localStorage.getItem('searchValue');
      }
      
        this.partData['accessFrom'] = this.pageAccess;
       
    
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
  
    if(searchPageFilter)
    {
      this.partData['filterOptions']=searchPageFilter;
    }
    else
    {
      this.partData['filterOptions']='';
    }
       
        this.partData['accessFrom'] = this.pageAccess;
       // this.getPartList();
     
       
      
    }
    else if (Id == 4) {

    
        this.docLoading = true;
       this.initDoc(Id);
      
     
      //var aurl = '/documents';
     // var aurl = '/techinfopro';
     
    }    
      else if(Id == 16) {
        console.log(this.pageAccess);
        this.currentContentTypeId=Id;
        this.sibData['searchVal']='';
        let filter: any = '';
        if(localStorage.getItem('searchValue')) {
          this.sibData['searchVal'] = localStorage.getItem('searchValue');
        }
        this.sibData['accessFrom'] = this.pageAccess;
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
        if(searchPageFilter) {
          filter = searchPageFilter;
        }
        this.sibData['filterOptions'] = filter;
        this.sibData['sibType'] = '';
        this.sibData['accessFrom'] = this.pageAccess;
      }
      else if(Id == 28) {
        console.log(this.pageAccess);
        this.currentContentTypeId=Id;
        this.kbData['searchVal']='';
        let filter: any = '';
        if(localStorage.getItem('searchValue')) {
          this.kbData['searchVal'] = localStorage.getItem('searchValue');
        }
        this.kbData['accessFrom'] = this.pageAccess;
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
        if(searchPageFilter) {
          filter = searchPageFilter;
        }
        this.kbData['filterOptions'] = filter;
        this.kbData['type'] = '';
        this.kbData['accessFrom'] = this.pageAccess;
      }    
    }
    else if(platformId!='2')
    {
    
    if(Id==11)
    {
      this.currentContentTypeId=Id;
      this.partData['searchVal']='';
      if(localStorage.getItem('searchValue'))
      {
        this.partData['searchVal'] = localStorage.getItem('searchValue');
      }
      
        this.partData['accessFrom'] = this.pageAccess;
       
    
        let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
  
    if(searchPageFilter)
    {
      this.partData['filterOptions']=searchPageFilter;
    }
    else
    {
      this.partData['filterOptions']='';
    }
       
        this.partData['accessFrom'] = this.pageAccess;
       // this.getPartList();
     
    }
    else if (Id == 4) {
      this.docLoading = true;
     this.initDoc(Id);
    
    }
    else if(Id == 7) {
      console.log(this.pageAccess);
      this.currentContentTypeId=Id;
      this.kaData['searchVal']='';
      let filter: any = '';
      if(localStorage.getItem('searchValue')) {
        this.kaData['searchVal'] = localStorage.getItem('searchValue');
      }
      this.kaData['accessFrom'] = this.pageAccess;
      let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));
      if(searchPageFilter) {
        filter = searchPageFilter;
      }
      this.kaData['filterOptions'] = filter;      
      this.kaData['accessFrom'] = this.pageAccess;
      this.applySearch('', this.kaData['searchVal'],'');
    }
    
    }
   
   
    else
    {
      $('.img-contenttype').removeClass('active');
      $('.border-contenttype').removeClass('active');
      
      this.currentContentTypeId=Id;
      $('.img-contenttype'+Id+'').addClass('active');
     // $('.img-contenttype'+Id+'').attr('src','assets/images/workstreams-page/thread-w-active.svg');
      $('.border-contenttype'+Id+'').addClass('active');
    }
    
   

  }

  setScreenHeight() {
    let headerHeight = 50;
    console.log(this.bodyHeight, headerHeight);
    this.innerHeight = (this.bodyHeight - (headerHeight + 130));
    console.log(this.innerHeight)
  }
  
  initDoc(id) {
   // alert(id);
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.itemOffset = 0;
    this.docLoading = true;
    this.getDocumentList(id);
  }
  

 getDocumentList(Id) {
  this.currentContentTypeId=Id;
  let groupsData=[];
  this.docDetail = [];
  if(this.workstreamId) {
    groupsData.push(this.workstreamId);
  }
 //
 
  if(!this.workstreamId) {
    this.workstreamId=localStorage.getItem('landing-page-workstream');
  }

  //let filterOptions=searchPageFilter;
  let searchVal=localStorage.getItem('searchValue');
  if(searchVal && searchVal!=null)
  {
    searchVal=searchVal;
  }
  else
  {
    searchVal='';
  }
  this.docData.action = this.pageAccess;
  
  this.docData['searchText'] = searchVal;
  let searchPageFilter:any=JSON.parse(localStorage.getItem('searchPageFilter'));

  //let searchPageFilter=localStorage.getItem('searchPageFilter');
if(searchPageFilter)
{
this.docData['filterOptions']=searchPageFilter;
}
else
{
this.docData['filterOptions']=[];
}
 // this.docData['filterOptions'] = searchPageFilter;
  
  setTimeout(() => {
    this.commonService.emitDocumentListData(this.docData);  
  }, 50);    
}

    
  submitSearch()
  {
    if(this.teamSystem){
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;  
        if(this.searchVal)
        {
          this.applySearch('', this.searchVal,'');          
        }
       
      }
    }

  }
  clearSearch()
  {
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
   //alert(11);
    localStorage.removeItem('searchValue');
    //this.ngOnInit();
    this.showSearchRes=false;
    this.emptyFlag = true;
    this.rightPanel = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
    localStorage.removeItem('loadMenuPageName');
  }
  onSearchChange(searchValue: string)
  {
    
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;   
    this.searchVal = searchValue;
    if (searchValue.length == 0) {
      this.submitted = false;
      this.clearSearch();
    }
    else{
      this.searchBgFlag = true;
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.searchTick = true ;
      this.searchClose = this.searchTick;
    }   
  }

  onSubmit() {
    if(this.teamSystem)
    {
     
      console.log(this.searchVal)
      this.searchForm.value.search_keyword = this.searchVal;
      this.submitted = true;
      if (this.searchForm.invalid) {
        return;
      } else {
        this.searchVal = (this.searchBgFlag) ? localStorage.getItem('searchValue') : this.searchForm.value.search_keyword;
        this.searchVal = this.searchForm.value.search_keyword;
       // this.submitSearch();
       //localStorage.setItem('searchValue',this.searchVal);
       this.ngOnInit();
      }
    }
    
  }
/*
  getPartList() {
    setTimeout(() => {
      this.commonService.emitPartListData(this.partData);  
    }, 50);    
  }
*/
  getPartList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitPartListData(this.partData);  
    }, 50);    
  }

  getSibList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitSibListData(this.sibData);  
    }, 50);    
  }
  getKaList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitKnowledgeListData(this.kaData);  
    }, 50);    
  }
  getKbList() {
    
    //alert(localStorage.getItem('landing-page-workstream'));
    if(!this.workstreamId)
    {
      this.workstreamId=localStorage.getItem('landing-page-workstream');
    }
    let filterOptions:any = {
    //  workstream: [this.workstreamId.toString()]
    }
   // this.partData['filterOptions'] = filterOptions;
    setTimeout(() => {
      this.commonService.emitKnowledgeBaseListData(this.kbData);  
    }, 50);    
  }
  

  expandAction(toggleFlag) {
    this.expandFlag = toggleFlag; 
    this.pageRefresh['toggleFlag']=toggleFlag; 
    this.commonService.emitMessageLayoutChange(toggleFlag);
    
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    localStorage.removeItem('searchValue');
  }

  backPage(){
    this.router.navigate(["threads"]);   
  }

  ngOnDestroy() {
    this.bodyElem.classList.removeClass(this.bodyClass1);
    this.bodyElem.classList.removeClass(this.bodyClass2);
    localStorage.removeItem('loadMenuPageName');
  }
}
