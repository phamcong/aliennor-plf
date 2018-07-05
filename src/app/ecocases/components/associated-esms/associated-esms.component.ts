import { Component, OnInit, Input } from '@angular/core';
import { EcocasesService } from '../../services/ecocases.service';
import { FormBuilder } from '@angular/forms';
import { HelpersService } from '../../../shared/services/helpers.service';
import { UserService } from '../../../auth/services/user.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-associated-esms',
  templateUrl: './associated-esms.component.html',
  styleUrls: ['./associated-esms.component.scss']
})
export class AssociatedEsmsComponent implements OnInit {
  @Input() esmevaluations: any[];
  @Input() ecocaseId: string;
  @Input() nonESM: any;
  @Input() username: string;
  @Input() caseReference: string;
  @Input() environGains: any[]; @Input() environGainEval: any;
  @Input() reboundPotentials: any[]; @Input() reboundPotentialEval: any;
  @Input() massEffectPotentials: any[]; @Input() massEffectPotentialEval: any;
  @Input() ecocaseGeneralEval: any;
  @Input() ecoEffectPotentialEvals: any[];
  @Input() ecoinnovationStatuss: any[]; @Input() ecoinnovationStatusEval: any;
  firstESM: any;
  selectedEnvironGain = '';
  selectedReboundPotential = '';
  selectedMassEffectPotential = '';
  selectedEcoinnovationStatus = '';
  secondESM: any;
  esms: string[];
  associatedESMs: any[];
  associatedESMs$ = new BehaviorSubject<number>(1);
  firstESMIdx: number;
  secondESMIdx: number;

  constructor(
    private es: EcocasesService,
    private fb: FormBuilder,
    private helpers: HelpersService,
    public us: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.firstESM = {'title': ''};
    this.secondESM = {'title': ''};
    this.selectedEnvironGain = (this.environGainEval.environ_gain.level !== undefined) ? this.environGainEval.environ_gain.level : '';
    this.selectedReboundPotential = (this.reboundPotentialEval.rebound_potential.level !== undefined) ? this.reboundPotentialEval.rebound_potential.level : '';
    this.selectedMassEffectPotential = (this.massEffectPotentialEval.mass_effect_potential.level !== undefined) ? this.massEffectPotentialEval.mass_effect_potential.level : '';
    this.selectedEcoinnovationStatus = (this.ecoinnovationStatusEval.ecoinnovation_status.title !== undefined) ? this.ecoinnovationStatusEval.ecoinnovation_status.title : '';
    console.log('associated-esm.component init:...', this.esmevaluations);
    this.esmevaluations.forEach((esmevaluation, index) => {
      if (esmevaluation.is_first_esm) {
        this.firstESMIdx = index;
        this.firstESM.title = esmevaluation.esm.title;
      }
      if (esmevaluation.is_second_esm) {
        this.secondESMIdx = index;
        this.secondESM.title = esmevaluation.esm.title;
      }
    });

    this.associatedESMs$
      .pipe(
        mergeMap(page => this.es.getAssociatedESMs(this.ecocaseId)),
        map(res => {
          console.log('res:', res);
          var obj = res['data'].associated_esms_summary;
          return Object.keys(obj).map(key => obj[key])
        }))
      .subscribe(associatedESMs => {
        console.log('associatedESMs: ', associatedESMs);
        this.associatedESMs = associatedESMs ;
      });
    /*this.commentsPageNr$
      .pipe(
        mergeMap(page => this.es.getComments(this.ecocaseId, page)),
        map(res => res.data),
        map(comments => {
        return {
          comments: comments.comments.reverse(),
          currentPage: comments.current_page,
          totalPages: comments.total_pages,
          itemsPerPage: comments.items_per_page
        };
      }))
      .subscribe(commentsObj => {
        this.commentsData = commentsObj;
      });*/
  }

