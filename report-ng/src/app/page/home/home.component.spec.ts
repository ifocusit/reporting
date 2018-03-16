import {async, TestBed} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {MatButtonModule, MatIconModule, MatInputModule} from '@angular/material';
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('HomeComponent', () => {
  var originalTimeout;
  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Report!ng');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Report!ng');
  }));
});
