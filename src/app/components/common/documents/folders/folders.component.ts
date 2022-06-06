import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxMasonryComponent } from "ngx-masonry";
import { CommonService } from "src/app/services/common/common.service";
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionFormComponent } from 'src/app/components/common/action-form/action-form.component';
import { SuccessModalComponent } from 'src/app/components/common/success-modal/success-modal.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Constant } from 'src/app/common/constant/constant';

@Component({
    selector: 'app-folders',
    templateUrl: './folders.component.html',
    styleUrls: ['./folders.component.scss'],
    styles: [
        `
          .masonry-item {
            transition: top 0.4s ease-in-out, left 0.4s ease-in-out;
          }`
    ]
})
export class FoldersComponent implements OnInit {
    @Input() items = [];
    @Input() thumbView: boolean = true;
    @Input() section: string;
    @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
    @Output() scrollActionEmit: EventEmitter<any> = new EventEmitter();
    public updateMasonryLayout: boolean = false;
    public user;
    public countryId;
    public domainId;
    public userId;
    public domainAccess: boolean = true;
    public listHeight: any = 0;

    constructor(
        private authenticationService: AuthenticationService,
        private modalService: NgbModal,
        private documentationService: DocumentationService,
        private commonService: CommonService,
        private route: ActivatedRoute, private router: Router) { }
    ngOnInit() {
        this.listHeight = (this.section == 'main') ? 500 : 280;
        window.addEventListener('scroll', this.scroll, true); 
        this.countryId = localStorage.getItem('countryId');
        this.user = this.authenticationService.userValue;
        this.domainId = this.user.domain_id;
        this.userId = this.user.Userid;
        if (this.thumbView) {
            setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
            }, 1000);
        }
        this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => { //Right side panel show & hide
            console.log(r)
            if(this.thumbView) {
                this.updateLayout();
            }
        });
        
        this.commonService._OnLayoutStatusReceivedSubject.subscribe((r) => {
            let action = r['action'];
            if(action == 'folder-layout') {
                if(this.thumbView) {
                    this.updateLayout();
                }
            }
        });

        this.commonService.documentListDataReceivedSubject.subscribe((docsData: any) => { //Right side panel show & hide
            this.thumbView = docsData['thumbView'];    
            if(this.thumbView) {
                setTimeout(() => {
                    //this.masonry.reloadItems();
                    //this.masonry.layout();
                    //this.updateMasonryLayout = true;
                    this.updateLayout();
                }, 100);
            } else {
                this.updateLayout();
            }
        });
    }

    viewDocument(event) {
        console.log(event);
        if(event.fileCount > 0) {
            let data = {
                action: (event.isMake) ? 'subFolders' : (event.subFolderCount > 0) ? 'folders' : 'files',
                folderId: event.id,
                subFolderId: (event.isMake) ? event.id : '',
                docData: [],
                thumbView: this.thumbView,
                subFolderCount: event.subFolderCount
            }
            this.commonService.emitDocumentListData(data);
            this.commonService.emitDocumentPanelFlag(data);
        }        
    }

    updateLayout() {
        this.updateMasonryLayout = true;
        setTimeout(() => {
            this.updateMasonryLayout = false;
        }, 500);
    }

    editfolderpopup(name,id) {
        console.log(name);
        console.log(id);
        let apiData = {
          apiKey: Constant.ApiKey,
          userId: this.userId,
          domainId: this.domainId,
          countryId: this.countryId
        }
        let actionInfo = {
            action: 'edit',
            id: id,
            name: name
        }
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = 'Edit Folder';
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
          modalRef.dismiss('Cross click');
          console.log(receivedService)
          const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
          msgModalRef.componentInstance.successMessage = receivedService.message;          
          setTimeout(() => {            
            msgModalRef.dismiss('Cross click');            
            let rmIndex;
            rmIndex = this.items.findIndex((option) => option.id == id); 
            this.items[rmIndex].folderName = receivedService.folderName;
            console.log(this.items[rmIndex].folderName);    
            console.log(this.items);
            setTimeout(() => {
                this.masonry.reloadItems();
                this.masonry.layout();
                this.updateMasonryLayout = true;
                this.updateLayout();
            }, 100); 
          }, 3000);
        });
    }

    deletefolderpopup(name,id,count) {
        console.log(name);
        console.log(id);
        let apiData = {
            apiKey: Constant.ApiKey,
            userId: this.userId,
            domainId: this.domainId,
            countryId: this.countryId                
        }
        let actionInfo = {
            action: 'delete',
            id: id,
            name: name,
            count: count
        }
        const modalRef = this.modalService.open(ActionFormComponent, { backdrop: 'static', keyboard: false, centered: true });
        modalRef.componentInstance.access = 'Delete Folder';
        modalRef.componentInstance.apiData = apiData;
        modalRef.componentInstance.actionInfo = actionInfo;
        modalRef.componentInstance.dtcAction.subscribe((receivedService) => {
            modalRef.dismiss('Cross click');
            console.log(receivedService)
            const msgModalRef = this.modalService.open(SuccessModalComponent, { backdrop: 'static', keyboard: false, centered: true });
            msgModalRef.componentInstance.successMessage = receivedService.message;  
            setTimeout(() => {            
                msgModalRef.dismiss('Cross click');            
                let rmIndex;
                rmIndex = this.items.findIndex((option) => option.id == id); 
                let updateCount = this.items[rmIndex].fileCount;
                this.items.splice(rmIndex, 1);  
                console.log(updateCount, this.items);

                let updateFolder, fileCount;
                let platformId: any = localStorage.getItem('platformId');
                platformId = (platformId == 'undefined' || platformId == undefined) ? platformId : parseInt(platformId);
                        
                switch(receivedService.action) {
                    case 'all':
                        updateFolder = this.items.findIndex((option) => option.isSystemFolder == 1 && option.folderName == 'ALL FILES');
                        fileCount = this.items[updateFolder].fileCount-updateCount;
                        this.items[updateFolder].fileCount = fileCount;
                        break;
                    case 'general':
                        let chkGeneralFolder = (platformId == 2 && this.domainId == 52) ? 'General Automotive Info' : 'GENERAL';
                        updateFolder = this.items.findIndex((option) => option.isSystemFolder == 1 && option.folderName == chkGeneralFolder);
                        fileCount = this.items[updateFolder].fileCount+updateCount;
                        this.items[updateFolder].fileCount = fileCount;
                        break;    
                }

                setTimeout(() => {
                    this.masonry.reloadItems();
                    this.masonry.layout();
                    this.updateMasonryLayout = true;
                    this.updateLayout();
                }, 100); 
            }, 3000);
        });
    }

    scroll = (event: any): void => {
        console.log(event);
        console.log(event.target.className);
        //if(event.target.className=='ps ps--active-y ps--scrolling-y')
        //{
            this.scrollActionEmit.emit(event);
            event.preventDefault;
        //}        
    }
}