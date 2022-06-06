import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  pageInfo,
  Constant,
  IsOpenNewTab,
  ManageTitle,
} from "src/app/common/constant/constant";
import { LandingpageService } from "../../../../services/landingpage/landingpage.service";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { DispatchPageComponent } from "src/app/components/common/dispatch-page/dispatch-page.component";
import * as moment from "moment";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
  @ViewChild("ttthreads") tooltip: NgbTooltip;
  public msTeamAccess: boolean = false;
  public headerFlag: boolean = false;
  public headerData: Object;
  pageAccess: string = "dispatch";
  public headTitle: string = "Dispatch Board";
  public thelpContentIconName = "";
  public thelpContentTitle = "";
  public thelpContentContent = "";
  public thelpContentId = "";
  public countryId;
  public domainId;
  public user: any;
  public userId;
  public menuListloaded;
  public thelpContentStatus = "";
  public thelpContentFlagStatus: boolean = false;
  public disableNextBtn: boolean = false;
  public disablePreviousBtn: boolean = false;
  @Output() dispatchModal: EventEmitter<any> = new EventEmitter();
  Category: any = [{ label: "Time booked", value: 0 }];
  selectedCategory: any = this.Category[0].value;
  Days: any = [{ label: "5 Days", value: 5 }];
  selectedDay: any = this.Days[0].value;
  displayModal: boolean = false;
  dispatchPageRef: DispatchPageComponent;
  curr_date: any = moment();
  displayToday: boolean = false;

  constructor(private landingpageServiceApi: LandingpageService) {}

  ngOnInit(): void {
    this.headerData = {
      access: this.pageAccess,
      profile: true,
      welcomeProfile: true,
      search: true,
    };
    this.checkSameDate();
  }

  checkSameDate() {
    let today = moment().format("YYYY-MM-DD");
    this.curr_date = moment(this.curr_date).format("YYYY-MM-DD");
    this.displayToday = moment(today).isSame(this.curr_date)
  }

  changeDate(action) {
    if (action == "previous") {
      this.curr_date = moment(this.curr_date)
        .subtract(5, "d")
        .format("YYYY-MM-DD");
    } else if (action == "next") {
      this.curr_date = moment(this.curr_date).add(5, "d").format("YYYY-MM-DD");
    } else {
      this.curr_date = moment(this.curr_date).format("YYYY-MM-DD");
    }
    this.dispatchPageRef.getDispatchList(this.curr_date);
    this.checkSameDate();
  }

  todayClicked() {
    this.curr_date = new Date();
    this.changeDate("");
  }

  applySearch(action, val) {}

  helpContent(id) {
    id = id > 0 ? id : "";
    const apiFormData = new FormData();
    apiFormData.append("apiKey", Constant.ApiKey);
    apiFormData.append("domainId", this.domainId);
    apiFormData.append("countryId", this.countryId);
    apiFormData.append("userId", this.userId);
    apiFormData.append("tooltipId", id);

    this.landingpageServiceApi
      .updateTooltipconfigWeb(apiFormData)
      .subscribe((response) => {
        if (response.status == "Success") {
          if (id == "") {
            let contentData = response.tooltips;
            for (var cd in contentData) {
              let welcomePopupDisplay = localStorage.getItem(
                "welcomePopupDisplay"
              );
              if (welcomePopupDisplay == "1") {
                if (
                  contentData[cd].id == "7" &&
                  contentData[cd].viewStatus == "0"
                ) {
                  this.thelpContentStatus = contentData[cd].viewStatus;
                  this.thelpContentFlagStatus = true;
                  this.thelpContentId = contentData[cd].id;
                  this.thelpContentTitle = contentData[cd].title;
                  this.thelpContentContent = contentData[cd].content;
                  this.thelpContentIconName = contentData[cd].itemClass;
                }
              }
            }
            if (this.thelpContentFlagStatus) {
              this.tooltip.open();
            }
          } else {
            this.tooltip.close();
          }
        }
      });
  }

  newService() {
    this.displayModal = true;
    this.dispatchPageRef.displayModel(new Date(),'add');
  }

  selectedDayChanged(event) {
    this.selectedDay = event;
  }
}
