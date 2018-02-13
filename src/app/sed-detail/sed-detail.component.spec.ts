import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SedDetailComponent } from './sed-detail.component';

describe('SedDetailComponent', () => {
  let component: SedDetailComponent;
  let fixture: ComponentFixture<SedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SedDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
