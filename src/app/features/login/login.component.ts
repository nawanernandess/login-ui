import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  myForm: FormGroup;
  formValidation: boolean = false;

  private readonly _formBuilder = inject(FormBuilder);

  constructor() {
    this.myForm = this._formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  submit() {
    if (!this.myForm.valid) {
      return console.log('invalido!!');
    }

    console.log('valido');
    this.formValidation = true;
  }
}
