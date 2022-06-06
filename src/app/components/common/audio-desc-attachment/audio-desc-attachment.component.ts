import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-audio-desc-attachment',
  templateUrl: './audio-desc-attachment.component.html',
  styleUrls: ['./audio-desc-attachment.component.scss']
})
export class AudioDescAttachmentComponent implements OnInit {

  @Output() audioItem: EventEmitter<any> = new EventEmitter();

  public audioUploadedFile: any[] = [];
  public audioAttachment: any[] = [];
  public chooseLable: string = "From PC";
  public invalidFile: boolean = false;
  public invalidFileErr: string = "";
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;

  constructor(
    private commonApi: CommonService
  ) { }

  ngOnInit(): void {
  }

  // On Select File Upload 
  onFileUpload(event) {
    console.log(event)
    this.audioUploadedFile = (this.audioUploadedFile == undefined) ? [] : this.audioUploadedFile;
    let file = event.target.files[0];
    let type = file.type.split('/');
    let type1 = type[1].toLowerCase();
    this.invalidFileErr = "";
    if(type1 == 'mp3' || type1 == 'mpeg'){
      this.OnUploadFile(file);
    }
    else{
      this.invalidFile = true;
      this.invalidFileErr = "Allow only mp3 file";
    }
  }

  OnUploadFile(file) {
    console.log(file)
    let fileAttachment = [];
    let fname = file.name;  
    let displayOrder = 0;
    let lastDot = fname.lastIndexOf('.');
    let fileName = fname.substring(0, lastDot);
    fileAttachment['fileId'] = 0;
    fileAttachment['accessType'] = 'upload';
    fileAttachment['accessTypeText'] = 'From PC';
    fileAttachment['fileType'] = file.type;
    fileAttachment['fileSize'] = file.size;
    fileAttachment['originalName'] = file.name;
    fileAttachment['originalFileName'] = file.name;
    fileAttachment['fileCaption'] = fileName;
    fileAttachment['captionFlag'] = false;
    fileAttachment['action'] = "new";
    fileAttachment['progress'] = 0;
    fileAttachment['cancelFlag'] = false;
    fileAttachment['valid'] = true;
    fileAttachment['language'] = "1";
    fileAttachment['itemValues'] = [];
    fileAttachment['selectedLang'] = [];
    fileAttachment['filteredLangItems'] = [];
    fileAttachment['filteredLangList'] = [];
    fileAttachment['flagId'] = 7;

    file['language'] = "1";
    file['fileCaption'] = fileName;
    file['captionFlag'] = false;
    file['displayOrder'] = 0;

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      let localUrl = event.target.result;  
      fileAttachment['audioFilePath'] = localUrl;            
    } 
    fileAttachment['thumbFilePath'] = `${this.mediaPath}/audio-medium.png`;
    fileAttachment['fileSize'] = this.commonApi.niceBytes(fileAttachment['fileSize']);      
    this.audioUploadedFile.push(file);
    fileAttachment['filePath'] = file['thumbFilePath'];
    fileAttachment['audioFilePath'] = fileAttachment['audioFilePath'];
    fileAttachment['uploadStatus'] = 0;
    console.log(fileAttachment)
    this.audioAttachment.push(fileAttachment);
    console.log(this.audioAttachment)
  }

}
