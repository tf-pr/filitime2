import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiddleComponent } from './fiddle.component';

describe('FiddleComponent', () => {
  let component: FiddleComponent;
  let fixture: ComponentFixture<FiddleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiddleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
