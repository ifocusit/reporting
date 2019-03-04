import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimbrageComponent } from './timbrage.component';

describe('TimbrageComponent', () => {
  let component: TimbrageComponent;
  let fixture: ComponentFixture<TimbrageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimbrageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimbrageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
