import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor( private http:  HttpClient,private apiUrl: ApiService) { }

  // Thread Field API
  apiGetThreadFields(data) {
    const params = new HttpParams()
      .set('apiKey', data.apiKey)
      .set('domainId', data.domainId)
      .set('countryId', data.countryId)
      .set('userId', data.userId)
      .set('step', data.step)
      .set('threadCategoryId', data.threadCategoryId)
      .set('threadType', data.threadType)
      .set('docType', data.docType)
      .set('threadId', data.threadId)
      .set('platform', data.platform)
      .set('apiType', data.apiType)
      .set('makeName', data.makeName)
      .set('modelName', data.modelName)
      .set('yearValue', data.yearValue)
      .set('productType', data.productType)
    const body = JSON.stringify(data);

    return this.http.get<any>(this.apiUrl.apiGetThreadFields(), {'params': params})
  }

  // Thread Creation API
  createThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiCreateThread(), threadData);
  }

  // Thread Update API
  updateThread(threadData) {
    return this.http.post<any>(this.apiUrl.apiUpdateThread(), threadData);
  }

  // Thread Push Api
  threadPush(pushData) {
    return this.http.post<any>(this.apiUrl.apiThreadPush(), pushData);
  }

  // Document/Announcement Update API
  updateTechInfo(data) {
    return this.http.post<any>(this.apiUrl.apiUpdateTechInfo(), data)
  }

  // Document Notification Api
  documentNotification(pushData) {
    return this.http.post<any>(this.apiUrl.apiDocumentNotification(), pushData);
  }

}
