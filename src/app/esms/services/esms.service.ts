import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HelpersService } from '../../shared/services/helpers.service';
import { UserService } from '../../auth/services/user.service';
import { config } from '../../../config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

let headers = new HttpHeaders();
// headers.append('Content-Type', 'application/json');
headers.append('Access-Control-Allow-Origin', 'http:localhost:4200');

const httpOptions = {
  headers: headers,
  withCredentials: true
};

@Injectable()
export class EsmsService {
  public esms: any[];
  constructor(
    private http: HttpClient,
    private us: UserService,
    private hs: HelpersService
  ) { }

  getESMs(): any {
    console.log('at esms.service ===> get ESM');
    const url = `${config.api}/esms`;
    console.log('getESMs urlllll: ', url);
    return this.http.get(`${url}`, httpOptions)
      .pipe(
        map(res => {
          console.log('It works:', res);
          this.esms = res['data'].esms;
        })
      );
  }

  getEcocasesByESM(esmId): Observable<any> {
    const url = `${config.api}/esms/${esmId}/ecocases`;
    console.log(url);
    return this.http.get(`${url}`);
  }

  getTaggedEcocasesByESM(esmId): Observable<any> {
    const url = `${config.api}/esms/${esmId}/taggedecocases`;
    console.log(url);
    return this.http.get(`${url}`);
  }

  getESMById(esmId): any {
    const url = `${config.api}/esms/${esmId}`;
    return this.http.get(`${url}`);
  }
}
