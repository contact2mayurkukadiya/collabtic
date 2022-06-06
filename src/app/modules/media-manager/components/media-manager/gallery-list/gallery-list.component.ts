import { Component, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { CommonService } from '../../../../../services/common/common.service';
import * as moment from 'moment';
import { Subscription } from "rxjs";

declare var $: any;
declare var lightGallery: any;

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss'],
  styles: [
    `.masonry-item { width: 148px; }
      .masonry-item {
        transition: top 0.5s ease-in-out, left 0.5s ease-in-out;
      }`
  ]
})
export class GalleryListComponent implements OnInit, OnDestroy {
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  @Output() toggleAction: EventEmitter<any> = new EventEmitter();
  @Output() mediaSelection: EventEmitter<any> = new EventEmitter();
  subscription: Subscription = new Subscription();

  public bodyElem;
  public mediaPath: string;
  public mediaManagerPath: string; 
  public mediaData: any;
  public mediaType: string;
  public mediaList: any;
  public mediaToggleClass: string;
  public mediaView: string;
  public mediaLoader: boolean = false;
  public displayNoRecords: boolean = false;
  public filterrecords: boolean = true;
  public updateMasonryLayout: boolean = false;
  public headerCheck: string = "";
  public scrollPos: any = 0;
  public bodyClass1: string = "parts-list";

  public lg: any;
  public mediaGallery: any;
  public lgTimeOut: number = 0.5;

  constructor(
    private commonApi: CommonService
  ) { }

