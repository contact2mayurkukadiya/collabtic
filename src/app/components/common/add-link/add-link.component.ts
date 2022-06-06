import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { MediaManagerService } from '../../../services/media-manager/media-manager.service';
import { NgbModal, NgbModalConfig, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { Constant } from '../../../common/constant/constant';
import { ThreadPostService } from '../../../services/thread-post/thread-post.service';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss']
})
export class AddLinkComponent implements OnInit {

  @Input() reminderPOPUP: string= '';
  @Input() threadId: string = '';
  @Input() groups: string= '';
  @Input() editData: string= '';
  @Input() access: string= '';
  @Input() workstreams: any = [];
  @Output() confirmAction: EventEmitter<any> = new EventEmitter();
  @Output() mediaServices: EventEmitter<any> = new EventEmitter();

  public domainId;
  public userId;
  public countryId;
  public title: string = "Add Link";
  public action: string = "";
  public actionId: any = "";
  public link: string = "";
  public caption: string = "";
  public description: string = "";
  public score: number;
  public errTxt: string = "";
  public maxLen: number = 100;

  public addLinkFlag:boolean = false;
  public editLinkFlag:boolean = false;
  public addReminderFlag:boolean = false;
  public addScoreFlag:boolean = false;
  public attachmentView: boolean = false;
  uploadFileLength: number;
  linkForm: FormGroup;
  reminderForm: FormGroup;
  public linkSubmitted: boolean = false;
  public submitted1: boolean = false;
  uploadedFiles: any[] = [];
  filesArr: any;
  attachments: any[] = [];
  progressInfos = [];
  public user: any;
  public reminderFlag:boolean = false;
  public techSummitFlag:boolean = false;
  public scoreInvalidValue:boolean = false;
  public assetPath: string = "assets/images";
  public mediaPath: string = `${this.assetPath}/media`;
  public linkThumb: string = `${this.mediaPath}/link-medium.png`;
  public linkError: boolean = false;
  public linkErrorMsg: string ='';

  constructor(
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private mediaApi: MediaManagerService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    public activeModal: NgbActiveModal,
	private authenticationService: AuthenticationService,
  private threadPostService: ThreadPostService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
   }

  // convenience getters for easy access to form fields
  get f() { return this.linkForm.controls; }

  // convenience getters for easy access to form fields
  get s() { return this.reminderForm.controls; }

  ngOnInit(): void {
     
    console.log(this.reminderPOPUP);
    if(this.reminderPOPUP == "Reminder"){ 
        this.reminderFlag = true;

        this.reminderForm = this.formBuilder.group({
          description: [this.description, []],          
        });
        
    }
    else if(this.reminderPOPUP == "TechSummitScore"){ 
      this.techSummitFlag = true;

      this.reminderForm = this.formBuilder.group({
        score: [this.score, [Validators.required]]      
      });
      
  }
    else{      
      if(this.access == 'Edit Link'){
        this.editLinkFlag = true;       
        this.link = this.editData['linkData'];
        this.caption = this.editData['captionData'];               
        this.title = this.access;
      }      
      this.linkForm = this.formBuilder.group({
        link: [this.link, [Validators.required]],
        caption: [this.caption, []],
        //description: [this.description, [Validators.required]]
      });
    }

	this.user = this.authenticationService.userValue;
	this.domainId = this.user.domain_id;
	this.userId = this.user.Userid;
	this.countryId = localStorage.getItem('countryId');
  
  }

  // Cancel Action
  cancelAction() {
    let data = {
      action: false
    };
    this.confirmAction.emit(data);
  }

  // Add Link
  editLink() {

    this.linkSubmitted = true;
    this.linkError = false;
    this.linkErrorMsg = '';

    if (this.linkForm.invalid) {  
      this.addLinkFlag  = false;
      return;
    }   

    let  val = this.linkForm.value.link;
    let valid = (val.length > 0) ? true : false;     
    let url = this.isValidURL(val);
    valid = url;          
    if(valid) {       
      let data = new FormData();
      data.append('apiKey', Constant.ApiKey);
      data.append('link', this.link);	
      data.append('domainId', this.domainId);
      this.commonApi.getSiteLogo(data).subscribe((response) => {
        
        console.log(response);
        this.addLinkFlag  = false;

        let logo = (response.linkImg != "") ? response.linkImg : this.linkThumb;  
        
        let editData = {
          linkData: this.link,
          captionData: this.linkForm.value.caption,
          logoData: logo
        } 
        this.mediaServices.emit(editData); 
        
      });   
    } else {
      this.addLinkFlag  = false;
      this.linkError = true;
      this.linkErrorMsg = 'Invalid Url';
      let logo = this.linkThumb;        
    } 
          
  }

