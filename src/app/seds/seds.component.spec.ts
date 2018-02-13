import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SedsComponent } from './seds.component';

describe('SedsComponent', () => {
  let component: SedsComponent;
  let fixture: ComponentFixture<SedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