  ngOnInit(): void {    
    this.subscription.add(
      this.commonApi.mediaDataReceivedSubject.subscribe((data) => {
        console.log(data)
        this.mediaData = data;
        if(this.mediaData.saveAccess){          
          if(this.mediaView == 'thumb') {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateMasonryLayout = true; 
            this.mediaData.saveAccess = false;                     
          }        
        }       
        this.mediaPath = this.mediaData.mediaPath;
        this.mediaManagerPath = this.mediaData.mediaManagerPath;
        this.mediaType = this.mediaData.mediaType;
        this.mediaView = this.mediaData.view;
        this.mediaList = this.mediaData.mediaList;
        this.headerCheck = this.mediaData.headerCheck;
        this.mediaToggleClass = (this.mediaData.expandFlag) ? 'expand-row' : 'collapse-row';
        this.mediaLoader = this.mediaData['loader'];
        this.displayNoRecords = (this.mediaList.length == 0 && !this.mediaLoader) ? true : false;        
        this.filterrecords = (this.mediaData.filterrecords) ? true : false;
        this.initMediaList();
        
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutStatusReceivedSubject.subscribe((r, r1 = "") => {
        let action = r['action'];
        let page = r['page'];
        console.log(r, action, page)
        switch(action) {
          case 'side-menu':
            if(page == 'media-manager') {
              if(!document.body.classList.contains(this.bodyClass1)) {
                document.body.classList.add(this.bodyClass1);
              }
              this.updateLayout();
            }
            break;
        }
      })
    );

    this.subscription.add(
      this.commonApi._OnLayoutChangeReceivedSubject.subscribe((r) => {
        this.updateLayout();
      })
    );
  }

  // Initialize Media List
  initMediaList() {
    if(!this.mediaLoader) {
      this.mediaLoader = true;
      for(let a in this.mediaList) {
        let ext = this.mediaList[a].fileExtension;
        console.log(this.mediaList[a])
        this.mediaList[a].fileCaption = (this.mediaList[a].fileCaption == '' || this.mediaList[a].fileCaption == undefined || this.mediaList[a].fileCaption == 'undefined') ? '' : this.mediaList[a].fileCaption;
        let caption = this.mediaList[a].fileCaption.split('.');
        let captionSplit = (caption.length > 1) ? caption[0] : this.mediaList[a].fileCaption;
        let captionTruncate = captionSplit.substring(0, 12) + '..';
        
        let attachmentType = this.mediaList[a].flagId;
        this.mediaList[a].galleryHidden = `video-${a}`;
        this.mediaList[a].galleryId = `#${this.mediaList[a].galleryHidden}`;
        this.mediaList[a].posterImg = "";
        this.mediaList[a].downloadUrl = "";
        this.mediaList[a].fileImg = this.mediaList[a].filePath;
        let createdDate = moment.utc(this.mediaList[a].createdOn).toDate(); 
        let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
        this.mediaList[a].createdOn = (this.mediaList[a].createdOn == "") ? '-' : localCreatedDate;
        this.mediaList[a].selectionMode = false;
        this.mediaList[a].activeMode = (this.mediaList[a].mediaId == this.mediaData.mediaId) ? true : false;
        this.mediaList[a].linkImg = 'default';

        if(attachmentType < 6) {
          this.mediaList[a].fileSize = this.commonApi.niceBytes(this.mediaList[a].fileSize);
          
        }
  
        switch(attachmentType) {
          case 1:
            this.mediaList[a].type = 'img';
            if(caption.length > 1) {
              captionTruncate = (captionSplit.length > 12) ? captionTruncate+'.'+ext : captionSplit;
            } else {
              captionTruncate = (captionSplit.length > 12) ? captionTruncate : captionSplit;
            }
            break;
          case 2:
            this.mediaList[a].type = 'video';
            let videoFilePath = "";
            this.mediaList[a].mime = 'video/mp4';
            let posterImg = this.mediaList[a].posterImage;
            videoFilePath = this.mediaList[a].filePath;
            this.mediaList[a].fileImg = "";
            this.mediaList[a].thumbFilePath = posterImg;
            this.mediaList[a].posterImg = posterImg;
            this.mediaList[a].videoUrl = videoFilePath;
            if(caption.length > 1) {
              captionTruncate = (captionSplit.length > 12) ? captionTruncate+'.mp4' : captionSplit;
            } else {
              captionTruncate = (captionSplit.length > 12) ? captionTruncate : captionSplit;
            }
            break;
          case 3:
            this.mediaList[a].type = 'audio';
            let audioFilePath = "";
            let audiothumb = 'assets/images/media/audio-thumb.png';
            audioFilePath = this.mediaList[a].filePath;
            this.mediaList[a].thumbFilePath = audiothumb;
            this.mediaList[a].fileImg = "";
            this.mediaList[a].posterImg = audiothumb;
            this.mediaList[a].audioUrl = audioFilePath;
            if(caption.length > 1) {
              captionTruncate = (captionSplit.length > 12) ? captionTruncate+'.mp3' : captionSplit;
            } else {
              captionTruncate = (captionSplit.length > 12) ? captionTruncate : captionSplit;
            }
            break;
          case 6:
            this.mediaList[a].fileSize = 'NA';
            let prefix = 'http://';
            this.mediaList[a].type = 'link';
            let logoImg = this.mediaList[a].thumbFilePath;
            let logo = (logoImg == "") ? 'assets/images/media/link-thumb.png' : logoImg;
            this.mediaList[a].linkImg = (logoImg == "") ? 'default' : 'logo';
            this.mediaList[a].linkType = 'site';
            let url = this.mediaList[a].filePath;
            if(url.indexOf("http://") != 0) {
              if(url.indexOf("https://") != 0) {
                url = prefix + url;
              }              
            }
  
            this.mediaList[a].link = url;
            this.mediaList[a].linkCaption = (this.mediaList[a].fileCaption == '') ? url : this.mediaList[a].fileCaption;
            this.mediaList[a].galleryCaption = (this.mediaList[a].fileCaption == '') ? '' : `<p>${this.mediaList[a].fileCaption}</p>`;
            this.mediaList[a].mediaCaption = this.mediaList[a].galleryCaption;
            captionTruncate = (this.mediaList[a].linkCaption > 12) ? this.mediaList[a].linkCaption+'..' : this.mediaList[a].linkCaption;
            let youtube = this.commonApi.matchYoutubeUrl(url);
            if(youtube) {
              this.mediaList[a].linkImg = "default";
              logo = '//img.youtube.com/vi/'+youtube+'/0.jpg';
              this.mediaList[a].thumbFilePath = logo;
              this.mediaList[a].logo = logo;
              this.mediaList[a].linkType = 'youtube';
            } else {
              let vimeo = this.commonApi.matchVimeoUrl(url);
              if(vimeo) {
                this.mediaList[a].linkImg = "default";
                let vlogo = this.vimeoLoadingThumb(vimeo, a);
                this.mediaList[a].linkType = 'video';
              } else {
                this.mediaList[a].galleryCaption += `<p><a href="${url}" target="_blank">${url}</a></p>`;
                this.mediaList[a].mediaCaption = this.mediaList[a].galleryCaption;
                this.mediaList[a].fileImg = logo;
                this.mediaList[a].thumbFilePath = logo;
                this.mediaList[a].logo = logo;
              }              
            }
            break;     
        }
        if(attachmentType < 6) {
          //this.mediaList[a].galleryCaption = captionTruncate; 
          this.mediaList[a].galleryCaption = this.mediaList[a].fileCaption; 
          this.mediaList[a].mediaCaption = captionTruncate; 
        }
      }

      setTimeout(() => {
        if((this.mediaList.length > 0 && this.mediaList.length <= 20 && !this.mediaData.mediaDetail) || this.mediaData.deleteAccess) {
          let i = 0;
          if(this.mediaData.mediaId > 0) {
            i = this.mediaList.findIndex(option => option.mediaId == this.mediaData.mediaId);
          }
          console.log(i+'::'+this.mediaData.mediaId+'::'+this.mediaList[i].mediaId)
          this.mediaInfo(i, this.mediaList[i].mediaId, 'init');
        } 
        if(this.mediaData.mediaId > 0 && this.mediaData.mediaDetail) {
          let mid = `m-${this.mediaData.mediaId}`;
          let secElement = document.getElementById('gallery');
          let element = document.getElementById(mid);
          setTimeout(() => {
            secElement.scrollTop = this.scrollPos;
          }, 100);          
        }
        this.bodyElem = document.getElementsByTagName('body')[0];
        if(this.mediaView == 'thumb') {
          setTimeout(() => {
            this.masonry.reloadItems();
            this.masonry.layout();
            this.updateMasonryLayout = true;            
          }, 2000);
        }
        this.initGallery();
      }, 500);
    }
  }

  // Light Gallery
  initGallery() {
    let gallery = this.mediaType;
    setTimeout(() => {
      this.lg = lightGallery(document.getElementById(gallery), {
        actualSize: true,
        autoplayFirstVideo:false,
        closable: false,
        download: true,
        escKey: false,
        loop: false,
        preload: 2,
        showAfterLoad: false,
        videojs: false,
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 1
        },
        vimeoPlayerParams: {
          byline : 0,
          portrait : 0,
          color : 'A90707'
        }
      });
    }, this.lgTimeOut);
  }

  // Getting vimeo video thumb
  vimeoLoadingThumb(id, index){    
    this.commonApi.getVimeoThumb(id).subscribe((response) => {
      let res = response[0];
      let thumb = res['thumbnail_medium'];
      this.mediaList[index]['thumbFilePath'] = thumb;
      this.mediaList[index]['logo'] = thumb;      
    });
  }

  // Media Selection
  mediaSelect(index, mid, flag) {
    setTimeout(() => {
      this.hideGallery('callback');
    }, this.lgTimeOut);
    this.mediaList[index].selectionMode = !flag;
    let data = {
      action: (flag) ? 0 : 1,
      callback: this.mediaType,
      mid: mid
    };
    this.mediaSelection.emit(data);
  }

  // Media Info
  mediaInfo(index, mid, type) {
    let smid = document.getElementById('gallery');
    this.scrollPos = smid.scrollTop;
    for(let m of this.mediaList) {
      m.selectionMode = false;
      m.activeMode = false;
    }
    this.mediaList[index].activeMode = true;
    setTimeout(() => {
      //this.hideGallery('callback');
    }, this.lgTimeOut);

    let data = {
      type: (this.mediaData.deleteAccess) ? 'get' : type,
      access: this.mediaType,
      action: false,
      mid: (this.mediaData.deleteAccess) ? 0 : mid
    }
    this.toggleAction.emit(data);
  }

  // Hide Gallery
  hideGallery(action) {
    let timeout = (action == 'callback') ? 0 : this.lgTimeOut;
    setTimeout(() => {
        $('.lg-backdrop, .lg-outer').remove();
        this.bodyElem.classList.remove('lg-on');    
    }, timeout);    
  }

  // Update Masonry Layout
  updateLayout() {
    this.updateMasonryLayout = true;
    setTimeout(() => {
      this.updateMasonryLayout = false;
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}