import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, sequence, animate } from '@angular/animations';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AccordionOptions } from 'src/app/models/customAccordion.model';
import { IsOpenNewTab } from 'src/app/common/constant/constant';
declare var $: any;

@Component({
  selector: 'app-support-request-widget',
  templateUrl: './support-request-widget.component.html',
  styleUrls: ['./support-request-widget.component.scss'],
  animations: [
    trigger('anim', [
      transition('* => void', [
        style({ height: '*', opacity: '1', transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }),
        sequence([
          animate(".25s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate(".1s ease", style({ height: '0', opacity: 0, transform: 'translateX(20px)', 'box-shadow': 'none' }))
        ])
      ]),
      transition('void => active', [
        style({ height: '0', opacity: '0', transform: 'translateX(20px)', 'box-shadow': 'none' }),
        sequence([
          animate(".1s ease", style({ height: '*', opacity: '.2', transform: 'translateX(20px)', 'box-shadow': 'none' })),
          animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)', 'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)' }))
        ])
      ])
    ])
  ]
})
export class SupportRequestWidgetComponent implements OnInit {

  public accordionConfig: AccordionOptions = null;
  public options;


  constructor() { }

  ngOnInit(): void {
    var landingpage_attr7 = localStorage.getItem('landingpage_attr7');
    this.options = JSON.parse(landingpage_attr7);
    this.accordionConfig = {
      wrapperClass: this.options.shortName,
      title: this.options.placeholder,
      imageClass: this.options.imageClass,
      isFirstSelected: this.options.isExpand,
      imageUrl: this.options.imageUrl
    }
  }

  navigateTosupportPage() {
    window.open("threads/manage", IsOpenNewTab.openNewTab);
  }
}
