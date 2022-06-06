import {
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef,
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class LandingpageService {
  private isLoggedIn = true;
  constructor(
    private cfr: ComponentFactoryResolver,
    private http: HttpClient,
    private apiUrl: ApiService
  ) {}

  getUserProfile(userData): Observable<any> {
    const params = new HttpParams()
      .set("api_key", userData.api_key)
      .set("user_id", userData.user_id)
      .set("domain_id", userData.domain_id);
    const body = JSON.stringify(userData);

    return this.http.post<any>(this.apiUrl.apiUserProfile(), body, {
      params: params,
    });
  }

  GetLandingpageOptions(userData) {
    return this.http.post<any>(
      this.apiUrl.apiGetLandingpageOptions(),
      userData
    );
  }
  ManualsAndAnnouncementList(userData) {
    return this.http.post<any>(
      this.apiUrl.apiManualsAndAnnouncementList(),
      userData
    );
  }

  apiclearsearchhistory(userData) {
    return this.http.post<any>(this.apiUrl.apiclearsearchhistory(), userData);
  }

  getescalatethreadsAPI(userData) {
    return this.http.post<any>(
      this.apiUrl.apigetescalatethreadsAPI(),
      userData
    );
  }

  GetEscalationsByLevels(userData) {
    return this.http.post<any>(
      this.apiUrl.apiGetEscalationsByLevels(),
      userData
    );
  }

  getusersearchHistory(userData) {
    return this.http.post<any>(this.apiUrl.apigetusersearchHistory(), userData);
  }

  getAlldomainUsers(userData) {
    return this.http.post<any>(this.apiUrl.apiGetAlldomainUsers(), userData);
  }

  readandDeleteNotification(data) {
    return this.http.post<any>(this.apiUrl.readandDeleteNotification(), data);
  }

  getThreadCharts(userData) {
    return this.http.post<any>(this.apiUrl.apiThreadCharts(), userData);
  }
  getKnowledgeArticleList(userData) {
    return this.http.post<any>(this.apiUrl.getAllKnowledgeArticle(), userData);
  }
  GetRecentViews(userData) {
    return this.http.post<any>(this.apiUrl.apiGetRecentViews(), userData);
  }
  Getusernotifications(userData) {
    return this.http.post<any>(this.apiUrl.apiusernotifications(), userData);
  }

  Resetusernotifications(userData) {
    return this.http.post<any>(
      this.apiUrl.apiresetusernotifications(),
      userData
    );
  }

  ReadandDeleteNotification(userData) {
    return this.http.post<any>(
      this.apiUrl.apiReadandDeleteNotification(),
      userData
    );
  }

  Dismissallnotifications(userData) {
    return this.http.post<any>(
      this.apiUrl.apiDismissallnotifications(),
      userData
    );
  }
  Registerdevicetoken(userData) {
    return this.http.post<any>(this.apiUrl.apiregisterdevicetoken(), userData);
  }
  ActiveDevicesOnPageWeb(userData) {
    return this.http.post<any>(
      this.apiUrl.apiActiveDevicesOnPageWeb(),
      userData
    );
  }

  threadspageAPI(userData) {
    return this.http.post<any>(
      this.apiUrl.apithreadwithWorkstreams(),
      userData
    );
  }

  EnhancedSearchAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiEnhancedSearchAPI(), userData);
  }
  // add manager
  getManagerList(mData) {
    return this.http.post<any>(this.apiUrl.apiGetManagerList(), mData);
  }

  // update manager
  updateManagerList(mData) {
    return this.http.post<any>(this.apiUrl.apiUpdateManagerList(), mData);
  }
  //report widgets
  getReportsAttr(mData) {
    return this.http.post<any>(this.apiUrl.apiLandingreports(), mData);
  }

  /*
  async loadComponent(vcr: ViewContainerRef, isLoggedIn: boolean) {
    const { AnnouncementWidgetsComponent } = await import('../../components/common/announcement-widgets/announcement-widgets.component');

    //const { UserCardComponent } = await import('./user-card/user-card.component');

    vcr.clear();

    let component : any = isLoggedIn ? AnnouncementWidgetsComponent;
   
    return vcr.createComponent(
      this.cfr.resolveComponentFactory(component))    
}
*/

  // updatehelp content
  updateTooltipconfigWeb(mData) {
    return this.http.post<any>(this.apiUrl.apitooltipconfigWeb(), mData);
  }

  //
  updateConfigSettings(mData) {
    return this.http.post<any>(this.apiUrl.apiUpdateConfigSettings(), mData);
  }

  serviceListAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiServiceList(), userData);
  }

  shopListAPI(userData) {
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("countryId", userData.countryId)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId);
    return this.http.get<any>(this.apiUrl.apiShopList(), {
      params: params,
    });
  }

  statusListAPI(userData) {
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("countryId", userData.countryId)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId);
    return this.http.get<any>(this.apiUrl.apiStatusList(), {
      params: params,
    });
  }

  /* technicianAPI(userData) {
    return this.http.post<any>(this.apiUrl.apoTechnicianList(), userData);
  } */

  manageServiceAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiManageService(), userData);
  }

  serviceCategory(userData) {
    const params = new HttpParams()
      .set("apikey", userData.apikey)
      .set("domainId", userData.domainId)
      .set("userId", userData.userId);
    return this.http.get<any>(this.apiUrl.apiServiceCategory(), {
      params: params,
    });
  }

  vehicleInfoByVIN(userData) {
    return this.http.post<any>(this.apiUrl.apiVehiclebyVIN(), userData);
  }

  getProductMakeListsAPI(userData) {
    return this.http.post<any>(this.apiUrl.apiGetProductmakeList(), userData);
  }

  getMakeModelsList(userData) {
    const params = new HttpParams()
      .set("apiKey", userData.apiKey)
      .set("domainId", String(userData.domainId))
      .set("countryId", userData.countryId)
      .set("userId", userData.userId)
      .set("displayOrder", userData.displayOrder)
      .set("type", userData.type)
      .set("makeName", userData.makeName)
      .set("offset", userData.offset)
      .set("limit", userData.limit);
    return this.http.post<any>(this.apiUrl.apiModels(), "", {
      params: params,
    });
  }
}
