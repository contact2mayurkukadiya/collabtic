import { Component, OnInit, HostListener, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Constant, IsOpenNewTab, ManageTitle, pageTitle, RedirectionPage, silentItems, windowHeight } from '../../../../common/constant/constant';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { ThreadPostService } from '../../../../services/thread-post/thread-post.service';
import { ApiService } from '../../../../services/api/api.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../../../components/common/success-modal/success-modal.component';
import { ConfirmationComponent } from '../../../../components/common/confirmation/confirmation.component';
import { SubmitLoaderComponent } from '../../../../components/common/submit-loader/submit-loader.component';
import { ProductMatrixService } from '../../../../services/product-matrix/product-matrix.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ThreadService } from '../../../../services/thread/thread.service';
import { AddLinkComponent } from '../../../../components/common/add-link/add-link.component';
import { FollowersFollowingComponent } from '../../../../components/common/followers-following/followers-following.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ManageUserComponent } from '../../../../components/common/manage-user/manage-user.component';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit,  OnDestroy{

  @Input() public mediaServices;
  @Input() public updatefollowingResponce;
  @ViewChild('print',{static: false}) print: ElementRef;
  @ViewChild('top',{static: false}) top: ElementRef;
  @ViewChild('tdpage',{static: false}) tdpage: ElementRef;
  @ViewChild('pdesp',{static: false}) pdesp: ElementRef;

  public sconfig: PerfectScrollbarConfigInterface = {};
  public bodyClass:string = "thread-detail";
  public bodyClass1:string = "landing-page";
  public bodyElem;
  public title:string = 'Thread ID#';
  public headerTitle: string = "";
  public loading:boolean = true;
  public postLoading:boolean = true;
  public newPostLoad : boolean = false;
  public threadViewErrorMsg;
  public threadViewError;
  public threadViewData:any;
  public threadId;
  public assignedUsersList=[];
  public assignedUsersPopupResponse=false;
  public headerData:any;
  public threadData:any;
  public taggedUsers = [];
  public assProdOwner = [];
  public rightPanel: boolean = true;
  public innerHeight: number;
  public bodyHeight: number; 
  public industryType: any = [];
  public viewThreadInterval: any;
  
  public postServerError:boolean = false;
  public postServerErrorMsg: string = '';
  
  public descMaxLen: number = 10000; 
  public postUpload: boolean = true;
  public manageAction: string;
  public platformId: string;
  public countryId;
  public domainId;
  public userId;
  public contentType: number = 2;
  public mediaUploadItems: any = [];
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public displayOrder: number = 0;
  public roleId;
  public apiData: Object;
  public user: any;  
  public postError: boolean = false;
  public postErrorMsg;
  public loginUsername;
  public loginUserRole;
  public loginUserProfileImg;
  public loginUserAvailability; 
  public closeStatus;
  public closedDate: string = '';
  public postButtonEnable: boolean = false;
  public continueButtonEnable: boolean = true;    
  public postSaveButtonEnable: boolean = false;
  public postDesc: string= '';
  public postEditDesc: string= '';
  public threadUserId: number = 0;
  public threadOwner: boolean =false;
  public escalationStatusView: boolean =false;
  public visibledealerClosePopup: boolean =false;
  public isDealerAccess;  
  public escalationStatusViewClass="";
  public supportFeedbackList=[];
  public imageFlag: string = 'false'; 
  //public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  public userRoleTitle: string = '';
  public itemLimit: any = 5;
  public itemOffset: any = 0;
  public itemLength: number = 0;
  public itemTotal: number;   
  public postLists = [];  
  public navUrl: string ='';
  public postData = [];
  public postDataLength: number = 0;
  public postApiData: object;
  public postEditApiData: object;
  public pageAccess: string = 'post';
  public dynamicGid: number= 0;

  public posteditServerError = false;
  public postEditServerErrorMsg = "";
  
  public editPostUpload: boolean = true;
  public dashboard: string = 'thread-dashboard';
  public dashboardTab: string = 'views';
  public threadRemindersData: any = [];

  public buttonTop: boolean = false;
  public buttonBottom: boolean = false;
  public currentPostDataIndex: any = 0;
  public teamSystem = localStorage.getItem('teamSystem');
  public techSubmmitFlag:boolean = false;
  public groups: string = '';
  public ppfrPopVal: any = [];
  public deletePostHeight: number;
  public automobileFlag: boolean = false;

  public trim1:string= '';
  public trim2:string= '';
  public trim3:string= '';
  public trim4:string= '';
  public trim5:string= '';
  public trim6:string= '';
  public trim:string='';
  public trimborder: boolean = false;
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public TVSDomain:boolean = false;
  public TVSIBDomain:boolean = false;
  public knowledgeDomain: boolean = false;
  public adminUserNotOwner: boolean = false;
  public closeAccess: boolean = false;
  public postTypeAccess:Boolean = false;
  public specialOwnerAccess: boolean = false;

  public textColorValues = [
    {color: "rgb(0, 0, 0)"},
    {color: "rgb(230, 0, 0)"},
    {color: "rgb(255, 153, 0)"},
    {color: "rgb(255, 255, 0)"},
    {color: "rgb(0, 138, 0)"},
    {color: "rgb(0, 102, 204)"},
    {color: "rgb(153, 51, 255)"},
    {color: "rgb(255, 255, 255)"},
    {color: "rgb(250, 204, 204)"},
    {color: "rgb(255, 235, 204)"},
    {color: "rgb(255, 255, 204)"},
    {color: "rgb(204, 232, 204)"},
    {color: "rgb(204, 224, 245)"},
    {color: "rgb(235, 214, 255)"},
    {color: "rgb(187, 187, 187)"},
    {color: "rgb(240, 102, 102)"},
    {color: "rgb(255, 194, 102)"},
    {color: "rgb(255, 255, 102)"},
    {color: "rgb(102, 185, 102)"},
    {color: "rgb(102, 163, 224)"}, 
    {color: "rgb(194, 133, 255)"},
    {color: "rgb(136, 136, 136)"},
    {color: "rgb(161, 0, 0)"},
    {color: "rgb(178, 107, 0)"},
    {color: "rgb(178, 178, 0)"},
    {color: "rgb(0, 97, 0)"},
    {color: "rgb(0, 71, 178)"}, 
    {color: "rgb(107, 36, 178)"},
    {color: "rgb(68, 68, 68)"},
    {color: "rgb(92, 0, 0)"}, 
    {color: "rgb(102, 61, 0)"},
    {color: "rgb(102, 102, 0)"},
    {color: "rgb(0, 55, 0)"},
    {color: "rgb(0, 41, 102)"},
    {color: "rgb(61, 20, 102)"}
  ];

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();      
  }

  constructor(
    private titleService: Title,
    private route: ActivatedRoute, 
    private router: Router,
    private location: Location,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService, 
    private threadPostService: ThreadPostService,
    private apiUrl: ApiService, 
    private modalService: NgbModal,
    private probingApi: ProductMatrixService,
    private threadApi: ThreadService,
    private sanitizer: DomSanitizer,
    private modalConfig: NgbModalConfig,
  ) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
      modalConfig.size = 'dialog-centered';
  }

   ngOnInit(): void {    
    this.bodyElem = document.getElementsByTagName('body')[0];   
    this.bodyElem.classList.add(this.bodyClass); 
    this.bodyElem.classList.add(this.bodyClass1);
    let url = RedirectionPage.Threads;
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
    localStorage.removeItem(pageDataInfo);
    if (this.teamSystem) {
      this.msTeamAccess = true;
      if (window.screen.width < 800) {
        this.msTeamAccessMobile = true;       
      }
      else{
        this.msTeamAccessMobile = false;
      }
    } else {
      this.msTeamAccess = false;
      // check fieldpulse or not...
      let currentURL = window.location.href;
      console.log(currentURL);
      let splittedURL1 = currentURL.split("://");
      console.log(splittedURL1);
      //splittedURL1[1] = "collabtic.fieldpulse.co";
      let splittedURL2 = splittedURL1[1].split(".");
      
      let splittedDomainURL1 = splittedURL2[0];
      let splittedDomainURL2 = splittedURL2[1];
      let splittedDomainURL = splittedURL2[0];
      let splittedDomainURLLocal = splittedDomainURL.split(":");
      console.log(splittedDomainURLLocal[0] + "---" + Constant.forumLocal);
      let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
      localStorage.removeItem(threadPostStorageText);

      //if( splittedDomainURL2 == 'fieldpulse' || splittedDomainURLLocal[0] == Constant.forumLocal ){ /* fieldpulse ms integration */  }
      if( splittedDomainURL2 == 'fieldpulse'){ /* fieldpulse ms integration */  }
      else{
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          /* your code here */
          //alert("Mobile");
          if (window.screen.width < 800) {
            // do something
            let deeplinkURL = Constant.deeplinkurl;
            this.router.navigate([deeplinkURL]);  
          }      
        }
        else{
          //alert("Desktop");      
        }
      }        
    }    
    
    console.log(this.route.params)
    this.route.params.subscribe( params => {
      this.threadId = params.id;
      if(Object.keys(params).length > 1) {
        let item = `${this.threadId}-new-tab`;
        localStorage.setItem(item, item);
      }
    }); 

    this.navUrl = "/threads/view/"+this.threadId;
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.platformId=localStorage.getItem('platformId');
    this.manageAction = 'new';
    this.pageAccess = 'post';

    this.knowledgeDomain = (this.platformId=='1' && this.domainId == '165') ? true : false; 
    this.TVSDomain = (this.platformId=='2' && this.domainId == '52') ? true : false; 
    this.TVSIBDomain = (this.platformId=='2' && this.domainId == '97') ? true : false; 
    console.log(this.TVSDomain);
    console.log(this.TVSIBDomain);
    
    let industryType = this.commonApi.getIndustryType();
    let title = (industryType.id == 3 && this.domainId == 97) ? ManageTitle.feedback : ManageTitle.thread;
    this.headerTitle = title;
    this.title = `${title} #${this.threadId}`;
    this.titleService.setTitle( localStorage.getItem('platformName')+' - '+this.title); 
       
    this.postApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,      
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
    this.postEditApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,      
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };

    this.industryType = this.commonApi.getIndustryType();
    console.log(this.industryType)
    
    this.commonApi._OnLayoutChangeReceivedSubject.subscribe((flag) => {
      this.rightPanel = JSON.parse(flag);
    });
  
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();      

    this.getUserProfile();

    this.getThreadInfo('init',0);

    /*if(!this.teamSystem) {
      setTimeout(() => {
        this.viewThreadInterval = setInterval(() => {
          let viewAncWidget = localStorage.getItem('viewThread');
          if (viewAncWidget) {
            console.log('in view');
            this.loading = true;
            this.getThreadInfo('init',0);
            localStorage.removeItem('viewThread');
          }
        }, 50)
      },1500);
    }*/

    this.commonApi.postDataReceivedSubject.subscribe((response) => {
      setTimeout(() => {
        let action = response['action'];
        console.log(action);
        let postId;
        switch(action) {
          case 'post-new':
            this.uploadedItems = [];
            this.postApiData['uploadedItems'] = this.uploadedItems;
            this.postApiData['attachments'] = this.uploadedItems;
            this.postUpload = false;
            setTimeout(() => {
              this.postUpload = true;
            }, 100);
            this.postLoading = true;
            this.resetReplyBox();  
            this.getThreadInfo('refresh',response['postId']);
            break;  
          case 'post-edit':
            this.resetEditReplyBox();
            for (var i in this.postData) {  
              this.postData[i].postView = true;                
            } 
            this.postData[this.currentPostDataIndex].postLoading = true; 
            this.getThreadInfo('edit',response['postId']);
            break; 
        }      
      }, 1000);     
    }); 
  }

  // user profile

  getUserProfile() {
    let userData = {
      'api_key': Constant.ApiKey,
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.loginUserRole = resultData.userRole;
      this.loginUserProfileImg = resultData.profile_image;
      this.loginUserAvailability = resultData.availability;
      this.loginUsername = resultData.username;    
    });
  }
  
  getThreadInfo(initVal,pid){   
  this.platformId=localStorage.getItem('platformId');  
  this.threadViewErrorMsg = '';  
  this.threadViewError = false;
  const apiFormData = new FormData();
  
  apiFormData.append('apiKey', Constant.ApiKey);
  apiFormData.append('domainId', this.domainId);
  apiFormData.append('countryId', this.countryId);
  apiFormData.append('userId', this.userId);
  apiFormData.append('threadId', this.threadId);
  apiFormData.append('platformId', this.platformId);
  if(initVal == 'init') {
    this.loading = true;
    let accessPlatForm:any = 3;
    apiFormData.append('platform', accessPlatForm);
  }
  
  this.threadPostService.getthreadDetailsios(apiFormData).subscribe(res => {
    
    if(res.status=='Success'){
      let url = RedirectionPage.Threads;
      let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
      let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
      this.threadViewData = res.data.thread[0];
      this.threadViewData['threadText'] = this.headerTitle;
      console.log(this.threadViewData);
      console.log(initVal)
      if(initVal != 'init') {
        let getNavText = this.commonApi.checkNavEdit(url);
        setTimeout(() => {
          console.log(getNavText)
          localStorage.setItem(getNavText.navEditText, 'true')
        }, 150);
      }
      localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
      console.log(this.threadViewData);
        this.techSubmmitFlag=false;
      if(this.domainId == '52' && this.platformId =='2' ){
        this.techSubmmitFlag = (this.threadViewData.summitFix == '1') ? true : false;
      }
      console.log(this.techSubmmitFlag);
      if(this.techSubmmitFlag){
        this.groups = this.threadViewData.groups;
      }
      
      this.threadViewData.techSubmmitFlag = this.techSubmmitFlag;
      this.threadViewData.buttonTop = (this.buttonTop) ? true : false; 
      this.threadViewData.buttonBottom = (this.buttonBottom) ? true : false;  
      this.threadViewData.industryType = this.industryType;

      if(this.threadViewData.industryType['id'] == 2) {
      
        this.threadViewData.trims = [];
  
        if(this.industryType.id == 2 && this.platformId !='1') {
          this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1[0] : '';        
          if(this.trim1 != ''){
            this.threadViewData.trims.push({
              key: this.trim1['key'],
              id: this.trim1['id'],
              name: this.trim1['name']          
            });
          }
          this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2[0] : '';
          if(this.trim2 != ''){
            this.threadViewData.trims.push({
              key: this.trim2['key'],
              id: this.trim2['id'],
              name: this.trim2['name']          
            });
          }
          this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3 != "[]" && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3[0] : '';
          if(this.trim3 != ''){
            this.threadViewData.trims.push({
              key: this.trim3['key'],
              id: this.trim3['id'],
              name: this.trim3['name']          
            });
          }
          this.trim4 = (this.threadViewData.trim4 != "" && this.threadViewData.trim4 != "[]" && this.threadViewData.trim4.length>0) ? this.threadViewData.trim4[0] : '';
          if(this.trim4 != ''){
            this.threadViewData.trims.push({
              key: this.trim4['key'],
              id: this.trim4['id'],
              name: this.trim4['name']          
            });
          }
          this.trim5 = (this.threadViewData.trim5 != "" && this.threadViewData.trim5 != "[]" && this.threadViewData.trim5.length>0) ? this.threadViewData.trim5[0] : '';        
          if(this.trim5 != ''){
            this.threadViewData.trims.push({
              key: this.trim5['key'],
              id: this.trim5['id'],
              name: this.trim5['name']          
            });
          }
          this.trim6 = (this.threadViewData.trim6 != "" && this.threadViewData.trim6 != "[]" && this.threadViewData.trim6.length>0) ? this.threadViewData.trim6[0] : '';  
          if(this.trim6 != ''){
            this.threadViewData.trims.push({
              key: this.trim6['key'],
              id: this.trim6['id'],
              name: this.trim6['name']          
            });
          }
          this.threadViewData.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
          console.log(this.threadViewData.trim);
  
          if(this.threadViewData.trims!=''){          
            if(this.threadViewData.trims.length>3){
              this.trimborder = true;
            }
          }
          console.log(this.threadViewData.trims);
          
        }
        else{
          this.threadViewData.trims = [];
    
          if(this.industryType.id == 2) {
            this.trim1 = (this.threadViewData.trimValue1 != "" &&this.threadViewData.trimValue1 != undefined && this.threadViewData.trimValue1 != "[]" && this.threadViewData.trimValue1.length>0) ? this.threadViewData.trimValue1[0] : '';                     
            if(this.trim1 != ''){
              this.threadViewData.trims.push({
                key: this.trim1['key'],
                id: this.trim1['id'],
                name: this.trim1['name']          
              });
            }
            this.trim2 = (this.threadViewData.trimValue2 != "" &&this.threadViewData.trimValue2 != undefined && this.threadViewData.trimValue2 != "[]" && this.threadViewData.trimValue2.length>0) ? this.threadViewData.trimValue2[0] : '';
            if(this.trim2 != ''){
              this.threadViewData.trims.push({
                key: this.trim2['key'],
                id: this.trim2['id'],
                name: this.trim2['name']          
              });
            }
            this.trim3 = (this.threadViewData.trimValue3 != "" && this.threadViewData.trimValue3 != undefined && this.threadViewData.trimValue3 != "[]" && this.threadViewData.trimValue3.length>0) ? this.threadViewData.trimValue3[0] : '';
            if(this.trim3 != ''){ 
              this.threadViewData.trims.push({
                key: this.trim3['key'],
                id: this.trim3['id'],
                name: this.trim3['name']          
              });
            }
            this.trim4 = (this.threadViewData.trimValue4 != "" && this.threadViewData.trimValue4 != undefined && this.threadViewData.trimValue4 != "[]" && this.threadViewData.trimValue4.length>0) ? this.threadViewData.trimValue4[0] : '';
            if(this.trim4 != ''){
              this.threadViewData.trims.push({
                key: this.trim4['key'],
                id: this.trim4['id'],
                name: this.trim4['name']          
              });
            }
            this.trim5 = (this.threadViewData.trimValue5 != "" &&this.threadViewData.trimValue5 != undefined && this.threadViewData.trimValue5 != "[]" && this.threadViewData.trimValue5.length>0) ? this.threadViewData.trimValue5[0] : '';        
            if(this.trim5 != ''){
              this.threadViewData.trims.push({
                key: this.trim5['key'],
                id: this.trim5['id'],
                name: this.trim5['name']          
              });
            }
            this.trim6 = (this.threadViewData.trimValue6 != "" &&this.threadViewData.trimValue6 != undefined && this.threadViewData.trimValue6 != "[]" && this.threadViewData.trimValue6.length>0) ? this.threadViewData.trimValue6[0] : '';  
            if(this.trim6 != ''){
              this.threadViewData.trims.push({
                key: this.trim6['key'],
                id: this.trim6['id'],
                name: this.trim6['name']          
              });
            }
            this.threadViewData.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
            console.log(this.threadViewData.trim);
    
            if(this.threadViewData.trims!=''){          
              if(this.threadViewData.trims.length>3){
                this.trimborder = true;
              }
            }
            console.log(this.threadViewData.trims);
            
          }
        }
      }

      if( this.threadViewData == 'undefined' || this.threadViewData == undefined  ){
        this.loading = false;
        this.threadViewErrorMsg = res.result;  
        this.threadViewError = true;   
        setTimeout(() => {
          this.commonApi.emitThreadListData(this.threadViewData);   
        }, 1);       
      }
      else{
        this.threadViewData = res.data.thread[0];               
        if(this.threadViewData != ''){ 
          this.threadViewData.likeCount = this.threadViewData.likeCount;
          this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount; 
          this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';       
          
          this.threadUserId = this.threadViewData.userId;
          let pImg = this.threadViewData.profileImage;
          let uName = this.threadViewData.userName;
          this.assProdOwner = [];
          this.assProdOwner.push({
            id:this.threadUserId,
            profileImage:pImg,
            emailAddress:uName
          })
          console.log(this.assProdOwner);
          this.specialOwnerAccess = this.threadViewData.ownerAccess == 1 ? true : false;         
          if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3'){
            this.threadOwner = true;
          } 
          if(this.userId != this.threadUserId && this.roleId=='3'){
            this.adminUserNotOwner = true
          }           
          if(this.threadViewData.escalateStatus!='' && this.platformId=='2')
          {
            this.escalationStatusView=true;
          this.escalationStatusViewClass="lowopacity";

          
          } 
          
          if(this.threadViewData.isDealer)
          {
            this.supportFeedbackList=this.threadViewData.supportFeedbackList;

          }                

          this.closeStatus = this.threadViewData.closeStatus;
          if(this.closeStatus==1){
            let closedate1 = this.threadViewData.closeDate;
            let closedate2 = moment.utc(closedate1).toDate();
            this.closedDate = moment(closedate2).local().format('MMM DD, YYYY . h:mm A'); 
            
            let closedCheckStatus = localStorage.getItem('closeThreadNow');
            setTimeout(() => {
              if(closedCheckStatus == 'yes'){
                localStorage.removeItem('closeThreadNow');
                let ht = this.top.nativeElement.scrollHeight - 1100;
                setTimeout(() => {
                  console.log(this.top.nativeElement.scrollHeight);
                  console.log(ht);                
                  this.top.nativeElement.scroll({
                    top: ht,  
                    left: 0,
                    behavior: 'smooth'  
                  }); 
                }, 700); 
              }
            }, 300);             
          }
          else{
            this.continueButtonEnable = true;
          } 
          // give access to Thread Edit, Delete
          let access = false;
          if(this.platformId == '1'){
            if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3' || this.roleId=='2')){ 
              access = true;
            }            
          }
          else{
            if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3')){
              access = true;
            }
          }

          // give access to close thread
          if(this.platformId == '1'){           
              this.closeAccess = true;     
          }
          else{
            if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3')){ 
              this.closeAccess = true;            
            }
          } 
          // give access to Reopen Thread 
          let reopenThread = false;
          if(this.platformId == '1'){
            if(this.closeStatus == 1 && this.threadViewData.newThreadTypeSelect == 'thread'){
              reopenThread = true;              
            }
          }
          else{
            if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3') && this.closeStatus==1 && this.threadViewData.newThreadTypeSelect=='thread'){
              reopenThread = true;              
            }
          }       
          
          // give access to reminderAccess          
          let reminderAccess = false;
          if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3')){            
            reminderAccess = true;
          }

          // Post type Access         
          if(this.knowledgeDomain){
            this.postTypeAccess = true;
            this.adminUserNotOwner = true;
            if(this.userId == this.threadUserId){
              this.adminUserNotOwner = false;
            }
          }
          else{
            if((this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1 || this.roleId=='3')){            
              this.postTypeAccess = true;
            }
          }
                    
          let ppfrAccess = false;            
          let ppfrAvailable = '';            
          if(this.TVSDomain || this.TVSIBDomain){
            let isPPFRAccess = this.threadViewData.isPPFRAccess;
            let isDealerAccess = this.threadViewData.isDealer;
            this.isDealerAccess=this.threadViewData.isDealer;
            ppfrAccess = isPPFRAccess == '1' || isDealerAccess == '1' ? true : false;   
            console.log(ppfrAccess);            
            if(ppfrAccess){     
              let dealerInfo = this.threadViewData.dealerInfo[0];
              let dealerName = dealerInfo.dealerName;  
              let dealerCity = dealerInfo.city;
              let dealerArea = dealerInfo.area;
              let vinNo = this.threadViewData.vinNo !='' && this.threadViewData.vinNo != null ? this.threadViewData.vinNo : '';
              let odometer = this.threadViewData.odometer !='' && this.threadViewData.odometer != null ? this.threadViewData.odometer : '' ;
              this.ppfrPopVal = {
                threadId: this.threadId,
                ppfrEdit : this.threadViewData.isPPFRAvailable,
                model: this.threadViewData.model,
                dealerName: dealerName,
                dealerCity: dealerCity,
                dealerArea: dealerArea,
                frameNumber: vinNo,
                odometer: odometer,
                page : this.pageAccess, 
              }
              ppfrAvailable = this.threadViewData.isPPFRAvailable;
              console.log(ppfrAvailable);  
            }                          
          }   
          console.log(ppfrAccess);             
          console.log(ppfrAvailable);
          this.headerData = {
            access: 'thread',
            title: this.headerTitle,
            'pageName': 'thread',
            'threadId': this.threadId,
            'threadStatus': this.threadViewData.threadStatus,
            'threadStatusBgColor': this.threadViewData.threadStatusBgColor,
            'threadStatusColorValue': this.threadViewData.threadStatusColorValue,
            'threadOwnerAccess': access,                
            'reminderAccess': reminderAccess,                
            'closeAccess': this.closeAccess,                
            'reopenThread': reopenThread,
            'closeThread': this.closeStatus,
            'techSubmmit': this.techSubmmitFlag,
            'scorePoint': this.threadViewData.scorePoint,
            'ppfrAccess': ppfrAccess, 
            'ppfrAvailable': ppfrAvailable,
            'newThreadTypeSelect': this.threadViewData.newThreadTypeSelect,    
            'WorkstreamsList': this.threadViewData.WorkstreamsList,    
          };
          
          
          this.threadRemindersData = this.threadViewData.remindersData != '' && this.threadViewData.remindersData != 'undefined' && this.threadViewData.remindersData != undefined ? this.threadViewData.remindersData : '';            
          if(this.threadRemindersData!=''){                
            for (var i in this.threadRemindersData) {                  
              let reminderdate1 = this.threadRemindersData[i].createdOn;
              let reminderdate2 = moment.utc(reminderdate1).toDate();
              this.threadRemindersData[i].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');                  
            }
          }            

         
          
          if(this.threadViewData.comment>0){ 
            
            if(initVal == 'init'){
              this.loading = false;
              this.postLoading = true;
              this.newPostLoad = true;              
              this.itemLength = 0 ;
              this.itemOffset = 0 ; 
              this.postData = [];      
              this.postButtonEnable = false;                
              this.imageFlag = 'false';                
              this.postDesc = '';            
              setTimeout(() => {                
                this.commonApi.emitThreadListData(this.threadViewData);   
              }, 1);
              this.getPostList();   
            }
            else if(initVal == 'edit'){
              setTimeout(() => {                
                this.commonApi.emitThreadListData(this.threadViewData);   
              }, 1);
              this.getPostUpdateList(pid,'edit');
            }
            else if(initVal == 'reminder'){
              let loadpid = this.threadViewData.comment-1;
              loadpid = this.postData[loadpid].postId; 
              setTimeout(() => {                
                this.commonApi.emitThreadListData(this.threadViewData);   
              }, 1);               
              this.getPostUpdateList(loadpid,'edit');                     
            }
            else{              
              if(pid == 0){
                for (var i in this.postData) {
                  this.postData[i].actionDisable = false;
                  if(this.userId == this.postData[i].userId || this.postData[i].ownerAccess == 1){
                    this.postData[i].actionDisable = true;
                  }
                  this.postData[i].editDeleteAction = false;
                  if((this.userId == this.postData[i].userId || this.postData[i].ownerAccess == 1 || this.roleId == '3' || this.roleId == '2')){
                    this.postData[i].editDeleteAction = true;
                  }
                }
              }                
              else{                             
                this.getPostUpdateList(pid,'last');
              }
              setTimeout(() => {                
                this.commonApi.emitThreadListData(this.threadViewData);   
              }, 1);
            }
            
          }
          else{
            this.loading = false;
            this.postLoading = false;
            this.newPostLoad = false;  
            setTimeout(() => {
              this.commonApi.emitThreadListData(this.threadViewData);   
            }, 1);
            
            if(initVal != 'reminder' && initVal != 'delete'){
              setTimeout(() => {
                let divHeight = this.tdpage.nativeElement.offsetHeight;
                console.log(divHeight);
                console.log(this.innerHeight);
  
                if(divHeight > this.innerHeight){
                  this.threadViewData.buttonTop = true; 
                  this.buttonTop = true; 
                  this.threadViewData.buttonBottom = false; 
                  this.buttonBottom = false; 
                } 
                else{
                  this.threadViewData.buttonTop = false;
                  this.buttonTop = false;  
                  this.threadViewData.buttonBottom = false;
                  this.buttonBottom = false;  
                }   

              }, 1500);                   
            }
                          
          }              
        }
        else{
          this.loading = false;
          this.postLoading = false;
          this.threadViewErrorMsg = res.result;  
          this.threadViewError = true; 
          setTimeout(() => {
            this.commonApi.emitThreadListData(this.threadViewData);   
          }, 1);       
        }
    }
   }
   else{
     this.loading = false;
     this.postLoading = false;
     this.threadViewErrorMsg = res.result;  
     this.threadViewError = true; 
     setTimeout(() => {
      this.commonApi.emitThreadListData(this.threadViewData);   
    }, 1);  
   }              
 },
 (error => {
   this.loading = false;
   this.postLoading = false;
   this.threadViewErrorMsg = error;
   this.threadViewError = ''; 
   setTimeout(() => {
    this.commonApi.emitThreadListData(this.threadViewData);   
  }, 1);      
 })
 );

 

}


  // post particular list
  getPostUpdateList(pid,ptype){
    this.platformId=localStorage.getItem('platformId'); 
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('postId', pid);
    apiFormData.append('platformId', this.platformId);

    this.threadPostService.getPostListAPI(apiFormData).subscribe(res => {
      console.log(456)
      if(res.status=='Success'){     
        this.postErrorMsg = "";  
        this.postError = false;                  
        this.postLoading = false;

          this.postLists = res.data.post;
          this.postDataLength = res.data.total;         
          let postAttachments = [];               
          if(this.postDataLength>0){
            for (var i in this.postLists) {
              this.postLists[i].postView = true;  
              this.postLists[i].postLoading = false;            
              this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' ? this.postLists[i].userRoleTitle : 'No Title';
              let createdOnNew = this.postLists[i].createdOnNew;
              let createdOnDate = moment.utc(createdOnNew).toDate();
              this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
              this.postLists[i].likeLoading = false;              
              this.postLists[i].likeCount = this.postLists[i].likeCount;
              this.postLists[i].likeCountVal = this.postLists[i].likeCount == 0 ? '-' : this.postLists[i].likeCount;
              this.postLists[i].likeStatus = this.postLists[i].likeStatus;
              this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';    
              this.postLists[i].attachments = this.postLists[i].uploadContents;   
              this.postLists[i].attachmentLoading = (this.postLists[i].uploadContents.length>0) ? false : true;
              postAttachments.push({
                id: this.postLists[i].postId,
                attachments: this.postLists[i].uploadContents
              });
              let contentWeb1 = '';              
              contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].contentWeb));
              this.postLists[i].editedWeb = contentWeb1;
              
              let contentWeb2 = contentWeb1;    
              this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2)); 

              this.postLists[i].action = 'view';
              this.postLists[i].postOwner = false;
              this.postLists[i].threadOwnerLabel = false;
              if(this.postLists[i].owner  == this.postLists[i].userId){
                this.postLists[i].threadOwnerLabel = true;
                this.postLists[i].postOwner = true;
              }
              this.postLists[i].actionDisable = false;
              if(this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1){
                this.postLists[i].actionDisable = true;
              }
              // post edit delete action
              this.postLists[i].editDeleteAction = false;
              if((this.userId == this.postLists[i].userId || this.postData[i].ownerAccess == 1|| this.roleId == '3' || this.roleId == '2')){
                this.postLists[i].editDeleteAction = true;
              }

              if(this.postLists[i].editHistory){                        
                let editdata = this.postLists[i].editHistory;            
                for (var ed in editdata) { 
                  let editdate1 = editdata[ed].updatedOnNew;
                  let editdate2 = moment.utc(editdate1).toDate();
                  editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');                  
                }  
              }
            
              this.postLists[i].remindersData = this.postLists[i].remindersData != '' && this.postLists[i].remindersData != undefined && this.postLists[i].remindersData != 'undefined' ? this.postLists[i].remindersData : '';                          
              if(this.postLists[i].remindersData != ''){                        
                let prdata = this.postLists[i].remindersData;            
                for (var pr in prdata) { 
                  let reminderdate1 = prdata[pr].createdOn;
                  let reminderdate2 = moment.utc(reminderdate1).toDate();
                  prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');                  
                }  
              }              
    
              if(ptype == 'edit'){ 
                let itemIndex = this.postData.findIndex(item => item.postId == pid);
                this.postData[itemIndex] = this.postLists[i];              
              }
              else{
                this.postData.push(this.postLists[i]);               
              }                 
            } 
            let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
            localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));             
        }
        else{
          this.postLoading = false;
          this.postErrorMsg = res.result;  
          this.postError = true;
        }
      }
      else{
        this.postData = [];                  
        this.postLoading = false;
        this.postErrorMsg = res.result;  
        this.postError = true;   
      }              
    }, (error => {
        this.postLoading = false;
        this.postErrorMsg = error;
        this.postError  = true;      
      })
    );
  } 
     
  // post list
  getPostList(){
    this.platformId=localStorage.getItem('platformId');
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('limit', this.itemLimit);
    apiFormData.append('offset', this.itemOffset);
    apiFormData.append('platformId', this.platformId);

    this.threadPostService.getPostListAPI(apiFormData).subscribe(res => {
      if(res.status=='Success'){
          this.postLists = res.data.post;
          this.postDataLength = res.data.total;
          if(this.postDataLength>0){
            this.itemTotal = this.postDataLength;
            this.itemLength += this.postLists.length;
            this.itemOffset += this.itemLimit;
            let postAttachments = [];
            for (var i in this.postLists) {  
              this.postLists[i].postView = true; 
              this.postLists[i].postStFlag = true; 
              this.postLists[i].postLoading = false;              
              this.postLists[i].userRoleTitle = this.postLists[i].userRoleTitle !='' ? this.postLists[i].userRoleTitle : 'No Title';
              let createdOnNew = this.postLists[i].createdOnNew;
              let createdOnDate = moment.utc(createdOnNew).toDate();
              this.postLists[i].postCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');               
              this.postLists[i].likeLoading = false;              
              this.postLists[i].likeCount = this.postLists[i].likeCount;
              this.postLists[i].likeCountVal = this.postLists[i].likeCount == 0 ? '-' : this.postLists[i].likeCount;
              this.postLists[i].likeStatus = this.postLists[i].likeStatus;
              this.postLists[i].likeImg = (this.postLists[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';    
              this.postLists[i].attachments = this.postLists[i].uploadContents;   
              this.postLists[i].attachmentLoading = (this.postLists[i].uploadContents.length>0) ? false : true;
              this.postLists[i].action = 'view';              
              this.postLists[i].threadOwnerLabel = false;
              if(this.postLists[i].owner  == this.postLists[i].userId){
                this.postLists[i].threadOwnerLabel = true;                
              }
              this.postLists[i].actionDisable = false;
              if(this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1){
                this.postLists[i].actionDisable = true;
              }
              // post edit delete action
              this.postLists[i].editDeleteAction = false;
              if((this.userId == this.postLists[i].userId || this.postLists[i].ownerAccess == 1 || this.roleId == '3' || this.roleId == '2')){
                this.postLists[i].editDeleteAction = true;
              }
              postAttachments.push({
                id: this.postLists[i].postId,
                attachments: this.postLists[i].uploadContents
              });

              if(this.postLists[i].editHistory){                        
                let editdata = this.postLists[i].editHistory;            
                for (var ed in editdata) { 
                  let editdate1 = editdata[ed].updatedOnNew;
                  let editdate2 = moment.utc(editdate1).toDate();
                  editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');                  
                }  
              }

              let contentWeb1 = '';              
              contentWeb1 = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.postLists[i].contentWeb));
              this.postLists[i].editedWeb = contentWeb1;

              let contentWeb2 = contentWeb1;    
              this.postLists[i].contentWeb = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(contentWeb2)); 

             this.postLists[i].remindersData = this.postLists[i].remindersData != '' && this.postLists[i].remindersData != 'undefined' && this.postLists[i].remindersData != undefined ? this.postLists[i].remindersData : '';                          
            if(this.postLists[i].remindersData != ''){                       
                let prdata = this.postLists[i].remindersData;            
                for (var pr in prdata) { 
                  let reminderdate1 = prdata[pr].createdOn;
                  let reminderdate2 = moment.utc(reminderdate1).toDate();
                  prdata[pr].createdOn = moment(reminderdate2).local().format('MMM DD, YYYY . h:mm A');                  
                }  
              }
             
              this.postData.push(this.postLists[i]);                           
            }   
            let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
            localStorage.setItem(threadPostStorageText, JSON.stringify(postAttachments));         
            setTimeout(() => {                       
              if(this.itemTotal >= this.itemLength && this.itemTotal >= this.itemOffset ){                                   
                this.getPostList();
              }
              else{               
                this.postLoading = false;
                this.newPostLoad = false;
                this.threadViewData.buttonTop = true; 
                this.buttonTop = true;  
                this.threadViewData.buttonBottom = false; 
                this.buttonBottom = false;                   
              }                            
            }, 1000);            

          }
          else{
            this.postLoading = false;
            this.postErrorMsg = res.result;  
            this.postError = true;
          }     
        }
        else{
          this.postData = [];                  
          this.postLoading = false;
          this.postErrorMsg = res.result;  
          this.postError = true;   
        }              
      },
      (error => {
        this.postLoading = false;
        this.postErrorMsg = error;
        this.postError  = true;      
      })
    );

  }   
   
  // Set Screen Height
  setScreenHeight() {     
    if(this.teamSystem) {
      this.innerHeight = windowHeight.heightMsTeam;     
      if(this.teamSystem){
        if (window.screen.width < 800) {
          this.innerHeight = this.innerHeight + 45;
          this.msTeamAccessMobile = true;
        }  
        else{
          this.msTeamAccessMobile = false;
        }  
      }
    } else {  
      this.innerHeight = (this.bodyHeight - 157 ); 
    }    
  } 
  // hide status fix tooltip
  changeTooltip(postId){
    for (var i in this.postData) {                   
      if(this.postData[i].postId == postId){      
        this.postData[i].postStFlag = false;  
      }
    }
  }

  // set solution status api
  setSolutionStatus(postStatus,postId,currentStatus){
    if(currentStatus != postStatus){
      
      this.postServerErrorMsg = '';  
      this.postServerError = true;  
     
      const apiFormData = new FormData();
           
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('postId', postId);
      apiFormData.append('postStatus', postStatus);      
    
      this.threadPostService.solutionStatusAPI(apiFormData).subscribe(res => { 
          if(res.status=='Success'){
            // PUSH API              
            let apiData = new FormData();    
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);              
            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
            // PUSH API             
              const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
              msgModalRef.componentInstance.successMessage = res.result; 
              setTimeout(() => {  
                for (var i in this.postData) {                   
                  if(this.postData[i].postId == postId){      
                    this.postData[i].postStatus = postStatus;  
                  }
                }              
                this.getThreadInfo('refresh',0);       
                msgModalRef.dismiss('Cross click'); 
              }, 1500);  
           }else{
            this.postLoading = false;
            this.postServerErrorMsg = res.result;  
            this.postServerError = true;   
          }              
        },
        (error => {
          this.postLoading = false;
          this.postServerErrorMsg = error;
          this.postServerError  = true;      
        })
      );
    }
   }

  // set post type
  setPostType(postType,postStatus,postId,action){
    if(action=='new'){
      this.newPost(postType,postStatus,'No');
    }
    else{
      this.editPost(postType,postStatus,'No',postId);
    }
  }
  
  // posted new reply
  newPost(postType,postStatus,closeStatus){  
    this.postServerErrorMsg = '';  
    this.postServerError = false;  
    this.postButtonEnable = false;
    const apiFormData = new FormData();
    this.imageFlag = 'true';    
    
    if(this.uploadedItems != '') {      
      if(this.uploadedItems.items.length>0){
        for(let a in (this.uploadedItems.items)) {          
          if(this.uploadedItems.items[a].flagId == 6) {
            this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
           if(this.uploadedItems.items[a].url=='') {
              this.postButtonEnable = true;
              return false;
           }
           else{
              this.postServerErrorMsg = '';  
              this.postServerError = false;               
            }
          }
        }
      }
    }
    let taggedUsers='';
    this.taggedUsers = [];
    let techSubmmitVal = (this.techSubmmitFlag) ? '1' : '0';
    console.log( this.assignedUsersList);
    if(this.assignedUsersList)
    {
      if(this.assignedUsersList.length>0)
      {
        for(let au in this.assignedUsersList)
        {
          
          this.taggedUsers.push(this.assignedUsersList[au].email);
              
        }
        taggedUsers=JSON.stringify(this.taggedUsers);
      }
       
    }

    let uploadCount = 0;
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
      this.uploadedItems.attachments.forEach(item => {
        console.log(item)
        if(item.accessType == 'media') {
          this.mediaUploadItems.push({fileId: item.fileId.toString()});
        } else {
          uploadCount++;
        }       
      });
    }

    console.log( this.taggedUsers);

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('description', this.postDesc);
    apiFormData.append('postType', postType);
    apiFormData.append('postStatus', postStatus);
    apiFormData.append('closeStatus', closeStatus);
    apiFormData.append('imageFlag', this.imageFlag); 
    apiFormData.append('summitFix', techSubmmitVal); 
    apiFormData.append('taggedUsers', taggedUsers);       
    apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    console.log( this.postDesc);

    this.threadPostService.newReplyPost(apiFormData).subscribe(res => {      
        if(res.status=='Success'){ 
          this.assignedUsersList=[];
          this.assignedUsersPopupResponse=false;
          
          let lastPostid = res.data.postId;
          apiFormData.append('threadId', this.threadId);
          apiFormData.append('postId', lastPostid);

          if(uploadCount == 0) {
            this.uploadedItems = [];
            this.mediaUploadItems = [];
            this.postUpload = false;             
            setTimeout(() => {    
              this.postUpload = true;
            }, 100);
          }
           
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {                      
            this.postApiData['uploadedItems'] = this.uploadedItems.items;
            this.postApiData['attachments'] = this.uploadedItems.attachments;
            this.postApiData['message'] = res.result;
            this.postApiData['dataId'] = lastPostid;
            this.postApiData['threadId'] = this.threadId;  
            this.postApiData['summitFix'] = techSubmmitVal;                    
            this.manageAction = 'uploading';
            this.postUpload = false;             
            setTimeout(() => {    
              this.postUpload = true;
            }, 100);
          }
          else{
             // PUSH API              
             let apiData = new FormData();    
             apiData.append('apiKey', Constant.ApiKey);
             apiData.append('domainId', this.domainId);
             apiData.append('countryId', this.countryId);
             apiData.append('userId', this.userId);              
             if(!this.techSubmmitFlag){this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });}
             // PUSH API
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = res.result; 
            setTimeout(() => {    
              this.postLoading = true;
              this.resetReplyBox();                
              this.getThreadInfo('refresh',lastPostid);       
              msgModalRef.dismiss('Cross click'); 
            }, 1500);  
          }      
          
        }
        else{
          this.postLoading = false;
          this.postServerErrorMsg = res.result;  
          this.postServerError = true;   
        }              
      },
      (error => {
        this.postLoading = false;
        this.postServerErrorMsg = error;
        this.postServerError  = true;      
      })
    );
 }
 
 // edit post
 editPost(postType,postStatus,closeStatus,postId){ 
    this.postSaveButtonEnable = false;
    this.postEditServerErrorMsg = '';  
    this.posteditServerError = true; 
    if(this.uploadedItems != '') {      
      if(this.uploadedItems.items.length>0){
        for(let a in (this.uploadedItems.items)) {          
          if(this.uploadedItems.items[a].flagId == 6) {
            this.uploadedItems.items[a].url = (this.uploadedItems.attachments[a].accessType == 'media') ? this.uploadedItems.attachments[a].url : this.uploadedItems.items[a].url;
            if(this.uploadedItems.items[a].url=='') {
                this.postSaveButtonEnable = true;
                return false;
            }
            else{
              this.postEditServerErrorMsg = '';  
              this.posteditServerError = false;               
            }
          }
        }
      }
    }
    let uploadCount = 0;
    if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.attachments.length > 0) {
      this.uploadedItems.attachments.forEach(item => {
        console.log(item)
        if(item.accessType == 'media') {
          this.mediaUploadItems.push({fileId: item.fileId.toString()});
        } else {
          uploadCount++;
        }       
      });
    }
    console.log(uploadCount, this.uploadedItems);
    const apiFormData = new FormData();
    this.imageFlag = 'true';    
    console.log( this.postEditDesc);
    console.log(this.mediaUploadItems, this.deletedFileIds, this.removeFileIds);
    let techSubmmitVal = (this.techSubmmitFlag) ? '1' : '0';
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('description', this.postEditDesc);
    apiFormData.append('postType', postType);
    apiFormData.append('postStatus', postStatus);
    apiFormData.append('closeStatus', closeStatus);
    apiFormData.append('imageFlag', this.imageFlag); 
    apiFormData.append('postId', postId);
    apiFormData.append('mediaCloudAttachments', JSON.stringify(this.mediaUploadItems));
    apiFormData.append('deleteMediaId', JSON.stringify(this.deletedFileIds));
    apiFormData.append('updatedAttachments',  JSON.stringify(this.updatedAttachments));
    apiFormData.append('deletedFileIds',  JSON.stringify(this.deletedFileIds));
    apiFormData.append('removeFileIds',  JSON.stringify(this.removeFileIds));
    apiFormData.append('summitFix', techSubmmitVal);   
     console.log(this.deletedFileIds);
     //return false;
    this.threadPostService.updateReplyPost(apiFormData).subscribe(res => {      
        let msgFlag = true;
        if(res.status=='Success'){
          if(Object.keys(this.uploadedItems).length > 0 && this.uploadedItems.items.length > 0 && uploadCount > 0) {
            this.editPostUpload = false;            
            this.postEditApiData['uploadedItems'] = this.uploadedItems.items;
            this.postEditApiData['attachments'] = this.uploadedItems.attachments; 
            this.postEditApiData['message'] = res.result;
            this.postEditApiData['dataId'] = postId;
            this.postEditApiData['threadId'] = this.threadId;
            this.postEditApiData['summitFix'] = techSubmmitVal;                         
            this.manageAction = 'uploading';
            this.postEditApiData['threadAction'] = 'edit';            
            setTimeout(() => {              
              this.editPostUpload = true;
            }, 100);
          }
          else{
             // PUSH API              
             let apiData = new FormData();    
             apiData.append('apiKey', Constant.ApiKey);
             apiData.append('domainId', this.domainId);
             apiData.append('countryId', this.countryId);
             apiData.append('userId', this.userId);              
             if(!this.techSubmmitFlag){this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });}
             // PUSH API
            const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
            msgModalRef.componentInstance.successMessage = res.result; 
            setTimeout(() => {
              this.resetEditReplyBox();
              for (var i in this.postData) {  
                this.postData[i].postView = true;                
              } 
              this.postData[this.currentPostDataIndex].postLoading = true;                
              this.getThreadInfo('edit',postId);       
              msgModalRef.dismiss('Cross click'); 
            }, 1500);  
          } 
          this.postSaveButtonEnable = true;     
          
        }
        else{
          this.postLoading = false;
          this.postSaveButtonEnable = true;
          this.postData[this.currentPostDataIndex].postLoading = false;    
          this.postEditServerErrorMsg = res.result;  
          this.posteditServerError = true;   
        }              
      },
      (error => {
        this.postLoading = false;
        this.postSaveButtonEnable = true; 
        this.postData[this.currentPostDataIndex].postLoading = false;   
        this.postEditServerErrorMsg = error;
        this.posteditServerError  = true;      
      })
    );
 }
 // edit open
 cancelPostAction(postId){
  this.mediaUploadItems = [];
  this.currentPostDataIndex = 0;  
  this.resetEditReplyBox();
  for (var i in this.postData) {  
    this.postData[i].postView = true; 
    this.postData[i].attachmentItems = this.postData[i].attachments;
    if(this.postData[i].postId == postId){
      //this.currentPostDataIndex = i;
    }               
  } 
  //this.postData[this.currentPostDataIndex].postLoading = true;   
  this.getThreadInfo('edit',postId); 
 }
 // edit open
 editPostAction(postId){
  for (var i in this.postData) {  
    this.postData[i].postView = true;  
    if(this.postData[i].postId == postId){
      this.mediaUploadItems = [];
      this.currentPostDataIndex = i;
      this.postData[i].postView = false; 
      this.posteditServerError = false;
      this.postEditServerErrorMsg = "";    
      
      this.postEditDesc =  this.postData[i].editedWeb; 
      console.log( this.postEditDesc);

      this.postSaveButtonEnable = true;
      this.postData[i].EditAttachmentAction = 'attachments';
      this.postData[i].attachmentItems = [];
      this.postData[i].attachmentItems  = this.postData[i].uploadContents; 
            
      for(let a of this.postData[i].attachmentItems) {
        a.captionFlag = (a.fileCaption != '') ? false : true;
        if(a.flagId == 6) {
          a.url = a.filePath;
          a.linkFlag = false;
          a.valid = true;
        }
      }
    }
  }
 }
 
  //close thread confirm
  closeThreadConfirm(){
    if(this.escalationStatusView){
      const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.access = 'escalationAction';
      modalRef.componentInstance.title = this.headerTitle;
      modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
        modalRef.dismiss('Cross click'); 

      });
    } 
    else
    {

  
    if(this.techSubmmitFlag){
      this.techSummitScore();
    }
    else{
      if(this.isDealerAccess==1)
      {
        this.visibledealerClosePopup=true;
      }
      else
      {
        const modalRef = this.modalService.open(ConfirmationComponent, {backdrop: 'static', keyboard: false, centered: true});
        modalRef.componentInstance.access = 'ThreadClose';
        modalRef.componentInstance.title = this.headerTitle;
        modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
          modalRef.dismiss('Cross click'); 
          console.log(receivedService);
          if(receivedService){
            this.closeThread();
          }
        });   
      }
      

      
    } 
  } 
  }

  tapontagUsers()
  {
    
   // alert(1);
    const apiFormData = new FormData();
    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    let apiData = {
      'apiKey': Constant.ApiKey,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'userId': this.userId,
      'threadId':this.threadId,
      'productOwner' : this.assProdOwner
    };

    
    let users=[];
    
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = "tag-users";
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.action = 'new';
    modalRef.componentInstance.selectedUsers = this.assignedUsersList;
    
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      if(!receivedService.empty) {
        if(receivedService)
        {
          this.taggedUsers=[];
          for(let vt in receivedService)
          {
            //receivedService[vt].email;
            if(receivedService[vt].email)
            {
              if(this.taggedUsers.length>0)
              {
                for(let et in this.taggedUsers)
                {
                  if(this.taggedUsers[et]!=receivedService[vt].email)
                  {
                    let rmIndex = this.taggedUsers.findIndex(option => option == receivedService[vt].email);
                    if(rmIndex < 0)
                      {
                        this.taggedUsers.push(receivedService[vt].email);
                      }
                  }
                }

              }
              else
              {
                this.taggedUsers.push(receivedService[vt].email);
              }
             
            }
            
          }
        }
       
        this.assignedUsersList=receivedService;

  
        this.assignedUsersPopupResponse=true;

      }
     
      console.log(this.taggedUsers);
      
      

      modalRef.dismiss('Cross click');
    });

  }
  removeE1scSelection(id) {

    let rmIndex = this.assignedUsersList.findIndex(option => option.id == id);
    this.assignedUsersList.splice(rmIndex, 1);  
    
  }
  feedbackSubmit(id)
  {
//alert(id);
  
  if(id) 
  {
    $('.feedback-id'+id+'').addClass('bg-border'); 
    this.closeThread(id);
  }

  }

  // thread closed
  closeThread(feedbackId=''){
    this.postServerErrorMsg = '';  
    this.postServerError = true;  
    this.postButtonEnable = false;
    this.continueButtonEnable = false;
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);
    apiFormData.append('closeStatus', 'yes');
    apiFormData.append('emailFlag', '1'); 
    apiFormData.append('feedbackStatus', feedbackId); 
    if(feedbackId)
    {
      $('.feedback-id'+feedbackId+'').removeClass('bg-border');  
      this.visibledealerClosePopup=false;
    }
    
       
  
    this.threadPostService.closeThread(apiFormData).subscribe(res => {      
        if(res.status=='Success'){
          if(this.platformId=='1'){
            // PUSH API              
            let apiData = new FormData();    
            apiData.append('apiKey', Constant.ApiKey);
            apiData.append('domainId', this.domainId);
            apiData.append('countryId', this.countryId);
            apiData.append('userId', this.userId);              
            this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
            // PUSH API
          }          
          localStorage.setItem('closeThreadNow', 'yes');
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          msgModalRef.componentInstance.successMessage = res.result;
          setTimeout(() => {           
            this.getThreadInfo('refresh',0);             
            msgModalRef.dismiss('Cross click'); 
          }, 1500);  
        }
        else{
          this.postButtonEnable = true;
          this.postServerErrorMsg = res.result;  
          this.postServerError = true;   
          this.continueButtonEnable = true;
        }              
      },
      (error => {
        this.postButtonEnable = true;
        this.postServerErrorMsg = error;
        this.postServerError  = true;  
        this.continueButtonEnable = true;    
      })
    );
 }

 // thread delete confirm
 threadDeleteConfirm(){   
  const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'ThreadDelete';
    modalRef.componentInstance.title = this.headerTitle;
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      console.log(receivedService);
      if(receivedService){
        this.deleteThreadPost('thread',0);        
      }
    });  
 }

  // post delete confirm
  postDeleteConfirm(pid){
    if(pid>0){
     const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
       modalRef.componentInstance.access = 'PostDelete';
       modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
         modalRef.dismiss('Cross click'); 
         console.log(receivedService);
         if(receivedService){
           this.deleteThreadPost('post',pid);
         }
       });
    }
  }
  
  // thread closed
  deleteThreadPost(type, id){
    this.postServerErrorMsg = '';  
    this.postServerError = true;     
    const apiFormData = new FormData();

    let thread_id;
    let post_id;

    if(type == 'thread'){
      thread_id = this.threadViewData.threadId;
      post_id = this.threadViewData.postId;
    }
    else{
      thread_id = this.threadViewData.threadId;
      post_id = id;
    }

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', thread_id);
    apiFormData.append('postId', post_id);
  
    this.threadPostService.deleteThreadPostAPI(apiFormData).subscribe(res => {      
        if(res.status=='Success'){
          const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
          let successMsg = '';
          if(type == 'thread'){
            successMsg = 'Thread Deleted Successfully';
          }
          else{
            successMsg = 'Post Deleted Successfully'
          }
          msgModalRef.componentInstance.successMessage = successMsg;
          setTimeout(() => {    
            msgModalRef.dismiss('Cross click'); 
            if(type == 'thread'){
              let chkLandingRecentFlag = localStorage.getItem('landingRecentNav');
              let chkNavData = this.commonApi.checkNavEdit();
              let navFromEdit: any = chkNavData.navFromEdit;
              let routeLoadIndex: any = chkNavData.routeLoadIndex;
              let url = chkNavData.url;
              navFromEdit = (navFromEdit == null || navFromEdit == 'undefined' || navFromEdit == undefined) ? null : navFromEdit;
              let chkRouteLoad;
              if(routeLoadIndex >= 0) {
                let routeText = pageTitle[routeLoadIndex].routerText;
                chkRouteLoad = localStorage.getItem(routeText);
              }
              let routeLoad = (chkRouteLoad == null || chkRouteLoad == 'undefined' || chkRouteLoad == undefined) ? false : chkRouteLoad;
              if(navFromEdit || routeLoad) {
                this.router.navigate([url]);
              } else {
                this.location.back();
              }
              if(!chkLandingRecentFlag) {
                let data = {
                  access: 'threads',
                  action: 'silentDelete',
                  pushAction: 'load',
                  threadId: thread_id
                }
                this.commonApi.emitMessageReceived(data);
              }
              setTimeout(() => {
                localStorage.removeItem('wsNav');
                localStorage.removeItem('wsNavUrl');
                localStorage.removeItem(silentItems.silentThreadCount);
              }, 100);
              //let url = `${type}s`;
              /*if(this.teamSystem) {
                this.loading = true;
                window.open(url, IsOpenNewTab.teamOpenNewTab);
              } else {
                window.close(); 
                window.opener.location.reload(); 
              }*/             
            }
            else{
              this.deletePost(post_id);
            }
          }, 1500);  
        }
        else{         
          this.postServerErrorMsg = res.result;  
          this.postServerError = true; 
        }              
      },
      (error => {        
        this.postServerErrorMsg = error;
        this.postServerError  = true;  
      })
    );
  }

   // thread reopen
  reopenThreadAction(){
    this.postServerErrorMsg = '';  
    this.postServerError = true;  
    this.postButtonEnable = false;
    const apiFormData = new FormData();

    apiFormData.append('apiKey', Constant.ApiKey);
    apiFormData.append('domainId', this.domainId);
    apiFormData.append('countryId', this.countryId);
    apiFormData.append('userId', this.userId);
    apiFormData.append('threadId', this.threadId);  
    apiFormData.append('notify', '0');    
    
    this.threadPostService.reopenThread(apiFormData).subscribe(res => {      
      if(res.status=='Success'){
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = res.result;
        setTimeout(() => {            
          this.getThreadInfo('refresh',0);                   
          msgModalRef.dismiss('Cross click');
          
          let secElement = document.getElementById('step');  
          setTimeout(() => {                
            secElement.scrollTop = this.innerHeight;
          }, 1000);        
          
        }, 1500);  
      }
      else{
        this.postButtonEnable = true;
        this.postServerErrorMsg = res.result;  
        this.postServerError = true;   
      }              
    },
    (error => {
      this.postButtonEnable = true;
      this.postServerErrorMsg = error;
      this.postServerError  = true;      
    })
  );    
  }

  // Get Uploaded Items
  attachments(items) {  
    console.log(items);
    this.uploadedItems = items;
  }  
  editAttachments(items) {  
    console.log(items, this.postData, this.postLists);
    let postData = items.postData;
    console.log(postData)
    let postIndex = this.postData.findIndex(option => option.postId == postData.postId);
    let currPostData = this.postData[postIndex];
    if(items.action == 'insert') {
      let minfo = items.media;
      let mindex = currPostData.attachmentItems.findIndex(option => option.fileId == minfo.fileId);
      if(mindex < 0) {
        currPostData.attachmentItems.push(minfo);
        /* postData.EditAttachmentAction = false;
        setTimeout(() => {
          postData.EditAttachmentAction = true;
        }, 1); */
        let dindex = this.deletedFileIds.findIndex(option => option == minfo.fileId);
        if(dindex >= 0) {
          this.deletedFileIds.splice(dindex, 1);
          this.deletedFileIds = this.deletedFileIds;
        }
        let rindex = this.removeFileIds.findIndex(option => option.fileId == minfo.fileId);
        if(rindex >= 0) {
          this.removeFileIds.splice(rindex, 1);
          this.removeFileIds = this.removeFileIds;
        }
      }
    } else if(items.action == 'remove') {
      let rmindex = currPostData.attachmentItems.findIndex(option => option.fileId == items.media);
      currPostData.attachmentItems.splice(rmindex, 1);
      console.log(this.postLists, currPostData)
      /* postData.EditAttachmentAction = false;
      setTimeout(() => {
        postData.EditAttachmentAction = true;
      }, 1); */
      this.deletedFileIds.push(items.media);
    } else {
      this.uploadedItems = items;
    }
  }
  // Attachment Action
  attachmentAction(data) {
    console.log(data)
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;
    let lang = data.language;
    switch (action) {
      case 'file-delete':
        this.deletedFileIds.push(fileId);
        break;
      case "file-remove":
        this.removeFileIds.push(fileId);
        break;
      case 'order':
        let attachmentList = data.attachments;
        for(let a in attachmentList) {
          let uid = parseInt(a)+1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(option => option.fileId == ufileId);
          if(uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: (flagId == 6) ? attachmentList[a].url : '',
              displayOrder: uid
            };
            this.updatedAttachments.push(fileInfo);
          } else {
            this.updatedAttachments[uindex].displayOrder = uid;    
          }
        }
        break;  
      default:
        let updatedAttachmentInfo = {
          fileId: fileId,
          caption: caption,
          url: url,
          language: lang
        };
        let index = this.updatedAttachments.findIndex(option => option.fileId == fileId);   
        if(index < 0) {
          updatedAttachmentInfo['displayOrder'] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
          this.updatedAttachments[index].language = lang;
        }
        
        console.log(this.updatedAttachments)
        break;
    }
  }

  // change desc
  changePostDesc(event,type){    
    if(type=='new'){
      this.postDesc = event.htmlValue;
      //console.log( this.postDesc);
      this.postButtonEnable = (this.postDesc != null) ? true : false;
    }
    else{
      this.postEditDesc = event.htmlValue;
      //console.log( this.postEditDesc);
      this.postSaveButtonEnable = (this.postEditDesc != null) ? true : false;
    }
  }

  // change desc
  /*changePostDesc(val,type){
    if(val!=null){
      if(type=='new'){
        let desc = val;
        if(desc!=''){
          if(desc.length>0){
            this.postButtonEnable = true;
          }
        }
        else{
          this.postButtonEnable = false;
        }
      }
      else{
        let desc = val;
        if(desc!=''){
          if(desc.length>0){
            this.postSaveButtonEnable = true;
          }
        }
        else{
          this.postSaveButtonEnable = false;
        }
      }
    }    
  }*/
  
  //reset reply box
  resetReplyBox(){  
    this.manageAction = 'new'; 
    this.pageAccess = 'post';      
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;   
    this.postButtonEnable = false;  
    this.imageFlag = 'false';  
    this.postDesc = '';    
    this.postApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,      
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
  }

  //reset reply box
  resetEditReplyBox(){  
    this.manageAction = 'new'; 
    this.pageAccess = 'post';      
    this.contentType  = 2;
    this.uploadedItems  = [];
    this.attachmentItems = [];
    this.updatedAttachments  = [];
    this.deletedFileIds  = [];
    this.removeFileIds = [];
    this.displayOrder  = 0;   
    this.postSaveButtonEnable = false;     
    this.postEditDesc = '';       
    this.postEditApiData = {
      access: 'post',
      pageAccess: 'post',
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      contentType: this.contentType,      
      displayOrder: this.displayOrder,
      uploadedItems: [],
      attachments: [],
      attachmentItems: [],
      updatedAttachments: [],
      deletedFileIds: [],
      removeFileIds: []
    };
  }
  
  // delete post
  deletePost(postId){ 
    
    this.deletePostHeight = document.getElementsByClassName('pid-'+postId)[0].clientHeight;
    console.log(this.deletePostHeight);

    this.postData.forEach((element,index)=>{
      console.log(element.postId);
      if(element.postId==postId) this.postData.splice(index,1);
    });   

    let ht = this.top.nativeElement.scrollHeight - (this.deletePostHeight + 800);
    setTimeout(() => {
      console.log(this.top.nativeElement.scrollHeight);
      console.log(ht);                
      this.top.nativeElement.scroll({
        top: ht,  
        left: 0,
        behavior: 'smooth'  
      }); 
    }, 300); 

    this.getThreadInfo('delete',0);
  }
  // Like Action
  socialAction(type, status, postId) {
    
    for (var i in this.postData) {  
      if(this.postData[i].postId == postId){    
        console.log(type,status,postId);
        let actionStatus = '';
        let actionFlag = true;   
        let likeCount = this.postData[i].likeCount;
        switch(type) {
          case 'like':
          actionFlag = (this.postData[i].likeLoading) ? false : true;
          actionStatus = (status == 0) ? 'liked' : 'disliked';
          this.postData[i].likeStatus = (status == 0) ? 1 : 0;
          this.postData[i].likeStatus = this.postData[i].likeStatus;
          this.postData[i].likeImg = (this.postData[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';         
          this.postData[i].likeCount = (status == 0) ? likeCount+1 : likeCount-1;
          this.postData[i].likeCount = this.postData[i].likeCount;
          this.postData[i].likeCountVal = this.postData[i].likeCount == 0 ? '-' : this.postData[i].likeCount;
          break; 
        }    
        if(actionFlag) {  
          const apiFormData = new FormData();    
          apiFormData.append('apiKey', Constant.ApiKey);
          apiFormData.append('domainId', this.domainId);
          apiFormData.append('countryId', this.countryId);
          apiFormData.append('userId', this.userId);
          apiFormData.append('threadId', this.threadId);
          apiFormData.append('postId', this.postData[i].postId);
          apiFormData.append('ismain','1');
          apiFormData.append('status', actionStatus);
          apiFormData.append('type', type);
                
          this.threadPostService.addLikePinOnePlus(apiFormData).subscribe((response) => {
            if(response.status != 'Success') {
              switch(type) {
                case 'like':
                this.postData[i].likeStatus = status;
                this.postData[i].likeStatus = this.postData[i].likeStatus;
                this.postData[this.imageFlag].likeImg = (this.postData[i].likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';  
                this.postData[i].likeCount = (status == 0) ? this.postData[i].likeCount-1 : this.postData[i].likeCount+1;
                this.postData[i].likeCount = this.postData[i].likeCount;
                this.postData[i].likeCountVal = this.postData[i].likeCount == 0 ? '-' : this.postData[i].likeCount;
                break;             
              }
            }
            else{
              this.getThreadInfo('refresh',0); 
              // PUSH API              
              let apiData = new FormData();    
              apiData.append('apiKey', Constant.ApiKey);
              apiData.append('domainId', this.domainId);
              apiData.append('countryId', this.countryId);
              apiData.append('userId', this.userId);              
              this.threadPostService.sendPushtoMobileAPI(apiData).subscribe((response) => { console.log(response); });
              // PUSH API
            }
          });
        }
      }
    }
  }

  // reminder Thread
  remainderThread(){   
    const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.reminderPOPUP = "Reminder";
    modalRef.componentInstance.threadId = this.threadId;
    modalRef.componentInstance.mediaServices.subscribe((receivedService) => {      
      if(receivedService){  
        modalRef.dismiss('Cross click');  
        console.log(receivedService); 
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = receivedService.result;
        
        // PUSH API
        let reminderId= receivedService.reminderId;
        let apiData = new FormData();    
        apiData.append('apiKey', Constant.ApiKey);
        apiData.append('domainId', this.domainId);
        apiData.append('countryId', this.countryId);
        apiData.append('userId', this.userId);
        apiData.append('threadId', this.threadId);
        apiData.append('reminderId', reminderId);
        this.threadPostService.sendReminderAPI(apiData).subscribe((response) => { console.log(response); });
        // PUSH API

        setTimeout(() => {         
          msgModalRef.dismiss('Cross click');            
          this.getThreadInfo('reminder',0); 
        }, 1000);    
      }
    });    
  }
 
  // tech summit Thread
  techSummitScore(){   
    const modalRef = this.modalService.open(AddLinkComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.reminderPOPUP = "TechSummitScore";
    modalRef.componentInstance.groups = this.groups;
    modalRef.componentInstance.threadId = this.threadId;
    modalRef.componentInstance.mediaServices.subscribe((receivedService) => {      
      if(receivedService){  
        modalRef.dismiss('Cross click');  
        console.log(receivedService); 
        const msgModalRef = this.modalService.open(SuccessModalComponent, this.modalConfig);
        msgModalRef.componentInstance.successMessage = "Score Updated!";  
        setTimeout(() => {           
          //this.getThreadInfo('refresh',0);             
          msgModalRef.dismiss('Cross click'); 
          if(this.teamSystem) {
            this.loading = true;
            window.open('threads', IsOpenNewTab.teamOpenNewTab);
          } else {
            window.close(); 
            window.opener.location.reload(); 
          }
        }, 1500);     
      }
    });    
  }
  
  threadDashboardOpen(){
    this.threadDashboarUserList(this.dashboard,this.dashboardTab,this.threadId,'',1);    
  }
  // liked, pinned, posted and one-puls user list
  threadDashboarUserList(dashboard,dashboardTab,threadId,postId,ismain){
    if(!this.msTeamAccessMobile){
      this.bodyElem = document.getElementsByTagName('body')[0];
      this.bodyElem.classList.add('profile');
      const modalRef = this.modalService.open(FollowersFollowingComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.type = dashboard; 
        let dashboardData = {     
          apiKey: Constant.ApiKey,
          domainId: this.domainId,
          countryId: this.countryId,
          userId: this.userId,
          threadId: threadId,  
          postId: postId,     
          ismain: ismain,     
          tap: dashboardTab
        };
      modalRef.componentInstance.dashboardData = dashboardData;   
      modalRef.componentInstance.updatefollowingResponce.subscribe((receivedService) => {
      if (receivedService) { 
        modalRef.dismiss('Cross click');        
        this.bodyElem.classList.add('profile');
      }
      });
    }
  }

  // select scroll name
  setActivePosition(id) { 
    if(id=='bottom'){     
      this.top.nativeElement.scroll({
        top: this.top.nativeElement.scrollHeight,  
        left: 0,
        behavior: 'smooth'  
      }); 
    }
    else{     
      this.top.nativeElement.scroll({
        top: 0,  
        left: 0,
        behavior: 'smooth'  
      });
    }
  }
  // Find scroll move position
  scrolled(event: any): void { 

    this.threadViewData.buttonTop = (this.buttonTop) ? true : false; 
    this.threadViewData.buttonBottom = (this.buttonBottom) ? true : false;   

    let bottom = this.isUserNearBottom();
    let top = this.isUserNearTop(); 

    if(bottom){
      console.log("bottom:"+bottom);
      this.threadViewData.buttonTop = false; 
      this.buttonTop = false;  
      this.threadViewData.buttonBottom = true; 
      this.buttonBottom = true;  
    }       
    if(top){
      console.log("top:"+top);
      this.threadViewData.buttonTop = true; 
      this.buttonTop = true;  
      this.threadViewData.buttonBottom = false; 
      this.buttonBottom = false;  
    }
  }

  private isUserNearBottom(): boolean {   
    const threshold = 100;
    const position = this.top.nativeElement.scrollTop + this.top.nativeElement.offsetHeight;
    const height = this.top.nativeElement.scrollHeight;
    return position > height - threshold;
  }

  private isUserNearTop(): boolean {     
    const threshold = 100; 
    const position = this.top.nativeElement.scrollTop;
    return position < threshold;
  }

  // tab on user profile page
  taponprofileclick(userId){
    var aurl='profile/'+userId+'';	
    if(this.teamSystem) {
      //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else {
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

  // header event tab/click
  threadHeaderAction(event){
    switch (event){
      case 'reopen':
        this.reopenThreadAction();
        break;
      case 'delete':
        this.threadDeleteConfirm();
        break;
      case 'reminder':
        this.remainderThread();
        break;
      case 'close':
        this.closeThreadConfirm();
        break;
      case 'threaddashboard':
        this.threadDashboardOpen();
        break;
      case 'print':
        this.print.nativeElement.click();
        break;
      case 'ppfr':
        this.ppfrForm();
        break;
    }
  }

  //ppfrForm
  ppfrForm(){
    if(!this.TVSIBDomain){
      localStorage.setItem('ppfrValues',  JSON.stringify(this.ppfrPopVal));  
      let url = "ppfr/manage";
      if (this.teamSystem) {
        window.open(url, IsOpenNewTab.teamOpenNewTab);
      } else {
        //window.open(url, IsOpenNewTab.openNewTab);
        window.open(url, url);
        //window.open(url, '_blank');
      }
    }
    else{
      let url = "ppfr/form";
      window.open(url, url);
    }        
  }

  /*  
  // Check valid url
  isValiwindow.open(url, url);dURL(a, url) {
    if (url!= '' && !/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
      a.url = url;
    }
    
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/; 
    if (regexp.test(url)) { 
      return true; 
    } else { 
      return false; 
    } 
  } 
  */

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.bodyElem.classList.remove(this.bodyClass1);
    let threadPostStorageText = `thread-post-${this.threadId}-attachments`;
    localStorage.removeItem(threadPostStorageText);
  }
  
}

