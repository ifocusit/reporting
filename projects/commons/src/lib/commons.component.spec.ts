import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonsComponent } from './commons.component';

describe('CommonsComponent', () => {
  let component: CommonsComponent;
  let fixture: ComponentFixture<CommonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
