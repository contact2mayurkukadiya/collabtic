import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { trigger, transition, style, animate,sequence } from '@angular/animations';
import * as moment from 'moment';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { pageInfo, Constant,PlatFormType,forumPageAccess } from 'src/app/common/constant/constant';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AccordionOptions } from 'src/app/models/customAccordion.model';

declare var $:any;
@Component({
  selector: '.announcement-widgets',
  templateUrl: './announcement-widgets.component.html',
  styleUrls: ['./announcement-widgets.component.scss'],
  /*
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s rollIn', style({ opacity: '1' })),
      ]),
    ]),
  ],
  */
 animations: [
  trigger('anim', [
     transition('* => void', [
       style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'}),
       sequence([
         animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
         animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none'  }))
       ])
     ]),
     transition('void => active', [
       style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
       sequence([
         animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none'  })),
         animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)'  }))
       ])
     ])
 ])
]
  
})

export class AnnouncementWidgetsComponent implements OnInit {
  @Input() parentData;
  @ViewChild('ttannouncement') tooltip: NgbTooltip;
  public _receivedMessages: string[] = [];
  public expandplus;
  public expandminus;
  public optionsval;
  public expandminus1;
  public domainId;
  public countryId;
  public viapushcall=false;
  public noannouncement:boolean=false;
  public userId;
  public loadingann:boolean=true;
  public annseemore:boolean=false;
  public anndismissed:boolean=false;
  public roleId;
  public noannounceText='';
  public landingannouncements=[];
  public apiData: Object;
  public user: any;
  public accordionConfig: AccordionOptions = null;

