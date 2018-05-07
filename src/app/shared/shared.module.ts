import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorbarComponent } from './components/errorbar/errorbar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SharedRoutingModule } from './shared-routing.module';
import { TruncatePipe } from './pipes/custommed-pipes.pipe';
import { HelpComponent } from './components/help/help.component';

const COMPONENTS = [
  ErrorbarComponent,
  LoadingSpinnerComponent,
  ToolbarComponent,
  WelcomeComponent,
  HelpComponent
]

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    SharedRoutingModule
  ],
  exports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    NgxPaginationModule,
    TruncatePipe,
    ...COMPONENTS
  ],
  declarations: [
    ...COMPONENTS,
    WelcomeComponent,
    TruncatePipe,
    HelpComponent
  ]
})
export class SharedModule { }
