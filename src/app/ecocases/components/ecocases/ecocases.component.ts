import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EcocasesService } from '../../services/ecocases.service';
import { Router } from '@angular/router';
import { async } from 'rxjs/scheduler/async';
import { map } from 'rxjs/operators';
import { UserService } from '../../../auth/services/user.service';


@Component({
  selector: 'app-ecocases',
  templateUrl: './ecocases.component.html',
  styleUrls: ['./ecocases.component.scss']
})

export class EcocasesComponent implements OnInit {
  public ecocases: any[];
  public esm_titles: any;
  public username: string;
  public ecocasesSinceDate: Date | any;
  public spinnerStyles: any;
  public filters$: Observable<any>;
  public filters: {
    esms: any[],
    categories: any[]
  };
  public count_results: {
    esms: any,
    categories: any[]
  };

  constructor(
    private es: EcocasesService,
    private us: UserService,
    private router: Router
  ) { }

  ngOnInit() {

    // custom styles to fit loader to card container
    this.spinnerStyles = {
      margin: '-24px -24px 16px -24px'
    };
    this.filters = {
      esms: [],
      categories: []
    };
    this.username = this.us.getOrSetUserName();
    /*if (this.userName != 'unregistered user') {
      this.es.getFilterCriteria()
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
            this.userName = this.us.getOrSetUserName();
            if (this.userName != 'unregistered user') {}
            this.es.getEcocases(this.filters, this.userName)
              .pipe(
                map(res => {
                  this.ecocases = res['data'].ecocases;
                  this.filters = this.es.updateFilters(this.filters, res['data'].count_results);
                  console.log('res: ', res);
                  console.log('filters', this.filters);
                }))
              .subscribe( data => {
                console.log('data', data)
              })
          }))
      .subscribe();
    }*/
    // this.filters = this.es.filters;
  }

  getEcocaseDetails(ecocase: any): void {
    console.log('ecocase to detail: ', ecocase);
    ecocase.detailsLoading = true;
    const title = encodeURIComponent(ecocase.title.toLowerCase().replace(/ /g, '-'));
    console.log('ecocase id: ', ecocase._id);
    console.log('ecocase title: ', ecocase.title);
    this.router.navigate([`ecocases/detail/${ecocase.id}`]);
  }

  createEcocase(): void {
    console.log('to create new ecocase: ');
    this.router.navigate(['ecocases/new/']);
  }

  applyFilters(filters: any): void {
    console.log('esm_titles: ', this.es.filters);
    console.log('filters: ', filters);
    this.es.appliedFiltersEcocases(filters)
      .pipe(
        map(res => {
          console.log('appliedFiltersEcocases: ', res['data'].ecocases);
          this.ecocases = res['data'].ecocases;
          this.filters = this.es.updateFilters(this.filters, res['data'].count_results);
        }))
      .subscribe();
  }
}