   // Add Link
  addLink() {
    this.linkSubmitted = true;
    this.linkError = false;
    this.linkErrorMsg = '';

    if (this.linkForm.invalid) {  
      this.addLinkFlag  = false;
      return;
    }
    
    let valid = this.isValidURL(this.linkForm.value.link);             
    if(!valid) { 
      this.linkError = true;
      this.addLinkFlag  = false;
      return;
    }
    
    this.addLinkFlag = true;    
    let mediaData = new FormData();
    
    mediaData.append('apiKey', Constant.ApiKey);
    mediaData.append('domainId', this.domainId);
    mediaData.append('countryId', this.countryId);
    mediaData.append('userId', this.userId);
    mediaData.append('workstreams', JSON.stringify(this.workstreams))

    mediaData.append('linkUrl', this.linkForm.value.link);
    mediaData.append('fileCaption', this.linkForm.value.caption);
    //mediaData.append('description', this.linkForm.value.description);

    mediaData.append('uploadCount', '1');
    mediaData.append('uploadFlag', 'true');
    mediaData.append('type', 'link');
    mediaData.append('platform', '3');
    mediaData.append('displayOrder', '1');
    
    this.mediaApi.getMediaUploadURL(mediaData).subscribe((response) => {     
      if(response.status == 'Success') {
        this.addLinkFlag  = false; 
        this.mediaServices.emit(response);         
      } 
      else{
        this.addLinkFlag  = false;        
      }
    });    
  }

  addReminder(){
    
    this.addReminderFlag = true;    
    let apiData = new FormData();
    
    apiData.append('apiKey', Constant.ApiKey);
    apiData.append('domainId', this.domainId);
    apiData.append('countryId', this.countryId);
    apiData.append('userId', this.userId);
    apiData.append('threadId', this.threadId);
    apiData.append('scorePoint', this.reminderForm.value.description);

    this.threadPostService.addReminderAPI(apiData).subscribe((response) => {     
      if(response.status == 'Success') {        
        this.addScoreFlag  = false; 
        this.mediaServices.emit(response);         
      } 
      else{
        this.addScoreFlag  = false;        
      }
    });    
  }

  addScore(){
    
    this.submitted1 = true;

    if (this.reminderForm.invalid) {  
      this.addScoreFlag  = false;
      return;
    }   
    
    this.addScoreFlag = true;    
    let apiData = new FormData();
    
    apiData.append('apiKey', Constant.ApiKey);
    apiData.append('domainId', this.domainId);
    apiData.append('countryId', this.countryId);
    apiData.append('userId', this.userId);
    apiData.append('threadId', this.threadId);
    apiData.append('scorePoint', this.reminderForm.value.score);
    apiData.append('groups', this.groups);
    apiData.append('closeStatus', 'yes');
    apiData.append('emailFlag', '1'); 

    console.log(this.reminderForm.value.score);
    console.log(this.groups);

    this.threadPostService.closeThread(apiData).subscribe(response => {      
      if(response.status == 'Success') {        
        this.addReminderFlag  = false; 
        this.mediaServices.emit(response);         
      } 
      else{
        this.addReminderFlag  = false;        
      }
    });   
  }

  // Only Integer Numbers
  keyPressNumbers(event) {    
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      this.addScoreFlag  = false;
      this.scoreInvalidValue = false;
      this.submitted1 = false;
      return true;
    }
  }

  // Check valid url
  isValidURL(url) {
    if (url!= '' && !/^(?:f|ht)tps?\:\/\//.test(url)) {
      this.link = "https://" + url; 
      url =  "https://" + url;            
    }
    else{
      this.link = url;
      url = url;
    }    
    var regexp = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);  
    //let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/; 
    if (regexp.test(url)) { 
      console.log(url+"url true");
      return true; 
    } else { 
      console.log(url+"url false");
      return false; 
    } 
  }

}
