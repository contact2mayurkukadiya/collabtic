import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { Constant,RedirectionPage,pageTitle,IsOpenNewTab,PlatFormType } from '../../../common/constant/constant';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FollowersFollowingComponent } from '../../../components/common/followers-following/followers-following.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-thread-detail-view',
  templateUrl: './thread-detail-view.component.html',
  styleUrls: ['./thread-detail-view.component.scss']
})
export class ThreadDetailViewComponent implements OnInit {
  
  //@Input() threadViewData;
  @Output() activePosition: EventEmitter<any> = new EventEmitter();
  subscription: Subscription = new Subscription();

  public threadViewData: any = [];
  public loading:boolean = true;
  public userRole:string = '';
  public threadPosted:string = '';
  public theadTitle:string= '';
  public year:string= '';
  public trim1:string= '';
  public trim2:string= '';
  public trim3:string= '';
  public trim4:string= '';
  public trim5:string= '';
  public trim6:string= '';
  public trim:string='';
  public serialNo:string='';
  public WorkOrder:string='';
  public repairOrder:string='';
  public tvsSystem:string='';
  public threadCreatedOn;
  public problemCont:string='';
  public curentDtclength;
  public curentDtcData;
  public taglength;
  public tagData;
  public categoryData;
  public categoryLength;
  public subCategoryData;
  public subCategoryLength;
  public productTypeData;
  public productTypeLength;
  public regionsData
  public regionsLength;
  public miles;
  public odometer;
  public occrance;
  public milesOdometer;
  public threadEdited;  
  public attachmentLoading: boolean = true;
  public action = "view";
  public attachments: any;
  public opendaysCount;
  public opendaysFlag: boolean = false;
  public closeStatus;
  public userRoleTitle:string='';
  public countryId;
  public user:any;
  public domainId;
  public userId;
  public threadId;
  public postId;
  public pinCountVal;
  public likeCountVal;
  public plusOneCountVal;
  public pinCount: number = 0;
  public likeCount: number = 0;
  public plusOneCount: number = 0;
  public pinImg;  
  public likeImg;
  public plusOneImg;
  public pinLoading: boolean = false;
  public likeLoading: boolean = false;
  public plusOneLoading: boolean = false;
  public pinStatus: number = 0;  
  public likeStatus: number = 0;  
  public plusOneStatus: number = 0; 
  public threadOwner: boolean =false;
  public threadUserId;
  public bodyElem;
  public industryType: any = [];
  public automobileFlag: boolean = false;
  public automobileDefaultImg: boolean = false;
  public techSubmmitFlag: boolean = false;
  public escalateStatusLand='';
  public escColorCodes='';
  public escColorCodesValue='';
  public technicianId: string = '';
  public trimborder: boolean = false;
  public tvsDomain: boolean = false;
  public productCoordinator: any = [];
  public territoryManager: any = [];
  public technicianInfo: any = [];
  public kaizenCategory: string = '';
  public msTeamAccess: boolean = false;
  public msTeamAccessMobile: boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public CBADomain: boolean = false;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public audioThumb: string = `${this.mediaPath}/audio-medium.png`;
  public audioDesc: any = [];
  public displayDetail: boolean = false;
  constructor(private commonApi: CommonService, private threadPostService: ThreadPostService, private authenticationService:AuthenticationService,private modalService: NgbModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void { 
    
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;   
    this.countryId = localStorage.getItem('countryId');
    
    let platformId = localStorage.getItem('platformId'); 
    if((this.domainId == '52' || this.domainId == '97') && platformId == '2' ){
      this.tvsDomain = true;      
    }
    this.CBADomain = (platformId == PlatFormType.CbaForum) ? true : false;
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
      this.msTeamAccessMobile = false;
    }

    this.subscription.add(
      this.commonApi.threadListData.subscribe((r) => {        
        this.threadViewData = r; 
        this.getThreadInfo();      
      })
    );
    
    
   }

