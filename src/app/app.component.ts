import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { PasswordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/user-name.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  registrationForm!: FormGroup;

  get email(){
    return this.registrationForm.controls['email'];
  }

  get username(){
    return this.registrationForm.controls['username'];
  }

  get alternateEmails(){
    return this.registrationForm.controls['alternateEmails'] as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder, private _registrationService: RegistrationService){

  }
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])
    }, { validator: PasswordValidator })

    this.registrationForm.get('subscribe')?.valueChanges
    .subscribe(checkValue => {
      const email = this.registrationForm.get('email');
      if (checkValue) {
        email?.setValidators(Validators.required)
      } else {
        email?.clearValidators();
      }
      email?.updateValueAndValidity();
    })
  }



  // registrationForm = new FormGroup({
  //   username: new FormControl(''),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode: new FormControl(''),
  //   })
  // });

  //For all the fields use setValue

  // loadAPIData(){
  //   this.registrationForm.setValue({
  //     username: 'Riyaz',
  //     password: 'test',
  //     confirmPassword: 'test',
  //     address: {
  //       city: 'City',
  //       state: 'State',
  //       postalCode: '123456'
  //     }
  //   })
  // }

  //for only few fields use patchValue

  loadAPIData(){
    this.registrationForm.patchValue({
      username: 'Riyaz',
      password: 'test',
      confirmPassword: 'test',
    })
  }

  onSubmit(){
    console.log('Hello');
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value).subscribe(
      response => console.log('Success!', response),
      error => console.log('Error!', error)
    );
  }
}
