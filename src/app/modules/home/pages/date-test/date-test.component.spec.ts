import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTestComponent } from './date-test.component';

describe('DateTestComponent', () => {
  let component: DateTestComponent;
  let fixture: ComponentFixture<DateTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateTestComponent]
    });
    fixture = TestBed.createComponent(DateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
