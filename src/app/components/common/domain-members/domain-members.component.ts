import { Component, OnInit, HostListener } from '@angular/core';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CommonService } from '../../../services/common/common.service';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant, IsOpenNewTab, windowHeight } from '../../../common/constant/constant';
declare var $: any;
@Component({
  selector: 'app-domain-members',
  templateUrl: './domain-members.component.html',
  styleUrls: ['./domain-members.component.scss']
})
export class DomainMembersComponent implements OnInit {
  public sconfig: PerfectScrollbarConfigInterface = {};
  public sidebarHeight;
  public clockTImer = '';
  public expandFlag: boolean = true;
  public countryId;
  public domainId;
  public userId;
  public loadingdm: boolean = true;
  public roleId;
  public landingdomainUsers = [];
  public apiData: Object;
  public escTotal;
  public noescText: string = '';
  public loadingnousers: boolean = false;
  public clearInputIcon: boolean = false;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  public lastScrollTop: number = 0;
  public scrollInit: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;
  public user: any;
  public rmdHeight: any;
  public rmsHeight: any;

  constructor(
    private router: Router,
    private LandingpagewidgetsAPI: LandingpageService,
    private scrollTopService: ScrollTopService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {

    let teamSystem = localStorage.getItem('teamSystem');
    if (teamSystem) {
      this.sidebarHeight = windowHeight.heightMsTeam - 40;
    }
    else {
      this.sidebarHeight = windowHeight.height - 150;
    }
    let url = this.router.url.split('/');
    let currUrl = url[1];
    console.log(currUrl)
    switch (currUrl) {
      case 'landing-page':
      case 'chat-page':
      case 'threads':
      case 'search-page':
        this.rmdHeight = 95;
        this.rmsHeight = 230;
        break;
      case 'documents':
        this.rmdHeight = 125;
        this.rmsHeight = 270;
        break;  
      default:
        this.rmdHeight = 135;
        this.rmsHeight = 280;
        break;
    }
    console.log(localStorage.getItem('wsDocInfoCollapse'))
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    let collapseFlag: any = localStorage.getItem('wsDocInfoCollapse');
    let domainCollapse: any = localStorage.getItem('domainCollapse');
    collapseFlag = (domainCollapse == null) ? collapseFlag : domainCollapse;
    if(currUrl == 'documents' && url.length > 2) {
      collapseFlag = false;
    }
    setTimeout(() => {
      localStorage.removeItem('domainCollapse');
    }, 100);
    console.log(this.expandFlag, collapseFlag, domainCollapse)
    if (collapseFlag) {
      this.expandFlag = collapseFlag;
      let action = (!this.expandFlag) ? '' : 'trigger';
      console.log(action + '::' + this.expandFlag)
      this.expandAction(action);
      setTimeout(() => {
        localStorage.removeItem('wsDocInfoCollapse')
      }, 100);
    }

    this.scrollTopService.setScrollTop();
    this.getandshowtime();
    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'escalationType': 1,
      'limit': this.itemLimit,
      'offset': this.itemOffset

    }
    this.apiData = apiInfo;


    setInterval(() => {
      this.getandshowtime();
    }, 1000);
    this.getdomainMembers();
  }
  expandAction(action = '') {
    //alert(this.expandFlag);

    this.expandFlag = (this.expandFlag) ? false : true;
    if (this.expandFlag) {
      $('.center-middle-width-container').addClass('ease-out-animate');
      $('.domain-widget').show();
      //$('.center-middle-width').css("width", "60%");
      //$('.center-middle-width').animate({width: '60%'});

      if ($(".center-middle-width-container").hasClass("adding-width-12")) {
        $('.center-middle-width-container').addClass('col-lg-10  col-lg-10 col-lg-10 col-lg-10 adding-width-10');
        $('.center-middle-width-container').removeClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
        //$('.center-middle-width-container').removeClass('col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10');
        //$('.center-middle-width-container').addClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
      }
      else {
        $('.center-middle-width-container').addClass('col-lg-8  col-md-8 col-xl-8 col-sm-8');
        $('.center-middle-width-container').removeClass('col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10');
      }

      $('.right-middle-width-container').removeClass('addon-contain');
      $('.domain-toggle').addClass('active');
      setTimeout(() => {                           //<<<---using ()=> syntax
        $('.center-middle-width-container').removeClass('ease-out-animate');
      }, 5000);
    }
    else {
      $('.center-middle-width-container').addClass('ease-out-animate');
      $('.domain-widget').hide();
      //ar ss= $('.center-middle-width-container').css('max-width');
      $('.right-middle-width-container').addClass('addon-contain');

      if ($(".center-middle-width-container").hasClass("adding-width-10")) {
        if (action == '') {
          $('.center-middle-width-container').removeClass('col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10');
          $('.center-middle-width-container').addClass('col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12');
        }
      }
      else {
        $('.center-middle-width-container').removeClass('col-lg-8  col-md-8 col-xl-8 col-sm-8');
        $('.center-middle-width-container').addClass('col-lg-10 col-md-10 col-xl-10 col-sm-10 adding-width-10');
      }

      // alert(ss+ss1);
      //$('.center-middle-width-container').css('flex',"0 0 75%");
      //$('.center-middle-width-container').css('maxWidth',"75%");

      //$('.center-middle-width-container').css('max-width',"75%");

      //$('.center-middle-width-container').animate({'max-width': "0 0 75%"});
      //$('.center-middle-width-container').animate({'flex': "0 0 75%"});

      //$('.center-middle-width').css("width", "76%");
      //  $('.center-middle-width').animate({width: '75.5%'});
      $('.domain-toggle').removeClass('active');
      setTimeout(() => {                           //<<<---using ()=> syntax
        $('.center-middle-width-container').removeClass('ease-out-animate');
      }, 5000);
    }
    this.commonService.emitMessageLayoutChange(this.expandFlag);
    // this.toggle.emit(this.expandFlag);
  }
  getandshowtime() {
    this.clockTImer = moment().local().format('MMM DD, YYYY . h:mm A');
  }
  @HostListener('scroll', ['$event'])
  onScroll(event) {
    console.log('scrolling');
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - 10;
    this.scrollTop = event.target.scrollTop - 80;

    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.scrollCallback = false;
        console.log('bottom reached');
        this.getdomainMembers();
        this.loadingdm = true;

      }
    }

  }
  searchDomainUserText(event) {
    this.landingdomainUsers = [];
    this.loadingdm = true;
    var searchval = event.target.value;
    if (searchval) {

      this.itemOffset = 0;
      this.clearInputIcon = true;
      this.getdomainMembers(searchval);
    }
    else {
      this.clearInputIcon = false;
      this.getdomainMembers(searchval);
    }
    //alert(event.target.value);

  }
  taponprofileclick(userDetails) {
    let teamSystem = localStorage.getItem('teamSystem');
    var userId = userDetails.userId;
    console.log(userDetails);

    var aurl = 'profile/' + userId + '';
    if (teamSystem) {
      window.open(aurl, IsOpenNewTab.teamOpenNewTab);
    }
    else {
      window.open(aurl, IsOpenNewTab.openNewTab);
    }


  }
  clearText(event) {
    this.landingdomainUsers = [];
    $('.domain-text-box').val('');
    this.itemOffset = 0;
    this.clearInputIcon = false;
    this.getdomainMembers();
  }
  getdomainMembers(searchText = '') {
    this.apiData['offset'] = this.itemOffset;
    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('searchText', searchText);


    this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe((response) => {

      let rstatus = response.status;
      let rresult = response.result;
      let rsdata = response.dataInfo;
      let rstotal = response.total;
      this.itemTotal = rstotal;
      //alert(rstotal);
      if (searchText) {
        this.landingdomainUsers = [];
      }
      if (rsdata.length == 0) {
        this.loadingdm = false;
        this.noescText = rresult;
        this.loadingnousers = true;
      }
      else {
        this.loadingnousers = false;

        this.escTotal = rstotal;
        let rsthreaddata = rsdata;
        //alert(rsthreaddata);
        if (rstatus == 'Success') {
          if (rsthreaddata.length > 0) {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemLength += rsthreaddata.length;
            this.itemOffset += this.itemLimit;

            for (var du in rsthreaddata) {

              let duserId = rsthreaddata[du].userId;
              let duserName = rsthreaddata[du].userName;
              let davailability = rsthreaddata[du].availability;
              let dprofileImg = rsthreaddata[du].profileImg;
              let dtitle = rsthreaddata[du].title;
              let badgeTopUser = 0;
              if (rsthreaddata[du].badgeTopUser) {
                badgeTopUser = rsthreaddata[du].badgeTopUser;
              }





              this.landingdomainUsers.push({
                userId: duserId,
                userName: duserName,
                availability: davailability,
                profileImg: dprofileImg,
                title: dtitle,
                badgeTopUser: badgeTopUser,
              })
            }
            //alert(rsthreaddata.length);
            this.loadingdm = false;
          }
          else {
            this.loadingdm = false;
          }


        }
        else {
          this.loadingdm = false;
        }
      }

    });
  }


}
