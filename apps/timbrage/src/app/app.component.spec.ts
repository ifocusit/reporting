import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, BillService, ExportService, InitializationService } from '@ifocusit/commons';
import { TranslatePipe } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, TranslatePipe],
      imports: [MatToolbarModule, MatIconModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: InitializationService, useValue: jest.fn() },
        { provide: InitializationService, useValue: jest.fn() },
        { provide: Store, useValue: jest.fn() },
        { provide: AuthService, useValue: jest.fn() },
        { provide: ExportService, useValue: jest.fn() },
        { provide: MatDialog, useValue: jest.fn() },
        { provide: BillService, useValue: jest.fn() },
        { provide: Location, useValue: jest.fn() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    spyOn(TranslatePipe.prototype, 'transform').and.returnValue('Translated');
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
