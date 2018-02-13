import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucDetailComponent } from './buc-detail.component';

describe('BucDetailComponent', () => {
  let component: BucDetailComponent;
  let fixture: ComponentFixture<BucDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
