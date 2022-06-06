import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../.../../../services/dashboard/dashboard.service';
import { CommonService } from '../../../services/common/common.service';
import { ExcelService } from '../../../services/dashboard/excel/excel.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { LeaderboardService } from 'src/app/services/leaderboard.service';

@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent implements OnInit {
  @Input() apiData;
  @Input() exportInfo;
  @Input() exportData;
  @Input() access;
  @Input() title;
  @Input() isCollabtic;
  @Input() exportAllFlag;
  @Output() updateonExportisDone = new EventEmitter<any>();

  public totalLimit = 0;
  public itemLimit = 20;
  public itemOffset = 0;
  public sNo = 0;
  public uploadFlag;
  public itemLength;
  public progressbarCount = "1";
  public progressbarCountWidth = "";
  public stopexportapi: boolean = true;
  public threadLists = [];
  public dealerData = [];
  public leaderInfo: any = [];
  public dtcInfo: any = [];
  public exceldownloadtrue: boolean = false;
  public downloadtextflag = 'Exporting data to Excel..';
  constructor(
    private router: Router,
    private leaderBoardApi: LeaderboardService,
    private dashboardApi: DashboardService,
    private excelService: ExcelService,
    private commonService: CommonService,
    private modalService: NgbModal,

  ) { }

  ngOnInit() {

    //alert(this.apiData.limit);
    //alert(this.totalLimit);
    //this.totalLimit=40;
    this.sNo = 0;
    switch (this.access) {
      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealerActivity();
        break;
      case 'threads':
        if (this.exportAllFlag) {
          this.getexceldata();
        }
        else {
          this.getexceldataThread();
        }
        break;
      case 'leaderboard':
        this.getexceldataLeaderBoard()
        break;
      case 'dtc':
        this.getDTCExcelData();
        break;        
      case 'dtc-template':
        this.exceldownloadtrue = true;
        this.exportDTCReport(this.access, this.exportInfo, this.exportData);
        break;  
    }
  }

  getexceldata() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 1;
    this.apiData['exportLazy'] = 1;

    //alert(JSON.stringify(this.apiData));
    // alert(this.apiData);
    this.uploadFlag = this.dashboardApi.apiChartDetailAll(this.apiData).subscribe((response) => {
      //alert(11);
      let responseData = response.data;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportThreadData = responseData.chartdetails;
      let threadType = this.exportInfo[1];
      let threadInfo = ['exportThread'];
      let threadList = this.commonService.getModifiedThreadData(threadInfo, exportThreadData, threadType);
      this.exportData['threadList'] = threadList;

      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, this.exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  getexceldataLeaderBoard1() {
    this.apiData['limit'] = this.leaderBoardApi.offset;
    this.apiData['offset'] = 0;
    this.apiData['exportAll'] = 0;
    this.leaderBoardApi.getLeaderBoardChartData(this.apiData).subscribe(response => {
      this.itemLength += response.total;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / response.total) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (response.total != 0) {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;
          }
          this.generateExcel(this.access, this.exportInfo, response.items);
        }
      }
    })
  }

  getexceldataLeaderBoard() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;
    this.leaderBoardApi.getLeaderBoardChartData(this.apiData).subscribe((response) => {
      let responseData = response;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportData = responseData.items;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;
          }
          console.log(exportData);
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    });
  }

  getexceldataThread() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;

    this.uploadFlag = this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportThreadData = responseData.chartdetails;

      let threadType = this.exportInfo[1];
      let threadInfo = ['exportThread'];
      let threadList = this.commonService.getModifiedThreadData(threadInfo, exportThreadData, threadType);
      this.exportData['threadList'] = threadList;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, this.exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    }, err => {
      console.log(err)
    });
  }

  exportDealerActivity() {
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.apiData['exportAll'] = 0;
    this.dashboardApi.apiChartDetail(this.apiData).subscribe((response) => {
      let responseData = response.data;
      let total_count = responseData.total;
      this.totalLimit = total_count;
      let exportData = responseData.chartdetails;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.title, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }

      }
    });
  }

  generateExcel(access, title, exportData) {
    switch (access) {
      case 'dealerUsage':
      case 'serviceProbing':
        this.exportDealers(title, exportData);
        break;
      case 'threads':
        this.exportThreadReports(title, exportData);
        break;
      case 'leaderboard':
        this.exportLeaderBoardReport(title, exportData);
        break;
      case 'dtc':
        this.exportDTCReport(access, title, exportData);
        break;  
    }
  }

  exportLeaderBoardReport(title, exportData) {
    let apiData = exportData;
    let headers = ['Position', 'Username', 'Email Address', 'Thread Count', 'Reply Count', 'Badge Point'];
    apiData.forEach(data => {
      this.sNo = this.sNo + 1;
      let leaderInfo = [this.sNo, data.username, data.email, data.threadCount, data.replyCount, data.socialPoint];
      this.leaderInfo.push(leaderInfo)
    });

    let workbook = new Workbook();
    let startDateExcel = '';
    if (this.apiData.hasOwnProperty('startDate') && this.apiData.hasOwnProperty('endDate')) {
      startDateExcel = ' for ' + moment(this.apiData.startDate).format('MMM DD, YYYY') + ' - ' +
        moment(this.apiData.endDate).format('MMM DD, YYYY');
    }
    let worksheet = workbook.addWorksheet(title[0]);

    let titleRow = worksheet.addRow([title[0] + ' ' + startDateExcel]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    worksheet.addRow([]);

    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.leaderInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(6);
      let color = 'FF99FF';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';

      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Leaderboard.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getexceldataLeaderBoard();
    }
  }

  exportDealers(title, exportData) {
    let apiData = exportData;
    let header = ['Dealer Name', 'ID', 'Zone', 'Area', 'Territory'];
    let monthInfo = apiData[0].interdays;
    for (var m of monthInfo) {
      header.push(m.day)
    }
    header.push('Total Time');
    // let dealerData = [];
    for (var info in apiData) {
      let days = [];
      let dayInfo = apiData[info].interdays;
      let utype = parseInt(apiData[info].userType);
      let name = (utype == 2) ? apiData[info].dealerName : apiData[info].userName;
      let id = (utype == 2) ? apiData[info].dealerCode : apiData[info].userId;
      let dealerInfo = [name, id, apiData[info].zone, apiData[info].userarea, apiData[info].territory];
      for (var d of dayInfo) {
        dealerInfo.push(d.totaltime);
      }
      dealerInfo.push(apiData[info].totaltime);
      this.dealerData.push(dealerInfo);
    }


    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    worksheet.addRow([]);
    //let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

    //Blank Row
    worksheet.addRow([]);

    // Add Header Row
    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        //fgColor: { argb: 'FFFFFF00' },
        fgColor: { argb: 'e8e3e3' },

        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    this.dealerData.forEach(d => {
      let row = worksheet.addRow(d);
      let qty = row.getCell(5);
      let color = 'FF99FF';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';

      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Dealer_Usage.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    }
    else {
      this.exportDealerActivity();
    }

    //Generate Excel File with given name


  }

  exportThreadReports(title, exportData) {
    let openThreadsData = exportData.openThreads;
    let closedThreadsData = exportData.closedThreads;
    let threadListData = exportData.threadList;

    let openHeader = ['Thread Status', 'Total Count', 'Percentage'];
    let openData = [];
    for (var openThread in openThreadsData) {
      let status = openThreadsData[openThread].title;
      let count = openThreadsData[openThread].countValue;
      let percentVal = openThreadsData[openThread].percentageValue + '%';
      let openThreadInfo = [status, count, percentVal];
      openData.push(openThreadInfo);
    }

    let closedHeader = ['Thread Status', 'Total Count', 'Percentage'];
    let closedData = [];
    for (var closedThread in closedThreadsData) {
      let status = closedThreadsData[closedThread].title;
      let count = closedThreadsData[closedThread].countValue;
      let percentVal = closedThreadsData[closedThread].percentageValue + '%';
      let closedThreadInfo = [status, count, percentVal];
      closedData.push(closedThreadInfo);
    }

    let threadTitle = title[1].charAt(0).toUpperCase() + title[1].slice(1);
    let threadListHeader;
    let startDateExcel = '';
    if (this.isCollabtic) {
      threadListHeader = ['Thread owner', 'Manager name', 'Thread Creation date/time', 'Model > Year', 'Title', 'Error Code', 'Thread Status', 'Thread ID'];
      if (this.apiData.hasOwnProperty('filterOptions')) {
        if (this.apiData.filterOptions.hasOwnProperty('startDate') && this.apiData.filterOptions.hasOwnProperty('endDate')) {
          startDateExcel = ' for ' + moment(this.apiData.filterOptions.startDate).format('YYYY-MM-DD') + ' - ' +
            moment(this.apiData.filterOptions.endDate).format('YYYY-MM-DD');
        } else {
          startDateExcel = ' for ' + moment().subtract(30, 'days').format('MMM D, YYYY') + ' - ' +
            moment().format('MMM D, YYYY');
        }
      }
    } else {
      if (threadTitle == 'Open') {
        threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Frame#', 'Odo Meter', 'Title', 'Error Code', 'Description', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', '1st Reply Time', 'Thread ID', 'Time to Share Proposed Fix (Hrs)', 'Open/Closed', 'Workstreams', 'Feedback Status'];
      } else {
        threadListHeader = ['Dealer Name', 'ID', 'User Type', 'Zone', 'Area', 'TTY', 'Product Owner', 'TM Name', 'Thread Creation Date/Time', 'Model > Year', 'Frame#', 'Odo Meter', 'Title', 'Error Code', 'Description', 'Status', 'Esc Level', 'Proposed Fix Date', 'Proposed Fix Content', '1st Reply Time', 'Thread ID', 'Thread Closed Date', 'Time to Time to Share Proposed Fix (Hrs)', 'Time to Close (Hrs)', 'Open/Closed', 'Workstreams', 'Feedback Status'];
      }
    }

    for (var threadList in threadListData) {
      let dealerName = threadListData[threadList].dealerName;
      let dealerCode = threadListData[threadList].dealerCode;
      let userTypeName = threadListData[threadList].userTypeName;
      let zone = threadListData[threadList].zone;
      let userarea = threadListData[threadList].userarea;
      let tty = threadListData[threadList].territory;
      let prodOwner = threadListData[threadList].assigneeFirstLastname;
      let tmName = threadListData[threadList].territory_manager;
      let threadCreation = threadListData[threadList].created_on;
      const year = ' > ' + threadListData[threadList].year;
      let model = (threadListData[threadList].year) ? threadListData[threadList].model + ' > ' + threadListData[threadList].year : threadListData[threadList].model;
      let frame = threadListData[threadList].frameNo;
      let odoMeter = threadListData[threadList].odoMeter;
      let title = threadListData[threadList].title;
      let errorCode = threadListData[threadList].error_code;
      let desc = threadListData[threadList].description;
      let threadStatus = threadListData[threadList].thread_status;
      let escLevel = threadListData[threadList].escalate_status_land;
      let proposedFixDate = threadListData[threadList].proposedFix_createdOn;
      let firstTimeReply = threadListData[threadList].firstReplyFromEmp;
      //added by karuna for proposed fix content
      let proposedFix_content = threadListData[threadList].proposedFix_contentxls;

      let threadId = '#' + threadListData[threadList].thread_id;
      let timeToRespond = (threadListData[threadList].exportTimeToRespond == '-' || threadListData[threadList].exportTimeToRespond == '') ? 0 : threadListData[threadList].exportTimeToRespond;
      let timeclose_status = threadListData[threadList].close_status;
      let workstreamsListthread = threadListData[threadList].workstreamsList;
      let feedbackStatus = threadListData[threadList].feedbackStatus;

      let timeToClose: any = 0;
      let openclosestatus = '';
      if (timeclose_status == 1) {
        openclosestatus = 'Closed';
      } else {
        openclosestatus = 'Open';
      }

      let threadListInfo;
      if (this.isCollabtic) {
        threadListInfo = [
          dealerName,
          prodOwner,
          threadCreation,
          model,
          title,
          errorCode,
          threadStatus,
          threadId,
        ];
      } else {
        if (threadTitle == 'Open') {
          threadListInfo = [dealerName, dealerCode, userTypeName, zone, userarea, tty, prodOwner, tmName, threadCreation, model, frame, odoMeter, title, errorCode, desc, threadStatus, escLevel, proposedFixDate, proposedFix_content, firstTimeReply, threadId, timeToRespond, openclosestatus, workstreamsListthread, feedbackStatus];
        } else {
          let threadCloseDate = threadListData[threadList].close_date;
          timeToClose = (threadListData[threadList].exportTimeToClose == '-' || threadListData[threadList].exportTimeToClose == '') ? 0 : threadListData[threadList].exportTimeToClose;
          threadListInfo = [dealerName, dealerCode, userTypeName, zone, userarea, tty, prodOwner, tmName, threadCreation, model, frame, odoMeter, title, errorCode, desc, threadStatus, escLevel, proposedFixDate, proposedFix_content, firstTimeReply, threadId, threadCloseDate, timeToRespond, timeToClose, openclosestatus, workstreamsListthread, feedbackStatus];
        }
      }
      this.threadLists.push(threadListInfo);
    }

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title[0]);

    //Add Row and formatting
    let titleRow = worksheet.addRow([title[0]]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, bold: true }
    worksheet.addRow([]);
    //let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);

    // Open Threads Data

    //Blank Row
    worksheet.addRow([]);
    // Add Header Row
    let openTitle = "Open Threads" + startDateExcel;
    let openTitleRow = worksheet.addRow([openTitle]);
    openTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    let openHeaderRow = worksheet.addRow(openHeader);

    // Cell Style : Fill and Border
    openHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    openData.forEach(ot => {
      let row = worksheet.addRow(ot);
    });

    // Closed Threads Data

    //Blank Row
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Add Header Row
    let closedTitle = "Closed Threads" + startDateExcel;
    let closedTitleRow = worksheet.addRow([closedTitle]);
    closedTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    let closedHeaderRow = worksheet.addRow(closedHeader);

    // Cell Style : Fill and Border
    closedHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    closedData.forEach(ct => {
      let row = worksheet.addRow(ct);
    });


    // Thread Lists Data

    //Blank Row
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Add Header Row
    let threadListTitle = threadTitle + " Thread Lists";
    let threadListTitleRow = worksheet.addRow([threadListTitle]);
    threadListTitleRow.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    let threadListHeaderRow = worksheet.addRow(threadListHeader);

    // Cell Style : Fill and Border
    threadListHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    // Add Data and Conditional Formatting
    let t2 = 0;
    this.threadLists.forEach(tl => {
      t2 = t2 + 1;
      let row = worksheet.addRow(tl);
      worksheet.getColumn(t2).width = 30;
      if (threadTitle == 'Open') {
        let ts = row.getCell(18);
        ts.alignment = {
          horizontal: 'left'
        }
      } else {
        let ts = row.getCell(19);
        ts.alignment = {
          horizontal: 'left'
        }

        let tc = row.getCell(20);
        tc.alignment = {
          horizontal: 'left'
        }
      }
    });

    worksheet.addRow([]);
    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Processing Excel';

      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Thread_Reports.xlsx');
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.threadLists = [];
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Adding data to Excel sheet';
        this.updateonExportisDone.emit(1);
      }, 3000);
    }
    else {
      if (this.exportAllFlag) {
        this.getexceldata();
      }
      else {
        this.getexceldataThread();
      }
    }
  }

  // Export DTC Data
  getDTCExcelData() {
    console.log(this.apiData)
    this.apiData['limit'] = this.itemLimit;
    this.apiData['offset'] = this.itemOffset;
    this.uploadFlag = this.commonService.getErrorCodes(this.apiData).subscribe((response) => {
      let exportData = response.errorCodes;
      let total_count = response.total;
      this.totalLimit = total_count;
      this.itemLength += total_count;
      this.itemOffset += this.itemLimit;
      console.log(this.itemOffset/total_count)
      this.progressbarCount = ((this.itemOffset / total_count) * 100).toFixed(0);
      this.progressbarCountWidth = this.progressbarCount + '%';
      if (total_count == 0) {
      }
      else {
        if (this.stopexportapi) {
          if (this.itemOffset >= this.totalLimit) {
            this.exceldownloadtrue = true;;
          }
          this.generateExcel(this.access, this.exportInfo, exportData);
        }
        if (this.itemOffset >= this.totalLimit) {
          this.stopexportapi = false;
        }
      }
    });
  }

  exportDTCReport(access, title, exportData) {
    let apiData = exportData;
    let headers = ['S.No', 'Code', 'Description'];
    apiData.forEach(data => {
      this.sNo = this.sNo + 1;
      let dtcInfo = [this.sNo, data.code, data.desc];
      this.dtcInfo.push(dtcInfo)
    });

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    let headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'e8e3e3' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } }
    });

    this.dtcInfo.forEach(l => {
      let row = worksheet.addRow(l);
      let qty = row.getCell(3);
      let color = 'FFFFFF';
      if (+qty.value < 500) {
        color = 'FF9999'
      }
      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    });

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.addRow([]);

    if (this.exceldownloadtrue) {
      this.progressbarCount = '100';
      this.progressbarCountWidth = this.progressbarCount + '%';
      this.downloadtextflag = 'Export complete.';
      let date = '';
      if (this.apiData.hasOwnProperty('uploadedOn')) {
        let uploadedDate = this.apiData.uploadedOn;
        date = (uploadedDate == '-') ? date : moment(uploadedDate).format('MMM DD, YYYY');
      }
      let fname = (access == 'dtc') ? 'DTC' : 'DTC Template';
      let fileName = (access == 'dtc') ? `${title} ${fname} ${date}.xlsx` : `${fname}.xlsx`;
      setTimeout(() => {
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        });
        this.exceldownloadtrue = false;
        this.stopexportapi = true;
        this.itemOffset = 0;
        this.progressbarCount = '0';
        this.progressbarCountWidth = this.progressbarCount + '%';
        this.downloadtextflag = 'Exporting data to Excel..';
        this.updateonExportisDone.emit(1);
      }, 3000);
    } else {
      this.getDTCExcelData();
    }
  }

  myStyle(): object {
    return { "width": this.progressbarCountWidth };
  }
  cancelUpload() {
    this.uploadFlag.unsubscribe();
    this.downloadtextflag = 'Canceling Export';
    this.exceldownloadtrue = false;
    this.stopexportapi = true;
    this.itemOffset = 0;
    this.threadLists = [];
    this.progressbarCount = '0';
    setTimeout(() => {
      this.updateonExportisDone.emit(1);
    }, 3000);
  }
}
