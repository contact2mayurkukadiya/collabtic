import { Component, OnInit, OnDestroy } from "@angular/core";
import { ScrollTopService } from "src/app/services/scroll-top.service";

@Component({
  selector: "app-gts",
  templateUrl: "./gts.component.html",
  styleUrls: ["./gts.component.scss"],
})
export class GtsComponent implements OnInit, OnDestroy {
  public bodyClass: string = "gts";
  public bodyElem;
  public footerElem;

  constructor(private scrollTopService: ScrollTopService) {}

  ngOnInit() {
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.scrollTopService.setScrollTop();
  }

  ngOnDestroy() {
    this.bodyElem.classList.remove(this.bodyClass);
    this.footerElem.classList.remove("sidebar");
    this.footerElem.classList.remove("sidebar-active");
  }
}
