import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'month-graph-dialog',
  template: `
    <lib-half-donut [month]="month"></lib-half-donut>
  `
})
export class MonthGraphDialog {
  constructor(public dialogRef: MatDialogRef<MonthGraphDialog>, @Inject(MAT_DIALOG_DATA) public month: string) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}