  public ahelpContentId = '';
  public ahelpContentTitle = '';
  public ahelpContentContent = '';
  public ahelpContentIconName = '';
  public ahelpContentStatus= '';
  public ahelpContentFlagStatus:boolean = false;
  public teamSystem = localStorage.getItem("teamSystem");
  public msTeamAccess: boolean = false;
  public tooltipFlag: boolean = false;

  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.teamSystem) {
      this.msTeamAccess = true;
    } else {
      this.msTeamAccess = false;
    }
    this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {

      var setdata= JSON.parse(JSON.stringify(r));
    
      var checkpushtype=setdata.pushType;
      var checkmessageType=setdata.messageType;
      console.log('message received! ####', r);
//alert(checkpushtype+'--'+checkmessageType);
      if(checkpushtype==1 && checkmessageType==3)
      {
     
     // this.landingrecentViews=[];
     this.landingannouncements.splice(-1, 1);
     // this.recentviewedseemore=true;
     this.getAnnouncementwidgets(1);
      }
      //alert(checkpushtype);
      if(checkpushtype==25 && this.viapushcall==false)
      {
        this.viapushcall=true;
        setTimeout(() => {
          this.viapushcall=false;
        },5000)
       this.landingannouncements=[];
       this.loadingann=true;

        this.getAnnouncementwidgets('');
      }
     //let jsonParseData= JSON.parse(r);
    //console.log(jsonParseData.data);
     // this._receivedMessages.push(r);
    //  this.landingannouncements=[];
     // this.loadingann=true;
     // this.getAnnouncementwidgets();
    });

    this.sharedSvc.helpContentReceivedSubject.subscribe((response) => {      
      let helpContentName = response['helpContentName'];
      if(helpContentName == 'announcements'){        
        this.tooltip.open();
      }
    }); 

    var landingpage_attr1=localStorage.getItem('landingpage_attr1');
    this.optionsval=JSON.parse(landingpage_attr1);
    console.log(this.optionsval);
    this.accordionConfig = {
      wrapperClass: this.optionsval.shortName,
      title: this.optionsval.placeholder,
      imageClass: this.optionsval.imageClass,
      isFirstSelected: this.optionsval.isExpand
    }
    //this.optionsval=this.parentData;

    let toolTips = this.optionsval.toolTips;
    console.log(toolTips);           
    this.tooltipFlag = (toolTips == undefined || toolTips == 'undefined' || toolTips == 'null' || toolTips == null) ? false : true;
    console.log(this.tooltipFlag);
    this.ahelpContentId = '';
    this.ahelpContentTitle = '';
    this.ahelpContentContent = '';
    this.ahelpContentIconName = '';
    this.ahelpContentStatus = ''; 
    if(this.tooltipFlag && !this.msTeamAccess){  
      if(toolTips.length>0){
        let helpContent = toolTips[0];
        this.ahelpContentStatus = helpContent['viewStatus']; 
        this.ahelpContentFlagStatus = (this.ahelpContentStatus == '0') ? true : false;
        if(this.ahelpContentStatus == '0'){
          this.ahelpContentId = helpContent['id'];
          this.ahelpContentTitle = helpContent['title'];
          this.ahelpContentContent = helpContent['content'];
          this.ahelpContentIconName = helpContent['itemClass'];        
        }
      }
    }
    setTimeout(() => {
      if(this.tooltipFlag && !this.msTeamAccess){  
        if(this.ahelpContentStatus == '0'){         
          let tname = localStorage.getItem('helpContentName');    
          if(tname == 'announcements'){                    
            this.tooltip.open();
          } 
        }
        if(this.ahelpContentStatus == '1'){          
          localStorage.setItem('helpContentName','escalation');    
        }   
      }
    }, 3200); 

    
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'pageName': 'announcement',
      'limit': 5,
      'offset': 0      
    }
    this.apiData = apiInfo;

    this.getAnnouncementwidgets('');
  }


    // check next
    nextTooltip(id){
      this.updateHelpContentOrder(id);
      this.tooltip.close();
      this.ahelpContentFlagStatus = false;
      this.ahelpContentStatus = '1';
      localStorage.setItem('helpContentName','escalation');
      let data = {
        helpContentName: 'escalation'                                                   
      }   
      this.sharedSvc.emitHelpContentView(data);            
    }
  
    // helpContentOrder
    updateHelpContentOrder(id){
    
      const apiFormData = new FormData();
    
      apiFormData.append('apiKey', Constant.ApiKey);
      apiFormData.append('domainId', this.domainId);
      apiFormData.append('countryId', this.countryId);
      apiFormData.append('userId', this.userId);
      apiFormData.append('tooltipId', id);
  
      this.LandingpagewidgetsAPI.updateTooltipconfigWeb(apiFormData).subscribe((response) => {
          if (response.status == "Success") {
            console.log(response.result);
          }
      });
    } 

    
  getAnnouncementwidgets(limitvalue)
  {
    if(limitvalue)
    {
      this.apiData['limit']=1;
    }
    const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit', this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);
  apiFormData.append('pageName', this.apiData['pageName']);
  
   
  this.LandingpagewidgetsAPI.ManualsAndAnnouncementList(apiFormData).subscribe((response) => {

    let rstatus=response.status;
    let rsdata=response.data;
    let rresult=response.result;
    this.noannounceText=rresult;
    let rstotal=rsdata.total;
    if(rstotal>5)
    {
      this.annseemore=true;
    }
    if(rstotal>0){
      this.anndismissed = true;
    }
    let rsthreaddata=rsdata.thread;
    //alert(rsthreaddata);
    if(rstatus=='Success')
    {
      if(rsthreaddata.length>0)
      {
        this.noannouncement=false;
        for(var ann in rsthreaddata)
        {

          let uId=rsthreaddata[ann].resourceID;
          let urgencyLevel=rsthreaddata[ann].urgencyLevel;
          let announce_title=rsthreaddata[ann].title;
          let announce_description=rsthreaddata[ann].description;
          let announce_contributerId=rsthreaddata[ann].contributerId;
          let announce_contributerName=rsthreaddata[ann].contributerName;
          let announce_availability=rsthreaddata[ann].availability;
          let announce_profileImage=rsthreaddata[ann].profileImage;
          let announce_likeCount='-';
          if(rsthreaddata[ann].likeCount)
          {
            announce_likeCount=rsthreaddata[ann].likeCount;
          }
          else
          {
             announce_likeCount='-';
          }
          let announce_pinCount='-';
          if(rsthreaddata[ann].pinCount)
          {
            announce_pinCount=rsthreaddata[ann].pinCount;
          }
          else
          {
            announce_pinCount='-';
          }

          let announce_viewCount='-';
          if(rsthreaddata[ann].viewCount)
          {
            announce_viewCount=rsthreaddata[ann].viewCount;
          }
          else
          {
            announce_viewCount='-';
          }
          
         
          let announce_likeStatus=rsthreaddata[ann].likeStatus;
          let announce_pinStatus=rsthreaddata[ann].pinStatus;
          let announce_createdOnMobile=rsthreaddata[ann].createdOnMobile;
          let announce_updatedOnMobile=rsthreaddata[ann].updatedOnMobile;
          let announce_WorkstreamsList=rsthreaddata[ann].WorkstreamsList;
          let announce_readStatus=rsthreaddata[ann].readStatus;
          let createdOnDate = moment.utc(announce_createdOnMobile).toDate(); 
          let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');

          let updatedOnDate = moment.utc(announce_updatedOnMobile).toDate(); 
          let localupdatedOnDate = moment(updatedOnDate).local().format('MMM DD, YYYY h:mm A');
          let urgencyLevelText = (urgencyLevel == 2) ? 'URGENT' : '';
          
          if(limitvalue) {
            this.landingannouncements.unshift({
              uId:uId,
              urgencyLevelText:urgencyLevelText,
              title:announce_title,
              description:announce_description,
              contributerId:announce_contributerId,
              contributerName:announce_contributerName,
              availability:announce_availability,
              profileImage:announce_profileImage,
              likeCount:announce_likeCount,
              pinCount:announce_pinCount,
              viewCount:announce_viewCount,
              likeStatus:announce_likeStatus,
              pinStatus:announce_pinStatus,
              createdOn:localcreatedOnDate,
              updatedOnMobile:localupdatedOnDate,
              WorkstreamsList:announce_WorkstreamsList,
              readStatus:announce_readStatus,
              state: 'active'
            })
          }
          else
          {
            this.landingannouncements.push({
              uId:uId,
              urgencyLevelText:urgencyLevelText,
              title:announce_title,
              description:announce_description,
              contributerId:announce_contributerId,
              contributerName:announce_contributerName,
              availability:announce_availability,
              profileImage:announce_profileImage,
              likeCount:announce_likeCount,
              pinCount:announce_pinCount,
              viewCount:announce_viewCount,
              likeStatus:announce_likeStatus,
              pinStatus:announce_pinStatus,
              createdOn:localcreatedOnDate,
              updatedOnMobile:localupdatedOnDate,
              WorkstreamsList:announce_WorkstreamsList,
              readStatus:announce_readStatus,
              state: 'active'
            })
          }
          
        }
        //alert(rsthreaddata.length);

      }
      else
      {
        this.noannouncement=true;
      }
      $('.announcement-listing-widget').removeClass('inner-content-accrodian');
    this.loadingann=false;

    if(!limitvalue)
    {
      setTimeout(()=>{   
        //$('.announcement-content').slideUp();
        //this.landingannouncements.splice(-1, 1);
        },3000);
      
        setTimeout(()=>{   
          //$('.announcement-content').slideUp();
        //  this.getAnnouncementwidgets(1);
          },4500);
    }
    else
    {
     
    }
    
    
    }
    else
    {
      $('.announcement-listing-widget').removeClass('inner-content-accrodian');
      this.loadingann=false;
     
    }
   
   
  });
  }
  /*announceClick(event,Id)
  {
    var aurl='/announcement-view?announcement_id='+Id+'&tac=1';
    window.open(aurl, '_blank');
   // alert(Id);

  }*/
  announceClick(event,Id)
  {
    localStorage.setItem('annType','more');
    var aurl='announcements/view/'+Id;
    window.open(aurl, aurl);
   // alert(Id);

  }
  onTabClose(event) {
    //alert(1);
        this.expandplus=event.index;
        $('.minusonea'+this.expandplus+'').removeClass('hide');
        $('.minusonea'+this.expandplus+'').addClass('showinline');
        $('.plusonea'+this.expandplus+'').addClass('hide');
        $('.plusonea'+this.expandplus+'').removeClass('showinline');
        setTimeout(()=>{                           //<<<---using ()=> syntax
         // $('.new-announcement-tag').addClass('hide');
     }, 200);
   
        
        //this.expandminusFlag=false;
        //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
    }
    taponseeMore(event){
      var aurl=forumPageAccess.announcementall; 
      window.open(aurl, '_blank');
      event.stopPropagation();
    }
    taponMore(event){
      this.landingNav();
      var aurl="announcements"; 
      window.open(aurl, aurl);
      event.stopPropagation();
    }
    taponDismissed(event){
      this.landingNav();
      var aurl="announcements/dismissed"; 
      window.open(aurl, aurl);
      event.stopPropagation();
    }
    dashboardAnnouncement(event){
      this.landingNav();
      var aurl="announcements/dashboard"; 
      window.open(aurl, aurl);
      event.stopPropagation();
    }
    
    newAnnouncement(event){
      var aurl="announcements/manage";
      localStorage.setItem('anncNav', 'landing-page'); 
      window.open(aurl, aurl);
      event.stopPropagation();
    }
    onTabOpen(event) {
      //alert(2);
     
      this.expandminus=event.index;
      $('.minusonea'+this.expandminus+'').addClass('hide');
      $('.minusonea'+this.expandminus+'').removeClass('showinline');
      $('.plusonea'+this.expandminus+'').removeClass('hide');
      $('.plusonea'+this.expandminus+'').addClass('showinline');
      this.expandplus=2222;
     
      setTimeout(()=>{                           //<<<---using ()=> syntax
       // $('.new-announcement-tag').removeClass('hide');
   }, 200);
      
       // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
    }

    landingNav() {
      let nav: any = 1;
      localStorage.setItem('landingNav', nav);
    }

}
