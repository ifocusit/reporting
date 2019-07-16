import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public signup = false;
  public passwordSignin = false;

  signupForm: FormGroup;
  signinForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

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
}
