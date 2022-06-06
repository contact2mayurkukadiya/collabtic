import { Component, ViewChild, HostListener, Renderer2, ElementRef, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatRadioChange } from '@angular/material';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { UserDashboardService } from '../../../services/user-dashboard/user-dashboard.service';
import { ConfirmationComponent } from '../../../components/common/confirmation/confirmation.component';
import { SuccessComponent } from '../../../components/common/success/success.component';
import { SortEvent } from 'primeng/api';
import { CommonService } from '../../../services/common/common.service';
import { ExcelService } from '../../../services/dashboard/excel/excel.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant,forumPageAccess,windowHeight } from '../../../common/constant/constant';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import {Table} from 'primeng/table';
import { EscalationsService } from '../../../services/escalations/escalations.service';
import { Icu } from '@angular/compiler/src/i18n/i18n_ast';
import { ThisReceiver } from '@angular/compiler';

declare var $:any;
interface workstreamsListdexport {
  name: string,
  id: number
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  workstreamsListdropdown: workstreamsListdexport[];
  selectedworkstreamsList: workstreamsListdexport;
  @ViewChild('el') elRefs: ElementRef;
 @ViewChild('ptabletdata', { static: false }) tdptabletdata: ElementRef;
  totalRecords: number;
  workstreamValpush=[];
  public workstreamValpushFlag: boolean = false;
  public access: string = "";
  public refreshOption:boolean=false;
  //public title: string = "";
  public titleFlag: boolean;
  public platfromId=localStorage.getItem("platformId");
  public exportFlag: boolean;
  public exportFlagthread: boolean;
  public newformDisable=false;
  public accounthasWorkstreamError=false;
  public accounthaspasswordError=false;
  
  public exportLoading: boolean = false;
  public excelreportdiaLog: boolean = false;
  public exportLoadingAll: boolean = false;
  public exportData: any;
  public findnewformflag=false;
  public pageaccesstitle:string = "User management";
  public isEmailExist=false;
  public defaultpasswordcheck:boolean=true;
  public workstreamArrayval=[];
  public multiselectdefaultLabel=' p-mdefaultlabel';
  public multiselectdefaultLabelNamedefaultstr=' Select workstreams';
  public multiselectdefaultLabelNameselectedstr=' Select workstreams*';
  public multiselectdefaultLabelName='Select workstreams*';
  public displayPosition: boolean;

  public position: string;
  public noUserListFound:boolean=false;
  primetablerowdata: {FirstName: string,LastName: string,bussTitle: string,EmailAddress:string, dealerName:string, dealerCode:string, territory:string, zone:string, userarea:string, contactPersonName:string, contactPersonPhone:string, contactPersonEmail:string};
  public custompasswordcheck:boolean=false;
  public checkvalido=true;
  public radioOptions: string = '1';
  public resetpassvalidationmsg: string='';
  public updateuservalidationmsg: string='';
  totalRecordsActive: string ='-';
  public reguser_array=[];
  public workstreamuser_array=[];
  totalRecordsInActive: string ='-';
  totalRecordsWaitingFor: string ='-';
  public dynamicColumn:string='';
  //public selectedBgColor='#C02E4C';
  public selectedBgColor='#e24e4b';
  public selectedColorCode='#FFFFFF';
  public watitingforapprovalVisible:boolean=false;
  public alreadyExistFlag:boolean=false;
  public tvsAgency: boolean = false;
  public newUserEmailAddress: string = '';

  public loadDynamicColun=false;
    public title:string = 'User Management';
    statuses: SelectItem[];
    workstreamstatus: SelectItem[];
    userActivestatus:SelectItem[];
    public userManagersList=[];
    public cityContentList=[];
    public territoryContentList=[];
    public zoneContentList=[];
    public areaContentList=[];
    colaccountTypes:SelectItem[];
    colaccountTypesNewUser:SelectItem[];
    colBusinessRoles:SelectItem[];
    colCountriesSelection:SelectItem[];
   
    waitingforApprovalues:SelectItem[];
    coluserTypesNewUser:SelectItem[];
    coluserTypesHeader:SelectItem[];
    colTypesHeader:SelectItem[];
    public selectedHeaderType: any;    
    public selectedHeaderTypeId = "1";
    public selectedHeaderTypeUsers: any;    
    public selectedHeaderTypeUsersId = "1";
    public displayValidationforreset:boolean=false;
    public displayValidationforfirstname:boolean=false;
    public displayValidationforlastname:boolean=false;
    public searchVal: string = '';
    displaydiaLog: boolean = false;
    displaydiaLogEdit: boolean = false;
    displaydiaLogAdd: boolean = false;
    displaydiaLogAssign: boolean = false;
    displaydiaLogAssignFlag: boolean = false;
    public publishbutton: boolean = false;
    public showuserdashboarddata: boolean = false;
    public userdashboardparam:string='1';
    public itemLimit: number = 20;
    public isCheckednoManager = false;
    public itemOffset: number = 0;
    public user: any;
    public apiKey: string;
    public countryId;
    public domainId;
    public activeuserstyle:string='';
    public inactiveuserstyle:string='';
    public activeuserstyleonchange:string='';
    public inactiveuserstylechange:string='';
    public userId;
    public userparamDataValue;
    public roleId;
    public apiData: Object;
    public itemLength: number = 0;
    public itemTotal: number;
    public itemList: object;
    public itemResponse = [];
    public lastScrollTop: number = 0;
    public scrollInit: number = 0;
    public scrollTop: number;
    public scrollCallback: boolean = true;
    public resize: boolean = false;
    public gtsSelectAll: boolean = false;
    public thumbView: boolean = false;
    public displayNoRecords: boolean;
    public loading: boolean = true;
    public matrixActionFlag: boolean = false;
    public headerFlag: boolean = false;
    public headerData: Object;
    public ItemEmpty: boolean;
    public loadDataEvent: boolean=false;
    public lazyloadDataEvent: boolean=false;
    public sortFieldEvent: string='';
    public dataFilterEvent;
    public isFilterApplied=false;
    public sortorderEvent;
    public createAccess: boolean;
    public pmtTooltip: boolean = false;
    public wsTooltip: boolean = false;
    public positionTop: number;
    public positionLeft: number; 
    public pmtActionPosition: string;
    public submitFlag: boolean = false;
    public submitActionFlag: boolean = false;
    public matrixSuccess: boolean = false;
    public successMsg: string = "";
    public matrixFlag: any = null;
    public emptyIndex: any = '-1';
    public workstreamLists = [];
    public workstreamListsArr=[];
    public userDashboardheadsArr=[];
    public userDashboardheadsArrExport=[];
    public userthreadheadsArr=[];
    public userDashboardheadswid=[];
    public headerFields=[];
    public getuserDetails=[];
    public matrixSelectionList = [];
    public displayedColumns=[];
    public bodyHeight: number;
    public innerHeight: number;
    public innerWidth:number;
    public innerHeightnew: number;

    public passwordchecker:boolean = false;
    public successPasswordTextIcon: boolean = false;
    public disableDefaultPasswordText :boolean = false;
    public passwordValidationError:boolean = false;
    public passwordValidationErrorMsg: string = '';
    public passwordLen:number = 6;
    public fieldEnable: boolean = false;

    public addUserType1: boolean = true;
    public addUserType2: boolean = false;    
    public newUserTypeFlagDefault: boolean = true;
    public newuserForm: FormGroup;
    public edituserForm: FormGroup;
    public TVSDomain: boolean = false;
    public TVSIBDomain: boolean = false;
    public newUserType: any = '';
    public overwritePermissionFlag: boolean = false;
    public accounthasDropDownError: boolean = false;
    public accounthasDropDownErrorFlag: boolean = false;
    public ResetpasswordcontentValue: string = '';
    public updateAssignTextFlag: boolean = false;
    userListColumns: string[];
    cols: any[];
    _selectedColumns: any[];
    frozenCols: any[];
    public assignEmailId;
    public assignCountry;
    public assignGroup;
    public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
    public pTableHeight = '450px';
    public pTableHeightVal = 450;

    @ViewChild("dt", { static: false }) public dt: Table;
    @ViewChild('f') myForm;
    @ViewChild('uef') usrEditForm;

    @ViewChild('unf') usrNewForm;
    @ViewChild('unf1') usrNewForm1;

  onClick() {
    this.dt.reset();
  }
  
  notifyPopupScreen(position: string) {
    this.position = position;
    this.displayPosition = true;
}

   // userListSource: MatTableDataSource<UserListData>;
    usersList: UserListData[] = [];
    public usersLis;

    datasource:UserListData[] = [];
   // dataSource = new MatTableDataSource(this.usersList);
    public headercheckDisplay: string = "checkbox-hide";
    public headerCheck: string = "unchecked";
    pageAccess: string = "usermanagement";
  constructor(
    private titleService: Title,
    private router: Router,
    private userForm: FormBuilder,
    private scrollTopService: ScrollTopService,    
    private userDashboardApi: UserDashboardService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private renderer: Renderer2,
    private elRef : ElementRef,
    private commonService: CommonService,
    private excelService: ExcelService,
    private authenticationService: AuthenticationService, 
    private escalationApi: EscalationsService,
    
  ) {


    /* this.cities = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
        */
       this.workstreamsListdropdown=[];

      
       this.titleService.setTitle(localStorage.getItem('platformName')+' - '+this.title);
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }


   resetpasswordForm= this.userForm.group(
    {
      Resetradioaction:['1',Validators.required],

    Resetpasswordcontent:['',Validators.required],
}
  );

  delete(drop,wid):void{
    //console.log(this.workstreamArrayval);
    this.workstreamArrayval.forEach((item, index) => {
      if (item.id === wid)
        this.workstreamArrayval.splice(index, 1);
    });
    //console.log(this.workstreamArrayval);
    this.workstreamArrayval = this.workstreamArrayval;
    if(this.workstreamArrayval.length==0)
    {
      this.multiselectdefaultLabel=' p-mdefaultlabel';
    
     
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNamedefaultstr;
 
    }
    else
    {
      this.multiselectdefaultLabel=' p-mcustomlabel';
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNameselectedstr;
    }
   
        drop.options=this.workstreamsListdropdown;
        this.binSelect(drop);
      }
 
  binSelect(event)
  {
this.workstreamArrayval=event.value;
//console.log(event.value);
if(this.workstreamArrayval.length==0)
    {
      this.multiselectdefaultLabel=' p-mdefaultlabel';
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNamedefaultstr;
      this.accounthasWorkstreamError=true;
      this.workstreamValpushFlag = false;
    }
    else
    {
      this.multiselectdefaultLabel=' p-mcustomlabel';
      this.multiselectdefaultLabelName=this.multiselectdefaultLabelNameselectedstr;
      this.accounthasWorkstreamError=false;
      this.workstreamValpushFlag = true;
    }
    
  }



  emailExisteValidation()
  {
    return true;
  }
  get registerFormControl() {
    return this.resetpasswordForm.controls;
  }
  get UserEditFormControl() {
    return this.edituserForm.controls;
  }
  get UserNewFormControl() {
    return this.newuserForm.controls;
  }
  
