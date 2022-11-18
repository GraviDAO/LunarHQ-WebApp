import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LunarHqAPIServices {

  constructor(private http: HttpClient) {
  }

  getProfileDetails(): Observable<any> {
    return this.http.get<any>(environment.server + 'profileDetails')
      .pipe(map((result) => {
        return result;
      }));
  }

  getMyLicenses(): Observable<any> {
    return this.http.get<any>(environment.server + 'myLicenses')
      .pipe(map((result) => {
        return result;
      }));
  }

  getMyServers(): Observable<any> {
    return this.http.get<any>(environment.server + 'servers')
      .pipe(map((result) => {
        return result;
      }));
  }

  getAnnouncements(): Observable<any> {
    return this.http.get<any>(environment.server + 'announcements')
      .pipe(map((result) => {
        return result.message;
      }));
  }

  getServerDetails(discordServerId: any): Observable<any> {
    return this.http.get<any>(environment.server + 'server/?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }

  getServerRules(discordServerId: any): Observable<any> {
    return this.http.get<any>(environment.server + 'WAgetRules/?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }

  // Get Polls by discord server id
  getPolls(discordServerId: any) {
    return this.http.get<any>(environment.server + 'WAgetProposals/?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }

  // Get polls created by logged-in User
  getMyPolls() {
    return this.http.get<any>(environment.server + 'getOwnerProposals')
      .pipe(map((result) => {
        return result;
      }));
  }

  //Get list of Active polls
  getActivePolls(discordServerId: any) {
    return this.http.get<any>(environment.server + 'activeProposals')
      .pipe(map((result) => {
        return result;
      }));
  }

  //Get all polls
  getAllPolls() {
    return this.http.get<any>(environment.server + 'WAgetAllProposals')
      .pipe(map((result) => {
        return result;
      }));
  }

  //Get the list of polls, which logged-in user has voted
  getMyParticipatedPolls() {
    return this.http.get<any>(environment.server + 'getParticipantProposals')
      .pipe(map((result) => {
        return result;
      }));
  }

  getRoles(discordServerId: any) {
    return this.http.get<any>(environment.server + 'getRoles/?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }

  getRuleById(discordServerId: any, ruleId: any) {
    return this.http.get<any>(environment.server + 'WAgetRuleById?discordServerId=' + discordServerId + '&ruleId=' + ruleId)
      .pipe(map((result) => {
        return result;
      }));
  }

  getChannels(discordServerId: any) {
    return this.http.get<any>(environment.server + 'getChannels/?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }

  deleteRule(ruleId: any,discordServerId: any) {
    return this.http.delete<any>(environment.server + 'deleteRule/' + ruleId + '?discordServerId=' + discordServerId)
      .pipe(map((result) => {
        return result;
      }));
  }

  //Create a new poll
  createPoll(data: any, discordServerId: any): Observable<any> {
    return this.http.post<any>(environment.server + 'WAcreateProposal/?discordServerId=' + discordServerId, data)
      .pipe(map((result) => {
        return result;
      }));
  }

  //Draft a poll
  draftPoll(data: any, discordServerId: any): Observable<any> {
    return this.http.post<any>(environment.server + 'WAcreateDraftProposal/?discordServerId=' + discordServerId, data)
      .pipe(map((result) => {
        return result;
      }));
  }

  //Create a new Rule
  createRule(data: any): Observable<any> {
    let url = ''
    if (data.id) {
      url = environment.server + (data.id.includes('N-') ? 'WAaddNftRule/?discordServerId=' + data.discordServerId : 'WAaddTokenRule/?discordServerId=' + data.discordServerId);
      if (data.id.includes('N-')) {
        data.nftAddress = data.address;
      } else {
        data.tokenAddress = data.address;
      }
    } else {

      url = environment.server + (data.ruleType === 'NFT' ? 'WAaddNftRule/?discordServerId=' + data.discordServerId : 'WAaddTokenRule/?discordServerId=' + data.discordServerId)
    }
    return this.http.post<any>(url, data)
      .pipe(map((result) => {
        return result;
      }));
  }

  //Star Announcement for the user
  starUnStarAnnouncement(data: any, type: string): Observable<any> {
    let url = environment.server;
    url = url + (type === 'star' ? 'starAnnouncement' : 'unstarAnnouncement');
    // console.log(url, 'url');
    return this.http.put<any>(url, data)
      .pipe(map((result) => {
        return result;
      }));
  }


  //Get Stared Announcement list by the logged-in user
  getStaredAnnouncementList(): Observable<any> {
    return this.http.get<any>(environment.server + 'starredAnnouncements')
      .pipe(map((result) => {
        return result;
      }));
  }

  exportSummary(id: any): Observable<any> {
    return this.http.get<any>(environment.server + 'getProposalSummary/' + id)
      .pipe(map((result) => {
        return result;
      }));
  }


}
