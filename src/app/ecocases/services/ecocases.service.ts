import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../auth/services/user.service';
import { HelpersService } from '../../shared/services/helpers.service';
import * as moment from 'moment';
import { config } from '../../../config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { first, map, mergeMap} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const headers = new HttpHeaders();
headers.append('Content-Type', 'application/json');
headers.append('X-CSRFToken', localStorage.getItem('csrftoken'));

const httpOptions = {
  headers: headers,
  withCredentials: true
}

@Injectable()
export class EcocasesService {
  public filters = {
    'esms': [],
    'categories': []
  };
  public updatedFilters = {
    'esms': [],
    'categories': []
  };
  public updatedFiltersByESM = {
    'esms': [],
    'categories': []
  };
  public ctgsFilters: any[];
  public taggedEcocases: any[];
  public untaggedEcocases: any[];
  public ecocasesByESM: any[];
  public ecocases: any[];

  constructor(
    private http: HttpClient,
    private us: UserService,
    private hs: HelpersService
  ) { }

  ecocasesFromDate(format?: string): Date | string {
    const daysAgo = 30;
    const date = moment().subtract(daysAgo, 'days');

    if (format) {
      return date.format(format);
    }
    return date.toDate();
  }

  getEcocases(filters: any): any {
    let url = '';
    if (filters.esms == undefined)
      url = `${config.api}/ecocases/`;
    else {
      const params = [
        `esms=${filters.esms.map(esm => (esm.checked) ? esm.title : '').join(',')}`,
        `categories=${filters.categories.map(ctg => (ctg.checked) ? ctg.title : '').join(',')}`,
        `username=${this.us.getOrSetUserName()}`
      ].join('&');
      url = `${config.api}/ecocases/search/?${params}`;
    }
    console.log('ecocases.service getTaggedEcocases ===> url: ', url);
    return this.http.get(url);
  }

  getTaggedEcocases(filters: any, username: string): any {
    let url = '';
    if (filters.esms == undefined)
      url = `${config.api}/ecocases/`;
    else {
        const params = [
          `esms=${filters.esms.map(esm => (esm.checked) ? esm.title : '').join(',')}`,
          `categories=${filters.categories.map(ctg => (ctg.checked) ? ctg.title : '').join(',')}`
        ].join('&');
      url = `${config.api}/ecocases/${username}/tagged/search/?${params}`;
    }
    console.log('ecocases.service getTaggedEcocases ===> url: ', url);
    return this.http.get(url)
      .pipe(
        map(res => {
          this.taggedEcocases = res['data'].ecocases;
          this.updatedFilters = this.updateFilters(filters, res['data'].count_results);
          console.log('res: ', res);
          console.log('filters', this.filters);
        })
      );
  }

  getUntaggedEcocases(ctgsFilters: any, username: string): any {
    const params = [
      `categories=${ctgsFilters.map(ctg => (ctg.checked) ? ctg.title : '').join(',')}`
    ].join('&');
    const url = `${config.api}/ecocases/${username}/untagged/search/?${params}`;
    console.log('ecocases.service getUntaggedEcocases ===> url: ', url);
    return this.http.get(url)
      .pipe(
        map(res => {
          this.untaggedEcocases = res['data']['untagged_ecocases'];
          console.log('res: ', res);
        }));
  }

  getEcocasesbyESM(filters: any): any {
    let url = '';
    const params = [
      `esms=${filters.esms.map(esm => (esm.checked) ? esm.title : '').join(',')}`,
      `categories=${filters.categories.map(ctg => (ctg.checked) ? ctg.title : '').join(',')}`
    ].join('&');
    url = `${config.api}/esms/?{esmId}/ecocases/?${params}`;
    console.log('ecocases.service getEcocasesbyESM ===> url: ', url);
    return this.http.get(url)
      .pipe(
        map(res => {
          this.ecocasesByESM = res['data'].ecocases;
          this.updatedFiltersByESM = this.updateFilters(filters, res['data'].count_results);
        })
      );
  }

  getESMsByEcocaseId(ecocaseId: string): Observable<any> {
    const params = [
      `user=${this.us.getOrSetUserName()}`,
      `ecocaseId=${ecocaseId}`
    ].join('&');

    console.log('getESMsByEcocaseId, ddddddddddd', params);
    const url = `${config.api}/ecocases/ecocase/${ecocaseId}/esms/?${params}`;
    console.log('urlllll: ', url);
    return this.http.get(`${url}`).pipe(
      map(res => {
        console.log('esmmmmmmmmmmmmmmmm:', res);
      })
    );
  }

  getWeightESMsTaggedEcocase(ecocaseId: string): any {
    const url = `${config.api}/ecocases/ecocase/tagged/${ecocaseId}/esms-weights`;
    console.log('getWeightESMsByEcocase urlllll: ', url);
    return this.http.get(`${url}`);
  }

  appliedFiltersEcocases(filters: any): any {
    console.log('appliedFiltersEcocases, filters: ', filters);
    const params = [
      `esms=${filters.esms.map(esm => (esm.checked) ? esm.title : '').join(',')}`,
      `categories=${filters.categories.map(ctg => (ctg.checked) ? ctg.title : '').join(',')}`
    ].join('&');
    const url = `${config.api}/ecocases/search/?${params}`;
    return this.http.get(url);
  }

  getEcocaseDetails(id: string): Observable<any> {
    const params = [
      `username=${this.us.getOrSetUserName()}`
    ].join('&');
    const url = `${config.api}/ecocases/ecocase/${id}?${params}`;
    console.log('getEcocaseDetails url: ', url);

    return this.http.get(url);
  }

