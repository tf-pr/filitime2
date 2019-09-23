import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LizenzViewComponent } from './lizenz-view.component';

describe('LizenzViewComponent', () => {
  let component: LizenzViewComponent;
  let fixture: ComponentFixture<LizenzViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LizenzViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LizenzViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
