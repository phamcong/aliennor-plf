import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../auth/services/user.service';
import { EcocasesService } from '../../services/ecocases.service';
import { HelpersService } from '../../../shared/services/helpers.service';
import {ActivatedRoute, Router} from '@angular/router';
import { first, map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-ecocase-details',
  templateUrl: './ecocase-details.component.html',
  styleUrls: ['./ecocase-details.component.scss']
})
export class EcocaseDetailsComponent implements OnInit {
  ecocaseInternalDetails: any;
  ecocaseId: string;
  ecocase: any;
  previousEcocase: any;
  esmevaluations: any[];
  previousUserRating = 0;
  nonESM: any;
  username: string;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public us: UserService,
    private es: EcocasesService,
    private helpers: HelpersService
  ) { }

  ngOnInit() {
    this.isEdit = false;
    this.previousEcocase = {};
    console.log('this.route: ', this.route);
    this.username = this.us.getOrSetUserName();
    // this.route.data.pipe(
    //   map(res => {
    //     console.log('get ecocase detail, res: ', res.ecocase.data);
    //     this.esmevaluations = res.ecocase.data.esmevaluations;
    //     this.esmevaluations.forEach(function(esmevaluation) {
    //       let answer = esmevaluation.answer
    //       esmevaluation.answer = answer ? String(answer).replace(/<[^>]+>/gm, '') : '';
    //     });
    //
    //     this.ecocase = res.ecocase.data.ecocase;
    //   })
    // );

    this.route.params
      .subscribe(par => {
        console.log('parrr: ', par);
        const ecocaseId = par['id'];
        this.es.getEcocaseDetails(ecocaseId)
          .pipe(
            map(res => {
              console.log('getEcocaseDetails: ', res);
              this.ecocase = res['data'].ecocase;
              this.nonESM = res['data'].nonESM;
              this.esmevaluations = res['data'].esmevaluations;
              this.esmevaluations.forEach( esmevaluation => {
                let str = esmevaluation.answer;
                esmevaluation.answer = str ? String(str).replace(/<[^>]+>/gm, '') : '';
              });
            }))
          .subscribe();
        this.ecocaseId = ecocaseId;
      });
  }

  editEcocase(): void {
    Object.assign(this.previousEcocase, this.ecocase);
    this.isEdit = true;
  }

  cancelEdit(): void {
    Object.assign(this.ecocase, this.previousEcocase);
    this.isEdit = false;
  }

  updateEcocase(ecocase: any): void {
    this.es.updateEcocase(ecocase)
      .pipe(map(res => { console.log('update ecocase', res); }))
      .subscribe();
    this.isEdit = false;
  }

  deleteEcocase(ecocase: any): void {
    console.log('to delete ecocase....');
    this.es.deleteEcocase(ecocase)
      .pipe(map(res => { console.log('ecocase deleted successfully', res); }))
      .subscribe( res => {
          this.router.navigate(['ecocases/']);
          window.location.reload();
        });
  }

/*
  private getInternalDetails(id: string): void {
    this.es.getEcocaseInternalDetails(id)
      .subscribe(res => this.ecocaseInternalDetails = res)
  }*/

}
