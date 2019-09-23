import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanboardViewComponent } from './planboard-view.component';

describe('PlanboardViewComponent', () => {
  let component: PlanboardViewComponent;
  let fixture: ComponentFixture<PlanboardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanboardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
