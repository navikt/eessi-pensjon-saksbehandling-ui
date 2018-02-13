import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucsComponent } from './bucs.component';

describe('BucsComponent', () => {
  let component: BucsComponent;
  let fixture: ComponentFixture<BucsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
