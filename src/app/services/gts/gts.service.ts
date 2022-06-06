import { Constant, GTSPage } from 'src/app/common/constant/constant';
import { HttpClient, HttpParams } from "@angular/common/http";

import { ApiService } from "../api/api.service";
import { AuthenticationService } from "../authentication/authentication.service";
import { GTSModel } from "src/app/components/_models/gts";
import { Injectable, NgZone } from "@angular/core";
import { MediaManagerService } from '../media-manager/media-manager.service';
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GtsService {

  public apiData: GTSModel;

  public showFirstScreen = false;
  public user: any;
  public domainId;
  public userId;
  public apiKey: string = Constant.ApiKey;

  public procedureId: any;
  public isLoading: any = false
  public procedure: any
  previousNextNode: string = '0';
  public isNextProcess: boolean = false;
  public isPreviousProcess: boolean = false;
  userData: any;
  optionButtonData: any = {
    isButtonEnabled: false,
    processId: 0
  };
  public pageType: any = GTSPage.start;

  processId: any = 0;
  isProcedureAvailable: boolean = false;

  serialNumber = "";
  fileDatas = {
    items: [],
    attachments: []
  };
  fileDatasPrev: any = [];
  // saving the flow data
  saveData = {};
  isMediaUpload: boolean = false;

  postApiData: any;

  constructor(private http: HttpClient, private apiUrl: ApiService, private authenticationService: AuthenticationService,
    public mediaApi: MediaManagerService, public zone: NgZone) {
    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
  }

  getGTSLists(probingData) {
    return this.http.post<any>(this.apiUrl.apiGetGTSLists(), probingData);
  }

  // Get GTS BaseInfo
  getGtsBaseInfo(gtsData) {
    return this.http.post<any>(this.apiUrl.apiGetGtsBaseInfo(), gtsData);
  }

  // Get Product Category & Types
  getProdCatg(gtsData) {
    return this.http.post<any>(this.apiUrl.apiGetProdCatg(), gtsData);
  }

  // Get Module Manufacture
  getModMft(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiGetModMft(), gtsData);
  }

  // Get DTC Info
  getDtcInfo(gtsData) {
    const params = new HttpParams()
      .set("apiKey", gtsData.apiKey)
      .set("domainId", gtsData.domainId)
      .set("countryId", gtsData.countryId)
      .set("limit", gtsData.limit)
      .set("offset", gtsData.offset);
    const body = JSON.stringify(gtsData);

    return this.http.post<any>(this.apiUrl.apiGetDtcInfo(), body, {
      params: params,
    });
  }

  // GTS Procedure Creation and Update
  manageGts(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageGts(), gtsData);
  }
  // Delete DTS Procedure
  deleteGts(gtsData) {
    return this.http.post<any>(this.apiUrl.apiDeleteGts(), gtsData);
  }

  // GET DTC Attributes
  getDtcAttributes(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiGetDtcAttributes(), gtsData);
  }

  // Add or Save Product Category
  manageProblemCatg(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageProblemCatg(), gtsData);
  }
  // Add or Save ECU Type
  manageECUType(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageECUType(), gtsData);
  }

  // Add or Save Manufacturer
  manageMFG(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageMFG(), gtsData);
  }

  // Add or Save System
  manageSystem(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageSystem(), gtsData);
  }
  // Add or Save DTC Code
  manageDTC(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageDTC(), gtsData);
  }

  // Add or Save Tag
  manageTag(gtsData): Observable<any> {
    return this.http.post<any>(this.apiUrl.apiManageTag(), gtsData);
  }

  // Check DTC Code Exists
  checkDTC(dtcData) {
    return this.http.post<any>(this.apiUrl.apiCheckDTC(), dtcData);
  }

  getGtsProcedures() {
    const formData = new FormData();

    formData.append('apiKey', this.apiData.apiKey);
    formData.append('userId', this.apiData.userId);
    formData.append('domainId', this.apiData.domainId);
    formData.append('actionMode', this.apiData.actionMode);
    formData.append('processId', this.apiData.processId);
    formData.append('procedureId', this.apiData.procedureId);
    formData.append('workstreamId', this.apiData.workstreamId);
    formData.append('frameNo', this.apiData.frameNo ?? this.procedure.frameNo);
    formData.append('odometerNo', this.apiData.odometerNo ?? this.procedure.odometerNo);
    formData.append('isFrameCutOffProcedure', this.apiData.isFrameCutOffProcess ?? '0')
    formData.append('gtsId', this.apiData.gtsid ?? '');

    formData.append('previousNextMode', this.previousNextNode);
    if (typeof this.procedure != 'undefined') {
      formData.append('parentNextProcessId', this.apiData.parentNextProcessId);
      formData.append('nextProcessIdFromBack', (this.isNextProcess) ? '' : this.procedure.currentProcessId)
      // formData.append('parentProcessId', this.procedure.parentProcessId ?? '0');
      formData.append('parentProcessId', this.procedure.parentprocess ? Object.keys(JSON.parse(this.procedure.parentprocess)[0])[0] : '0');

    }
    if (this.isNextProcess) {
      formData.append('previousProcessId', this.procedure.currentProcessId);
    }
    formData.append('reviewResolutionStatus', '0');
    formData.append('processContentId', (typeof this.procedure != 'undefined') ? this.procedure.processContentId : '0')

    this.previousNextNode = '0';
    this.isNextProcess = false;
    this.isPreviousProcess = false;
    return this.http.post<any>(this.apiUrl.apiGetGTSProcedures(), formData);
  }

  frameDecode(frameNo) {
    const formData = new FormData();

    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('frameNo', frameNo);
    // formData.append('workstreamId', frameNo);

    return this.http.post<any>(this.apiUrl.apiGTSFrameDecode(), formData);
  }

  updateGTSProcedureLocalState(data) {
    localStorage.setItem('gts-procedure', JSON.stringify(data));
  }

  getLocalGtsProcedure() {
    return localStorage.getItem('gts-procedure') ? JSON.parse(localStorage.getItem('gts-procedure')) : [];
  }

  removeLocalGtsProcedure(): void {
    localStorage.removeItem('gts-procedure');
  }

  updateGTSExitStatus() {
    const formData = new FormData();

    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    if (this.procedure.gtsId) {
      formData.append('gtsId', this.procedure.gtsId);
    }
    formData.append('procedureId', this.apiData.procedureId);
    formData.append('processId', this.apiData.processId);
    formData.append('exitStatus', '1');
    formData.append('workstreamId', this.apiData.workstreamId);
    formData.append('description', this.apiData.description);
    formData.append('uploadCount', '0');

    return this.http.post<any>(this.apiUrl.apiUpdateGTSStatus(), formData);
  }


  getRecentFrameSelection(query) {
    const formData = new FormData();

    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('searchText', '');
    formData.append('limit', '10');
    formData.append('offset', '0');
    const workStreamId = [];
    workStreamId.push(this.apiData.workstreamId);
    formData.append('workstreamId', JSON.stringify(workStreamId));

    return this.http.post<any>(this.apiUrl.apiGetGTSRecentFrameSelection(), formData);
  }

  updateGTSCheckActions() {
    const formData = new FormData();

    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('gtsId', this.apiData.gtsid);
    formData.append('procedureId', this.apiData.procedureId);
    formData.append('processId', this.apiData.processId);
    formData.append('contentId', this.apiData.contentId);
    formData.append('instructionType', this.apiData.instructionType);
    formData.append('actionStatus', this.apiData.actionStatus);
    formData.append('isLastProcess', this.apiData.isLastProcess);
    // formData.append('isFirstProcess', this.apiData.isFirstProcess);
    formData.append('workstreamId', this.apiData.workstreamId);
    formData.append('isFrameCutOffProcess', this.apiData.isFrameCutOffProcess);
    formData.append('previousProcessId', this.apiData.prevProcessId);

    return this.http.post<any>(this.apiUrl.apiUpdateGTSCheckAction(), formData);
  }

  updateUserInputCheckAction() {
    const formData = new FormData();

    formData.append('apiKey', this.apiKey);
    formData.append('domainId', this.domainId);
    formData.append('userId', this.userId);
    formData.append('gtsId', this.apiData.gtsid);
    formData.append('procedureId', this.apiData.procedureId);
    formData.append('processId', this.apiData.processId);
    formData.append('contentId', this.apiData.contentId);
    formData.append('instructionType', this.apiData.instructionType);
    formData.append('userInput', this.apiData.userInput);
    formData.append('isLastProcess', this.apiData.isLastProcess);
    // formData.append('isFirstProcess', this.apiData.isFirstProcess);
    formData.append('workstreamId', this.apiData.workstreamId);
    formData.append('isFrameCutOffProcess', this.apiData.isFrameCutOffProcess);
    formData.append('userInputId', (typeof this.apiData.userInputId != 'undefined') ? this.apiData.userInputId : this.userId);
    formData.append('userActionValue', this.apiData.userActionValue);

    return this.http.post<any>(this.apiUrl.apiGTSUpdateUserInputCheckActions(), formData);
  }
  DeleteAttachmentInfo(filedata) {
    const formData = new FormData();
    console.log(filedata);

    formData.append('apiKey', this.apiKey);
    formData.append('workstreamId', this.apiData.workstreamId);
    formData.append('procedureId', this.apiData.procedureId);
    formData.append('processId', this.apiData.processId);
    formData.append('userId', this.userId);
    formData.append('domainId', this.domainId);
    formData.append('contentId', this.apiData.contentId);
    if (this.procedure.gtsId) {
      formData.append('gtsId', this.procedure.gtsId);
    }
    formData.append('fileId', Object.assign({}, filedata));
    formData.append('userInputId', (typeof this.apiData.userInputId != 'undefined') ? this.apiData.userInputId : this.userId);


    let data = {
      apiKey: this.apiKey,
      workstreamId: this.apiData.workstreamId,
      procedureId: this.apiData.procedureId,
      processId: this.apiData.processId,
      userId: this.apiData.userId,
      domainId: this.domainId,
      contentId: this.apiData.contentId,
      gtsId: this.procedure?.gtsId,
      fileId: Object.assign({}, filedata),
      userInputId: (typeof this.apiData.userInputId != 'undefined') ? this.apiData.userInputId : this.userId
    }
    // formData.append('exitStatus', '1');fileId
    // formData.append('workstreamId', this.apiData.workstreamId);
    // formData.append('description', this.apiData.description);
    // formData.append('uploadCount', '0');

    return this.http.post<any>(this.apiUrl.apiDeleteAttachmentInfo(), data);
  }
  getProcedure(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getGtsProcedures().subscribe(response => {
        console.log("check get procedure response ==>", response);
        if (response.status == 'Success') {
          this.procedure = response.procedure[0];
          this.pageType = GTSPage.procedure;
          this.apiData.gtsid = response.gtsId;
          this.updateGTSProcedureLocalState(this.procedure);
          resolve(true)
        }
        this.isLoading = false
      }, err => {
        this.isLoading = false
        reject(err)
        console.log('Error =>', err);
      })
    })
  }


  checkUploadAttachmentMedia(callback = null) {
    console.log("file ==>", this.fileDatas);
    const promises = [];



    for (let fileData of this.fileDatas.attachments) {
      console.log("file this.fileDatas.attachments 1==>", this.fileDatas);
      let isExist = (fileData) => {
        console.log("file is exist true 8==>", isExist);

        for (let prev of this.fileDatasPrev) {
          console.log('fileData 5 ', prev)

          if (fileData.fileCaption == prev.fileCaption) {
            console.log('file this.fileDatas.attachments, this.fileDatasPrev.fileCaption 9', this.fileDatas.attachments, this.fileDatasPrev.fileCaption);

            // this.fileDatas.attachments = [];
            return true;
          }
        }

        return false;
      }

      let exist = isExist(fileData);

      if (fileData.accessType === 'media' && exist == false) {
        console.log('file check here test for upload here 2', exist);
        this.fileDatasPrev.push(fileData);
        continue;
      }

      if (exist === false) {
        const uploadMediaFormData = new FormData();
        uploadMediaFormData.append('apiKey', this.postApiData['apiKey']);
        uploadMediaFormData.append('workstreamId', this.postApiData['workstreamId']);
        uploadMediaFormData.append('userId', this.postApiData['userId']);
        uploadMediaFormData.append('domainId', this.postApiData['domainId']);
        uploadMediaFormData.append('dataId', this.postApiData['dataId']);
        uploadMediaFormData.append('gtsId', this.postApiData['gtsId']);
        uploadMediaFormData.append('uploadByAuthor', this.postApiData['uploadByAuthor']);

        uploadMediaFormData.append('linkUrl', this.postApiData['linkUrl']);
        uploadMediaFormData.append('caption', fileData.originalName);

        uploadMediaFormData.append('type', fileData.fileType);
        uploadMediaFormData.append('procedureId', this.postApiData['procedureId']);
        uploadMediaFormData.append('processId', this.postApiData['processId']);

        uploadMediaFormData.append('contentId', this.postApiData['contentId']);

        uploadMediaFormData.append('userInputId', this.postApiData['userInputId']);
        uploadMediaFormData.append('countryId', this.postApiData['countryId']);
        uploadMediaFormData.append('contentTypeId', this.postApiData['contentTypeId']);
        uploadMediaFormData.append('file', fileData.originalfileArray);
        uploadMediaFormData.append('flagId', this.postApiData['flagId']);
        uploadMediaFormData.append('uploadCount', '1');
        uploadMediaFormData.append('uploadFlag', this.postApiData['uploadFlag']);
        uploadMediaFormData.append('displayOrder', this.postApiData['displayOrder']);

        promises.push(this.mediaApi.checkUploadAttachment(uploadMediaFormData).toPromise());
      }


    }


    Promise.all(promises).then((response) => {
      console.log('file response 3', response);

      for (let i in response) {
        console.log('file response 4', i);

        const res = response[i];
        if (res.status === 'Success') {
          let obj = this.fileDatas.attachments[i];
          console.log('file response 5', obj);
          obj.server = response;

          this.zone.run(() => {
            this.fileDatasPrev.push(obj);
            console.log('file response 6', this.fileDatasPrev);

          })
        }
        this.fileDatasPrev = [];
      }
      console.log('file this.fileDatasPrev 7', this.fileDatasPrev);
    });
  }
}

