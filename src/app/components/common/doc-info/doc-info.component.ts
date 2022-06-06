import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { CommonService } from '../../../services/common/common.service';
import { DocumentationService } from 'src/app/services/documentation/documentation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Constant, IsOpenNewTab, windowHeight } from '../../../common/constant/constant';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-doc-info',
  templateUrl: './doc-info.component.html',
  styleUrls: ['./doc-info.component.scss']
})
export class DocInfoComponent implements OnInit, OnDestroy {
  @Input() docDetail: any = [];
  @Output() toggleAction: EventEmitter<any> = new EventEmitter();
  public sconfig: PerfectScrollbarConfigInterface = {};
  subscription: Subscription = new Subscription();
  
  @Input() infoLoading: boolean;
  public infoFlag: boolean = true;
  public actionFlag: boolean = false;
  public defaultBanner: boolean = true;
  public submitDocLoading = false;
  public teamSystem = localStorage.getItem('teamSystem');

  public bodyElem;
  public bodyHeight: number = 0;
  public innerHeight: number = 0;
  public innerInfoHeight: number = 0;
  public countryId;
  public platformId;
  public domainId = 1;
  public userId: any;
  public roleId: any;
  public contributedId: any;
  public assetPath: string = "assets/images";
  public assetDocPath: string = `${this.assetPath}/documents/`;
  public bannerImg: string = `${this.assetDocPath}default-banner.png`;
  public mediaPath: string = `${this.assetPath}/media`;
  public audioThumb: string = `${this.mediaPath}/audio-medium.png`;
  public videoThumb: string = `${this.mediaPath}/video-medium.png`;
  public linkThumb: string = `${this.mediaPath}/link-medium.png`;
  public action:string = "view";
  public linkClass: string = "default";
  public bannerClass: string = "media";
  public docId: any = 0;
  public title: string = "";
  public desc: string = "";
  public descLength: number = 0;
  public descToggle: boolean = false;
  public descToggleText: string = "More";
  public mfgVal = "";
  public makeVal = "";
  public modelVal = [];
  public yearVal = [];
  public tagVal = [];
  public attachments: any = [];

  public editFlag: boolean = false;
  public likeFlag: boolean = true;
  public likeCount: number = 0;
  public likeStatus: number = 0;
  public pinCount: number = 0;
  public pinStatus: number = 0;
  public viewCount: number = 0;
  public shareCount: number = 0;

  constructor(
    private router : Router,
    private authenticationService: AuthenticationService,
    private commonApi: CommonService,
    private documentationService: DocumentationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyHeight = window.innerHeight;
    this.countryId = localStorage.getItem('countryId');
    this.platformId = localStorage.getItem('platformId');
    let user: any = this.authenticationService.userValue;
    if (user) {
      this.domainId = user.domain_id;
      this.userId = user.Userid;
      this.roleId = user.roleId;
    }
    console.log(this.router.url);
    console.log(this.docDetail)
    if(Object.keys(this.docDetail).length > 0) {
      this.setupDocData(this.docDetail);
    }
    
    let emptyFile = localStorage.getItem('docEmpty');
    if(emptyFile != 'undefined' || emptyFile != undefined) {
      //this.infoLoading = false;
    }

    this.subscription.add(
      this.commonApi.documentInfoDataReceivedSubject.subscribe(response => {
        console.log(response);
        this.bannerImg = `${this.assetDocPath}default-banner.png`;
        this.bannerClass = 'media';
        let loading: boolean = response['loading'];
        this.infoLoading = loading;
        let action = response['action'];
        let docData = response['docData'];

        switch(action) {
          case 'load':
          case 'loadInfo':
            console.log(docData, this.docDetail)
            setTimeout(() => {
              this.setupDocData(docData);
            }, 150);          
            break;
          case 'callback':
              this.docDetail = docData;
              this.infoLoading = false;
              let data = {
                access: 'infocallback',
                docData: this.docDetail,
                flag: false
            }
            this.commonApi.emitDocumentPanelFlag(data);
            break;  
          case 'empty':
            this.docDetail = [];
            this.infoLoading = false;
            let infoData = {
              access: 'documents',
              flag: false,
              docData: []
            }
            if(this.router.url == '/workstreams-page') {
              this.toggleInfo(this.infoFlag, action);
            } else {
              this.commonApi.emitDocumentPanelFlag(infoData);
            }
            break;  
        }      
      })
    );
  }

