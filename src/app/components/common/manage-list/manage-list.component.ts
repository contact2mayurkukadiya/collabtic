import { Component, OnInit, ElementRef, HostListener, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScrollTopService } from '../../../services/scroll-top.service';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../../../services/common/common.service';
import { frameRange, countryCodes } from 'src/app/common/constant/constant';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationComponent } from "../../../components/common/confirmation/confirmation.component";

interface ActiveListdrop {
  name: string,
  code: string
}
@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.scss']
})
export class ManageListComponent implements OnInit {
  @ViewChild('focusInput') focusInput: ElementRef;
  productActiveListdrop: ActiveListdrop[];

  //selectedCity1: ActiveListdrop;
  //@Input() manageList: any;
  @Input() access: any;
  @Input() accessAction: boolean;
  @Input() apiData: any;
  @Input() inputData: any = [];
  @Input() checkboxFlag: boolean = true;
  @Input() emissionType: string = "";
  @Input() gtsAccess: boolean = false;
  @Input() height: number;
  @Input() filteredTags: any;
  @Input() filteredLists: any;
  @Input() filteredErrorCodes: any;
  @Input() commonApiValue: any = '';
  @Input() filteredModelsCount: any = '';
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();

  public countryCode: any;
  public countryCodeLists: any;
  public bodyElem;
  public selectedCity1;
  public bodyClass: string = "manage-list";
  public title: string = "";
  public addTxt: string = "New";
  public itemCode: string = "";
  public itemVal: string = "";
  public manageList = [];
  public listItems = [];
  public selectionList = [];
  public actionItems = [];

  public clearFlag: boolean = false;
  public actionFlag: boolean = false;
  public activeListshow: boolean = true;
  public submitActionFlag: boolean = false;
  public listFlag: any = null;
  public itemAction: string = "";
  public successMsg: string = "";
  public success: boolean = false;
  public loading: boolean = true;
  public lazyLoading: boolean = false;
  public empty: boolean = false;
  public searchNew: boolean = false;
  public listTotal: number;
  public ws = [];
  public vehicle: string = "";

  public techInfoFlag: boolean = false;
  public tagFlag: boolean = false;
  public vinFlag: boolean = false;
  public dynamicOptions: boolean = false;
  public errorCodeFlag: boolean = false;
  public lookUpdataFlag: boolean = false;
  public escloopUpFlag: boolean = false;

  public partFlag: boolean = false;
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchInputFlag: boolean = false;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public listAction: boolean = false;
  public assetPath: string = 'assets/images';
  public separatorPath: string = `${this.assetPath}/matrix/chevron.png`;
  public separatorImg: any;
  public headercheckDisplay: string = "checkbox-hide";
  public headerCheck: string = "unchecked";
  public emptyIndex: any = '-1';

  public inputMaxLen: any = '50';
  public offset: number = 0;
  public DisableText: string = 'Disable';
  public limit: number = 20;
  public scrollInit: number = 0;
  public lastScrollTop: number = 0;
  public scrollTop: number;
  public scrollCallback: boolean = true;
  public itemLength: number = 0;
  public itemTotal: number;
  public closeFlag: boolean = false;
  public selection: string = "multiple";
  public TVSDomain: boolean = false;
  public TVSIBDomain: boolean = false;
  public modalConfig: any = {backdrop: 'static', keyboard: true, centered: true};
  // convenience getter for easy access to form fields
  get f() { return this.searchForm.controls; }

  // Scroll Down
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let inHeight = event.target.offsetHeight + event.target.scrollTop;
    let totalHeight = event.target.scrollHeight - (this.offset * 8);
    this.scrollTop = event.target.scrollTop - 80;
    if (this.scrollTop > this.lastScrollTop && this.scrollInit > 0) {
      if (inHeight >= totalHeight && this.scrollCallback && this.itemTotal > this.itemLength) {
        this.lazyLoading = true;
        this.scrollCallback = false;
        let i = -2;
        switch (this.access) {
          case 'Tags':
          case 'New Thread Tags':
            this.getTagInfo(i);
            break;
          case 'Error Codes':
          case 'New Thread Error Codes':
            this.errorCodeFlag = true;
            this.getErrorCodes(i);
            break;
          case 'New Parts':
            this.partFlag = true;
            this.getData(i);
            break;
          case 'techinfo':
            this.techInfoFlag = true;
            this.getData(i);
            break;
          case 'mediaUpload':
            this.tagFlag = true;
            this.getData(i);
            break;
          case 'newthread':
            if (this.title != 'Frame Range') {
              this.getData(i);
            }
            break;  
          case 'gtsDynamicOptions':
            //
            break;
        }
      }
    }
    this.lastScrollTop = this.scrollTop;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private scrollTopService: ScrollTopService,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    let platformId = localStorage.getItem("platformId");
    let domainId = localStorage.getItem("domainId");
    this.TVSDomain = (platformId == '2' && domainId == '52') ? true : false;
    this.TVSIBDomain = (platformId == '2' && domainId == '97') ? true : false;

