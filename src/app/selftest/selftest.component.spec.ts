import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelftestComponent } from './selftest.component';

describe('SelftestComponent', () => {
  let component: SelftestComponent;
  let fixture: ComponentFixture<SelftestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelftestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelftestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
