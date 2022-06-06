import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { CommonService } from "../../../../services/common/common.service";
import { PartsService } from "../../../../services/parts/parts.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { PlatFormType, pageInfo, pageTitle, Constant, IsOpenNewTab, ChatType, LocalStorageItem, DefaultNewImages, DefaultNewCreationText, filterNames } from "src/app/common/constant/constant";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { DocumentationService } from "src/app/services/documentation/documentation.service";
import { Subscription } from "rxjs";
declare var $: any;

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  public sconfig: PerfectScrollbarConfigInterface = {};
  public title = "Worsktream";
  public displayNoRecordsShow = 3;
  public newThreadInfo =
    "Tap on the ‘Go to Chat’ button to open the chat page.";
  public contentTypeDefaultNewImg = DefaultNewImages.chatPage;
  public contentTypeDefaultNewText = DefaultNewCreationText.chatpage;
  public contentTypeDefaultNewTextDisabled = false;
  public contentTypeValue = 1;
  public createThreadUrl = "";
  public teamSystem = localStorage.getItem("teamSystem");
  public headerData: Object;
  public outputContentTypedata: object;
  public outputContentFromLeftMenu: object;
  public sidebarActiveClass: Object;
  public countryId;
  public domainId;
  public pageData = pageInfo.workstreamPage;
  public headerFlag: boolean = false;
  public user: any;
  public userId;
  public loadLeftside = true;
  public menuListloaded;
  public getcontentTypesArr = [];
  public roleId;
  public filterOptions;
  public apiData: Object;
  public workstreamId;
  public currentContentTypeId: number = 0;
  public tapfromheader: boolean = false;
  public platformId: number = 0;
  public tvsFlag: boolean = false;
  pageAccess: string = "landingpage";
  public bodyClass: string = "landing-page";
  public bodyClass1: string = "knowledge-base";
  public bodyElem;
  public footerElem;
  public contentTypeWidthClass = "";
  public bodyHeight: number;
  public innerHeight: number = 0;
  public tabCount: number = 0;

  public collapseFlag: boolean = false;
  public rightPanel: boolean = true;
  public emptyFlag: boolean = false;
  public docLoading: boolean = true;
  public docLazyLoading: boolean = false;
  public docFile: boolean = true;
  public thumbView: boolean = true;
  public itemLimit: number = 20;
  public itemOffset: number = 0;
  folders = [];
  files = [];
  scrollCount: number = 0;
  public docDetail: any = [];
  public partData = {
    accessFrom: "landing",
    action: "get",
    domainId: 0,
    countryId: "",
    expandFlag: false,
    filterOptions: "",
    publishStatus: 1,
    section: 1,
    thumbView: true,
    userId: 0,
    partType: "",
    searchVal: "",
    tabCount: 0
  };

  public docData = {
    accessFrom: this.pageAccess,
    action: "files",
    domainId: 0,
    countryId: "",
    expandFlag: this.rightPanel,
    filterOptions: [],
    thumbView: this.thumbView,
    searchVal: "",
    userId: 0,
    partType: "",
    headerFlag: this.headerFlag,
    tabCount: 0
  };

  public isOn1:boolean=false;
  public isOn2:boolean=false;
  public isOn3:boolean=false;
  public isOn4:boolean=false;
  public isOn5:boolean=false;
  public isOn6:boolean=false;
  public CBADomian: boolean = false;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private partApi: PartsService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private documentationService: DocumentationService
  ) {
    this.titleService.setTitle(
      localStorage.getItem("platformName") + " - " + this.title
    );
  }

  ngOnInit(): void {
    
    let platformId = localStorage.getItem("platformId");
    if (platformId != "1") {
      this.contentTypeWidthClass = "contentTypeWidthClass";
    }
    this.platformId =
      platformId == "undefined" || platformId == undefined
        ? this.platformId
        : parseInt(platformId);
    this.tvsFlag = this.platformId == 2 && this.domainId == 52 ? true : false;
    this.partData.publishStatus = this.tvsFlag ? 1 : 3;
    this.CBADomian = (platformId == PlatFormType.CbaForum) ? true : false;
    this.commonService._OnMessageReceivedSubject.subscribe((r) => {
      console.log(r);
      var setdata = JSON.parse(JSON.stringify(r));
      if(setdata.pushType == 23) {
        return false;
      }
      this.loadLeftside = false;
      if (this.currentContentTypeId == 4) {
        let rflag: any = r;
        this.rightPanel = rflag;
        this.collapseFlag = !rflag;
        if(this.collapseFlag){
          $('.center-middle-width-container').addClass('adding-width-10');
        }
        else{
          $('.center-middle-width-container').removeClass('adding-width-10');
        }
        this.emptyFlag = true;
      }
    });

    this.subscription.add(
      this.commonService._OnLayoutChangeReceivedSubject.subscribe((r) => {
        console.log(r);
        console.log(this.currentContentTypeId)
        let flag: any = r;
        this.collapseFlag = !flag;
        if(this.collapseFlag){
          $('.center-middle-width-container').addClass('adding-width-10');
        }
        else{
          $('.center-middle-width-container').removeClass('adding-width-10');
        }
        if (this.currentContentTypeId == 4) {
          //this.rightPanel = !flag;
          //this.collapseFlag = !flag;
        }
        console.log(this.collapseFlag);
      })
    );

    this.subscription.add(
      this.commonService.documentPanelFlagReceivedSubject.subscribe(
        (response) => {
          console.log(response)
          let flag = response["flag"];
          let access = response["access"];
          switch (access) {
            case "documents":
              this.docDetail = [];
              this.rightPanel = !flag;
              break;
            default:
              this.docDetail = response["docData"];
              console.log(this.rightPanel);
              if (!this.rightPanel) {               
                this.collapseFlag = false;
                $('.center-middle-width-container').removeClass('adding-width-10');
                this.rightPanel = true;
              } else {
                this.collapseFlag = false;
                $('.center-middle-width-container').removeClass('adding-width-10');
              }
              if (this.emptyFlag) {
                this.emptyFlag = false;
              } else {
                //this.emptyFlag = true;
                this.emitDocInfo(this.docDetail);
              }
              console.log(this.rightPanel, this.emptyFlag);
              break;
          }
        }
      )
    );

    this.subscription.add(
      this.commonService.workstreamListDataReceivedSubject.subscribe((response) => {
        console.log(response)
        this.getcontentTypesArr.forEach((item) => {
          item.disabled = false;
        });
      })
    );

    this.user = this.authenticationService.userValue;
    this.domainId = this.user.domain_id;
    this.userId = this.user.Userid;
    this.roleId = this.user.roleId;
    this.countryId = localStorage.getItem('countryId');
    this.bodyElem = document.getElementsByTagName("body")[0];
    this.footerElem = document.getElementsByClassName("footer-content")[0];
    this.bodyElem.classList.add(this.bodyClass);
    this.partData["domainId"] = this.domainId;
    this.partData["countryId"] = this.countryId;
    this.partData["userId"] = this.userId;

    let apiInfo = {
      apiKey: Constant.ApiKey,
      userId: this.userId,
      domainId: this.domainId,
      countryId: this.countryId,
      limit: "20",
      offset: "0",
    };

    this.apiData = apiInfo;
    let authFlag =
      (this.domainId == "undefined" || this.domainId == undefined) &&
      (this.userId == "undefined" || this.userId == undefined)
        ? false
        : true;
    if (authFlag) {
      this.headerData = {
        access: this.pageAccess,
        profile: true,
        welcomeProfile: true,
        search: true,
      };

      this.sidebarActiveClass = {
        page: "landing-page",
        menu: "workstreams-page",
        pageInfo: pageInfo.workstreamPage
      };

      let getModifiedWsId:any = localStorage.getItem('workstreamModifiedId');
      if(getModifiedWsId != null) {
        //this.workstreamId = getModifiedWsId;
        //this.currentContentTypeId = getModifiedWsId;
        //localStorage.setItem('landing-page-workstream', getModifiedWsId);
      }

      //this.getHeadMenuLists();

      var menuListloaded = localStorage.getItem("wscontentTypeValues");
      //console.log(menuListloaded+'--------storage');
      var menuListloadedArr = JSON.parse(menuListloaded);
      console.log(menuListloadedArr);
      if(this.CBADomian && menuListloadedArr[0].contentTypeId == '2'){
        localStorage.setItem('threadSubTypeData',JSON.stringify(menuListloadedArr[0].threadSubTypeData));
      }
      let rms = 0;
      let slugIndex, slug;
      for (let menu of menuListloadedArr) {
        if (menu.contentTypeId) {
          let urlpathreplace = menu.urlPath;
          let urlActivePathreplace = menu.urlActivePath;
          let submenuimageClass = menu.submenuimageClass;
          let urlpth = urlpathreplace.replace(".png", ".svg");
          let urlActivePath = urlActivePathreplace.replace(".png", ".svg");
          if (menu.contentTypeId != 20 && menu.contentTypeId != 23) {
            rms = rms + 1;
            if (this.currentContentTypeId == 0) {
              if (menu.contentTypeId) {
                this.currentContentTypeId = menu.contentTypeId;
              }
            }

            slugIndex = pageTitle.findIndex(option => option.name == menu.name);
            slug = (slugIndex >= 0) ? pageTitle[slugIndex].slug : '';

            this.getcontentTypesArr.push({
              contentTypeId: menu.contentTypeId,
              name: menu.name,
              slug: slug,
              urlPath: urlpth,
              urlActivePath: urlActivePath,
              isNew: menu.isNew,
              catCount: menu.catCount,
              submenuimageClass: submenuimageClass,
              //disabled: true,
              disabled: false,
              tabAction: menu.tabAction,
              tabComponent: menu.tabComponent,
              tabCount: menu.tabCount,
              tabshow: menu.tabshow,
              workstreamId: menu.workstreamId
            });
          }
          console.log(this.getcontentTypesArr, this.currentContentTypeId)
        }

        if (this.currentContentTypeId == 2) {
          this.setCountReset(
            this.currentContentTypeId,
            menu.Catcount,
            menu.isNew
          );           
        }
      }

      if (this.currentContentTypeId != 2) {
        //this.currentContentTypeId = menuListloadedArr[0].contentTypeId;
        let pushitem : InputChat = { id:menuListloadedArr[0].workstreamId,name:menuListloadedArr[0].name,chatType:ChatType.Workstream,profileImg:'',contentType:menuListloadedArr};
        this.RealoadChatPageData(pushitem);
      }
    } else {
      this.router.navigate(["/forbidden"]);
    }
  }

  applySearch(action, val) {}

  getDocumentList(Id, type = "") {
    this.currentContentTypeId = Id;
    let groupsData = [];
    this.docDetail = [];
    if (this.workstreamId) {
      groupsData.push(this.workstreamId);
    }

    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }

    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.docData.action = this.pageAccess;
    this.docData["filterOptions"] = filterOptions;

    setTimeout(() => {
      if (type == "ws") {
        this.commonService.emitDocumentWsApiCallData(this.docData);
      } else {
        this.commonService.emitDocumentApiCallData(this.docData);
      }
      console.log(6546, this.docData)
      //this.commonService.emitDocumentApiCallData(this.docData);
    }, 50);
  }

  RealoadChatPageData(item: any) {
    //this.currentContentTypeId=0;
    this.tabCount = 0;
    console.log(this.tabCount)
    let catisNew=false;
    let cat_catisNew=0;

    this.workstreamId = item.id;
    let wscheck = 0;
    this.getcontentTypesArr = [];
    console.log(item.contentType);
    this.outputContentTypedata = item.contentType;
    let rms = 0;
    for (let menu of item.contentType) {
      if (menu.contentTypeId) {
        let urlpathreplace = menu.urlPath;
        let urlActivePathreplace = menu.urlActivePath;
        let submenuimageClass = menu.submenuimageClass;
        let urlpth = urlpathreplace.replace(".png", ".svg");
        let urlActivePath = urlActivePathreplace.replace(".png", ".svg");
        if (menu.contentTypeId != 20 && menu.contentTypeId != 23) {
          rms = rms + 1;
          if (rms == 1) {
            if (this.currentContentTypeId == 0) {
              this.currentContentTypeId = menu.contentTypeId;
              catisNew=menu.isNew;
              cat_catisNew=menu.catCount;
              
            }
            else
            {

            }
          }

          this.currentContentTypeId = (this.currentContentTypeId == 1 && item.contentType.length == 1) ? this.currentContentTypeId :  item.contentType[0].contentTypeId;

          console.log(this.currentContentTypeId);
          let slugIndex = pageTitle.findIndex(option => option.name == menu.name);
          let slug = (slugIndex >= 0) ? pageTitle[slugIndex].slug : '';
          this.getcontentTypesArr.push({
            contentTypeId: menu.contentTypeId,
            name: menu.name,
            slug: slug,
            urlPath: urlpth,
            isNew: menu.isNew,
            catCount: menu.catCount,
            urlActivePath: urlActivePath,
            submenuimageClass: submenuimageClass,
            disabled: false,
            tabAction: menu.tabAction,
            tabComponent: menu.tabComponent,
            tabCount: menu.tabCount,
            tabshow: menu.tabshow,
            workstreamId: menu.workstreamId
          });
          if (this.currentContentTypeId == menu.contentTypeId) {
            //this.currentContentTypeId=0;
            wscheck = 1;
            this.currentContentTypeId = menu.contentTypeId;
            catisNew=menu.isNew;
            cat_catisNew=menu.catCount;
            //this.setCountReset(this.currentContentTypeId,menu.catCount,menu.isNew);
          }
        }
      }
    }
    if (!wscheck) {
      this.currentContentTypeId = this.outputContentTypedata[0].contentTypeId;
      catisNew=this.outputContentTypedata[0].isNew;
      cat_catisNew=this.outputContentTypedata[0].catCount;
    }
    this.workstreamId = item.id;
    item.pageInfo = pageInfo.workstreamPage;
    this.outputContentFromLeftMenu = item;
    console.log(this.currentContentTypeId);
    this.setCountReset(this.currentContentTypeId, cat_catisNew, catisNew);
    switch (this.currentContentTypeId) {
      case 2:
      case 24:
        this.commonService.emitWorkstreamReceived(item);
      case 11:
        this.workstreamId = item.id;
        this.getPartList("ws");
        break;
      case 6:
        this.workstreamId = item.id;
        this.getGTSList("ws");
        break;
      case 4:
        this.workstreamId = item.id;
        console.log(item)
        this.initDoc(this.currentContentTypeId, "ws");
        break;
      case 7:
        this.workstreamId = item.id;
        this.getKAList("ws");
        break;
      case 28:
        this.workstreamId = item.id;
        this.getKBList("ws");
        break;
      default:
        this.commonService.emitMessageReceived(item);
        break;
    }
  }

  setCountReset(Id, Catcount, catNew) {


    console.log(this.getcontentTypesArr);

    let getcontentAvail = [];
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let CatcountNew = 0;
    if (catNew == true) {
      CatcountNew = Catcount;
    }
    getcontentAvail.push({
      contentTypeId: Id,
      workstreamId: this.workstreamId,
      count: CatcountNew,
    });
    let totalCounts=0;
    setTimeout(() => {
      for (var iar in this.getcontentTypesArr) {
        if(this.getcontentTypesArr[iar].isNew==true)
        {
          totalCounts=totalCounts+this.getcontentTypesArr[iar].catCount;
        }
        
        if (this.getcontentTypesArr[iar].contentTypeId == Id) {
          //this.workstreamArr[iar].removeCount=true;
          if (this.getcontentTypesArr[iar].catCount) {
            this.getcontentTypesArr[iar].catCount =
              this.getcontentTypesArr[iar].catCount - CatcountNew;
              totalCounts=totalCounts-CatcountNew;
          }

          /*
          if(!this.totalNewWorkstreamMessage)
       {
        this.workstreamArr[iar].removeCount=true;
       }
       */
        }
      }
      /*getcontentAvail.push({
        contentTypeId: Id,
        workstreamId: this.workstreamId,
        count: totalCounts,
      });
      */
      this.commonService.emitOnLeftSideMenuBarSubject(getcontentAvail);
    }, 3000);
  }
  taponContent(Id, Catcount, catNew, content) {
    if(content.disabled) {
      return false;
    }
    let tabCount = content.tabCount;
    tabCount += 1;
    this.getcontentTypesArr.forEach((item) => {
      //item.disabled = (item.tabAction && Id == 11 && tabCount == 1) ? true : item.disabled;
    });
    //this.assignFun(Id)
    //console.log(content)
    
    this.tabCount = tabCount;
    content.tabCount = tabCount;
    this.setCountReset(Id, Catcount, catNew);
    // this.currentContentTypeId = Id;
    console.log(Id);
    //if (Id != 4 && tabCount == 0) {
    //if (Id != 4) {
      let action = "unsubscribe";
      this.docData.action = action;
      this.commonService.emitDocumentWsApiCallData(this.docData);
      this.partData.action = action;
      this.commonService.emitPartListWsData(this.partData);
      this.commonService.emitSibListWsData(this.partData);
      this.emptyFlag = (Id == 4) ? true : false;
      console.log(localStorage.getItem('wsDocInfoCollapse'))
    //} else {
      //this.emptyFlag = true;
    //}

    //if(this.currentContentTypeId != Id && tabCount > 0) {
    if(this.currentContentTypeId != Id && tabCount >= 0) {
      let data = {
        action: 'side-menu',
        access: content.name
      }
      //this.commonService.emitMessageLayoutrefresh(data);
    }

    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let aurl = "";
    let wsId = [this.workstreamId];
    let platformId = localStorage.getItem("platformId");
    if (Id == 1) {
      this.SetChatSessionforRedirect(this.workstreamId, ChatType.Workstream);
      aurl = "chat-page";
      // var aurl = '/workstream-chats';
      //window.open(aurl, '_blank');
    } else if (Id == 2 || Id == 24) {
      if (this.currentContentTypeId != Id) {
        // alert(this.outputContentFromLeftMenu);
      } else {
        localStorage.setItem("workstreamNav", "1");
        localStorage.setItem("landing-ws", JSON.stringify(wsId));
        aurl = "threads";
        // window.open(aurl, '_blank');
      }
      this.currentContentTypeId = Id;
      this.tapfromheader = true;
    } else if (platformId == "2") {
      if (Id == 7) {
        //this is for gts
        aurl = "/mis/home/" + this.domainId + "/" + this.userId + "/2";
        //var aurl = '/mis/probing-questions';
        // window.open(aurl, '_blank');
      }
      if (Id == 8) {
        aurl = "/knowledgearticles";
        // window.open(aurl, '_blank');
      } else if (Id == 6) {
        if (this.currentContentTypeId != Id) {
          this.getGTSList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "gts";
          //window.open(aurl, '_blank');
        }
        //aurl = "/mis/home/" + this.domainId + "/" + this.userId + "/4";

        //var aurl = '/mis/';
        // window.open(aurl, '_blank');
        this.currentContentTypeId = Id;
      } else if (Id == 11) {
        if (this.currentContentTypeId != Id) {
          this.partData['contentTypeId'] = Id;
          this.getPartList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "parts";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 16) {
        if (this.currentContentTypeId != Id) {
          this.getSibList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "sib";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 28) {
        if (this.currentContentTypeId != Id) {
          this.bodyElem.classList.add(this.bodyClass1);
          this.getKBList();
        } else {         
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "knowledge-base";
        }
        this.currentContentTypeId = Id;
      }else if (Id == 4) {
        let navFlag = false;

        if (platformId == "2") {
          if (this.currentContentTypeId != Id) {
            this.initDoc(Id);
          } else {
            navFlag = true;
          }
        } else {
          navFlag = true;
        }
        if (navFlag) {
          aurl = "documents";
          localStorage.removeItem('wsDocNav');
          console.log(this.workstreamId);
          let wsId = [this.workstreamId];
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
        }
      }
    } else if (platformId != "2") { 
      if (Id == 7 && platformId != "2") {
        if (this.currentContentTypeId != Id) {
          this.getKAList();
        } else {
          let wsId = [this.workstreamId];
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "knowledgearticles";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 6) { 
        if (this.currentContentTypeId != Id) {
          this.getGTSList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "gts";
          //window.open(aurl, '_blank');
        }
        //aurl = "/mis/home/" + this.domainId + "/" + this.userId + "/4";

        //var aurl = '/mis/';
        // window.open(aurl, '_blank');
        this.currentContentTypeId = Id;
      } else if (Id == 11) {
        if (this.currentContentTypeId != Id) {
          this.partData['contentTypeId'] = Id;
          this.getPartList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "parts";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 16) {
        if (this.currentContentTypeId != Id) {
          this.getSibList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "sib";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 28) {
        if (this.currentContentTypeId != Id) {
          this.bodyElem.classList.add(this.bodyClass1);
          this.getKBList();
        } else {
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));
          aurl = "knowledge-base";
        }
        this.currentContentTypeId = Id;
      } else if (Id == 4) {
        let navFlag = true;

        if (this.currentContentTypeId != Id) {
          this.initDoc(Id);
          navFlag = false;
        }
        if (navFlag) {
          aurl = "documents";
          localStorage.removeItem('wsDocNav');
          console.log(this.workstreamId);
          let wsId = [this.workstreamId];
          localStorage.setItem("workstreamNav", "1");
          localStorage.setItem("landing-ws", JSON.stringify(wsId));

          if (this.domainId || this.teamSystem) {
            if (this.teamSystem) {
              window.open(aurl, IsOpenNewTab.teamOpenNewTab);
              aurl = "";
            } else {
              //window.open(aurl, IsOpenNewTab.openNewTab);
            }
          } else {
            //  window.open(aurl, '_blank');
          }
        }
      }
    } else {
      $(".img-contenttype").removeClass("active");
      $(".border-contenttype").removeClass("active");

      this.currentContentTypeId = Id;
      $(".img-contenttype" + Id + "").addClass("active");
      // $('.img-contenttype'+Id+'').attr('src','assets/images/workstreams-page/thread-w-active.svg');
      $(".border-contenttype" + Id + "").addClass("active");
    }

    // console.log(Id);
    if (aurl) {
      console.log(aurl)
      //let filter;
      if(aurl == 'threads' || aurl == 'parts' || aurl == 'documents' || aurl == 'knowledgearticles' || aurl == 'knowledge-base' || aurl == 'sib' || aurl == 'gts') {
        //filter = JSON.parse(localStorage.getItem(filterNames.thread));
        let filter;
        switch (aurl) {
          case 'threads':
            filter = JSON.parse(localStorage.getItem(filterNames.thread));
            break;
          case 'parts':
            filter = JSON.parse(localStorage.getItem(filterNames.part));
            break;
          case 'documents':
            filter = JSON.parse(localStorage.getItem(filterNames.document));
            break;
          case 'knowledgearticles':
            filter = JSON.parse(localStorage.getItem(filterNames.knowledgeArticle));
            break;
          case 'knowledge-base':
            filter = JSON.parse(localStorage.getItem(filterNames.knowledgeBase));
            break;
          case 'gts':
            filter = JSON.parse(localStorage.getItem(filterNames.gts));
            break;
          case 'sib':
            filter = JSON.parse(localStorage.getItem(filterNames.sib));
            break;  
        }
        window.open(aurl, "_blank" + aurl);
        /*setTimeout(() => {
          console.log(filter)
          let loadFlag = false;
          //console.log(this.workstreamId, filter, filter.hasOwnProperty('workstream'), filter.workstream)
          if(filter.hasOwnProperty('workstream')) {
            let windex = filter.workstream.findIndex(option => option === this.workstreamId);
            console.log(windex)
            loadFlag = (windex >= 0) ? false : true;
          }
          console.log(loadFlag)
          if(loadFlag) {
            //window.open(aurl, IsOpenNewTab.teamOpenNewTab);
            console.log(aurl)
            let routeLoadIndex = pageTitle.findIndex(option => option.slug == aurl);
            if(routeLoadIndex >= 0) {
              let routeLoadText = pageTitle[routeLoadIndex].routerText;
              localStorage.setItem(routeLoadText, 'true');
            }
            //this.router.navigate([aurl]);
          } else {
            //this.router.navigate([aurl]);
          }
          window.open(aurl, "_blank" + aurl);
          //this.router.navigate([aurl]);  
        }, 500);*/
        
      } else {
        window.open(aurl, "_blank" + aurl);
      }
      
      // newWindow.focus()
    }
  }

  assignFun(contentTypeId) {
    console.log(contentTypeId)
    if(contentTypeId!=1) {
      this.isOn1=true;
      this.isOn2=true;
      this.isOn3=true;
      this.isOn4=true;
      this.isOn5=true;
      this.isOn6=true;
      if(contentTypeId==2) {
        this.isOn1=false;
      }
      if(contentTypeId==4) {
        this.isOn2=false;
      }
      if(contentTypeId==7) {
        this.isOn3=false;
      }
      if(contentTypeId==11) {
        this.isOn4=false;
      }
      if(contentTypeId==6) {
        this.isOn5=false;
      }
      if(contentTypeId==16) {
        this.isOn6=false;
      }
    }
    /* this.getcontentTypesArr.forEach((item) => {
      console.log(item)
      if(contentTypeId!=1) {
        item.tabShow = (contentTypeId == item.contentTypeId) ? true : false;
      }
    }); */
  }

  // Get Knowledge Article List
  getKAList(type = "") {
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    //if(this.tabCount == 1) {
      setTimeout(() => {
        this.commonService.emitKnowledgeListData(this.partData);
      }, 50);
    //}
  }
  
  // Get Part List
  getPartList(type = "") {
    console.log(type, this.currentContentTypeId);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    console.log('this.workstreamId: ', this.workstreamId);
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData.tabCount = this.tabCount;
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    setTimeout(() => {
      if (type == "ws") {
        this.commonService.emitPartListWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitPartListData(this.partData);
        //}
      }
    }, 50);
  }

  // Get Part List
  getSibList(type = "") {
    console.log(type);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    setTimeout(() => {
      if (type == "ws") {
        this.commonService.emitSibListWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitSibListData(this.partData);
        //}
      }
    }, 50);
  }

  // Get Part List
  getKBList(type = "") {    
    console.log(type);
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    //if(this.tabCount == 1) {
      setTimeout(() => {
        if (type == "ws") {
          this.commonService.emiKnowledgeBaseListWsData(this.partData);
        } else {
          this.commonService.emitKnowledgeBaseListData(this.partData);
        }
      }, 50);
    //}
  }
  
  // Get GTS  List
  getGTSList(type = "") {
    if (!this.workstreamId) {
      this.workstreamId = localStorage.getItem("landing-page-workstream");
    }
    let filterOptions: any = {
      workstream: [this.workstreamId.toString()],
    };
    this.partData["filterOptions"] = filterOptions;
    this.partData.action = "get";
    
    setTimeout(() => {
      console.error("---this.partsData-----", this.partData);
      if (type == "ws") {
        this.commonService.emitGTSLIstWsData(this.partData);
      } else {
        //if(this.tabCount == 1) {
          this.commonService.emitGTSLIstData(this.partData);
        //}
      }
    }, 50);
  }
  
  // Toggle Action
  toggleAction(data) {
    console.log(data);
    let flag = data.action;
    let access = data.access;
    let toggleActionFlag = false;
    switch (access) {
      case "info":
        let collapseFlag: any = true;
        this.collapseFlag = collapseFlag;
        $('.center-middle-width-container').addClass('adding-width-10');
        localStorage.setItem("wsDocInfoCollapse", collapseFlag);
        this.docDetail = data.docDetail;
        this.emptyFlag = false;
        this.rightPanel = !flag;
        this.docData.accessFrom = "documents";
        this.docData.action = "toggle";
        this.docData.expandFlag = !flag;
        this.commonService.emitDocumentListData(this.docData);
        break;
      case "empty":
        this.docDetail = [];
        this.emptyFlag = true;
        this.rightPanel = !flag;
        break;
      default:
        toggleActionFlag = true;
        this.docDetail = [];
        break;
    }
    if (toggleActionFlag) {
      this.docDetail = data.docDetail;
      this.toggleInfo(flag);
    }
  }

  // Toogle Document Info
  toggleInfo(flag) {
    console.log(flag, this.docDetail, this.docData);
    this.docData.action = "toggle";
    this.docData.expandFlag = !flag;
    this.commonService.emitDocumentListData(this.docData);
    this.commonService.emitMessageLayoutChange(flag);
    setTimeout(() => {
      console.log(this.collapseFlag);
      this.rightPanel = !flag;
      let docInfoData = {
        action: "",
        apiData: [],
        docDetail: this.collapseFlag ? this.docDetail : [],
        loading: this.collapseFlag ? true : false,
        panelFlag: this.rightPanel,
      };
      this.collapseFlag = false;
      $('.center-middle-width-container').removeClass('adding-width-10');
      docInfoData.action = "panel";
      this.commonService.emitDocumentPanelData(docInfoData);
    }, 100);
  }

  // Set Screen Height
  setScreenHeight() {
    let headerHeight =
      document.getElementsByClassName("prob-header")[0].clientHeight;
    let footerHeight =
      document.getElementsByClassName("footer-content")[0].clientHeight;
    console.log(this.bodyHeight, headerHeight, footerHeight);
    this.innerHeight = this.bodyHeight - (headerHeight + footerHeight + 110);
    console.log(this.innerHeight);
  }

  // Emit Document Info
  emitDocInfo(docData) {
    let data = {
      action: "load",
      loading: true,
      dataId: docData.resourceID,
      docData: docData,
    };
    this.commonService.emitDocumentInfoData(data);
  }

  // Initialize Documentation
  initDoc(id, type = "") {
    localStorage.setItem('wsDocNav', "1");
    this.rightPanel = true;
    this.bodyHeight = window.innerHeight;
    this.setScreenHeight();
    this.itemOffset = 0;
    this.docLoading = true;
    if(this.collapseFlag) {
      localStorage.setItem('domainCollapse', 'true');
    }
    this.getDocumentList(id, type);
  }
  SetChatSessionforRedirect(chatgroupid: string, chatType: ChatType) {
    localStorage.setItem(LocalStorageItem.reloadChatGroupId, chatgroupid);
    localStorage.setItem(LocalStorageItem.reloadChatType, chatType);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.bodyElem.classList.remove(this.bodyClass1);
  }
}

export class InputChat{
  id: string;
  name:string;
  chatType:string;
  profileImg:string;
  contentType:Object;
}