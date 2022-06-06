import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
declare var lightGallery: any;

@Component({
  selector: 'app-audio-attachment-view',
  templateUrl: './audio-attachment-view.component.html',
  styleUrls: ['./audio-attachment-view.component.scss']
})
export class AudioAttachmentViewComponent implements OnInit {
  @Input() action: string;
  @Input() attachments: any = [];
  @Input() dynamicGid:number = 0;

  public units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  public newGallery: any;
  public editGallery: any;
  public viewGallery: any;
  public lgTimeOut: number = 10;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public audioThumb: string = `${this.mediaPath}/audio-medium.png`;
  public defLang: any = [];
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};
  
  constructor(
    private config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }

  ngOnInit(): void {
    for(let a in this.attachments) {
      console.log(this.attachments[0])
      this.attachments[a]['iframe'] = false;
      this.attachments[a].validError = false;
      let attachmentType = this.attachments[a].flagId;
      let mediaId = this.attachments[a].mediaId;
      if(this.action == 'view' || this.action == 'attachments') {
        this.attachments[a].flagId = parseInt(attachmentType);
        let fileSize = this.niceBytes(this.attachments[a].fileSize);
        this.attachments[a].fileSize = fileSize;  
        this.attachments[a]['galleryHidden'] = `video-${this.action}-${a}`;
        //this.attachments[a]['galleryCaption'] = (this.attachments[a]['fileCaption'] == null) ? 'Audio Description' : this.attachments[a]['fileCaption'];
        this.attachments[a]['galleryCaption'] = 'Audio Description';
        this.attachments[a]['galleryId'] = `#${this.attachments[a]['galleryHidden']}`;
        this.attachments[a]['posterImg'] = "";
        this.attachments[a]['downloadUrl'] = "";
        this.attachments[a]['fileImg'] = this.attachments[a]['filePath'];
        if(this.action == 'attachments') {
          let lang = this.attachments[a]['languageOptions'];
          this.attachments[a]['itemValues'] = [];
          this.attachments[a]['selectedLang'] = [];
          this.attachments[a]['filteredLangItems'] = [];
          this.attachments[a]['filteredLangList'] = [];
          if(lang.length > 0) {
            this.attachments[a].itemValues = lang;
            let id = [];
            let name = [];
            for(let i of lang) {
              id.push(i.id);
              name.push(i.name);
            }
            this.attachments[a].filteredLangItems = id;
            this.attachments[a].filteredLangList = name;
            this.attachments[a].selectedLang = name;
          }
        }
        switch(attachmentType) {
          case 7:
            this.attachments[a]['type'] = 'audio';
            let audioFilePath = "";
            let audiothumb = this.audioThumb;
            if(this.action != 'view' && this.action != 'attachments') {            
              audioFilePath = this.attachments[a]['filePath'];            
              this.attachments[a]['audioUrl'] = audioFilePath;  
            } else {
              audioFilePath = this.attachments[a]['filePath'];            
              this.attachments[a]['audioUrl'] = audioFilePath;
            }        
            this.attachments[a]['fileImg'] = "";
            this.attachments[a]['thumbFilePath'] = audiothumb;
            this.attachments[a]['posterImg'] = audiothumb;
            break;
        }
      }
    }
    this.showGallery(this.action,this.dynamicGid);
  }

  // Show Gallery
  showGallery(type,id) {
    let timeout;
    let gallery;
    console.log(type)
    switch (type) {
      case 'edit':
      case 'attachments':
        timeout = (type == 'edit') ? 0 : this.lgTimeOut;
        gallery = 'audioEditGallery';
        break;
      default:
        timeout = (type == 'gview') ? 0 : this.lgTimeOut;
        gallery = 'audioGallery_'+id;
        break;
    }
    setTimeout(() => {
      console.log(gallery);
      var lg = document.getElementById(gallery);
      
      lightGallery(lg, {
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

      var alg = document.getElementById(gallery);
      if(alg) {
        alg.addEventListener('onAfterSlide', function(event){
          let index = event['detail'].index;
          let elm = `lg-${index}`;
          let chkElem = document.getElementById(elm); 
          if(chkElem && chkElem.classList.contains('lg-4')) {
            let iframeCont = document.getElementsByClassName('lg-video-cont');
            if(iframeCont) {
              iframeCont[0].classList.add('iframe');
              let thumb = document.getElementsByClassName('lg-thumb-outer');
              if(thumb) {
                //thumb[0].classList.add('hide');
              }
              let subHtml = document.getElementsByClassName('lg-sub-html');
              if(subHtml) {
                subHtml[0].classList.add('hide');
              }
            }
          }
        }, false);
      }
    }, timeout);
  }

  // Convert File Size
  niceBytes(x){
    let l = 0, n = parseInt(x, 10) || 0;
  
    while(n >= 1024 && ++l){
        n = n/1024;
    }
    //include a decimal point and a tenths-place digit if presenting 
    //less than ten of KB or greater units
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l]);
  }

}
