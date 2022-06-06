import * as OT from "@opentok/client";

import { BehaviorSubject, Subscription } from 'rxjs'
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { Constant, PlatFormType, PushTypes, RedirectionPage, filterNames, forumPageAccess, pageInfo, pageTitle, windowHeight } from 'src/app/common/constant/constant';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";

import { ActionFormComponent } from "../../components/common/action-form/action-form.component";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ApiService } from '../.../../../services/api/api.service';
import { AppUserNotificationsComponent } from "../../components/common/app-user-notifications/app-user-notifications.component";
import { AuthenticationService } from '../.../../../services/authentication/authentication.service';
import { CallsService } from "src/app/controller/calls.service";
import { ChatService } from "src/app/services/chat/chat.service";
import { CommonService } from '../.../../../services/common/common.service';
import { ContentPopupComponent } from "../../components/common/content-popup/content-popup.component";
import { LandingpageService } from "../../services/landingpage/landingpage.service";
import { ManageListComponent } from "../../components/common/manage-list/manage-list.component";
import { ManageUserComponent } from '../../components/common/manage-user/manage-user.component';
import { NgbTooltipConfig } from "@ng-bootstrap/ng-bootstrap";
import { NonUserComponent } from "../../components/common/non-user/non-user.component";
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProductMatrixService } from "../.../../../services/product-matrix/product-matrix.service";
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SuccessModalComponent } from '../../components/common/success-modal/success-modal.component';
import { VerifyEmailComponent } from "../../components/common/verify-email/verify-email.component";
import { WelcomeHomeComponent } from '../../components/common/welcome-home/welcome-home.component';
import { debounceTime } from "rxjs/operators";
import { PlatformLocation } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NavigationService } from 'src/app/services/navigation.service';
import { ImageCropperComponent } from '../../components/common/image-cropper/image-cropper.component';

declare var window: any;
declare var $: any;
@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.component.html',
  styleUrls: ['./product-header.component.scss'],

})

export class ProductHeaderComponent implements OnInit, OnDestroy {
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  videoCallData: any = null;
  @ViewChild("subscriberDiv") subscriberDiv: ElementRef;
  public _OnMessageReceivedSubject: Subject<string>;
  @Input() pageData;
  @Input() nonuserResponce;
  @Input() privacyResponce;
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() FcmData: EventEmitter<any> = new EventEmitter();
  currentMessage = new BehaviorSubject(null);
  message;
  public countryId;
  public countryName;
  public languageId;
  public languageName;
  public user: any;
  public domainId;
  public userId;
  public videoCall: boolean = false;
  public definedNotifyText = "";
  public enableDesktopPush: boolean = false;
  public isIncognitoBrowser: boolean = false;

  public dropdownAccess: boolean = true;
  public displayLogoutPopup: boolean = false;
  public displayPosition: boolean;

  public position: string;
  public apiData: Object;
  public access: string;
  public welcomeProfileFlag: boolean;
  public profileFlag: boolean;
  public productListFlag: boolean = false;
  public headTitleFlag: boolean = false;
  public headTitle: string = '';
  public superAdmin: string;
  public isVerified: string;
  public popupVerified: string;

  public searchBgFlag: boolean = false;
  public searchReadonlyFlag: boolean = true;
  public searchFlag: boolean;
  public searchPlacehoder: string = '';
  public searchVal: string = '';
  public activePageAccess = "0";
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  subscription: Subscription;

  //public userName: string = "";
  //public profileImage: string = "";
  public isModalOpen = false;
  public loadingnotifications: boolean = true;
  public notificationType = 0;
  public totalNotificationcount = 0;
  public totalunseenunreadcolor = '';

  public totalAnnounceNotificationcount = 0;
  public totalAnnouncementColor = '';

  public totalChatNotificationcount = 0;
  public totalChatColor = '';

  public totalThreadsNotificationcount = 0;
  public totalThreadsColor = '';
  public notificationClass = 'top-right-notifications-popup';
  public bodyElem;
  public platformName = 'Collabtic';
  public totalOthersNotificationcount = 0;
  public totalOthersColor = '';
  public roleId;
  public teamSystem = localStorage.getItem('teamSystem');
  public platformLogo;
  public assetPath: string = "assets/images";
  public assetPathplatform: string = "assets/images/";
  public searchImg: string = `${this.assetPath}/search-white-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close-white.png`;
  public showItemheader: boolean = true;
  public platformId;
  public platFormTypes: any = PlatFormType;
  public showLanguageFlag: boolean = false;
  public showCountryFlag: boolean = false;
  public tvslogoHeight: boolean = false;
  public disableManager: boolean = false;
  public policyFlag: boolean = false;
  public tvsIBDomain: boolean = false;
  public recentVinFlag: boolean = false;
  public industryType: any = [];
  public newBusinessAdmin: boolean = false;
  public collabticDomain: boolean = false;
  public loadLogo: boolean = false;
  public bodyClass:string = "profile";
  public bodyClass1:string = "image-cropper";
  public dialogData: any = {
    access: '',
    navUrl: '',
    platformName: this.platformName,
    teamSystem: this.teamSystem,
    visible: true
  };

  constructor(
    private location: PlatformLocation,
    private titleService: Title,
    private probingApi: ProductMatrixService,
    private landingpageAPI: LandingpageService,
    private angularFireMessaging: AngularFireMessaging,
    readonly afMessaging: AngularFireMessaging,
    //readonly snackBar: MatSnackBar,
    public sharedSvc: CommonService,
    private formBuilder: FormBuilder,
    public chatservice: ChatService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private authenticationService: AuthenticationService,
    public apiUrl: ApiService,
    private tooltipconfig: NgbTooltipConfig,
    private router: Router,
    public call: CallsService,
    public notification: NotificationService,
    private navigation: NavigationService
  ) {
    config.backdrop = true;
    config.keyboard = true;
    config.size = 'dialog-top';

    this._OnMessageReceivedSubject = new Subject<string>();
    // config.windowClass= 'top-right-notifications-popup';
    tooltipconfig.placement = 'bottom';
    tooltipconfig.triggers = 'click';
  }
  @HostListener('document:visibilitychange', ['$event'])

