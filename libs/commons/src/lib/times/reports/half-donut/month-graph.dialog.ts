import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HalfDonutComponent } from './half-donut.component';

@Component({
  selector: 'lib-month-graph-dialog',
  template: `<lib-half-donut [month]="month"></lib-half-donut>`,
  standalone: true,
  imports: [HalfDonutComponent]
})
export class MonthGraphDialogComponent {
  constructor(public dialogRef: MatDialogRef<MonthGraphDialogComponent>, @Inject(MAT_DIALOG_DATA) public month: string) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
