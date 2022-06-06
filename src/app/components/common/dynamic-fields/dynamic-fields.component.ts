import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ManageListComponent } from '../../../components/common/manage-list/manage-list.component';
import { ApiService } from '../../../services/api/api.service';
import { CommonService } from '../../../services/common/common.service';
import { SibService } from "src/app/services/sib/sib.service";
import * as moment from 'moment';
import { Subscription } from "rxjs";
import { ConfirmationComponent } from 'src/app/components/common/confirmation/confirmation.component';
import * as ClassicEditor from "src/build/ckeditor";
import { Constant, PlatFormType } from 'src/app/common/constant/constant';

@Component({
  selector: 'app-dynamic-fields',
  templateUrl: './dynamic-fields.component.html',
  styleUrls: ['./dynamic-fields.component.scss']
})
export class DynamicFieldsComponent implements OnInit, OnDestroy {

  @Input() pageInfo: any = "";
  @Input() secIndex: any = "";
  @Input() fieldSec: any = "";
  @Input() actionField: boolean = false;
  @Input() public formGroup: FormGroup;
  @Input() public apiFormFields: any = [];
  @Input() public formFields: any = [];
  @Input() public secTabStatus: any = [];

  subscription: Subscription = new Subscription();
  public minDate: any = '';
  public panelWidth: any = 0;
  webForm: FormGroup;
  public baseApiUrl: string = "";
  public makeInterval: any;
  public apiUrl: string = "";
  public responseData: any = [];
  public apiFields: any = [];
  public apiData: any = [];
  public step: string = "";
  public stepIndex: number;
  public step1Submitted:boolean = false;
  public step2Submitted:boolean = false;
  public toggleLabel: string = "No";
  public manageAction: string = "";
  public EditAttachmentAction: string = "attachments";
  public sibAttachmentAction: string = "view";
  public uploadedItems: any = [];
  public attachmentItems: any = [];
  public updatedAttachments: any = [];
  public deletedFileIds: any = [];
  public removeFileIds: any = [];
  public displayOrder: number = 0;
  public threadUpload: boolean = true;
  public attachmentFlag: boolean = true;
  public requiredTxt: string = "Required";
  public dateFormat:string = "MM-DD-YYYY";
  public industryType: any = "";
  public sibAccess: string = "sib";
  public datePickerDisableFlag: boolean = true;
  public datePickerConfig: any = {
    format: this.dateFormat,
    min: this.minDate,
    disabled: true
  }
  public sibattachmentFlag: boolean = true;
  public tvsDomain: boolean = false;
  public selectedBannerImg : File;
  public defaultBanner: boolean = false;
  public defImgURL: any = 'assets/images/common/default-part-banner.png';
  public imgURL: any;
  public imgName: any;
  public invalidFile: boolean = false;
  public invalidFileSize: boolean = false;
  public invalidFileErr: string;

  public textColorValues = [
    {color: "rgb(0, 0, 0)"},
    {color: "rgb(230, 0, 0)"},
    {color: "rgb(255, 153, 0)"},
    {color: "rgb(255, 255, 0)"},
    {color: "rgb(0, 138, 0)"},
    {color: "rgb(0, 102, 204)"},
    {color: "rgb(153, 51, 255)"},
    {color: "rgb(255, 255, 255)"},
    {color: "rgb(250, 204, 204)"},
    {color: "rgb(255, 235, 204)"},
    {color: "rgb(255, 255, 204)"},
    {color: "rgb(204, 232, 204)"},
    {color: "rgb(204, 224, 245)"},
    {color: "rgb(235, 214, 255)"},
    {color: "rgb(187, 187, 187)"},
    {color: "rgb(240, 102, 102)"},
    {color: "rgb(255, 194, 102)"},
    {color: "rgb(255, 255, 102)"},
    {color: "rgb(102, 185, 102)"},
    {color: "rgb(102, 163, 224)"}, 
    {color: "rgb(194, 133, 255)"},
    {color: "rgb(136, 136, 136)"},
    {color: "rgb(161, 0, 0)"},
    {color: "rgb(178, 107, 0)"},
    {color: "rgb(178, 178, 0)"},
    {color: "rgb(0, 97, 0)"},
    {color: "rgb(0, 71, 178)"}, 
    {color: "rgb(107, 36, 178)"},
    {color: "rgb(68, 68, 68)"},
    {color: "rgb(92, 0, 0)"}, 
    {color: "rgb(102, 61, 0)"},
    {color: "rgb(102, 102, 0)"},
    {color: "rgb(0, 55, 0)"},
    {color: "rgb(0, 41, 102)"},
    {color: "rgb(61, 20, 102)"}
  ];

  // classicEditor
  public Editor = ClassicEditor;
  public platformId = localStorage.getItem("platformId");
 
