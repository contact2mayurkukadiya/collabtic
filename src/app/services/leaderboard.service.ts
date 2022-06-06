import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApiService } from './api/api.service';
@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  offset: number = 0;
  limit: number = 30;

  startDate = moment().local().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
  endDate = moment().local().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');

  constructor(private http: HttpClient, private apiUrl: ApiService) { }

  getLeaderBoardChartData(leaderBoardData): Observable<any> {
    let params = new HttpParams()
      .set('apiKey', leaderBoardData.apiKey)
      .set('userId', leaderBoardData.userId)
      .set('startDate', leaderBoardData.startDate)
      .set('endDate', leaderBoardData.endDate)
      .set('groupId', leaderBoardData.groupId)
      .set('domainId', leaderBoardData.domainId)
      .set('offset', leaderBoardData.offset)
    if (leaderBoardData.limit) {
      params = params.append('limit', leaderBoardData.limit)
    }
    const body = JSON.stringify(leaderBoardData);
    return this.http.post<any>(this.apiUrl.apiLeaderBoard(), body, { 'params': params })
  }
}
