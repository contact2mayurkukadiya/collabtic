import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../../../image-cropper/interfaces/index';
import {base64ToFile} from '../../../image-cropper/utils/blob.utils';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { ApiService } from '../../../services/api/api.service';
import { Constant } from '../../../common/constant/constant';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, OnDestroy {

  @Input() userId; 
  @Input() domainId;
  @Input() type;
  @Input() fromPage;
  @Input() profileType;
  @Output() updateImgResponce: EventEmitter<any> = new EventEmitter();

  public bodyElem;
  public bodyClass:string = "auth";
  public bodyClass1:string = "profile-certificate";
  public bodyClass2:string = "image-cropper";
  public title: string = "";
  public footerElem;
  public bodyHeight: number; 
  public innerHeight: number;
  public fileSize: number = 2000;
  public currentfileSize: number = 0;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  public fileName: any = '';
  public invalidFileErr: string = '';
  public invalidFile: boolean = false;
  public loading: boolean = false;
  public selectImgError: boolean = true;
  public selectImgErrorMsg:string = 'Not Supported';
  public cropImgLoad: boolean = false;

  // Resize Widow
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();    
  }


  constructor(
    private authenticationService: AuthenticationService, 
    private apiUrl: ApiService,
    private httpClient: HttpClient,
    public activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {

    
    this.bodyElem = document.getElementsByTagName('body')[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.bodyElem.classList.add(this.bodyClass1);
    
    this.selectImgError = false;
    this.selectImgErrorMsg = '';

    if(this.profileType == 'businessProfile'){
      this.title = "Logo";
    }
    else{
      this.title = "Profile Picture";
    }

    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();

  }

  // Set Screen Height
  setScreenHeight() {    
    this.innerHeight = (this.bodyHeight - 130 );  
  }

    
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;    
    
    let selectFile = event.target.files[0];
    let name = selectFile.name.split('.');
    this.fileName = name[0]+".png";
    console.log(this.fileName);
    console.log(selectFile.size);
    this.currentfileSize = Math.round((selectFile.size / 1024));   
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    if(this.currentfileSize > this.fileSize){
      this.loading = false;
      this.invalidFile = true;
      if(this.profileType == 'businessProfile'){
        this.invalidFileErr = "Please upload logo below 2MB";
        this.cropImgLoad = false;        
      }
      else{
        this.invalidFileErr = "Please upload image below 2MB";
        this.cropImgLoad = false;       
      }
    }
    else{
      this.showCropper = true;
      this.cropImgLoad = true;
      console.log('Image loaded');
      this.selectImgError = false;
      this.selectImgErrorMsg = '';
    }         
  }

  cropperReady(sourceImageDimensions: Dimensions) {
      console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
      console.log('Load failed');
      this.selectImgError = true;
      this.selectImgErrorMsg = 'Not Supported';
  }

  rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
  }

  rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
  }

  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }


  flipHorizontal() {
      this.transform = {
          ...this.transform,
          flipH: !this.transform.flipH
      };
  }

  flipVertical() {
      this.transform = {
          ...this.transform,
          flipV: !this.transform.flipV
      };
  }

  resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
  }

  zoomOut() {
      this.scale -= .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  zoomIn() {
      this.scale += .1;
      this.transform = {
          ...this.transform,
          scale: this.scale
      };
  }

  toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
      this.transform = {
          ...this.transform,
          rotate: this.rotation
      };
  }
  

  uploadFile(){
    this.loading = true;
    const block = this.croppedImage.split(";");
    const contentType = block[0].split(":")[1];
    const realData = block[1].split(",")[1];
    const blob = this.b64toBlob(realData, contentType);   
    const imageFile = new File([blob], this.fileName, {type: contentType});
    console.log(imageFile); 
    if(this.fromPage == "chat-page")
    { 
      this.updateImgResponce.emit(imageFile);
    }else{
      this.OnUploadFile(imageFile); 
    }
    

  }

  b64toBlob(realData, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(realData);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays);

    return blob;
  }

  OnUploadFile(imageFile) {
    let countryId = localStorage.getItem('countryId') == null || localStorage.getItem('countryId') == undefined ? '' : localStorage.getItem('countryId');
    const formData = new FormData();
    console.log(imageFile);
    formData.append('file', imageFile);
    formData.append('user_id', this.userId );
    formData.append('domainId', this.domainId );
    formData.append('countryId', countryId );
    // business logo
    if(this.profileType == 'businessProfile'){
      formData.append('businessProfile', '1' );
    } 

    let serverUrl = this.apiUrl.apifileUpload();    
     this.httpClient.post<any>(serverUrl, formData)
    .subscribe(res => {
      console.log(res);
      if(res.status=='Success'){ 
        this.loading = false; 
        var imgData = {
          'show':this.croppedImage,
          'response':res.data
        }       
        this.updateImgResponce.emit(imgData);   
      }
      else{
        this.loading = false;
        this.invalidFile = true;
        this.invalidFileErr = res.data;             
      }
      console.log(res);            
    },
    (error => {
      this.loading = false;
      this.invalidFile = true;
      this.invalidFileErr = error;           
    })
    );
  }

  ngOnDestroy() {    
    this.bodyElem.classList.remove(this.bodyClass1);
    this.bodyElem.classList.remove(this.bodyClass2);
  }



}
