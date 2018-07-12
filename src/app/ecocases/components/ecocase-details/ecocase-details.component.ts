import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../auth/services/user.service';
import { EcocasesService } from '../../services/ecocases.service';
import { HelpersService } from '../../../shared/services/helpers.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  environGains: any[] = []; environGainEval: any = {};
  reboundPotentials: any[] = []; reboundPotentialEval: any = {};
  massEffectPotentials: any[] = []; massEffectPotentialEval: any = {};
  ecocaseGeneralEval: any = {};
  ecoEffectPotentialEvals: any[] = [];
  ecoinnovationStatuss: any[] = []; ecoinnovationStatusEval: any = {};
  isEdit: boolean;
  uploadFiles: any[];
  uploadMessage: string;
  removedUrls: string[];

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
    this.uploadMessage = '';
    this.uploadFiles = [];
    this.removedUrls = [];
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
              this.environGains = res['data']['environ_gains'];
              this.environGainEval = res['data']['environ_gain_eval'];
              this.reboundPotentials = res['data']['rebound_potentials'];
              this.reboundPotentialEval = res['data']['rebound_potential_eval'];
              this.massEffectPotentials = res['data']['mass_effect_potentials'];
              this.massEffectPotentialEval = res['data']['mass_effect_potential_eval'];
              this.ecocaseGeneralEval = res['data']['ecocase_general_eval'];
              this.ecoEffectPotentialEvals = res['data']['eco_effect_potential_evals'];
              this.ecoinnovationStatuss = res['data']['ecoinnovation_statuss'];
              this.ecoinnovationStatusEval = res['data']['ecoinnovation_status_eval'];
            }))
          .subscribe();
        this.ecocaseId = ecocaseId;
      });
  }

  editEcocase(): void {
    this.previousEcocase = JSON.parse(JSON.stringify(this.ecocase));
    console.log('cancelEdit editEcocase: ', this.previousEcocase);
    this.isEdit = true;
  }

  cancelEdit(): void {
    console.log('cancelEdit previousEcocase: ', this.previousEcocase);
    this.ecocase = JSON.parse(JSON.stringify(this.previousEcocase));
    this.isEdit = false;
  }

  updateEcocase(ecocase: any): void {
    this.es.updateEcocase(ecocase, this.uploadFiles, this.removedUrls)
      .pipe()
      .subscribe(res => {
        console.log('update ecocase', res);
        if (res.status === 'success') {
          this.isEdit = false;
          this.helpers.showMessage('Les modifications sont bien enregistrées.');
          this.router.navigateByUrl('/ecocases', {skipLocationChange: true}).then(() =>
            this.router.navigate(['ecocases/detail/' + this.ecocaseId]));
        } else {
          this.helpers.showMessage('Les modifications ne peuvent être pas enregistrées. Erreur(s): ' + res.errors);
        }
      });
    this.uploadFiles = [];
    this.uploadMessage = '';
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

  removeImage(ecocase: any, idx: number) {
    this.removedUrls.push(ecocase.image_urls[idx]);
    ecocase.image_urls.splice(idx, 1);
  }

  getFileDetails (event) {
    for (let i = 0; i < event.target.files.length; i++) {
      const reader = new FileReader();
      const file = event.target.files[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadFiles.push({
          filename: file.name,
          filetype: file.type.split('/')[1],
          value: reader.result.split(',')[1]
        });
      };
    }
    this.uploadMessage = event.target.files.length + ' fichier(s) sélectionné(s)';
    console.log('Upload files: ', this.uploadFiles);
  }

/*
  private getInternalDetails(id: string): void {
    this.es.getEcocaseInternalDetails(id)
      .subscribe(res => this.ecocaseInternalDetails = res)
  }*/

}
