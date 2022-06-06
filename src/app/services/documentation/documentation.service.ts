import { Injectable } from "@angular/core";
import { AppService } from "src/app/modules/base/app.service";
import { BaseService } from "src/app/modules/base/base.service";
import { CommonService } from "src/app/services/common/common.service";
import * as moment from 'moment';
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DocumentationService {
    constructor(private baseService: BaseService,
        private appService: AppService,
        private commonApi: CommonService) { }

    getALLDocument(filterOptions: any) {
        console.log(filterOptions.expand)
        let promise = new Promise((resolve, reject) => {
            let documents = {
                loader: true,
                folders: [],
                files: [],
                folderInfo: [],
                makeInfo: [],
                docInfoArray: [],
                priorityIndexValue: '',
                total: 0
            };
            this.baseService.get("resources", "GetfoldersandDocuments", filterOptions)
                .subscribe((data: any) => {
                    documents.total = data.total;
                    documents.folderInfo = data.folderInfo;
                    documents.makeInfo = data.makeInfo;
                    documents.docInfoArray = data.docInfoArray;
                    documents.priorityIndexValue = data.priorityIndexValue;
                    let folders = data.folders;
                    folders.forEach((folder, i) => {
                        let docDetail = folder.documentDetail;
                        if (docDetail.resourceID != null) {
                            let file: any = {};
                            let selected = false;
                            file.selected = selected;
                            file.title = docDetail.title;
                            let folderOptions = docDetail.foldersOptions;
                            file.folderId = (folderOptions.length > 0) ? parseInt(folderOptions[0].id) : 0;
                            file.resourceID = docDetail.resourceID;
                            let makeModelValue = docDetail.makeModelsNew;
                            let isGeneral = (docDetail.isGeneral == 1) ? true : false;
                            file.isGeneral = isGeneral;
                          
                            let makeModelVal = docDetail.makeModelsWeb[0];
                            docDetail.modelList = (makeModelVal.model.length > 0) ? makeModelVal.model : []; 
                         
                            if(isGeneral) {
                                file.makeTooltip = '';
                                file.manufacturer = '';
                                file.mfg = '';
                                file.make = docDetail.make;
                                file.model = '';
                                file.year = '';
                                file.makeTooltip = file.make;
                            } else {
                                file.manufacturer = '';
                                file.mfg = '';
                                file.model = '';
                                file.year = '';
                                file.makeTooltip = "";
                                if (makeModelValue && makeModelValue.length == 0) {
                                    file.make = 'All Makes';
                                    file.model = 'All Models';
                                    file.year = '';
                                } else if (makeModelValue && makeModelValue.length > 0) {
                                    if(makeModelValue[0].hasOwnProperty('manufacturer')) {
                                        if (makeModelValue[0].manufacturer && makeModelValue[0].manufacturer != "") {
                                            file.manufacturer = makeModelValue[0].manufacturer.replace(/\s?$/,'');
                                            file.mfg = file.manufacturer;
                                            file.makeTooltip = file.manufacturer;
                                            if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                                                file.make = makeModelValue[0].genericProductName;
                                                file.makeTooltip = `${file.makeTooltip} > ${file.make}`;
                                                if(makeModelValue[0].model.length > 0) {
                                                    file.model = ` ${makeModelValue[0].model}`;
                                                    file.makeTooltip = `${file.makeTooltip} > ${file.model}`;
                                                    if (makeModelValue[0].year) {
                                                        file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                                                        file.mfg = '';
                                                    }
                                                }
                                            } 
                                        } else {
                                            if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "") {
                                                file.make = makeModelValue[0].genericProductName;
                                            }
                                            if (makeModelValue[0].model.length > 0) {
                                                file.model = makeModelValue[0].model;
                                            }
                                            if (makeModelValue[0].year) {
                                                file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                                            }
                                        }
                                    } else {
                                        if (makeModelValue[0].genericProductName && makeModelValue[0].genericProductName != "")
                                            file.make = makeModelValue[0].genericProductName;
                                        else
                                            file.make = 'All Makes';
                                        if (makeModelValue[0].model.length > 0) {
                                            file.model = makeModelValue[0].model;
                                        } else {
                                            file.model = '';
                                        }
                                        if (makeModelValue[0].year) {
                                            file.year = (makeModelValue[0].year[0] == 0) ? '' : makeModelValue[0].year[0];
                                        } else {
                                            file.year = '';
                                        }
                                    }                                                                        
                                }
                                
                                if(!makeModelValue[0].hasOwnProperty('manufacturer')) {
                                    let tooltip = '';
                                    if(file.make != '')
                                        tooltip = file.make;

                                    if(file.model != '')
                                        tooltip = `${tooltip} > ${file.model}`;

                                    if(file.year != '')
                                        tooltip = `${tooltip} > ${file.year}`;
                                    
                                    file.makeTooltip = tooltip;
                                }
                            }

                            let createdDate = moment.utc(docDetail.createdOnMobile).toDate(); 
                            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.createdOnMobile = localCreatedDate;
                            let updatedDate = moment.utc(docDetail.updatedOnMobile).toDate(); 
                            let localUpdatedDate = moment(updatedDate).local().format('MMM DD, YYYY h:mm A');
                            docDetail.updatedOnMobile = localUpdatedDate;
                            docDetail.expand = filterOptions.expand;
                            file.docData = docDetail;
                            
                            file.createdOnMobile = localCreatedDate;
                            file.updatedOnMobile = localUpdatedDate;
                            file.viewCount = docDetail.viewCount;
                            file.isDraft = docDetail.isDraft;
                            file.likeCount = docDetail.likeCount;
                            if (docDetail.likeStatus == 1) file.likeStatus = true;
                            else file.likeStatus = false;
                            file.shareCount = docDetail.shareCount;
                            file.pinCount = docDetail.pinCount;
                            if (docDetail.pinStatus == 1) file.pinStatus = true;
                            else file.pinStatus = false;
                            
                            file.styleName = 'empty';
                            file.flagId = 0;
                            file.class = 'doc-thumb';
                            let attachments = docDetail.uploadContents;
                            if(attachments.length > 0) {
                                let attachment = attachments[0];
                                file.flagId = attachment.flagId;
                                if (attachment.flagId == 1)
                                    file.contentPath = attachment.thumbFilePath;
                                else if (attachment.flagId == 2)
                                    file.contentPath = attachment.posterImage;
                                else if (attachment.flagId == 3)
                                    file.styleName = 'mp3';
                                else if (attachment.flagId == 4 || attachment.flagId == 5) {
                                    let fileType = attachment.fileExtension.toLowerCase();
                                    switch (fileType) {
                                        case 'pdf':
                                            file.styleName = 'pdf';
                                            break;
                                        case 'application/octet-stream':
                                        case 'xlsx':
                                        case 'xls':    
                                            file.styleName = 'xls';
                                            break;
                                        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                                        case 'application/msword':
                                        case 'docx':
                                        case 'doc':
                                        case 'msword':  
                                            file.styleName = 'doc';
                                            break;
                                        case 'application/vnd.ms-powerpoint':  
                                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                                        case 'pptx':
                                        case 'ppt':
                                            file.styleName = 'ppt';
                                            break;
                                        case 'zip':
                                            file.styleName = 'zip';
                                            break;
										case 'exe':
                                            file.styleName = 'exe';
                                            break;
                                        case 'txt':
                                            file.styleName = 'txt';
                                            break;  
                                        default:
                                            file.styleName = 'unknown-thumb';
                                            break;
                                        }
                                }
                                else if (attachment.flagId == 6) { // link, youtube
                                    file.class = 'link-thumb';
                                    let banner = '';
                                    let prefix = 'http://';
                                    let logoImg = attachment.thumbFilePath;
                                    file.styleName = (logoImg == "") ? 'link-default' : '';
                                    let logo = (logoImg == "") ? 'assets/images/media/link-medium.png' : logoImg;
                                    let url = attachment.filePath;
                                    //console.log(url)
                                    if(url.indexOf("http://") != 0) {
                                        if(url.indexOf("https://") != 0) {
                                        url = prefix + url;
                                        } 
                                    }
                                    let youtube = this.commonApi.matchYoutubeUrl(url);
                                    //console.log(url, youtube)
                                    if(youtube) {
                                        //console.log(youtube)
                                        banner = '//img.youtube.com/vi/'+youtube+'/0.jpg';
                                    } else {
                                        let vimeo = this.commonApi.matchVimeoUrl(url);
                                        if(vimeo) {
                                        this.commonApi.getVimeoThumb(vimeo).subscribe((response) => {
                                            let res = response[0];
                                            banner = res['thumbnail_medium'];
                                        });
                                        } else {
                                            banner = logo;
                                        }
                                    }
                                    file.contentPath = banner;
                                }
                            }
                            documents.files.push(file);
                        }

                        if (folder.folderDetail.id) {
                            let createdDate = moment.utc(folder.folderDetail.createdOn).toDate();
                            let localCreatedDate = moment(createdDate).local().format('MMM DD, YYYY h:mm A');
                            let updatedDate = folder.folderDetail.updatedOn != "" ? moment.utc(folder.folderDetail.updatedOn).toDate() : "";
                            let localUpdatedDate = updatedDate != "" ? moment(updatedDate).local().format('MMM DD, YYYY h:mm A') : "";
                            let folderObj: DocumentListData = {
                                isSystemFolder: folder.folderDetail.isSystemFolder,
                                folderName: folder.folderDetail.folderName,
                                subFolderCount: folder.folderDetail.subFolderCount,
                                fileCount: folder.folderDetail.fileCount,
                                isMake: folder.folderDetail.isMake,
                                viewCount: folder.folderDetail.viewCount,
                                id: folder.folderDetail.id,
                                createdOn: localCreatedDate,
                                updatedOn: localUpdatedDate,
                                userName: folder.folderDetail.userName
                            }
                            documents.folders.push(folderObj);
                        }
                        //documents.loader = false;
                    });
                    documents.loader = false;
                    resolve(documents);
                });
        });
        return promise;
    }

    addLikePins(userId, domainId, countryId, fileId, type, status) {
        return new Promise((resolve, reject) => {
            let isSuccess = false;
            const apiFormData = new FormData();
            apiFormData.append('apiKey', this.appService.appData.apiKey);
            apiFormData.append('userId', userId);
            apiFormData.append('domainId', domainId);
            apiFormData.append('countryId', countryId);
            apiFormData.append('dataId', fileId);
            apiFormData.append('type', type);
            apiFormData.append('status', status);
            this.baseService.postFormData("resources", "AddLikePins", apiFormData).subscribe((response: any) => {
                if (response.status == "Success") {
                    isSuccess = true;
                }
                resolve(isSuccess);
            });
        });
    }

    // Get Document Detail
    getDocumentDetail(docData: any) {
        let promise = new Promise((resolve, reject) => {
        
        this.baseService.get("resources", "GetDocumentDetails", docData)
            .subscribe((data: any) => {
                let docDetail = data.documentDetail[0];
                resolve(docDetail);
            });
        });
        return promise;
    }

    public isUserNearBottom(event: any): boolean {
        const threshold = 80;
        const position = event.target.scrollTop + event.target.offsetHeight;
        const height = event.target.scrollHeight;
        return position > height - threshold;
    }

    public isUserNearBottomVal(event: any): boolean {
        const threshold = 80;
        const position:any = event.target.scrollTop + event.target.offsetHeight - threshold;
        return position;
    }
}


export interface DocumentListData {
    id: string;
    isSystemFolder: boolean;
    isMake: boolean;
    viewCount: number;
    folderName: string;
    subFolderCount: number;
    fileCount: number;
    createdOn: string;
    updatedOn: string;
    userName: string;
}