  ngAfterViewInit(): void {
    const frozenBody: HTMLElement | null = document.querySelector('.ui-table-frozen-view .ui-table-scrollable-body');
    const scrollableArea: HTMLElement | null = document.querySelector('.ui-table-scrollable-view.ui-table-unfrozen-view .ui-table-scrollable-body');
    if (frozenBody && scrollableArea) {
      frozenBody.addEventListener('wheel', e => {
        const canScrollDown = scrollableArea.scrollTop < (scrollableArea.scrollHeight - scrollableArea.clientHeight);
        const canScrollUp = 0 < scrollableArea.scrollTop;

        if (!canScrollDown && !canScrollUp) {
          return;
        }

        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        const scrollDelta = 100;

        if (canScrollDown && scrollingDown) {
          e.preventDefault();
          scrollableArea.scrollTop += scrollDelta;
        } else if (canScrollUp && scrollingUp) {
          e.preventDefault();
          scrollableArea.scrollTop -= scrollDelta;
        }
      });
    }
  }

  ngOnInit(): void {
$('.mat-menu-content').addClass('ptablemenubar');
    //.log(this.elRef.nativeElement+'');
    window.addEventListener('scroll', this.scroll, true); //third parameter
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let countryInfo=localStorage.getItem('countryInfo');
    let platformId=localStorage.getItem('platformId');
    this.TVSDomain = (platformId=='2' && this.domainId == '52') ? true : false; 
    this.TVSIBDomain = (platformId=='2' && this.domainId == '97') ? true : false; 


    this.statuses = [{label: 'Verified', value: 'Verified'},{label: 'Not verified', value: 'Not verified'}];
    this.statuses = [{label: 'Verified', value: 'Verified'},{label: 'Not verified', value: 'Not verified'}];
    this.waitingforApprovalues=[{label: 'Waiting for approval', value: 'Waiting for approval'},{label: 'Approved', value: 'Approved'}];
    this.workstreamstatus = [{label: 'Select', value: 'Select'},{label: 'Admin', value: 'Admin'},{label: 'Member', value: 'Member'}];
    this.colaccountTypes = [{label: 'End-User', value: 'End-User'},{label: 'Manager', value: 'Manager'},{label: 'System Admin', value: 'System Admin'},{label: 'Country Admin', value: 'Country Admin'}];
    this.colaccountTypesNewUser = [{label: 'End-User', value: '1'},{label: 'Manager', value: '2'},{label: 'System Admin', value: '3'},{label: 'Country Admin', value: '6'}]
    if(this.TVSDomain){
      this.coluserTypesNewUser = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'}, {label: 'Agency', value: '3'}];
      this.coluserTypesHeader = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'}, {label: 'Agency', value: '3'}];    
    }
    else{
      this.coluserTypesNewUser = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'}];
      this.coluserTypesHeader = [{label: 'Employee', value: '1'},{label: 'Dealer', value: '2'}];    
    }     
    this.colTypesHeader = [{label: 'Active users', value: '1'},{label: 'Inactive users', value: '3'}, {label: 'Waiting for approval', value: '4' }];
    this.colBusinessRoles = [{label: 'Select', value: 'Select'},{label: 'Technician', value: 'Technician'},{label: 'CSM', value: 'CSM'},{label: 'Director', value: 'Director'},{label: 'VP', value: 'VP'}]
   
   //console.log(countryInfo);

   this.loadnewuserForm();
   this.loadedituserForm();

   // enabled all domains - strong password
   //alert(countryInfo);
   //if(this.domainId == '97'){
    this.passwordchecker = true;
    this.passwordLen = 8;
    this.fieldEnable = true;
  //}
    
  if(this.TVSDomain || this.TVSIBDomain){
    this.newUserType = '';
    this.selectedHeaderType = {
      label: 'Employee',
      value: '1',
    };
    this.selectedHeaderTypeId = '1';
  }
  else{
    this.newUserType = '1';
  }
    
   if(countryInfo && platformId=='2')
   {
    setTimeout(() => {
    this.colCountriesSelection =JSON.parse(countryInfo);
    },1000);     

  } 
  

  
//this.activeuserstyle='color:red';
//this.inactiveuserstyle='color:blue';
    this.userActivestatus = [{label: 'Active', value: 'Active'},{label: 'In Active', value: 'In Active'}]

    this.loadPTableHeaderRowsCols();

   


  //this.usersList=["1",""];
    let authFlag = ((this.domainId == 'undefined' || this.domainId == undefined) && (this.userId == 'undefined' || this.userId == undefined)) ? false : true;
    if(authFlag) {
      this.displayedColumns = ["one","tow","three","four"];
      this.displayedColumns = [this.dynamicColumn];

      
  let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'isActive': 1,
        'searchKey': this.searchVal,
        'limit': this.itemLimit,
        'offset': this.itemOffset
      }

      this.apiData = apiInfo;
      this.innerHeight = (window.innerHeight-300);

     
      this.headerData = {
        'access': this.pageAccess,
        'profile': true,
        'welcomeProfile': true,
        'search': true
      };
      //this.getuserDashboard();  
      setTimeout(() => {        
        this.showuserdashboard(1);
        this.getWorkstreamLists(); 
        this.getManagersList(); 
        this.threadheaderexport(); 

        let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
        let heigtVal = (window.innerHeight - 200) - (headerHeight);
        this.pTableHeight = heigtVal+'px';
        this.pTableHeightVal = (window.innerHeight - 110) - (headerHeight-10);
 
      }, 1000);
      
  }
  else
  {
    this.router.navigate(['/forbidden']);
  }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
}

// load/set Header
loadPTableHeaderRowsCols(){
  this.userDashboardheadsArr=[];
  this.userDashboardheadsArrExport=[];
  this.cols = [];
  this.headerFields= [];
  this.frozenCols = [];

  if(this.TVSDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.headerFields=['Login ID','Dealer Code','Dealer Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','City','State','Zone','Area','Territory','Manager name'];
    }
    else{
      this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','Manager name'];
    }
  }
  else if(this.TVSIBDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.headerFields=['Login ID','Dealer Code','Dealer Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','City','State','Contact Name', 'Contact Phone', 'Contact Email', 'Manager name'];
    }
    else{
      this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','Manager name'];
    }
  }
  else
  {
    this.headerFields=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','Manager name'];
  }