   getThreadInfo(){ 
    this.displayDetail = true;
    console.log(this.threadViewData);    
    this.industryType = this.threadViewData.industryType;
    console.log(this.industryType);
    this.threadViewData.threadTitle=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadTitle));
    this.threadViewData.content=this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.content));
    this.threadEdited = this.threadViewData.IsEdited;
    this.threadId = this.threadViewData.threadId;
    this.postId =  this.threadViewData.postId;
    this.threadViewData.userId = this.threadViewData.userId;
    this.threadViewData.availability = this.threadViewData.availability;    
    this.userRoleTitle = this.threadViewData.userRoleTitle !='' && this.threadViewData.userRoleTitle != 'undefined' && this.threadViewData.userRoleTitle != undefined ? this.threadViewData.userRoleTitle : '';    
    this.userRoleTitle = this.userRoleTitle == '' ? this.threadViewData.badgeStatus : this.threadViewData.badgeStatus+", "+this.userRoleTitle;
    this.techSubmmitFlag = (this.threadViewData.summitFix == '1') ? true : false;
    console.log(this.techSubmmitFlag); 
    this.escalateStatusLand =this.threadViewData.escalateStatusLand;
    this.escColorCodes = this.threadViewData.escColorCodes;
    this.escColorCodesValue = this.threadViewData.escColorCodesValue;
    this.threadViewData.techSubmmitFlag = this.techSubmmitFlag;
    if(this.threadViewData.audioDescription) {
      let a = 0;
      this.audioDesc = this.threadViewData.audioDescription;
    }
    if(this.threadViewData.techSubmmitFlag){
      let techinfo = this.threadViewData.technicianInfo[0];
      this.technicianId = techinfo.id;
      this.threadViewData.userName = techinfo.name;
      this.threadViewData.profileImage = techinfo.profileImg;
      let dealerInfo = this.threadViewData.dealerInfo[0];
      this.userRoleTitle = dealerInfo.dealerName != '' ? this.userRoleTitle+", "+dealerInfo.dealerName : this.userRoleTitle ;                  
    }
    else{      
      this.threadViewData.userName = this.threadViewData.userName;
      this.threadViewData.profileImage = this.threadViewData.profileImage;      
    }
    let desc = '';
    desc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.content));
    this.threadViewData.content = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(desc));

    let shareFixDesc = '';
    shareFixDesc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(this.threadViewData.threadDescFix));
    this.threadViewData.threadDescFix = this.sanitizer.bypassSecurityTrustHtml(this.authenticationService.URLReplacer(shareFixDesc));
    this.threadUserId = this.threadViewData.userId;

    if(this.userId == this.threadUserId || this.threadViewData.ownerAccess == 1){
      this.threadOwner = true;
    }

    let createdOnNew = this.threadViewData.createdOnNew;
    let createdOnDate = moment.utc(createdOnNew).toDate();
    this.threadCreatedOn = moment(createdOnDate).local().format('MMM DD, YYYY . h:mm A');
    
    this.closeStatus = this.threadViewData.closeStatus;
    if(this.closeStatus == 0){      
      var now = moment(new Date()); //todays date
      var end = moment(createdOnDate).local().format('YYYY-MM-DD'); // another date
      var duration = moment.duration(now.diff(end));
      var days = duration.asDays();
      this.opendaysCount = Math.trunc(days);
      this.opendaysFlag = this.opendaysCount==0 ? true : false;          
      this.opendaysCount = this.opendaysCount>1 ? 'open '+this.opendaysCount+' days' :  'open '+this.opendaysCount+' day';
    } 
  
    this.threadPosted = this.threadViewData.postedFrom == '' ? '' : this.threadViewData.postedFrom;
    this.theadTitle = this.threadViewData.threadTitle;
    this.year = this.threadViewData.year;
    if(this.industryType.id != 2) {
      this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1 != undefined && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1 : '';
      this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2 != undefined && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2 : '';
      this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3 : '';
      if(this.trim1 != ''){
        if(this.trim2 != ''){        
          if(this.trim3 != ''){
            this.trim = this.trim1+", "+this.trim2+", "+this.trim3;
          }
          else{
            this.trim = this.trim1+", "+this.trim2;
          }        
        }
        else{        
          if(this.trim3 != ''){
            this.trim = this.trim1+", "+this.trim3;
          }
          else{
            this.trim = this.trim1;
          }
        } 
      }
      else{
        if(this.trim2 != ''){       
          if(this.trim3 != ''){
            this.trim = this.trim2+", "+this.trim3;
          }
          else{
            this.trim = this.trim2;
          }
        }
        else{        
          if(this.trim3 != ''){
            this.trim = this.trim3;
          }
          else{
            this.trim = "";
          }
        }
      }
    }
    
    if(this.industryType.id == 2) {
      /*this.trim = '';
      this.trim1 = (this.threadViewData.trim1 != "" && this.threadViewData.trim1 != "[]" && this.threadViewData.trim1.length>0) ? this.threadViewData.trim1[0].name : '';
      this.trim2 = (this.threadViewData.trim2 != "" && this.threadViewData.trim2 != "[]" && this.threadViewData.trim2.length>0) ? this.threadViewData.trim2[0].name : '';
      this.trim3 = (this.threadViewData.trim3 != "" && this.threadViewData.trim3 != "[]" && this.threadViewData.trim3.length>0) ? this.threadViewData.trim3 : '';
      this.trim4 = (this.threadViewData.trim4 != "" && this.threadViewData.trim4 != "[]" && this.threadViewData.trim4.length>0) ? this.threadViewData.trim4[0].name : '';
      this.trim5 = (this.threadViewData.trim5 != "" && this.threadViewData.trim5 != "[]" && this.threadViewData.trim5.length>0) ? this.threadViewData.trim5[0].name : '';
      this.trim6 = (this.threadViewData.trim6 != "" && this.threadViewData.trim6 != "[]" && this.threadViewData.trim6.length>0) ? this.threadViewData.trim6[0].name : '';  
      this.trim  = (this.trim1 != '') ? this.trim1 : '';
      this.trim  = (this.trim2 != '') ? `${this.trim}, ${this.trim2}` : this.trim;
      this.trim  = (this.trim3 != '') ? `${this.trim}, ${this.trim3}` : this.trim;
      this.trim  = (this.trim4 != '') ? `${this.trim}, ${this.trim4}` : this.trim;
      this.trim  = (this.trim5 != '') ? `${this.trim}, ${this.trim5}` : this.trim;
      this.trim  = (this.trim6 != '') ? `${this.trim}, ${this.trim6}` : this.trim;
      this.trim = (this.trim.length && this.trim[0] === ',') ? this.trim.substring(1) : this.trim;
      this.trim = (this.trim.length && this.trim[0] === ' ') ? this.trim.substring(1) : this.trim;*/
      this.automobileFlag = true; 
      this.automobileDefaultImg = (this.threadViewData.isDefaultBanner == 0) ? false : true;

      /*this.threadViewData.trims = [];

      if(this.industryType.id == 2) {
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
        this.trim = (this.trim1 == '' &&  this.trim2 == '' && this.trim3 == '' && this.trim4 == '' && this.trim5 == '' && this.trim6 == '') ? '' : 'trim';
        console.log(this.trim);

        if(this.threadViewData.trims!=''){          
          if(this.threadViewData.trims.length>3){
            this.trimborder = true;
          }
        }
        console.log(this.threadViewData.trims);
        
      }*/
    }

    this.serialNo = this.threadViewData.serialNo != '' && this.threadViewData.serialNo != null ? this.threadViewData.serialNo : '';
    this.WorkOrder = this.threadViewData.WorkOrder !='' && this.threadViewData.WorkOrder != null ? this.threadViewData.WorkOrder : '';   
   console.log(this.WorkOrder +'--'+this.threadViewData.WorkOrder);
    this.odometer = this.threadViewData.odometer !='' && this.threadViewData.odometer != null ? this.threadViewData.odometer : '' ;
    this.miles = this.threadViewData.miles !='' && this.threadViewData.miles != null ? this.threadViewData.miles : '';  
   
    if(this.tvsDomain){
      this.kaizenCategory = this.threadViewData.kaizenCategory !='' && this.threadViewData.kaizenCategory != null ? this.threadViewData.kaizenCategory : '';
      // this.tvsSystem = this.threadViewData.systemSelection !='' && this.threadViewData.systemSelection != null ? this.threadViewData.systemSelection : '';
      // this.repairOrder = this.threadViewData.repairOrder !='' && this.threadViewData.repairOrder != null ? this.threadViewData.repairOrder : '';
      this.occrance = this.threadViewData.occrance !='' && this.threadViewData.occrance != null ? this.threadViewData.occrance : ''; 
      this.productCoordinator = (this.threadViewData.productCoordinator !="" && this.threadViewData.productCoordinator != undefined) ? this.threadViewData.productCoordinator[0] : '';
      this.territoryManager = (this.threadViewData.territoryManager !="" && this.threadViewData.territoryManager != undefined) ? this.threadViewData.territoryManager[0] : '';
      this.technicianInfo = (this.threadViewData.technicianInfo !="" && this.threadViewData.technicianInfo != undefined) ? this.threadViewData.technicianInfo[0] : '';
    }
    if(this.odometer != ''){
      console.log(this.odometer);
      this.odometer = this.commonApi.removeCommaNum(this.odometer);  
      if(this.tvsDomain) {             
        this.odometer = this.commonApi.numberWithCommasTwoDigit(this.odometer);
      }
      else{        
        this.odometer = this.commonApi.numberWithCommasThreeDigit(this.odometer);
      }
      this.milesOdometer = this.odometer+" "+this.miles;
    }
    
    this.curentDtclength = 0;
    if (this.threadViewData.currentDtc.length > 0) {
      this.curentDtclength = this.threadViewData.currentDtc.length;      
      this.curentDtcData = this.threadViewData.currentDtc;
    }
    this.taglength = 0;
    if (this.threadViewData.tags.length > 0) {
      this.taglength = this.threadViewData.tags.length;      
      this.tagData = this.threadViewData.tags;
    }
    
    this.categoryLength = 0;
    this.categoryData = this.threadViewData.ProdappId !='' && this.threadViewData.ProdappId != null ? this.threadViewData.ProdappId : '';
    if(this.categoryData!= '' ){ this.categoryLength = this.categoryData.length;}

    this.subCategoryLength = 0;
    this.subCategoryData = this.threadViewData.ProdcatId !='' && this.threadViewData.ProdcatId != null ? this.threadViewData.ProdcatId : '';
    this.subCategoryLength = this.subCategoryData.length;

    this.productTypeLength = 0;
    this.productTypeData = this.threadViewData.ProdtypeId !='' && this.threadViewData.ProdtypeId != null ? this.threadViewData.ProdtypeId : '';
    this.productTypeLength = this.productTypeData.length;

    this.regionsLength = 0;
    this.regionsData = this.threadViewData.regions !='' && this.threadViewData.regions != null ? this.threadViewData.regions : '';
    this.regionsLength = this.regionsData.length;

    this.threadViewData.likeCount = this.threadViewData.likeCount;
    this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount; 
    this.threadViewData.likeStatus = this.threadViewData.likeStatus;   
    this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';    
    
    this.pinCount = this.threadViewData.pinCount;
    this.pinCountVal = this.threadViewData.pinCount == 0 ? '-' : this.threadViewData.pinCount; 
    this.pinStatus = this.threadViewData.pinStatus;   
    this.pinImg = (this.threadViewData.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';         
    
    this.plusOneCount = this.threadViewData.plusOneCount;
    this.plusOneCountVal = (this.threadViewData.plusOneCount == 0) ? '-' : this.threadViewData.plusOneCount;
    this.plusOneStatus = this.threadViewData.plusOneStatus;   
    this.plusOneImg = (this.threadViewData.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';    

    this.attachments = this.threadViewData.uploadContents;   
    this.attachmentLoading = (this.threadViewData.uploadContents.length>0) ? false : true;

    

    this.threadViewData.causeOfProblem = (this.threadViewData.causeOfProblem != undefined && this.threadViewData.causeOfProblem !=  '') ? this.threadViewData.causeOfProblem : '' ;
    
    if(this.threadViewData.editHistory){                        
      let editdata = this.threadViewData.editHistory;            
      for (var ed in editdata) { 
        let editdate1 = editdata[ed].updatedOnNew;
        let editdate2 = moment.utc(editdate1).toDate();
        editdata[ed].updatedOnNew = moment(editdate2).local().format('MMM DD, YYYY . h:mm A');                  
      }  
    }

  
   }

   gotoPosition(val){    
    this.activePosition.emit(val);
   }


   // Like, Pin and OnePlus Action
  socialAction(type, status) {
    console.log(type,status);
    let actionStatus = '';
    let actionFlag = true;    
    let pinCount = this.pinCount;
    let likeCount = this.threadViewData.likeCount;
    let plusOneCount = this.plusOneCount;
    let url = RedirectionPage.Threads;
    let getNavDet = this.checkNavEdit(url);
    let pageDataInfo = getNavDet.dataInfo;
    setTimeout(() => {
      localStorage.setItem(getNavDet.navEditText, 'true')
    }, 150);
    switch(type) {
      case 'like':
      actionFlag = (this.threadViewData.likeLoading) ? false : true;
      actionStatus = (status == 0) ? 'liked' : 'disliked';
      this.threadViewData.likeStatus = (status == 0) ? 1 : 0;
      this.threadViewData.likeStatus = this.threadViewData.likeStatus;
      this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';         
      this.threadViewData.likeCount = (status == 0) ? likeCount+1 : likeCount-1;
      this.threadViewData.likeCount = this.threadViewData.likeCount;
      this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
      break;
      
      case 'pin':
      actionFlag = (this.pinLoading) ? false : true;
      actionStatus = (status == 0) ? 'pined' : 'dispined';
      this.pinStatus = (status == 0) ? 1 : 0;
      this.pinStatus = this.pinStatus;
      this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';         
      this.pinCount = (status == 0) ? pinCount+1 : pinCount-1;
      this.pinCount = this.pinCount;
      this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
      this.threadViewData.pinCount = this.pinCountVal;
      break;

      case 'plusone':
      actionFlag = (this.plusOneLoading) ? false : true;
      actionStatus = (status == 0) ? 'Yes' : 'No';
      this.plusOneStatus = (status == 0) ? 1 : 0;
      this.plusOneStatus = this.plusOneStatus;
      this.plusOneImg = (this.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';         
      this.plusOneCount = (status == 0) ? plusOneCount+1 : plusOneCount-1;
      this.plusOneCount = this.plusOneCount;
      this.plusOneCountVal = this.plusOneCount == 0 ? '-' : this.plusOneCount;
      this.threadViewData.plusOneCount = this.plusOneCountVal;
      break;
    }
    localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));    
    if(actionFlag) {
      const apiFormData = new FormData();    
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('threadId', this.threadId);
      apiFormData.append('postId', this.postId);
      apiFormData.append('ismain','1');
      apiFormData.append('status', actionStatus);
      apiFormData.append('type', type);
            
      this.threadPostService.addLikePinOnePlus(apiFormData).subscribe((response) => {
        if(response.status != 'Success') {
          switch(type) {
            case 'like':
            this.threadViewData.threadViewData.likeStatus = status;
            this.threadViewData.likeStatus = this.threadViewData.likeStatus;
            this.threadViewData.likeImg = (this.threadViewData.likeStatus == 1) ? 'assets/images/thread-detail/thread-like-active.png' : 'assets/images/thread-detail/thread-like-normal.png';  
            this.threadViewData.likeCount = (status == 0) ? likeCount-1 : likeCount+1;
            this.threadViewData.likeCount = this.threadViewData.likeCount;
            this.threadViewData.likeCountVal = this.threadViewData.likeCount == 0 ? '-' : this.threadViewData.likeCount;
            break;

            case 'pin':
            this.pinStatus = status;
            this.pinStatus = this.pinStatus;
            this.pinImg = (this.pinStatus == 1) ? 'assets/images/thread-detail/thread-pin-active.png' : 'assets/images/thread-detail/thread-pin-normal.png';  
            this.pinCount = (status == 0) ? pinCount-1 : pinCount+1;
            this.pinCount = this.pinCount;
            this.pinCountVal = this.pinCount == 0 ? '-' : this.pinCount;
            this.threadViewData.pinCount = this.pinCountVal;
            break;

            case 'plusone':
            this.plusOneStatus = status;
            this.plusOneStatus = this.plusOneStatus;
            this.plusOneImg = (this.plusOneStatus == 1) ? 'assets/images/thread-detail/thread-plus-one-active.png' : 'assets/images/thread-detail/thread-plus-one-normal.png';  
            this.plusOneCount = (status == 0) ? plusOneCount-1 : plusOneCount+1;
            this.plusOneCount = this.plusOneCount;
            this.plusOneCountVal = this.plusOneCount == 0 ? '-' : this.plusOneCount;
            this.threadViewData.plusOneCount = this.plusOneCountVal;
            break;
          }
          setTimeout(() => {
            localStorage.setItem(pageDataInfo, JSON.stringify(this.threadViewData));
          }, 50);
        }
        else{
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

  

   
     
  // thread like, pinned, posted user list
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

  URLReplacer(str){
    let match = str.match(/(?:href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final=str;
    if(match)
    {
      match.map(url=>{
        console.log(url)
        final=final.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
      })
    }
    
    return final;
  }

  URLReplacer2(str){
    let match = str.match(/(?:href=")(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final=str;
    if(match)
    {
    match.map(url=>{
      console.log(url)
      final=final.replace(url,"<a href=\""+url+"\" target=\"_BLANK\">"+url+"</a>")
    })
  }
    return final;
  }

  checkNavEdit(url) {
    //let wsNav:any = localStorage.getItem('wsNav');
    //let wsNavUrl = localStorage.getItem('wsNavUrl');
    //let url = (wsNav) ? wsNavUrl : this.navUrl;
    let routeLoadIndex = pageTitle.findIndex(option => option.slug == url);
    let pageDataIndex = pageTitle.findIndex(option => option.slug == url);
    let navText = pageTitle[pageDataIndex].navEdit;
    let navFromEdit:any = localStorage.getItem(navText);
    let pageDataInfo = pageTitle[pageDataIndex].dataInfo;
    setTimeout(() => {
      localStorage.removeItem(navText);
    }, 100);
    let data = {
      navEditText: navText,
      url: url,
      navFromEdit: navFromEdit,
      routeLoadIndex: routeLoadIndex,
      dataInfo: pageDataInfo
    };
    return data;
  }
 
  // tab on user profile page
  taponprofileclick(userId){
    let teamSystem=localStorage.getItem('teamSystem');  
    var aurl='profile/'+userId+'';
    let viewUrl = `threads/view/${this.threadId}`;
    localStorage.setItem('profileNavFrom', viewUrl);
    localStorage.setItem('technicianId', this.technicianId);
    if(teamSystem){
      //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else{
      window.open(aurl, IsOpenNewTab.openNewTab);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}