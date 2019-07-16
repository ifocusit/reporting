import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadSettings, SetExportFormat } from '../../store/settings.store';
import { Time, TimeAdapter } from '../../models/time.model';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddTimes, DeleteTimes } from 'src/app/store/time.store';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild('fileSelector', { static: true }) private fileSelector: ElementRef;

  public formatFormControl = new FormControl('', [Validators.required]);
  public times: Time[];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadSettings()).subscribe(state => this.formatFormControl.setValue(state.settings.exportFormat));
  }

  public setExportFormat() {
    this.store.dispatch(new SetExportFormat(this.formatFormControl.value));
  }

  public selectFile() {
    this.fileSelector.nativeElement.click();
  }

  public fileChanged(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.times = [];
      (reader.result as string).split('\r\n').forEach(line => {
        this.times.push(TimeAdapter.createTime(line));
      });
      this.times = this.times.filter(time => !!time);
      this.store.dispatch(new AddTimes(this.times)).subscribe();
    };
    reader.readAsText(file);
  }

  public cancelImport() {
    if (this.times) {
      this.store.dispatch(new DeleteTimes(this.times)).subscribe(() => (this.times = null));
    }
  }
}
