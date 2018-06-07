import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsmTaggedcasesVisualizationComponent } from './esm-taggedcases-visualization.component';

describe('EsmTaggedcasesVisualizationComponent', () => {
  let component: EsmTaggedcasesVisualizationComponent;
  let fixture: ComponentFixture<EsmTaggedcasesVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsmTaggedcasesVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsmTaggedcasesVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