let headerFieldsExport;
  if(this.TVSIBDomain)
  {
    headerFieldsExport=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','Manager name','Dealer Code','Dealer Name','State','City','Contact Email', 'Contact Phone', 'Contact Name'];
    for(let w1=0;w1<headerFieldsExport.length;w1++)
    {
      this.userDashboardheadsArrExport.push(headerFieldsExport[w1]);
    }
  }
  if(this.TVSDomain)
  {
    headerFieldsExport=['Login ID','First Name','Last Name','Email Address','Email Status','Account Type','Status','Recent Activity','Business Role','Bussiness Title','Stagename','Join Date','Manager name','Dealer Code','Dealer Name','Zone','Area','Territory'];
    for(let w1=0;w1<headerFieldsExport.length;w1++)
    {
      this.userDashboardheadsArrExport.push(headerFieldsExport[w1]);
    }
  }
  
  for(let w1=0;w1<this.headerFields.length;w1++)
  {
    this.userDashboardheadsArr.push(this.headerFields[w1]);
  }
  if(this.TVSDomain)
  {

    if(this.selectedHeaderTypeId == '2'){
      this.cols = [  
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Role' ,columnpclass:'normalptabletow'},  
        { width:'170px',field: 'businessRole',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        { width:'200px',field: 'city',header: "City",columnpclass:'normalptabletow'},
        { width:'200px',field: 'state',header: "State",columnpclass:'normalptabletow'},
        { width:'200px',field: 'zone',header: "Zone",columnpclass:'normalptabletow'},
        { width:'200px',field: 'userarea',header: "Area",columnpclass:'normalptabletow'},
        { width:'200px',field: 'territory',header: "Territory",columnpclass:'normalptabletow'},  
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },        
      ];
    }
    else{
      this.cols = [  
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Role' ,columnpclass:'normalptabletow'},  
        { width:'170px',field: 'businessRole',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},        
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },        
      ];
    }
    
   
  }
  else if(this.TVSIBDomain)
  {

    if(this.selectedHeaderTypeId == '2'){
      this.cols = [  
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Role' ,columnpclass:'normalptabletow'},  
        { width:'170px',field: 'businessRole',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},
        { width:'200px',field: 'zone',header: "State",columnpclass:'normalptabletow'},
        { width:'200px',field: 'userarea',header: "City",columnpclass:'normalptabletow'},
        { width:'200px',field: 'contactPersonName',header: "Contact Name",columnpclass:'normalptabletow'},
        { width:'200px',field: 'contactPersonPhone',header: "Contact Phone",columnpclass:'normalptabletow'},
        { width:'200px',field: 'contactPersonEmail',header: "Contact Email",columnpclass:'normalptabletow'},
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },        
      ];
    }
    else{
      this.cols = [  
        { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
        { width:'170px',field: 'bussTitle',header: 'Business Role' ,columnpclass:'normalptabletow'},  
        { width:'170px',field: 'businessRole',header: 'Business Title' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'assigneeRole',header: 'Assignee Role' ,columnpclass:'normalptabletow'},
        { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
        { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
        { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},        
        { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
        { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
        { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
        { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
        { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },        
      ];
    }
   
  }
  else
  {
  this.cols = [
  
    { width:'200px',field: 'last_updated_on',header: 'Recent Activity',columnpclass:'normalptabletow' },
    { width:'170px',field: 'bussTitle',header: 'Business Role' ,columnpclass:'normalptabletow'},
    { width:'170px',field: 'businessRole',header: 'Business Title' ,columnpclass:'normalptabletow'},
   // { width:'170px',field: 'countrySelection',header: 'Country' ,columnpclass:'normalptabletow'},
    { width:'200px',field: 'Username',header: 'Stagename',columnpclass:'normalptabletow'},
    { width:'150px',field: 'created_on',header: 'Join Date',columnpclass:'normalptabletow'},
    { width:'200px',field: 'ManagerName',header: "Manager's name",columnpclass:'normalptabletow'},

    { width:'250px',field: 'EmailAddress',header: 'Email Address',columnpclass:'normalptabletow' },
    { width:'170px',field: 'IsVerified',header: 'Email Status' ,columnpclass:'normalptabletow'},
    { width:'170px',field: 'userRole',header: 'Account Type' ,columnpclass:'normalptabletow'},
    { width:'150px',field: 'isactive',header: 'Status',columnpclass:'normalptabletow' },
    { width:'200px',field: 'waitingforApproval',header: 'Waiting for approval',columnpclass:'normalptabletow' },
     
   
];
}

this._selectedColumns = this.cols;
if(this.TVSDomain || this.TVSIBDomain)
  {
    if(this.selectedHeaderTypeId == '2'){
      this.frozenCols = [
        { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
        { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
          { width:'165px',field: 'dealerName',header: 'Dealer Name' ,columnpclass:'frozenptabletow'},
         { width:'160px',field: 'dealerCode',header: 'Dealer Code' ,columnpclass:'frozenptabletow'},];
    }
    else{
      this.frozenCols = [
        { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
        { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
        { width:'165px',field: 'FirstName',header: 'First Name' ,columnpclass:'frozenptabletow'},
        { width:'160px',field: 'LastName',header: 'Last Name' ,columnpclass:'frozenptabletow'}];
      
    }
    
  }
  else{
this.frozenCols = [
  { width:'40px',field: 'LoginID',header: '',columnpclass:'frozenptabletow' },
  { width:'60px',field: 'profileImage',header: '',columnpclass:'frozenptabletow' },
    { width:'165px',field: 'FirstName',header: 'First Name' ,columnpclass:'frozenptabletow'},
    { width:'160px',field: 'LastName',header: 'Last Name' ,columnpclass:'frozenptabletow'},
    //{ width:'150px',field: 'DealerName',header: 'Dealer Name' ,columnpclass:'frozenptabletow'},
   // { width:'180px',field: 'DealerCode',header: 'Dealer Code' ,columnpclass:'frozenptabletow'},
   
];
  }
}
  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}


makeRowsSameHeight() {
  setTimeout(() => {
      if (document.getElementsByClassName('p-datatable-scrollable-wrapper').length) {
          let wrapper = document.getElementsByClassName('p-datatable-scrollable-wrapper');
          for (var i = 0; i < wrapper.length; i++) {
             let w = wrapper.item(i) as HTMLElement;
             let frozen_rows: any = w.querySelectorAll('.p-datatable-frozen-view tr');
             let unfrozen_rows: any = w.querySelectorAll('.p-datatable-unfrozen-view tr');
             for (let i = 0; i < frozen_rows.length; i++) {
                if (frozen_rows[i].clientHeight > unfrozen_rows[i].clientHeight) {
                   unfrozen_rows[i].style.height = frozen_rows[i].clientHeight+"px";
                   } 
                else if (frozen_rows[i].clientHeight < unfrozen_rows[i].clientHeight) 
                {
                   frozen_rows[i].style.height = unfrozen_rows[i].clientHeight+"px";
                }
              }
            }
          }
       });
     }

loadPage(event : LazyLoadEvent) {

  console.log(event.filters.EmailAddress);
  
  this.sortFieldEvent=event.sortField;
  this.sortorderEvent=event.sortOrder;
  this.dataFilterEvent=event.filters;
  this.isFilterApplied=true;
  this.loading=true;
  console.log('1223');
  this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
  this.loadDataEvent=true;
  /*
  setTimeout(() => {
    if(this.loadDataEvent==true)
    {
      this.showuserdashboard(this.userdashboardparam,'',event.sortField,event.sortOrder);
      this.loadDataEvent=false;
    }
   
    return false;
  },5000);
  */
 
 
  //event.preventDefault();
  //console.log(event);
  //return false;
  console.log(event);
  //console.log(event.sortField);
 // console.log(event.sortOrder);
  console.log(event.filters.EmailAddress);
  //alert(1);
  /*
  if (event.filters != undefined && event.filters["name"] != undefined){
  console.log(event.filters["name"]);
  console.log(event.filters);
  }
  */
}
scroll = (event: any): void => {
  console.log(event);
  console.log(event.target.className);
  if(event.target.className=='p-datatable-scrollable-body ng-star-inserted')
  {

  

  let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight-10;
    this.scrollTop = event.target.scrollTop-90;
    this.makeRowsSameHeight();
   // console.log(this.scrollTop +'--'+ this.lastScrollTop +'--'+ this.scrollInit);
/*
    if(this.scrollTop >= this.lastScrollTop && this.scrollInit > 0) {
      console.log(inHeight +'--'+ totalHeight +'--'+ this.scrollCallback +'--'+ this.itemTotal +'--'+ this.itemLength);
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        this.loading=true;
        this.getuserDashboard();
      }
    }
    this.lastScrollTop = this.scrollTop;
    */
   console.log(this.userdashboardparam);
   console.log(event.target.scrollTop+"--"+event.target.offsetHeight+"--"+event.target.scrollHeight);
   if((event.target.scrollTop>0 && event.target.scrollTop+event.target.offsetHeight>=event.target.scrollHeight-10) &&  this.itemTotal > this.itemLength && this.loadDataEvent==false)
   {

    //this.dt.reset();
    this.loading=true;
    this.loadDataEvent=true;
    console.log('1223');
    this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);
    //alert(1);
    event.preventDefault;
   }
  }
};

collectionHas(a, b) { //helper function (see below)
  for(var i = 0, len = a.length; i < len; i ++) {
      if(a[i] == b) return true;
  }
  return false;
}
findParentBySelector(elm, selector) {
  var all = document.querySelectorAll(selector);
  var cur = elm.parentNode;
  while(cur && !this.collectionHas(all, cur)) { //keep going up until you find a match
      cur = cur.parentNode; //go up
  }
  return cur; //will return null if not found
}
randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
addNewcolumn()
{
  var rString = this.randomString(5, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  this.cols.push({width:'180px',field: 'column'+rString,header: 'column '+rString,columnpclass:'normalptabletow'});

}
userActivestatusfun(event,userparam)
{
  let useractivevalue=0;
  if(event.value=='Active')
  {
    useractivevalue=1;
  }
  if(event.value=='In Active')
  {
    useractivevalue=0;
  }
  
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "IsAccountActive":useractivevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('activeuser'+userparam);

  //var yourElm = document.getElementById("yourElm"); //div in your original code
var selector = "td";
var parent = this.findParentBySelector(elss, selector);
 // alert(elss); 

 //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
 // this.renderer.setStyle(elss, 'color', this.selectedColorCode);

  this.renderer.addClass(parent, 'selectedItemp-table');
  this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');

  this.publishbutton=true;
}, 1000);


}
exportallThreads()
{
  let title = "Thread Expor";
        
        let exportInfo = [title,'All'];
        this.exportUserThreadALL(exportInfo);
}
exportUserThreadALL(exportInfo)
{
  this.excelreportdiaLog=true;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  
   
  this.userDashboardApi.GetallThreadExportData(apiFormData).subscribe((response) => {
    let exportData = response.threadData;
    this.excelreportdiaLog=false;
  this.excelService.generateExcel('userThread', exportInfo, exportData,this.userthreadheadsArr,this.userDashboardheadswid);
  });
}
threadheaderexport()
{
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  
   
  this.userDashboardApi.GetThreadExportAll(apiFormData).subscribe((response) => {
    if(response.status=='Success')
    {
     let threadHeaderDataInfo= response.threadHeader;
     for(var md2  in threadHeaderDataInfo)
     {
       this.userthreadheadsArr.push(threadHeaderDataInfo[md2].name);
       //console.log(headdataInfo[md1].name);
     }
     let modelDataInfo= response.modelData;
    for(var md in  modelDataInfo)
    {
      let headdataInfo=modelDataInfo[md].data;
      //console.log(modelDataInfo[md]);
      for(var md1  in headdataInfo)
      {
        this.userthreadheadsArr.push(headdataInfo[md1].name);
        //console.log(headdataInfo[md1].name);
      }

    }
    }
   // console.log(response);
  });
}

exportallUsersDashboard()
{
  let title = "userDashboard Reports";
      
        let exportInfo = [title,'All'];
        this.exportUserDashALL(exportInfo);
}

exportUserDashALL(exportInfo)
{
  this.excelreportdiaLog=true;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  let exportHeader;
  
   if(this.TVSIBDomain || this.TVSDomain)
   {
    exportHeader=this.userDashboardheadsArrExport;
   }
   else
   {
    exportHeader=this.userDashboardheadsArr;
   }
  this.userDashboardApi.getuserlist(apiFormData).subscribe((response) => {
    let exportData = response.data.user_details;
    this.excelreportdiaLog=false;
  this.excelService.generateExcel('userDashboard', exportInfo, exportData,exportHeader,this.userDashboardheadswid,this.domainId);
  });
}
userVerifystatusfun(event,userparam)
{
  //moment.tz.guess();
  let userverifiedvalue=0;
  if(event.value=='Verified')
  {
    userverifiedvalue=1;
  }
  if(event.value=='Not Verified')
  {
    userverifiedvalue=0;
  }
  
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "IsVerified":userverifiedvalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('verifyuseruser'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);


}

userAccountTypefun(event,userparam)
{
  //moment.tz.guess();
  let useraccountTypevalue=0;
  if(event.value=='End-User')
  {
    useraccountTypevalue=1;
  }
  if(event.value=='Manager')
  {
    useraccountTypevalue=2;
  }
  
  if(event.value=='System Admin')
  {
    useraccountTypevalue=3;
  }
  if(event.value=='Country Admin')
  {
    useraccountTypevalue=6;
  }
  
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "RoleID":useraccountTypevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('accounttype'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
  this.refreshOption=true;
}, 1000);

}


userBussinessRolefun(event,userparam)
{
  //moment.tz.guess();
  let useraccountTypevalue=0;
  if(event.value=='Technician')
  {
    useraccountTypevalue=1;
  }
  if(event.value=='CSM')
  {
    useraccountTypevalue=2;
  }
  
  if(event.value=='Director')
  {
    useraccountTypevalue=3;
  }
  if(event.value=='VP')
  {
    useraccountTypevalue=4;
  }
  
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "businessRole":useraccountTypevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('businessRole'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}

userCountryRolefun(event,userparam)
{
let CountryValueSelect=[];
if(event.value.length>0)
{
  for(var c=0;c<event.value.length;c++)
  {
    let cvalue=event.value[c].value;
    CountryValueSelect.push(cvalue);
  }

}
this.reguser_array.push({
  "userID":userparam,
  "countries":JSON.stringify(CountryValueSelect)
});
 //console.log(JSON.stringify(CountryValueSelect));
  setTimeout(()=>{                           //<<<---using ()=> syntax
    let elss=document.getElementById('countrySelection'+userparam);
    var selector = "td";
    var parent = this.findParentBySelector(elss, selector);
     // alert(elss); 
    
     //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
     // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
    
      this.renderer.addClass(parent, 'selectedItemp-table');
      this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
    this.publishbutton=true;
  }, 1000);
  //console alert(event);
}

updateAssigneeRole(event,userparam)
{
  //moment.tz.guess();
  let assigneeRolevalue=(event.target.value);;
  
  
  console.log('event :' + event);
  console.log((event.target.value)+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "assigneeRole":assigneeRolevalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('assigneeList'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}

userManagersfun(event,userparam)
{
  //moment.tz.guess();
  let userManagervalue=event.value;
  
  
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "ManagerName":userManagervalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('managersList'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}
userwaitingForapprovalfun(event,userparam)
{
  //moment.tz.guess();
  let userManagervalue=event.value;
  
  let userwaitingforvalue=0;
  if(event.value=='Approved')
  {
    userwaitingforvalue=0;
  }
  if(event.value=='Waiting for approval')
  {
    userwaitingforvalue=1;
  }
  console.log('event :' + event);
  console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
this.reguser_array.push({
  "userID":userparam,
  "waitingforApproval":userwaitingforvalue
});
console.log(this.reguser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('waitingforapproval'+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);

}
handleKeyup($event)
{
  //alert(11);
}
cancelresetpopup()
{
  //alert(111);
  this.loading = false;
  this.resetpasswordForm.reset();
  this.radioOptions= '1';
  this.resetpassvalidationmsg='';
  this.displaydiaLog = false;
  this.displayValidationforreset=false;
  this.ResetpasswordcontentValue = '';
  this.passwordValidationError = false;              
  this.passwordValidationErrorMsg = '';
  this.successPasswordTextIcon = false;
  this.disableDefaultPasswordText = false;
}

cancelnewusrpopup()
{
  this.loading = false;
  this.newuserForm.reset();
  this.radioOptions= '1';
  this.resetpassvalidationmsg='';
  this.displaydiaLog = false;
  this.displaydiaLogAdd=false;
  this.findnewformflag=false;
  this.isEmailExist=false;
  this.accounthasWorkstreamError = false;
  this.disableDefaultPasswordText = false;
  this.passwordValidationError = false;
  this.updateuservalidationmsg = '';
  this.workstreamValpush=[];
  this.workstreamValpushFlag = false;
  this.addUserType1 = true;
  this.addUserType2 = false;    
  this.successPasswordTextIcon = false;
  if(this.TVSDomain || this.TVSIBDomain){
    this.newUserType = '';
    this.newUserTypeFlagDefault = false;
    this.newuserForm.disable();
    this.newuserForm.get('newUserType').enable();
  } 
  this.loadnewuserForm(); 
}


cancelEdituserpopup()
{
  //alert(111);
  this.usrEditForm.resetForm();
 this.updateuservalidationmsg='';
  this.displaydiaLogEdit = false;  
  this.overwritePermissionFlag = false;
  this.alreadyExistFlag = false;
  
 // this.displayValidationforreset=false;
 if(this.TVSDomain || this.TVSIBDomain){
  this.newUserType = '';
  this.newUserTypeFlagDefault = false;  
} 
this.loadedituserForm(); 
this.loading = false;
}

closeresetpopup()
{
//alert(1);
this.cancelresetpopup();
}
showDialog(usersLis) {
  this.usersLis = usersLis;
  this.displaydiaLog = true;
  //this.cancelresetpopup();
}

DeleteUserDialog(usersLis,event)
{

  console.log(usersLis);
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'userDelete';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {  
      modalRef.dismiss('Cross click'); 
      console.log(recivedService);
      if(!recivedService) {
        return;
      } else {
       this.deleteUserAccunt(usersLis);
      }
    });
}
deleteUserAccunt(usersLis)
{
  let type:any = 1;
  let countryId = localStorage.getItem('countryId');
  console.log(countryId);
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('deletedUserId', usersLis.LoginID);
  apiFormData.append('countryId', countryId);  
  
  apiFormData.append('userId', this.apiData['userId']);
  


  this.userDashboardApi.DeleteUserAccount(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    
    
    {
    
      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = response.result;
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');
       
        
          // alert(this.userdashboardparam);
         
            this.showuserdashboard(this.userdashboardparam);

       
      }, 2000);
  
      }

      });

}
EditUserDialog(usersLis,event) {
  this.overwritePermissionFlag = false;
  this.alreadyExistFlag = false;
  this.primetablerowdata=usersLis;
  console.log(this.primetablerowdata);
  
  let userTypeValue = this.primetablerowdata['userType'];
  console.log(userTypeValue);
  if(this.TVSDomain || this.TVSIBDomain){
    this.newUserType = userTypeValue;
  }
  else{
    this.newUserType = '1';
  }    
  this.addUserType2 = (userTypeValue=='2') ? true : false;
  this.addUserType1 = (userTypeValue=='2') ? false : true;
  if(this.TVSDomain){
    this.loadDealerUsageMetrics();
  }
  this.loadedituserForm();
setTimeout(() => {
  if(this.addUserType2){
    if(this.TVSDomain){
      var zoneVal = usersLis.zone.toUpperCase();
      this.edituserForm.patchValue({
        editUserEmailAddress:usersLis.EmailAddress,
        editUserBussTitle:usersLis.bussTitle,  
        editDealerName:usersLis.dealerName,    
        editDealerCode:usersLis.dealerCode,
        editUserTerritory:usersLis.territory,
        editUserArea:usersLis.userarea,
        editUserZone:zoneVal,    
      });
    }
    else{
    this.edituserForm.patchValue({
      editUserEmailAddress:usersLis.EmailAddress,
      editDealerName:usersLis.dealerName,  
      editDealerCode:usersLis.dealerCode,
      editUserBussTitle:usersLis.bussTitle,  
      editcontactPersonName:usersLis.contactPersonName, 
      editcontactPersonPhone:usersLis.contactPersonPhone, 
      editcontactPersonEmail:usersLis.contactPersonEmail, 
    });
    }
  }
  else{
    this.edituserForm.patchValue({
      editUserEmailAddress:usersLis.EmailAddress,
      editUserFirstname:usersLis.FirstName,  
      editUserLastname:usersLis.LastName,
      editUserBussTitle:usersLis.bussTitle,  
    });
  }
  this.displaydiaLogEdit = true;   
}, 100);
  
  console.log(usersLis.zone);
  this.usersLis =usersLis;
   
}

AssignDialog() {
  this.displaydiaLogAssign = true;
}
cancelAssignpopup() {
  this.displaydiaLogAssign = false;
  this.newUserEmailAddress = '';
}
updateAssignpopup(){
  this.displaydiaLogAssign = false;

  const apiFormData = new FormData();
apiFormData.append('apiKey', this.apiData['apiKey']);
apiFormData.append('domainId', this.apiData['domainId']);
apiFormData.append('countryId', this.apiData['countryId']);
apiFormData.append('userId', this.apiData['userId']);
apiFormData.append('email', this.assignEmailId);
apiFormData.append('password', 'password123');
apiFormData.append('roleId', "");
apiFormData.append('firstname', "");
apiFormData.append('lastname',"");
apiFormData.append('groups', this.assignGroup);
apiFormData.append('userType', this.newuserForm.value.newUserType);
this.userDashboardApi.AddInviteUserbyAdmin(apiFormData).subscribe((response) => {
 if(response.status=="Success")
  {
    this.displaydiaLogAssignFlag = false;
    this.newformDisable=false;
   // this.displaydiaLog = false;
   this.cancelnewusrpopup();
  const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
  modalMsgRef.componentInstance.msg = response.message;
  setTimeout(() => {
  
      modalMsgRef.dismiss('Cross click');
      this.showuserdashboard(1,'2');
      this.workstreamArrayval=[];
      this.workstreamValpush=[];
      this.workstreamValpushFlag = false;
      this.loading=false;
        
  }, 2000);

  }
  else
{
this.loading=false;
this.newformDisable=false;
//alert(this.updateuservalidationmsg);
}
});

}

AddUserDialog() {

  this.findnewformflag=true;
  console.log();
 
  this.displaydiaLogAdd = true;
  if(this.TVSDomain){
    this.loadDealerUsageMetrics();
  }
  if(this.TVSDomain || this.TVSIBDomain){
    let value = '';
    this.addUserType2 = (value=='2') ? true : false;
    this.addUserType1 = (value=='2') ? false : true;
    this.newUserTypeFlagDefault = true;
    this.newUserType = value;
    this.workstreamValpushFlag = false;
    this.workstreamValpush = [];
    this.workstreamArrayval = [];
    this.loadnewuserForm();
  }
  
  
}
onChangeRadio($event: MatRadioChange)
{
  this.resetpassvalidationmsg = '';

if($event.value != undefined){
  if($event.value==2)
  {
    this.displayValidationforreset=true;
  }
  else
  {
    this.displayValidationforreset=false;
    this.ResetpasswordcontentValue = '';
    this.passwordValidationError = false;              
    this.passwordValidationErrorMsg = '';
  }
}
}
checkfirstnametext(event)
{
  
}
checklastanmetext(event)
{

}
checkpasswordtext(event)
{
  if(this.passwordchecker){
    this.fieldEnable = false;
    var inputVal = event.target.value.trim();
    var inputLength = inputVal.length; 

    if(this.passwordLen<=inputLength){
      this.checkPwdStrongValidation('new');
    }
    else{
      if(inputLength == 0){
        this.passwordValidationError = false;              
        this.passwordValidationErrorMsg = '';
      }
      if(this.passwordValidationError){
        this.checkPwdStrongValidation('new');
      }
      this.disableDefaultPasswordText = false;  
      this.successPasswordTextIcon = false;             
    }  
  }
}
/*get accounthasDropDownError()
{
  return (
    this.newuserForm.get('newUserAccountType').touched
    && this.newuserForm.get('newUserAccountType').invalid
  )
}*/
get userTypehasDropDownErrorType()
{  
  return (
    this.newuserForm.get('newUserType').touched
    && this.newuserForm.get('newUserType').invalid
  )
}
// user type change
onChange(value){
  this.addUserType2 = (value=='2') ? true : false;
  this.addUserType1 = (value=='2') ? false : true;
  if(value == '3'){
    this.tvsAgency = true;
  }
  this.newUserTypeFlagDefault = true;
  this.newUserType = value; 
  this.workstreamValpushFlag = false; 
  this.workstreamValpush = [];
  this.workstreamArrayval = [];
  this.loadnewuserForm();
}
onChangeAccountType(value){
  if(value > 0){
    this.accounthasDropDownError = false;
    this.accounthasDropDownErrorFlag = true;
  }
}
// header user type change
selectTypeLoad(event){
  //alert(event.value.value);
  this.selectedHeaderTypeId = event.value.value;
  this.loadPTableHeaderRowsCols();
  setTimeout(() => {
    this.showuserdashboard(1);
    this.getWorkstreamLists(); 
    this.getManagersList(); 
    this.threadheaderexport();  
  }, 100);    
}

// header user type change
selectTypeUsersLoad(event){
  //alert(event.value.value);
  this.selectedHeaderTypeUsersId = event.value.value;
  this.showuserdashboard(this.selectedHeaderTypeUsersId);
     
}

checkresetpasstext(event)
{
  this.resetpassvalidationmsg = '';
  //if(event.target.value!='')
  //{
    this.radioOptions= '2';
    this.displayValidationforreset=true;

    if(this.passwordchecker){
      this.fieldEnable = false;
      var inputVal = event.target.value.trim();
      var inputLength = inputVal.length; 
  
      if(this.passwordLen<=inputLength){
        this.checkPwdStrongValidation('reset');
      }
      else{
        if(inputLength == 0){
          this.passwordValidationError = false;              
          this.passwordValidationErrorMsg = '';
        }
        if(this.passwordValidationError){
          this.checkPwdStrongValidation('reset');
        }
        this.disableDefaultPasswordText = false;  
        this.successPasswordTextIcon = false;             
      }  
    }
    
 // }
  //else
 // {
    //this.custompasswordcheck=false;
   // this.defaultpasswordcheck=true;
   // this.displayValidationforreset=false;
  //}
  
console.log(event.target.value);

}
onSubmitresetForm(userId)
{
  this.loading=true;
  let submitresetform;
 // console.log(userId);
  let resetforms =this.resetpasswordForm.value;
  let resetradioVal=resetforms.Resetradioaction;
  let resetpassVal=resetforms.Resetpasswordcontent;
  let resetuserId=userId;
  if(resetradioVal==1)
  {
     resetpassVal='password123';
     submitresetform=true;
  }
  else
  {
    resetpassVal=resetforms.Resetpasswordcontent;
    if(resetpassVal!='')
    {

     
      if(this.passwordLen>resetpassVal.length || this.passwordValidationError){
        this.accounthaspasswordError=true;
        return;
      }
      else
      {
        this.accounthaspasswordError=false;
      }

      submitresetform=true;
      
    }
  }
  if(submitresetform)
  {  
    
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('logged_user', this.apiData['userId']);
    apiFormData.append('userid', resetuserId);
    apiFormData.append('password', resetpassVal);
    apiFormData.append('cpassword', resetpassVal);
    apiFormData.append('access_type', 'desktop');
  
    this.userDashboardApi.updateuserpassbyAdmin(apiFormData).subscribe((response) => {
      if(response.status=="Success" || response.status=="1")
      {
        this.displaydiaLog = false; 
        this.cancelresetpopup();
        const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
        modalMsgRef.componentInstance.msg = 'Password reset successfully';
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
          //this.showuserdashboard(1);
          this.loading=false;   
        }, 2000);  
      }
      else
      {
        this.loading=false;
        this.resetpassvalidationmsg=response.message;
        //alert(this.updateuservalidationmsg);
      }
    });
  }
  
  //console.log(this.resetpasswordForm.value);

}
onRowSelect(event)
{

  this.primetablerowdata=event.data;
console.log(event.data);
//event.data.FirstName='ddasdadsddadd';
}
onSubmitNewuserFormDealer()
{
}
onSubmitNewuserForm()
{
  
  let pwdVal = this.newuserForm.value.newUserTmpPassword.trim(); 
  if(this.passwordLen>pwdVal.length || this.passwordValidationError){
    this.accounthaspasswordError=true;
    return;
  }
  else
  {
    this.accounthaspasswordError=false;
  }

  

  this.updateuservalidationmsg='';
  this.loading=true;
  let newuserFormValues =this.newuserForm.value;
  let newUserEmailAddressvar='';
  let newUserFirstnamevar='';
  let newUserLastnamevar='';
  let newUserManagervar='';
  let newUserNoManagervar='';
  let newUserTmpPasswordvar='';
  let newUserAccountTypevar='';
  let newUserBussTitlevar='';
  let workstreamVal;

  let newUserTypevar='';
  let newUserDealerCodevar='';
  let newUserDealerNamevar='';
  let newUserCityvar='';
  let newUserStatevar='';
  let newUserAreavar='';
  let newUserZonevar='';
  let newUserAddress1var='';
  let newUserAddress2var='';
  let newUserTerritoryvar='';
  let contactPersonNamevar='';
  let contactPersonPhonevar='';
  let contactPersonEmailvar='';

  if(this.addUserType1){ 
    newUserTypevar =newuserFormValues.newUserType;     
    newUserEmailAddressvar =newuserFormValues.newUserEmailAddress;
    newUserFirstnamevar =newuserFormValues.newUserFirstname;
    newUserLastnamevar =newuserFormValues.newUserLastname;
    newUserManagervar  =newuserFormValues.newUserManager;
    newUserNoManagervar=newuserFormValues.newUserNoManager;
    newUserTmpPasswordvar=newuserFormValues.newUserTmpPassword;
    newUserAccountTypevar=newuserFormValues.newUserAccountType;
    newUserBussTitlevar=newuserFormValues.newUserBussTitle;
    workstreamVal=newuserFormValues.newUserworkstream;
  }
  else{
    newUserTypevar =newuserFormValues.newUserType;      
    newUserEmailAddressvar =newuserFormValues.newUserEmailAddress;
    newUserTmpPasswordvar=newuserFormValues.newUserTmpPassword;
    newUserDealerNamevar =newuserFormValues.newUserDealerName;
    newUserDealerCodevar =newuserFormValues.newUserDealerCode;
    newUserCityvar  =newuserFormValues.newUserCity;
    newUserStatevar =newuserFormValues.newUserState;
    newUserAddress1var =newuserFormValues.newUserAddress1;
    newUserAddress2var =newuserFormValues.newUserAddress2;
    newUserAccountTypevar='1';
    workstreamVal =newuserFormValues.newUserworkstream;
    if(this.TVSDomain){
      newUserTerritoryvar =newuserFormValues.newUserTerritory;
      newUserAreavar  =newuserFormValues.newUserArea;
      //newUserZonevar =newuserFormValues.newUserState;
      newUserZonevar =newuserFormValues.newUserZone;
    }
    if(this.TVSIBDomain){
      contactPersonNamevar =newuserFormValues.contactPersonName;
      contactPersonPhonevar  =newuserFormValues.contactPersonPhone;
      contactPersonEmailvar =newuserFormValues.contactPersonEmail;
    }
  }  
  let managerNameVal='';
  let noManager = '0';
  if(newUserNoManagervar)
  {
    managerNameVal='';
    noManager = '1';
  }
  else
{
  managerNameVal=newUserManagervar;
}
  console.log(newuserFormValues);
  
  
if(workstreamVal)
{
  for(let workstreamVals of workstreamVal) {
   
    console.log(workstreamVals.id);
   
      this.workstreamValpush.push(workstreamVals.id);
      
    

  }



}

this.accounthasDropDownError=false;
this.accounthasWorkstreamError=false;

if(newUserAccountTypevar == ''){    
  this.accounthasDropDownError = true;
  this.accounthasDropDownErrorFlag = false;
  return;
}
else{
  this.accounthasDropDownErrorFlag = true;
}

if(this.workstreamValpush.length==0)
  {
this.accounthasWorkstreamError=true;
this.workstreamValpushFlag = false;
    return;
  }
  else
  {
    this.accounthasWorkstreamError=false;
    this.workstreamValpushFlag = true;
  }

 


console.log(noManager);

const apiFormData = new FormData();
apiFormData.append('apiKey', this.apiData['apiKey']);
apiFormData.append('domainId', this.apiData['domainId']);
apiFormData.append('countryId', this.apiData['countryId']);
apiFormData.append('userId', this.apiData['userId']);
apiFormData.append('email', newUserEmailAddressvar);
apiFormData.append('password', newUserTmpPasswordvar);
apiFormData.append('roleId', newUserAccountTypevar);
apiFormData.append('groups', JSON.stringify(this.workstreamValpush));
apiFormData.append('firstname', newUserFirstnamevar);
apiFormData.append('lastname', newUserLastnamevar);

if(this.TVSDomain || this.TVSIBDomain){
  apiFormData.append('userType', newUserTypevar);
}
if(this.addUserType1){  
  apiFormData.append('bussTitle', newUserBussTitlevar); 
}
if(this.addUserType1 && !this.tvsAgency){  
  apiFormData.append('managername', managerNameVal);
  apiFormData.append('noManager', noManager);
}
else{   
  apiFormData.append('dealerName', newUserDealerNamevar);
  apiFormData.append('dealerCode', newUserDealerCodevar);
  apiFormData.append('city', newUserCityvar);
  apiFormData.append('state', newUserStatevar);
  apiFormData.append('address1', newUserAddress1var);
  apiFormData.append('address2', newUserAddress2var);
  if(this.TVSDomain){
    apiFormData.append('territory', newUserTerritoryvar);
    apiFormData.append('area', newUserAreavar);
    apiFormData.append('zone', newUserZonevar);
  }
  if(this.TVSIBDomain){
    apiFormData.append('contactPersonName', contactPersonNamevar);
    apiFormData.append('contactPersonPhone', contactPersonPhonevar);
    apiFormData.append('contactPersonEmail', contactPersonEmailvar);
  }
}


this.newformDisable=true;
new Response(apiFormData).text().then(console.log)

this.userDashboardApi.AddInviteUserbyAdmin(apiFormData).subscribe((response) => {
  if(response.status=="Success")
  {
    this.newformDisable=false;
   // this.displaydiaLog = false;
   this.cancelnewusrpopup();
  const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
  modalMsgRef.componentInstance.msg = 'User added Successfully';
  setTimeout(() => {
   if(this.TVSDomain || this.TVSIBDomain){    
    if(this.selectedHeaderTypeId != newUserTypevar){
      this.selectedHeaderTypeId = newUserTypevar; 
      if(this.selectedHeaderTypeId == '1'){
        this.selectedHeaderType = {
          label: 'Employee',
          value: '1',
        };
      } 
      if(this.selectedHeaderTypeId == '2'){
        this.selectedHeaderType = {
          label: 'Dealer',
          value: '2',
        };
      }
      else{
        this.selectedHeaderType = {
          label: 'Agency',
          value: '3',
        };
      }     
      this.loadPTableHeaderRowsCols();
      setTimeout(() => {
        this.showuserdashboard(1,'2');
        this.getWorkstreamLists(); 
        this.getManagersList(); 
        this.threadheaderexport();
        setTimeout(() => {
          modalMsgRef.dismiss('Cross click');
          this.workstreamArrayval=[];
          this.workstreamValpush=[];
          this.workstreamValpushFlag = false;
          this.loading=false; 
        }, 1000);
      }, 100);
     }
     else{
      modalMsgRef.dismiss('Cross click');
      this.showuserdashboard(1,'2');
      this.workstreamArrayval=[];
      this.workstreamValpush=[];
      this.workstreamValpushFlag = false;
      this.loading=false;
     }           
    }
    else{
      modalMsgRef.dismiss('Cross click');
      this.showuserdashboard(1,'2');
      this.workstreamArrayval=[];
      this.workstreamValpush=[];
      this.workstreamValpushFlag = false;
      this.loading=false;
    }      
  }, 2000);

  }
  else
{
this.loading=false;
this.updateuservalidationmsg=response.message;
this.newformDisable=false;
//alert(this.updateuservalidationmsg);
}
});



  console.log(JSON.stringify(this.workstreamValpush));
}
checkemailvalidationnew($event)
{

  var searchres=$event.target.value;
  var re = /.com/gi; 
//var str = "Apples are round, and apples are juicy.";
if (searchres.search(re) == -1 ) { 
   console.log("Does not contain Apples" ); 
} else { 
   console.log("Contains Apples" ); 

   const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', '');
    apiFormData.append('email', searchres);

    this.userDashboardApi.Checkemailstatus(apiFormData).subscribe((response) => {

      // alert(response.status);
       console.log(response.status);
       if(response.status=="Success")
       {
        this.isEmailExist=false;
        if(this.TVSIBDomain){
          if(response.emailExist == '1'){
            this.assignGroup = response.groups;
            this.assignEmailId = searchres;
            this.assignCountry = localStorage.getItem('countryName');
            this.displaydiaLogAssign = true;
            this.displaydiaLogAssignFlag = true;
          }
          else{
            this.displaydiaLogAssignFlag = false;
          }
        }
        else{
          this.displaydiaLogAssignFlag = false;
        }        
       }
       else
 {
  this.displaydiaLogAssignFlag = false;
  this.isEmailExist=true;

  
 }
     });

} 


  //console.log($event.target.value);
 // console.log($event);
 // alert($event.value);

}
onSubmitedituserForm(userId)
{
 
  

  this.updateuservalidationmsg='';
  this.loading=true;

  let edituserFormValues =this.edituserForm.value;
  let editUserEmailAddressval=edituserFormValues.editUserEmailAddress;
  let editUserBussTitleval=edituserFormValues.editUserBussTitle;
  editUserBussTitleval = editUserBussTitleval != undefined ? editUserBussTitleval : '';
  let newUserTypevar = this.newUserType;
  let editUserFirstnameval='';
  let editUserLastnameval='';
  let editDealerNameval='';
  let editDealerCodeval='';
  let editTerritoryval='';
  let editAreaval='';
  let editZoneval='';
  let editcontactPersonNameval='';
  let editcontactPersonPhoneval='';
  let editcontactPersonEmailval='';
  let editUserId=userId;

  if(this.addUserType2){
    editDealerNameval=edituserFormValues.editDealerName;
    editDealerCodeval=edituserFormValues.editDealerCode;
    if(this.TVSDomain){
      editTerritoryval=edituserFormValues.editUserTerritory;
      editZoneval=edituserFormValues.editUserZone;
      editAreaval=edituserFormValues.editUserArea;
    }
    if(this.TVSIBDomain){      
      editcontactPersonNameval=edituserFormValues.editcontactPersonName;
      editcontactPersonPhoneval=edituserFormValues.editcontactPersonPhone;
      editcontactPersonEmailval=edituserFormValues.editcontactPersonEmail;
    }
  }
  else{
    editUserFirstnameval=edituserFormValues.editUserFirstname;
    editUserLastnameval=edituserFormValues.editUserLastname;    
  }

  var apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('dealerId', editUserId);
    apiFormData.append('firstname', editUserFirstnameval);
    apiFormData.append('lastname', editUserLastnameval);
    apiFormData.append('bussTitle', editUserBussTitleval);
    apiFormData.append('emailAddress', editUserEmailAddressval);
    apiFormData.append('access_type', 'desktop');  
    if(this.addUserType2){
      apiFormData.append('dealerName', editDealerNameval);
      apiFormData.append('dealerCode', editDealerCodeval);
      if(this.TVSDomain){
        apiFormData.append('territory', editTerritoryval);
        apiFormData.append('area', editAreaval);
        apiFormData.append('zone', editZoneval);
      }
      if(this.TVSIBDomain){
        apiFormData.append('contactPersonName', editcontactPersonNameval);
        apiFormData.append('contactPersonPhone', editcontactPersonPhoneval);
        apiFormData.append('contactPersonEmail', editcontactPersonEmailval);
      }
    }  
    if(this.TVSDomain || this.TVSIBDomain){
      apiFormData.append('userType', newUserTypevar);
    }
    if(this.overwritePermissionFlag){
      apiFormData.append('overwrite', '1');
    } 
    else{
      apiFormData.append('overwrite', '0');
    } 
    
    // Display the key/value pairs
    
new Response(apiFormData).text().then(console.log)
   
    this.userDashboardApi.updateuserInfobyAdmin(apiFormData).subscribe((response) => {

     // alert(response.status);
      console.log(response.status);
      this.overwritePermissionFlag = false;
      if(response.status=="Success" && this.addUserType1)
      {
        
        let rowdataonce=this.primetablerowdata;
       
        if(this.addUserType2){
          this.primetablerowdata.dealerName=editDealerNameval;
          this.primetablerowdata.dealerCode=editDealerCodeval;
        }
        else{
          this.primetablerowdata.FirstName=editUserFirstnameval;
          this.primetablerowdata.LastName=editUserLastnameval;
        }

        this.primetablerowdata.bussTitle=editUserBussTitleval;
        this.primetablerowdata.EmailAddress=editUserEmailAddressval;
        //rowdataonce.FirstName='';
       // this.displaydiaLog = false;       
      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'User data updated successfully';
      setTimeout(() => {
        this.loading=false;
        this.cancelEdituserpopup();
        modalMsgRef.dismiss('Cross click');
       //this.showuserdashboard(1);
       
       
      }, 2000);
  
      }
      else if(response.status=="Success" && this.addUserType2)
      {
        if(response.successCode == '0'){
          
            // console.log(response);
             this.loading=false;
             this.updateuservalidationmsg=response.result;
           
        }
        else if(response.successCode == '2'){
          this.loading=false;
          this.alreadyExistFlag = true;
        }
        else{
        
        let rowdataonce=this.primetablerowdata;
       
        if(this.addUserType2){
          this.primetablerowdata.dealerName=editDealerNameval;
          this.primetablerowdata.dealerCode=editDealerCodeval;
          if(this.TVSDomain){
            var zoneVal = editZoneval.toUpperCase();
            this.primetablerowdata.territory=editTerritoryval;
            this.primetablerowdata.userarea=editAreaval;
            this.primetablerowdata.zone=zoneVal;
          }
          if(this.TVSIBDomain){            
            this.primetablerowdata.contactPersonName=editcontactPersonNameval;
            this.primetablerowdata.contactPersonPhone=editcontactPersonPhoneval;
            this.primetablerowdata.contactPersonEmail=editcontactPersonEmailval;
          }
        }
        else{
          this.primetablerowdata.FirstName=editUserFirstnameval;
          this.primetablerowdata.LastName=editUserLastnameval;
        }

        this.primetablerowdata.bussTitle=editUserBussTitleval;
        this.primetablerowdata.EmailAddress=editUserEmailAddressval;

        //rowdataonce.FirstName='';
       // this.displaydiaLog = false;       
      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'User data updated successfully';
      setTimeout(() => {
        this.loading=false;
        this.cancelEdituserpopup();
        modalMsgRef.dismiss('Cross click');
       //this.showuserdashboard(1);
       
       
      }, 2000);
    }
  
      }
      else
{
 // console.log(response);
  this.loading=false;
  this.updateuservalidationmsg=response.result;
}
    });

  
  //console.log(edituserFormValues);
}
overwriteYes(userId){
  this.overwritePermissionFlag = true;
  this.alreadyExistFlag = false;
  this.onSubmitedituserForm(userId);
}
overwriteNo(){
  this.overwritePermissionFlag = false;
  this.alreadyExistFlag = false;
}
loadedituserForm(){
  if(this.addUserType1){
      this.edituserForm= this.userForm.group(
        {
          editUserEmailAddress:['',[Validators.required,Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          editUserFirstname:['',Validators.required],
          editUserLastname:['',Validators.required],
          editUserBussTitle:[''],
        }
      );
  }
  else{
    if(this.TVSDomain){
      this.edituserForm= this.userForm.group({
        editUserEmailAddress:['',[Validators.required,Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        editUserBussTitle:[''],
        editDealerName:['',Validators.required],
        editDealerCode:['',Validators.required],
        editUserTerritory:[''],
        editUserArea:[''],
        editUserZone:[''],
      });
    }
    else if(this.TVSIBDomain){
      this.edituserForm= this.userForm.group({
        editUserEmailAddress:['',[Validators.required,Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        editUserBussTitle:[''],
        editDealerName:['',Validators.required],
        editDealerCode:['',Validators.required],
        editcontactPersonName:[''],
        editcontactPersonPhone:['',Validators.pattern('[- +()0-9]+')],
        editcontactPersonEmail:['',[Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      });
    }    
  }  
}
loadnewuserForm(){  
  if(this.addUserType1){
    this.newuserForm =  this.userForm.group({      
      newUserType:[this.newUserType,[Validators.required]],
      newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      newUserFirstname:['',Validators.required],
      newUserLastname:['',Validators.required],
      newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
      newUserBussTitle:[''],
      newUserAccountType:[''],  
      newUserNoManager:[''],
      newUserManager:[''],     
      newUserworkstream:['',Validators.required],
    });
  } 
  else{
    if(this.TVSDomain){
      this.newuserForm =  this.userForm.group({      
        newUserType:[this.newUserType,[Validators.required]],  
        newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
        newUserDealerName:['',[Validators.required]],  
        newUserDealerCode:['',[Validators.required]], 
        newUserCity:[''],  
        newUserState:[''], 
        newUserTerritory:[''],          
        newUserZone:[''],  
        newUserArea:[''],  
        newUserAddress1:[''],  
        newUserAddress2:[''],       
        newUserworkstream:['',Validators.required],
      });
    }
    else{
      this.newuserForm =  this.userForm.group({      
        newUserType:[this.newUserType,[Validators.required]],  
        newUserEmailAddress:['',[Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        newUserTmpPassword:['',[Validators.required,Validators.minLength(this.passwordLen)]],
        newUserDealerName:['',[Validators.required]],  
        newUserDealerCode:['',[Validators.required]], 
        newUserCity:[''],  
        newUserState:[''],  
        newUserAddress1:[''], 
        contactPersonName:[''],  
        contactPersonPhone:['',Validators.pattern('[- +()0-9]+')],
        contactPersonEmail:['',[Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        newUserAddress2:[''],       
        newUserworkstream:['',Validators.required],
      });
    }
 
}
setTimeout(() => {
  if(this.newUserType == ''){
    this.newUserTypeFlagDefault = false;
    this.newuserForm.disable();
    this.newuserForm.get('newUserType').enable();
  }
  else{
    this.newuserForm.enable();
  }  
}, 1000);
}
onChangeworkstreams(event,wid,userparam)
{
 // console.log('event :' + event);
    //console.log(event.value+'--'+wid+'--'+userparam);


    
  //moment.tz.guess();
  let wsselectedvalue="0";
  if(event.value=='Admin')
  {
    wsselectedvalue="1";
  }
  if(event.value=='Member')
  {
    wsselectedvalue="2";
  }
  if(event.value=='Select')
  {
    wsselectedvalue="0";
  }
  
  //console.log('event :' + event);
 // console.log(event.value+'--'+userparam);
this.activeuserstyleonchange='background:yellow';
/*
this.reguser_array.push({
  "userID":userparam,
  "IsVerified":wsselectedvalue
});
*/
this.workstreamuser_array.push({
  "param":wid,
  "status":wsselectedvalue,
  "user_id":userparam,
});
console.log(this.workstreamuser_array);

setTimeout(()=>{                           //<<<---using ()=> syntax
  let elss=document.getElementById('workstreamforuser'+wid+userparam);
  var selector = "td";
  var parent = this.findParentBySelector(elss, selector);
   // alert(elss); 
  
   //this.renderer.setStyle(parent, 'background-color', this.selectedBgColor);
   // this.renderer.setStyle(elss, 'color', this.selectedColorCode);
  
    this.renderer.addClass(parent, 'selectedItemp-table');
    this.renderer.addClass(elss, 'selectedItemp-tabletdcolor');
  this.publishbutton=true;
}, 1000);



}
getManagersList()
{
  let type:any = 1;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('type', type);

  this.userDashboardApi.getmanagersListbyDomain(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    {
      let resultset=response.data;
      let total_managers=resultset.total;
      let managers_array=resultset.data;
      let rowmanger=0;
      this.userManagersList.push({label: 'Select Manager', value: ''});
      for(let managers of managers_array) {
        rowmanger=rowmanger+1;
        if(rowmanger>1)
        {
          this.userManagersList.push({label: managers.userName, value: managers.userName});
        }
        

      }
    }
    
   


    //alert(this.dynamicColumn);
  });

console.log('--------------------');
console.log(this.userManagersList);
}
  getWorkstreamLists() {

    this.workstreamsListdropdown=[];
    this.workstreamLists = [];
    this.workstreamListsArr=[];

    let type:any = 1;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('type', type);
    apiFormData.append('fromUserDashboard', '1');
  
    this.userDashboardApi.getWorkstreamLists(apiFormData).subscribe((response) => {
      let resultData = response.workstreamList;
      for(let ws of resultData) {
        this.workstreamLists.push({workstreamId: ws.id, workstreamName: ws.name});
        this.workstreamsListdropdown.push({name: ws.name, id: ws.id});
        this.selectedworkstreamsList=this.workstreamsListdropdown[0];
        this.cols.push({width:'180px',field: 'workstreams'+ws.id+'',header: ws.name,'dynamicheader':'workstreams',columnpclass:'normalptabletow','workstreamId':ws.id});
        let wnamearr='"'+ws.name+'"';
        this.workstreamListsArr.push(wnamearr);
        this.userDashboardheadsArr.push(ws.name);
        this.userDashboardheadsArrExport.push(ws.name);
        this.userDashboardheadswid.push(ws.id);
  
      }

      
      this.cols.push( { width:'50px',field: 'toolbar',header: 'Menu',columnpclass:'normalptabletow' });
     // this.frozenCols.push( { width:'150px',field: 'isactive',header: 'Status' });

      console.log(this.cols);
      let showcolumns=this.workstreamListsArr;
      this.dynamicColumn=showcolumns.toString();
      this.loadDynamicColun=true;

     


      //alert(this.dynamicColumn);
    });
  }

   // Resize Widow
   @HostListener("window:resize", ["$event"])
   onResize(event) {
     setTimeout(() => {
      let headerHeight = (document.getElementsByClassName("push-msg")[0]) ? document.getElementsByClassName("push-msg")[0].clientHeight : 0;     
      let heigtVal = (window.innerHeight - 200) - (headerHeight);
      this.pTableHeight = heigtVal+'px';
      this.pTableHeightVal = (window.innerHeight - 110) - (headerHeight-10);
 
    }, 100);
  }

  @HostListener('scroll', ['$event'])
    scrollHandler(event) {
      console.debug("Scroll Event");
    }

    @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
     // console.log(event);
  
      // ESC key
      if (event.key == 'Escape') {
        this.updateuserScollPopup();
      
        // your logic;
      }
  }

  //@HostListener('scroll', ['$event'])
  lazyLoad(event: LazyLoadEvent) {

    console.log(11);
    console.log('1223');
    this.getuserDashboard();
    
  
  }
  showuserdashboard(param,orderby='',usersortField='',usersortOrder=0)
  {

    this.usersList=[];
  
  if(this.dt)
  {
   // this.dt.reset();
  }  
  
    if(param==1)
    {
      $('.total_active_userdash').addClass('countcoloractive');
      $('.total_iactive_userdash').removeClass('countcoloractive');
      $('.total_waitingfor_userdash').removeClass('countcoloractive');
      this.watitingforapprovalVisible=false;
      let elss=document.getElementsByClassName('tab-1');
      let el = this.elRef.nativeElement.querySelector(".tab-1");
      let el2 = this.elRef.nativeElement.querySelector(".tab-2");
      let el3 = this.elRef.nativeElement.querySelector(".tab-3");
      if(el)
      
      {
        
        this.renderer.addClass(el, 'active');
       
      }
      if(el2)
      {
        this.renderer.removeClass(el2, 'active');
       
      }
      if(el3)
      {
        this.renderer.removeClass(el3, 'active');
        
      }
     
     
      
      //this.renderer.remove('tab');;
      //this.renderer.setStyle(elss, 'color', '#FFFFFF');
    }
    if(param==3)
    {
      $('.total_active_userdash').removeClass('countcoloractive');
        $('.total_iactive_userdash').addClass('countcoloractive');
        $('.total_waitingfor_userdash').removeClass('countcoloractive');
      this.watitingforapprovalVisible=false;
      let elss=document.getElementsByClassName('tab-1');
      let el = this.elRef.nativeElement.querySelector(".tab-1");
      let el2 = this.elRef.nativeElement.querySelector(".tab-2");
      let el3 = this.elRef.nativeElement.querySelector(".tab-3");
      if(el)
      {
        this.renderer.removeClass(el, 'active');
      }
      if(el2)
      {
        this.renderer.addClass(el2, 'active');
      }
      if(el3)
      {
        this.renderer.removeClass(el3, 'active');
      }
      
     
      //this.renderer.remove('tab');;
      //this.renderer.setStyle(elss, 'color', '#FFFFFF');
    }
    if(param==4)
    {
      $('.total_active_userdash').removeClass('countcoloractive');
      $('.total_iactive_userdash').removeClass('countcoloractive');
      $('.total_waitingfor_userdash').addClass('countcoloractive');
      this.watitingforapprovalVisible=true;
      let elss=document.getElementsByClassName('tab-1');
      let el = this.elRef.nativeElement.querySelector(".tab-1");
      let el2 = this.elRef.nativeElement.querySelector(".tab-2");
      let el3 = this.elRef.nativeElement.querySelector(".tab-3");
      if(el)
      {
        this.renderer.removeClass(el, 'active');
      }
      if(el2)
      {
        this.renderer.removeClass(el2, 'active');
      }
      if(el3)
      {
        this.renderer.addClass(el3, 'active');
      }
    
      
     
      //this.renderer.remove('tab');;
      //this.renderer.setStyle(elss, 'color', '#FFFFFF');
    }
  this.userdashboardparam=param;
    this.loading=true;
    this.itemLimit=20;
    this.itemOffset=0;
    this.usersList=[];
    let orderbyparam='';
    if(orderby)
    {
  orderbyparam=orderby;
    }
    console.log('1223');
    this.getuserDashboard(param,orderbyparam,usersortField,usersortOrder);
  }
  onCancelaction()
  {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'userdashboard discard';
    modalRef.componentInstance.confirmAction.subscribe((recivedService) => {  
      modalRef.dismiss('Cross click'); 
      if(!recivedService) {
        return;
      } else {
       //alert(1);
       this.publishbutton=false;  
     // alert(this.userdashboardparam);
       this.showuserdashboard(this.userdashboardparam);
      }
    });
}
 

onPublishaction()
{
 
  

  //this.elRef.nativeElement.classList.remove('selectedItemp-table');
  //this.renderer.removeClass(this.tdptabletdata.nativeElement, 'oneclassstep');
  //const modalRef = this.modalService.open(SubmitLoaderComponent, this.modalConfig);
  this.loading=true;
 
  this.publishbutton=false;  
  let workstreamuser_arrayjson='';
  let updatereg='';
  if(this.workstreamuser_array.length>0)
  {
    workstreamuser_arrayjson= JSON.stringify(this.workstreamuser_array);
  }
  if(this.reguser_array.length>0)
  {
  updatereg= JSON.stringify(this.reguser_array);
  }

  if(this.reguser_array.length>0)
  {
    let activeCountText = '';
    let inactiveCountText = '';

    for(let rg of this.reguser_array){          
      if(this.selectedHeaderTypeUsersId != '3' && rg.IsAccountActive == '0'){       
        let userIndex = this.usersList.findIndex(option => option['LoginID'] == rg.userID );              
        this.usersList.splice(userIndex, 1); 

        console.log(this.totalRecordsActive);

        this.totalRecordsActive = (parseInt(this.totalRecordsActive) - 1).toString();;
        activeCountText = "("+this.totalRecordsActive+")";

        console.log(this.totalRecordsActive);
        console.log(this.totalRecordsInActive);
        
        this.totalRecordsInActive = (parseInt(this.totalRecordsInActive) + 1).toString();;
        inactiveCountText = "("+this.totalRecordsInActive+")";

        console.log(this.totalRecordsActive);

        let waitingforCountText = "("+this.totalRecordsWaitingFor+")";

        this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];
               
      }
      if(this.selectedHeaderTypeUsersId != '1' && rg.IsAccountActive == '1'){
        let userIndex = this.usersList.findIndex(option => option['LoginID'] == rg.userID );              
        this.usersList.splice(userIndex, 1);  

        this.totalRecordsActive = (parseInt(this.totalRecordsActive) + 1).toString();
        activeCountText = "("+this.totalRecordsActive+")";
        
        this.totalRecordsInActive = (parseInt(this.totalRecordsInActive) - 1).toString();
        inactiveCountText = "("+this.totalRecordsInActive+")";

        let waitingforCountText = "("+this.totalRecordsWaitingFor+")";

        this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];        

      } 
      if(rg.IsAccountActive == '0' || rg.IsAccountActive == '1'){
      switch(this.selectedHeaderTypeUsersId){
        case '1':
          this.selectedHeaderTypeUsers = {
            label: 'Active users '+activeCountText,
            value: this.selectedHeaderTypeUsersId,
          };         
          break;
        case '3':
          this.selectedHeaderTypeUsers = {
            label: 'Inactive users '+inactiveCountText,
            value: this.selectedHeaderTypeUsersId,
          };          
          break;       
      }
    }

    }
  
  
  }

   /*
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'isActive': 1,
    'searchKey': this.searchVal,
    'limit': this.itemLimit,
    'offset': this.itemOffset
  }
  */
  //this.apiData = apiInfo;
  let type:any = 1;
  let countryId = localStorage.getItem('countryId');
  console.log(countryId);
  const apiFormData = new FormData();
  apiFormData.append('api_key', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);  
  apiFormData.append('params', updatereg);
  apiFormData.append('paramArray', workstreamuser_arrayjson);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit',  this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);

  this.userDashboardApi.updateuserdashstatus(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    
    
    
    {
      this.reguser_array=[];
      this.workstreamuser_array=[];

      const modalMsgRef = this.modalService.open(SuccessComponent, this.modalConfig);
      modalMsgRef.componentInstance.msg = 'User data successfully updated';
      setTimeout(() => {
        modalMsgRef.dismiss('Cross click');
        if(this.refreshOption)
        {
          this.publishbutton=false;  
          this.refreshOption=false;
          // alert(this.userdashboardparam);
          this.getManagersList();
            this.showuserdashboard(this.userdashboardparam);
            

        }
        else

        {
          $( "td" ).removeClass( "selectedItemp-table" );
          $( ".selectedItemp-tabletdcolor" ).removeClass( "selectedItemp-tabletdcolor" );
       
          if(this.selectedHeaderTypeUsersId == '3' && this.totalRecordsInActive == '0'){              

            this.showuserdashboard(this.selectedHeaderTypeUsersId);
          }
          if(this.selectedHeaderTypeUsersId == '1' && this.totalRecordsActive == '0'){  

            this.showuserdashboard(this.selectedHeaderTypeUsersId);
          }
          
         this.loading=false;
        }
       
       
      }, 2000);

    }

  
});



}

updateuserScollPopup() 
{
  this.displayPosition=false;
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'userScollOption': 1,
   
  }
//alert(this.apiData['searchVal']);
  this.apiData = apiInfo;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userScollOption', this.apiData['userScollOption']);
  this.userDashboardApi.UpdateUserScrollPopup(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    {
     
    }
  });

}
  getuserDashboard(userparamData='',orderbyparam='',gusersortField='',gusersortOrder=0,dataFilterEvent='')
{
  if(dataFilterEvent)
  {
    dataFilterEvent=JSON.stringify(dataFilterEvent);
    if(this.isFilterApplied || this.itemOffset==0)
    {
      this.itemOffset=0;
      this.usersList=[];
    }
    this.isFilterApplied=false;
  }
  //alert(userparamData+'----');
  //alert(this.searchVal);
  if(userparamData=='')
  {
    this.userparamDataValue=1;
  }
  else
  {
    this.userparamDataValue=userparamData; 
  }
  let apiInfo = {
    'apiKey': Constant.ApiKey,
    'userId': this.userId,
    'domainId': this.domainId,
    'countryId': this.countryId,
    'isActive': 1,
    'searchKey': this.searchVal,
    'limit': this.itemLimit,
    'offset': this.itemOffset
  }
//alert(this.apiData['searchVal']);
  this.apiData = apiInfo;
  let type:any = 1;
  let sortorderint:any=gusersortOrder;
  const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('param', this.userparamDataValue);
  apiFormData.append('searchtext', this.apiData['searchKey']);

  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit',  this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);
  apiFormData.append('orderby', orderbyparam);
  apiFormData.append('sortOrderField', gusersortField);
  apiFormData.append('sortOrderBy', sortorderint);
  apiFormData.append('filterOptions', dataFilterEvent);
  
  if(this.TVSDomain || this.TVSIBDomain){
    apiFormData.append('userType', this.selectedHeaderTypeId);
  }

  this.userDashboardApi.getuserlist(apiFormData).subscribe((response) => {
    if(response.status=="Success")
    {
      this.loadDataEvent=false;
      this.noUserListFound=false;
      //console.log(response.status);
      let getuserdetailvar=response.data;
      let userScollOption=response.userScollOption;
      let total_count=getuserdetailvar.total;
      if(userScollOption==0)
      {
        this.notifyPopupScreen('center');
      }
     

      let total_count_active=getuserdetailvar.totalActive;
      let total_count_inactive=getuserdetailvar.totalInActive;
      let total_count_waitingfor=getuserdetailvar.totalWaitingFor;
      let resultData=response.data.user_details;
      console.log(resultData);
      this.showuserdashboarddata=true;
      if (total_count == 0) {
        this.loading=false;
        if(this.apiData['offset']==0)
        {
          this.noUserListFound=true;
          //alert(2);
          //if(total_count_active)
          //{
            this.totalRecordsActive=total_count_active;
            let activeCountText = "("+this.totalRecordsActive+")";
          //}
          //if(total_count_inactive)
          //{
            this.totalRecordsInActive=total_count_inactive;
            let inactiveCountText = "("+this.totalRecordsInActive+")";
          //}
          //if(total_count_waitingfor)
          //{
            this.totalRecordsWaitingFor=total_count_waitingfor;
            let waitingforCountText = "("+this.totalRecordsWaitingFor+")";
         // }

         this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];
          
        }
        
        this.ItemEmpty = true;
        this.headercheckDisplay = 'checkbox-hide';
        if(this.apiData['searchKey'] != '') {
          this.getuserDetails = [];
          this.ItemEmpty = false;
          this.displayNoRecords = true;
          //this.userListSource = new MatTableDataSource(this.usersList);
          //setTimeout(() => {
           // this.userListSource.sort = this.sort;
          //}, 1000);
        }
      
      }
      else
      {
       // alert(23);
        this.scrollCallback = true;
        this.scrollInit = 1;

        this.ItemEmpty = false;
        this.itemTotal = total_count;
        this.totalRecords = total_count;
        if(this.apiData['offset']==0)
        {

        //  this.totalRecordsActive=total_count_active;
         
          //if(total_count_active)
          //{
            this.totalRecordsActive=total_count_active;
            let activeCountText = "("+this.totalRecordsActive+")";
          //}
          //if(total_count_inactive)
          //{
            this.totalRecordsInActive=total_count_inactive;
            let inactiveCountText = "("+this.totalRecordsInActive+")";
          //}
          //if(total_count_waitingfor)
          //{
            this.totalRecordsWaitingFor=total_count_waitingfor;
            let waitingforCountText = "("+this.totalRecordsWaitingFor+")";
          //}
          this.colTypesHeader = [{label: 'Active users '+activeCountText, value: '1'},{label: 'Inactive users '+inactiveCountText, value: '3'}, {label: 'Waiting for approval '+waitingforCountText, value: '4' }];
          
         
          switch(this.userparamDataValue){
            case '1':
              this.selectedHeaderTypeUsers = {
                label: 'Active users '+activeCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
            case '3':
              this.selectedHeaderTypeUsers = {
                label: 'Inactive users '+inactiveCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
            case '4':
              this.selectedHeaderTypeUsers = {
                label: 'Waiting for approval '+waitingforCountText,
                value: this.userparamDataValue,
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
              break;
            default:
              this.selectedHeaderTypeUsers = {
                label: 'Active users '+activeCountText,
                value: '1',
              };
              this.selectedHeaderTypeUsersId = this.userparamDataValue;
            break;
          }
        }
       
        //this.primengConfig.ripple = true;        
        //console.log(this.matrixSelectionList.length)
        if(this.matrixSelectionList.length > 0) {
          this.headerCheck = 'checked';
        }
        let loadItems = false;
       
        for (var i in resultData) {
          {

            for ( const [key,value] of Object.entries( resultData[i] ) ) {

             // resultData[i].key=value;

            }
            if(resultData[i].last_updated_on)
            {
              resultData[i].last_updated_on= moment(moment.utc(resultData[i].lastUpdatedOn).toDate()).local().format('MMM DD, YYYY . h:mm A');
            }
            else
            {
              resultData[i].last_updated_on='';
            }
           // let lastUpdatedOn = moment.utc(resultData[i].lastUpdatedOn).toDate(); 
            
            resultData[i].created_on= moment(moment.utc(resultData[i].createdOn).toDate()).local().format('MMM DD, YYYY');
           
            
            this.usersList.push(resultData[i]);
            //this.datasource.push(resultData[i]);
            //this.usersList.push(mapusersListData(resultData[i]));
            if ((parseInt(i) + 1) + '==' + resultData.length) {
              loadItems = true;
            } 
          }
         // console.log(this.usersList+'----');
        
         
      }
      this.loading=false;

      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      
     // alert(total_count);
console.log(this.itemOffset);
      //alert(11);
      if(loadItems){
        setTimeout(() => {   
          if(this.itemOffset == 0){
            this.usersList=[];
            this.noUserListFound=true;
          }     
            let listItemHeight =
              document.getElementsByClassName("user-dashboard-p-table")[0]
                .clientHeight + 5;
            console.log("Window Height: " + this.pTableHeightVal);
            console.log("List Height" + listItemHeight);
            if (this.pTableHeightVal >= listItemHeight) {
              //this.makeRowsSameHeight();
              this.loading=true;
              this.loadDataEvent=true;            
              this.getuserDashboard(this.userdashboardparam,'',this.sortFieldEvent,this.sortorderEvent,this.dataFilterEvent);                
            }
        }, 650);
    }

    }
    

    
  }
  else
{
  this.loadDataEvent=false;
  this.loading=false;
  if(this.apiData['offset']==0)
  {
    this.noUserListFound=true;
  }
 

}
  });

  //alert(1);
}

showprofilePage(userProfile)
{
  let url = forumPageAccess.profilePage+userProfile;
  window.open(url, '_blank');
}
applySearch(val) {
  
  //alert(val);
  this.searchVal = val;
  this.apiData['searchKey'] = this.searchVal;
  this.itemLimit = 20;
  this.itemOffset = 0;
  this.itemLength = 0;
  this.itemTotal = 0;
  this.scrollInit = 0;
  this.lastScrollTop = 0;
  this.scrollCallback = true;
  this.loading = true;
  this.displayNoRecords = false;
  this.matrixActionFlag = false;
  this.usersList = [];    
  this.headerData['searchKey'] = this.searchVal;
  this.headerFlag = true;
  this.headerCheck = 'unchecked';
  this.headercheckDisplay = 'checkbox-hide';
 // this.matrixChangeSelection('empty');
 //console.log('1223');
  this.getuserDashboard(this.userdashboardparam);
}

// check strong password
checkPwdStrongValidation(type){
  if(this.passwordchecker){
    let pwdVal;
    if(type == 'reset'){
      pwdVal = this.resetpasswordForm.value.Resetpasswordcontent.trim();
    }
    else{
      pwdVal = this.newuserForm.value.newUserTmpPassword.trim();
    }

    let validateMsg = this.authenticationService.checkPwdStrongLength(pwdVal,this.passwordLen); 
    if(pwdVal.length>0){
      if(validateMsg==''){          
        this.passwordValidationError = false;        
        this.disableDefaultPasswordText = true;
        this.successPasswordTextIcon = true;
        this.passwordValidationErrorMsg = '';
      }
      else{
        this.passwordValidationError = true;        
        this.disableDefaultPasswordText = false;
        this.successPasswordTextIcon = false;
        this.passwordValidationErrorMsg = validateMsg;
      }
    }
    else{
      this.passwordValidationError = false;     
      this.disableDefaultPasswordText = false;
      this.successPasswordTextIcon = false;
      this.passwordValidationErrorMsg = '';
    }  
  }    
}


// load dealer code metrics
loadDealerUsageMetrics(){
  const apiFormData = new FormData();
	  apiFormData.append('api_key', this.apiData['apiKey']);
  apiFormData.append('domain_id', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);   
  apiFormData.append('user_id', this.apiData['userId']);
    this.escalationApi.getUsagemetricsfiltercontent(apiFormData).subscribe(res => {
      if(res.status=='Success'){
        // city
        let city_array=res.data[0].cityContent;
        let rowcity=0;
        this.cityContentList = [];
        this.cityContentList.push({label: 'Select City', value: ''});
        for(let cityval of city_array) {
          rowcity=rowcity+1;
          if(rowcity>1)
          {
            this.cityContentList.push({label: cityval, value: cityval});
          }
        }
        // territory
        let territory_array=res.data[0].territoryContent;
        let rowterritory=0;
        this.territoryContentList = [];
        this.territoryContentList.push({label: 'Select Territory', value: ''});
        for(let territoryval of territory_array) {
          rowterritory=rowterritory+1;
          if(rowterritory>1)
          {
            this.territoryContentList.push({label: territoryval, value: territoryval});
          }
        }
        // zone
        let zone_array=res.data[0].zoneContent;
        let rowzone=0;
        this.zoneContentList = [];
        this.zoneContentList.push({label: 'Select Zone', value: ''});
        for(let zoneval of zone_array) {
          rowzone=rowzone+1;
          if(rowzone>1)
          {
            this.zoneContentList.push({label: zoneval, value: zoneval});
          }
        }
        // area
        let area_array=res.data[0].areaContent;
        let rowarea=0;
        this.areaContentList = [];
        this.areaContentList.push({label: 'Select Area', value: ''});
        for(let areaval of area_array) {
          rowarea=rowarea+1;
          if(rowarea>1)
          {
            this.areaContentList.push({label: areaval, value: areaval});
          }
        }
        

      }
    });
  }

}






export interface UserListData {
  //[key: string]: Object[]
  
}



