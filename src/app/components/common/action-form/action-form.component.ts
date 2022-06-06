import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { GtsService } from '../../../services/gts/gts.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent implements OnInit {

  @Input() access;
  @Input() apiData;
  @Input() actionInfo;
  @Input() contentType: string = "";
  @Output() dtcAction: EventEmitter<any> = new EventEmitter();

  public title: string = "";
  public action: string = "";
  public actionId: any = "";
  public resId: any = 0;
  public actionName: string = "";
  public actionDescVal: string = "";
  public mediaFlag: boolean = false;

  actionForm: FormGroup;
  dtcForm: FormGroup;

  public actionFormFlag: boolean;
  public createFolder: boolean=false;
  public placehoder: string = "";
  public errTxt: string = "";
  public dtcErrTxt: string = "";

  public initLoading: boolean = true;
  public actionSubmitted: boolean = false;

  typeFormData = new FormData();

  public nameCheckFlag: any = null;
  public nameExistFlag: boolean = false;
  
  public ws = [];
  public vehicle: string = "";
  public checkAction: any = 1;
  public manageAction: any = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonApi: CommonService,
    private gtsApi: GtsService
  ) { }

  // convenience getters for easy access to form fields
  get c() { return this.actionForm.controls; }
  
  ngOnInit() {
    this.action = this.actionInfo['action'];
    this.actionId = this.actionInfo['id'];
    this.actionName = this.actionInfo['name'];
    console.log(this.actionInfo)

    this.actionForm = this.formBuilder.group({
      name: [this.actionName, [Validators.required]]
    });
    let action = (this.action == 'new') ? 'New' : 'Edit';
    console.log(this.access)
    switch(this.access) {
      case 'Type Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} Part Type`;
        this.placehoder = "Part Type";
        this.errTxt = "Part Type is required";
        break;
      case 'Catg Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} Problem Category`;
        this.placehoder = "Problem Category Name";
        this.errTxt = "Problem Category Name is required";
        break;
      case 'System Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} System`;
        this.placehoder = "System";
        this.errTxt = "System is required";
        break;
      case 'Assembly Creation':
        this.actionFormFlag = true;
        this.title = `${this.action.toUpperCase()} Part Assembly`;
        this.placehoder = "Part Assembly";
        this.errTxt = "Part Assembly is required";
        break;
      case 'Change Password':
        this.actionFormFlag = false;
        this.title = this.access;
        break;
      case 'New Folder':
      case 'Edit Folder':
      case 'Delete Folder':
        this.actionFormFlag = false;
        this.createFolder=true;
        this.title = this.access;
        if(this.access == 'Delete Folder'){
          this.title = this.title+" - "+this.actionName;
        }
        break;
      case 'Remove Media':
      case 'Delete Media':
        this.mediaFlag = true;
        this.title = this.actionInfo.title; 
        break;
    }

    //setTimeout(() => {
      this.initLoading = false;
    //}, 1500);

    if(this.actionFormFlag && this.actionName != '') {
      this.onNameChange(this.actionName);
    }
  }

  // Name Change
  onNameChange(val) {
	  if(val.length > 0) {      
      this.checkName(val);
    } else {
      this.nameExistFlag = false;
    }
  }
  
  // Check Name Exists
  checkName(val) {
    this.actionName = val;
    switch(this.access) {
      case 'Type Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('partTypeName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.partTypeAction('check');
        } else {
          this.partTypeAction('check');
        }
        break;
      case 'Catg Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('categoryName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.probCatgAction('check');
        } else {
          this.probCatgAction('check');
        }
        break;
      case 'System Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('systemName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.partSystemAction('check');
        } else {
          this.partSystemAction('check');
        }
        break;
      case 'Assembly Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('assemblyName', val);
        if(this.nameCheckFlag){
          this.nameCheckFlag.unsubscribe();
          this.partAssemblyAction('check');
        } else {
          this.partAssemblyAction('check');
        }
        break;
    }    
  }

  // Form Submit
  actionSubmit() {
    this.actionSubmitted = true;

    if(this.nameExistFlag) {
      return false;
    }

    if(this.actionForm.invalid) {
      return false;
    }

    this.initLoading = true;
    let name = this.actionForm.value.name;
    switch(this.access) {
      case 'Type Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('partTypeName', name);
        this.partTypeAction('new');        
        break;
      case 'Catg Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('categoryName', name);
        this.probCatgAction('new');        
      break;
      case 'System Creation':
        this.typeFormData = new FormData();
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('systemName', name);
        this.partSystemAction('new');        
      break;
      case 'Assembly Creation':
        this.typeFormData.append('apiKey', this.apiData['apiKey']);
        this.typeFormData.append('domainId', this.apiData['domainId']);
        this.typeFormData.append('countryId', this.apiData['countryId']);
        this.typeFormData.append('userId', this.apiData['userId']);
        this.typeFormData.append('workstreamList', JSON.stringify(this.ws));
        this.typeFormData.append('vehicleInfo', this.vehicle);
        this.typeFormData.append('assemblyName', name);
        this.partAssemblyAction('new');        
      break;
    }
  }

  // Part Type API
  partTypeAction(action) {
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('partTypeId', this.resId);
          }
          this.commonApi.managePartType(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              this.emitAction(resData);
            }          
          });
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('partTypeId', this.actionId);
        }
        this.nameCheckFlag = this.commonApi.managePartType(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }

  // Problem Category API
  probCatgAction(action) {
    console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
    switch (action) {
      case 'new':
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('categoryId', this.resId);
          }
          this.gtsApi.manageProblemCatg(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              console.log(resData);
              this.emitAction(resData);
            }          
          });
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('categoryId', this.actionId);
        }
        this.nameCheckFlag = this.gtsApi.manageProblemCatg(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }


  // Part System API
  partSystemAction(action) {
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('systemId', this.resId);
          }
          this.commonApi.managePartSystem(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              this.emitAction(resData);
            }          
          });  
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('systemId', this.actionId);
        }
        this.nameCheckFlag = this.commonApi.managePartSystem(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId = (status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }

  // Part Assembly API
  partAssemblyAction(action) {
    switch (action) {
      case 'new':
        console.log(this.action)
        console.log(this.actionId)
        console.log(this.resId)
        if(this.action == 'edit' && this.actionId != this.resId) {
          let resData = {
            action: true,
            actionItem: 'exist',
            name: this.actionForm.value.name,
            id: this.resId
          };
          setTimeout(() => {
            this.initLoading = false;
            this.emitAction(resData);  
          }, 700);          
        } else {
          this.typeFormData.append('isValidate', this.manageAction);
          if(this.action == 'edit') {
            this.typeFormData.append('assemblyId', this.resId);
          }
          this.commonApi.managePartAssembly(this.typeFormData).subscribe((response) => {
            this.initLoading = false;
            if(response.status == 'Success') {
              let resData = {
                action: true,
                actionItem: 'new',
                name: this.actionForm.value.name,
                id: parseInt(response.dataId)
              };
              this.emitAction(resData);
            }          
          });  
        }     
        break;
    
      default:
        this.typeFormData.append('isValidate', this.checkAction);
        if(this.action == 'edit') {
          this.typeFormData.append('assemblyId', this.actionId);
        }
        this.nameCheckFlag = this.commonApi.managePartAssembly(this.typeFormData).subscribe((response) => {
          let status = response.status;
          if(this.action == 'edit') {
            this.resId =(status == 'Success') ? this.actionId : response.dataId;
          } else {
            this.nameExistFlag = (status == 'Success') ? false : true;
            if(this.nameExistFlag) {
              this.errTxt = response.result;
            }
          }
        });
        break;
    }
  }
  
  // Emit Action
  emitAction(resData) {
    this.actionSubmitted = false;
    setTimeout(() => {
      this.dtcAction.emit(resData);  
    }, 200);    
  }

  // Cancel Action
  cancelAction() {
    let resData = {
      action: false,
      name: '',
      id: "0"
    };
    setTimeout(() => {
      this.dtcAction.emit(resData);
    }, 500);    
  }

  // Change Password Response
  emitResponse(data) {
    console.log(data)
    if(data.action) {
      let folderAction = data.folderAction;
      let delStatus = data.deleteStatus;
      let action = '';
      if(folderAction == 'delete') {
        action = (delStatus == 1) ? 'general' : 'all';
      } 
      let resData = {
        message: data.msg,
        folderName: data.name,
        action: action
      };
      this.dtcAction.emit(resData); 
    } else {
      this.activeModal.dismiss('Cross click');
    }    
  }

  // Emit Media Response
  emitMediaResponse(data) {
    if(data.action) {
      console.log(data)
      let action = (data.removeStatus) ? 'file-remove' : 'file-delete';
      this.dtcAction.emit(action);
    } else {
      this.activeModal.dismiss('Cross click');
    }
  }
  
}