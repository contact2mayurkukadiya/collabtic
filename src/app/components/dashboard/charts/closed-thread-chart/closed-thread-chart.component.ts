import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-closed-thread-chart',
  templateUrl: './closed-thread-chart.component.html',
  styleUrls: ['./closed-thread-chart.component.scss']
})
export class ClosedThreadChartComponent implements OnInit {

  @Input() chartData;
  @Input() chartOptions;
  @Output() threadType: EventEmitter<any> = new EventEmitter();

  public chart: any;
  public gcData: any;

  constructor(private ngZone:NgZone) { }

  ngOnInit() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(this.drawChart());
  }

  drawChart() {
    this.gcData = new google.visualization.DataTable();
    
    this.gcData.addColumn('string', 'Thread Status');
    this.gcData.addColumn('number', 'Count');
    this.gcData.addColumn({type: 'string', role: 'tooltip'});

    for(var data of this.chartData) {
      let perValue = data.percentageValue;
      let CntValue = data.countValue;
      this.gcData.addRow([data.title, {v: perValue, f: perValue+'%'}, data.title+'\n'+CntValue]);
      this.chartOptions['colors'].push(data.colorCode);
    }
    
    this.chart = new google.visualization.PieChart(document.getElementById('closedThread'));
    google.visualization.events.addListener(
      this.chart, 'select', () => {
        this.ngZone.run(() => {
          this.selectHandler();
        });
      }
    );
    this.chart.draw(this.gcData, this.chartOptions);
  }

  public selectHandler() {
    var selectedItem = this.chart.getSelection()[0];
      if (selectedItem) {
        var tapping = this.gcData.getValue(selectedItem.row, 0);
        let threadInfo = [];
        let threadStatus;
        console.log(tapping)
        switch(tapping) {
          case 'No reply':
            threadStatus = 'noReply';
            break;
          case 'No proposed Fix':
            threadStatus = 'noProposedFix';
            break;
          case 'Proposed Fix':
            threadStatus = 'propsedFix';
            break;
          case 'Confirmed Fix (green & yellow or orange)':
            threadStatus = 'confirmedFix';
            break;
          case 'Shared Fix':
            threadStatus = 'sharedFix';
            break;
          case 'No Fix':
            threadStatus = 'noFix';
            break;
        }
        threadInfo.push('closed',threadStatus,'chart');
        this.threadType.emit(threadInfo);        
      }
  }

}
