import { Component, Input, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EcocasesService } from '../../services/ecocases.service';
import { Router } from '@angular/router';
import { async } from 'rxjs/scheduler/async';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-tagged-ecocases',
  templateUrl: './tagged-ecocases.component.html',
  styleUrls: ['./tagged-ecocases.component.scss']
})

export class TaggedEcocasesComponent implements OnInit {
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
  public count_results: {
    esms: any,
    categories: any[]
  };

  constructor(
    private es: EcocasesService,
    private router: Router
  ) { }

  ngOnInit() {
    // custom styles to fit loader to card container
    this.spinnerStyles = {
      margin: '-24px -24px 16px -24px'
    };

    console.log('at tagged ecocases: ', this.username);

    this.filters = {
      esms: [],
      categories: []
    };

    if ((this.es.taggedEcocases !== undefined) && (this.es.updatedFilters !== undefined)) {
      this.filters = this.es.updatedFilters;
      this.ecocases = this.es.taggedEcocases;
      console.log('this.es.taggedEcocases: ', this.es.taggedEcocases);
    } else {
      this.es.getFilterCriteria()
        .subscribe(data => {
          this.filters = this.es.filters;
          this.es.getTaggedEcocases(this.filters, this.username)
            .subscribe(data => {
              this.ecocases = this.es.taggedEcocases;
              this.filters = this.es.updatedFilters;
            });
        });
    }
    /*this.es.getFilterCriteria()
      .subscribe( data => {
        this.filters = this.es.filters;
        this.es.getTaggedEcocases(this.filters)
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
      })
    ;
    this.filters = this.es.filters;*/
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
