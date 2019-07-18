import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoadSettings, SetExportFormat } from '../../store/settings.store';
import { Time, TimeAdapter } from '../../models/time.model';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddTimes, DeleteTimes } from 'src/app/store/time.store';
import { AuthService, User } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild('fileSelector', { static: true }) private fileSelector: ElementRef;

  public formatFormControl = new FormControl('', [Validators.required]);
  public times: Time[];

  public user$: Observable<User>;

  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit() {
    this.user$ = this.authService.user$;
    this.store.dispatch(new LoadSettings()).subscribe(state => this.formatFormControl.setValue(state.settings.exportFormat));
  }

  public setExportFormat() {
    this.store.dispatch(new SetExportFormat(this.formatFormControl.value));
  }

  public selectFile() {
    this.fileSelector.nativeElement.click();
  }

  public fileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.times = [];
      (reader.result as string).split('\r\n').forEach(line => {
        this.times.push(TimeAdapter.createTime(line));
      });
      this.times = this.times.filter(time => !!time);
      this.store.dispatch(new AddTimes(this.times)).subscribe(() => (this.times = undefined));
    };
    reader.readAsText(file);
  }

  public cancelImport() {
    if (this.times) {
      this.store.dispatch(new DeleteTimes(this.times)).subscribe(() => (this.times = null));
    }
  }

  signOut() {
    this.authService.signOutUser();
  }
}
