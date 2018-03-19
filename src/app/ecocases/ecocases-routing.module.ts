import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcocasesComponent } from './components/ecocases/ecocases.component';
import { EcocaseDetailsComponent } from './components/ecocase-details/ecocase-details.component';
import { EcocaseDetailResolverService } from './services/ecocase-detail-resolver.service';
import { EcocasePostComponent } from './components/ecocase-post/ecocase-post.component';
import { UntaggedEcocasesComponent } from './components/untagged-ecocases/untagged-ecocases.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { TaggedEcocasesComponent } from './components/tagged-ecocases/tagged-ecocases.component';

const routes: Routes = [
  { path: 'ecocases', component: EcocasesComponent },
  { path: 'tagged-ecocases', component: TaggedEcocasesComponent },
  { path: 'untagged-ecocases', component: UntaggedEcocasesComponent },
  { path: 'visualization', component: VisualizationComponent },
  {
    path: 'ecocases/detail/:id',
    component: EcocaseDetailsComponent,
    resolve: { ecocase: EcocaseDetailResolverService }
  },
  { path: 'ecocases/new', component: EcocasePostComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcocasesRoutingModule { }
