import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-system-info-view',
  templateUrl: './system-info-view.component.html',
  styleUrls: ['./system-info-view.component.scss']
})
export class SystemInfoViewComponent implements OnInit {

  @Input() systemInfo: any;

  public headerFlag: boolean = false;
  public workstreams: any;
  public userInfo: any;

  constructor() { }

  ngOnInit(): void {
    this.headerFlag = this.systemInfo.header;

    this.workstreams = this.systemInfo.workstreams;
    
    if(this.workstreams!=''){
      let workstreamsItems: any = [];
      for(let e of this.workstreams) {
        workstreamsItems.push(e.name);
      }
      workstreamsItems = Array.from(new Set(workstreamsItems));
      this.workstreams = [];
      this.workstreams.push({
        name: workstreamsItems
      });
    }
    
    this.userInfo = this.systemInfo.userInfo;
  }

}
