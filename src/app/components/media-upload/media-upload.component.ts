import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MediaUpload, MediaTypeSizes, MediaTypeInfo } from 'src/app/common/constant/constant';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent implements OnInit {
  subscription: Subscription = new Subscription();
  @Input() access;
  @Input() apiData;
  @Input() mediaList: any = [];
  @Input() attachmentList: any = [];
  @Output() uploadAction: EventEmitter<any> = new EventEmitter();
  
  public mediaFile: boolean = false;
  public fromMedia: boolean = true;
  public attachmentTabs: any = MediaUpload;
  public thumbView: boolean = true;
  public fileLoading: boolean = false;
  public searchBgFlag: boolean = false;
  public searchReadonlyFlag: boolean = false;
  public searchPlacehoder: string = 'Search';
  public searchVal: string = '';
  public searchForm: FormGroup;
  public searchTick: boolean = false;
  public searchClose: boolean = false;
  public submitted: boolean = false;
  public assetPath: string = "assets/images";
  public searchImg: string = `${this.assetPath}/search-icon.png`;
  public searchCloseImg: string = `${this.assetPath}/select-close.png`;
  public empty: any = [];
  public mediaSelectionList: any = [];
  public mediaRemoveList: any = [];

  // convenience getter for easy access to form fields
  get f() {
    return this.searchForm.controls;
  }
  
  constructor(
    public activeModal: NgbActiveModal,
    private commonApi: CommonService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    //localStorage.removeItem('mediaUploadFilter');
    this.searchForm = this.formBuilder.group({
      searchKey: [this.searchVal, [Validators.required]],
    });

    console.log(this.mediaList, this.attachmentList)

    this.subscription.add(
      this.commonApi.mediaUploadDataSubject.subscribe((response) => {
        console.log(response)
        let access = response['access'];
        switch(access) {
          case 'media':
            this.setupAction(response);
            break;
        }
      })
    );
  }

  setupAction(data) {
    let action = data['action'];
    switch(action) {
      case 'mediaSelection':
        let mediaItem = data['mediaItem'];
        let rmId = data['removedItem'];
        this.mediaFile = data['mediaFlag'];
        if(mediaItem != '') {
          let mid = mediaItem.mediaId;
          let mindex = this.mediaSelectionList.findIndex(option => option.mediaId == mid);
          console.log(this.mediaRemoveList)
          let rmindex = this.mediaRemoveList.findIndex(option => option == mid);
          if(rmindex >= 0) {
            this.mediaRemoveList.splice(rmindex);
          }
          if(mindex < 0) {
            this.mediaSelectionList.push(mediaItem);
          }                
        }
        if(rmId != '') {
          this.chkMediaExists(rmId);
        }        
        break;
    }
  }

  chkMediaExists(mid) {
    let mindex = this.mediaList.findIndex(option => option == mid);
    if(mindex >= 0) {
      this.mediaList.splice(mindex, 1);
      this.mediaRemoveList.push(mid);
    }

    if(this.attachmentList.includes(mid) && !this.mediaRemoveList.includes(mid)) {
      this.mediaRemoveList.push(mid);
    }

    let msindex = this.mediaSelectionList.findIndex(option => option.mediaId == mid);
    if(msindex >= 0) {
      this.mediaSelectionList.splice(msindex, 1);
    }

    console.log(this.mediaSelectionList, this.mediaRemoveList)
    console.log(this.mediaSelectionList.length, this.mediaRemoveList.length)

    setTimeout(() => {
      if(this.mediaSelectionList.length == 0 && this.mediaRemoveList.length > 0) {
        this.mediaFile = true;
      }  
    }, 100);
    
  }

  changeTab(item) {
    console.log(item)
    if(!item.isActive) {
      return false;
    }
    this.attachmentTabs.forEach(tabItem => {
      tabItem.isSelected = (tabItem.tab != item.tab) ? false : true;
    });
  }

  changeView(actionFlag) {
    this.thumbView = (actionFlag) ? false : true;
    let action = 'view'; 
    this.emitMedia(action);
    if(this.thumbView) {
      let secElement = document.getElementById('gallery');        
      setTimeout(() => {
        let scrollPos = 0;
        secElement.scrollTop = scrollPos;
      }, 200);        
    }    
  }

  // Search Onchange
  onSearchChange(searchValue: string) {
    this.searchForm.value.search_keyword = searchValue;
    this.searchTick = (searchValue.length > 0) ? true : false;
    this.searchClose = this.searchTick;
    this.searchVal = searchValue;
    let searchLen = searchValue.length;
    if (searchLen == 0) {
      this.submitted = false;
      this.clearSearch();
    }
  }

  onSubmit() {
    //console.log(this.searchVal)
    this.searchForm.value.search_keyword = this.searchVal;
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    } else {
      this.searchVal = this.searchForm.value.search_keyword;
      this.submitSearch();
    }
  }

  // Submit Search
  submitSearch() {
    this.emitMedia('search');
  }

  // Clear Search
  clearSearch() {
    this.submitted = false;
    this.searchVal = '';
    this.searchTick = false;
    this.searchClose = this.searchTick;
    this.searchBgFlag = false;
    this.searchImg = `${this.assetPath}/search-icon.png`;
    this.searchCloseImg = `${this.assetPath}/select-close.png`;
    this.emitMedia('search');
  }

  emitMedia(action) {
    let tabItem = this.checkTabIndex();
    let tabName = tabItem.tab;
    let data = {
      access: tabName,
      action: action,
      searchVal: this.searchVal
    };
    switch(action) {
      case 'search':
        data['searchVal'] = this.searchVal;
        break;
      case 'view':
        let view = (this.thumbView) ? 'thumb' : 'list';
        data['viewType'] = view;
        break;  
    }
    this.commonApi.emitMediaUploadData(data);
  }

  applySelection() {
    let tabItem = this.checkTabIndex();
    let tabName = tabItem.tab;
    let data = {
      mediaSelectionList: [],
      mediaRemoveList: []
    };
    switch(tabName) {
      case 'media':
        if(this.mediaFile) {
          data.mediaSelectionList = this.mediaSelectionList;
          data.mediaRemoveList = this.mediaRemoveList;
        }
        break;
    }
    this.uploadAction.emit(data);
  }

  checkTabIndex() {
    let flag = true;
    let tindex = this.attachmentTabs.findIndex(option => option.isSelected == flag);
    let tabItem = this.attachmentTabs[tindex];
    return tabItem;
  }

  close() {
    //localStorage.removeItem('mediaUploadFilter');
    this.subscription.unsubscribe();
    this.activeModal.dismiss('Cross click');
  }

}
