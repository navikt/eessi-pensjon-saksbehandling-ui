import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsaliveComponent } from './isalive.component';

describe('IsaliveComponent', () => {
    let component: IsaliveComponent;
    let fixture: ComponentFixture<IsaliveComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IsaliveComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IsaliveComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