  // Setup Document Data
  setupDocData(docData) {
    console.log(docData, Object.keys(docData).length)
    if(Object.keys(docData).length > 0) {
      //let banner = docData.equipmentImg;
      let banner = '';
      let attachments = docData.uploadContents;
      attachments = (attachments == undefined || attachments == 'undefined') ? [] : attachments
      this.defaultBanner = (banner == '' && attachments.length == 0) ? true : false;
      console.log(this.userId, docData.contributerId, this.roleId)
      this.editFlag = (this.userId == docData.contributerId || this.roleId == 3) ? true : false;
      if(attachments.length > 0) {
        let attachment = attachments[0];
        let type = attachment.flagId;
        let caption = attachment.fileCaption;
        attachment.fileCaption = (caption == 'undefined' || caption == undefined) ? attachment.originalName : caption;
        switch(type) {
          case 3:
            this.bannerClass = 'audio';
            banner = this.audioThumb;
            break;
          case 4:
          case 5:
            let docClass = 'doc';
            let docThumb;
            let fileExt = 'png';
            let ext = attachment.fileExtension.toLowerCase();
            console.log(ext)
            switch (ext) {
              case 'pdf':
                this.bannerClass = `${docClass} pdf`;
                docThumb = 'pdf-medium';
                break;
              case 'xlsx':
              case 'xls':
                docThumb = 'xls-medium';
                this.bannerClass = `${docClass} xls`;
                break;
              case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
              case 'docx':
              case 'doc':
              case 'msword':  
                docThumb = 'doc-medium';
                this.bannerClass = `${docClass} doc`;
                break;
              case 'pptx':
              case 'ppt':
                docThumb = 'ppt-medium';
                this.bannerClass = `${docClass} ppt`;
                break;
              case 'txt':
                docThumb = 'txt-medium';
                break;
              case 'zip':
                docThumb = 'zip-medium';
                this.bannerClass = `${docClass} zip`;
                break;
			        case 'exe':
                docThumb = 'exe-medium';
                this.bannerClass = `${docClass} exe`;
                break;
              default:
                docThumb = 'unknown-thumb';
                this.bannerClass = `${docClass}`;
                break;
            }
            banner = `${this.mediaPath}/${docThumb}.${fileExt}`;
            break;    
          case 6:
            //this.bannerClass = 'banner-link';
            let prefix = 'http://';
            let logoImg = attachment.thumbFilePath;
            let logo = (logoImg == "") ? 'assets/images/media/link-thumb.png' : logoImg;
            this.linkClass = (logoImg == "") ? 'default' : 'logo';
            let url = attachment.filePath;
            if(url.indexOf("http://") != 0) {
              if(url.indexOf("https://") != 0) {
                url = prefix + url;
              } 
            }
            let youtube = this.commonApi.matchYoutubeUrl(url);
            if(youtube) {
              this.bannerClass = "youtube";
              this.linkClass = "default";
              banner = '//img.youtube.com/vi/'+youtube+'/0.jpg';
            } else {
              this.linkClass = "default";
              let vimeo = this.commonApi.matchVimeoUrl(url);
              if(vimeo) {
                this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
                  let res = response[0];
                  banner = res['thumbnail_medium'];
                });
              } else {
                this.bannerClass = 'banner-link';
                banner = logo;
              }
            }
            break;
          default:
            banner = (type == 1) ? attachment.thumbFilePath : attachment.posterImage;
            break;  
        }
      } else {
        banner = this.bannerImg;
      }

      this.bannerImg = banner;
      this.docId = docData.resourceID;
      this.title = docData.title;
      let desc = docData.description;
      desc = (desc == 'undefined' || desc == undefined) ? '' : desc;
      this.descLength = desc.replace(/<(?:.|\n)*?>/gm, '').length;
      this.descToggle = (this.descLength > 90) ? true : false;
      //desc = this.authenticationService.convertunicode(this.authenticationService.ChatUCode(desc));
      //desc = this.authenticationService.ChatUCode(desc)
      desc= this.authenticationService.convertunicode(this.authenticationService.ChatUCode(desc));
      desc = this.sanitizer.bypassSecurityTrustHtml(desc);
      this.desc = desc;      
      //this.desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
      console.log(desc);      
      this.descToggleText = "More";
      let genricInfo = docData.makeModelsNew;
      genricInfo = (genricInfo === 'undefined' || genricInfo === undefined) ? [] : genricInfo;
      let isGeneral = (docData.isGeneral == 1) ? true : false;
      this.mfgVal = (genricInfo.length >= 0 && !isGeneral && docData.manufacturer != '') ? docData.manufacturer : '';
      this.makeVal = (genricInfo.length == 0) ? '' : (isGeneral) ? docData.make : genricInfo[0].genericProductName;
      this.modelVal = (isGeneral || genricInfo.length == 0) ? [] : docData.modelList;
      let year = (genricInfo.length == 0) ? '' : genricInfo[0].year;
      year = (year.length == 1 && year[0] == 0) ? [] : year;
      this.yearVal = (isGeneral) ? [] : year;
      this.tagVal = docData.tags;
      this.attachments = docData.uploadContents;
      this.likeCount = docData.likeCount;
      this.likeStatus = docData.likeStatus;
      this.pinCount = docData.pinCount;
      this.pinStatus = docData.pinStatus;
      this.viewCount = docData.viewCount;
      this.shareCount = docData.shareCount;
      this.contributedId = docData.contributedId;
      this.likeFlag = (this.userId == this.contributedId) ? false : true;

