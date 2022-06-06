import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  pageInfo,
  Constant,
  PlatFormType,
  PlatFormNames,
} from "src/app/common/constant/constant";
import "hammerjs";
import { Title } from "@angular/platform-browser";
import { NotificationService } from './services/notification/notification.service';
import { Router } from '@angular/router';
import { CallsService } from './controller/calls.service';
import { ThemeService } from './services/theme.service';
import { LocalStorageItem } from 'src/app/common/constant/constant';

declare var $: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  isMicOn: boolean = false;
  testing = [1];
  platformId: string;
  PlatFormName: string;

  @ViewChild("publisherDiv") publisherDiv: ElementRef;

  constructor(private titleService: Title, public call: CallsService, public notification: NotificationService, private router: Router, private themeService: ThemeService) {
    this.titleService.setTitle(PlatFormNames.Collabtic);
    //this.titleService.setTitle(PlatFormNames.MahleForum);
    //this.titleService.setTitle(PlatFormNames.Tvs);
    //this.titleService.setTitle(PlatFormNames.CbaForum);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // do whatever you want
        // console.log('Hidden');
      }
      else {
        // do whatever you want
        if (this.notification.visibility) {
          this.notification.visibility.next(true);
          setTimeout(() => {
            this.notification.visibility.next(false);
          }, 5000);
        }
      }
    });

    // Collabtic setup
    this.platformId = PlatFormType.Collabtic;
    this.PlatFormName = PlatFormNames.Collabtic;

    // Mahle setup
    //this.platformId = PlatFormType.MahleForum;
    //this.PlatFormName = PlatFormNames.MahleForum;
    //this.PlatFormName = PlatFormNames.Tvs;

    // CBA setup
    // this.platformId = PlatFormType.CbaForum;
    // this.PlatFormName = PlatFormNames.CbaForum;

    const platform: any = this.platformId;
    this.themeService.attachTheme(platform);
  }

  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  ngOnInit(): void {



    localStorage.setItem("platformId", this.platformId);
    localStorage.setItem("platformName", this.PlatFormName);

    this.changeIcon();
  }

  changeIcon() {
    let platformId = localStorage.getItem("platformId");
    let favUrl = "";
    if (platformId == PlatFormType.Collabtic) {
      favUrl = "favicon.ico";
    } else if (platformId == PlatFormType.MahleForum) {
      favUrl = "assets/favicon.ico";
    } else if (platformId == PlatFormType.CbaForum) {
      favUrl = "assets/favicon.ico";
    } else if (platformId == PlatFormType.KiaForum) {
      favUrl = "assets/favicon.ico";
    } else {
      favUrl = "favicon.ico";
    }

    this.favIcon.href = favUrl;
  }
}

window.onbeforeunload = function () {
  return "Do you really want to close?";
};
