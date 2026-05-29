import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { users } from '../../data/users';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  appUsers = users;
  authService = inject(AuthService);
  activatedRoute = inject(ActivatedRoute);
  error: string = '';
  router = inject(Router)

  constructor(private fb: FormBuilder){
    this.loginForm = this.fb.group({
      email: new FormControl(''),
      password: new FormControl('')
    })
  }

  /**
   * Local login using hardcoded credentials
   */
  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;

      const userFound = this.appUsers.filter(user => user.email === email);
      if(userFound.length > 0){
        if(userFound[0].password === password){

          localStorage.setItem('user', email);
          this.authService.login();
          this.router.navigate([''])
        } else {
          this.error = 'The password is not correct';
        }
      } else {
        this.error = 'The user does not exists';
      }
    }
  }

  /**
   * Login with Auth0
   */
  loginWithAuth0() {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    this.authService.loginWithAuth0(returnUrl);
  }
}
