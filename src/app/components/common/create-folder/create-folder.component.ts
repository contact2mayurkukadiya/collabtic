import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LandingpageService } from '../../../services/landingpage/landingpage.service';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit {
  @Input() apiData: any = [];
  @Input() actionInfo: any = [];
  @Output() emitResponse: EventEmitter<any> = new EventEmitter();
 
  changePasswordForm: FormGroup;
  public invalidOldPwdMsg: string = "";
  public invalidMsgFlag = false;
  public strlengthforuser:string ='0';
  public NewFolderNumberLenth:string ='30';
  public enterTxt: string = "Enter";
  public textfolderName: string = "Folder Name";
  public cpFormData = new FormData();
  public submitLoading: boolean = false;
  public submitFlag: boolean = false;
  public invalidMsg: String = "";
  public opwdFieldTextType: boolean = false;
  public npwdFieldTextType: boolean = false;
  public cpwdFieldTextType: boolean = false;
  public changPasswordSubmitted: boolean = false;
  public countryId;
  public emitData = {
    action: true,
    folderAction: '',
    deleteStatus: '',
    msg: '',
    name: ''
  };
  public action;
  public actionId;
  public actionName;
  public folderName;
  public deleteFolderFlag: boolean = false;
  public checkboxFlag1: boolean = false;
  public checkboxFlag2: boolean = false;
  public noFilesFlag: boolean = false;

  constructor(

    private landingpageAPI: LandingpageService,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private authApi: AuthenticationService

  ) { 


    
  }
  get c() { return this.changePasswordForm.controls; }
  ngOnInit(): void {

    this.action = this.actionInfo['action'];
    if(this.actionInfo['action'] == 'delete' ){
      this.deleteFolderFlag = true;
      this.checkboxFlag2 = true;
      if(this.actionInfo['count'] == 0){
        this.noFilesFlag = true;
      }
    }
    this.actionId = this.actionInfo['id'];
    this.actionName = this.actionInfo['name'];
    console.log(this.actionInfo)

    if(this.action == 'edit'){
      this.folderName = this.actionName;
      this.strlengthforuser = this.folderName.length;
    }
    else{
      this.folderName = '';
    }

    if(!this.deleteFolderFlag){
      this.changePasswordForm = this.formBuilder.group({
        folderName: [this.folderName, [Validators.required]],
      
      },
      {
        // check whether our password and confirm password match
        
      }); 
   }
    this.countryId = localStorage.getItem('countryId');
  }

  actionSubmit() {
    if(this.submitLoading || !this.submitFlag)
      return false;

    this.changPasswordSubmitted = true;
    let invalidFlag = true;
    let opwd = this.changePasswordForm.value.folderName;     

    this.submitLoading = true;
    this.cpFormData.append('apiKey', this.apiData['apiKey']);
    this.cpFormData.append('userId', this.apiData['userId']);
    this.cpFormData.append('domainId', this.apiData['domainId']);
    this.cpFormData.append('countryId', this.countryId);
    this.cpFormData.append('folderName', opwd);
    if(this.actionInfo['action'] == 'edit'){
      this.cpFormData.append('folderId', this.actionId);
      this.cpFormData.append('oldFolderName',this.actionName);
    }       
   
    this.authApi.apiSaveDocumentFolder(this.cpFormData).subscribe((response) => {
      console.log(response)
      let msg = response.result;
      let msgData = response.data;
      if(response.status == 'Success') {

        if(msgData=='2')
        {
          this.submitLoading = false;
       
         
          this.invalidOldPwdMsg = msg;
        }
        else
        {
          this.invalidMsgFlag = false;
          this.invalidMsg = "";
          this.emitData.msg = msg;
          this.emitData.name = opwd;
          this.emitData.deleteStatus = '';
          this.emitData.folderAction = this.actionInfo['action'];
          //this.emitData.msg = `<div class="msg-row-1 text-center">${msg}<p>Please login again</p></div>`;
          this.emitResponse.emit(this.emitData);
          setTimeout(() => {
         // this.requestPermission(0);
       
         // this.authApi.logout();
          },1000);

        }

       
      } else {
        this.submitLoading = false;
       
         
          this.invalidOldPwdMsg = msg;
        
      }
    });
  }

  actionDelete() {
    if(this.submitLoading)
      return false;

    let deleteStatus = this.checkboxFlag2 ? '2' : '1';
    this.emitData.folderAction = this.action;
    this.emitData.deleteStatus = deleteStatus;
    
    this.submitLoading = true;
    this.cpFormData.append('apiKey', this.apiData['apiKey']);
    this.cpFormData.append('userId', this.apiData['userId']);
    this.cpFormData.append('domainId', this.apiData['domainId']);
    this.cpFormData.append('countryId', this.countryId);
    this.cpFormData.append('folderId', this.actionId);
    this.cpFormData.append('folderName',this.actionName);    
    this.cpFormData.append('deleteStatus',deleteStatus);    
   
    this.authApi.apiSaveDocumentFolder(this.cpFormData).subscribe((response) => {
      console.log(response)
      let msg = response.result;
      let msgData = response.data;
      if(response.status == 'Success') {
        if(msgData=='2')
        {
          this.submitLoading = false;
          this.invalidOldPwdMsg = msg;
        }
        else
        {
          this.invalidMsgFlag = false;
          this.invalidMsg = "";
          this.emitData.msg = msg;          
          this.emitResponse.emit(this.emitData);
          setTimeout(() => {
            // this.requestPermission(0);
            // this.authApi.logout();
          },1000);
        }
      } else {
        this.submitLoading = false;
        this.invalidOldPwdMsg = msg;
      }
    });
  }

  foldercreatevalidate(event)
  {
    if(event.target.value!='')
    {
      this.invalidOldPwdMsg="";
      this.changPasswordSubmitted = true;
      this.strlengthforuser=event.target.value.length;
      this.submitFlag = true;  
    }
    else
    {
      this.submitFlag = false;  
      this.strlengthforuser='0';
      this.changPasswordSubmitted = false;
    }
  }
 
  cancelAction() {
    if(this.submitLoading)
      return false;

    this.emitData.action = false;
    this.emitData.folderAction = 'cancel';
    this.emitData.deleteStatus = '';
    this.emitResponse.emit(this.emitData);
  }

  
  checkboxChange(flag, type){    
    if(type == 'type1'){
      this.checkboxFlag1 = flag ? false : true;  
      this.checkboxFlag2 =  this.checkboxFlag1 ? false : true;
    }
    else{
      this.checkboxFlag2 = flag ? false : true;  
      this.checkboxFlag1 =  this.checkboxFlag2 ? false : true;    
    }    
  }

}