  updateEcocase(ecocase: any, uploadFiles: any[], removedUrls: string[]): any {
    console.log('update ecocase; ', ecocase);
    const url = `${config.api}/ecocases/ecocase/post`;
    return this.http.put(url, { ecocase, uploadFiles, removedUrls }, { withCredentials: true});
  }

  deleteEcocase(ecocase: any): any {
    console.log('delete ecocase; ', ecocase);
    const params = [
      `id=${ecocase.id}`
    ].join('&');
    const url = `${config.api}/ecocases/ecocase/post`;
    return this.http.delete(`${config.api}/ecocases/ecocase/post?${params}`);
  }

  getEcocaseInternalDetails(id: string): Observable<any> {
    const params = [
      `username=${this.us.getOrSetUserName()}`
    ].join('&');
    return this.http.get(`${config.api}/ecocases/ecocase/${id}?${params}`)
      .pipe(first());
  }

  postEcocase(title: string): Observable<any> {
    const url = `${config.api}/ecocases/ecocase/post`;
    // check if user is logged in
    return this.us.user$.pipe(
      first(),
      mergeMap(user => {
        return this.http.post(url, { user, title}, { withCredentials: true});
      })
    );
  }

  rateEcocase(id: string, rating: number): Observable<any> {
    const url = `${config.api}/ecocases/rate`;
    // check if user is logged in
    return this.us.user$.pipe(
      first(),
      mergeMap(user => {
        if (user) {
          return this.http.post(url, { id, rating }, { withCredentials: true });
        }
        return this.postRequest(url, { id, rating });
      }));
  }

  getEcocasesRating(id: string): Observable<any> {
    const url = `${config.api}/ecocases/ecocase/${id}/rating/`;
    return this.postRequest(url, {});
  }

  removeRating(id: string): Observable<any> {
    const params = [
      `u=${this.us.getOrSetUserName()}`,
      `m_id=${id}`
    ].join('&');

    return this.http.delete(`${config.api}/ecocases/rate?${params}`, httpOptions).pipe(
      first(),
      map(res => console.log('removeRating res: ', res))
    );
  }

  getComments(id: string, page: number): Observable<any> {
    const params = [
      `u=${this.us.getOrSetUserName()}`,
      `p=${page}`
    ].join('&');

    return this.http.get(`${config.api}/ecocases/ecocase/${id}/comments/?${params}`)
  }

  getAssociatedESMs(ecocaseId: string): Observable<any> {
    const params = [
      `username=${this.us.getOrSetUserName()}`
    ].join('&');
    return this.http.get(`${config.api}/ecocases/ecocase/${ecocaseId}/esms/summary?${params}`);
  }

  postComment(ecocaseId: string, body: string): Observable<any> {
    const url = `${config.api}/ecocases/comment`;
    // check if user is logged in
    return this.us.user$.pipe(
      first(),
      mergeMap(user => {
        if (user) {
          return this.http.post(url, { ecocaseId, body }, { withCredentials: true });
        }
        return this.postRequest(url, { ecocaseId, body });
      }));
  }

  removeComment(id: string): Observable<any> {
    const params = [
      `u=${this.us.getOrSetUserName()}`,
      `id=${id}`
    ].join('&');

    return this.http.delete(`${config.api}/ecocases/comment?${params}`, httpOptions).pipe(
      first(),
      map(res => console.log('removeComment res :', res))
    );
  }

  getFilterCriteria(): any {
    console.log('at getFilterCriteria');
    const url = `${config.api}/ecocases/filters`;
    const filters = {'esms': [], 'categories': []};
    return this.http.get(`${url}`)
      .pipe(
        map(res => {
          console.log('getFilterCriteria res: ', res);
          this.filters.esms = res['data'].filter_criteria.esms.map(esm => {
            esm.checked = true;
            return esm
          });
          this.filters.categories = res['data'].filter_criteria.categories.map(ctg => {
            ctg.checked = true;
            return ctg;
          });
        }));
  }

  submitEsmevaluations(esmevaluations: any[], ecocaseId: string, nonESM, environGainEval, ecoEffectPotentialEvals, ecoinnovationStatusEval): Observable<any> {
    const username = this.us.getOrSetUserName();
    const url = `${config.api}/ecocases/ecocase/${ecocaseId}/esms/${username}/submit/`;
    console.log('submitEsmevaluations - urllllllll: ', url);
    /*return this.http.post(url, { esmevaluations }, { withCredentials: true });*/
    return this.us.user$.pipe(
      first(),
      mergeMap(user => {
          return this.http.post(url, { esmevaluations, nonESM, environGainEval, ecoEffectPotentialEvals, ecoinnovationStatusEval }, { withCredentials: true });
        }
      ));
  }

  updateFilters(filters, count_results): any {
    filters.esms.forEach(esm => {
      esm.count_results = count_results.by_esms[esm.title];
    });
    filters.categories.forEach(ctg => {
      ctg.count_results = count_results.by_ctgs[ctg.title];
    });
    return filters;
  }

  updateCtgsFilters(ctgsFilters, count_results_by_ctgs): any {
    ctgsFilters.forEach(ctg => {
      ctg.count_results = count_results_by_ctgs[ctg.title];
    });
    return ctgsFilters;
  }

  private getEcocasesSummary(ecocaseIds: string[], tmdbRes: any): Observable<{tmdb: any, api: any}> {
    return Observable.combineLatest(
        of(tmdbRes),
        this.http.get(`${config.api}/ecocases/get-all?ids=${ecocaseIds.join(',')}`).pipe(map(api => console.log('api ', api))),
        (tmdb, api) => {
          return { tmdb, api };
        }
      );
  }

  private postRequest(url: string, data: any): Observable<any> {
    const username = this.us.getOrSetUserName();
    return this.http.post(url, Object.assign({ username }, data), httpOptions);
  }
}
