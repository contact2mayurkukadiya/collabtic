import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {LandingpageService}  from '../../../services/landingpage/landingpage.service';
import { trigger, transition, style, animate,sequence } from '@angular/animations';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { pageInfo, windowHeight, threadBulbStatusText, Constant, ContentTypeValues, DefaultNewImages, DefaultNewCreationText, forumPageAccess, MediaTypeInfo, DocfileExtensionTypes, IsOpenNewTab } from 'src/app/common/constant/constant';

import * as moment from 'moment';
declare var $:any;
@Component({
  selector: 'app-recent-viewed-widgets',
  templateUrl: './recent-viewed-widgets.component.html',
  styleUrls: ['./recent-viewed-widgets.component.scss'],
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
export class RecentViewedWidgetsComponent implements OnInit {

  public expandplus;
  public teamSystem=localStorage.getItem('teamSystem');
public expandminus;
public optionsval;
public expandminus1;
public countryId;
public domainId;
public user: any;
public userId;
public apiData: Object;
public roleId;
public noescText:string=''
public landingrecentViews=[];
public loadingesc:boolean=true;
public norecentViews:boolean=false;
public norecentviewsText='';

public recentviewedseemore:boolean=false;
  constructor(
    private LandingpagewidgetsAPI: LandingpageService,
    public sharedSvc: CommonService,
    private authenticationService: AuthenticationService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sharedSvc._OnMessageReceivedSubject.subscribe((r) => {
      var setdata= JSON.parse(JSON.stringify(r));
    
      var checkpushtype=setdata.pushType;
      //alert(checkpushtype);
      if(checkpushtype==3)
      {
        if(this.landingrecentViews.length>8)
        {
          this.landingrecentViews.splice(-1, 1);
        }
     // this.landingrecentViews=[];
     
     // this.recentviewedseemore=true;
      this.getrecentViews(1);
      }
     
    });
    var landingpage_attr3=localStorage.getItem('landingpage_attr3');
    this.optionsval=JSON.parse(landingpage_attr3);
    
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
      'limit': 9,
      'offset': 0
      
    }
    this.apiData = apiInfo;
    //this.optionsval=this.parentData;

this.getrecentViews('');
  }
  getrecentViews(limitvalue)
  {
    if(limitvalue)
    {
      this.apiData['limit']=1;
      
    }
    else
    {
      this.recentviewedseemore=true;
    }
    
    const apiFormData = new FormData();
  apiFormData.append('apiKey', this.apiData['apiKey']);
  apiFormData.append('domainId', this.apiData['domainId']);
  apiFormData.append('countryId', this.apiData['countryId']);
  apiFormData.append('userId', this.apiData['userId']);
  apiFormData.append('limit', this.apiData['limit']);
  apiFormData.append('offset', this.apiData['offset']);
  
  
   
  this.LandingpagewidgetsAPI.GetRecentViews(apiFormData).subscribe((response) => {
   let recentviewStatus= response.status;
   let recentviewtotal= response.total;
   if(recentviewtotal>0)
   {
this.norecentViews=false;
   }
   else
   {
this.norecentViews=true;
this.norecentviewsText=response.result;
   }
   
   let recentViewsArr= response.recentViews;
   if(recentviewtotal)
   {
    this.recentviewedseemore=false;
    for(var rcv in recentViewsArr)
        {
         let recentValuearr= recentViewsArr[rcv];
         let rtypeId=recentValuearr.typeId;
         let rthreadId=recentValuearr.threadId;
        
         let rmake=recentValuearr.make;
         let rmodel=recentValuearr.model;
         //let rtitle=recentValuearr.title;
         let rtitle= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(recentValuearr.title));
         let rpartNo=recentValuearr.partNo;
         let rpartName=recentValuearr.partName;
         let rbannerImg=recentValuearr.bannerImg;
         let risDefault=recentValuearr.isDefault;
         let rcreatedOn=recentValuearr.createdOn;
         let rcontentType=recentValuearr.contentType;
         let rTextBgColor=recentValuearr.TextBgColor;
         let createdOnDate = moment.utc(rcreatedOn).toDate(); 
          let localcreatedOnDate = moment(createdOnDate).local().format('MMM DD, YYYY h:mm A');
          if(limitvalue)
          {
            this.landingrecentViews.unshift({
              typeId:rtypeId,
              threadId:rthreadId,
              make:rmake,
              model:rmodel,
              title:rtitle,
              partNo:rpartNo,
              partName:rpartName,
              bannerImg:rbannerImg,
              isDefault:risDefault,
              createdOn:localcreatedOnDate,
              contentType:rcontentType,
              textBgColor:rTextBgColor,
              state: 'active'
             
             
            
            })
          }
          else
          {
            this.landingrecentViews.push({
              typeId:rtypeId,
              threadId:rthreadId,
              make:rmake,
              model:rmodel,
              title:rtitle,
              partNo:rpartNo,
              partName:rpartName,
              bannerImg:rbannerImg,
              isDefault:risDefault,
              createdOn:localcreatedOnDate,
              contentType:rcontentType,
              textBgColor:rTextBgColor,
              state: 'active'
             
             
            
            })
          }
          
          
        }
       
    // alert(recentviewtotal);
   }
   else

   {
    this.recentviewedseemore=false;
   }
    //console.log();
  });
}
recentViewClick(event,typeId: any,Id)
  {
    console.log(typeId)
    let flag: any = true;
    let secElement = document.getElementById('homeSec');
    setTimeout(() => {
      let scrollTop = secElement.offsetTop;
      scrollTop = 530;
      this.sharedSvc.setlocalStorageItem('homeScroll', scrollTop);
    }, 50);
    this.sharedSvc.setlocalStorageItem('landingRecentNav', flag);
    //localStorage.setItem('landingRecentNav', flag);
    let url: any = '';
    typeId = parseInt(typeId);
    switch(typeId) {
      case 2:
        url = (this.domainId) ? `${forumPageAccess.threadpageNew}${Id}` : `/thread?thread_id=${Id}`;
        break;
      case 4:
        url = `${forumPageAccess.documentViewPage}${Id}`;
        break;
      case 6:
      case 11:
        url = `${forumPageAccess.partsViewPage}${Id}`;
        break;
      case 7:
        url = `${forumPageAccess.knowledgeArticlePageNew}${Id}`;
        break;
      case 8:
        url = `${forumPageAccess.gtsViewPage}${Id}`;
        break;
      case 28:
        url = `${forumPageAccess.kbViewPage}${Id}`;
        break;
      case 30:
        url = `${forumPageAccess.sibViewPage}${Id}`;
        break;
    }
    setTimeout(() => {
      this.router.navigate([url]); 
    }, 50);
  }
  onTabClose3(event) {
    //alert(1);
        this.expandplus=event.index;
        $('.minusone3'+this.expandplus+'').removeClass('hide');
        $('.minusone3'+this.expandplus+'').addClass('showinline');
        $('.plusone3'+this.expandplus+'').addClass('hide');
        $('.plusone3'+this.expandplus+'').removeClass('showinline');
    
        
        //this.expandminusFlag=false;
        //this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
    }
    
    onTabOpen3(event) {
      //alert(2);
     
      this.expandminus=event.index;
      $('.minusone3'+this.expandminus+'').addClass('hide');
      $('.minusone3'+this.expandminus+'').removeClass('showinline');
      $('.plusone3'+this.expandminus+'').removeClass('hide');
      $('.plusone3'+this.expandminus+'').addClass('showinline');
      this.expandplus=2222;
     
      
       // this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
    }

}
