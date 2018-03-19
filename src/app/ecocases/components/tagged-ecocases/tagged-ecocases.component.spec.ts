import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedEcocasesComponent } from './tagged-ecocases.component';

describe('TaggedEcocasesComponent', () => {
  let component: TaggedEcocasesComponent;
  let fixture: ComponentFixture<TaggedEcocasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaggedEcocasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaggedEcocasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
