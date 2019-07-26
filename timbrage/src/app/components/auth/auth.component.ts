import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TimeAdapter, Time, DATETIME_ISO_FORMAT } from 'src/app/models/time.model';
import { toArray, mergeMap, map } from 'rxjs/operators';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @ViewChild('export', { static: true }) private exportLink: ElementRef;

  public signup = false;
  public passwordSignin = false;

  signupForm: FormGroup;
  signinForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private storage: StorageMap) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });

    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  submitSignup() {
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;

    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  submitPasswordSignin() {
    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;

    this.authService.signInUser(email, password).then(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  googleSignin() {
    this.authService.googleSignin().then(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = error;
      }
    );
  }

  public totalSave() {
    this.storage
      .keys()
      .pipe(
        mergeMap(key => this.storage.get<Time[]>(key)),
        toArray(),
        map((nestedArrays: Time[][]) => ([] as Time[]).concat(...nestedArrays)),
        map(times => {
          let csvContent = '';
          times.forEach(time => (csvContent += `${new TimeAdapter(time).format(DATETIME_ISO_FORMAT)}\r\n`));
          return csvContent;
        })
      )
      .subscribe(csvContent => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = this.exportLink.nativeElement;
        link.href = url;
        link.download = 'total_save.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
