import { Component, OnInit } from '@angular/core';
import { TitleService } from './../../../services/title.service';
import { LoginService } from './../../../services/login.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {errorCodes, errorCodeMap,popuperrorCodes} from '../../../config/constant';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {
    form: FormGroup;
    errMes = {};
    successMes = '';
    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private login: LoginService,
                 private router:Router) {}
    ngOnInit() {
        this.title.setTitle('New Account');
        this.createSignUpForm();
    }

    createSignUpForm() {
        this.form = this.fb.group({
            firstname: ['', Validators.required ],
            lastname: ['', Validators.required ],
            telephone: ['', Validators.compose([Validators.required ,Validators.maxLength(10)] )],
            password: ['', Validators.compose([Validators.required , Validators.minLength(8)])],
            confirm_password: ['', Validators.compose([Validators.required , Validators.minLength(8)])],
            username: ['', Validators.compose([Validators.required , Validators.email])],
        });
    }


    onSubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successMes = '';
        const formData = this.form.value;
        if(this.validate(formData)) {
            if (this.form.status === 'VALID') {
                this.login.registerUser({
                    confirmPassword: formData.confirm_password,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    password: formData.password,
                    telephone: formData.telephone,
                    username: formData.username
                }).subscribe((response: any) => {
                    this.successMes = response.response.message;
                   // this.router.navigate(['/activate/'+formData.username])
                }, (err: any) => {
                    if (err.status === 400 || err.status === 404) {
                        err.error.errors.forEach(errormsg => {
                        if(errormsg.errorMsgTitle && (errormsg.errorMsgTitle!=='' || errormsg.errorMsgTitle!==null)){
                            this.errMes['error'] = errormsg.errorMessage;
                        }else {
                                const key = errorCodeMap[errormsg.errorCode];
                                const value = errormsg.errorMessage;
                                this.errMes[key] = value;

                        }
                        });
                    }else{
                        console.log(err);
                    }
                });
            }

            if(this.form.controls['firstname'].status === 'INVALID'){
                this.errMes['firstname'] = 'First name cannot be blank';
            }
            if(this.form.controls['lastname'].status === 'INVALID'){
                this.errMes['lastname'] = 'Last name cannot be blank';
            }
            if(this.form.controls['username'].status === 'INVALID'){
                this.errMes['username'] = 'Please provide valid email id';
            }
            if(this.form.controls['password'].status === 'INVALID'){
                this.errMes['password'] = 'Password must be at least 8 char. long with uppercase, lowercase letters and numbers';
            }
            if(this.form.controls['confirm_password'].status === 'INVALID'){
                this.errMes['confirm_password'] = 'Password and Reconfirm Password should match';
            }
            if(this.form.controls['telephone'].status === 'INVALID'){
                this.errMes['telephone'] = 'Please provide valid mobile number';
            }
        }
    }

    validate(formData){
        if(formData.password === formData.confirm_password){
            return true;
        }else{
            this.errMes['confirm_password'] = 'Password and Reconfirm Password should match';
            return false;
        }
    }

}
