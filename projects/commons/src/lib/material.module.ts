import { NgModule } from '@angular/core';

import {
  MatTabsModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatInputModule,
  MatProgressBarModule,
  MatButtonToggleModule,
  MatTableModule,
  MatNativeDateModule,
  MatDialogModule,
  MatDatepickerModule
} from '@angular/material';

const modules = [
  MatTabsModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatInputModule,
  MatDatepickerModule,
  MatDialogModule,
  MatNativeDateModule,
  MatTableModule,
  MatButtonToggleModule,
  MatProgressBarModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule {}