  submitEsmevaluations(): void {
    console.log('firstESM: ', this.firstESM);
    console.log('nonESM: ', this.nonESM.isNonESM);
    this.environGainEval.environ_gain = this.selectedEnvironGain;
    this.reboundPotentialEval.rebound_potential = this.selectedReboundPotential;
    this.massEffectPotentialEval.mass_effect_potential = this.selectedMassEffectPotential;
    this.ecoinnovationStatusEval.ecoinnovationStatus = this.selectedEcoinnovationStatus;
    if ((this.firstESM.title === '') && (!this.nonESM.isNonESM)) {
      alert('Veuillez-vous indiquer au moin un mécanisme associé ou cochez non mécanismes associés ligne.');
    } else {
      if (this.selectedEnvironGain === '') {
        alert('Veuillez-vous indiquer le niveau du gain environnemental.');
      } else {
        if (this.selectedReboundPotential === '') {
          alert("Veuillez-vous indiquer le potentiel d'effects rebonds.");
        } else {
          if (this.selectedMassEffectPotential === '') {
            alert("Veuillez-vous indiquer le potentiel d’effet de masse de l’éco-innovation.");
          } else {
            console.log('esmevaluations: ', this.esmevaluations);
            this.esmevaluations.forEach(function (esmevaluation) {
              console.log('forEach esmevaluation: ', esmevaluation);
              esmevaluation.isFirstESM = esmevaluation.esm.title === this.firstESM.title;
              esmevaluation.isSecondESM = esmevaluation.esm.title === this.secondESM.title;
            }, this);
            this.es.submitEsmevaluations(
              this.esmevaluations,
              this.ecocaseId,
              this.nonESM,
              this.environGainEval,
              this.reboundPotentialEval,
              this.massEffectPotentialEval,
              this.ecocaseGeneralEval,
              this.ecoEffectPotentialEvals,
              this.ecoinnovationStatusEval)
              .subscribe(res => {
                console.log('submit esmevaluations successfully!');
                this.associatedESMs$.next(1);
              });
            this.moveItem(this.es.untaggedEcocases, this.ecocaseId, this.es.taggedEcocases);
            this.router.navigate([`ecocases`]);
          }
        }
      }
    }
  }

  private moveItem(untaggedEcocases, ecocaseId, taggedEcocase) {
    let idx = -1;
    if (untaggedEcocases !== undefined) {
      untaggedEcocases.forEach((unTaggedEcocase, index) => {
        if (unTaggedEcocase.id == ecocaseId)
          idx = index;
      });
      if (idx !== -1) {
        taggedEcocase.push(untaggedEcocases[idx]);
        untaggedEcocases.splice(idx, 1);
      }
    }
  }

  public clickNonESM(nonESM): void {
    if (nonESM.isNonESM) {
      this.firstESM.title = '';
      this.secondESM.title = '';
    }
    console.log('this.nonESM: ', this.nonESM);
  }

  public onSelectionFirstESM(esmevaluation, nonESM): void {
    console.log('changeeeee');
    nonESM.isNonESM = false;
  }

  private environGainChange(option: any): void {
    this.selectedEnvironGain = option.level;
    console.log('environGains: ', this.environGains);
    console.log('selectedEnvironGain: ', this.selectedEnvironGain);
  }

  private reboundPotentialChange(option: any): void {
    this.selectedReboundPotential = option.level;
    console.log('rebound potential: ', this.reboundPotentials);
    console.log('selected rebound potential: ', this.selectedReboundPotential);
  }

  private massEffectPotentialChange(option: any): void {
    this.selectedMassEffectPotential = option.level;
    console.log('mass effect potential: ', this.massEffectPotentials);
    console.log('selected mass effect potential: ', this.selectedMassEffectPotential);
  }

  private ecoinnovationStatusChange(option: any): void {
    this.selectedEcoinnovationStatus = option.title;
    console.log('environGains: ', this.ecoinnovationStatuss);
    console.log('selectedEnvironGain: ', this.selectedEcoinnovationStatus);
  }

  private ecoEffectPotentialChange(option: any): void {
    console.log('selected option: ', option);
  }
  public onSelectionSecondESM(): void {
    if (this.firstESM.title === '') {
      alert('Veuillez-vous sélectionner le premier mécanisme le plus associé');
      this.secondESM = {'title': ''};
    }
  }
}
