import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-new-edit-header',
  templateUrl: './new-edit-header.component.html',
  styleUrls: ['./new-edit-header.component.scss']
})
export class NewEditHeaderComponent implements OnInit {
  @Input() pageData;
  public displayLogoutPopup: boolean = false;
  public platformName:string = localStorage.getItem("platformName");
  public teamSystem:string = localStorage.getItem("teamSystem");
  public dialogData: any = {
    access: '',
    navUrl: '',
    platformName: this.platformName,
    teamSystem: this.teamSystem,
    visible: true
  };

  constructor() { }

  ngOnInit(): void {
    console.log(this.pageData);
  }

  @HostListener('document:visibilitychange', ['$event'])

  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    if (!document.hidden) {
      let loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut == "1") {
        this.displayLogoutPopup = true;
        this.dialogData.access = 'logout';
        localStorage.removeItem("notificationToggle");
      }
    }
  }

  closewindowPopup(data) {
    if(data.closeFlag) {
      window.close();
    }
    this.displayLogoutPopup = false;
    location.reload();
  }
}
