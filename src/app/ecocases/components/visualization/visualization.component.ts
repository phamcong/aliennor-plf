import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EcocasesService} from '../../services/ecocases.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {
  public currentActiveClass: string;
  public showESM: boolean;
  public showEcocase: boolean;
  constructor() { }

  ngOnInit() {
    this.currentActiveClass = 'ESM';
    this.showESM = false;
    this.showEcocase = true;
  }

  toggleClass(tab: string): void {
    console.log('toggleClass ===> ');
    if (tab === 'ESM') {
      this.currentActiveClass = 'ESM';
      this.showESM = true;
      this.showEcocase = false;
    } else {
      this.currentActiveClass = 'Ecocase';
      this.showESM = false;
      this.showEcocase = true;
    }
  }
}
