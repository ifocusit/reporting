import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Moment} from "moment";
import {DEFAULT_TIME, ISO_TIME} from "../../../model/working-date-reporting.model";
import {Time} from "../../../model/time.model";

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.less']
})
export class DailyReportComponent {

  constructor(public dialogRef: MatDialogRef<DailyReportComponent>,
              @Inject(MAT_DIALOG_DATA) public reporting: { date: Moment, times: Time[] }) {
  }

  close(): void {
    this.dialogRef.close();
  }

  add(): void {
    const index = Math.min(this.reporting.times.length, 3);
    const defaultTime = DEFAULT_TIME.getDatetime(index);
    const time = this.reporting.date.clone().set({'hour': defaultTime.hour(), 'minute': defaultTime.minute()});
    this.reporting.times.push(new Time(time.format(ISO_TIME)));
  }

  remove(time): void {
    this.reporting.times.splice(this.reporting.times.indexOf(time), 1);
  }
}