    this.bodyElem = document.getElementsByTagName('body')[0];
    this.separatorImg = `<img src="${this.separatorPath}" />`;
    this.selectedCity1 = 'Active';
    this.countryCodeLists = countryCodes;
    this.countryCode = this.countryCodeLists[5];
    //console.log(this.countryCodeLists)
    // this.productActiveListdrop = [{label: 'Active', value: 'Active'},{label: 'In Active', value: 'In Active'}]
    this.productActiveListdrop = [
      { name: 'Active', code: 'NY' },
      { name: 'In Active', code: 'RM' }
    ];
    this.bodyElem.classList.add(this.bodyClass);
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });
    this.listTotal = this.manageList.length;
    localStorage.removeItem('newItem');
    localStorage.removeItem('searchVal');
    this.selectionList = [];
    this.listAction = this.accessAction;
    this.height = this.height - 120;
    let index = 0;
    setTimeout(() => {
      this.searchInputFlag = true;
    }, 100);
    console.log(this.access, this.inputData, Object.keys(this.inputData).length, this.filteredTags, this.filteredLists)
    this.selection = (Object.keys(this.inputData).length > 0) ? this.inputData.selectionType : this.selection;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.tagFlag = true;
        this.title = (this.access == 'Tags') ? this.access : this.inputData.title;
        if (this.access == 'New Thread Tags') {
          this.filteredTags = this.inputData.filteredItems;
          this.filteredLists = this.inputData.filteredLists;
        } else {
          this.filteredTags = (this.filteredTags.length == 0) ? [] : this.filteredTags;
        }
        console.log(this.filteredTags)

        this.getTagInfo(index);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
        console.log(this.inputData)
        this.title = (this.access == 'Error Codes') ? this.access : this.inputData.title;
        this.errorCodeFlag = true;
        if (this.access == 'New Thread Error Codes') {
          this.filteredErrorCodes = this.inputData.filteredItems;
          this.filteredLists = this.inputData.filteredLists;
        } else {
          this.filteredErrorCodes = (this.filteredErrorCodes.length == 0) ? [] : this.filteredErrorCodes;
          this.filteredLists = this.filteredErrorCodes;
        }
        this.getErrorCodes(index);
        break;
      //for Product matrix
      case 'LookupDataPM':
        this.title = this.apiData.lookupHeaderName;
        this.lookUpdataFlag = true;
        this.getLookUpInfo(index);
        break;
      case 'newthread':
        this.title = this.inputData.title;
        this.tagFlag = (this.title == 'Recent VINs') ? false : true;
        this.vinFlag = (this.title == 'Recent VINs') ? true : false;
        this.filteredTags = (this.inputData.filteredItems == '') ? [] : this.inputData.filteredItems;
        this.filteredLists = (this.inputData.filteredLists == '') ? [] : this.inputData.filteredLists;
        console.log(this.filteredModelsCount);
        this.filteredModelsCount = (this.inputData.filteredModelsCount == '') ? [] : this.inputData.filteredModelsCount;
        this.inputMaxLen = (this.inputData.field == 'complaintCategory') ? '100' : this.inputMaxLen;
        if (this.title != 'Frame Range') {
          this.getData(index);
        } else {
          this.manageList = frameRange;
          this.initList('init', this.manageList);
        }
        break;
      case 'gtsDynamicOptions':
        this.title = this.inputData.title;
        this.dynamicOptions = true;
        this.getData(index);
        break;
      case 'Error Codes':
      case 'New Parts':
        console.log(this.inputData)
        this.title = this.inputData.title;
        this.partFlag = true;
        this.filteredErrorCodes = this.inputData.filteredItems;
        this.filteredLists = this.inputData.filteredLists;
        this.getData(index);
        break;
      case 'techinfo':
        this.title = this.inputData.title;
        this.techInfoFlag = true;
        this.filteredTags = this.inputData.filteredItems;
        this.filteredLists = this.inputData.filteredLists;
        this.getData(index);
        break;
      case 'PartType':
      case 'PartAssembly':
      case 'PartSystem':
        this.tagFlag = true;
        this.title = this.inputData.title;
        this.getData(index);
        break;
      case 'mediaUpload':  
        this.tagFlag = true;
        this.title = this.inputData.title;
        this.filteredTags = this.inputData.filteredItems;
        this.filteredLists = this.inputData.filteredLists;
        this.getData(index);
        break;  
    }

    setTimeout(() => {
      //this.initList('init', this.manageList);
    }, 500);
  }

  // Get Tag Info
  getTagInfo(index) {
    console.log(index)
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        thread_type: this.apiData.threadType,
        groupId: this.apiData.groupId,
        searchKey: this.searchVal,
        offset: this.offset,
        limit: this.limit
      }

      this.commonApi.getTagList(apiData).subscribe((response) => {
        let resultData = response.data;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = resultData.tags;
        for (let res in list) {
          this.manageList.push(list[res]);
        }
        let initText = (index == 0) ? 'init' : 'get';

        //console.log(this.selectionList);
        if (index <= 0) {
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += itemListLen;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          this.manageTag('new', 0);
        }
      });
    }
  }

  getLookUpInfo(index) {
    this.loading = true;
    let apiData = {
      apiKey: this.apiData.apiKey,
      domainId: this.apiData.domainId,
      countryId: this.apiData.countryId,
      userId: this.apiData.userId,
      lookUpdataId: this.apiData.lookUpdataId,
      searchKey: this.searchVal,
      isInActive: this.activeListshow,
      offset: this.offset,
      limit: this.limit
    }

    this.commonApi.getLoopUpDataList(apiData).subscribe((response) => {
      // let resultData = response.data;
      this.manageList = [];
      this.manageList = response.loopUpData;

      let initText = (index == 0) ? 'init' : 'get';
      this.initList(initText, this.manageList);
      //console.log(this.selectionList);
      let itemListLen1 = this.manageList.length;
      this.empty = (itemListLen1 < 1) ? true : false;
      if (this.empty) {
        this.successMsg = response.result;
      }
      if (index < 0) {
        let itemListLen = this.manageList.length;
        this.empty = (itemListLen < 1) ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        }
      }

      if (this.searchNew) {
        this.manageTag('new', 0);
      }
    });
  }


  getEscLookUpInfo(index) {
    this.loading = true;
    let apiData = {
      apiKey: this.apiData.apiKey,
      domainId: this.apiData.domainId,
      countryId: this.apiData.countryId,
      userId: this.apiData.userId,
      commonApiValue: this.apiData.commonApiValue,
      searchKey: this.searchVal,

      offset: this.offset,
      limit: this.limit
    }

    this.commonApi.getEscalationLoopUpDataList(apiData).subscribe((response) => {
      // let resultData = response.data;
      this.manageList = [];
      this.manageList = response.items;

      let initText = (index == 0) ? 'init' : 'get';
      this.initList(initText, this.manageList);
      //console.log(this.selectionList);
      let itemListLen1 = this.manageList.length;
      this.empty = (itemListLen1 < 1) ? true : false;
      if (this.empty) {
        this.successMsg = response.result;
      }
      if (index < 0) {
        let itemListLen = this.manageList.length;
        this.empty = (itemListLen < 1) ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        }
      }

      if (this.searchNew) {
        this.manageTag('new', 0);
      }
    });
  }

  // Get Error Code
  getErrorCodes(index) {
    console.log(index)
    if (index == -3) {
      this.initList('init', this.manageList);
    } else {
      this.loading = true;
      this.scrollTop = 0;
      this.lastScrollTop = this.scrollTop;
      console.log(this.apiData.type)
      this.apiData.type = (this.apiData.type == undefined || this.apiData.type == 'undefined') ? '' : this.apiData.type;
      this.apiData.typeId = (this.apiData.typeId == undefined || this.apiData.typeId == 'undefined') ? [] : this.apiData.typeId;
      let apiData = {
        apiKey: this.apiData.apiKey,
        domainId: this.apiData.domainId,
        countryId: this.apiData.countryId,
        userId: this.apiData.userId,
        vehicleInfo: this.apiData.vehicleInfo,
        searchKey: this.searchVal,
        type: this.apiData.type,
        typeId: this.apiData.typeId,
        offset: this.offset,
        limit: this.limit
      }
      console.log(apiData, Array.isArray(this.apiData.typeId))

      this.commonApi.getErrorCodes(apiData).subscribe((response) => {
        let resultData = response;
        this.manageList = (index >= -1) ? [] : this.manageList;
        let list = resultData.errorCodes;
        for (let res in list) {
          this.manageList.push(list[res]);
        }
        let initText = (index == 0) ? 'init' : 'get';
        console.log(index, this.selectionList)
        if (index <= 0) {
          //this.searchVal = '';
          let itemListLen = this.manageList.length;
          this.empty = (itemListLen < 1) ? true : false;
          if (this.empty) {
            this.successMsg = response.result;
          } else {
            this.scrollCallback = true;
            this.scrollInit = 1;
            this.itemTotal = resultData.total;
            this.itemLength += resultData.errorCodes.length;
            this.offset += this.limit;
          }
        }

        setTimeout(() => {
          this.initList(initText, this.manageList);
        }, 50);

        if (this.searchNew) {
          //this.manageErrorCode('new', 0);
        }
      });
    }
  }

  // Initiate Manage List
  initList(action, manageList) {
    console.log(this.access, manageList, this.filteredTags, this.filteredModelsCount)
    let start = 0;
    let end = 0;
    this.listItems = [];
    this.listItems = manageList;
    let newFlag = localStorage.getItem('newItem');
    this.searchForm.value.searchKey = (newFlag) ? '' : this.searchForm.value.searchKey;
    this.searchVal = this.searchForm.value.searchKey;
    let checkDisplayFlag = (action == 'get') ? true : false;
    console.log(action, newFlag)
    switch (action) {
      case 'get':
        start = this.offset - this.limit
        end = this.offset - 1;
        break;

      default:
        end = manageList.length - 1;
        break;
    }

    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
      case 'newthread':
      case 'New Parts':
      case 'techinfo':
      case 'PartType':
      case 'PartAssembly':
      case 'PartSystem':
      case 'mediaUpload':  
        console.log(this.listItems)
        for (let m in this.listItems) {
          if (start <= parseInt(m) && end >= parseInt(m)) {
            let i: any = m;
            this.listItems[m]['action'] = "";
            let field = this.inputData.field;
            console.log(field);
            switch (field) {
              case 'colour':
              case 'info-1':
              case 'info-2':
              case 'info-3':
              case 'info-4':
              case 'info-5':
              case 'info-6':
              case 'info-7':
                this.listItems[m]['editAccess'] = 1;
                break;
              case 'escalationLookup':
                this.listItems[m]['productModelsCount'] = this.listItems[m]['productModelsCount'];
                break;
            }

            this.listItems[m]['displayFlag'] = true;
            this.listItems[m]['checkFlag'] = false;
            this.listItems[m]['itemExists'] = false;
            this.listItems[m]['activeMore'] = false;
            this.listItems[m]['actionFlag'] = false;
            if (this.access == 'newthread' && (this.inputData.field == 'supplier' || this.inputData.field == 'vehicleManufector' || this.inputData.field == 'vehicleType' || this.inputData.field == 'EngineCode' || this.inputData.field == 'KBAnumber')) {
              this.listItems[m]['editAccess'] = 1;
            }
            if (this.access == 'newthread' && (this.inputData.field == 'escalationLookup' || this.inputData.field == 'model' || this.inputData.field == 'PartModel')) {
              switch (this.inputData.field) {
                case 'model':
                  this.listItems[m]['id'] = this.listItems[m]['modelName'];
                  this.listItems[m]['name'] = this.listItems[m]['modelName'];
                  break;
                case 'escalationLookup':
                  this.listItems[m]['id'] = this.listItems[m]['id'];
                  this.listItems[m]['name'] = this.listItems[m]['name'];
                  this.listItems[m]['productModelsCount'] = this.listItems[m]['productModelsCount'];
                  break;
                default:
                  let modelData = this.listItems[m]['modelItems'][0];
                  this.listItems[m]['id'] = modelData.id;
                  this.listItems[m]['name'] = modelData.name;
                  break;
              }
            }

            if (this.access == 'techinfo') {
              this.listItems[m]['phoneNo'] = this.listItems[m]['phoneNo'];
            }

            for (let t of this.filteredTags) {
              if (t == this.listItems[m].id) {
                this.listItems[m]['checkFlag'] = true;
                if (this.access == 'newthread' && (this.inputData.field == 'escalationLookup')) {
                  this.selectionList.push({
                    id: t,
                    name: this.listItems[m].name,
                    productModelsCount: this.listItems[m]['productModelsCount']
                  });
                  console.log('in', t)
                  //this.setupFilteredItems(t);
                }
                else {
                  this.selectionList.push({
                    id: t,
                    name: this.listItems[m].name
                  });
                  console.log('in', t)
                  //this.setupFilteredItems(t);
                }

              }
            }
            if (action == 'get' || action == 'init') {
              for (let st of this.selectionList) {
                if (st.id == this.listItems[m].id) {
                  this.listItems[m]['checkFlag'] = true;
                }
              }
            }
          }
        }

        if (action == 'get' && this.inputData.selectionType == 'single') {
          //this.selectedItems.emit(this.selectionList);
          //this.activeModal.dismiss('Cross click');
        }

        if (newFlag != null && newFlag != 'undefined' && newFlag != undefined) {
          let action = 'new';
          this.submitActionFlag = true;
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem('searchVal');
          console.log(sval)
          this.searchVal = "";
          this.submitActionFlag = (sval == null) ? false : true;
          this.itemVal = sval;
          let newTag = {
            id: 0,
            name: sval,
            editAccess: 0,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false
          };
          this.listItems.unshift(newTag);
          this.empty = false;
          localStorage.removeItem('newItem');
          if (action == 'new' && sval != null) {
            this.checkTagExists(0, sval);
          }
        }

        setTimeout(() => {
          if (this.selection == 'multiple' || this.selection == 'single') {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
          }
        }, 500);
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        //this.listItems = manageList;
        for (let m in this.listItems) {
          if (start <= parseInt(m) && end >= parseInt(m)) {
            let i: any = m;
            this.listItems[m]['action'] = "";
            this.listItems[m]['editAccess'] = 1;
            this.listItems[m]['displayFlag'] = true;
            this.listItems[m]['checkFlag'] = false;
            this.listItems[m]['itemExists'] = false;
            this.listItems[m]['activeMore'] = false;
            this.listItems[m]['actionFlag'] = false;
            console.log(this.filteredLists, this.filteredErrorCodes)
            for (let t of this.filteredErrorCodes) {
              console.log(t, this.listItems[m].id)
              let eid = this.listItems[m].id;
              let name = this.listItems[m].code + ' - ' + this.listItems[m].desc;
              name = (this.gtsAccess) ? `${this.listItems[m].type_name} - ${name}` : name;
              if (t == eid) {
                let ename = `${this.listItems[m].code}##${this.listItems[m].desc}`;
                this.listItems[m]['checkFlag'] = true;
                this.selectionList.push({
                  id: t,
                  name: name,
                  ename: ename
                });
                //this.setupFilteredItems(t);
              }
            }
            if (action == 'get') {
              for (let st of this.selectionList) {
                if (st.id == this.listItems[m].id) {
                  this.listItems[m]['checkFlag'] = true;
                }
              }
            }
          }
        }

        if (newFlag != null && newFlag != 'undefined' && newFlag != undefined) {
          let action = 'new';
          this.submitActionFlag = true;
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem('searchVal');
          this.submitActionFlag = (sval == null) ? false : true;
          this.itemVal = sval;
          let newErrorCode = {
            id: 0,
            name: sval,
            editAccess: 1,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false
          };
          this.listItems.unshift(newErrorCode);
          localStorage.removeItem('newItem');
        }

        setTimeout(() => {
          if (this.selection == 'multiple' || this.selection == 'single') {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
          }
        }, 500);
        break;

      case 'LookupDataPM':


        this.listItems = manageList;


        for (let m in this.listItems) {
          let i: any = m;
          this.listItems[m]['action'] = "";
          this.listItems[m]['displayFlag'] = true;
          this.listItems[m]['checkFlag'] = false;
          this.listItems[m]['itemExists'] = false;
          this.listItems[m]['activeMore'] = false;
          this.listItems[m]['actionFlag'] = false;
          //console.log(this.filteredTags)
          /*for(let t of this.filteredTags) {
            if(t == this.listItems[m].id) {
              this.listItems[m]['checkFlag'] = true;
              this.selectionList.push({
                id: t,
                name: this.listItems[m].name
              });
            }
          }
          */
          if (action == 'get') {
            for (let st of this.selectionList) {
              if (st.id == this.listItems[m].id) {
                this.listItems[m]['checkFlag'] = true;
              }
            }
          }
        }

        setTimeout(() => {
          if (this.filteredTags.length > 0) {
            this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
            this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : 'checkbox-show';
          }
        }, 500);
        break;
    }
    setTimeout(() => {
      this.loading = false;
      this.lazyLoading = this.loading;
    }, 500);
  }

  // Item Selection
  itemSelection(type, index, id, flag) {
    this.clearFlag = false;
    console.log(this.access, this.selectionList);
    console.log(type + ' :: ' + index + ' :: ' + id + ' :: ' + flag + ' :: ' + this.selection)
    let field = this.inputData.field;
    console.log(field);
    switch (type) {
      case 'single':
        if (this.selection == 'single') {
          let emitFlag = true;
          if (flag) {
            this.headerCheck = 'checked';
            this.selectionList = [];
            switch (field) {
              case 'model':
              case 'PartModel':
                let item = this.listItems[index];
                this.selectionList.push({
                  id: this.listItems[index].id,
                  name: this.listItems[index].name,
                  catg: item.CategoryId,
                  subCatg: item.SubcategoryId,
                  prodType: item.productType,
                  regions: item.regions,
                  make: item.makeName,
                  makeItems: item.makeItems
                });
                break;
              case 'vinNo':
                this.selectionList.push(this.listItems[index]);
                break;

              default:
                this.selectionList.push({
                  id: this.listItems[index].id,
                  name: this.listItems[index].name
                });
                break;
            }
          } else {
            switch (field) {
              case 'model':
              case 'PartModel':
              case 'vinNo':
              case 'escalationLookup':
                emitFlag = false;
                break;
              default:
                emitFlag = true;
                break;
            }
            this.headerCheck = 'checked';
            this.selectionList = [];
          }
          console.log(emitFlag)
          console.log(this.selectionList)
          if (emitFlag) {
            this.applySelection('trigger');
          }
        } else {
          this.listItems[index].checkFlag = flag;
          if (this.activeListshow == true) {
            this.DisableText = 'Disable';
          } else {
            this.DisableText = 'Enable';
          }
          if (!flag) {
            let rmIndex = this.selectionList.findIndex(option => option.id == id);
            this.selectionList.splice(rmIndex, 1);
            let rmIndex1 = this.filteredTags.findIndex(option => option.id == id);
            this.filteredTags.splice(rmIndex1, 1);
            //this.setupFilteredItems(this.listItems[index].id);
            setTimeout(() => {
              this.headerCheck = (this.selectionList.length == 0) ? 'unchecked' : 'checked';
              if (this.activeListshow == true) {
                this.DisableText = 'Disable';
              } else {
                this.DisableText = 'Enable';
              }
              this.headercheckDisplay = (this.selectionList.length == 0) ? 'checkbox-hide' : this.headercheckDisplay;
            }, 100);
          } else {
            console.log(this.listItems[index])
            let name = (this.access != 'Error Codes' && this.access != 'New Thread Error Codes') ? this.listItems[index].name : this.listItems[index].code + ' - ' + this.listItems[index].desc;
            name = (this.gtsAccess) ? `${this.listItems[index].type_name} - ${name}` : name;
            if (this.access == 'New Thread Error Codes') {
              let ename = `${this.listItems[index].code}##${this.listItems[index].desc}`;
              this.selectionList.push({
                id: this.listItems[index].id,
                name: name,
                ename: ename
              });
            } else {
              console.log(this.listItems[index].id)
              switch (field) {
                case 'prodCode':
                  let item = this.listItems[index];
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: this.listItems[index].name,
                    prodType: item.prodType,
                    model: item.model
                  });
                  break;
                case 'escalationLookup':
                  console.log(this.listItems);
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: name,
                    productModelsCount: this.listItems[index].productModelsCount
                  });
                  break;
                default:
                  this.selectionList.push({
                    id: this.listItems[index].id,
                    name: name
                  });
                  break;
              }
            }

            if (this.access == 'newthread' && this.selection == 'single') {
              let field = this.inputData.field;
              switch (field) {
                case 'model':
                case 'PartModel':
                  let item = this.listItems[index];
                  this.selectionList[0]['catg'] = item.CategoryId;
                  this.selectionList[0]['subCatg'] = item.SubcategoryId;
                  this.selectionList[0]['prodType'] = item.productType;
                  this.selectionList[0]['regions'] = item.regions;
                  this.selectionList[0]['make'] = item.makeName;
                  this.selectionList[0]['makeItems'] = item.makeItems;
                  break;
              }
            }
            this.headercheckDisplay = "checkbox-show";
            this.headerCheck = (this.selectionList.length == this.listItems.length) ? 'all' : 'checked';
            this.headercheckDisplay = (this.selectionList.length > 0) ? 'checkbox-show' : 'checkbox-hide';
          }
        }
        this.clearFlag = (this.selectionList.length == 0) ? true : false;
        break;
      case 'all':
        this.selectionList = [];
        if (this.activeListshow == true) {
          this.DisableText = 'Disable';
        } else {
          this.DisableText = 'Enable';
        }
        this.headercheckDisplay = 'checkbox-show';
        if (flag == 'checked') {
          if (this.listItems.length > 0) {
            this.headerCheck = 'all';
            this.itemChangeSelection(this.headerCheck);
          }
        } else if (flag == 'all') {
          this.headerCheck = 'unchecked';
          this.headercheckDisplay = 'checkbox-hide';
          this.clearFlag = true;
          this.itemChangeSelection(this.headerCheck);
        } else {
          this.headerCheck = 'all';
          this.itemChangeSelection(this.headerCheck);
        }
        break;
    }
    console.log(this.selectionList)
  }

  // Item Selection (Empty, All)
  itemChangeSelection(action) {
    if (this.access == 'LookupDataPM') {
      for (let m of this.listItems) {
        if (action != 'empty' && action != 'unchecked') {
          if (m.editAccess == 1) {
            this.selectionList.push({
              id: m.id,
              name: m.name
            });
          }
        }
        m.checkFlag = (action == 'all') ? true : false;
      }
    } else {
      console.log(action)
      for (let m of this.listItems) {
        if (action != 'empty' && action != 'unchecked') {
          this.selectionList.push({
            id: m.id,
            name: m.name
          });
        }
        m.checkFlag = (action == 'all') ? true : false;
      }
    }
  }

  // Manage List
  manageListItem(action, index) {
    console.log(this.access)
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.manageTag(action, index);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
      case 'New Parts':
      case 'techinfo':
        this.itemCode = (action == 'new') ? "" : this.itemCode;
        this.manageErrorCode(action, index);
        break;
      case 'LookupDataPM':
        this.manageLoopUpData(action, index);
        break;
      case 'newthread':
        this.manageItem(action, index);
        break;
    }
  }

  // Add, Edit, Cancel Item
  manageItem(action, index) {
    console.log(action, index);
    switch (action) {
      case 'new':
        if (this.empty) {
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          this.searchNew = true;
          this.clearSearch(action);
        }
        else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newTag = {
              id: 0,
              name: sval,
              editAccess: 0,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newTag);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            if (action == 'new' && sval != null) {
              this.checkItemExists(index, sval);
            }
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        console.log(this.apiData, this.itemVal)
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let editAction: any = (id > 0) ? 1 : 0;
          let apiData = {
            apiKey: this.apiData['apiKey'],
            userId: this.apiData['userId'],
            domainId: this.apiData['domainId'],
            countryId: this.apiData['countryId'],
            isEdit: editAction,
            isValidate: 0
          };
          if (id > 0) {
            apiData['id'] = id;
          }
          switch (this.inputData.field) {
            case 'model':
            case 'PartModel':
              apiData['MakeName'] = this.apiData.makeName;
              apiData['ModelName'] = this.itemVal;
              break;
            case 'colour':
              if (id > 0) {
                apiData['colorValueId'] = id;
              }
              apiData['colorValueName'] = this.itemVal;
              apiData['workstreamList'] = [];
              break;
            case 'info-1':
            case 'info-2':
            case 'info-3':
            case 'info-4':
            case 'info-5':
            case 'info-6':
            case 'info-7':
              if (id > 0) {
                apiData['infoId'] = id;
              }
              apiData['infoName'] = this.itemVal;
              apiData['workstreamList'] = [];
              this.listItems[index].name = this.itemVal;
              break;
            default:
              let query = this.inputData.actionQueryValues;
              if (query != '') {
                let queryVal = JSON.parse(query);
                if (id > 0) {
                  apiData[queryVal[0]] = id;
                }
                apiData[queryVal[1]] = this.itemVal;
                apiData[queryVal[2]] = '';
                apiData['workstreamList'] = JSON.stringify(this.ws);
                queryVal.forEach(q => {
                  switch (q) {
                    case 'commonApiValue':
                      apiData[q] = this.commonApiValue;
                      break;
                  }
                });
              }
              break;
          }
          this.manageAction(index, apiData);
        }
        break;
    }
  }

  // Add, Edit, Cancel Tag
  manageTag(action, index) {
    console.log(this.actionFlag, action, this.empty)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.searchNew = true;
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          //if (!this.empty)
          this.clearSearch(action);
        } else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newTag = {
              id: 0,
              name: sval,
              editAccess: 0,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newTag);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            if (action == 'new' && sval != null) {
              this.checkTagExists(index, sval);
            }
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          this.listItems.splice(rmIndex, 1);
          index = index - 1;
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'tagName': this.itemVal,
            'id': id
          };
          this.manageAction(index, apiData);
        }
        break;
    }
  }

  manageLoopUpData(action, index) {
    //console.log(action)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.searchNew = true;
          this.clearSearch();
          //this.getTagInfo(index);
          setTimeout(() => {
            this.empty = false;
            this.submitActionFlag = true;
          }, 750);
        }

        if (!this.actionFlag && !this.empty) {
          this.searchNew = false;
          this.actionFlag = true;
          this.itemAction = action;
          let sval = localStorage.getItem('searchVal');
          this.submitActionFlag = (sval == null) ? false : true;
          this.itemVal = sval;
          let newTag = {
            id: 0,
            name: sval,
            editAccess: 0,
            displayFlag: true,
            action: action,
            activeMore: false,
            actionFlag: false,
            itemExists: false
          };
          this.listItems.unshift(newTag);
          let el = document.getElementById('manageTable');
          el.scrollTo(0, 0);
          this.inputFocus();
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        this.itemVal = this.listItems[index].name;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        console.log(this.listItems[index])
        //console.log(this.submitActionFlag)
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'lookUpdataName': this.itemVal,
            'lookUpTableId': this.apiData['lookUpdataId'],
            'selectionList': '',
            'isInActive': this.activeListshow,
            'id': id,
            'title': this.title
          };

          this.manageAction(index, apiData);
        }
        break;
      case 'disable':
        //console.log(this.listItems[index])
        //console.log(this.submitActionFlag)

        // let id = this.listItems[index].id;
        let apiData = {
          'apiKey': this.apiData['apiKey'],
          'userId': this.apiData['userId'],
          'domainId': this.apiData['domainId'],
          'countryId': this.apiData['countryId'],
          'lookUpdataName': '',
          'selectionList': JSON.stringify(this.selectionList),
          'isInActive': this.activeListshow,
          'lookUpTableId': this.apiData['lookUpdataId'],
          'title': this.title
        };

        this.manageAction(index, apiData);

        break;
    }
  }

  applychangeValue(event) {
    //alert(event.value.name);
    if (event.value.name == 'In Active') {
      this.activeListshow = false;
      this.getLookUpInfo(0);
      this.selectionList = [];
    }
    if (event.value.name == 'Active') {
      this.selectionList = [];
      this.activeListshow = true;
      this.getLookUpInfo(0);
    }

  }
  applySelectionActive() {
    this.selectionList = [];
    this.activeListshow = true;
    this.getLookUpInfo(0);
  }
  applySelectionInActive() {
    this.activeListshow = false;
    this.getLookUpInfo(0);
    this.selectionList = [];
  }

  // Add, Edit, Cancel Tag
  manageErrorCode(action, index) {
    //console.log(action)
    switch (action) {
      case 'new':
        if (this.empty) {
          this.itemCode = "";
          this.itemVal = "";
          this.searchNew = true;
          let newFlag: any = true;
          localStorage.setItem('newItem', newFlag);
          this.clearSearch(action);
        } else {
          if (!this.actionFlag && !this.empty) {
            this.searchNew = false;
            this.actionFlag = true;
            this.itemAction = action;
            let sval = localStorage.getItem('searchVal');
            this.submitActionFlag = (sval == null) ? false : true;
            this.itemVal = sval;
            let newErrorCode = {
              id: 0,
              name: sval,
              editAccess: 1,
              displayFlag: true,
              action: action,
              activeMore: false,
              actionFlag: false,
              itemExists: false
            };
            this.listItems.unshift(newErrorCode);
            let el = document.getElementById('manageTable');
            el.scrollTo(0, 0);
            this.inputFocus();
          }
        }
        break;
      case 'edit':
        this.itemAction = action;
        this.actionFlag = true;
        this.submitActionFlag = true;
        console.log(this.listItems)
        this.itemCode = this.listItems[index].code;
        this.itemVal = this.listItems[index].desc;
        this.listItems[index].action = action;
        let rmIndex = 0;
        if (this.listItems[rmIndex].action == 'new') {
          index = index - 1;
          this.listItems.splice(rmIndex, 1);
        }

        /*this.selectionList = [];
        this.headerCheck = 'unchecked';
        this.headercheckDisplay = 'checkbox-hide';*/

        for (let m in this.listItems) {
          this.listItems[m].action = (index != m) ? '' : 'edit';
          //this.listItems[m].checkFlag = false;
        }

        break;
      case 'cancel':
        localStorage.removeItem('searchVal');
        this.searchVal = "";
        this.itemCode = "";
        this.itemVal = "";
        this.actionFlag = false;
        this.submitActionFlag = false;
        console.log(this.headerCheck)
        console.log(this.selectionList)
        if (this.listItems[index].action == 'new') {
          this.listItems.splice(index, 1);
        } else {
          this.listItems[index].action = "";
          this.listItems[index].activeMore = false;
        }
        break;
      case 'submit':
        if (this.submitActionFlag) {
          let id = this.listItems[index].id;
          let apiData = {
            'apiKey': this.apiData['apiKey'],
            'userId': this.apiData['userId'],
            'domainId': this.apiData['domainId'],
            'countryId': this.apiData['countryId'],
            'id': id
          };

          if (this.access == 'New Parts' || this.access == 'techinfo') {
            let queryVal = JSON.parse(this.inputData.actionQueryValues);
            apiData[queryVal[1]] = this.itemCode;
            apiData[queryVal[2]] = this.itemVal;
            apiData[queryVal[3]] = this.access == 'techinfo' ? localStorage.getItem('dealerCode') : this.vehicle;
            apiData['isValidate'] = 0;
          }

          console.log(apiData)
          

          this.manageAction(index, apiData);
        }
        break;
    }
  }

  // Manage Action
  manageAction(index, apiData) {
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    //console.log(index);
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        let tagData = new FormData();
        let isValidate: any = 0;
        let name = this.itemVal;
        tagData.append('apiKey', apiData.apiKey);
        tagData.append('userId', apiData.userId);
        tagData.append('domainId', apiData.domainId);
        tagData.append('countryId', apiData.countryId);
        tagData.append('tagName', apiData.tagName);
        tagData.append('workstreamList', JSON.stringify(this.ws));
        tagData.append('vehicleInfo', this.vehicle);
        tagData.append('isValidate', isValidate);
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          tagData.append('tagId', apiData.id);
        }

        this.commonApi.manageTag(tagData).subscribe((response) => {
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id = response.dataId;
          let actionFlag = (response.status == 'Success') ? true : false;
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(checkIndex + ' :: ' + this.itemVal + '::' + id)
          if (checkIndex < 0) {
            this.filteredTags.push(id);
            this.actionItems.push(id);
          }
          let i = -1;
          this.getTagInfo(i);
        });
        break;

      case 'LookupDataPM':
        let lookupData = new FormData();
        let isValidatev: any = 0;
        this.clearSelection();
        lookupData.append('apiKey', apiData.apiKey);
        lookupData.append('userId', apiData.userId);
        lookupData.append('domainId', apiData.domainId);
        lookupData.append('countryId', apiData.countryId);
        lookupData.append('lookUpdataName', apiData.lookUpdataName);
        lookupData.append('lookUpTableId', apiData.lookUpTableId);
        lookupData.append('disabledDomain', apiData.selectionList);
        lookupData.append('isInActive', apiData.isInActive);

        lookupData.append('title', apiData.title);

        lookupData.append('workstreamList', JSON.stringify(this.ws));
        lookupData.append('vehicleInfo', this.vehicle);
        lookupData.append('isValidate', isValidatev);
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          lookupData.append('lookUpdataId', apiData.id);
        }

        this.commonApi.ManageLookUpdata(lookupData).subscribe((response) => {
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
            this.selectionList = [];

          }, 3000);
          let id = response.dataId;
          let actionFlag = (response.status == 'Success') ? true : false;
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(checkIndex + ' :: ' + this.itemVal)
          if (checkIndex < 0) {
            this.filteredTags.push(id);
            this.actionItems.push(id);
          }
          this.getLookUpInfo(index);
        });
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        let errData = new FormData();
        let isValidateErr: any = 0;
        let code = this.itemCode;
        let desc = this.itemVal;
        errData.append('apiKey', apiData.apiKey);
        errData.append('userId', apiData.userId);
        errData.append('domainId', apiData.domainId);
        errData.append('countryId', apiData.countryId);
        errData.append('workstreamList', JSON.stringify(this.ws));
        errData.append('vehicleInfo', this.vehicle);
        errData.append('isValidate', isValidateErr);
        errData.append('errorCode', code);
        errData.append('errorDesc', desc);
        if (apiData.id > 0) {
          let tagIndex = apiData.id;
          errData.append('errorCodeId', apiData.id);
        }

        this.commonApi.manageErrorCode(errData).subscribe((response) => {
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;
          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id = response.dataId;
          let actionFlag = (response.status == 'Success') ? true : false;
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(checkIndex + ' :: ' + this.itemVal)
          if (checkIndex < 0) {
            this.filteredErrorCodes.push(id);
            this.actionItems.push(id);
          }
          let i = -1;
          this.getErrorCodes(i);
        });
        break;

      case 'newthread':
      case 'New Parts':
      case 'techinfo':
        console.log(apiData)
        let apiUrl = `${this.inputData.baseApiUrl}`;
        let body: HttpParams = new HttpParams();
        switch (this.inputData.field) {
          case 'colour':
            apiUrl = `${apiUrl}/parts/SavecolorValue`;
            break;
          case 'model':
          case 'PartModel':
            apiUrl = `${apiUrl}/Productmatrix/SaveproductMatrix`;
            break;
          case 'info-1':
          case 'info-2':
          case 'info-3':
          case 'info-4':
          case 'info-5':
          case 'info-6':
          case 'info-7':
            apiUrl = `${apiUrl}/parts/SaveAdditionalInfo`;
            break;
          default:
            apiUrl = `${apiUrl}/${this.inputData.actionApiName}`;
            break;
        }
        Object.keys(apiData).forEach(key => {
          let value = apiData[key];
          body = body.append(key, value);
        });

        this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
          console.log(response);
          this.searchVal = '';
          this.success = true;
          this.successMsg = response.result;


          setTimeout(() => {
            this.success = false;
            this.actionFlag = false;
          }, 3000);
          let id;
          let flag = true;
          switch (this.inputData.field) {
            case 'model':
            case 'PartModel':
              id = response.modelId;
              break;
            case 'colour':
            case 'info-1':
            case 'info-2':
            case 'info-3':
            case 'info-4':
            case 'info-5':
            case 'info-6':
            case 'info-7':
              flag = false;
              id = response.dataId;
              break;
            default:
              flag = (this.inputData.selectionType == 'single') ? false : true;
              id = response.dataId;
              break;
          }
          let checkIndex = this.selectionList.findIndex(option => option.id == id);
          console.log(this.filteredTags, checkIndex + ' :: ' + this.itemVal + '::' + id)
          if (checkIndex < 0 && flag) {
            this.filteredTags.push(id);
            this.actionItems.push(id);
          }
          this.getData(index);
        });
        break;
    }
  }

  // Clear Selection
  clearSelection() {
    this.headerCheck = 'unchecked';
    this.headercheckDisplay = 'checkbox-hide';
    this.selectionList = [];
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
      case 'Error Codes':
      case 'New Thread Error Codes':
        this.clearFlag = true;
        break;
      case 'newthread':
        if (this.inputData.field == 'escalationLookup') {
          this.clearFlag = true;
        }
    }
    this.itemChangeSelection(this.headerCheck);
  }

  // On Change
  onChange(field, index, value, vid = '') {
    let checkFlag;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        if (value.length > 0) {
          this.checkTagExists(index, value);
        } else {
          if (this.listFlag) {
            this.listFlag.unsubscribe();
          }
          this.itemVal = "";
          this.listItems[index].itemExists = false;
          this.submitActionFlag = false;
        }
        break;
      case 'LookupDataPM':
        if (value.length > 0) {
          this.checkLookupExists(index, value, vid);
        } else {
          if (this.listFlag) {
            this.listFlag.unsubscribe();
          }
          this.itemVal = "";
          this.listItems[index].itemExists = false;
          this.submitActionFlag = false;
        }
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
      case 'New Parts':
        this.listItems[index].itemExists = false;
        this.submitActionFlag = false;
        checkFlag = false;
        if (field == 'code') {
          this.itemCode = value;
          if (value.length > 0 && this.itemVal != null) {
            checkFlag = true;
          } else {
            this.listItems[index].itemExists = false;
            //this.submitActionFlag = false;
          }
        } else {
          this.itemVal = value;
          if (value.length > 0 && this.itemCode != null) {
            checkFlag = true;
          } else {
            this.listItems[index].itemExists = false;
            //this.submitActionFlag = false;
          }
        }

        if (checkFlag) {
          this.checkErrorCodeExists(index, this.itemCode, this.itemVal);
        }
        break;

      case 'techinfo':
        checkFlag = false;
        this.submitActionFlag = false;

        if (field == 'code') {
          this.itemCode = value;
          checkFlag = true;
          if (value.length > 0) {
            checkFlag = true;
          } else {
            this.listItems[index].itemExists = false;
            //this.submitActionFlag = false;
          }
        } else {
          if (value.length >= 10 && this.itemCode != '') {
            this.submitActionFlag = (!this.listItems[index].itemExists) ? true : this.submitActionFlag;
          }
          this.itemVal = value;
        }

        if (checkFlag) {
          this.checkTechInfoExists(index, this.itemCode, this.itemVal);
        }
        break;

      case 'newthread':
        if (value.length > 0) {
          this.checkItemExists(index, value);
        } else {
          if (this.listFlag) {
            this.listFlag.unsubscribe();
          }
          this.itemVal = "";
          this.listItems[index].itemExists = false;
          this.submitActionFlag = false;
        }
        break;
    }
  }

  // Check Tag Exists
  checkTagExists(index, value) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId'],
      'name': value
    };

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  checkLookupExists(index, value, vid) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId'],
      'lookUptableId': this.apiData['lookUpdataId'],
      'lookUpdataId': vid,
      'name': value
    };

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Error Code Exists
  checkErrorCodeExists(index, code, desc) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId']
    };
    if (this.access == 'New Parts') {
      let queryVal = JSON.parse(this.inputData.actionQueryValues);
      apiData[queryVal[1]] = code;
      apiData[queryVal[2]] = desc;
      apiData['isValidate'] = 1;
    } else {
      apiData['errorCode'] = code;
      apiData['errorDesc'] = desc;
    }
    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Technician Info Exists
  checkTechInfoExists(index, code, phone) {
    let apiData = {
      'apiKey': this.apiData['apiKey'],
      'userId': this.apiData['userId'],
      'domainId': this.apiData['domainId'],
      'countryId': this.apiData['countryId']
    };
    let queryVal = JSON.parse(this.inputData.actionQueryValues);
    apiData[queryVal[0]] = 0;
    apiData[queryVal[1]] = code;
    apiData[queryVal[2]] = (phone == null) ? '' : phone;
    apiData[queryVal[3]] = localStorage.getItem('dealerCode');
    apiData['isValidate'] = 1;
    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  // Check Exists
  manageExist(index, apiData) {
    console.log(this.access, index)
    let isValidate: any = 1;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        let tagData = new FormData();
        tagData.append('apiKey', apiData.apiKey);
        tagData.append('userId', apiData.userId);
        tagData.append('domainId', apiData.domainId);
        tagData.append('countryId', apiData.countryId);
        tagData.append('tagName', apiData.name);
        tagData.append('workstreamList', JSON.stringify(this.ws));
        tagData.append('vehicleInfo', this.vehicle);
        tagData.append('isValidate', isValidate);

        this.listFlag = this.commonApi.manageTag(tagData).subscribe((response) => {
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            this.itemVal = apiData.name;
            this.submitActionFlag = (this.itemVal != '') ? true : false;
          } else {
            this.submitActionFlag = false;
          }
        });
        break;

      case 'LookupDataPM':
        let LookupData = new FormData();
        LookupData.append('apiKey', apiData.apiKey);
        LookupData.append('userId', apiData.userId);
        LookupData.append('domainId', apiData.domainId);
        LookupData.append('countryId', apiData.countryId);
        LookupData.append('lookUpdataName', apiData.name);
        LookupData.append('lookUpdataId', apiData.lookUpdataId);

        LookupData.append('lookUpTableId', apiData.lookUptableId);
        LookupData.append('workstreamList', JSON.stringify(this.ws));
        LookupData.append('vehicleInfo', this.vehicle);
        LookupData.append('isValidate', isValidate);

        this.listFlag = this.commonApi.ManageLookUpdata(LookupData).subscribe((response) => {
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            this.itemVal = apiData.name;
            this.submitActionFlag = (this.itemVal != '') ? true : false;
          } else {
            this.submitActionFlag = false;
          }
        });
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        let codeData = new FormData();
        codeData.append('apiKey', apiData.apiKey);
        codeData.append('userId', apiData.userId);
        codeData.append('domainId', apiData.domainId);
        codeData.append('countryId', apiData.countryId);
        codeData.append('errorCode', apiData.errorCode);
        codeData.append('errorDesc', apiData.errorDesc);
        codeData.append('workstreamList', JSON.stringify(this.ws));
        codeData.append('vehicleInfo', this.vehicle);
        codeData.append('isValidate', isValidate);

        this.listFlag = this.commonApi.manageErrorCode(codeData).subscribe((response) => {
          console.log(response, index)
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            this.itemCode = apiData.errorCode;
            this.itemVal = apiData.errorDesc;
            this.submitActionFlag = (this.itemVal != '') ? true : false;
          } else {
            this.submitActionFlag = false;
          }
        });
        break;

      case 'newthread':
      case 'New Parts':
      case 'techinfo':
        console.log(this.inputData, apiData)
        let apiUrl = `${this.inputData.baseApiUrl}`;
        switch (this.inputData.title) {
          case 'Colours':
            apiUrl = `${apiUrl}/parts/SavecolorValue`;
            break;
          case 'Additional Model Info 1':
          case 'Additional Model Info 2':
          case 'Additional Model Info 3':
          case 'Additional Model Info 4':
          case 'Additional Model Info 5':
          case 'Additional Model Info 6':
          case 'Additional Model Info 7':
            apiUrl = `${apiUrl}/parts/SaveAdditionalInfo`;
            break;
          case 'Model':
          case 'model':
          case 'PartModel':
            apiUrl = `${apiUrl}/Productmatrix/CheckMakeModelExist`;
            break;
          default:
            apiUrl = `${apiUrl}/${this.inputData.actionApiName}`;
            break;
        }
        let field = this.inputData.field;
        let body: HttpParams = new HttpParams();

        Object.keys(apiData).forEach(key => {
          let value = apiData[key];
          body = body.append(key, value);
        });

        this.listFlag = this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
          console.log(response, field);
          this.listItems[index].itemExists = (response.status == 'Success') ? false : true;
          if (!this.listItems[index].itemExists) {
            let itemVal = '';
            switch (field) {
              case 'colour':
                itemVal = apiData.colorValueName;
                break;
              case 'info-1':
              case 'info-2':
              case 'info-3':
              case 'info-4':
              case 'info-5':
              case 'info-6':
              case 'info-7':
                itemVal = apiData.infoName;
                break;
              case 'Model':
              case 'model':
              case 'PartModel':
                itemVal = apiData.ModelName;
                break;
              default:
                let query = this.inputData.actionQueryValues;
                if (query != '') {
                  let queryVal = JSON.parse(query);
                  if (field == 'parts' || field == 'technicianInfo') {
                    console.log(apiData, queryVal)
                    this.itemCode = apiData[queryVal[1]];
                    itemVal = apiData[queryVal[2]];
                  } else {
                    itemVal = apiData[queryVal[1]];
                  }
                }
                break;
            }
            this.itemVal = itemVal;
            if (field == 'technicianInfo') {
              this.submitActionFlag = (this.itemCode != '' && this.itemVal.length >= 10) ? true : false;
            } else {
              this.itemVal = itemVal;
              this.submitActionFlag = (this.itemVal != '') ? true : false;
            }
          } else {
            this.submitActionFlag = false;
          }
        });
        break;
    }
  }

  // Apply Tag Selection
  applySelection(actionType) {
    if (this.access == 'LookupDataPM') {
      console.log(this.selectionList);
      this.manageListItem('disable', '');
    }
    else {
      console.log(this.filteredTags, this.filteredLists, this.selectionList)
      if (this.clearFlag) {
        this.selectionList = [];
        this.selectedItems.emit(this.selectionList);
        this.activeModal.dismiss('Cross click');
      } else if ((this.headerCheck == 'checked' || this.headerCheck == 'all' || this.filteredTags.length > 0)) {
        console.log(this.access, this.filteredTags, this.filteredLists, this.selectionList)
        if (this.headerCheck != 'unchecked') {
          let checkArr = ['id', 'name'];
          let unique = this.commonApi.unique(this.selectionList, checkArr);
          if (this.access == 'Error Codes' || this.access == 'New Thread Error Codes') {
            console.log(this.filteredLists, this.selectionList, this.manageList);
            for (let t in this.filteredTags) {
              let eindex = this.manageList.findIndex(option => option.id == this.filteredTags[t]);
              let ename;
              console.log(eindex);
              if (eindex > 0) {
                ename = `${this.manageList[eindex].code}##${this.manageList[eindex].desc}`;
              }
              else {
                ename = '';
              }
              let sindex = this.selectionList.findIndex(option => option.id == this.filteredTags[t]);
              if (sindex < 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                  ename: ename
                });
                console.log(eindex);
              }
            }
          } else if (this.access == 'newthread' && this.inputData.field == 'prodCode') {
            for (let t in this.filteredTags) {
              if (this.filteredTags[t].length > 0) {
                console.log(56456)
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                });
              }
            }
            this.selectionList = unique;
          }
          else if (this.access == 'newthread' && this.inputData.field == 'escalationLookup') {
            for (let t in this.filteredTags) {
              if (this.filteredTags[t].length > 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                  productModelsCount: this.filteredModelsCount[t],
                });
              }
            }
            this.selectionList = unique;
          }
          else {
            for (let t in this.filteredTags) {
              if (this.filteredTags[t].length > 0) {
                this.selectionList.push({
                  id: this.filteredTags[t],
                  name: this.filteredLists[t],
                });
              }
            }
            this.selectionList = unique;
          }
          checkArr = ['id', 'name'];
          unique = this.commonApi.unique(this.selectionList, checkArr);
          this.selectionList = unique;

          this.title = "";
          console.log(this.selectionList)
          this.selectedItems.emit(this.selectionList);
          this.activeModal.dismiss('Cross click');
        } else {
          if (this.closeFlag) {
            this.activeModal.dismiss('Cross click');
            setTimeout(() => {
              this.closeFlag = false;
            }, 20);
          }
        }
      } else {
        if (actionType == 'trigger') {
          this.activeModal.dismiss('Cross click');
        }
      }
    }
  }

  close() {
    this.title = "";
    switch (this.access) {
      case 'LookupDataPM':
        this.selectedItems.emit(1);
        break;

      /*case 'Tags':
      case 'New Thread Tags':
      case 'newthread':
        //this.activeModal.dismiss('Cross click');
        if(this.selectionList.length == 0 && this.filteredTags.length == 0 || this.clearFlag) {
          this.activeModal.dismiss('Cross click');
        } else {
          this.closeFlag = true;
          this.applySelection('trigger');
        }
        break;

      case 'Error Codes':
      case 'New Thread Error Codes':
        console.log(this.selectionList.length, this.filteredErrorCodes.length);
        if(this.selectionList.length == 0 && this.filteredErrorCodes.length == 0 || this.clearFlag) {
          this.activeModal.dismiss('Cross click');
        } else {
          this.closeFlag = true;
          this.applySelection('trigger');
        }
        break;
      */
      case 'Error Codes':
      case 'New Thread Error Codes':
        console.log(this.selectionList, this.filteredErrorCodes)
        this.selectionList = [];
        this.filteredErrorCodes = [];
        this.activeModal.dismiss('Cross click');
        break;
      default:
        this.activeModal.dismiss('Cross click');
        break;
    }
  }

  // On Submit
  onSubmit() {
    /*this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.searchKey;
      this.submitSearch();
    }*/
    console.log(this.searchForm.value)
    this.searchVal = this.searchForm.value.searchKey;
    if (this.searchVal != '') {
      this.submitSearch();
    }
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.searchKey = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    if (searchValue.length == 0) {
      this.submitted = false;
      if (this.listTotal != this.manageList.length || (this.listTotal == 0 && this.manageList.length == 0)) {
        this.clearSearch();
      }
    }
    if (this.listAction) {
      localStorage.setItem('searchVal', this.searchVal);
    }

    /*console.log(this.manageList)

    let filteredList = this.manageList.filter(option => option.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) !== -1);
    if(filteredList.length > 0) {
      this.empty = false;
      for(let t in this.listItems) {
        this.listItems[t].displayFlag = false;
        for(let f in filteredList) {
          if(this.listItems[t].name == filteredList[f].name) {
            this.listItems[t].displayFlag = true;
          }
        }
      }
    } else {
      this.empty = true;
      this.successMsg = "No Result Found";
    }*/
  }

  // Submit Search
  submitSearch() {
    let i = 0;
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    this.empty = false;

    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.getTagInfo(i);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
        this.getErrorCodes(i);
        break;
      case 'LookupDataPM':
        this.getLookUpInfo(i);
        break;
      case 'newthread':
      case 'New Parts':
      case 'techinfo':
        this.getData(i);
        break;
    }
  }

  // Clear Search
  clearSearch(action = '') {
    let i = 0;
    this.offset = 0;
    this.itemLength = 0;
    this.scrollInit = 0;
    this.lastScrollTop = 0;
    this.scrollCallback = true;
    this.manageList = [];
    this.listItems = this.manageList;
    let newFlag = (action == 'new' && this.empty) ? true : false;
    this.empty = false;
    console.log(action, newFlag)
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.actionFlag = false;
    if (action == '') {
      localStorage.removeItem('searchVal');
    }
    let accessIndex = (this.listTotal != this.manageList.length) ? -1 : 0;
    accessIndex = (action == 'new' && newFlag) ? -3 : accessIndex;
    switch (this.access) {
      case 'Tags':
      case 'New Thread Tags':
        this.getTagInfo(accessIndex);
        break;
      case 'Error Codes':
      case 'New Thread Error Codes':
        this.getErrorCodes(accessIndex);
        break;
      case 'newthread':
      case 'New Parts':
      case 'techinfo':
        this.getData(accessIndex);
        break;
    }
  }

  // Disable Field
  disableSelection() {
    return this.actionFlag;
  }

  // Get Data
  getData(index) {
    // console.clear()
    console.log(index, this.inputData, this.apiData.data)

    if (this.access == 'gtsDynamicOptions') {
      this.listItems = this.apiData.data.actionOptions
      this.listItems.forEach((items) => {
        items.displayFlag = true;
        items.action = ''
      })
      this.loading = false;
      return
    }
    //this.listAction = false;
    this.loading = true;
    this.scrollTop = 0;
    this.lastScrollTop = this.scrollTop;

    let apiData = this.apiData;
    let apiUrl = this.inputData.apiUrl;
    let field = this.inputData.field;
    let body: HttpParams = new HttpParams();
    if (field != "PartType") {
      apiData['offset'] = this.offset;
      apiData['limit'] = this.limit;
      apiData['searchKey'] = this.searchVal;
    }
    let newApiReq: any = false;

    Object.keys(apiData).forEach(key => {
      let value = apiData[key];
      body = body.append(key, value);
      if (key == 'commonApiValue') {
        newApiReq = true;
      }
    });

    this.commonApi.apiCall(apiUrl, body).subscribe((response) => {
      console.log(response);
      let resultData;
      let item: any = [];
      this.manageList = (index >= -1) ? [] : this.manageList;
      let initText = (index >= 0) ? 'init' : 'get';
      switch (field) {
        case 'model':
        case 'PartModel':
          resultData = response.modelData;
          for (let res in resultData) {
            resultData[res]['id'] = resultData[res]['uId'];
            this.manageList.push(resultData[res]);
          }
          break;
        case 'vinNo':
          resultData = response.vinDetails;
          for (let res in resultData) {
            this.manageList.push(resultData[res][0]);
          }
          break;
        case 'parts':
        case 'Media Manager':  
          resultData = response.items;
          for (let res in resultData) {
            this.manageList.push(resultData[res]);
          }
          break;
        case 'prodCode':
          resultData = response.items;
          let total = response.total;
          item = [];
          if (total > 0) {
            for (let list of resultData) {
              let name = list.name.replace('###', '-')
              item.push({
                id: list.id,
                name: name,
                prodType: list.productType,
                model: list.modelName
              });
            }
            console.log(item)
            for (let res in item) {
              this.manageList.push(item[res]);
            }
          } else {
            this.manageList = item;
          }
          break;
        case 'countryList':
          resultData = response.loopUpData;
          for (let res in resultData) {
            this.manageList.push(resultData[res]);
          }
          break;
        case 'PartType':
        case 'PartAssembly':
        case 'PartSystem':
          resultData = response.attributesInfo;
          resultData = (field == 'PartType') ? resultData.PartType : (field == 'PartAssembly') ? resultData.partAssembly : resultData.partSystem;
          for (let res in resultData) {
            this.manageList.push(resultData[res]);
          }
          break;
        default:
          resultData = (newApiReq) ? response.items : response.data;
          let itemTotal = (newApiReq) ? response.total : resultData.total;
          let resItems = (newApiReq) ? resultData : resultData.items;
          item = [];
          if (itemTotal > 0) {
            for (let list of resItems) {
              if (this.access == 'techinfo') {
                item.push({
                  id: list.id,
                  name: `${list.name} - ${list.phoneNo}`,
                  phoneNo: list.phoneNo
                });
              }
              else if (this.access == 'newthread' && field == 'escalationLookup') {
                item.push({
                  id: list.id,
                  name: list.name,
                  productModelsCount: list.productModelsCount
                });
              } else {
                item.push({
                  id: list.id,
                  name: list.name
                });
              }

            }
            for (let res in item) {
              this.manageList.push(item[res]);
            }
          } else {
            this.manageList = item;
          }
          break;
      }

      if (index <= 0) {
        let itemListLen = this.manageList.length;
        this.itemLength = itemListLen;
        this.empty = (itemListLen < 1) ? true : false;
        if (this.empty) {
          this.successMsg = response.result;
        } else {
          this.scrollCallback = true;
          this.scrollInit = 1;
          this.itemTotal = response.total;
          this.itemLength += resultData.length;
          this.offset += this.limit;
        }
      }

      setTimeout(() => {
        this.initList(initText, this.manageList);
      }, 100);

      if (this.searchNew) {
        this.manageTag('new', 0);
      }

    });
  }

  // Check Item Exists
  checkItemExists(index, value) {
    let apiData = {
      apiKey: this.apiData['apiKey'],
      userId: this.apiData['userId'],
      domainId: this.apiData['domainId'],
      countryId: this.apiData['countryId'],
      isValidate: 1
    };
    switch (this.inputData.field) {
      case 'model':
      case 'PartModel':
        apiData['ModelName'] = value;
        break;
      case 'colour':
        apiData['colorValueId'] = this.listItems[index].id;
        apiData['colorValueName'] = value;
        apiData['workstreamList'] = [];
        break;
      case 'info-1':
      case 'info-2':
      case 'info-3':
      case 'info-4':
      case 'info-5':
      case 'info-6':
      case 'info-7':
        apiData['infoId'] = this.listItems[index].id;
        apiData['infoName'] = value;
        apiData['workstreamList'] = [];
        break;
      default:
        let query = this.inputData.actionQueryValues;
        console.log(query)
        if (query != '') {
          let queryVal = JSON.parse(query);
          apiData[queryVal[0]] = this.listItems[index].id;
          apiData[queryVal[1]] = value;
          queryVal.forEach(q => {
            switch (q) {
              case 'commonApiValue':
                console.log(this.commonApiValue)
                apiData[q] = this.commonApiValue;
                break;
            }
          });
        }
        break;
    }

    if (this.listFlag) {
      this.listFlag.unsubscribe();
      this.manageExist(index, apiData);
    } else {
      this.manageExist(index, apiData);
    }
  }

  setupFilteredItems(id) {
    if (this.selection == 'multiple') {
      switch (this.access) {
        case 'Tags':
        case 'New Thread Tags':
        case 'newthread':
          if (this.filteredTags.length > 0) {
            let rmIndex = this.filteredTags.findIndex(option => option == id);
            if (rmIndex >= 0) {
              this.filteredTags.splice(rmIndex, 1);
              this.filteredLists.splice(rmIndex, 1);
            }
          }
          console.log(this.filteredModelsCount.length);
          if (this.filteredModelsCount.length > 0) {
            let rmIndex1 = this.filteredTags.findIndex(option => option == id);
            if (rmIndex1 >= 0) {
              this.filteredModelsCount.splice(rmIndex1, 1);
            }
          }
          break;
        case 'Error Codes':
        case 'New Thread Error Codes':
          if (this.filteredErrorCodes.length > 0) {
            let rmIndex = this.filteredErrorCodes.findIndex(option => option == id);
            if (rmIndex >= 0) {
              this.filteredErrorCodes.splice(rmIndex, 1);
              this.filteredLists.splice(rmIndex, 1);
            }
          }
          break;
      }
    }
  }

  // remove option
  removeConfirm(index,id){
    this.bodyElem.classList.add("auth-open-remove-popup");
    const modalRef = this.modalService.open(ConfirmationComponent, this.modalConfig);
    modalRef.componentInstance.access = 'ppfrconfirmation';
    modalRef.componentInstance.title = '';
    modalRef.componentInstance.confirmAction.subscribe((receivedService) => {  
      modalRef.dismiss('Cross click'); 
      console.log(receivedService);
      if(receivedService){
        this.deleteOption(index,id);
      }
    }); 
  }

  deleteOption(index,id){
    let formData = new FormData();
    formData.append("apiKey", this.apiData["apiKey"]);
    formData.append("domainId", this.apiData["domainId"]);
    formData.append("countryId", this.apiData["countryId"]);
    formData.append("userId", this.apiData["userId"]);
    formData.append("tagId", id);

    this.commonApi.apiDeleteTag(formData).subscribe((response) => {
      if(response.status=='Success'){         
        this.listItems.splice(index, 1);    
      }
      else{
        // error
      }  
    });
    
  }

  inputFocus() {
    setTimeout(() => {
      this.setFocusToInput();
    }, 400);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }

  @HostListener('focusout', ['$event']) public onListenerTriggered(event: any): void {
    //this.setFocusToInput();
  }

  setFocusToInput() {
    this.focusInput.nativeElement.focus();
  }

}
