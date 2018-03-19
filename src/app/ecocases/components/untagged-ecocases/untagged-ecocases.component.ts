import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EcocasesService } from '../../services/ecocases.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-untagged-ecocases',
  templateUrl: './untagged-ecocases.component.html',
  styleUrls: ['./untagged-ecocases.component.scss']
})
export class UntaggedEcocasesComponent implements OnInit {
  @Input() username: string;
  public ecocases: any[];
  public esm_titles: any;
  public ecocasesSinceDate: Date | any;
  public spinnerStyles: any;
  public filters$: Observable<any>;
  public filters: {
    esms: any[],
    categories: any[]
  };
  public ctgsFilters: any[];
  public count_results: {
    esms: any,
    categories: any[]
  };

  constructor(
    private es: EcocasesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.spinnerStyles = {
      margin: '-24px -24px 16px -24px'
    };
    if ((this.es.untaggedEcocases !== undefined) && (this.es.filters !== undefined)) {
      this.ctgsFilters = this.es.filters.categories;
      this.ecocases = this.es.untaggedEcocases;
      console.log('this.es.untaggedEcocases: ', this.es.untaggedEcocases);
    } else {
      this.es.getFilterCriteria()
        .subscribe(data => {
          this.ctgsFilters = this.es.filters.categories;
          this.es.getUntaggedEcocases(this.ctgsFilters, this.username)
            .subscribe(data => {
              this.ecocases = this.es.untaggedEcocases;
            });
        });
    }
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
