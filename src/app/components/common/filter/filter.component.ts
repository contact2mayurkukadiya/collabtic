import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { NgbModal, NgbModalConfig, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
import { ApiService } from 'src/app/services/api/api.service';
import { ProductMatrixService } from "../../../services/product-matrix/product-matrix.service";
import { PartsService } from "../../../services/parts/parts.service";
import { FilterService } from "../../../services/filter/filter.service";
import { pageInfo, ManageTitle, windowHeight, threadBulbStatusText, Constant, forumPageAccess, MediaTypeInfo, DocfileExtensionTypes } from "src/app/common/constant/constant";
import { ManageListComponent } from "../../../components/common/manage-list/manage-list.component";
import { ManageGeoListComponent } from "../../../components/common/manage-geo-list/manage-geo-list.component";
import * as moment from "moment";

declare var $: any;
@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit {
  @Input() filterOptions;
  @Input() pageDataInfo;
  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() filterAction: EventEmitter<any> = new EventEmitter();
  @Input() filterHeight: any;
  //public expandFlag: boolean = false;
  @Input() expandFlag: boolean = true;
  public sconfig: PerfectScrollbarConfigInterface = {};

  //public filterHeight: number;
  public resetFlag: boolean = false;
  public resetFlagFilter: boolean = false;
  public filterLoading: boolean;
  public initFlag: boolean = true;
  public sectionLoading: boolean = true;
  public options: any;

  public apiData: any;
  public activeFilter: boolean;
  public workstreamWidget: boolean = true;
  public makeWidget: boolean = false;
  public modelWidget: boolean = false;
  public yearWidget: boolean = false;
  public tagWidget: boolean = false;
  public probCatgWidget: boolean = false;
  public symtomWidget: boolean = false;
  public complaintCategoryWidget: boolean = false;
  public languageWidget: boolean = false;
  public subProductGroupWidget: boolean = false;
  public mediaWidget: boolean = false;
  public startDateWidget: boolean = false;
  public endDateWidget: boolean = false;
  public territoryWidget: boolean = false;
  public locationWidget: boolean = false;
  public customerWidget: boolean = false;
  public technicianWidget: boolean = false;
  public csmWidget: boolean = false;
  public statusWidget: boolean = false;
  public threadStatusWidget: boolean = false;
  public errorCodeWidget: boolean = false;
  public otherUserWidget: boolean = false;
  public dealerNameWidget: boolean = false;
  public dealerCityWidget: boolean = false;
  public dealerAreaWidget: boolean = false;
  public prodCoorWidget: boolean = false;
  public tManagerWidget: boolean = false;
  public partTypeWidget: boolean = false;
  public partAssemblyWidget: boolean = false;
  public partSystemWidget: boolean = false;
  public splitIcon: boolean = false;
  public dateErrorFlag: boolean = false;
  public dateErrorTxt: string = "";
  public statusPlaceHolder = "";
  public threadStatusPlaceHolder = "";
  public errorCodePlaceHolder = "";
  public subProductGroupName: string = "";
  public rmHeight: any = 190;
  public rmlHeight: any = 175;

  public workstreams: any;
  public storedWorkstreams = [];
  public filteredWorkstreams = [];
  public makes: any;
  public modelValue = "";
  public filteredMakes = [];
  public models: any = [];
  public storedModels = [];
  public filteredModels = [];
  public defaultModels = { id: "All", name: "All" };
  public years: any;
  public storedYears = [];
  public filteredYears = [];
  public status: any = [];
  public threadStatusArr: any = [];
  public errorCodeArr: any = [];
  public storedStatus = [];
  public storedThreadStatus = [];
  public storedErrorCode = [];
  public filteredStatus = [];
  public filteredThreadStatus = [];
  public filteredErrorCode = [];
  public mediaTypes: any;
  public storedMediaTypes = [];
  public filteredMediaTypes = [];
  public partTypes: any = [];
  public storedPartTypes = [];
  public filteredPartTypes = [];
  public partAssembly: any = [];
  public storedPartAssembly = [];
  public filteredPartAssembly = [];
  public partSystem: any = [];
  public storedPartSystem = [];
  public filteredPartSystem = [];

  public today = moment().format();
  public startDateValue = "";
  public endDateValue = "";
  public durationValue: number = 0;
  public minDuration: number = 1;
  public maxDuration: number = 60;

  public make: any;
  public makeInputFilter: FormControl = new FormControl();

  public makeId: number;
  public modelId: number;
  public yearId: number;
  public workstreamId: number;
  public tagId: number;
  public probCatgId: number;
  public symtomId: number;
  public complaintCategoryId: number;
  public languageId: number;
  public subProductGroupId: number;
  public mediaId: number;
  public startDateId: number;
  public endDateId: number;
  public territoryId: number;
  public locationId: number;
  public customerId: number;
  public technicianId: number;
  public csmId: number;
  public statusId: number;
  public threadStatusId: number;
  public errorCodeId: number;
  public otuId: number;
  public dnId: number;
  public dcId: number;
  public daId: number;
  public pcId: number;
  public tmId: number;
  public ptypeId: number;
  public passemblyId: number;
  public psystemId: number;

  public datePlaceholder: string = "Select Date";
  public selectionType: string = "multiple";
  public filteredData = {};
  public disableFilterAction: boolean = false;
  public modelLoading: boolean = false;
  public availFilter: number = 0;

  public filterBg = "#3C424D";
  public filterTitleColor = "#ffffff";
  public expandArrow = 'url("assets/images/filter/filter-ic.svg")';
  public filterSetting = 'url("assets/images/filter/filter-setting.png")';
  public collapseArrow = 'url("assets/images/filter/collapse-arrow.png")';
  public filterFieldTitle = "#BEC0C2";
  public filterFieldSelectText = "#7F838D";
  public filterFieldLineColor = "#5B626C";
  public filterDeviderLineColor = "#212734";
  public filterDropDown = 'url("assets/images/filter/filter-drop-down.svg")';
  public expandArrowActive =
    'url("assets/images/filter/expand-arrow-active.png")';
  public filterTitleColorActive = "#edb800";
  public resetArrow = 'url("assets/images/filter/filter-reset.png")';

  public teamFilterBg = "#f9f9f9";
  public teamfilterTitleColor = "#303136";
  public teamExpandArrow = 'url("assets/images/filter/team-expand-arrow.png")';
  public teamFilterSetting =
    'url("assets/images/filter/team-filter-setting.png")';
  public teamCollapseArrow =
    'url("assets/images/filter/team-collapse-arrow.png")';
  public teamFilterFieldTitle = "#5e6066";
  public teamFilterFieldSelectText = "#72757E";
  public teamFilterFieldLineColor = "#dddddd";
  public teamFilterDeviderLineColor = "#e9e9e9";
  public teamFilterDropDown =
    'url("assets/images/filter/team-filter-drop-down.png")';
  public teamExpandArrowActive =
    'url("assets/images/filter/team-expand-arrow-active.png")';
  public teamFilterTitleColorActive = "#E55252";
  public teamResetArrow = 'url("assets/images/filter/team-filter-reset.png")';

  public loaddefaultFilter = true;
  public mahleEuropeFlag = false;

  constructor(
    private apiUrl: ApiService,
    private filterApi: FilterService,
    private partsApi: PartsService,
    public acticveModal: NgbActiveModal,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private productMatrixServiceApi: ProductMatrixService,
  ) {
    let teamSystem = localStorage.getItem("teamSystem");
    let setBgforFilter = "";
    let settitleforFilter = "";
    let setExpandArrow = "";
    let setFilterSetting = "";
    let setCollapseArrow = "";
    let setFilterFieldTitle = "";
    let setFilterFieldSelectText = "";
    let setFilterFieldLineColor = "";
    let setFilterDeviderLineColor = "";
    let setFilterDropDown = "";
    let setExpandArrowActive = "";
    let setFilterTitleColorActive = "";
    let setResetArrow = "";

    if (teamSystem) {
      setBgforFilter = this.teamFilterBg;
      settitleforFilter = this.teamfilterTitleColor;
      setExpandArrow = this.teamExpandArrow;
      setFilterSetting = this.teamFilterSetting;
      setCollapseArrow = this.teamCollapseArrow;
      setFilterFieldTitle = this.teamFilterFieldTitle;
      setFilterFieldSelectText = this.teamFilterFieldSelectText;
      setFilterFieldLineColor = this.teamFilterFieldLineColor;
      setFilterDeviderLineColor = this.teamFilterDeviderLineColor;
      setFilterDropDown = this.teamFilterDropDown;
      setExpandArrowActive = this.teamExpandArrowActive;
      setFilterTitleColorActive = this.teamFilterTitleColorActive;
      setResetArrow = this.teamResetArrow;
    } else {
      setBgforFilter = this.filterBg;
      settitleforFilter = this.filterTitleColor;
      setExpandArrow = this.expandArrow;
      setFilterSetting = this.filterSetting;
      setCollapseArrow = this.collapseArrow;
      setFilterFieldTitle = this.filterFieldTitle;
      setFilterFieldSelectText = this.filterFieldSelectText;
      setFilterFieldLineColor = this.filterFieldLineColor;
      setFilterDeviderLineColor = this.filterDeviderLineColor;
      setFilterDropDown = this.filterDropDown;
      setExpandArrowActive = this.expandArrowActive;
      setFilterTitleColorActive = this.filterTitleColorActive;
      setResetArrow = this.resetArrow;
    }
    this.changeTheme(
      setBgforFilter,
      settitleforFilter,
      setExpandArrow,
      setFilterSetting,
      setCollapseArrow,
      setFilterFieldTitle,
      setFilterFieldSelectText,
      setFilterFieldLineColor,
      setFilterDeviderLineColor,
      setFilterDropDown,
      setExpandArrowActive,
      setFilterTitleColorActive,
      setResetArrow
    );
    config.backdrop = "static";
    config.keyboard = false;
    config.size = "dialog-centered";
  }

  ngOnInit(): void {
    console.log(this.filterOptions);
    let access = this.filterOptions.page;
    this.expandFlag = this.filterOptions.filterExpand;
    this.filterLoading = this.filterOptions.filterLoading;
    let detHeight = 240;

    let platformId=localStorage.getItem('platformId');
    let industryType=localStorage.getItem('industryType');
    let countryId=localStorage.getItem('countryId');
    if(platformId=='2' && industryType=='5' && countryId == '2')
    {
      this.mahleEuropeFlag = true;
    }

    if (this.pageDataInfo == "6") {
      this.filterHeight = windowHeight.height;
    } else if (this.pageDataInfo == "4") {
      this.filterHeight = windowHeight.height - 100;
    } else {
      this.filterHeight = windowHeight.height - 50;
    }

    if (this.filterHeight == undefined) {
      this.filterHeight = windowHeight.height;
    }

    if (!this.filterLoading) {
      this.resetFlagFilter = this.filterOptions.resetFlag;
      this.apiData = {
        apiKey: this.filterOptions["apiKey"],
        userId: this.filterOptions["userId"],
        domainId: this.filterOptions["domainId"],
        countryId: this.filterOptions["countryId"],
        groupId: this.filterOptions["groupId"],
        threadType: this.filterOptions["threadType"],
      };

      this.activeFilter = this.filterOptions.filterActive;
      let access = this.filterOptions.page;
      // alert(access);

      let searchBg = false;
      let getFilteredValues;
      //console.error("access", access);
      switch (access) {
        case "parts":
          getFilteredValues = JSON.parse(localStorage.getItem("partFilter"));
          this.filterHeight = windowHeight.height - 120;
          break;          
        case "media":
          getFilteredValues = JSON.parse(localStorage.getItem("mediaFilter"));
          this.filterHeight = windowHeight.height - 120;
          break;
        case "threads":
          getFilteredValues = JSON.parse(localStorage.getItem("threadFilter"));
          this.filterHeight = windowHeight.height - 120;
          break;
        case "gtsList":
          getFilteredValues = JSON.parse(localStorage.getItem("gtsFilter"));
          this.filterHeight = windowHeight.height - 120;
          break;
        case "knowledgeArticles":
          getFilteredValues = JSON.parse(
            localStorage.getItem("knowledgeArticleFilter")
          );
          break;
        case "sib":
          getFilteredValues = JSON.parse(localStorage.getItem("sibFilter"));
          this.filterHeight = windowHeight.height - 125;
          break;
        case "knowledge-base":
          getFilteredValues = JSON.parse(localStorage.getItem("knowledgeBaseFilter"));
          this.filterHeight = windowHeight.height - 125;
          break;
        case "search":
          this.rmHeight = 150;
          this.rmlHeight = 135;
          if(this.filterOptions.reset) {
            this.filterOptions.filterData.forEach((data) => {
              console.log(data)
              let id = parseInt(data.id)
              switch (id) {
                case 7:
                case 8:
                  data.value = '';                  
                  break;
              }
            });
            setTimeout(() => {
              this.filterOptions.reset = false;
              this.resetFlagFilter = this.filterOptions.resetFlag;
            }, 100);
          }
          getFilteredValues = JSON.parse(
            localStorage.getItem("searchPageFilter")
          );
          //   this.resetFlag=false;
          this.filterHeight = windowHeight.height - 80;
          break;
        case "escalation":
          getFilteredValues = JSON.parse(
            localStorage.getItem("escalationFilter")
          );
          this.apiData["groupId"] = this.filterOptions["groupId"];
          searchBg = this.filterOptions.searchBg;
          this.filterHeight = windowHeight.height - 120;
          break;
        case "ppfr":
          getFilteredValues = JSON.parse(
            localStorage.getItem("escalationPPFRFilter")
          );
          this.apiData["groupId"] = this.filterOptions["groupId"];
          searchBg = this.filterOptions.searchBg;
          this.filterHeight = windowHeight.height - 120;
          break;
        case "documents":
          getFilteredValues = JSON.parse(localStorage.getItem("docFilter"));
          this.filterHeight -= 65;
          break;
        case "more":
          getFilteredValues = JSON.parse(
            localStorage.getItem("moreAnnouncementFilter")
          );
          this.filterHeight = windowHeight.height - 120;
          break;
        case "dismiss":
          getFilteredValues = JSON.parse(
            localStorage.getItem("dismissedAnnouncementFilter")
          );
          this.filterHeight = windowHeight.height - 120;
          break;
        case "dashboard":
        case "archive":
          getFilteredValues = JSON.parse(
            localStorage.getItem("dashboardAnnouncementFilter")
          );
          this.filterHeight = windowHeight.height - 120;
          break;
        case "media-upload":
          console.log(localStorage.getItem("mediaUploadFilter"))
          getFilteredValues = JSON.parse(localStorage.getItem("mediaUploadFilter"));
          this.filterHeight = windowHeight.height - 200;
          this.rmHeight = 310;
          this.rmlHeight = 295;
          break;  
      }
      this.options = this.filterOptions.filterData;
      console.log(getFilteredValues);
      setTimeout(() => {
        for (var opt of this.options) {
          let wid = parseInt(opt.id);
          if (opt.widgetsFlag) {
            ++this.availFilter;
          }
          switch (wid) {
            case 1:
              this.makeWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.makeWidget) {
                this.makeId = wid;
                this.makes = opt.valueArray;
                this.filteredMakes = this.makes;
                this.filteredData["make"] = [];
                this.make = "";
                if (getFilteredValues != null) {
                  this.filteredData["make"] =
                    getFilteredValues.make == undefined ||
                    getFilteredValues.make == "undefined"
                      ? this.filteredData["make"]
                      : getFilteredValues.make;
                  if (this.filteredData["make"].length > 0) {
                    this.make = this.filteredData["make"][0];
                  }
                }
              }
              break;
            case 2:
              this.modelWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.modelWidget) {
                let model = opt.valueArray[0];
                this.filteredData["model"] = [];
                this.modelId = wid;
                this.models.push({
                  id: model,
                  name: model,
                });

                if (getFilteredValues != null) {
                  this.filteredData["model"] =
                    getFilteredValues.model == undefined ||
                    getFilteredValues.model == "undefined"
                      ? this.filteredData["model"]
                      : getFilteredValues.model;
                }

                if (this.filteredData["model"].length > 0) {
                  for (let m of this.filteredData["model"]) {
                    this.filteredModels.push(m);
                  }
                }

                this.storedModels = this.filteredModels;

                if (this.makeWidget && this.make != "") {
                  this.selectChange("init", this.makeId, this.make);
                }
              }
              break;
            case 3:
              this.yearWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.yearWidget) {
                this.yearId = wid;
                this.years = opt.valueArray;
                opt.selectedItems = [];
                this.filteredData["year"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["year"] =
                    getFilteredValues.year == undefined ||
                    getFilteredValues.year == "undefined"
                      ? this.filteredData["year"]
                      : getFilteredValues.year;
                }
                this.filteredYears = this.filteredData["year"];
                this.storedYears = this.filteredYears;
                this.filteredYears.forEach((item) => {
                  console.log(item)
                  opt.selectedItems.push({id: item, name: item});
                });
              }
              break;
            case 4:
              this.workstreamWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.workstreamWidget) {
                this.workstreamId = wid;
                this.workstreams = opt.valueArray;
                let wsItem = [];
                this.workstreams.forEach((ws) => {
                  //wsItem.push(ws.workstreamId);
                });
                this.filteredData["workstream"] = wsItem;
                console.log(getFilteredValues, this.filteredData);
                if (getFilteredValues != null) {
                  console.log(4564)
                  this.filteredData["workstream"] =
                    getFilteredValues.workstream == undefined ||
                    getFilteredValues.workstream == "undefined"
                      ? this.filteredData["workstream"]
                      : getFilteredValues.workstream;
                }

                this.filteredWorkstreams = this.filteredData["workstream"];
                this.storedWorkstreams = this.filteredWorkstreams;
                console.log(this.storedWorkstreams);
              }
              break;
            case 5:
              this.tagWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.tagWidget) {
                this.tagId = wid;
                this.filteredData["tags"] = [];
                this.filteredData["tagItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["tags"] =
                    getFilteredValues.tags == undefined ||
                    getFilteredValues.tags == "undefined"
                      ? this.filteredData["tags"]
                      : getFilteredValues.tags;
                  this.filteredData["tagItems"] =
                    getFilteredValues.tagItems == undefined ||
                    getFilteredValues.tagItems == "undefined"
                      ? this.filteredData["tagItems"]
                      : getFilteredValues.tagItems;
                }
              }
              break;
            case 6:
              this.mediaWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.mediaWidget) {
                this.mediaId = wid;
                this.mediaTypes = opt.valueArray;
                this.filteredData["mediaTypes"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["mediaTypes"] =
                    getFilteredValues.mediaTypes == undefined ||
                    getFilteredValues.mediaTypes == "undefined"
                      ? this.filteredData["mediaTypes"]
                      : getFilteredValues.mediaTypes;
                }
                this.filteredMediaTypes = this.filteredData["mediaTypes"];
                this.storedMediaTypes = this.filteredMediaTypes;
              }
              break;
            case 7:
              this.startDateWidget = true;
              this.startDateId = wid;
              this.startDateValue =
                opt.value != "" ? moment(opt.value).format() : opt.value;
              this.filteredData["startDate"] = opt.value;
              break;
            case 8:
              this.endDateWidget = true;
              this.endDateId = wid;
              this.endDateValue =
                opt.value != "" ? moment(opt.value).format() : opt.value;
              this.filteredData["endDate"] = opt.value;
              this.durationValue = 0;
              if (this.startDateValue != "" && this.endDateValue != "") {
                let sdate = moment(this.startDateValue).format();
                let edate = moment(this.endDateValue).format();
                let res = moment(edate).diff(moment(sdate), "days", true);
                this.durationValue = res > 60 ? 0 : res;
              }
              break;
            case 11:
              this.territoryWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.territoryWidget) {
                this.territoryId = wid;
                this.filteredData["territories"] = [];
                this.filteredData["territoryItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["territories"] =
                    getFilteredValues.territories == undefined ||
                    getFilteredValues.territories == "undefined"
                      ? this.filteredData["territories"]
                      : getFilteredValues.territories;
                  this.filteredData["territoryItems"] =
                    getFilteredValues.territoryItems == undefined ||
                    getFilteredValues.territoryItems == "undefined"
                      ? this.filteredData["territoryItems"]
                      : getFilteredValues.territoryItems;
                }
              }
              break;
            case 12:
              this.locationWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.locationWidget) {
                this.locationId = wid;
                this.filteredData["locations"] = [];
                this.filteredData["locationItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["locations"] =
                    getFilteredValues.locations == undefined ||
                    getFilteredValues.locations == "undefined"
                      ? this.filteredData["locations"]
                      : getFilteredValues.locations;
                  this.filteredData["locationItems"] =
                    getFilteredValues.locationItems == undefined ||
                    getFilteredValues.locationItems == "undefined"
                      ? this.filteredData["locationItems"]
                      : getFilteredValues.locationItems;
                }
              }
              break;
            case 13:
              this.customerWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.customerWidget) {
                this.customerId = wid;
                this.filteredData["customers"] = [];
                this.filteredData["customerItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["customers"] =
                    getFilteredValues.customers == undefined ||
                    getFilteredValues.customers == "undefined"
                      ? this.filteredData["customers"]
                      : getFilteredValues.customers;
                  this.filteredData["customerItems"] =
                    getFilteredValues.customerItems == undefined ||
                    getFilteredValues.customerItems == "undefined"
                      ? this.filteredData["customerItems"]
                      : getFilteredValues.customerItems;
                }
              }
              break;
            case 14:
              this.technicianWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.technicianWidget) {
                this.technicianId = wid;
                this.filteredData["technicians"] = [];
                this.filteredData["technicianItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["technicians"] =
                    getFilteredValues.technicians == undefined ||
                    getFilteredValues.technicians == "undefined"
                      ? this.filteredData["technicians"]
                      : getFilteredValues.technicians;
                  this.filteredData["technicianItems"] =
                    getFilteredValues.technicianItems == undefined ||
                    getFilteredValues.technicianItems == "undefined"
                      ? this.filteredData["technicianItems"]
                      : getFilteredValues.technicianItems;
                }
              }
              break;
            case 15:
              this.csmWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.csmWidget) {
                this.csmId = wid;
                this.filteredData["csm"] = [];
                this.filteredData["csmItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["csm"] =
                    getFilteredValues.csm == undefined ||
                    getFilteredValues.csm == "undefined"
                      ? this.filteredData["csm"]
                      : getFilteredValues.csm;
                  this.filteredData["csmItems"] =
                    getFilteredValues.csmItems == undefined ||
                    getFilteredValues.csmItems == "undefined"
                      ? this.filteredData["csmItems"]
                      : getFilteredValues.csmItems;
                }
              }
              break;
            case 16:
              this.statusPlaceHolder = "Status";
              this.statusWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.statusWidget) {
                this.statusId = wid;
                this.filteredData["status"] = [];
                for (let s of opt.valueArray) {
                  this.status.push({
                    id: s,
                    name: s,
                  });
                }
                if (getFilteredValues != null) {
                  this.filteredData["status"] =
                    getFilteredValues.status == undefined ||
                    getFilteredValues.status == "undefined"
                      ? this.filteredData["status"]
                      : getFilteredValues.status;
                }
                this.filteredStatus = this.filteredData["status"];
                this.storedStatus = this.filteredStatus;
              }
              break;
            case 18:
              let industryType:any = localStorage.getItem('industryType');
              let statusTxt = (industryType == 3 && this.apiData["domainId"] == 97) ? ManageTitle.feedback : ManageTitle.thread;
              this.threadStatusPlaceHolder = `${statusTxt} Status`;
              this.threadStatusWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.threadStatusWidget) {
                this.threadStatusId = wid;
                this.filteredData["threadStatus"] = [];
                //console.log(opt.valueArray);
                for (let ts of opt.valueArray) {
                  this.threadStatusArr.push({
                    id: ts,
                    name: ts,
                  });
                }
                //console.log(getFilteredValues);
                if (getFilteredValues != null) {
                  this.filteredData["threadStatus"] =
                    getFilteredValues.threadStatus == undefined ||
                    getFilteredValues.threadStatus == "undefined"
                      ? this.filteredData["threadStatus"]
                      : getFilteredValues.threadStatus;
                }
                this.filteredThreadStatus = this.filteredData["threadStatus"];
                this.storedThreadStatus = this.filteredThreadStatus;
              }
              break;

            case 19:
              this.errorCodePlaceHolder = "Error code";
              this.errorCodeWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.errorCodeWidget) {
                this.errorCodeId = wid;
                this.filteredData["errorCode"] = [];
                //console.log(opt.valueArray);
                for (let ts of opt.valueArray) {
                  this.errorCodeArr.push({
                    id: ts,
                    name: ts,
                  });
                }
                //console.log(getFilteredValues);
                if (getFilteredValues != null) {
                  this.filteredData["errorCode"] =
                    getFilteredValues.errorCode == undefined ||
                    getFilteredValues.errorCode == "undefined"
                      ? this.filteredData["errorCode"]
                      : getFilteredValues.errorCode;
                }
                this.filteredErrorCode = this.filteredData["errorCode"];
                this.storedErrorCode = this.filteredErrorCode;
              }
              break;
            /*
               this.statusWidget = (opt.widgetsFlag == 1) ? true : false;
              if (this.statusWidget) {
                this.statusId = wid;
                this.filteredData['status'] = [];
                for (let s of opt.valueArray) {
                  this.status.push({
                    id: s,
                    name: s
                  });
                }
                if (getFilteredValues != null) {
                  this.filteredData['status'] = (getFilteredValues.status == undefined || getFilteredValues.status == 'undefined') ? this.filteredData['status'] : getFilteredValues.status;
                }
                this.filteredStatus = this.filteredData['status'];
                this.storedStatus = this.filteredStatus;
              }
              break;
              */
            case 17:
              this.otherUserWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.otherUserWidget) {
                this.otuId = wid;
                this.filteredData["otherUsers"] = [];
                this.filteredData["otherUserItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["otherUsers"] =
                    getFilteredValues.otherUsers == undefined ||
                    getFilteredValues.otherUsers == "undefined"
                      ? this.filteredData["otherUsers"]
                      : getFilteredValues.otherUsers;
                  this.filteredData["otherUserItems"] =
                    getFilteredValues.otherUsers == undefined ||
                    getFilteredValues.otherUserItems == "undefined"
                      ? this.filteredData["otherUserItems"]
                      : getFilteredValues.otherUserItems;
                }
              }
              break;

            case 20:
              this.dealerNameWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.dealerNameWidget) {
                this.dnId = wid;
                this.filteredData["dealerNames"] = [];
                this.filteredData["dealerNameItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["dealerNames"] =
                    getFilteredValues.dealerNames == undefined ||
                    getFilteredValues.dealerNames == "undefined"
                      ? this.filteredData["dealerNames"]
                      : getFilteredValues.dealerNames;
                  this.filteredData["dealerNameItems"] =
                    getFilteredValues.dealerNameItems == undefined ||
                    getFilteredValues.dealerNameItems == "undefined"
                      ? this.filteredData["dealerNameItems"]
                      : getFilteredValues.dealerNameItems;
                }
              }
              break;
            case 21:
              this.dealerCityWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.dealerCityWidget) {
                this.dcId = wid;
                this.filteredData["dealerCities"] = [];
                this.filteredData["dealerCityItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["dealerCities"] =
                    getFilteredValues.dealerCities == undefined ||
                    getFilteredValues.dealerCities == "undefined"
                      ? this.filteredData["dealerCities"]
                      : getFilteredValues.dealerCities;
                  this.filteredData["dealerCityItems"] =
                    getFilteredValues.dealerCityItems == undefined ||
                    getFilteredValues.dealerCityItems == "undefined"
                      ? this.filteredData["dealerCityItems"]
                      : getFilteredValues.dealerCityItems;
                }
              }
              break;
            case 22:
              this.dealerAreaWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.dealerAreaWidget) {
                this.daId = wid;
                this.filteredData["dealerArea"] = [];
                this.filteredData["dealerAreaItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["dealerArea"] =
                    getFilteredValues.dealerArea == undefined ||
                    getFilteredValues.dealerArea == "undefined"
                      ? this.filteredData["dealerArea"]
                      : getFilteredValues.dealerArea;
                  this.filteredData["dealerAreaItems"] =
                    getFilteredValues.dealerAreaItems == undefined ||
                    getFilteredValues.dealerAreaItems == "undefined"
                      ? this.filteredData["dealerAreaItems"]
                      : getFilteredValues.dealerAreaItems;
                }
              }
              break;
            case 23:
              this.prodCoorWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.prodCoorWidget) {
                this.pcId = wid;
                this.filteredData["productCoor"] = [];
                this.filteredData["productCoorItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["productCoor"] =
                    getFilteredValues.productCoor == undefined ||
                    getFilteredValues.productCoor == "undefined"
                      ? this.filteredData["productCoor"]
                      : getFilteredValues.productCoor;
                  this.filteredData["productCoorItems"] =
                    getFilteredValues.productCoorItems == undefined ||
                    getFilteredValues.productCoorItems == "undefined"
                      ? this.filteredData["productCoorItems"]
                      : getFilteredValues.productCoorItems;
                }
              }
              break;
            case 24:
              this.tManagerWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.tManagerWidget) {
                this.tmId = wid;
                this.filteredData["tmanagers"] = [];
                this.filteredData["tmanagerItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["tmanagers"] =
                    getFilteredValues.tmanagers == undefined ||
                    getFilteredValues.tmanagers == "undefined"
                      ? this.filteredData["tmanagers"]
                      : getFilteredValues.tmanagers;
                  this.filteredData["tmanagerItems"] =
                    getFilteredValues.tmanagerItems == undefined ||
                    getFilteredValues.tmanagerItems == "undefined"
                      ? this.filteredData["tmanagerItems"]
                      : getFilteredValues.tmanagerItems;
                }
              }
              break;            
            case 25:             
              break;  
            case 26:
              if(this.filterOptions.page == "knowledge-base"){
                this.probCatgWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.probCatgWidget) {
                  this.probCatgId = wid;
                  this.filteredData["probCatgs"] = [];
                  this.filteredData["probCatgItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["probCatgs"] =
                      getFilteredValues.probCatgs == undefined ||
                      getFilteredValues.probCatgs == "undefined"
                        ? this.filteredData["probCatgs"]
                        : getFilteredValues.probCatgs;
                    this.filteredData["probCatgItems"] =
                      getFilteredValues.probCatgItems == undefined ||
                      getFilteredValues.probCatgItems == "undefined"
                        ? this.filteredData["probCatgItems"]
                        : getFilteredValues.probCatgItems;
                  }
                }
              }
              else{
                this.complaintCategoryWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.complaintCategoryWidget) {
                  this.complaintCategoryId = wid;
                  this.filteredData["complaintCategory"] = [];
                  this.filteredData["complaintCategoryItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["complaintCategory"] =
                      getFilteredValues.complaintCategory == undefined ||
                      getFilteredValues.complaintCategory == "undefined"
                        ? this.filteredData["complaintCategory"]
                        : getFilteredValues.complaintCategory;
                    this.filteredData["complaintCategoryItems"] =
                      getFilteredValues.complaintCategoryItems == undefined ||
                      getFilteredValues.complaintCategoryItems == "undefined"
                        ? this.filteredData["complaintCategoryItems"]
                        : getFilteredValues.complaintCategoryItems;
                  }
                }
              }                
                break;          
            case 27:
              this.symtomWidget = opt.widgetsFlag == 1 ? true : false;
              if (this.symtomWidget) {
                this.symtomId = wid;
                this.filteredData["symtoms"] = [];
                this.filteredData["symtomItems"] = [];
                if (getFilteredValues != null) {
                  this.filteredData["symtoms"] =
                    getFilteredValues.symtoms == undefined ||
                    getFilteredValues.symtoms == "undefined"
                      ? this.filteredData["symtoms"]
                      : getFilteredValues.symtoms;
                  this.filteredData["symtomItems"] =
                    getFilteredValues.symtomItems == undefined ||
                    getFilteredValues.symtomItems == "undefined"
                      ? this.filteredData["symtomItems"]
                      : getFilteredValues.symtomItems;
                }
              }
              break;
              
              case 28:
                this.subProductGroupWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.subProductGroupWidget) {
                  this.subProductGroupId = wid;
                  this.filteredData["subProductGroup"] = [];
                  this.filteredData["subProductGroupItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["subProductGroup"] =
                      getFilteredValues.subProductGroup == undefined ||
                      getFilteredValues.subProductGroup == "undefined"
                        ? this.filteredData["subProductGroup"]
                        : getFilteredValues.subProductGroup;
                    this.filteredData["subProductGroupItems"] =
                      getFilteredValues.subProductGroupItems == undefined ||
                      getFilteredValues.subProductGroupItems == "undefined"
                        ? this.filteredData["subProductGroupItems"]
                        : getFilteredValues.subProductGroupItems;
                  }
                }
                break;

              case 29:
                this.languageWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.languageWidget) {
                  this.languageId = wid;
                  this.filteredData["language"] = [];
                  this.filteredData["languageItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["language"] =
                      getFilteredValues.language == undefined ||
                      getFilteredValues.language == "undefined"
                        ? this.filteredData["language"]
                        : getFilteredValues.language;
                    this.filteredData["languageItems"] =
                      getFilteredValues.languageItems == undefined ||
                      getFilteredValues.languageItems == "undefined"
                        ? this.filteredData["languageItems"]
                        : getFilteredValues.languageItems;
                  }
                }
                break;
              case 30:
                console.log(getFilteredValues)
                this.partTypeWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.partTypeWidget) {
                  this.ptypeId = wid;
                  this.filteredData["partType"] = [];
                  this.filteredData["partTypeItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["partType"] =
                      getFilteredValues.partType == undefined ||
                      getFilteredValues.partType == "undefined"
                        ? this.filteredData["partType"]
                        : getFilteredValues.partType;
                    this.filteredData["partTypeItems"] =
                      getFilteredValues.partTypeItems == undefined ||
                      getFilteredValues.partTypeItems == "undefined"
                        ? this.filteredData["partTypeItems"]
                        : getFilteredValues.partTypeItems;
                  }
                }
                break;
              case 31:
                console.log(getFilteredValues)
                this.partAssemblyWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.partAssemblyWidget) {
                  this.passemblyId = wid;
                  this.filteredData["partAssembly"] = [];
                  this.filteredData["partAssemblyItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["partAssembly"] =
                      getFilteredValues.partAssembly == undefined ||
                      getFilteredValues.partAssembly == "undefined"
                        ? this.filteredData["partAssembly"]
                        : getFilteredValues.partAssembly;
                    this.filteredData["partAssemblyItems"] =
                      getFilteredValues.partAssemblyItems == undefined ||
                      getFilteredValues.partAssemblyItems == "undefined"
                        ? this.filteredData["partAssemblyItems"]
                        : getFilteredValues.partAssemblyItems;
                  }
                }
                break;
              case 32:
                this.partSystemWidget = opt.widgetsFlag == 1 ? true : false;
                if (this.partSystemWidget) {
                  this.psystemId = wid;
                  this.filteredData["partSystem"] = [];
                  this.filteredData["partSystemItems"] = [];
                  if (getFilteredValues != null) {
                    this.filteredData["partSystem"] =
                      getFilteredValues.partSystem == undefined ||
                      getFilteredValues.partSystem == "undefined"
                        ? this.filteredData["partSystem"]
                        : getFilteredValues.partSystem;
                    this.filteredData["partSystemItems"] =
                      getFilteredValues.partSystemItems == undefined ||
                      getFilteredValues.partSystemItems == "undefined"
                        ? this.filteredData["partSystemItems"]
                        : getFilteredValues.partSystemItems;
                  }
                }
                break;    
          }
        }

        this.sectionLoading = false;
      }, 800);
    }
  }

  changeTheme(
    primary: string,
    title: string,
    filterExArr: string,
    filterSetting: string,
    collapseArrow: string,
    fieldTitle: string,
    fieldSText: string,
    fieldLineColor: string,
    filterDeviderLineColor: string,
    filterDropDown: string,
    filterExArrActive: string,
    titleActive: string,
    reset: string
  ) {
    document.documentElement.style.setProperty("--primary-color", primary);
    document.documentElement.style.setProperty("--title-color", title);
    document.documentElement.style.setProperty(
      "--filter-expand-arrow",
      filterExArr
    );
    document.documentElement.style.setProperty(
      "--filter-setting",
      filterSetting
    );
    document.documentElement.style.setProperty(
      "--collapse-arrow",
      collapseArrow
    );
    document.documentElement.style.setProperty(
      "--field-title-color",
      fieldTitle
    );
    document.documentElement.style.setProperty(
      "--field-select-color",
      fieldSText
    );
    document.documentElement.style.setProperty(
      "--field-line-color",
      fieldLineColor
    );
    document.documentElement.style.setProperty(
      "--devider-line-color",
      filterDeviderLineColor
    );
    document.documentElement.style.setProperty(
      "--filter-drop-down",
      filterDropDown
    );
    document.documentElement.style.setProperty(
      "--filter-expand-arrow-active",
      filterExArrActive
    );
    document.documentElement.style.setProperty(
      "--title-color-active",
      titleActive
    );
    document.documentElement.style.setProperty("--filter-reset", reset);
  }
  // Manage Geo Lists
  manageGeoLists(fid, name) {
    let filterOptions = {
      territory: this.filteredData["territories"],
      location: this.filteredData["locations"],
      customer: this.filteredData["customers"],
      technician: this.filteredData["technicians"],
      dealerName: this.filteredData["dealerNames"],
      dealerCity: this.filteredData["dealerCities"],
      dealerArea: this.filteredData["dealerArea"],
      productCoor: this.filteredData["productCoor"],
      tmanager: this.filteredData["tmanagers"],
      csm: this.filteredData["csm"],
      filterId: fid,
      historyFlag: this.filterOptions["historyFlag"],
    };
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.apiData["domainId"],
      countryId: this.apiData["countryId"],
      userId: this.apiData["userId"],
      groupId: this.apiData["groupId"],
      access: fid,
      filterName: name,
      filterOptions: JSON.stringify(filterOptions),
    };

    let filteredData = [];
    switch (fid) {
      case 11:
        filteredData = this.filteredData["territories"];
        break;
      case 12:
        filteredData = this.filteredData["locations"];
        break;
      case 13:
        filteredData = this.filteredData["customers"];
        break;
      case 14:
        filteredData = this.filteredData["technicians"];
        break;
      case 15:
        filteredData = this.filteredData["csm"];
        break;
      case 17:
        filteredData = this.filteredData["otherUsers"];
        break;
      case 20:
        filteredData = this.filteredData["dealerNames"];
        break;
      case 21:
        filteredData = this.filteredData["dealerCities"];
        break;
      case 22:
        filteredData = this.filteredData["dealerArea"];
        break;
      case 23:
        filteredData = this.filteredData["productCoor"];
        break;
      case 24:
        filteredData = this.filteredData["tmanagers"];
        break;
    }

    const modalRef = this.modalService.open(
      ManageGeoListComponent,
      this.config
    );
    modalRef.componentInstance.access = "Escalations";
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.filteredItems = filteredData;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      modalRef.dismiss("Cross click");
      //console.log(receivedService)
      let selectedItems = receivedService;
      this.clearFilteredItems(fid, filterOptions, selectedItems);
      for (let item of selectedItems) {
        let id = item.id;
        let name = item.name;
        let chkIndex;
        switch (fid) {
          case 11:
            chkIndex = this.filteredData["territories"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              this.filteredData["territories"].push(id);
              this.filteredData["territoryItems"].push(name);
            }
            break;
          case 12:
            chkIndex = this.filteredData["locations"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              this.filteredData["locations"].push(id);
              this.filteredData["locationItems"].push(name);
            }
            break;
          case 13:
            chkIndex = this.filteredData["customers"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              this.filteredData["customers"].push(id);
              this.filteredData["customerItems"].push(name);
            }
            break;
          case 14:
            chkIndex = this.filteredData["technicians"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              this.filteredData["technicians"].push(id);
              this.filteredData["technicianItems"].push(name);
            }
            break;
          case 15:
            chkIndex = this.filteredData["csm"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              this.filteredData["csm"].push(id);
              this.filteredData["csmItems"].push(name);
            }
            break;
          case 17:
            chkIndex = this.filteredData["otherUsers"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              if (!this.filteredData["otherUsers"]) {
                this.filteredData["otherUsers"] = [];
              }
              if (!this.filteredData["otherUserItems"]) {
                this.filteredData["otherUserItems"] = [];
              }

              this.filteredData["otherUsers"].push(id);
              this.filteredData["otherUserItems"].push(name);
            }
            break;
          case 20:
            chkIndex = this.filteredData["dealerNames"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              if (!this.filteredData["dealerNames"]) {
                this.filteredData["dealerNames"] = [];
              }
              if (!this.filteredData["dealerNameItems"]) {
                this.filteredData["dealerNameItems"] = [];
              }

              this.filteredData["dealerNames"].push(id);
              this.filteredData["dealerNameItems"].push(name);
            }
            break;
          case 21:
            chkIndex = this.filteredData["dealerCities"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              if (!this.filteredData["dealerCities"]) {
                this.filteredData["dealerCities"] = [];
              }
              if (!this.filteredData["dealerCityItems"]) {
                this.filteredData["dealerCityItems"] = [];
              }

              this.filteredData["dealerCities"].push(id);
              this.filteredData["dealerCityItems"].push(name);
            }
            break;
          case 22:
            chkIndex = this.filteredData["dealerArea"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              if (!this.filteredData["dealerArea"]) {
                this.filteredData["dealerArea"] = [];
              }
              if (!this.filteredData["dealerAreaItems"]) {
                this.filteredData["dealerAreaItems"] = [];
              }

              this.filteredData["dealerArea"].push(id);
              this.filteredData["dealerAreaItems"].push(name);
            }
            break;
          case 23:
            chkIndex = this.filteredData["productCoor"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              if (!this.filteredData["productCoor"]) {
                this.filteredData["productCoor"] = [];
              }
              if (!this.filteredData["productCoorItems"]) {
                this.filteredData["productCoorItems"] = [];
              }

              this.filteredData["productCoor"].push(id);
              this.filteredData["productCoorItems"].push(name);
            }
            break;
          case 24:
            chkIndex = this.filteredData["tmanagers"].findIndex(
              (option) => option == id
            );
            if (chkIndex < 0) {
              if (!this.filteredData["tmanagers"]) {
                this.filteredData["tmanagers"] = [];
              }
              if (!this.filteredData["tmanagerItems"]) {
                this.filteredData["tmanagerItems"] = [];
              }

              this.filteredData["tmanagers"].push(id);
              this.filteredData["tmanagerItems"].push(name);
            }
            break;
        }
      }

      this.instantApply();
    });
  }

  // Clear Filtered Items
  clearFilteredItems(id, filterOptions, items) {
    let flag = true;
    switch (id) {
      case 11:
        this.filteredData["territories"] = [];
        this.filteredData["territoryItems"] = [];
        break;
      case 12:
        this.filteredData["locations"] = [];
        this.filteredData["locationItems"] = [];
        break;
      case 13:
        this.filteredData["customers"] = [];
        this.filteredData["customerItems"] = [];
        break;
      case 14:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["technicians"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["technicians"] = [];
          this.filteredData["technicianItems"] = [];
        }
        break;
      case 15:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["csm"]) == JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["csm"] = [];
          this.filteredData["csmItems"] = [];
        }
        break;
      case 17:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["otherUsers"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["otherUsers"] = [];
          this.filteredData["otherUserItems"] = [];
        }
        break;
      case 20:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["dealerNames"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["dealerNames"] = [];
          this.filteredData["dealerNameItems"] = [];
        }
        break;
      case 21:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["dealerCities"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["dealerCities"] = [];
          this.filteredData["dealerCityItems"] = [];
        }
        break;
      case 22:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["dealerArea"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["dealerArea"] = [];
          this.filteredData["dealerAreaItems"] = [];
        }
        break;
      case 23:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["productCoor"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["productCoor"] = [];
          this.filteredData["productCoorItems"] = [];
        }
        break;
      case 24:
        flag =
          items.length > 0 ||
          JSON.stringify(this.filteredData["tmanagers"]) ==
            JSON.stringify(items)
            ? false
            : true;
        if (flag) {
          this.filteredData["tmanagers"] = [];
          this.filteredData["tmanagerItems"] = [];
        }
        break;
    }
  }

  // Manage Tag
  manageTag(tagname, key, url) {
    let inputData = {};    
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.apiData["domainId"],
      countryId: this.apiData["countryId"],
      userId: this.apiData["userId"],
      threadType: this.apiData["threadType"],
      access: 'thread'            
    };

    if(tagname =='Tags'){
      apiData['groupId']= this.filterOptions.groupId 
    }
    else{
      inputData = {
        baseApiUrl: Constant.TechproMahleApi,
        apiUrl: Constant.TechproMahleApi+"/"+url,
        field: key,        
        selectionType: "",
        filteredItems: "",
        filteredLists: "",
        actionApiName: "",
        actionQueryValues: "",
        title: tagname
      };  
    }
    if(tagname == 'Product SubGroup'){
      apiData['ProductGroup']= this.make 
    }
    if(tagname =='Part#'){ 
      apiData['ProductGroup']= this.make;
      this.filteredData["subProductGroupItems"] = this.filteredData["subProductGroupItems"] == undefined || this.filteredData["subProductGroupItems"] == "undefined" ?  '' : this.filteredData["subProductGroupItems"];
      apiData['subProductGroup']= ( this.filteredData["subProductGroupItems"] !='' ) ? this.filteredData["subProductGroupItems"][0] : '';
    }

    console.log(apiData);

    const modalRef = this.modalService.open(ManageListComponent, this.config);    
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.height = innerHeight - 140;

    switch(tagname){
      case 'Tags':     
        modalRef.componentInstance.access = tagname;  
        modalRef.componentInstance.filteredTags = this.filteredData["tags"];
        modalRef.componentInstance.filteredLists = this.filteredData["tagItems"];        
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let tagItems = receivedService;
          let flag =
            JSON.stringify(this.filteredData["tags"]) == JSON.stringify(tagItems)
              ? false
              : true;
          if (flag) {
            this.filteredData["tags"] = [];
            this.filteredData["tagItems"] = [];
            for (let t in tagItems) {
              let tagId = tagItems[t].id;
              let tagName = tagItems[t].name;
              let chkIndex = this.filteredData["tags"].findIndex(
                (option) => option == tagId
              );
              if (chkIndex < 0) {
                this.filteredData["tags"].push(tagId);
                this.filteredData["tagItems"].push(tagName);
              }
            }
            this.instantApply();
          }
        });
        break;
      case 'Problem Category': 

      this.filteredData["probCatgs"] = this.filteredData["probCatgs"] == undefined ? '' : this.filteredData["probCatgs"];
      this.filteredData["probCatgItems"] = this.filteredData["probCatgItems"] == undefined ? '' : this.filteredData["probCatgItems"];

      let inputData5 = {
        baseApiUrl: Constant.TechproMahleApi,
        apiUrl: Constant.TechproMahleApi+""+Constant.filterProblemCategoryApiUrl,
        field: "problemCategory",
        selectionType: "single",
        filteredItems: this.filteredData["probCatgs"],
        filteredLists: this.filteredData["probCatgItems"],
        actionApiName: "",
        actionQueryValues: "",
        title: "Problem Category"
      };    
        modalRef.componentInstance.access = "newthread";        
        modalRef.componentInstance.filteredTags = this.filteredData["probCatgs"];
        modalRef.componentInstance.filteredLists = this.filteredData["probCatgItems"];       
        modalRef.componentInstance.inputData = inputData5;       
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let tagItems = receivedService;
          let flag =
            JSON.stringify(this.filteredData["probCatgs"]) == JSON.stringify(tagItems)
              ? false
              : true;
          if (flag) {
            this.filteredData["probCatgs"] = [];
            this.filteredData["probCatgItems"] = [];
            for (let t in tagItems) {
              let probCatgId = tagItems[t].id;
              let tagName = tagItems[t].name;
              let chkIndex = this.filteredData["probCatgs"].findIndex(
                (option) => option == probCatgId
              );
              if (chkIndex < 0) {
                this.filteredData["probCatgs"].push(probCatgId);
                this.filteredData["probCatgItems"].push(tagName);
              }
            }
            this.instantApply();
          }
        });
        break;
      case 'Complaint Category':       
        inputData['selectionType'] ="single";
        inputData['filteredItems'] = this.filteredData["complaintCategory"];
        inputData['filteredLists'] = this.filteredData["complaintCategoryItems"];          
        modalRef.componentInstance.access = "newthread";        
        modalRef.componentInstance.filteredTags = this.filteredData["complaintCategory"];
        modalRef.componentInstance.filteredLists = this.filteredData["complaintCategoryItems"];       
        modalRef.componentInstance.inputData = inputData;        
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let tagItems = receivedService;
          let flag =
            JSON.stringify(this.filteredData["complaintCategory"]) == JSON.stringify(tagItems)
              ? false
              : true;
          if (flag) {
            this.filteredData["complaintCategory"] = [];
            this.filteredData["complaintCategoryItems"] = [];
            for (let t in tagItems) {
              let complaintCategoryId = tagItems[t].id;
              let tagName = tagItems[t].name;
              let chkIndex = this.filteredData["complaintCategory"].findIndex(
                (option) => option == complaintCategoryId
              );
              if (chkIndex < 0) {
                this.filteredData["complaintCategory"].push(complaintCategoryId);
                this.filteredData["complaintCategoryItems"].push(tagName);
              }
            }
            this.instantApply();
          }
        });
      break;
      case 'Symptom': 
      case 'symptom':
        let inputData2 = {
          baseApiUrl: Constant.TechproMahleApi,
          apiUrl: Constant.TechproMahleApi+"/"+Constant.filterSymptomApiUrl,
          field: "Symptoms",
          selectionType: "single",
          filteredItems: this.filteredData["symtoms"],
          filteredLists: this.filteredData["symtomItems"],
          actionApiName: "",
          actionQueryValues: "",
          title: "Symptoms"
        };                         
        modalRef.componentInstance.access = "newthread";        
        modalRef.componentInstance.filteredTags = this.filteredData["symtoms"];
        modalRef.componentInstance.filteredLists = this.filteredData["symtomItems"];       
        modalRef.componentInstance.inputData = inputData2;        
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let tagItems = receivedService;
          let flag =
            JSON.stringify(this.filteredData["symtoms"]) == JSON.stringify(tagItems)
              ? false
              : true;
          if (flag) {
            this.filteredData["symtoms"] = [];
            this.filteredData["symtomItems"] = [];
            for (let t in tagItems) {
              let symtomId = tagItems[t].id;
              let tagName = tagItems[t].name;
              let chkIndex = this.filteredData["symtoms"].findIndex(
                (option) => option == symtomId
              );
              if (chkIndex < 0) {
                this.filteredData["symtoms"].push(symtomId);
                this.filteredData["symtomItems"].push(tagName);
              }
            }
            this.instantApply();
          }
        });
      break;
      case 'Language': 
        let inputData1 = {
          baseApiUrl: Constant.TechproMahleApi,
          apiUrl: Constant.TechproMahleApi+"/"+Constant.filterLanguageApiUrl,
          field: "language",
          selectionType: "single",
          filteredItems: this.filteredData["language"],
          filteredLists: this.filteredData["languageItems"],
          actionApiName: "",
          actionQueryValues: "",
          title: "Language"
        };     
        inputData['selectionType'] ="multiple";
        inputData['filteredItems'] = this.filteredData["language"];
        inputData['filteredLists'] = this.filteredData["languageItems"];    
        modalRef.componentInstance.access = "newthread";        
        modalRef.componentInstance.filteredTags = this.filteredData["language"];
        modalRef.componentInstance.filteredLists = this.filteredData["languageItems"];        
        modalRef.componentInstance.inputData = inputData1;        
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let tagItems = receivedService;
          let flag =
            JSON.stringify(this.filteredData["language"]) == JSON.stringify(tagItems)
              ? false
              : true;
          if (flag) {
            this.filteredData["language"] = [];
            this.filteredData["languageItems"] = [];
            for (let t in tagItems) {
              let languageId = tagItems[t].id;
              let tagName = tagItems[t].name;
              let chkIndex = this.filteredData["language"].findIndex(
                (option) => option == languageId
              );
              if (chkIndex < 0) {
                this.filteredData["language"].push(languageId);
                this.filteredData["languageItems"].push(tagName);
              }
            }
            this.instantApply();
          }
        });
      break;
      case 'Product SubGroup':
        this.models = [];          
        this.filteredData["model"] = [];
        this.filteredModels = [];  
        let inputData3 = {
          baseApiUrl: Constant.TechproMahleApi,
          apiUrl: Constant.TechproMahleApi+"/"+Constant.filterSubProductGroupUrl,
          field: "subProductGroup",
          selectionType: "single",
          filteredItems: this.filteredData["subProductGroup"],
          filteredLists: this.filteredData["subProductGroupItems"],
          actionApiName: "",
          actionQueryValues: "",
          title: "Product SubGroup"
        };                    
        modalRef.componentInstance.access = "newthread";          
        modalRef.componentInstance.filteredTags = this.filteredData["subProductGroup"];
        modalRef.componentInstance.filteredLists = this.filteredData["subProductGroupItems"];          
        modalRef.componentInstance.inputData = inputData3;          
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let items = receivedService;
          console.log(receivedService);
          let flag =
            JSON.stringify(this.filteredData["subProductGroup"]) == JSON.stringify(items)
              ? false
              : true;
          if (flag) {
            this.filteredData["subProductGroup"] = [];
            this.filteredData["subProductGroupItems"] = [];
            for (let i in items) {
              let subProductGroupId = items[i].id;
              let subProductGroupName = items[i].name;
              this.subProductGroupName = subProductGroupName;
              let chkIndex = this.filteredData["subProductGroup"].findIndex(
                (option) => option == subProductGroupId
              );
              if (chkIndex < 0) {  
                this.filteredData["subProductGroup"].push(subProductGroupId);
                this.filteredData["subProductGroupItems"].push(subProductGroupName);
              }
            }              
            this.instantApply();
          }
        });
        break;      
      case 'Part#': 
        this.models = [];
        if(this.filteredData["modelId"] == undefined || this.filteredData["modelId"] == "undefined" || this.filteredData["modelId"] == ''){
          this.filteredData["modelId"] = '';
        }
        let inputData4 = {
          baseApiUrl: Constant.TechproMahleApi,
          apiUrl: Constant.TechproMahleApi+"/"+Constant.partUrl,
          field: "PartModel",
          selectionType: "single",
          filteredItems: this.filteredData["modelId"],
          filteredLists: this.filteredData["model"],
          actionApiName: "",
          actionQueryValues: "",
          title: "Part#"
        };                    
        modalRef.componentInstance.access = "newthread";          
        modalRef.componentInstance.filteredTags = this.filteredData["modelId"];
        modalRef.componentInstance.filteredLists = this.filteredData["model"];          
        modalRef.componentInstance.inputData = inputData4;          
        modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
          //modalRef.dismiss('Cross click');
          let items = receivedService;
          console.log(receivedService);
          let flag =
            JSON.stringify(this.filteredData["modelId"]) == JSON.stringify(items)
              ? false
              : true;
          if (flag) {
            this.filteredData["modelId"] = [];
            this.filteredData["model"] = [];
            for (let i in items) {
              let modelId = items[i].id;
              let model = items[i].name;                
              let chkIndex = this.filteredData["modelId"].findIndex(
                (option) => option == modelId
              );
              if (chkIndex < 0) {
                this.filteredData["modelId"].push(modelId);
                this.filteredData["model"].push(model);
                this.models.push(model);
              }
            }
            this.instantApply();
          }
        });
      break;
      default:
      break;
    }
  }

  // Manage Part Type, Assembly & System
  managePart(fname, key) {
    console.log(fname, key)
    let baseApiUrl = this.apiUrl.apiCollabticBaseUrl();
    let inputData = {
      baseApiUrl: baseApiUrl,
      apiUrl: baseApiUrl+"/parts/GePartsAttributesInfo",
      field: key,
      selectionType: "multiple",
      actionApiName: "",
      actionQueryValues: "",
      title: fname
    };
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.apiData["domainId"],
      countryId: this.apiData["countryId"],
      userId: this.apiData["userId"],
      access: 'part-filter'            
    };
    const modalRef = this.modalService.open(ManageListComponent, this.config);    
    modalRef.componentInstance.accessAction = false;
    modalRef.componentInstance.apiData = apiData;
    modalRef.componentInstance.inputData = inputData;
    modalRef.componentInstance.height = innerHeight - 140;
    modalRef.componentInstance.access = key; 
    
    let filterList, filterItems;
    switch(key) {
      case 'PartType':
        filterList = this.filteredData["partType"];
        filterItems = this.filteredData["partTypeItems"];
        break;
      case 'PartAssembly':
        filterList = this.filteredData["partAssembly"];
        filterItems = this.filteredData["partAssemblyItems"];
        break;
      case 'PartSystem':
        filterList = this.filteredData["partSystem"];
        filterItems = this.filteredData["partSystemItems"];
        break;
    }

    modalRef.componentInstance.filteredTags = filterList;
    modalRef.componentInstance.filteredLists = filterItems;
    modalRef.componentInstance.selectedItems.subscribe((receivedService) => {
      //modalRef.dismiss('Cross click');
      let pItems = receivedService;
      console.log(pItems)
      let flag = JSON.stringify(filterList) == JSON.stringify(pItems) ? false : true;
      if (flag) {
        filterList = [];
        filterItems = [];
        for (let t in pItems) {
          let tagId = pItems[t].id;
          let tagName = pItems[t].name;
          let chkIndex = filterList.findIndex(
            (option) => option == tagId
          );
          if (chkIndex < 0) {
            filterList.push(tagId);
            filterItems.push(tagName);
          }
        }
        switch(key) {
          case 'PartType':
            this.filteredData["partType"] = filterList;
            this.filteredData["partTypeItems"] =filterItems;
            break;
          case 'PartAssembly':
            this.filteredData["partAssembly"] = filterList;
            this.filteredData["partAssemblyItems"] = filterItems;
            break;
          case 'PartSystem':
            this.filteredData["partSystem"] = filterList;
            this.filteredData["partSystemItems"] = filterItems;
            break;
        }
        this.instantApply();
      }
    });
    
  }

  // Filtered Workstreams
  selectedWorkstreams(list) {
    console.log(list);
    let items = list.items;
    let flag =
      JSON.stringify(this.storedWorkstreams) == JSON.stringify(items)
        ? false
        : !list.init;
    flag = items.length == 0 && this.storedWorkstreams.length > 0 ? true : flag;
    this.filteredWorkstreams = items;
    this.filteredData["workstream"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }

  // Selected Makes
  selectedMakes(items) {
    this.filteredMakes = items;
    this.filteredData["make"] = items;
  }

  // Selected Models
  selectedModels(list) {
    let items = list.items;
    let flag =
      JSON.stringify(this.storedModels) == JSON.stringify(items)
        ? false
        : !list.init;
    flag = items.length == 0 && this.storedModels.length > 0 ? true : flag;
    this.filteredModels = items;
    this.filteredData["model"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }

  // Selected Years
  selectedYears(list) {
    let items = list.items;
    let flag =
      JSON.stringify(this.storedYears) == JSON.stringify(items)
        ? false
        : !list.init;
    flag = items.length == 0 && this.storedYears.length > 0 ? true : flag;
    this.filteredYears = items;
    this.filteredData["year"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }

  // Selected Status
  selectedStatus(list) {
    let items = list.items;
    let flag =
      JSON.stringify(this.storedStatus) == JSON.stringify(items)
        ? false
        : !list.init;
    flag = items.length == 0 && this.storedStatus.length > 0 ? true : flag;
    this.filteredStatus = items;
    this.filteredData["status"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }
  selectedThreadStatus(list) {
    let items = list.items;
    let flag =
      JSON.stringify(this.storedThreadStatus) == JSON.stringify(items)
        ? false
        : !list.init;
    flag =
      items.length == 0 && this.storedThreadStatus.length > 0 ? true : flag;
    this.filteredThreadStatus = items;
    this.filteredData["threadStatus"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }
  selectedErrorCode(list) {
    let items = list.items;
    let flag =
      JSON.stringify(this.storedErrorCode) == JSON.stringify(items)
        ? false
        : !list.init;
    flag = items.length == 0 && this.storedErrorCode.length > 0 ? true : flag;
    this.filteredErrorCode = items;
    this.filteredData["errorCode"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }

  // Selected Media Types
  selectedMediaTypes(list) {
    let items = list.items;
    let flag =
      JSON.stringify(this.storedMediaTypes) == JSON.stringify(items)
        ? false
        : !list.init;
    flag = items.length == 0 && this.storedMediaTypes.length > 0 ? true : flag;
    this.filteredMediaTypes = items;
    this.filteredData["mediaTypes"] = items;
    if (flag && list.emit) {
      this.instantApply();
    }
  }

  // Disable Selection
  disableSelection(id, index) {
    switch (id) {
      case 2:
        this.filteredData["model"].splice(index, 1);
        break;
      case 5:
        this.filteredData["tags"].splice(index, 1);
        this.filteredData["tagItems"].splice(index, 1);
        break;
      case 11:
        this.filteredData["territories"].splice(index, 1);
        this.filteredData["territoryItems"].splice(index, 1);
        break;
      case 12:
        this.filteredData["locations"].splice(index, 1);
        this.filteredData["locationItems"].splice(index, 1);
        break;
      case 13:
        this.filteredData["customers"].splice(index, 1);
        this.filteredData["customerItems"].splice(index, 1);
        break;
      case 14:
        this.filteredData["technicians"].splice(index, 1);
        this.filteredData["technicianItems"].splice(index, 1);
        break;
      case 15:
        this.filteredData["csm"].splice(index, 1);
        this.filteredData["csmItems"].splice(index, 1);
        break;
      case 16:
        this.filteredData["status"].splice(index, 1);
        break;
      case 17:
        this.filteredData["otherUsers"].splice(index, 1);
        this.filteredData["otherUserItems"].splice(index, 1);
        break;
      case 18:
        this.filteredData["threadStatus"].splice(index, 1);
        break;
      case 19:
        this.filteredData["errorCode"].splice(index, 1);
        break;
      case 20:
        this.filteredData["dealerNames"].splice(index, 1);
        this.filteredData["dealerNameItems"].splice(index, 1);
        break;
      case 21:
        this.filteredData["dealerCities"].splice(index, 1);
        this.filteredData["dealerCityItems"].splice(index, 1);
        break;
      case 22:
        this.filteredData["dealerArea"].splice(index, 1);
        this.filteredData["dealerAreaItems"].splice(index, 1);
        break;
      case 23:
        this.filteredData["productCoor"].splice(index, 1);
        this.filteredData["productCoorItems"].splice(index, 1);
        break;
      case 24:
        this.filteredData["tmanagers"].splice(index, 1);
        this.filteredData["tmanagerItems"].splice(index, 1);
        break;
      case 25:        
        break;
      case 26:
        if(this.filterOptions.page == "knowledge-base"){
          this.filteredData["probCatgs"].splice(index, 1);
          this.filteredData["probCatgItems"].splice(index, 1);
        }
        else{
          this.filteredData["complaintCategory"].splice(index, 1);
          this.filteredData["complaintCategoryItems"].splice(index, 1);
        }       
        break;
      case 27:
        this.filteredData["symtoms"].splice(index, 1);
        this.filteredData["symtomItems"].splice(index, 1);
        break;      
      case 28:
        this.filteredData["subProductGroup"].splice(index, 1);
        this.filteredData["subProductGroupItems"].splice(index, 1);
        this.models = [];
        break;
      case 29:
        this.filteredData["language"].splice(index, 1);
        this.filteredData["languageItems"].splice(index, 1);
        break;
      case 30:
        this.filteredData["partType"].splice(index, 1);
        this.filteredData["partTypeItems"].splice(index, 1);
        break;
      case 31:
        this.filteredData["partAssembly"].splice(index, 1);
        this.filteredData["partAssemblyItems"].splice(index, 1);
        break;
      case 32:
        this.filteredData["partSystem"].splice(index, 1);
        this.filteredData["partSystemItems"].splice(index, 1);
        break;
    }
    this.instantApply();
  }

  /**
   * Filter Expand/Collapse
   */
  expandAction() {
    this.expandFlag = this.expandFlag ? false : true;

    if (this.expandFlag) {
      $(".center-middle-width-container").addClass("ease-out-animate");
      $(".threads-page-filter").addClass(
        "col col-lg-2 col-md-2 col-xl-2 col-sm-2"
      );
      $(".threads-page-filter").addClass("filter-show-hide");
      $(".text-thread-title").removeClass("hide");
      //$('.center-middle-width').css("width", "60%");
      //$('.center-middle-width').animate({width: '60%'});
      let access = this.filterOptions.page;
      if (access == "search") {
        $(".center-middle-width-container").addClass(
          "col-lg-10  col-md-10 col-xl-10 col-sm-10"
        );
        $(".center-middle-width-container").removeClass(
          "col-lg-12  col-md-12 col-xl-12 col-sm-12 adding-width-12"
        );
      } else {
        if ($(".center-middle-width-container").hasClass("adding-width-12")) {
          $(".center-middle-width-container").addClass(
            "col-lg-10  col-lg-10 col-lg-10 col-lg-10 adding-width-10"
          );
          $(".center-middle-width-container").removeClass(
            "col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12"
          );
        } else {
          $(".center-middle-width-container").addClass(
            "col-lg-8  col-md-8 col-xl-8 col-sm-8"
          );
          $(".center-middle-width-container").removeClass(
            "col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10"
          );
        }
      }

      setTimeout(() => {
        //<<<---using ()=> syntax
        $(".center-middle-width-container").removeClass("ease-out-animate");
      }, 5000);
    } else {
      $(".center-middle-width-container").addClass("ease-out-animate");
      $(".threads-page-filter").removeClass(
        "col col-lg-2 col-md-2 col-xl-2 col-sm-2"
      );
      $(".threads-page-filter").addClass("filter-show-hide");
      $(".text-thread-title").addClass("hide");
      let access = this.filterOptions.page;

      if (access == "search") {
        $(".center-middle-width-container").removeClass(
          "col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10"
        );
        $(".center-middle-width-container").addClass(
          "col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12"
        );
      } else {
        if ($(".center-middle-width-container").hasClass("adding-width-10")) {
          $(".center-middle-width-container").removeClass(
            "col-lg-10  col-md-10 col-xl-10 col-sm-10 adding-width-10"
          );
          $(".center-middle-width-container").addClass(
            "col-lg-12 col-md-12 col-xl-12 col-sm-12 adding-width-12"
          );
        } else {
          $(".center-middle-width-container").removeClass(
            "col-lg-8  col-md-8 col-xl-8 col-sm-8"
          );
          $(".center-middle-width-container").addClass(
            "col-lg-10 col-md-10 col-xl-10 col-sm-10 adding-width-10"
          );
        }
      }

      // alert(ss+ss1);
      //$('.center-middle-width-container').css('flex',"0 0 75%");
      //$('.center-middle-width-container').css('maxWidth',"75%");

      //$('.center-middle-width-container').css('max-width',"75%");

      //$('.center-middle-width-container').animate({'max-width': "0 0 75%"});
      //$('.center-middle-width-container').animate({'flex': "0 0 75%"});

      //$('.center-middle-width').css("width", "76%");
      //  $('.center-middle-width').animate({width: '75.5%'});
      //$('.domain-toggle').removeClass('active');
      setTimeout(() => {
        //<<<---using ()=> syntax
        $(".center-middle-width-container").removeClass("ease-out-animate");
      }, 5000);
    }

    this.toggle.emit(this.expandFlag);
  }

  /**
   * Filter Setting Enable or Disabel
   */
  filterToggle(event, index, id, action) {
    //event.stopPropagation()
    let wid = id;
    let contentTypeId: any = 6;
    let flag: any = action == 1 ? 0 : 1;
    this.sectionLoading = true;

    let apiData = new FormData();
    apiData.append("apiKey", this.apiData["apiKey"]);
    apiData.append("domainId", this.apiData["domainId"]);
    apiData.append("countryId", this.apiData["countryId"]);
    apiData.append("userId", this.apiData["userId"]);
    apiData.append("contentTypeId", contentTypeId);
    apiData.append("filterId", wid);
    apiData.append("filterValue", flag);

    this.filterApi.manageFilterSettings(apiData).subscribe((response) => {
      //this.sectionLoading = false;
      if (response.status == "Success") {
        let empty = [];
        this.options[index]["widgetsFlag"] = flag;
        this.availFilter = flag == 1 ? ++this.availFilter : --this.availFilter;
        //console.log(this.availFilter)
        switch (parseInt(id)) {
          case 1:
            this.make = "";
            this.filteredData["make"] = empty;
            if (this.modelWidget) {
              this.models = this.defaultModels;
              this.filteredData["model"] = empty;
              this.filteredModels = empty;
            }
            let modelIndex = index + 1;
            let modelId = this.options[modelIndex]["id"];
            this.filterToggle(event, modelIndex, modelId, action);
            break;
          case 2:
            this.models = this.defaultModels;
            this.filteredData["model"] = empty;
            this.filteredModels = empty;
            break;
          case 3:
            this.filteredYears = empty;
            this.filteredData["year"] = empty;
            break;
          case 4:
            this.filteredWorkstreams = empty;
            this.filteredData["workstream"] = empty;
            break;
          case 5:
            this.filteredData["tags"] = empty;
            this.filteredData["tagItems"] = empty;
            break;
          case 6:
            this.filteredData["mediaTypes"] = empty;
            break;
          case 7:
            this.filteredData["startDate"] = "";
            break;
          case 8:
            this.filteredData["endDate"] = "";
            break;
          case 11:
            this.filteredData["territories"] = empty;
            this.filteredData["territoryItems"] = empty;
            break;
          case 12:
            this.filteredData["locations"] = empty;
            this.filteredData["locationItems"] = empty;
            break;
          case 13:
            this.filteredData["customers"] = empty;
            this.filteredData["customerItems"] = empty;
            break;
          case 14:
            this.filteredData["technicians"] = empty;
            this.filteredData["technicianItems"] = empty;
            break;
          case 15:
            this.filteredData["csm"] = empty;
            this.filteredData["csmItems"] = empty;
            break;
          case 16:
            this.filteredData["status"] = empty;
            break;
          case 17:
            this.filteredData["otherUsers"] = empty;
            this.filteredData["otherUserItems"] = empty;
            break;
          case 18:
            this.filteredData["threadStatus"] = empty;
            break;
          case 19:
            this.filteredData["errorCode"] = empty;
            break;
          case 20:
            this.filteredData["dealerNames"] = empty;
            this.filteredData["dealerNameItems"] = empty;
            break;
          case 21:
            this.filteredData["dealerCities"] = empty;
            this.filteredData["dealerCityItems"] = empty;
            break;
          case 22:
            this.filteredData["dealerArea"] = empty;
            this.filteredData["dealerAreaItems"] = empty;
            break;
          case 23:
            this.filteredData["productCoor"] = empty;
            this.filteredData["productCoorItems"] = empty;
            break;
          case 24:
            this.filteredData["tmanagers"] = empty;
            this.filteredData["tmanagerItems"] = empty;
            break;
          case 25:           
            break;
          case 26:
            if(this.filterOptions.page == "knowledge-base"){
              this.filteredData["probCatgs"] = empty;
              this.filteredData["probCatgItems"] = empty;
            }
            else{
              this.filteredData["complaintCategory"] = empty;
              this.filteredData["complaintCategoryItems"] = empty;
            }
            break;
          case 27:
            this.filteredData["symtoms"] = empty;
            this.filteredData["symtomItems"] = empty;
            break;         
          case 28:
            this.filteredData["subProductGroup"] = empty;
            this.filteredData["subProductGroupItems"] = empty;
            break;
          case 29:
            this.filteredData["language"] = empty;
            this.filteredData["languageItems"] = empty;
            break;
          case 30:
            this.filteredData["partType"] = empty;
            this.filteredData["partType"] = empty;
            break;
          case 31:
            this.filteredData["partAssembly"] = empty;
            this.filteredData["partAssemblyItems"] = empty;
            break;
          case 32:
            this.filteredData["partSystem"] = empty;
            this.filteredData["partSystemItems"] = empty;
            break;
        }

        setTimeout(() => {
          this.applyFilter(this.resetFlag);
        }, 700);
      }
    });
  }

  // Custom Selection Change
  selectChange(action, id, value) {
    console.log(action + "::" + id + "::" + value);
    switch (id) {
      case 1:
        this.make = value;
        this.modelLoading = true;
        this.filteredData["make"] = [this.make];
        console.log(this.make);
        if (this.modelWidget) {
          if (action == "change") {
            this.instantApply();
            if(!this.mahleEuropeFlag){this.getModels(this.make);}
            else{
              this.filteredData["subProductGroup"] = [];
              this.filteredData["subProductGroupItems"] = [];
              this.filteredData["modelId"] = [];
              this.filteredData["model"] = [];
            }
          } else {
            // Get Model List
            if(!this.mahleEuropeFlag){this.getModels(this.make);}
            else{
              //this.filteredData["subProductGroup"] = [];
              //this.filteredData["subProductGroupItems"] = [];
            }
          }
        }
        break;
      case 3:
        console.log(value)
        //this.filteredYears
        break;  
      case 7:
        this.startDateValue = value;
        let sdate =
          this.startDateValue != ""
            ? moment(this.startDateValue).format("MMM DD YYYY")
            : this.startDateValue;
        this.endDateValue =
          this.endDateValue != ""
            ? this.endDateValue
            : moment(this.today).format();
        let edate =
          this.endDateValue != ""
            ? moment(this.endDateValue).format()
            : this.endDateValue;
        let res =
          this.startDateValue != "" && this.endDateValue != ""
            ? moment(edate).diff(moment(sdate), "days", true)
            : -1;
        this.disableFilterAction = res < 0 ? true : false;
        this.dateErrorFlag =
          this.endDateValue != "" ? this.disableFilterAction : false;
        this.dateErrorTxt = this.dateErrorFlag
          ? "Start date must be less than end date"
          : this.dateErrorTxt;
        if (!this.disableFilterAction) {
          this.durationValue = res > 60 ? 0 : res;
          this.filteredData["startDate"] = moment(value).format("YYYY-MM-DD");
          this.filteredData["endDate"] = moment(this.endDateValue).format(
            "YYYY-MM-DD"
          );
          this.instantApply();
        }
        break;
      case 8:
        if (this.startDateValue == "") {
          this.dateErrorFlag = this.startDateValue == "" ? true : false;
          this.dateErrorTxt = this.dateErrorFlag
            ? "Start date is required"
            : this.dateErrorTxt;
          return;
        }
        this.endDateValue = value;
        this.disableFilterAction = false;
        this.dateErrorFlag = this.startDateValue == "" ? true : false;
        this.dateErrorTxt = this.dateErrorFlag
          ? "Start date is required"
          : this.dateErrorTxt;
        if (this.startDateValue != "" && this.endDateValue != "") {
          let stdate = moment(this.startDateValue).format();
          let endate = moment(this.endDateValue).format();
          let enres = moment(endate).diff(moment(stdate), "days", true);
          this.disableFilterAction = enres < 0 ? true : false;
          this.dateErrorFlag = this.disableFilterAction;
          if (!this.disableFilterAction) {
            this.durationValue = enres > 60 ? 0 : enres;
            this.filteredData["startDate"] = moment(this.startDateValue).format(
              "YYYY-MM-DD"
            );
            this.filteredData["endDate"] = moment(value).format("YYYY-MM-DD");
            this.instantApply();
          }
        }
        break;
    }
  }

  // Get Model List
  getModels(value) {
    let apiData = {
      apiKey: this.apiData["apiKey"],
      domainId: this.apiData["domainId"],
      countryId: this.apiData["countryId"],
      threadType: this.apiData["threadType"],
      make: value,
    };    
    this.partsApi.getModels(apiData).subscribe((response) => {
      this.modelLoading = false;
      if (response.status == "Success") {
        let resultData = response.data.model;
        this.models = [];
        for (let m of resultData) {
          this.models.push({
            id: m,
            name: m,
          });
        }
      }
    });
  }
  // Get Model List
  /*getSubModels(value) {

    let apiData = new FormData();
    apiData.append('apiKey', this.apiData["apiKey"]);
    apiData.append('domainId', this.apiData["domainId"]);
    apiData.append('countryId', this.apiData["countryId"]);
    apiData.append('threadType', this.apiData["threadType"]);
    apiData.append('ProductGroup', value);

    this.productMatrixServiceApi.getProductSubGroupList(apiData).subscribe((response) => {
      this.modelLoading = false;
      if (response.status == "Success") {
        let resultData = response.data.items;
        this.models = [];
        if(response.data.total > 0){
          for (let m of resultData) {
            this.models.push({
              id: m.name,
              name: m.name,
            });
          }
        }
        else{
          this.models = [];
        }
      }
    });
  }*/

  // Option Search
  filterSearchOptions(field, value) {
    switch (field) {
      case "make":
        this.filteredMakes = [];
        break;
    }
    this.selectSearch(field, value);
  }

  // Filter Search
  selectSearch(field, value: string) {
    let filter = value.toLowerCase();
    switch (field) {
      case "make":
        this.filteredMakes = [];
        for (let i = 0; i < this.makes.length; i++) {
          let option = this.makes[i];
          if (option.toLowerCase().indexOf(filter) >= 0) {
            this.filteredMakes.push(option);
          }
        }
        break;
    }
  }

  // Instant Apply
  instantApply() {
    let access = this.filterOptions.page;
    this.initFlag = false;
    this.applyFilter(this.resetFlag);
  }

  // Apply Filter
  applyFilter(resetAction) {
    console.log(this.filteredData);
    this.initFlag = resetAction ? resetAction : this.initFlag;
    this.filterLoading = resetAction ? true : false;
    this.filteredData["reset"] = resetAction;
    this.filteredData["action"] = "get";
    this.activeFilter = resetAction ? false : true;
    this.filterAction.emit(this.filteredData);
  }
}
