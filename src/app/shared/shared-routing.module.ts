import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import {HelpComponent} from './components/help/help.component';
import {VisualizationComponent} from '../ecocases/components/visualization/visualization.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'help', component: HelpComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
