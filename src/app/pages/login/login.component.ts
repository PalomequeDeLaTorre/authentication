import { Component, inject } from '@angular/core';
import { FormsModule, Validators,
  ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //Propiedades;

  error: boolean = false;
  fb : FormBuilder = inject(FormBuilder);
  authService : AuthService = inject(AuthService);
  router : Router = inject(Router);

  form = this.fb.nonNullable.group({
    email: [
      '',
    [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ],
  ],

  password: [
    '',
  [
    Validators.required,
  ],
],
});


//Método de OnSubmit;

OnSubmit() {
  const rawForm = this.form.getRawValue();
  this.authService.login(rawForm.email, rawForm.password).subscribe({
    next: () => {
      this.router.navigateByUrl('/home');
    },
    error: (error) => {
      this.error = true;
      console.error('Error: ', error);
    }
  });
 }

}