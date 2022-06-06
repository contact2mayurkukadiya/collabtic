import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ApiService } from "../api/api.service";

@Injectable({
  providedIn: "root",
})
export class KnowledgeArticleService {
  constructor(private http: HttpClient, private apiUrl: ApiService) {}
  // Get individual Knowledge Article
  getKnowledgeArticlesDetails(data) {
    return this.http.post<any>(this.apiUrl.getKnowledgeArticlesDetails(), data);
  }
  // Delate knowledge article
  deleteKnowledgeArticle(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("domainId", data.domainId)
      .set("countryId", data.countryId)
      .set("userId", data.userId)
      .set("contentTypeId", data.contentType)
      .set("postId", data.postId);
    const body = JSON.stringify(data);

    return this.http.post<any>(this.apiUrl.apiDeleteKnowledgeArticle(), body, {
      params: params,
    });
  }
  // Manage knowledge article Create or Edit
  manageKnowledgeArticle(knowledgeData) {
    return this.http.post<any>(
      this.apiUrl.apiManageKnowledgeType(),
      knowledgeData
    );
  }
  // Like & Pin Actions
  likePinAction(data) {
    const params = new HttpParams()
      .set("apiKey", data.apiKey)
      .set("domainId", data.domainId)
      .set("countryId", data.countryId)
      .set("userId", data.userId)
      .set("threadId", data.threadId)
      .set("postId", data.postId)
      .set("ismain", data.ismain)
      .set("status", data.status)
      .set("type", data.type);
    const body = JSON.stringify(data);

    return this.http.post<any>(
      this.apiUrl.apiLikePinKnowledgeArticleAction(),
      body,
      { params: params }
    );
  }
}
