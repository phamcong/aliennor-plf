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
  firstESM: any;
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

  submitEsmevaluations(esmevaluations: any[], ecocaseId, nonESM): void{
    if ((this.firstESM.title == '') && (!this.nonESM))
      alert('Veuillez-vous indiquer au moin un mécanisme associé ou cochez non mécanismes associés ligne');
    else {
      console.log('esmevaluations: ', esmevaluations);
      esmevaluations.forEach(function(esmevaluation) {
        console.log('forEach esmevaluation: ', esmevaluation);
        esmevaluation.isFirstESM = esmevaluation.esm.title == this.firstESM.title;
        esmevaluation.isSecondESM = esmevaluation.esm.title == this.secondESM.title;
      }, this);
      this.es.submitEsmevaluations(esmevaluations, ecocaseId, nonESM)
        .subscribe(res => {
          console.log('submit esmevaluations successfully!');
          this.associatedESMs$.next(1);
        });
      this.moveItem(this.es.untaggedEcocases, ecocaseId, this.es.taggedEcocases);
      this.router.navigate([`ecocases`]);
    }
  };

  private moveItem(untaggedEcocases, ecocaseId, taggedEcocase) {
    let idx = -1;
    untaggedEcocases.forEach((unTaggedEcocase, index) => {
      if (unTaggedEcocase.id == ecocaseId)
        idx = index;
    });
    if (idx != -1) {
      taggedEcocase.push(untaggedEcocases[idx]);
      untaggedEcocases.splice(idx, 1);
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

  public onSelectionSecondESM(): void {
    if (this.firstESM.title == '') {
      alert('Veuillez-vous sélectionner le premier mécanisme le plus associé');
      this.secondESM = {'title': ''};
    }
  }
}