      setTimeout(() => {
        this.docDetail = docData;
        this.infoLoading = false;
        this.setScreenHeight();
      }, 500);
    }
  }

  // Set Screen Height
  setScreenHeight() {
    //let headerHeight = 0;
    if(!this.teamSystem) {
      //headerHeight = document.getElementsByClassName('prob-header')[0].clientHeight;
    }
    //let footerHeight = document.getElementsByClassName('footer-content')[0].clientHeight; 
    //this.innerInfoHeight = (this.bodyHeight-(headerHeight+footerHeight+30));  
    //this.innerInfoHeight = (this.bodyHeight > 1420) ? 980 : this.innerInfoHeight;
    //this.innerInfoHeight = this.innerInfoHeight-90;
    setTimeout(() => {
      let headerHeight = document.getElementsByClassName('info-head-row')[0].clientHeight;
      let infoHeight = 190;
      this.innerInfoHeight = infoHeight+headerHeight;
    }, 50);
  }

  // Toogle Media Info
  toggleInfo(flag, access) {
    if(!this.infoLoading) {
      let data = {
        access: access,
        action: flag,
        docDetail: this.docDetail
      };
      console.log(data)
      this.toggleAction.emit(data);
    }    
  }

  // Description Toogle
  toggleDesc(flag) {
    this.descToggle = !flag;
    this.descToggleText = (flag) ? "Less" : "More";
  }

  // Social Action
  socialActions(type, typeStatus) {
    console.log(this.docId, type, typeStatus);
    let status = '';
    let inc = 1;
    let actionFlag = true;
    switch(type) {
      case 'like':
        actionFlag = this.likeFlag 
        if(actionFlag) {
          status = (typeStatus == 0) ? 'liked' : 'disliked';
          this.likeStatus = (typeStatus == 0) ? 1 : 0;
          this.likeCount = (typeStatus == 0) ? this.likeCount+inc : this.likeCount-inc; 
        }        
        break;
      case 'pin':
        status = (typeStatus == 0) ? 'pined' : 'dispined';
        this.pinStatus = (typeStatus == 0) ? 1 : 0;
        this.pinCount = (typeStatus == 0) ? this.pinCount+inc : this.pinCount-inc; 
        break;
    }
    console.log(this.docId, type, status)
    if(actionFlag) {
      this.documentationService.addLikePins(this.userId, this.domainId, this.countryId, this.docId, type, status).then((response: any) => {});
    }    
  }

  // Manage Document Navigation
  docAction() {
    let nav = `documents/manage/edit/${this.docId}`;
    localStorage.setItem('docNav', 'documents');
    if(this.teamSystem) {
      window.open(nav, IsOpenNewTab.teamOpenNewTab);
    } else {
      //let newWindow = window.open(nav, nav);
	    //newWindow.focus();
      this.router.navigate([nav]);
    }
  }
  
  viewMore(){
    let navFrom = this.commonApi.splitCurrUrl(this.router.url);
    let wsFlag: any = (navFrom == ' parts') ? false : true;
    let scrollTop:any = 0;
    localStorage.setItem('docId', this.docId);
    localStorage.setItem('docInfoNav', 'true');
    this.commonApi.setListPageLocalStorage(wsFlag, navFrom, scrollTop);
	  let nav = `documents/view/${this.docId}`;
	  this.router.navigate([nav]);
  }

  ngOnDestroy() {
    this.bannerImg = "";
    this.subscription.unsubscribe();
  }

}
