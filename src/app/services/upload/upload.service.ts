import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { ChatAttachment } from 'src/app/models/chatmodel';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private serverUrl: string;
  public uploadFlag: any = null;

  constructor(
    private httpClient: HttpClient,
    private api: ApiService,
  ) { }

  // Upload File
  upload(access, fileInfo, file: File) {
    console.log(access)
    console.log(fileInfo)
    console.log(file)
    const formData: FormData = new FormData();
    formData.append('apiKey', fileInfo.apiKey);
    formData.append('domainId', fileInfo.domainId);
    formData.append('countryId', fileInfo.countryId);
    formData.append('userId', fileInfo.userId);
    
    if(access != 'dtc') {
      let defaultLanguage = JSON.parse(localStorage.getItem('defaultLanguage'));
      let langId = (access != 'media' && fileInfo.filteredLangItems.length > 0) ? fileInfo.filteredLangItems : [defaultLanguage[0].id];
      let caption = fileInfo.fileCaption;
      fileInfo.fileCaption = (caption == undefined || caption == 'undefined') ? '' : caption;

      formData.append('uploadCount', fileInfo.uploadCount);
      formData.append('uploadFlag', fileInfo.uploadFlag);
      formData.append('type', fileInfo.type)
      formData.append('caption', fileInfo.fileCaption);
      formData.append('displayOrder', fileInfo.displayOrder);
      formData.append('language', JSON.stringify(langId));
    }

    if(access == 'dtc') {
      formData.append('action', fileInfo.action);
      formData.append('type', fileInfo.type);
      formData.append('type_name', fileInfo.typeName);
      formData.append('type_id', fileInfo.typeId);
    }
    
    formData.append('platform', '3');
    
    if(fileInfo.type != 'link') {
      formData.append('file', file);
    } else {
      formData.append('linkUrl', fileInfo.url)
    }

    switch (access) {
      case 'media':
        formData.append('workstreams', fileInfo.workstreams);
        this.serverUrl = this.api.apiGetMediaUploadURL();
        return this.fileUpload(formData);
        break;
      case 'dtc':
        this.serverUrl = this.api.apiGetCreateDTC();
        return this.fileUpload(formData);
        break;  
      default:  
        this.serverUrl = this.api.apiGetUploadURL();
        formData.append('dataId', fileInfo.dataId);
        formData.append('contentTypeId', fileInfo.contentType);
        return this.fileUpload(formData);
        break;
    }
  }

  // File Upload
  fileUpload(formData) {
    /*const request = new HttpRequest('POST', `${this.serverUrl}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.httpClient.request(request).pipe(
      map((event: HttpEvent<any>) => this.getEventMessage(event)));
    */

    //this.serverUrl = 'http://localhost/Projects/test-api/upload.php';
      
    return this.httpClient.post(`${this.serverUrl}`, formData, {
      reportProgress: true,
      headers: new HttpHeaders({ "Accept": "application/json" }),
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    // We are now getting events and can do whatever we want with them!
    console.log(event);
    return event;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // Get Files
  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.serverUrl}/files`);
  }
  

  uploadChatAttachment( attachment:ChatAttachment, file: File) {
    console.log(attachment)
    console.log(file)
    const formData: FormData = new FormData();
    formData.append('apiKey', attachment.apiKey);
    formData.append('domainId', attachment.domainId);
    formData.append('countryId', attachment.countryId);
    formData.append('chatType', attachment.chatType);
    formData.append('userId', attachment.userId);
    formData.append('workStreamId', attachment.workStreamId);
    formData.append('type', attachment.type);
    formData.append('caption', attachment.caption)
    formData.append('chatGroupId', attachment.chatGroupId);
    formData.append('chatType', attachment.chatType);
    formData.append('file', file);
    formData.append('sendpush', attachment.sendpush);
    formData.append('messageId', attachment.messageId);
    formData.append('messageType', attachment.messageType);
    this.serverUrl = this.api.apiGetChatUploadURL();

    return this.httpClient.post(`${this.serverUrl}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    );
  }
}
