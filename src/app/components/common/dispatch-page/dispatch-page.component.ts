import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Output,
} from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LandingpageService } from "../../../services/landingpage/landingpage.service";
import { Constant } from "src/app/common/constant/constant";
import { AuthenticationService } from "../../../services/authentication/authentication.service";
import * as moment from "moment";

interface Country {
  label: string;
  val: string;
}
@Component({
  selector: "app-dispatch-page",
  templateUrl: "./dispatch-page.component.html",
  styleUrls: ["./dispatch-page.component.scss"],
})
export class DispatchPageComponent implements OnInit {
  @Input() displayModalChanged: boolean = false;
  @Input() selectedDay: number = 5;
  @Output() dispatchComponentRef: EventEmitter<DispatchPageComponent> =
    new EventEmitter();
  serviceForm: FormGroup;
  public thumbView: boolean = false;
  public accessFrom: string = "";
  public updateMasonryLayout: boolean = false;
  public displayNoRecords: boolean = false;
  public serviceList: any = [];
  public profileImage: string = "";
  displayModal: boolean = false;
  displayNote: boolean = false;
  Shops: any = [];
  mapOptions = {};
  mapOverlays = [];
  date3: Date;
  meridiem: any = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];
  vinIsValid: boolean = false;
  Time: any = [];
  Status: any = [];
  Technician: any = [];
  Models: any = [];
  Makes: any = [];
  Years: any = [];
  serviceCategory: any = [];
  techSelected: Country = this.Technician[0];
  connectedCont: any = [0, 1, 2, 3, 4];
  selectedShop;
  displayDetails: boolean = false;
  public serviceAPIcall;
  public userId;
  public user;
  public domainId;
  public roleId;
  public countryId;
  public itemLimit: number = 10;
  public itemOffset: number = 0;
  loadingDispatch: boolean = false;
  today = moment().format("YYYY-MM-DD");
  @Output() selectedDayChange: EventEmitter<any> = new EventEmitter<any>();
  serviceData: any = [];
  makeList: any;
  public vehicleFormInfo = [];
  vinValid: boolean = false;
  yrData = [];
  @Input() public filteredYears;
  dbSelectedYr = [];
  public currYear: any = moment().format("Y");
  public initYear: number = 1960;
  vinData: any = [];
  modalState : string = 'add';
  serviceId : number = null;
  notesDate:any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private LandingpagewidgetsAPI: LandingpageService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.dispatchComponentRef.emit(this);
    this.defaultData();
    this.getDispatchList(new Date());
    this.createForm();
  }

  createForm(date = new Date()) {
    // date = "05/04/2022"
    date = new Date(date);
    const vin_pattern = `^(?=.*[0-9])(?=.*[A-z])[0-9A-z-]{17}$`;
    this.serviceForm = new FormGroup({
      shopId: new FormControl(null, [Validators.required]),
      mapValue: new FormControl(null),
      serviceDate: new FormControl(date, [Validators.required]),
      serviceTime: new FormControl(moment().format("hh:mm"), [
        Validators.required,
      ]),
      selectedMeridiem: new FormControl(moment().format("A"), [
        Validators.required,
      ]),
      any_time: new FormControl(false),
      repairOrder: new FormControl(null),
      technicianId: new FormControl(null),
      vin: new FormControl(null, [Validators.pattern(vin_pattern)]),
      make: new FormControl(null),
      model: new FormControl(null),
      year: new FormControl(null),
      serviceNotes: new FormControl(null),
      statusId: new FormControl(1),
      serviceCatg: new FormControl(null),
    });
  }

  getDispatchList(date) {
    this.loadingDispatch = true;
    let apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      // domainId: this.domainId,
      domainId: localStorage.getItem("domainId"),
      userId: this.userId,
      offset: this.itemOffset,
      limit: this.itemLimit,
      startDate: moment(date).format("YYYY-MM-DD"),
    };
    this.serviceAPIcall = this.LandingpagewidgetsAPI.serviceListAPI(
      apiInfo
    ).subscribe((response) => {
      this.dataMappingByDates(response?.data);
    });
  }

  dataMappingByDates(cardData: any) {
    this.serviceList = [];
    Object.keys(cardData).forEach((element) => {
      let tempObj = {};
      tempObj["display_date"] = moment(element).toISOString();
      tempObj["date"] = element;
      tempObj["body"] = cardData[element].items;
      this.serviceList.push(tempObj);
    });
    this.selectedDay = this.serviceList.length;
    this.selectedDayChange.emit(this.selectedDay);
    this.loadingDispatch = false;
  }

  displayDate(date) {
    return moment(date).format("ddd, MMMM DD");
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  openDetails(id) {
    this.displayDetails = true;
    this.serviceDetails(id);
  }

  displayModel(date,state) {
    // date = moment(date).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    // date = moment(date).toISOString();
    this.displayModal = true;
    this.createForm(date);
    this.modalState = state;
  }

  displayNotesData(date,item) {
    this.notesDate = item;
    this.notesDate['date'] = date;
    this.displayNote = true;
  }

  defaultData() {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem("countryId");
    this.itemOffset = 0;
    this.getShopList();
    this.getStatusList();
    this.getTechnicianList();
    this.getServiceCategory();
    this.getProductMakeList();
    /* this.getMakeModelsList(); */
    this.getYearsList();
  }

  getShopList() {
    let apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
    };
    this.LandingpagewidgetsAPI.shopListAPI(apiInfo).subscribe((response) => {
      this.Shops = response?.data;
      this.Shops.splice(0, 0, { value: 0, label: "New Shop" });
      this.selectedShop = this.Shops[1];
    });
  }

  getStatusList() {
    let apiInfo = {
      apikey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
    };
    this.LandingpagewidgetsAPI.statusListAPI(apiInfo).subscribe((response) => {
      this.Status = response?.data;
    });
  }

  getTechnicianList() {
    let searchText = "";
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("limit", "20");
    apiFormData.append("offset", "0");
    apiFormData.append("searchText", searchText);
    this.LandingpagewidgetsAPI.getAlldomainUsers(apiFormData).subscribe(
      (response) => {
        this.Technician = response?.dataInfo;
      }
    );
  }

  getServiceCategory() {
    let apiInfo = {
      apiKey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      limit: "20",
      offset: "0",
    };
    this.LandingpagewidgetsAPI.serviceCategory(apiInfo).subscribe(
      (response) => {
        this.serviceCategory = response?.data;
      }
    );
  }

  getProductMakeList() {
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    this.LandingpagewidgetsAPI.getProductMakeListsAPI(apiFormData).subscribe(
      (response) => {
        if (response.status == "Success") {
          let resultData = response.modelData;
          this.makeList = resultData;
        }
      }
    );
  }

  getMakeModelsList(makeName) {
    let apiInfo = {
      apiKey: Constant.ApiKey,
      domainId: this.domainId,
      countryId: this.countryId,
      userId: this.userId,
      displayOrder: 0,
      type: 1,
      makeName: makeName,
      offset: 0,
      limit: 20,
    };
    this.LandingpagewidgetsAPI.getMakeModelsList(apiInfo).subscribe(
      (response) => {
        this.Models = response?.modelData;
      }
    );
  }

  serviceDetails(id) {
    let apiInfo = {
      apiKey: Constant.ApiKey,
      countryId: this.countryId,
      domainId: this.domainId,
      userId: this.userId,
      action: "view",
      serviceId: id,
    };
    this.LandingpagewidgetsAPI.manageServiceAPI(apiInfo).subscribe(
      (response) => {
        let serviceDetails = response?.data;
        this.serviceData = serviceDetails;
      }
    );
  }

  vinChanged() {
    let vin_data = this.serviceForm.get("vin");
    if (vin_data.valid) {
      this.vinIsValid = true;
      let ancFormData = new FormData();
      ancFormData.set("apiKey", Constant.ApiKey);
      ancFormData.set("countryId", this.countryId);
      ancFormData.set("domainId", this.domainId);
      ancFormData.set("userId", this.userId);
      ancFormData.set("vin", vin_data.value);
      this.LandingpagewidgetsAPI.vehicleInfoByVIN(ancFormData).subscribe(
        (response) => {
          this.vinValid = true;
          this.vinData = {
            make: response?.vinDetails[0]?.make,
            model: response?.vinDetails[0]?.model,
            year: response?.vinDetails[0]?.year,
          };
        }
      );
    } else {
      this.vinIsValid = false;
      this.makeList = [];
    }
  }

  setVINValues() {
    this.getMakeModelsList(this.vinData.make);
    this.serviceForm.patchValue({
      make: this.vinData?.make,
      model: this.vinData?.model,
      year: this.vinData?.year,
    });
  }

  shopChanged(event) {
    let selectedShop = this.Shops.filter(
      (element) => element.id == event.value
    );
    let address =
      selectedShop[0].addressLine1 +
      ", " +
      selectedShop[0].addressLine2 +
      "(" +
      selectedShop[0].zip +
      "), " +
      selectedShop[0].city +
      ", " +
      selectedShop[0].state;
    this.serviceForm.patchValue({
      mapValue: address,
    });
  }

  saveService(state) {
    for (const i in this.serviceForm.controls) {
      this.serviceForm.controls[i].markAsDirty();
      this.serviceForm.controls[i].updateValueAndValidity();
    }
    if (this.serviceForm.valid) {
      const formObj = this.serviceForm.value;
      let apiInfo = {
        apikey: Constant.ApiKey,
        countryId: this.countryId,
        domainId: this.domainId,
        userId: this.userId,
        action: state == 'add' ? "new" : "edit" /* edit in case of update */,
        shopId: formObj.shopId,
        serviceDate: moment(formObj.serviceDate).format("YYYY-MM-DD"),
        serviceTime: formObj.serviceTime + " " + formObj.selectedMeridiem,
        repairOrder: formObj.repairOrder,
        technicianId: formObj.technicianId,
        statusId: formObj.statusId,
        vin: formObj.vin,
        make: formObj.make,
        model: formObj.model,
        year: formObj.year == null ? null : String(formObj.year),
        serviceCatg:
          formObj.serviceCatg == null
            ? []
            : JSON.stringify(formObj.serviceCatg),
        serviceNotes: formObj.serviceNotes,
        serviceId : state == 'add' ? null : this.serviceId
      };
      this.LandingpagewidgetsAPI.manageServiceAPI(apiInfo).subscribe(
        (response) => {
          console.log('SERVICE response: ', response);
          this.displayModal = false;
          this.getDispatchList(new Date());
          this.modalState = 'add';
          this.serviceId = null;
        }
      );
    }
  }

  getYearsList() {
    let year = parseInt(this.currYear);
    for (let y = year; y >= this.initYear; y--) {
      this.Years.push({
        id: y,
        name: y.toString(),
      });
    }
  }

  editServiceData(item,state,date) {
    this.serviceId = item.serviceId;
    this.modalState = state;
    this.vinChanged();
    this.getMakeModelsList(item.make);
    let selectedShop = item.shopData;
    let address =
      selectedShop.addressLine1 +
      ", " +
      selectedShop.addressLine2 +
      "(" +
      selectedShop.zip +
      "), " +
      selectedShop.city +
      ", " +
      selectedShop.state;
    let service_catt: any = [];
    item.serviceCatg.forEach((element) => {
      service_catt.push(element.id);
    });
    this.displayModal = true;
    this.serviceForm.patchValue({
      shopId: item.shopData.id,
      mapValue: address,
      serviceDate: date,
      serviceTime: item.serviceTime,
      repairOrder: item.repairOrder,
      technicianId: String(item.techInfo.techId),
      vin: item.vin,
      make: item.make,
      model: item.model,
      year: item.year,
      serviceNotes: item.notes,
      statusId: item.statusData.id,
      serviceCatg: service_catt,
      any_time: item.any_time,
      selectedMeridiem: moment(item.serviceTime).format("A"),
    });
    // for update serviceId
  }
}