  visibilitychange() {
    this.checkHiddenDocument();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  receivedCall(data) {
    this.call.initSession(data.sessionId, data?.tokenValue);
  }

  rejectCall() {
    this.videoCall = false;
    this.videoCallData = null;
  }
  acceptCall() {
    console.log('Call Accepted All');
    this.receivedCall(this.videoCallData);
    this.videoCall = false;
  }


  get getTotalCount() {

    let total = 0;
    let chatCal = false;

    return this.notification.totalNotificationcount;
    /*
    if(this.pageData.access != 'chat-page') {
      total += this.notification.totalNotificationcount;
    }

    if(this.pageData.access == 'chat-page')
    {
        if(this.chatservice.totalNewWorkstreamMessage > 0) {
          total += this.chatservice.totalNewWorkstreamMessage;
          chatCal = true;
        }
        if(this.chatservice.totalNewGroupMessage > 0) {
          total += this.chatservice.totalNewGroupMessage;
          chatCal = true;
        }
        if(this.chatservice.totalNewDMMessage > 0) {
          total += this.chatservice.totalNewDMMessage;
          chatCal = true;
        }

        if(this.notification.totalAnnounceNotificationcount > 0) {
          total += this.notification.totalAnnounceNotificationcount;
        }
        if(this.notification.totalThreadsNotificationcount > 0) {
          total += this.notification.totalThreadsNotificationcount;
        }
        if(this.notification.totalOthersNotificationcount > 0) {
          total += this.notification.totalOthersNotificationcount;
        }
    }


    // if(this.notification.totalChatNotificationcount > 0 && chatCal === false) {
    //   total += this.notification.totalChatNotificationcount;
    // }


    return total;
    */
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.searchForm.controls;
  }
  isIncognito() {
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      console.log("cccc");
      return;
    }
    fs(
      window.TEMPORARY,
      100,
      function (fs) {
        // result.textContent = "it does not seem like you are in incognito mode";
        console.log("it does not seem like you are in incognito mode");
        localStorage.removeItem("incognitoMode");
      },
      function (err) {
        // result.textContent = "it seems like you are in incognito mode";
        console.log("it seems like you are in incognito mode");
        localStorage.setItem("incognitoMode", "1");
      }
    );
  }
  ngOnInit() {
    console.log('notification', this.notification.totalunseenunreadcolor)
    this.isIncognito();

    // Notification channel for listen notification clear events
    this.notification.notificationChannel = new BroadcastChannel('notification-channel');

    this.notification.notificationChannel.onmessage = (event) => {
      console.log('notification clear event fire...')
      if (event.data.clearAll === true) {
        this.notification.deleteAlluserNotifications(event.data.apiData, '')
      } else if (event.data.clearIndividual === true) {
        this.notification.getUserAppNotifications(event.data.apiData['type'], event.data.apiData['action']);
      }
    }

    this.subscription = this.notification.visibility.pipe(debounceTime(500)).subscribe(res => {
      if (res) {
        console.log('notification reload')
        this.notification.getUserAppNotifications()
      }
    })

    let incognitoMode = localStorage.getItem("incognitoMode");
    if (incognitoMode == "1") {
      this.isIncognitoBrowser = true;
    }
    // console.error(navigator.userAgent);
    // console.error(Notification.permission);
    let action = 'change';
    if (Notification.permission == "granted") {
      this.definedNotifyText = "";
      this.enableDesktopPush = false;
      action = 'init';
    } else if (Notification.permission == "denied") {
      action = 'init';
      this.definedNotifyText =
        "Notifications blocked. Please enable them in your browser.";
      this.enableDesktopPush = false;
    } else {
      action = 'init';
      this.definedNotifyText = "";
      this.enableDesktopPush = true;
    }

    this.platformName = localStorage.getItem("platformName");
    this.dialogData.platformName = this.platformName;

    // Notification on/off
    this.sharedSvc.notificationHeaderSubject.subscribe((data: any) => {
      this.enableDesktopPush = data;
    });

    this.sharedSvc._toreceiveSearchEmptyValuetoHeader.subscribe((r) => {
      if(r==''){
        this.submitted = false;
        this.searchVal = '';
        this.searchTick = false;
        this.searchClose = this.searchTick;
        this.searchBgFlag = false;
        localStorage.removeItem('loadMenuPageName');
        localStorage.removeItem('searchValue');
        localStorage.removeItem('escalationPPFRSearch');
        this.searchImg = `${this.assetPath}/search-icon.png`;
        this.searchCloseImg = `${this.assetPath}/select-close.png`;
      }
           
    });

    this.sharedSvc._toreceiveSearchValuetoHeader.subscribe((r) => {
      if(r==''){
        this.clearSearch();
      }
      else{
        this.searchVal = r;
        this.searchBgFlag = true;
        this.searchTick = true;
        this.searchClose = this.searchTick;
        if (this.searchBgFlag) {
          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
      }
      
    });
    let teamSystem = localStorage.getItem("teamSystem");
    if (teamSystem) {
      this.showItemheader = false;
    }
    let platformId = localStorage.getItem("platformId");
    if (platformId == PlatFormType.Collabtic) {
      //this.platformLogo = this.assetPathplatform + "logo.png";
      //this.platformLogo = this.assetPathplatform + "loading.svg";
      this.collabticDomain = true;      
    } else if (platformId == PlatFormType.MahleForum) {
      this.platformLogo = this.assetPathplatform + "mahle-logo.png";
    } else if (platformId == PlatFormType.CbaForum) {
      this.platformLogo = this.assetPathplatform + "cba-logo.png";
    } else if (platformId == PlatFormType.KiaForum) {
      this.platformLogo = this.assetPathplatform + "mahle-logo.png";
    } else {
      this.platformLogo = this.assetPathplatform + "logo.png";
    }
    let options = this.pageData;
    console.log(options)
    this.access = options.access;

    // this.access = options.access;

    //alert(options.searchValue);

    let accessCheck = false;
    /*
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {

        console.log("Hidden--header"+options.access);
        accessCheck=false;

      }
      else {
        accessCheck=true;

        //console.log("SHOWN--header");
        console.log("SHOWN--header"+options.access);



      }
    });
    */

    this.searchFlag = options.search;
    this.profileFlag = options.profile;
    console.log(this.profileFlag);
    this.welcomeProfileFlag = options.welcomeProfile;

    this.platformId = localStorage.getItem('platformId');
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.countryId = localStorage.getItem('countryId');
    this.countryName = localStorage.getItem('countryName');
    let multipleCountry = localStorage.getItem('multipleCountry');
    this.showCountryFlag = multipleCountry == '1' ? true : false;

    if (this.platformId != '1') {
      this.showLanguageFlag = true;
      this.disableManager = true;
      this.languageId = localStorage.getItem('languageId');
      this.languageName = localStorage.getItem('languageName');

      if (this.domainId == '97') {
        this.tvsIBDomain = true;
        this.policyFlag = true;
      }

    }
    else {
      this.showLanguageFlag = false;
    }

    setTimeout(() => {
      let urlVal = this.router.url;
      console.log(urlVal);
      this.industryType = this.sharedSvc.getIndustryType();
      console.log(this.industryType);
      let platformId = localStorage.getItem('platformId');
      if (platformId == '1') {
        this.recentVinFlag = (urlVal == '/landing-page' && this.industryType['id'] == 2) ? true : false;
      }
    }, 1000);

    switch (this.domainId) {
      case 52:
      case 97:
        this.platformLogo = 'https://mss.mahleforum.com/img/tvs_logo1.png';
        this.tvslogoHeight = true;
        break;

      case 94:
        this.platformLogo =
          "https://mss.mahleforum.com/img/Lordstown_Logo.jpg";
        break;
    }

    this.userId = this.user.Userid;
    if (this.domainId == "60" || this.domainId == "22" || this.teamSystem) {
      this.dropdownAccess = false;
    }

    console.log(action)
    this.requestPermission(1, action);
    this.requestActivePageAccess(1);
    this.receiveMessage();
    // this.notification.receiveMessage();
    //this.listenForMessages();
    this.message = this.currentMessage;
    //console.log(options)
    if (this.profileFlag) {
      this.getUserProfile();
    }

    //(this.access);
    switch (this.access) {
      case "escalation":
      case "usermanagement":
      case "search":
      case "Product Matrix":
      case "productList":
      case "escalation-product":
      case "ppfr":
      case "dtc":
        this.searchReadonlyFlag = false;
        break;
    }
    switch (this.access) {
      case "productList":
        this.searchPlacehoder = "Search Product Matrix";
        break;
      case "escalation-product":
        this.searchPlacehoder = "Search";
        break;   
      case 'knowledge-base':      
      case 'chat-page':     
        this.searchPlacehoder = 'Search'
        break;
      case 'escalation':
        this.searchPlacehoder = 'Search Escalations';
        this.searchBgFlag = options.searchBg;
        if (this.searchBgFlag) {
          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
        break;
      case "ppfr":
        this.searchPlacehoder = "Search";
        this.searchBgFlag = options.searchBg;
        if (this.searchBgFlag) {
          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
        break;
      case 'media':
      case 'gtsList':
        this.searchPlacehoder = 'Search';
        this.searchReadonlyFlag = false;
        break;
      case 'usermanagement':
        this.searchPlacehoder = 'Search users';
        break;
      case 'sib':
      case 'parts':
      case 'threads':
      case 'knowledgeArticles':
      case 'landingpage': 
      case "documents":
      case "announcement":
        this.searchPlacehoder = 'Search';
        this.searchReadonlyFlag = false;
        break;
      case 'dispatch':
        this.searchPlacehoder = 'Search';
        break;
      case 'manageThread':
      case 'managePart':
      case 'manageSib':
      case 'manageKnowledgearticles':
        this.headTitleFlag = options.titleFlag;
        this.headTitle = options.title;
        break;
      case 'search':
        console.log(this.pageData)
        this.searchPlacehoder = 'Search';
        this.searchBgFlag = options.searchBg;
        if (this.searchBgFlag) {
          this.searchVal = this.searchBgFlag
            ? localStorage.getItem("searchValue")
            : options.searchKey;
          this.submitSearch();

          //this.searchVal = localStorage.getItem('escalationSearch');
          this.searchImg = `${this.assetPath}/search-white-icon.png`;
          this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
        }
        break;
    }

    if (this.searchFlag) {
      if (this.access == 'search') {
        this.searchVal = (this.searchBgFlag) ? localStorage.getItem('searchValue') : options.searchKey;
      } else if (this.access == 'parts' || this.access == 'sib' || this.access == 'knowledge-base') {
        this.searchVal = options.searchVal;
      } else if (this.access == "ppfr") {
        this.searchVal = this.searchBgFlag
          ? localStorage.getItem("escalationPPFRSearch")
          : options.searchKey;
      } else {
        this.searchVal = this.searchBgFlag
          ? localStorage.getItem("escalationSearch")
          : options.searchKey;
      }
      if (
        this.searchVal != undefined &&
        this.searchVal != "undefined" &&
        this.searchVal != ""
      ) {
        this.searchTick = true;
        this.searchClose = this.searchTick;
      }
      this.searchForm = this.formBuilder.group({
        searchKey: [this.searchVal, [Validators.required]],
      });
    }

    setTimeout(() => {
      localStorage.removeItem('escalationSearch');
    }, 500);
    
  }

  closewindowPopup(data) {
    if (data.closeFlag) {
      window.close();
    }
    this.displayLogoutPopup = false;
    location.reload();
  }

  checkHiddenDocument() {
    if (document.hidden) {
      this.activePageAccess = "0";
    } else {
      this.activePageAccess = "1";
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }

      let notificationToggle = localStorage.getItem("notificationToggle");
      if (notificationToggle) {
        let headerNotify: any = localStorage.getItem('headerNotify');
        let enableDesktopPush = (headerNotify == 'granted') ? false : true;
        this.sharedSvc.emitNotificationHeader(enableDesktopPush);
        this.displayLogoutPopup = true;
        this.dialogData.access = 'reload';
        setTimeout(() => {
          localStorage.removeItem('headerNotify');
        }, 100);
      }
    }
    this.requestActivePageAccess(1);
  }
  taponlogo() {
    let currUrl = this.router.url.split('/');
    console.log(currUrl[1])
    let navUrl = RedirectionPage.Home;
    if (navUrl == currUrl[1]) {
      window.location.href = navUrl;
    } else {
      //this.router.navigate([navUrl]);
      let navHome = window.open(navUrl, navUrl);
      navHome.focus();
    }
    return false;
    var aurl = forumPageAccess.homePage;
    //var ddd=window.open(aurl, aurl);
    //ddd.focus();
    this.router.navigate([aurl]);
    var ddd = window.open(aurl, aurl);
    ddd.focus();
  }
  loadMenuPageName() {
    var loadMenuPageName = '';
    switch (this.access) {
      case 'threads':
        loadMenuPageName = 'Threads';
        break;
      case 'knowledgeArticles':
        loadMenuPageName = 'Knowledge Articles';
        break;
      case 'documents':
        let platformId = localStorage.getItem('platformId');
        if (platformId == '1') {
          loadMenuPageName = 'Tech Info';
        }
        else {
          loadMenuPageName = 'Documentation';
        }
        break;
      case 'parts':
        loadMenuPageName = 'Parts';
        break;
      case 'Inventory':
        loadMenuPageName = 'Inventory';
        break;
        case 'dispatch':
          loadMenuPageName = 'Dispatch';
          break;
      case 'sib':
        loadMenuPageName = 'SIB';
        break;
      default:
        loadMenuPageName = 'Threads';
        break;
    }
    localStorage.setItem('loadMenuPageName', loadMenuPageName);
  }
  taponsearch(event) {
    this.loadMenuPageName();    
    if (this.access == 'announcement' || this.access == 'landingpage' || this.access == 'threads' || this.access == 'knowledgeArticles' || this.access == 'sib' || this.access == 'documents' || this.access == 'parts' || this.access == 'gtsList' || this.access == 'media' || this.access == 'escalation' || this.access == 'usermanagement' || this.access == 'search' || this.access == 'productList' || this.access == 'escalation-product' || this.access == 'ppfr' || this.access == 'dtc') {
    }
    else {
      let platformId = localStorage.getItem('platformId');
      if (platformId == '1') {
        if (this.domainId == '1' || this.domainId == '60' || this.domainId == '22' || this.teamSystem) {
          var aurl = forumPageAccess.newSearch;
        }
        else {
          // var aurl=forumPageAccess.forumSearch;
          var aurl = forumPageAccess.newSearch;
        }

      }
      else {
        var aurl = forumPageAccess.newSearch;
      }


      console.log('aurl: ', aurl);

      window.open(aurl, '_blank' + aurl).focus();
    }

  }


  tapnotifications(type = '') {
    this.isModalOpen = true;
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.notificationClass);
    document.body.classList.add('top-right-notifications-popup');
    let config = Object.assign({}, this.config);
    config.windowClass = 'top-right-notifications-popup-only';
    const modalRef = this.modalService.open(AppUserNotificationsComponent, config);

    modalRef.componentInstance.newNotificationsFCM = type;
    modalRef.componentInstance.accessFrom = this.access;
    modalRef.componentInstance.updateNotificationCountEvent.subscribe((receivedService) => {

      if (receivedService == 'reset') {
        this.isModalOpen = false;
        setTimeout(() => {
          document.body.classList.remove('top-right-notifications-popup');
        }, 500);
      }
      else {
        const notificationSplit = receivedService.split('--');
        this.notification.totalNotificationcount = notificationSplit[0];
        this.notification.totalunseenunreadcolor = notificationSplit[1];
      }
    });
  }

  /* FCM SETUP */
  browserDetection() {
    let browserName = '';
    //Check if browser is IE
    if (navigator.userAgent.search("MSIE") >= 0) {
      // insert conditional IE code here
      browserName = "MSIE";
    }
    //Check if browser is Chrome
    else if (navigator.userAgent.search("Chrome") >= 0) {
      // insert conditional Chrome code here
      browserName = "Chrome";
    }
    //Check if browser is Firefox
    else if (navigator.userAgent.search("Firefox") >= 0) {
      // insert conditional Firefox Code here
      browserName = "Firefox";
    }
    //Check if browser is Safari
    else if (
      navigator.userAgent.search("Safari") >= 0 &&
      navigator.userAgent.search("Chrome") < 0
    ) {
      // insert conditional Safari code here
      browserName = "Safari";
    }
    //Check if browser is Opera
    else if (navigator.userAgent.search("Opera") >= 0) {
      // insert conditional Opera code here
      browserName = "Opera";
    } else {
      browserName = "others";
    }
    return browserName;
  }
  /*
  listenForMessages() {
    this.afMessaging.messages.subscribe(
      ({ data }: { data: any }) =>
        this.snackBar.open(`${data.title} - ${data.alert}`, 'Close', {
          duration: 1000,
        }),
      err => console.log(err),
    );
  }
  */
  requestPermission(state, action = '') {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        if (token && token != null) {
          this.enableDesktopPush = false;
        }
        else {
          this.enableDesktopPush = true;
        }
        this.sharedSvc.emitNotificationHeader(this.enableDesktopPush);

        //console.log(action)
        console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }
        //console.log(apiFormData);
        this.landingpageAPI.Registerdevicetoken(apiFormData).subscribe((response) => {
          //console.log(response);
        });

        if ('permissions' in navigator) {
          navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
            notificationPerm.onchange = function () {
              console.log("User decided to change his seettings. New permission: " + notificationPerm.state);
              localStorage.setItem('headerNotify', notificationPerm.state);
              localStorage.setItem('notificationToggle', 'true');
              setTimeout(() => {
                localStorage.removeItem('notificationToggle');
              }, 5000);
            };
          });
        }
      },
      (err) => {
        this.enableDesktopPush = true;
        console.log('Unable to get permission to notify.', err);
      }
    );
  }

  customfunction = (event: any): void => {

  };

  requestActivePageAccess(state) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        //console.log(token);
        let fcmAction = '';
        let fcmOldToken = '';
        let tokenKey = token;

        let fcmToken = localStorage.getItem('fcm_token');

        if (fcmToken == null) {
          localStorage.setItem('fcm_token', token);
        } else if (fcmToken != null && token != fcmToken) {
          fcmAction = 'update';
          fcmOldToken = fcmToken;
          localStorage.setItem('fcm_token', token);
        }

        const apiFormData = new FormData();
        apiFormData.append('apiKey', Constant.ApiKey);
        apiFormData.append('domainId', this.domainId);
        apiFormData.append('countryId', this.countryId);
        apiFormData.append('userId', this.userId);
        apiFormData.append('deviceName', this.browserDetection());
        apiFormData.append('appVersion', '1.0');
        apiFormData.append('type', 'w');
        apiFormData.append('token', tokenKey);
        apiFormData.append('pageAccess', this.access);
        apiFormData.append('isActivePage', this.activePageAccess);
        apiFormData.append('status', state);
        if (fcmAction == 'update') {
          apiFormData["oldToken"] = fcmOldToken;
        }


        //console.log(apiFormData);

        this.landingpageAPI.ActiveDevicesOnPageWeb(apiFormData).subscribe((response) => {

          //console.log(response);
        });


      },
      (err) => {
        // console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    console.log("=================== PUSH Update 814 ===============");
    this.angularFireMessaging.messages.subscribe(({ data }: { data: any }) => {
      console.log("new message received. ", data);
      console.log("=================== PUSH Update 817 ===============");
      console.log(data)
      if (data['access'] == 'parts' && data['chatType'] == '') {
        return false;
      }
      let desktopPush = data.desktopPush;
      //silent push
      let currUrl = this.router.url.split('/');
      let access = currUrl[1];
      let urlLen = currUrl.length;
      let silentPushFlag = (urlLen > 2) ? false : true;
      data['access'] = access;
      data['pageInfo'] = '';
      if (data.typeId == 2) {
        this.call.groupName = data.groupName;
        this.notification.videoCall = true;
        this.notification.videoCallData = data;
        this.notification.initIncomingCallRing();
        localStorage.setItem('videoCallDataToken', data.tokenValue);
        localStorage.setItem('groupName', data.groupName);
        localStorage.setItem('videoCallDataSessionId', data.sessionId);
        localStorage.setItem('rejoin', 'false');
        return false;
      }
      let pushType = data.pushType;
      pushType = (pushType == undefined || pushType == "undefined" || pushType == "") ? '' : parseInt(data.pushType);
      let sindex: any = '', pageUrl = '', pageFilter = '', silentFilter = '', silentCountTxt = '', filter: any = [], silentLoadCount: any = 0;
      if (pushType != '') {
        sindex = PushTypes.findIndex(option => option.id == pushType);
        if (PushTypes[sindex].hasOwnProperty('url')) {
          pageUrl = PushTypes[sindex].url;
        }
        pageFilter = PushTypes[sindex].filter;
        silentFilter = PushTypes[sindex].silentFilter;
        silentCountTxt = PushTypes[sindex].silentCount;
        filter = JSON.parse(localStorage.getItem(pageFilter));
        silentLoadCount = localStorage.getItem(silentCountTxt);
      } else {
        silentPushFlag = false;
      }
      if (access == 'workstreams-page') {
        silentPushFlag = false;
        data['access'] = pageUrl;
        let wsTab = document.getElementsByClassName('ws-tab');
        Array.from(wsTab).forEach((el) => {
          let activeTab = el.classList.contains('active-tab');
          let checkSlug = el.classList.contains(pageUrl);
          let wsTabFlag = false;


          if (pushType >= 1) {
            //if(activeTab && checkSlug) {
            let infoIndex = PushTypes.findIndex(option => option.url == pageUrl);
            let pageInfoAct = pageInfo.workstreamPage;
            data['pageInfo'] = pageInfoAct;
            //}
          }

          let wsg = [];
          try {
            wsg = JSON.parse(data.groups);
            wsg.forEach(item => {
              let chkWsTab = `ws-tab-${item}`
              let chkWs = el.classList.contains(chkWsTab);
              if (chkWs) {
                wsTabFlag = true;
              }
            });
          } catch {
            console.log(data.groups);
          }


          if (activeTab && checkSlug && wsTabFlag) {
            let actWs = 0;
            let chkActiveWs = document.getElementsByClassName('workstream-bg');
            Array.from(chkActiveWs).forEach((el) => {
              let chkActWs = el.classList.contains('active');
              if (chkActWs) {
                let wsId = el.getAttribute('id');
                console.log(wsId)
                actWs = wsg.findIndex(option => option == wsId);
              }
            });
            silentPushFlag = (actWs >= 0) ? true : false;
          }
        });
      } else {
        if (this.access != pageUrl && urlLen < 2) {
          return false;
        }
        silentPushFlag = (silentPushFlag && access == pageUrl && urlLen < 3) ? silentPushFlag : false;
        if (silentPushFlag && pushType == 1) {
          let make = data.makeName;
          let filteredMake = (filter.make) ? filter.make : [];
          let additionalFields = ['workstream', 'make', 'action', 'threadViewType', 'loadAction'];
          console.log(silentPushFlag, make, filteredMake)
          let chkFilter = this.sharedSvc.checkFilterApply(filter, additionalFields);
          let chkFilterCount: any = chkFilter.filterCount;
          console.log(filter, chkFilter, chkFilterCount)
          silentPushFlag = (silentPushFlag && (filteredMake.length > 0 && (make != filteredMake[0] || (make == filteredMake[0] && chkFilterCount > 0)))) ? false : silentPushFlag;
          console.log(silentPushFlag)
        }
      }

      silentLoadCount = (silentLoadCount == null || silentLoadCount == 'undefined' || silentLoadCount == undefined) ? 0 : parseInt(silentLoadCount);
      console.log("workstream msg ==>", currUrl, urlLen, pushType, silentPushFlag)
      let groups: any = data.groups?.toString();
      data.pushAction = (silentPushFlag) ? 'load' : 'notify';
      //if (data.pushType == 3 || data.pushType == 6 || data.pushType == 4 || data.pushType == 10 || data.pushType == 12 || data.pushType == 15 || data.pushType == 22 || data.pushType == 25) {
      switch (pushType) {
        case 9:
          if (this.isModalOpen == false) {
            if (this.access == 'chat-page') {
              let pushchatType = data.chatType;
              let pushchatGroupId = data.chatGroupId;
              if (pushchatType != '' && pushchatGroupId != '') {
                let loadedChatType = localStorage.getItem('loadedChatType');
                let loadedchatGroupId = localStorage.getItem('loadedchatGroupId');
                let loadedworkstreamId = localStorage.getItem('loadedworkstreamId');
                if (loadedChatType == '1') {
                  if (loadedworkstreamId != pushchatGroupId) {
                    if (desktopPush == 1) {
                      $('body').addClass('top-right-notifications-popup');
                      this.tapnotifications('new');
                    }
                  }
                }
                if (loadedChatType == '2' || loadedChatType == '3') {
                  if (loadedchatGroupId != pushchatGroupId) {
                    if (desktopPush == 1) {
                      $('body').addClass('top-right-notifications-popup');
                      this.tapnotifications('new');
                    }
                  }
                }
              }
            }
            else {
              if (desktopPush == 1) {
                $('body').addClass('top-right-notifications-popup');
                this.tapnotifications('new');
              }
            }

            setTimeout(() => {
              this.sharedSvc.emitMessageReceived(data);
              this.currentMessage.next(data);
            }, 500);
          }
          else {
            this.sharedSvc.emitMessageReceived(data);
            this.currentMessage.next(data);
          }
          break;
        case 3:
        case 4:
        case 6:
        case 10:
        case 12:
        case 15:
        case 22:
        case 24:
        case 25:
          if (pushType == 22) {
            return false;
          }
          if (access != 'workstreams-page') {
            let infoIndex = PushTypes.findIndex(option => option.id == pushType);
            data['pageInfo'] = PushTypes[infoIndex].pageInfo;
          }
          if (silentPushFlag || pushType == 10) {
            this.sharedSvc.emitMessageReceived(data);
          } else {
            if (pushType != 25 && access != 'workstreams-page' && filter.hasOwnProperty('workstream') && filter.workstream) {
              groups = JSON.parse(data.groups)
              let chkWs = groups.filter(x => !filter.workstream.includes(x));
              console.log(chkWs)
              if (chkWs.length > 0) {
                let routeLoadIndex = pageTitle.findIndex(option => option.slug == access);
                if (routeLoadIndex >= 0) {
                  let routeLoadText = pageTitle[routeLoadIndex].routerText;
                  localStorage.setItem(routeLoadText, 'true');
                }
                let chkFilter: any = localStorage.getItem(silentFilter);
                if (chkFilter == null) {
                  chkWs.forEach(item => {
                    filter.workstream.unshift(item);
                  });
                } else {
                  chkFilter = JSON.parse(chkFilter);
                  let schkWs = chkWs.filter(x => !chkFilter.includes(x));
                  if (schkWs.length > 0) {
                    chkWs.forEach(item => {
                      chkFilter.workstream.unshift(item);
                    });
                  }
                  filter = chkFilter;
                }
                console.log(chkWs, JSON.stringify(filter))
                localStorage.setItem(silentFilter, JSON.stringify(filter))
              } else {
                silentLoadCount = silentLoadCount + 1;
                localStorage.setItem(silentCountTxt, silentLoadCount);
              }
            } else if (pushType == 24 && filter.workstream == undefined) {
              silentLoadCount = silentLoadCount + 1;
              localStorage.setItem(silentCountTxt, silentLoadCount);
            }

            if (pushType == 25) {
              this.sharedSvc.emitMessageReceived(data);
            }
          }
          break;
        default:
          var src = '../../assets/sounds/alert.mp3';
          var c = document.createElement('audio');
          c.src = src; c.play();
          if (desktopPush == 1) {
            this.notification.getUserAppNotifications('1');
          }

          if (this.isModalOpen == false) {
            if (this.access == 'chat-page') {
              let pushchatType = data.chatType;
              let pushchatGroupId = data.chatGroupId;
              if (pushchatType != '' && pushchatGroupId != '') {
                let loadedChatType = localStorage.getItem('loadedChatType');
                let loadedchatGroupId = localStorage.getItem('loadedchatGroupId');
                let loadedworkstreamId = localStorage.getItem('loadedworkstreamId');
                if (loadedChatType == '1') {
                  if (loadedworkstreamId != pushchatGroupId) {
                    if (desktopPush == 1) {
                      $('body').addClass('top-right-notifications-popup');
                      this.tapnotifications('new');
                    }
                  }
                }
                if (loadedChatType == '2' || loadedChatType == '3') {
                  if (loadedchatGroupId != pushchatGroupId) {
                    if (desktopPush == 1) {
                      $('body').addClass('top-right-notifications-popup');
                      this.tapnotifications('new');
                    }
                  }
                }
              }
            }
            else {
              if (desktopPush == 1) {
                $('body').addClass('top-right-notifications-popup');
                this.tapnotifications('new');
              }
            }

            setTimeout(() => {
              this.sharedSvc.emitMessageReceived(data);
              this.currentMessage.next(data);
            }, 500);
          }
          else {
            this.sharedSvc.emitMessageReceived(data);
            this.currentMessage.next(data);
          }

          console.log(filter)
          if (!silentPushFlag && access != 'workstreams-page' && (filter != null && filter.length > 0)) {
            let chkWs = filter.workstream.filter(element => groups.includes(element));
            console.log(chkWs, groups)
            silentLoadCount = (chkWs.length > 0) ? silentLoadCount + 1 : silentLoadCount;
            localStorage.setItem(silentCountTxt, silentLoadCount);
          }
          break;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    console.log(event)
    console.log(localStorage.getItem('notificationOpened'));
    if (localStorage.getItem('notificationOpened') == null) {
      $('body').removeClass('top-right-notifications-popup');
    }
  }

  /* FCM SETUP */
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);

    // ESC key
    if (event.key == 'Escape') {

      this.displayPosition = false;
      // your logic;
    }
  }

  notifyMe() {
    //Notification.requestPermission();
    this.handlePermission();
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  notifyPopupScreen(position: string) {
    this.position = position;
    this.displayPosition = true;
  }
  handlePermission() {


    if (Notification.permission == 'denied') {
      this.definedNotifyText = 'Notifications blocked. Please enable them in your browser.';
    }

    return navigator.permissions
      .query({ name: 'notifications' })
      .then(this.permissionQuery)
      .catch(this.permissionError);

  }
  permissionError(Error) {
    console.log(Error);
    return false;
  }

  permissionQuery(result) {
    console.debug({ result });


    var newPrompt;

    if (result.state == 'granted') {
      this.enableDesktopPush = false;
      // notifications allowed, go wild

    } else if (result.state == 'prompt' || result.state == 'default') {
      // we can ask the user
      newPrompt = Notification.requestPermission();

    } else if (result.state == 'denied') {

      this.definedNotifyText = 'Notifications blocked. Please enable them in your browser.';

      alert('Notifications are blocked Please enable it');
      newPrompt = Notification.requestPermission();
      //  newPrompt = Notification.requestPermission();
      // notifications were disabled
    }

    result.onchange = () => console.debug({ updatedPermission: result });

    return newPrompt || result;
  }

  async getUserAppNotifications(type = '') {

    let apiInfo = {
      'apiKey': Constant.ApiKey,
      'userId': this.userId,
      'domainId': this.domainId,
      'countryId': this.countryId,
      'escalationType': 1,
      'limit': 1,
      'offset': 0,
      'type': this.notificationType

    }
    this.apiData = apiInfo;

    const apiFormData = new FormData();
    apiFormData.append('apiKey', this.apiData['apiKey']);
    apiFormData.append('domainId', this.apiData['domainId']);
    apiFormData.append('countryId', this.apiData['countryId']);
    apiFormData.append('userId', this.apiData['userId']);
    apiFormData.append('limit', this.apiData['limit']);
    apiFormData.append('offset', this.apiData['offset']);
    apiFormData.append('type', this.apiData['type']);
    apiFormData.append('totalFlag', '0');
    apiFormData.append('desktop', '1');
    apiFormData.append('instantPush', type);


    let data = new FormData();
    data.append('apiKey', this.apiData['apiKey']);
    data.append('userId', this.apiData['userId']);
    data.append('domainId', this.apiData['domainId']);
    data.append('type', 'chat');
    data.append('action', 'clear');
    data.append('notificationId', this.notification.activeChatObject.notificationId);
    data.append('postId', this.notification.activeChatObject.postId);
    data.append('threadId', this.notification.activeChatObject.threadId);
    data.append('chatType', this.notification.activeChatObject.chatType);
    data.append('leaveGroup', this.notification.activeChatObject.leaveGroup);
    data.append('chatGroupId', this.notification.activeChatObject.chatGroupId);
    data.append('workStreamId', this.notification.activeChatObject.workStreamId);
    this.landingpageAPI.readandDeleteNotification(data).subscribe(() => { });


    this.landingpageAPI.Getusernotifications(apiFormData).subscribe((response) => {

      console.log("Getusernotifications", response);

      let rstatus = response.status;
      let rresult = response.result;
      let rtotal = response.total;

      let totalUnseen = response.totalUnseen;
      let totalUnread = response.totalUnread;

      let totalthreadCount = response.threadCount;
      let totalthreadUnreadCount = response.threadUnreadCount;

      let totalchatCount = response.chatCount;
      let totalchatUnreadCount = response.chatUnreadCount;

      let totalannouncementCount = response.announcementCount;
      let totalannouncementUnreadCount = response.announcementUnreadCount;

      let totalothersUnseenount = response.othersUnseenount;
      let totalothersUnreadount = response.othersUnreadount;

      //Total Notifications

      if (totalUnseen) {
        this.notification.totalNotificationcount = totalUnseen;
        this.notification.totalunseenunreadcolor = 'unseenColor';

      }
      else {
        if (totalUnread) {
          this.notification.totalNotificationcount = totalUnread;
          this.notification.totalunseenunreadcolor = 'unreadColor';
        }
        else {
          this.notification.totalNotificationcount = 0;
          this.notification.totalunseenunreadcolor = '';
        }
      }
      //total announcement
      if (totalannouncementCount) {
        this.totalAnnounceNotificationcount = totalannouncementCount;
        this.totalAnnouncementColor = 'unseenColor';

      }
      else {
        if (totalUnread) {
          this.totalAnnounceNotificationcount = totalannouncementUnreadCount;
          this.totalAnnouncementColor = 'unreadColor';
        }
        else {
          this.totalAnnounceNotificationcount = 0;
          this.totalAnnouncementColor = '';
        }
      }


      //total Chat
      if (totalchatCount) {
        this.totalChatNotificationcount = totalchatCount;
        this.totalChatColor = 'unseenColor';

      }
      else {
        if (totalchatUnreadCount) {
          this.totalChatNotificationcount = totalchatUnreadCount;
          this.totalChatColor = 'unreadColor';
        }
        else {
          this.totalChatNotificationcount = 0;
          this.totalChatColor = '';
        }
      }

      //total Threads
      if (totalthreadCount) {
        this.totalThreadsNotificationcount = totalthreadCount;
        this.totalThreadsColor = 'unseenColor';

      }
      else {
        if (totalthreadUnreadCount) {
          this.totalThreadsNotificationcount = totalthreadUnreadCount;
          this.totalThreadsColor = 'unreadColor';
        }
        else {
          this.totalThreadsNotificationcount = 0;
          this.totalThreadsColor = '';
        }
      }

      //total Others wrench
      if (totalothersUnseenount) {
        this.totalOthersNotificationcount = totalothersUnseenount;
        this.totalOthersColor = 'unseenColor';

      }
      else {
        if (totalthreadUnreadCount) {
          this.totalOthersNotificationcount = totalothersUnreadount;
          this.totalOthersColor = 'unreadColor';
        }
        else {
          this.totalOthersNotificationcount = 0;
          this.totalOthersColor = '';
        }
      }

      this.loadingnotifications = false;


    });
  }

  getUserProfile() {
    this.countryId = localStorage.getItem('countryId');
    let userData = {
      'api_key': "dG9wZml4MTIz",
      'user_id': this.userId,
      'domain_id': this.domainId,
      'countryId': this.countryId
    }
    this.probingApi.getUserProfile(userData).subscribe((response) => {
      let resultData = response.data;
      this.loadLogo = true;
      this.roleId = resultData.roleId;
      if(this.collabticDomain){
        this.platformLogo = response.businessLogo;
      }      
      let firstLastname = resultData.first_name + ' ' + resultData.last_name;

      this.isVerified = response.isVerified;
      this.popupVerified = response.popupVerified;

      // collabtic domain check add manager process, other domain no need
      let isprocessCompleted = this.disableManager ? '1' : response.isprocessCompleted;

      this.newBusinessAdmin = isprocessCompleted == '2' && this.collabticDomain ? true : false;
      let newBusinessAdminSignup = localStorage.getItem('newBusinessAdminSignup');
      // tvsib domain check policy popup, other domain no need
      let isPolicyAccepted = (this.tvsIBDomain && this.policyFlag) ? response.isPolicyAccepted : '1';

      if (this.newBusinessAdmin) {
        localStorage.setItem('newBusinessAdminSignup', '1');
        /************************ NEW SIGNUP/BUSINESS ********************** */
        if (this.isVerified == '0') {
          const modalRef = this.modalService.open(VerifyEmailComponent, { backdrop: 'static', keyboard: false, centered: true });
          modalRef.componentInstance.countryId = this.countryId;
          modalRef.componentInstance.domainID = this.domainId;
          modalRef.componentInstance.firstLastname = firstLastname;
          modalRef.componentInstance.email = resultData.email_adress;
          modalRef.componentInstance.stageName = resultData.username;
          modalRef.componentInstance.businessName = resultData.business_name;
          modalRef.componentInstance.subDomainUrl = response.subDomainUrl;
          modalRef.componentInstance.isprocessCompleted = isprocessCompleted;
          modalRef.componentInstance.newSignupAdmin = true;
        }
        else {
          this.bodyElem = document.getElementsByTagName('body')[0];
          this.bodyElem.classList.add('welcomepopup');
          this.bodyElem.classList.add('welcomepopupNewSign');
          const modalRef = this.modalService.open(WelcomeHomeComponent, { backdrop: 'static', keyboard: false, centered: true });
          let apiInfo = {
            'apiKey': Constant.ApiKey,
            'userId': this.userId,
            'domainId': this.domainId,
            'countryId': this.countryId,
            'newAccountSetup': true
          }
          this.apiData = apiInfo;
          modalRef.componentInstance.data = this.apiData;
          modalRef.componentInstance.startedNextResponce.subscribe((receivedService) => {
            if (receivedService) {
              if (receivedService == 'productmatrix') {
                console.log(receivedService);
                let url = "product-matrix";
                window.open(url, url);
              }
              // welcome POPUP
              this.loadGetStartedPOPUP();
            }
          });
        }
        /************************ NEW SIGNUP/BUSINESS ********************** */
      }
      else {
        // policy popup
        if (isPolicyAccepted == '0') {
          this.bodyElem = document.getElementsByTagName('body')[0];
          const modalRef = this.modalService.open(ContentPopupComponent, { backdrop: 'static', keyboard: false, centered: true });
          modalRef.componentInstance.privacyResponce.subscribe((receivedService) => {
            if (receivedService) {
              modalRef.dismiss('Cross click');
              this.bodyElem.classList.remove('auth-bg');
              this.logout();
            }
          });
        }
        else {
          // verification email popup show
          if (this.isVerified == '0') {
            const modalRef = this.modalService.open(VerifyEmailComponent, { backdrop: 'static', keyboard: false, centered: true });
            modalRef.componentInstance.countryId = this.countryId;
            modalRef.componentInstance.domainID = this.domainId;
            modalRef.componentInstance.firstLastname = firstLastname;
            modalRef.componentInstance.email = resultData.email_adress;
            modalRef.componentInstance.stageName = resultData.username;
            modalRef.componentInstance.businessName = '';
            modalRef.componentInstance.subDomainUrl = '';
            modalRef.componentInstance.isprocessCompleted = '';
            modalRef.componentInstance.newSignupAdmin = false;
          }
          else {
            if (Constant.TVSSSO == '1') {
              localStorage.removeItem('employeeType');
              localStorage.removeItem('employeeEmail');
              localStorage.removeItem('employeeId');
              localStorage.removeItem('employeePwd');
              localStorage.removeItem('pageNavAuth');
            }
            // add manager screen display
            if (isprocessCompleted == '0' && newBusinessAdminSignup != '1') {
              this.router.navigate(['landing-page/add-manager']);
            }
            else {
              // administrator approval popup show
              if (response.waitingforApproval == '1') {
                this.bodyElem = document.getElementsByTagName('body')[0];
                this.bodyElem.classList.add('auth');
                this.bodyElem.classList.add('auth-bg');
                const modalRef = this.modalService.open(NonUserComponent, { backdrop: 'static', keyboard: false, centered: true });
                modalRef.componentInstance.okButtonDisable = true;
                modalRef.componentInstance.nonuserResponce.subscribe((receivedService) => {
                  if (receivedService) {
                    modalRef.dismiss('Cross click');
                    this.bodyElem.classList.remove('auth-bg');
                    this.logout();
                  }
                });
              }
              else {
                // welcome POPUP
                this.loadGetStartedPOPUP();
              }
            }
          }
        }

      }

      this.apiUrl.userName = resultData.username;
      this.apiUrl.profileImage = resultData.profile_image;
      this.superAdmin = response.superAdmin;
      localStorage.setItem('userProfile', this.apiUrl.profileImage);
      localStorage.setItem('userRole', resultData.userRole);
      localStorage.setItem('roleId', resultData.roleId);
      localStorage.setItem('firstLastName', firstLastname);
      localStorage.setItem('userRoleType', resultData.userRoleType);
      localStorage.setItem('businessRole', resultData.businessRole);
      localStorage.setItem('defaultWorkstream', response.defaultWorkstream);
      localStorage.setItem('defaultLanguage', JSON.stringify(response.defaultLanguage));
      localStorage.setItem('expiryDateFormat', response.expiryDateFormat);
      localStorage.setItem('industryType', response.displayType);
      localStorage.setItem('dealerCode', response.dealerCode);
      // alert(JSON.stringify(response.countryInfo));
      localStorage.setItem('countryInfo', JSON.stringify(response.countryInfo));

      if (response.displayType == 3 && this.domainId == 52) {
        localStorage.setItem('partsQuantity', JSON.stringify(response.partsQuantity));
      }
      localStorage.setItem('uploadMaxSize', response.uploadMaxSize);
      localStorage.setItem('uploadMaxSizeText', response.uploadMaxSizeText);
      localStorage.setItem('uploadMaxSizeText', response.uploadMaxSizeText);
      localStorage.setItem('partsStatusInfo', JSON.stringify(response.partsStatusInfo));

      this.user.roleId = resultData.roleId;
      this.authenticationService.UserSuccessData(this.user);

      /*if(resultData.escTechUsers.length>0)
      {
        localStorage.setItem('escTechUsers',JSON.stringify(resultData.escTechUsers));

      }

      if(resultData.escCSMUsers.length>0)
      {
        localStorage.setItem('escCSMUsers',JSON.stringify(resultData.escCSMUsers));

      }*/

      localStorage.setItem('historyAvailable', resultData.historyAvailable);
      localStorage.setItem('superAdmin', this.superAdmin);

      let apiInfo = {
        'apiKey': Constant.ApiKey,
        'userId': this.userId,
        'domainId': this.domainId,
        'countryId': this.countryId,
        'escalationType': 1,
        'limit': 1,
        'offset': 0,
        'type': this.notificationType
      }

      this.notification.apiData = apiInfo;
      this.notification.getUserAppNotifications('');
    });
  }
  loadGetStartedPOPUP() {
    let urlVal = this.router.url;
    console.log(urlVal);
    // welcome popup show
    if (urlVal == '/landing-page') {
      if (this.popupVerified == '0') {
        localStorage.setItem('welcomePopupDisplay', '0');
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.bodyElem.classList.add('welcomepopup');
        const modalRef = this.modalService.open(WelcomeHomeComponent, { backdrop: 'static', keyboard: false, centered: true });
        let apiInfo = {
          'apiKey': Constant.ApiKey,
          'userId': this.userId,
          'domainId': this.domainId,
          'countryId': this.countryId
        }
        this.apiData = apiInfo;
        modalRef.componentInstance.data = this.apiData;
        modalRef.componentInstance.startedNextResponce.subscribe((receivedService) => {
          if (receivedService) {
            this.bodyElem.classList.remove('welcomepopup');
            modalRef.dismiss('Cross click');
            let data = {
              welcomePopupDisplay: '1'
            }
            console.log(data);
            this.sharedSvc.emitWelcomeContentView(data);
            console.log(data);
          }
        });
      }
      else {
        // welcome popup displayed
        console.log("no welcome popup");
        localStorage.setItem('welcomePopupDisplay', '1');
      }
    }
  }
  onSubmit() {
    //console.log(this.searchVal)
    this.searchForm.value.search_keyword = this.searchVal;
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    let searchLen = searchValue.length;
    if (searchLen == 0) {
      this.submitted = false;
      this.clearSearch();
    }
  }

  closeWindowHeader() {  
    this.sharedSvc.emitSearchEmptyValuetoHeader("");
    this.apiUrl.searchPageRedirectFlag = "1";  
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.remove('knowledge-base');
    this.bodyElem.classList.remove('search-page');
        
    let aurl = 'threads';
    let sNavUrl = localStorage.getItem('sNavUrl');
    aurl = (sNavUrl != null) ? sNavUrl : aurl;
             
    // title
    let url = aurl.split('/');
    let url1 = url[0];      
    if(url1 == 'announcements'){
      let title1 = localStorage.getItem('platformName');   
      let title2 = "";
      let url2 = url[1];  
      if(url2 == 'dismissed'){
        title2 = 'Dismissed Announcements';
      }
      else{
        title2 = 'Announcements';
      }              
      let title = title1+title2;
      this.titleService.setTitle(title); 
    }
    else if(url1 == 'profile'){
      let title1 = localStorage.getItem('platformName');   
      let title2 = "";
      let url2 = url[1];  
      title2 = ' - Profile';             
      let title = title1+title2;
      this.titleService.setTitle(title); 
    }
    else{      
      let title = localStorage.getItem('platformName');   
      let titleIndex = pageTitle.findIndex(option => option.slug == aurl);      
      title = `${title} - ${pageTitle[titleIndex].name}`;
      this.titleService.setTitle(title); 
    }      
    setTimeout(() => { 
      this.navigation.back(); 
    }, 600); 
         
  }

  // Submit Search
  submitSearch() {    
    if (this.searchVal && (this.access == 'threads' || this.access == 'sib' || this.access == 'documents' || this.access == 'knowledgeArticles' || this.access == 'parts' || this.access == 'landingpage' || this.access == 'announcement')) {
         
      this.apiUrl.searchFromPageNameClose = true;  
      switch(this.access){
        case 'sib':
          localStorage.setItem('searchValue', this.searchVal);  
          localStorage.setItem('currentContentType', '16');
          this.sharedSvc.setSearchPageLocalStorage(this.access, "");            
        break;
        case 'parts':
          localStorage.setItem('searchValue', this.searchVal);  
          localStorage.setItem('currentContentType', '11');  
          this.sharedSvc.setSearchPageLocalStorage(this.access, "");   
        break;
        case 'documents':
          localStorage.setItem('searchValue', this.searchVal);  
          localStorage.setItem('currentContentType', '4');
          this.sharedSvc.setSearchPageLocalStorage(this.access, "");   
        break;
        case 'knowledgeArticles':
          localStorage.setItem('searchValue', this.searchVal);            
          localStorage.setItem('currentContentType', '7');          
          this.sharedSvc.setSearchPageLocalStorage('knowledgearticles', "");
        break;
        case 'landingpage':        
          localStorage.setItem('searchValue', this.searchVal);
          localStorage.setItem('currentContentType', '2'); 
          this.search.emit(this.searchVal);  
          let urll = this.router.url.split('/');      
          this.sharedSvc.setSearchPageLocalStorage(urll[1], '');
          break;
        case 'announcement':
            let url = this.router.url.split('/');
            let url1 = url[1];      
            let url2 = url[2] == undefined ? '' : "/"+url[2];           
            let urlVal = url1 + url2;            
            localStorage.setItem('searchValue', this.searchVal);
            localStorage.setItem('currentContentType', '2'); 
            this.sharedSvc.setSearchPageLocalStorage(urlVal, '');
        break;
        case 'threads': 
          this.apiUrl.searchPageRedirectFlag = "1";         
          let data = {
            navPage: this.access, 
            searchVal: this.searchVal      
          }
          this.sharedSvc.emitSearchInfoData(data);
          localStorage.setItem('searchValue', this.searchVal);         
          localStorage.setItem('currentContentType', '2');                             
          break;
        default:
                            
        break;
      }  
      localStorage.setItem('search-router', 'true');    
      //this.search.emit(this.searchVal);   
      setTimeout(() => {
        var aurl = 'search-page';
        //clear field
        this.submitted = false;
        this.searchVal = '';
        this.searchTick = false;
        this.searchClose = this.searchTick;
        this.searchBgFlag = false;        
        this.searchImg = `${this.assetPath}/search-icon.png`;
        this.searchCloseImg = `${this.assetPath}/select-close.png`;
        //window.location.replace(aurl).focus();
        //localStorage.setItem('search-router', 'true');
        this.router.navigate([aurl]);
      }, 600);    
    }    
    else if (this.access == 'ppfr') {
      localStorage.setItem('escalationPPFRSearch', this.searchVal);
      this.searchBgFlag = true;
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.search.emit(this.searchVal);

    } else if (this.searchVal && this.access == 'search' || this.access == 'escalation-product') {
      this.searchBgFlag = true;
      this.searchImg = `${this.assetPath}/search-white-icon.png`;
      this.searchCloseImg = `${this.assetPath}/select-close-white.png`;
      this.search.emit(this.searchVal);
    }

    else{
      this.search.emit(this.searchVal);  
    }
    


  }

  // Clear Search
  clearSearch() {
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    this.search.emit(this.searchVal);
    localStorage.removeItem('loadMenuPageName');
    localStorage.removeItem('searchValue');
    localStorage.removeItem('escalationPPFRSearch');
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
  }

  // Change Password
  changePassword() {
    let apiData = {
      apiKey: Constant.ApiKey,
      userId: this.userId
    }
    const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.access = 'Change Password';
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
        this.logout();
      }, 3000);
    });
  }


  logout() {
    this.requestPermission(0);
    this.requestActivePageAccess(0);
    this.authenticationService.logout();
  }

  tapfrompopup(Item) {
    if (Item == 1) {
      var aurl = forumPageAccess.profilePage + this.userId;

      window.open(aurl, '_blank');
    }
    if (Item == 2) {
      aurl = forumPageAccess.configurationNotifyPage;

      window.open(aurl, '_blank');
    }
    if (Item == 3) {
      aurl = forumPageAccess.dashboardPage;

      window.open(aurl, '_blank');
    }
  }

  // recentVins
  recentVins() {
    let apiData = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      access: 'newthread'
    };
    let inputData = {
      baseApiUrl: Constant.CollabticApiUrl,
      apiUrl: Constant.CollabticApiUrl + "/" + Constant.getRecentVins,
      field: "vinNo",
      selectionType: "single",
      filteredItems: "",
      filteredLists: "",
      actionApiName: "",
      actionQueryValues: "",
      title: "Recent VINs"
    };
    const modalRef = this.modalService.open(ManageListComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.access = "newthread";
    modalRef.componentInstance.filteredTags = "";
    modalRef.componentInstance.filteredLists = "";
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService);
      modalRef.dismiss('Cross click');
    });
  }

  // selectContent
  selectLanguage() {
    let users = '';
    let apiData = {
      api_key: Constant.ApiKey,
      user_id: this.userId,
      domain_id: this.domainId,
      countryId: this.countryId
    };
    const modalRef = this.modalService.open(ManageUserComponent, { backdrop: 'static', keyboard: true, centered: true });
    modalRef.componentInstance.access = 'profile';
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = windowHeight.height;
    modalRef.componentInstance.action = 'new';
    modalRef.componentInstance.selectedUsers = users;
    modalRef.componentInstance.filteredUsers.subscribe((receivedService) => {
      console.log(receivedService);
      if (!receivedService.empty) {
        let langData = receivedService;
        console.log(langData.langId);
        console.log(langData.langName);
        this.languageId = langData.langId;
        this.languageName = langData.langName;
        localStorage.setItem('languageId', this.languageId);
        localStorage.setItem('languageName', this.languageName);
      }
      modalRef.dismiss('Cross click');
    });
  }

  close() {
    this.searchVal = '';
    //this.bodyElem.classList.remove(this.bodyClass);
    this.activeModal.dismiss('Cross click');
  }


     // On FileSelected
     changeBusinessLogo(){  
      this.bodyElem = document.getElementsByTagName('body')[0];  
      this.bodyElem.classList.add(this.bodyClass);  
      this.bodyElem.classList.add(this.bodyClass1);
      
      const modalRef = this.modalService.open(ImageCropperComponent, {backdrop: 'static', keyboard: false, centered: true});
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.domainId = this.domainId;
      modalRef.componentInstance.type = "Edit";
      modalRef.componentInstance.profileType = "businessProfile";      
      modalRef.componentInstance.updateImgResponce.subscribe((receivedService) => {
        if (receivedService) {
          //console.log(receivedService);
          this.bodyElem = document.getElementsByTagName('body')[0];
          this.bodyElem.classList.remove(this.bodyClass);  
          this.bodyElem.classList.remove(this.bodyClass1);
          modalRef.dismiss('Cross click');       
          this.platformLogo = receivedService.show;              
        }
      });
    }

   

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log(event);
    let removeClass = 'top-right-notifications-popup';
    if (document.body.classList.contains(removeClass)) {
      document.body.classList.remove(removeClass);
    }
    this.close();
  }

}