  configCke: any = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "|",
        "strikethrough",
        "code",
        "subscript",
        "superscript",
        "|",
        "codeBlock",
        "htmlEmbed",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",        
        "findAndReplace",
        "|",
        "outdent",
        "indent",
        "|",
        "uploadImage",
        "pageBreak",
        "blockQuote",
        "insertTable",
        "undo",
        "redo",
        //'Source',
      ],
    },
    link: {
      // Automatically add target="_blank" and rel="noopener noreferrer" to all external links.
      addTargetToExternalLinks: true,
    },
    simpleUpload: {     
      // The URL that the images are uploaded to.
      //uploadUrl: Constant.CollabticApiUrl+""+Constant.uploadUrl,
      //uploadUrl:"https://collabtic-v2api.collabtic.com/accounts/UploadAttachtoSvr",
      uploadUrl: this.api.uploadURL,
    },
    image: {
      resizeOptions: [
        {
          name: "resizeImage:original",
          value: null,
          icon: "original",
        },
        {
          name: "resizeImage:50",
          value: "50",
          icon: "medium",
        },
        {
          name: "resizeImage:75",
          value: "75",
          icon: "large",
        },
      ],
      toolbar: [
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "|",
        "resizeImage:50",
        "resizeImage:75",
        "resizeImage:original",
        "|",
        "toggleImageCaption",
        "imageTextAlternative",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: "en",
  };
  
  public modalConfig: any = {backdrop: 'static', keyboard: false, centered: true};

  // Mat Slider Config
  autoTicks = false;
  disabled = false;
  invert = false;
  showTicks = true;
  thumbLabel = false;
  vertical = false;
  
  constructor(
    private api: ApiService,
    private commonApi: CommonService,
    private sibApi: SibService,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'dialog-centered';
  }
  
  // convenience getters for easy access to form fields
  get f() { return this.webForm.controls; }

  ngOnInit(): void {
    this.panelWidth = this.pageInfo.panelWidth;
    this.webForm = this.formGroup;
    this.baseApiUrl = this.pageInfo.baseApiUrl;
    this.step1Submitted = this.pageInfo.step1Submitted;
    this.step2Submitted = this.pageInfo.step2Submitted;
    this.apiFields = this.pageInfo.apiFormFields;
    this.manageAction = this.pageInfo.manageAction;
    this.threadUpload = this.pageInfo.threadUpload;
    this.industryType = this.industryType = this.commonApi.getIndustryType();
    this.step = this.pageInfo.step;
    this.stepIndex = this.pageInfo.stepIndex;
    this.attachmentItems = this.pageInfo.attachmentItems;
    console.log(this.apiFormFields, this.pageInfo, this.industryType, this.webForm)
    //console.log(this.pageInfo, this.industryType)
	  let platformId = localStorage.getItem('platformId'); 
    if(this.pageInfo.domainId == '52' && platformId == '2' ){
      this.tvsDomain = true;      
    }

    this.responseData = {
      action: '',
      type: 'field',
      step: this.step,
      stepIndex: this.stepIndex,
      sectionIndex: this.secIndex,
      fieldSec: this.fieldSec,
      addRow: false,
      addSection: false,
      actionSecIndex: -1,
      rowIndex: -1
    }

    this.apiData = {
      apiKey: this.pageInfo.apiKey,
      domainId: this.pageInfo.domainId,
      countryId: this.pageInfo.countryId,
      userId: this.pageInfo.userId,
      uploadedItems: this.pageInfo.uploadedItems,
      attachments: this.pageInfo.attachments,
      access: this.pageInfo.access,
      displayOrder: this.displayOrder
    };

    let today = moment().add(1, 'd');
    this.minDate = moment(today).format('MM-DD-YYYY');
    if(this.actionField) {
      console.log(this.apiFormFields)
    }
    let apiFormFields = (this.actionField) ? this.apiFormFields.cells.sib : this.apiFormFields;
    for(let f of apiFormFields) {
      console.log(apiFormFields)
      switch(f.fieldName) {
        case 'threadType':
        case 'helpType':
          if(f.selectedVal == '') {
            for(let i of f.itemValues) {
              i.isActive = false;
            }
          } else {
            for(let i of f.itemValues) {
              if(f.selectedVal == i.apiValue) {
                i.isActive = true;
              }            
            }
          }
          break;
        case 'expiryDate':
          if(this.industryType.id == 3) {
            this.dateFormat = f.expiryDateFormat;
          }
          //this.dateFormat = (this.manageAction == 'new') ? f.expiryDateFormat : "yy-mm-dd";
          //this.dateFormat = (this.manageAction == 'new') ? f.expiryDateFormat : this.dateFormat;
          this.datePickerConfig.format = this.dateFormat;
          this.datePickerConfig.min = this.minDate;
          break;
        default: 
          //this.datePickerConfig.format = this.dateFormat;
          //this.datePickerConfig.min = this.minDate;
        break;        
      }

      if(this.apiFormFields.length > 0) {
        switch(f.fieldName) {
          case 'releaseDate':
            this.minDate = moment(today).format('DD-MM-YYYY');
            this.dateFormat = 'DD-MM-YYYY';
            this.datePickerConfig.format = this.dateFormat;
            //this.datePickerConfig.min = this.minDate;
            break;          
        }
      }
    }
    
    this.subscription.add(
      this.commonApi.dynamicFieldDataReceivedSubject.subscribe((response) => {
        console.log(response);
        let action = response['action'];
        this.step1Submitted = response['step1Submitted'];
        this.step2Submitted = response['step2Submitted'];
        this.webForm = response['formGroup'];
        this.pageInfo = response['pageInfo'];
        this.panelWidth = this.pageInfo.panelWidth-50;
        this.manageAction = this.pageInfo.manageAction;
        this.threadUpload = this.pageInfo.threadUpload;
        this.updatedAttachments = this.pageInfo.updatedAttachments;
        this.step = this.pageInfo.step;

        if(this.pageInfo.access == 'knowledge-base' ){                  
          this.imgURL = this.pageInfo.bannerImage != '' && this.pageInfo.bannerImage != 'undefined' && this.pageInfo.bannerImage != undefined && this.pageInfo.bannerImage != 'null' && this.pageInfo.bannerImage != null ? this.pageInfo.bannerImage : null ;
          this.selectedBannerImg = this.pageInfo.bannerImage != '' && this.pageInfo.bannerImage != 'undefined' && this.pageInfo.bannerImage != undefined && this.pageInfo.bannerImage != 'null' && this.pageInfo.bannerImage != null ? this.pageInfo.bannerFile: null;
          this.defaultBanner = this.pageInfo.defaultBanner;
        }
        
        if(this.step == 'step1' && (action == 'sib-upload-success' || action == 'sib-attachment')) {
          switch(action) {
            case 'sib-upload-success':
            case 'sib-attachment':
              this.apiData.uploadedItems = [];
              this.apiData.attachments = [];
              this.uploadedItems = [];
              this.responseData.uploadedItems = this.uploadedItems;
              this.threadUpload = this.pageInfo.threadUpload;
              if(action == 'sib-attachment') {
                this.sibattachmentFlag = false;
                setTimeout(() => {
                  this.sibattachmentFlag = true;  
                }, 50);  
              }
              break;
          }
          return false;
        }
        //console.log(action, this.pageInfo)

        if(this.step == 'step2' || (action == 'document-submit' || action == 'sib-submit')) {
          switch(action) {
            case 'add-row':
              this.actionField = false;
              this.apiFields = this.pageInfo.apiFormFields;
              console.log(response,this.apiFields)
              setTimeout(() => {
                this.actionField = true;
              }, 50);
              break;
            case 'thread-submit':
            case 'document-submit':
            case 'sib-submit':  
              this.apiData.contentType = this.pageInfo.contentType;
              this.apiData.dataId = this.pageInfo.dataId;
              this.apiData.threadId = this.pageInfo.threadId;
              this.apiData.uploadedItems = this.pageInfo.uploadedItems;
              this.apiData.attachments = this.pageInfo.attachments;
              this.apiData.displayOrder = this.displayOrder;
              this.apiData.navUrl = this.pageInfo.navUrl;
              this.apiData.message = this.pageInfo.message;
              this.apiData.threadAction = this.pageInfo.threadAction;
              if(action == 'document-submit'){this.apiData.notificationAction = this.pageInfo.notificationAction;}
              if(action == 'sib-submit') {
                this.threadUpload = this.pageInfo.threadUpload;
                this.apiData.actionIndex = this.pageInfo.actionIndex;
                this.apiData.sibFields = this.pageInfo.sibFields;
                this.apiData.sibInfo = this.pageInfo.sibInfo;
              }
              this.apiData.bulkUpload = this.pageInfo.bulkUpload;
              setTimeout(() => {
                this.threadUpload = true;
              }, 250);
              setTimeout(() => {
                this.apiData.uploadedItems = [];
                this.apiData.attachments = [];
                this.uploadedItems = [];
                this.responseData.uploadedItems = this.uploadedItems;
              }, 2500);
              break;
            case 'submit':
              //console.log(this.apiData, this.threadUpload)
              this.apiData.uploadedItems = this.pageInfo.uploadedItems;
              this.apiData.attachments = this.pageInfo.attachments;
              this.updatedAttachments = this.pageInfo.updatedAttachments;
              break;
          }
        }      
      })
    );
  }

  // Recent Selection
  recentSelection(field, item, c) {
    let sitem = [item];
    let fname = field.fieldName;
    switch (fname) {
      case 'workstreams':
        this.selectedItems(fname, sitem);
        break;
    
      case 'make':
        //console.log(field, item);
        let ftype = field.fieldType;
        let val = item.genericProductName;
        let model = item.modelName;
        let year = item.modelYear;
        let optIndex = -1;
        let itemIndex = this.apiFormFields[c].itemValues.findIndex(option => option.name == val);
        let fval = this.apiFormFields[c].itemValues[itemIndex].id;
        this.onChange(ftype, fname, c, fval, optIndex);
        break;
    }
  }

  // Selected Items
  selectedItems(field, event) {
    //console.log(field, event)
    let items: any = [];
    let itemVal: any = [];
    for(let e of event) {
      items.push(e.id);
      itemVal.push(e.name);
    }
    //console.log(event)
    console.log(items);
    console.log(itemVal);

    // avoid duplicate
    items = Array.from(new Set(items));
    itemVal = Array.from(new Set(itemVal));

    //console.log(items);
    //console.log(itemVal);

    this.setupSelecteditems(field, event, items, itemVal);
  }

  setupSelecteditems(field, sitem, items, itemVal) {
    console.log(field, sitem, items, itemVal);
    
    let fieldName = field;
    let fieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
    let apiFieldKey = this.apiFormFields[fieldIndex].apiFieldKey;
    let formatAttr = this.apiFormFields[fieldIndex].apiFieldType;
    let val = (formatAttr == 1) ? items : itemVal;
    let selVal = itemVal;
    if(field == 'workstreams') {
      if(sitem.length > 0) {
        let windex = this.apiFormFields[fieldIndex].itemValues.findIndex(option => option.id == sitem[0].id); 
        if(windex >= 0) {
          let itemVal = this.apiFormFields[fieldIndex].itemValues[windex];
          sitem[0].key = itemVal.key;
          sitem[0].editAccess = itemVal.editAccess;
        }            
      }
      console.log(this.apiFormFields[fieldIndex].selection, itemVal)
      if(this.apiFormFields[fieldIndex].selection == 'single') {
        selVal = items.toString();
      }
    }
    //console.log(val)
    this.webForm.value[apiFieldKey] = val;
    this.apiFormFields[fieldIndex].selectedIds = sitem;
    this.apiFormFields[fieldIndex].selectedValueIds = items;
    this.apiFormFields[fieldIndex].selectedValues = selVal;
    this.apiFormFields[fieldIndex].selectedVal = selVal;
    this.apiFormFields[fieldIndex].valid = (field == 'year' || (this.apiFormFields[fieldIndex].isMandatary == 1 && items.length > 0)) ? true : false;

    let findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
    this.formFields[this.stepIndex][this.step][findex].formValue = val;
    this.formFields[this.stepIndex][this.step][findex].formValueIds = items;
    this.formFields[this.stepIndex][this.step][findex].formValueItems = itemVal;
    this.formFields[this.stepIndex][this.step][findex].valid = this.apiFormFields[fieldIndex].valid;

    this.responseData.fieldIndex = fieldIndex;
    this.responseData.fieldData = this.apiFormFields[fieldIndex];
    this.responseData.formGroup = this.webForm;
    this.responseData.formFields = this.formFields;
    
    this.commonApi.emitDynamicFieldResponse(this.responseData);
  }

  disableActionSelection() {

  }

  // Disable Selection
  disableTagSelection(f, val, t, fieldData: any = '', fi:any = '') {
    console.log(f, t, fieldData, fi)
    let responseFlag = (fieldData.length == 0) ? true : false;
    let apiFormFields = (fieldData.length == 0) ? this.apiFormFields : fieldData.sibActions;
    let fieldIndex =  (fi == '') ? apiFormFields.findIndex(option => option.fieldName == f) : fi;
    let findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == f);
    //let fieldType = apiFormFields[fieldIndex].fieldType;
    let fieldSel = apiFormFields[fieldIndex].selection;
    let selValueIds = apiFormFields[fieldIndex].selectedIds;

    if(fieldSel == 'multiple' && selValueIds.length > 0) {
      apiFormFields[fieldIndex].selectedIds.splice(t, 1);
      let sitem = apiFormFields[fieldIndex].selectedIds;
      apiFormFields[fieldIndex].selectedIds = sitem;
      let fieldAttr = apiFormFields[fieldIndex].apiFieldType;
      apiFormFields[fieldIndex].selectedValueIds = [];
      apiFormFields[fieldIndex].selectedValues = [];
      apiFormFields[fieldIndex].selectedVal = [];
      
      this.formFields[this.stepIndex][this.step][findex].formValue = [];
      this.formFields[this.stepIndex][this.step][findex].formValueIds = [];
      this.formFields[this.stepIndex][this.step][findex].formValueItems = [];
      for(let s of apiFormFields[fieldIndex].selectedIds) {
        console.log(apiFormFields[fieldIndex])
        let formVal;
        if(f == 'errorCode') {
          formVal = (fieldAttr == 1) ? s.id : s.ename;
        } else {
          formVal = (fieldAttr == 1) ? s.id : s.name;
        }
        apiFormFields[fieldIndex].selectedValueIds.push(s.id);
        apiFormFields[fieldIndex].selectedValues.push(s.name);
        apiFormFields[fieldIndex].selectedVal.push(s.name);
        this.formFields[this.stepIndex][this.step][findex].formValue.push(formVal);
        this.formFields[this.stepIndex][this.step][findex].formValueIds.push(s.id);
        this.formFields[this.stepIndex][this.step][findex].formValueItems.push(s.name);
      }
    } else {
      apiFormFields[fieldIndex].selectedValueIds = "";
      apiFormFields[fieldIndex].selectedValues = "";
      apiFormFields[fieldIndex].selectedVal = "";
      
      this.formFields[this.stepIndex][this.step][findex].formValue = "";
      this.formFields[this.stepIndex][this.step][findex].formValueIds = "";
      this.formFields[this.stepIndex][this.step][findex].formValueItems = "";
    }

    //console.log(apiFormFields[fieldIndex], selValueIds.length)

    this.webForm.value[f] = apiFormFields[fieldIndex].formValue;
    let items = apiFormFields[fieldIndex].selectedValues;
    let valid = (apiFormFields[fieldIndex].isMandatary == 0 || (apiFormFields[fieldIndex].isMandatary == 1 && items.length > 0)) ? true : false;
    valid = (f == 'errorCode' && items.length == 0) ? false : valid;
    apiFormFields[fieldIndex].valid = valid;
    this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;

    if(responseFlag) {
      setTimeout(() => {
        this.responseData.addRow = false;
        this.sendResponse(fieldIndex);  
      }, 150);    
    }
  }

  onChange(type, field, c, val, optIndex, action = '', actionField:any = false, actionIndex:any = -1, rowIndex: any = -1, triggerAction = '') {
    if(!this.pageInfo.stepBack) {
      let fieldIndex;
      let apiFieldKey, formatAttr, formatType;
      if(this.manageAction != 'new' && field == 'threadType') {
        return false;
      }

      val = (val == undefined || val == 'undefined') ? '' : val;
      console.log(type,field,c,val,optIndex,action);
      // ckeditor get value
      if(this.pageInfo.access == 'documents'){       
        if(action == '1'){          
          if(type == 'textarea'){
            if(val == 'description'){
              val = this.webForm.value.description;          
            }
          }
        }
      }
      // ckeditor get value
      console.log(val);      
      /*if(field == 'odometer' && val != '' && this.industryType.id > 1) {
        val = this.commonApi.removeCommaNum(val);
        val = this.commonApi.numberWithCommas(val);
      }*/
      if(field == 'odometer' && val != '') {
        if(this.tvsDomain){
          val = this.commonApi.removeCommaNum(val);
          val = this.commonApi.numberWithCommasTwoDigit(val);
        }
        else{
          val = this.commonApi.removeCommaNum(val);
          val = this.commonApi.numberWithCommasThreeDigit(val);
        }
      }	  
      console.log(val, type, this.stepIndex, this.step, field, optIndex)
      val = (type == 'inputbox' && this.commonApi.hasBlankSpaces(val)) ? '' : val;
      let findex;
      let actionId = 0;
      console.log(actionIndex, rowIndex, this.formFields[this.stepIndex][this.step])
      if(actionIndex >= 0) {
        let chkId = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'id' && option.actionIndex == actionIndex && option.rowIndex == -1);
        actionId = this.formFields[this.stepIndex][this.step][chkId].formValue;
        if(rowIndex >= 0) {
          findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field && option.actionIndex == actionIndex && option.rowIndex == rowIndex);
        } else {
          findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field && option.actionIndex == actionIndex);
        }
        console.log(findex, actionIndex, rowIndex, actionId)
        console.log(this.apiFormFields)
      } else {
        findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == field);
      }      
      let loadFlag = true;
      let responseFlag = true;
      if(optIndex < 0) {
        let cfField = this.formFields[this.stepIndex][this.step][findex];
        console.log(findex, field, actionIndex, cfField, this.formFields[this.stepIndex][this.step])
        //let rowIndex = cfField.rowIndex;
        let cfIndex = cfField.findex;
        let apiFormFields;
        if(actionField) {
          console.log(actionIndex, rowIndex, cfIndex, this.apiFormFields.cells.sib[actionIndex].sibActions)
          apiFormFields = rowIndex < 0 ? this.apiFormFields.cells.sib[actionIndex].sibActions : this.apiFormFields.cells.sib[actionIndex].sibActions[c].rowItems[rowIndex].cellAction;
          console.log(apiFormFields)
          this.responseData.rowIndex = rowIndex;
        } else {
          apiFormFields = this.apiFormFields;
          if(this.pageInfo.access == 'sib') {
            let sflag: any = true;
            localStorage.setItem('sibFieldUpdate', sflag);
          }
        }
        // this.apiFormFields = (actionField) ? this.apiFormFields[actionIndex] : this.apiFormFields;
        fieldIndex = (actionField && rowIndex >= 0) ? cfIndex : apiFormFields.findIndex(option => option.fieldName == field);
        console.log(apiFormFields, actionIndex, findex,  actionField, cfField, fieldIndex)
        apiFieldKey = apiFormFields[fieldIndex].apiFieldKey;
        formatAttr = apiFormFields[fieldIndex].apiFieldType;
        formatType = apiFormFields[fieldIndex].apiValueType;
        let selVal = '';
        //console.log(field, findex)
        switch (field) {
          case 'workstreams':
            if(apiFormFields[fieldIndex].selection == 'single') {
              let itemValues = apiFormFields[fieldIndex].itemValues;
              let windex = itemValues.findIndex(option => option.id == val);
              apiFormFields[fieldIndex].selectedIds = [itemValues[windex]];
            }
            break;
          case 'expiryDate':
            val = moment(val).format('YYYY-MM-DD');
            let sval = moment(val).format(apiFormFields[fieldIndex].expiryDateFormat);
            apiFormFields[fieldIndex].dateVal = sval;
            break;
          case 'threadType':
            console.log(this.manageAction, val)
            if(this.manageAction == 'new') {
              for(let i of apiFormFields[c].itemValues) {
                i.isActive = false;
                if(i.apiValue == val) {
                  i.isActive = true;
                  this.formFields[this.stepIndex][this.step][findex].selectedVal = i.name;
                }
              }
            } else {
              responseFlag = false;
            }           
            break;
          case 'helpType':
            for(let i of apiFormFields[c].itemValues) {
              i.isActive = false;
              if(i.apiValue == val) {
                i.isActive = true;                
              }
            }
            break;
          case 'announcementType':
            for(let i of apiFormFields[c].itemValues) {
              i.checked = false;
              if(i.id == val) {
                i.checked = true;
                let formVal = (apiFormFields[c].apiFieldType == 1) ? i.id : i.name;
                apiFormFields[c].selectedValueIds = formVal;
                apiFormFields[c].selectedValues = formVal;
                apiFormFields[c].selectedVal = formVal;
                this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
                this.formFields[this.stepIndex][this.step][findex].formValueIds = formVal;
                this.formFields[this.stepIndex][this.step][findex].formValueItems = formVal;
              }
            }
            break;
          case 'vin':
            loadFlag = false;
            val = val.toUpperCase();
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            let kvalid = (val != 0 && val.length >= 0 && val.length < 17) ? false : true;
            console.log(val, kvalid, findex, fieldIndex)
            apiFormFields[fieldIndex].valid = kvalid;
            apiFormFields[fieldIndex].validVin = kvalid;
            apiFormFields[fieldIndex].invalidFlag = !kvalid;
            this.formFields[this.stepIndex][this.step][findex].valid = kvalid;
            break;
          case 'vinNo':
          case 'cutOffFrame':
            console.log(fieldIndex, apiFormFields, action)
            loadFlag = false;
            val = val.toUpperCase();
            apiFormFields[fieldIndex].changeAction = 'change';
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            console.log(findex, apiFormFields[fieldIndex], this.formFields[this.stepIndex][this.step], val)
            //let sbfIndex = cfIndex.multiIndexOf('a');
            let valid = (action == '' && val != 0 && val.length >= 0 && val.length < 17) ? false : true;
            console.log(valid)
            if(field == 'cutOffFrame') {
              console.log(valid)
              if(val.length == 17) {
                let frameFilter = this.formFields[this.stepIndex][this.step].filter(option => option.actionIndex == actionIndex && option.rowIndex != rowIndex && option.fieldName == field && option.formValue === val);
                console.log(frameFilter)
                apiFormFields[fieldIndex].duplicateFlag = (frameFilter.length == 0) ? false : true;
              } else {
                apiFormFields[fieldIndex].duplicateFlag = false;
              }
            }
            valid = (action == 'vin-api') ? true : valid;
            let localVin = localStorage.getItem('VinNo');
            apiFormFields[c].vinNo = (localVin == undefined || localVin == 'undefined') ? apiFormFields[fieldIndex].vinNo : localVin; 
            let verifiedVin = (apiFormFields[fieldIndex].vinNo == undefined || apiFormFields[fieldIndex].vinNo == 'undefined') ? '' : apiFormFields[fieldIndex].vinNo;
            console.log(apiFormFields[fieldIndex],this.formFields[this.stepIndex][this.step][findex])
            //apiFormFields[c].vinNo = verifiedVin; 
            if(verifiedVin != '' && verifiedVin != val && ((field == 'vinNo' && apiFormFields[fieldIndex].decodeConcept == 1) || field == 'cutOffFrame')) {
              valid = false;
              apiFormFields[fieldIndex].validVin = valid;
              apiFormFields[fieldIndex].invalidFlag = !valid;
            } else {
              valid = (val.length < 17) ? false : true;
              valid = (action == '' && field == 'cutOffFrame' && apiFormFields[fieldIndex].vinValid) ? false : valid;
              if(field == 'cutOffFrame' && apiFormFields[fieldIndex].vinValid) {
                apiFormFields[fieldIndex].validVin = valid;
                apiFormFields[fieldIndex].invalidFlag = !valid;
              }
            }

            console.log(valid)
            setTimeout(() => {
              localStorage.removeItem('VinNo')
            }, 50);
            console.log(verifiedVin, valid)
            apiFormFields[c].valid = valid;
            
            this.formFields[this.stepIndex][this.step][findex].valid = valid;
            console.log(action, valid)

            responseFlag = (action == 'vin-api' || action == 'frame-api' || action == 'frame-range' && valid) ? true : false;
            responseFlag = (field == 'vinNo' && apiFormFields[fieldIndex].decodeConcept == 0) ? false : responseFlag;
            console.log(responseFlag, rowIndex, triggerAction, action)
            if(responseFlag && rowIndex >= 0 && triggerAction == 'change' && action == 'frame-range') {
              let frIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'frameRange' && option.actionIndex == actionIndex && option.rowIndex == rowIndex);
              console.log(this.formFields[this.stepIndex][this.step][frIndex])
              let cfrIndex = this.formFields[this.stepIndex][this.step][frIndex].findex;
              apiFormFields[cfrIndex].selectedVal = '';
              apiFormFields[cfrIndex].selectedValueIds = ''; 
              apiFormFields[cfrIndex].selectedValues = '';
              this.formFields[this.stepIndex][this.step][frIndex].formValue = '';
              this.formFields[this.stepIndex][this.step][frIndex].formValueIds = '';
              this.formFields[this.stepIndex][this.step][frIndex].formValueItems = '';
            }
            console.log(responseFlag)
            break;  
          case 'make':
          case 'manufacturer':  
          case 'SelectProductType':
            loadFlag = false;
            let itemIndex = apiFormFields[c].itemValues.findIndex(option => option.id == val);
            let currApiFieldKey = apiFormFields[fieldIndex].apiFieldKey;
            
            let modelField = 'model';
            let modelIndex = apiFormFields.findIndex(option => option.fieldName == modelField);
            let mindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == modelField);
            
            apiFormFields[modelIndex].selectedValueIds = "";
            apiFormFields[modelIndex].selectedValues = "";
            apiFormFields[modelIndex].selectedVal = [];
            //apiFormFields[modelIndex].valid = false;
            let apiFieldKey = apiFormFields[modelIndex].apiFieldKey;
            let formVal = (formatType == 1) ? "" : [];
            this.formFields[this.stepIndex][this.step][mindex].formValue = formVal;
            this.formFields[this.stepIndex][this.step][mindex].formValueIds = formVal;
            this.formFields[this.stepIndex][this.step][mindex].formValueItems = formVal;
            //this.formFields[this.stepIndex][this.step][mindex].valid = false;
            this.webForm.value[apiFieldKey] = formVal;
            
            let itemId = apiFormFields[c].itemValues[itemIndex].id;
            let itemName = apiFormFields[c].itemValues[itemIndex].name;
            apiFormFields[fieldIndex].selectedValueIds = (formatType == 1) ? itemId : [itemId];
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = (formatType == 1) ? itemName : [itemName];

            formVal = (formatAttr == 1) ? itemId : itemName;
            formVal = (formatType == 1) ? formVal : [formVal];

            this.webForm.value[currApiFieldKey] = formVal; 
            this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = (formatType == 1) ? itemId : [itemId];
            this.formFields[this.stepIndex][this.step][findex].formValueItems = (formatType == 1) ? itemName : [itemName];
            break;  
          
          case 'dtcToggle':
            apiFormFields[fieldIndex].selection = val;
            this.toggleLabel = (val) ? 'Yes' : 'No';
            let chkField = 'errorCode';
            let efieldIndex = apiFormFields.findIndex(option => option.fieldName == chkField);
            let efindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkField);
            apiFormFields[efieldIndex].valid = !val;
            this.formFields[this.stepIndex][this.step][efindex].valid = !val;
            break;
          case 'partsToggle':
            if(actionId > 0) {
              this.apiFormFields.mainActionItems[0].editIndex = actionIndex;
            }
            if(!val) {
              responseFlag = false;
              let chkField = 'parts';
              let pfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkField);
              console.log('part info field',pfindex, this.formFields[this.stepIndex][this.step][pfindex])
              let partInfo = this.formFields[this.stepIndex][this.step][pfindex].formValue;
              console.log(partInfo)
              if(partInfo.length > 0) {
                const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
                modalRef.componentInstance.access = 'Parts Cancel';
                modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
                  modalRef.dismiss('Cross click');
                  console.log(receivedService)
                  if(!receivedService) {
                    val = true;                    
                  } else {
                    val = false;
                    if(actionField) {
                      this.responseData.actionSecIndex = actionIndex;
                      this.responseData.fieldSec = 'sib';
                      this.responseData.fieldRow = 'rowItems';
                      this.responseData.rowIndex = rowIndex;
                    }        
                    console.log(this.responseData, this.formFields)
                    this.responseData.addRow = false;
                    this.sendResponse(fieldIndex, actionField, actionIndex);
                  }
                  apiFormFields[fieldIndex].selection = val;
                });
              } else {
                responseFlag = true;
              }
            }
            
            //apiFormFields[fieldIndex+1].displayFlag = true;
            break;
        }

        if(responseFlag && apiFormFields[fieldIndex].isMandatary == 1) {
          apiFormFields[fieldIndex].valid = true;
        }

        if(field == 'content') {
          if(actionIndex >= 0 && actionId > 0) {
            this.apiFormFields.mainActionItems[0].editIndex = actionIndex;
          }
          let upItems = Object.keys(this.uploadedItems);
          apiFormFields[fieldIndex].valid = (val != '' || (upItems.length > 0 && this.uploadedItems.items.length > 0)) ? true : false;
        }

        this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;
        
        if(loadFlag) {
          apiFormFields[fieldIndex].selectedValues = val;
          if(type == 'slider') {
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedVal = val;
          }
          val = (formatType == 1) ? val : [val];
          this.formFields[this.stepIndex][this.step][findex].formValue = val;  
          this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
          this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
          
          if(type == 'dropdown') {
            let dindex = apiFormFields[fieldIndex].itemValues.findIndex(option => option.id == val);
            let itemId = apiFormFields[fieldIndex].itemValues[dindex].id;
            let itemName = apiFormFields[fieldIndex].itemValues[dindex].name;
            let formVal = (formatAttr == 1) ? itemId : itemName;
            formVal = (formatType == 1) ? formVal : [formVal];
            apiFormFields[fieldIndex].selectedValueIds = [itemId];
            apiFormFields[fieldIndex].selectedValues = val.toString();
            apiFormFields[fieldIndex].selectedVal = [val];
            if(apiFormFields[fieldIndex].isMandatary == 1) {
              apiFormFields[fieldIndex].valid = (val != '') ? true : false;
            }
            this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = (formatType == 1) ? itemId : [itemId];
            this.formFields[this.stepIndex][this.step][findex].formValueItems = (formatType == 1) ? itemName : [itemName];
            this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;
            this.webForm.value[apiFieldKey] = formVal;
          } else {
            apiFormFields[fieldIndex].selectedValueIds = val;
            apiFormFields[fieldIndex].selectedValues = val;
            apiFormFields[fieldIndex].selectedVal = val;
            if(apiFormFields[fieldIndex].isMandatary == 1) {
              apiFormFields[fieldIndex].valid = (val.length > 0) ? true : false;
              let minLen = parseInt(apiFormFields[fieldIndex].minLength);
              if(minLen > 0) {
                let valid = apiFormFields[fieldIndex].valid;
                valid = (minLen <= val.length) ? true : false;
                console.log(val.length, minLen, valid)
                apiFormFields[fieldIndex].valid = valid;
              }
            }
            
            val = (formatType == 1) ? val : [val];
            this.formFields[this.stepIndex][this.step][findex].formValue = val;
            this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
            this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
            this.formFields[this.stepIndex][this.step][findex].valid = apiFormFields[fieldIndex].valid;
            this.webForm.value[apiFieldKey] = val;
          }
        }
      } else {
        fieldIndex = c;
        apiFieldKey = this.apiFormFields[fieldIndex].cellArray[optIndex].apiFieldKey;
        formatAttr = this.apiFormFields[fieldIndex].cellArray[optIndex].apiFieldType;
        formatType = this.apiFormFields[fieldIndex].cellArray[optIndex].apiValueType;
        if(type == 'dropdown') {
          let dindex = this.apiFormFields[fieldIndex].cellArray[optIndex].itemValues.findIndex(option => option.id == val);
          let itemId = this.apiFormFields[fieldIndex].cellArray[optIndex].itemValues[dindex].id;
          let itemName = this.apiFormFields[fieldIndex].cellArray[optIndex].itemValues[dindex].name;
          let formVal = (formatAttr == 1) ? itemId : itemName;
          formVal = (formatType == 1) ? formVal : formVal;
          val = (formatType == 1) ? val : [val];
          console.log(this.apiFormFields[fieldIndex].cellArray[optIndex], formatType, val)
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValueIds = itemId;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValues = val;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedVal = val;
          if(this.apiFormFields[fieldIndex].cellArray[optIndex].isMandatary == 1) {
            this.apiFormFields[fieldIndex].cellArray[optIndex].valid = (val.length > 0) ? true : false;
          }
          this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
          this.formFields[this.stepIndex][this.step][findex].formValueIds = (formatType == 1) ? itemId : [itemId];
          this.formFields[this.stepIndex][this.step][findex].formValueItems = (formatType == 1) ? itemName : [itemName];
          this.formFields[this.stepIndex][this.step][findex].valid = this.apiFormFields[fieldIndex].cellArray[optIndex].valid;
          this.webForm.value[apiFieldKey] = formVal;
        } else {
          val = (formatType == 1) ? val : [val];
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValueIds = val;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedValues = val;
          this.apiFormFields[fieldIndex].cellArray[optIndex].selectedVal = val;
          if(this.apiFormFields[fieldIndex].cellArray[optIndex].isMandatary == 1) {
            this.apiFormFields[fieldIndex].cellArray[optIndex].valid = (val.length > 0) ? true : false;
          }
          val = (formatType == 1) ? val : [val];
          this.formFields[this.stepIndex][this.step][findex].formValue = val;
          this.formFields[this.stepIndex][this.step][findex].formValueIds = val;
          this.formFields[this.stepIndex][this.step][findex].formValueItems = val;
          this.formFields[this.stepIndex][this.step][findex].valid = this.apiFormFields[fieldIndex].cellArray[optIndex].valid;
          this.webForm.value[apiFieldKey] = val;
        }
        console.log(this.apiFormFields[fieldIndex])
      }
      
      if(responseFlag) {
        if(actionField) {
          this.responseData.actionSecIndex = actionIndex;
          this.responseData.fieldSec = 'sib';
          this.responseData.fieldRow = 'rowItems';
          this.responseData.rowIndex = rowIndex;
        }        
        console.log(this.responseData, this.formFields, fieldIndex)
        this.responseData.addRow = false;
        this.sendResponse(fieldIndex, actionField, actionIndex);
      }
    }        
  }
  
  // Manage Lists
  manageSelection(field, secIndex='', sc = '', fc = -1, ri = -1) {
    console.log(field, secIndex, sc, fc, this.industryType)
    let manageFlag = true;
    //let manageFlag = ((this.industryType.id == 2 || this.industryType.id == 3) && field.disabled) ? false : true;
    switch (this.industryType.id) {
      case 2:
      case 3:
        manageFlag = (field.disabled) ? false : manageFlag;
        break;
      default:
        manageFlag = true;
        break;
    }
    if(manageFlag) {
      let fieldName = field.fieldName;
      let fieldApiName = (fieldName == 'vinNo') ? 'vehicle/GetRecentVin' : field.apiName;
      let apiName = `${this.baseApiUrl}/${fieldApiName}`;
      let actionApi = '';
      let actionQueryVal: any = [];
      let selectionType = field.selection;
      let apiData = this.apiData;
      let chkMakeField = 'make';
      let chkModelField = 'model';
      let chkWsField = 'workstreams';
      let chkPtField = 'SelectProductType';
      let wsFieldIndex, findex, currFieldIndex, currfindex, ptIndex, item, wsVal, makeVal, ptVal, modelVal, filterItems, filterLists, action, formatAttr, formatType, itemId, itemName;
        
      console.log(secIndex, this.stepIndex, this.step, fieldName, selectionType)
      switch(fieldName) {
        case 'model':
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          makeVal = '';
          let makeFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == chkMakeField);
          let ptFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == chkPtField);

          if(makeFieldIndex >= 0) {
            findex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkMakeField);
            makeVal = this.formFields[this.stepIndex][this.step][findex].formValue;
          }

          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = (selectionType == 'single') ? [item.formValueIds] : item.formValueIds;
          filterLists = (selectionType == 'single') ? [item.formValueItems] : item.formValueItems;
          action = this.apiFormFields[currFieldIndex].action;

          wsFieldIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkWsField);
          console.log(this.formFields, wsFieldIndex)
          wsVal = this.formFields[this.stepIndex][this.step][wsFieldIndex].formValue;
          ptIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkPtField);
          console.log(ptFieldIndex, ptIndex)
          if(ptFieldIndex >= 0) {
            console.log(this.formFields[this.stepIndex][this.step][ptIndex])
            ptVal = this.formFields[this.stepIndex][this.step][ptIndex].formValueItems;
            ptVal = (ptVal == undefined || ptVal == 'undefined') ? '' : ptVal;
            if(this.industryType.id == 3) {
              filterItems = filterLists;
            }
          }

          //console.log(item, makeVal, wsVal, ptVal)
          if((ptFieldIndex >= 0 && wsVal.length > 0) || (ptFieldIndex < 0 && makeVal != '')) {
            let query = JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
            query.forEach(q => {
              switch(q) {
                case 'workstreamsList':
                  apiData[q] = JSON.stringify(wsVal);
                  break;
                case 'makeName':
                  apiData[q] = makeVal;
                  break;
                case 'productType':
                  if(ptFieldIndex >= 0) {
                    apiData[q] = ptVal;
                  }                
                  break;
                case 'type':
                  apiData[q] = 1;
                  break;
                case 'commonApiValue':
                  apiData[q] = this.apiFormFields[currFieldIndex][q];
                  break;
              }
            });
            this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal);
          }
          break;
        
        case 'AdditionalModelInfo':
        case 'AdditionalModelInfo2':
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          let modelfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkModelField);
          let makefindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkMakeField);
          makeVal = this.formFields[this.stepIndex][this.step][makefindex].formValue;
          modelVal = this.formFields[this.stepIndex][this.step][modelfindex].formValue;
          let selectedIndex, sindex;
          let selectedVal = "";
          if(fieldName == 'AdditionalModelInfo') {
            selectedIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
            if(selectedIndex >= 0) {
              sindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'AdditionalModelInfo2');
            }
          }
          if(fieldName == 'AdditionalModelInfo2') {
            selectedIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
            if(selectedIndex >= 0) {
              sindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'AdditionalModelInfo');
            }
          }
          selectedVal = this.formFields[this.stepIndex][this.step][sindex].formValue;
          console.log(selectedVal);
          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = item.formValueIds;
          filterLists = item.formValueItems;
          
          filterItems = this.formFields[this.stepIndex][this.step][currfindex].formValue;
          filterLists = filterItems;
          action = this.apiFormFields[currFieldIndex].action;
          
          if(makeVal != '' && modelVal != '') {
            let query = JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
            console.log(query)
            query.forEach(q => {
              switch(q) {
                case 'makeName':
                  apiData[q] = makeVal;
                  break;
                case 'modelName':
                  apiData[q] = modelVal;
                  break;
                case 'selectedinfo':
                  apiData[q] = JSON.stringify(selectedVal);
                  break;
                case 'commonApiValue':
                  apiData[q] = this.apiFormFields[currFieldIndex][q];
                  break;  
              }
            });
            this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal);
          }
          break;

        case 'technicianInfo':
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = item.formValueIds;
          filterLists = item.formValueItems;
          
          filterItems = this.formFields[this.stepIndex][this.step][currfindex].formValue;
          filterItems = (filterItems == undefined || filterItems == 'undefined') ? [] : filterItems;
          filterLists = filterItems;
          action = this.apiFormFields[currFieldIndex].action;
          actionApi = field.actionApiName;
          actionQueryVal = field.actionQueryValues;
          
          let query = JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
          console.log(query, filterItems)
          query.forEach(q => {
            switch(q) {
              case 'dealerCode':
                apiData[q] = localStorage.getItem('dealerCode');
                break;
              case 'commonApiValue':
                apiData[q] = this.apiFormFields[currFieldIndex][q];
                break;  
            }
          });
          this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal);
          break;  

        case 'frameRange':
        case 'tags':
        case 'parts':     
          console.log(field)
          if(field.disabled) {
            return false;
          }
          //currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currFieldIndex = fc;
          if(ri >= 0) {
            currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName && option.actionIndex == fc && option.rowIndex == ri);
            if(fieldName == 'frameRange') {
              let chkIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == 'cutOffFrame' && option.actionIndex == fc && option.rowIndex == ri);
              if(!this.formFields[this.stepIndex][this.step][chkIndex].valid) {
                return false;
              } 
            }
          } else {
            if(fc >= 0) {
              currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName && option.actionIndex == fc);
            } else {
              currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
              currFieldIndex = this.formFields[this.stepIndex][this.step][currfindex].findex;
            }
          }
          filterItems = (fieldName == 'frameRange') ? [field.selectedValueIds] : field.selectedValueIds;
          filterLists = (fieldName == 'frameRange') ? [field.selectedValues] : field.selectedValues;
          let actionIndex = this.formFields[this.stepIndex][this.step][currfindex].actionIndex;
          console.log(actionIndex)
          let rowIndex = this.formFields[this.stepIndex][this.step][currfindex].rowIndex;
          action = (fieldName == 'parts') ? false : field.action;
          actionApi = field.actionApiName;
          actionQueryVal = field.actionQueryValues;

          if(fieldName == 'parts') {
            wsFieldIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkWsField);
            console.log(this.formFields, wsFieldIndex)
            ///wsVal = this.formFields[this.stepIndex][this.step][wsFieldIndex].formValue;
            wsVal = [];
            apiData['groups'] = JSON.stringify(wsVal);
            let query = JSON.parse(field.queryValues);
            console.log(query)
            let status = 1;
            query.forEach(q => {
              switch(q) {
                case 'partStatus':
                case 'publishStatus':  
                  apiData[q] = status;
                  break;
                case 'groups':
                  apiData[q] = JSON.stringify(wsVal);
                  break;
                case 'commonApiValue':
                  apiData[q] = field.commonApiValue;
                  break;
              }
            });
          }

          let actionData:any = '';
          if(this.pageInfo.access == 'sib') {
            actionData = {
              field: field,
              index: secIndex,
              actionField: sc,
              actionIndex: fc,
              rowIndex: rowIndex,
              fieldIndex: 0
            };
            
            this.responseData.rowIndex = rowIndex;
            this.responseData.fieldSec = 'sib';
            this.responseData.fieldRow = 'rowItems';
          }
          this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal, field, actionData);
          break;  
        
        default:
          currFieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldName);
          currfindex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == fieldName);
          let dquery = (this.apiFormFields[currFieldIndex].queryValues == '') ? [] : JSON.parse(this.apiFormFields[currFieldIndex].queryValues);
          dquery.forEach((q, i) => {
            switch(q) {
              case 'commonApiValue':
                apiData[q] = this.apiFormFields[currFieldIndex][q];
                break;
              default:
                let chkField = q;
                let queryIndex = this.formFields[this.stepIndex][this.step].findIndex(option => option.fieldName == chkField);
                console.log(chkField, queryIndex, this.formFields[this.stepIndex][this.step][queryIndex])
                if(queryIndex >= 0) {
                  let queryVal = (q == 'workstreams') ? this.formFields[this.stepIndex][this.step][queryIndex].formValue : this.formFields[this.stepIndex][this.step][queryIndex].formValueItems;
                  apiData[dquery[i]] = (q == 'workstreams') ? JSON.stringify(queryVal) : queryVal;
                }
                break;  
            }
          });

          let actionQuery = (this.apiFormFields[currFieldIndex].actionQueryValues == '') ? [] : JSON.parse(this.apiFormFields[currFieldIndex].actionQueryValues);
          let commonApiValue = '';
          actionQuery.forEach((q, i) => {
            switch(q) {
              case 'commonApiValue':
                commonApiValue = this.apiFormFields[currFieldIndex][q];
                break;
              }
          });
          
          formatAttr = this.apiFormFields[currFieldIndex].apiFieldType;
          formatType = this.apiFormFields[currFieldIndex].apiValueType;
          item = this.formFields[this.stepIndex][this.step][currfindex];
          filterItems = (item.selection == 'multiple' && (item.formValueIds == 'undefined' || item.formValueIds == undefined)) ? [] : (item.formValueIds == 'undefined' || item.formValueIds == undefined) ? '' : item.formValueIds;
          filterLists = (item.selection == 'multiple' && (item.formValueItems == 'undefined' || item.formValueIds == undefined)) ? [] : (item.formValueItems == 'undefined' || item.formValueItems == undefined) ? '' : item.formValueItems;
          filterItems = (item.selection == 'multiple') ? filterItems : [filterItems];
          filterLists = (item.selection == 'multiple') ? filterLists : [filterLists];
          console.log(item, filterItems, filterLists)
          action = this.apiFormFields[currFieldIndex].action;
          actionApi = this.apiFormFields[currFieldIndex].actionApiName;
          actionQueryVal = this.apiFormFields[currFieldIndex].actionQueryValues;
          this.manageList(fieldName, selectionType, apiData, apiName, currFieldIndex, currfindex, filterItems, filterLists, action, actionApi, actionQueryVal, '', '', commonApiValue);
          break;
      }
    }
  }

  // Manage List
  manageList(fieldName, selectionType, apiData, apiUrl, fieldIndex, findex, filteredItems, filterLists, action, actionApiName, actionQueryVal, fieldData = '', actionData: any = '', commonApiValue: any = '') {
    let innerHeight = this.pageInfo.panelHeight;
    let inputData = {
      baseApiUrl: this.baseApiUrl,
      apiUrl: apiUrl,
      field: fieldName,
      selectionType: selectionType,
      filteredItems: filteredItems,
      filteredLists: filterLists,
      actionApiName: actionApiName,
      actionQueryValues: actionQueryVal
    };
    let access = 'newthread';
    let title = '';
    console.log(fieldName, fieldIndex, findex, apiUrl, apiData, filterLists, filteredItems)
    let apiFieldData: any = fieldData;
    console.log(fieldData)
    let apiField = (fieldName == 'frameRange' || fieldName == 'tags' || fieldName == 'parts') ? apiFieldData : this.apiFormFields[fieldIndex];
    let sibFields:any = false;
    let fieldTitle = apiField.title;
    switch(fieldName) {
      case 'errorCode':
      case 'Dtc':  
        access = 'New Thread Error Codes';
        title = (fieldName == 'Dtc') ? fieldTitle : 'Error codes';
        break;
      case 'tags':
      case 'Tag':
        access = 'New Thread Tags';
        title = 'Tags';
        break;
      case 'parts':
        access = 'New Parts';
        title = 'New Parts To Be Used';
        inputData.field = 'parts';
        break;  
      case 'model':
        title = 'Model';
        break;
      case 'AdditionalModelInfo':  
        title = 'Additional Info';
        break;
      case 'AdditionalModelInfo2':  
        title = 'Additional Info';
        break;  
      case 'folders':
        title = 'Folder';
        break;
      case 'language':
        title = 'Language';
        break;
      case 'vinNo':
        title = 'Recent VINs';
        break;
      case 'SystemSelection':
        title = "System Selection";
        sibFields = true;
        break;
      case 'frameRange':
        title = 'Frame Range';
        break;
      case 'complaintCategory':
        title = 'Complaint Category';
        sibFields = true;
        break;
      case 'symptom':
        title = 'Symptoms';
        sibFields = true;
        break;
      case 'technicianInfo':
        title = 'Technician Info';
        access = 'techinfo';
        break;
      case 'Occurance':
        title = 'Occurance';
        break;
      default:
        access = 'newthread';
        title = fieldTitle;
        break;
    }
    console.log("access" +access);
    console.log("action" +action);
    console.log("filteredItems" +filteredItems);
    console.log("inputData" +(JSON.stringify(inputData)));
    console.log("innerHeight"+innerHeight);
    inputData['title'] = title;

    const modalRef = this.modalService.open(ManageListComponent, this.config);
    modalRef.componentInstance.access = access;
    modalRef.componentInstance.accessAction = action;
    modalRef.componentInstance.filteredTags = filteredItems;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight;
    modalRef.componentInstance.commonApiValue = commonApiValue;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      console.log(receivedService)
      let res = receivedService;
      let id, itemVal, eitemVal, formVal, formValItem, formatAttr, formatType;
      console.log(fieldData)
      formatAttr = apiField.apiFieldType;
      formatType = apiField.apiValueType;
      let responseFlag = (actionData.length == 0) ? true : false;
      if(this.pageInfo.access == 'sib' && sibFields) {
        localStorage.setItem('sibFieldUpdate', sibFields);
      }
      if(selectionType == 'single') {
        res = res[0];
        id = (fieldName == 'vinNo') ? res.id : res.id.toString();
        itemVal = res.name;
        switch (fieldName) {
          case 'model':
            let modelItems = apiField.itemValues;
            let itemValues = Object.keys(modelItems);
            let itemFlag = true;
            if(itemValues.length > 0) {
              itemFlag = (id == modelItems.id) ? false : true;
            } 
            if(itemFlag) {
              apiField.itemValues = {
                id: id,
                name: itemVal,
                catg: res.catg,
                make: res.make,
                prodType: res.prodType,
                regions: res.regions,
                subCatg: res.subCatg,
                makeItems: res.makeItems
              }
            }  
            break;
        
          case 'vinNo':
            let vinNo = res.vinNo;
            itemVal = vinNo;
            id = vinNo;
            apiField.changeAction = 'recent';
            apiField.itemValues = {
              id: vinNo,
              name: vinNo
            }
            apiField.vinNo = vinNo;
            apiField.vinDetails = res;
            break;
        }
        
        id = (formatType == 1) ? id : [id];
        itemVal = (formatType == 1) ? itemVal : [itemVal];
        formVal = (formatAttr == 1) ? id : itemVal;
        apiField.valid = true; 
        if(fieldName == 'frameRange') {
          fieldIndex = 0;
          apiField.selectedValueIds = id;
          apiField.selectedVal = formVal;
          apiField.selectedValues = formVal;
          //fieldData['valid'] = true;
          //this.formFields[this.stepIndex][this.step][findex].valid = apiField.valid;
          let sbf = actionData.actionField;
          let ac = actionData.actionIndex;
          let d = actionData.index;
          let ri = actionData.rowIndex;
          if(ri >= 0) {
            sbf = sbf.rowItems[ri].cellAction[fieldIndex];
          }
          console.log(actionData)
          this.onChange(sbf.fieldType, sbf.fieldName, d, sbf.selectedValues, -1, 'frame-range', true, ac, this.responseData.rowIndex);
          return false;
        } else {
          //apiField.valid = true;
          this.formFields[this.stepIndex][this.step][findex].valid = apiField.valid;
        }
      } else {
        let list = [];
        id = [];
        itemVal = [];
        eitemVal = [];
        for(let i of res) {
          id.push(i.id);
          itemVal.push(i.name);
          if(fieldName == 'errorCode') {
            eitemVal.push(i.ename);
            list.push({id: i.id, name: i.name, ename: i.ename});
          } else {
            list.push({id: i.id, name: i.name});
          }
        }
        id = (formatType == 1) ? id[0] : id;
        itemVal = (formatType == 1) ? itemVal[0] : itemVal;
        if(fieldName == 'errorCode') {
          formVal = (formatAttr == 1) ? id : eitemVal;
        } else {
          formVal = (formatAttr == 1) ? id : itemVal;
        }
        console.log(actionData, fieldName, fieldIndex)
        //console.log(apiField)
        if(actionData.length == 0) {
          apiField.valid = true;
          this.formFields[this.stepIndex][this.step][findex].valid = apiField.valid;
          apiField.selectedIds = list;
        } else {
          fieldIndex = 0;
          console.log(id)
          apiField.selectedValueIds = id;
          apiField.selectedVal = itemVal;
          apiField.selectedValues = itemVal;
          apiField.selectedIds = list;
          console.log(apiField)
        }
      }
      
      console.log(fieldName, itemVal, formVal, id, findex)
      if(responseFlag) {
        apiField.selectedValueIds = id;
        apiField.selectedValues = itemVal;
        apiField.selectedVal = itemVal;
      }
      if(fieldName != 'frameRange') {
        this.formFields[this.stepIndex][this.step][findex].formValue = formVal;
        this.formFields[this.stepIndex][this.step][findex].formValueIds = id;
        this.formFields[this.stepIndex][this.step][findex].formValueItems = itemVal;
      } else {
        apiField.selectedValueIds = id;
      }

      if(responseFlag) {
        this.responseData.addRow = false;
        this.sendResponse(fieldIndex);
      }
    });
  }

  // Attachments
  attachments(items, actionData:any = '', actionIndex:any = '', sindex:any = '') {
    console.log(this.apiFormFields, actionData, sindex)
    console.log(items)
    if(items.action == 'insert') {
      let minfo = items.media;
      let mindex = this.attachmentItems.findIndex(option => option.fileId == minfo.fileId);
      if(mindex < 0) {
        this.attachmentItems.push(minfo);
        this.pageInfo.attachmentItems = this.attachmentItems;
        this.attachmentFlag = false;
        setTimeout(() => {
          this.attachmentFlag = true;
        }, 10);
        let dindex = this.pageInfo.deletedFileIds.findIndex(option => option == minfo.fileId);
        if(dindex >= 0) {
          this.deletedFileIds.splice(dindex, 1);
          this.pageInfo.deletedFileIds = this.deletedFileIds;
        }
        let rindex = this.pageInfo.removeFileIds.findIndex(option => option.fileId == minfo.fileId);
        if(rindex >= 0) {
          this.removeFileIds.splice(rindex, 1);
          this.pageInfo.removeFileIds = this.removeFileIds;
        }
        this.responseData.action = 'media';
        this.responseData.type = 'updated-attachments';
        this.responseData.deletedFileIds = this.deletedFileIds;
        this.responseData.removeFileIds = this.removeFileIds; 
        this.commonApi.emitDynamicFieldResponse(this.responseData);
      }
    } else if(items.action == 'remove') {
      let rmindex = this.attachmentItems.findIndex(option => option.fileId == items.media);
      this.attachmentItems.splice(rmindex, 1);
      this.attachmentFlag = false;
        setTimeout(() => {
          this.attachmentFlag = true;
        }, 10);
      this.deletedFileIds.push(items.media);
      this.pageInfo.deletedFileIds = this.deletedFileIds;
      this.pageInfo.attachmentItems = this.attachmentItems;
      this.responseData.action = 'media';
      this.responseData.type = 'updated-attachments';
      this.responseData.deletedFileIds = this.deletedFileIds;
      this.responseData.removeFileIds = this.removeFileIds;
      this.commonApi.emitDynamicFieldResponse(this.responseData);
    } else {
      this.uploadedItems = items;
      let fieldIndex = (actionData == '') ? this.apiFormFields.findIndex(option => option.fieldName == 'uploadContents') : actionIndex;
      console.log(fieldIndex)
      this.responseData.uploadedItems = this.uploadedItems;
      let actionFlag = (actionData == '') ? false : true;
      let fieldData = (actionData == '') ? [] : actionData;
      if(actionData != '') {
        this.responseData.actionSecIndex = actionIndex;
        this.responseData.fieldSec = 'sib';
        this.responseData.fieldIndex = sindex;
        this.responseData.rowIndex = -1;
        this.responseData.addRow = false;
        this.responseData.addSec = false;
        console.log(this.responseData)
      }
      this.responseData.addRow = false;
      this.sendResponse(fieldIndex, actionFlag, actionIndex, fieldData);
    }
    
  }

  // Attachment Action
  attachmentAction(data, actionData:any = '', actionIndex:any = '', sindex:any = '') {
    console.log(this.apiFormFields, actionData, actionIndex, sindex)
    let action = data.action;
    let fileId = data.fileId;
    let caption = data.text;
    let url = data.url;
    let lang = data.language;
    if(actionData != '') {
      this.apiFormFields.mainActionItems[0].editIndex = actionIndex;
      this.responseData.fieldData = actionData;
      //let sflag: any = true;
      //localStorage.setItem('sibFieldUpdate', sflag);
    }
    switch (action) {
      case 'file-delete':
        this.deletedFileIds.push(fileId);
        this.responseData.secData = this.responseData.secData;
        break;
      case 'file-remove':
        this.removeFileIds.push(fileId);
        console.log(this.removeFileIds)
        this.responseData.secData = this.responseData.secData;
        break;
      case 'order':
        let attachmentList = data.attachments;
        for(let a in attachmentList) {
          let uid = parseInt(a)+1;
          let flagId = attachmentList[a].flagId;
          let ufileId = attachmentList[a].fileId;
          let caption = attachmentList[a].caption;
          let uindex = this.updatedAttachments.findIndex(option => option.fileId == ufileId);
          if(uindex < 0) {
            let fileInfo = {
              fileId: ufileId,
              caption: caption,
              url: (flagId == 6) ? attachmentList[a].url : '',
              displayOrder: uid
            };
            this.updatedAttachments.push(fileInfo);
          } else {
            this.updatedAttachments[uindex].displayOrder = uid;    
          }
        }
        break;  
      default:
        let updatedAttachmentInfo = {
          fileId: fileId,
          caption: caption,
          url: url,
          language: lang
        };
        let index = this.updatedAttachments.findIndex(option => option.fileId == fileId);   
        if(index < 0) {
          updatedAttachmentInfo['displayOrder'] = 0;
          this.updatedAttachments.push(updatedAttachmentInfo);
        } else {
          this.updatedAttachments[index].caption = caption;
          this.updatedAttachments[index].url = url;
          this.updatedAttachments[index].language = lang;
        }
        console.log(this.updatedAttachments)
        break;
    }
    setTimeout(() => {
      this.responseData.secAction = '';
      this.responseData.action = 'update';
      this.responseData.type = 'updated-attachments';
      this.responseData.updatedAttachments = this.updatedAttachments;
      this.responseData.deletedFileIds = this.deletedFileIds;
      this.responseData.removeFileIds = this.removeFileIds;
      this.responseData.addRow = false;
      this.responseData.uploadedItems = this.uploadedItems;
      this.responseData.formFields = this.formFields;
      this.responseData.formGroup = this.webForm;
      //this.sendResponse(0);
      this.commonApi.emitDynamicFieldResponse(this.responseData);
      setTimeout(() => {
        this.responseData.action = '';
        this.responseData.type = '';
        if(actionData != '')
          this.responseData.fieldData = '';
      }, 100);
    }, 100);
  }

  // Add Frame Row
  addFrameRow(fdata, secIndex, rowIndex, flag) {
    console.log(fdata, secIndex, rowIndex);
    if(!flag) {
      this.responseData.addRow = true;
      this.responseData.action = 'addRow';
      this.responseData.actionSecIndex = secIndex;
      this.responseData.rowIndex = rowIndex;
      console.log(this.formFields)
      this.sendResponse(0, true, secIndex);
      setTimeout(() => {
        this.responseData.action = '';
      }, 100);
    }      
  }

  // Remove Frame Row
  removeFrameRow(rowItems, actionIndex, rowIndex) {
    console.log(rowItems, actionIndex, rowIndex)
    let sibActionId = 0;
    let frameAactionId = 0;
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Remove Frame';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      if(receivedService) {
        let formField = this.formFields[this.stepIndex][this.step];
        let frameIndex = formField.findIndex(option => option.actionIndex == actionIndex && option.rowIndex == rowIndex && option.fieldName == 'id');
        frameAactionId = formField[frameIndex].formValue;
        console.log(frameAactionId)

        if(frameAactionId > 0) {
          let sibActIndex = formField.findIndex(option => option.actionIndex == actionIndex && option.rowIndex == -1 && option.fieldName == 'id');
          sibActionId = formField[sibActIndex].formValue;
          let apiData = {
            apiKey: this.pageInfo.apiKey,
            domainId: this.pageInfo.domainId,
            userId: this.pageInfo.userId,
            contentType: this.pageInfo.contentType,
            sibId: this.pageInfo.sibId,
            sibActionId: sibActionId,
            sibFrameNoId: frameAactionId
          };

          this.sibApi.deleteSib(apiData).subscribe((response) => {
            this.removingFrame(actionIndex, rowIndex, rowItems, formField);
          });
        } else {
          this.removingFrame(actionIndex, rowIndex, rowItems, formField);
        }
        
      }
    });
  }

  // Removing Frame Numbers
  removingFrame(actionIndex, rowIndex, rowItems, formField) {
    rowItems.splice(rowIndex, 1);
    formField = formField.filter(option => option.actionIndex <= actionIndex && option.rowIndex != rowIndex);
    //this.formFields[this.stepIndex][this.step] = formField;
    setTimeout(() => {
      let filteredRows = formField.filter(option => option.actionIndex === actionIndex && option.rowIndex > rowIndex);
      filteredRows.forEach(item => {
        item.rowIndex = item.rowIndex-1;
        if(item.fieldName == 'cutOffFrame') {
          let updateField = rowItems[item.rowIndex].cellAction[item.findex];
          let val = '';
          updateField.selectedValue = val;
          updateField.selectedVal = val;
          updateField.selectedValueIds = val;
        }
      }); 
      this.formFields[this.stepIndex][this.step] = formField;
      console.log(rowItems, formField);
    }, 50);
  }

  // SIB Section Action
  sibSectionAction(action, actionIndex, secData, id) {
    console.log(action, actionIndex, secData, id)
    switch (action) {
      case 'edit':
        localStorage.setItem('sibSectionData', JSON.stringify(secData));
        localStorage.setItem('formFields', JSON.stringify(this.formFields));  
        break;
      case 'delete':
        this.removeSIBAction(secData, actionIndex, id);
        return false;
        break;  
    }
    this.responseData.action = 'sibSecAction';
    this.responseData.fieldSec = 'sib';
    this.responseData.secAction = action;
    this.responseData.sectionIndex = this.secIndex;
    this.responseData.actionSecIndex = actionIndex;
    this.responseData.secData = secData;
    this.responseData.secid = id;
    this.commonApi.emitDynamicFieldResponse(this.responseData);
    setTimeout(() => {
      this.responseData.action = '';
    }, 100);
  }

  // Remove SIB Action
  removeSIBAction(actionItems, actionIndex, sibActionId) {
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'Remove SIB Action';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {
      modalRef.dismiss('Cross click');
      console.log(receivedService)
      if(receivedService) {
        let apiData = {
          apiKey: this.pageInfo.apiKey,
          domainId: this.pageInfo.domainId,
          userId: this.pageInfo.userId,
          contentType: this.pageInfo.contentType,
          sibId: this.pageInfo.sibId,
          sibActionId: sibActionId,
          sibFrameNoId: 0
        };

        this.sibApi.deleteSib(apiData).subscribe((response) => {
          actionItems.splice(actionIndex, 1);
          let formField = this.formFields[this.stepIndex][this.step];
          formField = formField.filter(option => option.actionIndex != actionIndex);
          setTimeout(() => {
            let filteredSec = formField.filter(option => option.actionIndex > actionIndex);
            filteredSec.forEach(item => {
              item.actionIndex = item.actionIndex-1;
            }); 
            this.formFields[this.stepIndex][this.step] = formField;
            console.log(actionItems, formField);
            this.secTabStatus.splice(actionIndex, 1);
            this.secTabStatus.forEach((tab, t) => {
              tab = false;
            });
            let cindex = (actionIndex == 0) ? actionIndex : actionIndex-1;
            this.secTabStatus[cindex] = true;
          }, 50);
        });
      }
    });
  }

  // Send Response
  sendResponse(fieldIndex, actionField:any =false, actionIndex:any = '', fieldData:any = '') {
    console.log(fieldIndex, fieldData, this.apiFormFields)
    let apiField = (actionField) ? this.apiFormFields.cells.sib[actionIndex].sibActions[fieldIndex] : this.apiFormFields[fieldIndex]; 
    this.responseData.fieldIndex = (fieldData == '') ? fieldIndex : this.responseData.fieldIndex;
    this.responseData.fieldData = apiField;
    this.responseData.formGroup = this.webForm;
    this.responseData.formFields = this.formFields;
    if(fieldData != '') {
      this.responseData.fieldData = fieldData;
    }
    this.commonApi.emitDynamicFieldResponse(this.responseData);
  }

  // Allow only numeric
  restrictNumeric(type, field, c, val, optIndex) {
    let res = this.commonApi.restrictNumeric(val);
    return res;
  }

  onTabClose(event) {
    console.log(event);
    console.log({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }

  onTabOpen(event) {
    console.log(event, this.apiFormFields, this.secTabStatus)
    let currIndex = event.index;
    let editIndex = this.apiFormFields.mainActionItems[0].editIndex;
    this.secTabStatus.forEach((tab, t) => {
      tab = false;
    });
    this.secTabStatus[currIndex] = true;
    this.apiFormFields.cells.sib.forEach((sitem, si) => {
      console.log(sitem, si, currIndex)
      let sibAct = sitem.sibActions;
      let sindex = sibAct.findIndex(option => option.fieldName == 'id');
      let sid = sibAct[sindex].selectedValues;
      let upindex = sibAct.findIndex(option => option.fieldName == 'uploadContents');
      sibAct[upindex].disabled = (si == currIndex) ? false : true;
      console.log(sid);
      if(si != currIndex) {
        sibAct.forEach(item => {
          item.saveFlag = false;
          if(item.fieldName == 'uploadContents') {
            item.disabled = true;
          }
        });
      } else {
        sibAct.forEach(sitem => {
          if(sid == 0) {
            sitem.saveFlag = true;
            if(sitem.fieldName == 'uploadContents') {
              //sitem.disabled = true;
            }
          }
        });
      }
    });
    console.log(this.apiFormFields.cells.sib)
    if(editIndex >= 0) {
      let secData = this.apiFormFields.cells.sib[editIndex];
      console.log(secData)
      this.sibSectionAction('save', editIndex, secData, 0);
    }
    console.log({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }

  // On File Upload
  onFileUpload(event, fieldData, sec){   
    let uploadFlag = true;
    this.selectedBannerImg = event.target.files[0];
    let type = this.selectedBannerImg.type.split('/');
    let type1 = type[1].toLowerCase();
    let fileSize = this.selectedBannerImg.size/1024/1024;
    this.invalidFileErr = "";
  
    if(fileSize > 8) {
      uploadFlag = false;
      this.invalidFileSize = true;
      this.invalidFileErr = "File size exceeds 2 MB"; 
    }
    
    if(uploadFlag) {
      if(type1 == 'jpg' || type1 == 'jpeg' || type1 == 'png' ){
        this.OnUploadFile(fieldData, sec);
      }
      else{
        this.invalidFile = true;
        this.invalidFileErr = "Allow only JPEG or PNG";
      }      
    }

    return false;
  }

  audioItem(event) {
    console.log(event)
  }

  OnUploadFile(fieldData, sec) {
    var reader = new FileReader();
    reader.readAsDataURL(this.selectedBannerImg); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result;
      this.imgName = null;
      this.defaultBanner = false;
      this.responseData['bannerImage'] = this.imgURL;
      this.responseData['bannerFile'] = this.selectedBannerImg;
      this.responseData['defaultBanner'] = this.defaultBanner;
      this.sendBannerData(fieldData, sec);
    }
  }

  // Remove Uploaded File
  deleteUploadedFile(fieldData, sec) {
    this.selectedBannerImg = null;
    this.imgURL = this.selectedBannerImg;
    this.imgName = null;
    this.defaultBanner = true;
    this.responseData['bannerImage'] = this.imgURL;
    this.responseData['bannerFile'] = this.selectedBannerImg;
    this.responseData['defaultBanner'] = this.defaultBanner;
    this.sendBannerData(fieldData, sec);
  }

  // Send Banner Data
  sendBannerData(fieldData, sec) {
    let fieldIndex = this.apiFormFields.findIndex(option => option.fieldName == fieldData.fieldName);
    this.responseData.fieldIndex = (fieldData == '') ? fieldIndex : this.responseData.fieldIndex;
    this.responseData.fieldData = fieldData;
    this.responseData.formGroup = this.webForm;
    this.responseData.formFields = this.formFields;
    this.responseData.type = 'banner';
    this.commonApi.emitDynamicFieldResponse(this.responseData);
    setTimeout(() => {
      this.responseData.type = '';
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
}