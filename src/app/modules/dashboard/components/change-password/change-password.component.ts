import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input} from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../../../../services/login.service';

@Component({
    selector: 'app-change-password-profile',
    templateUrl: 'change-password.component.html',
    providers: [DatePipe]
})
export class ChangePasswordProfileComponent implements OnInit {

    form: FormGroup;
    errMes = <any[]>[];
    successMes = '';
    res;
    @Input() userid: any;

    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private auth: AuthService,
                 private login: LoginService,
                 public  router: Router) {}

    /**
     * Initialize Component
     */
    ngOnInit() {

        console.log(this.userid);
        this.changePasswordForm();

    }


    changePasswordForm()
    {
        this.form = this.fb.group({
            password: ['', Validators.required ],
            confirmPassword: ['', Validators.required ],
            currentPassword: ['', Validators.required ],
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successMes = '';
        const formData = this.form.value;

        if ( this.form.status === 'VALID') {
            const option = {
                password:formData.password,
                confirmPassword: formData.confirmPassword,
                currentPassword:formData.currentPassword,
                userid:this.userid,
            };
            this.login.updateSecurity( option ).subscribe((response: any) => {
                if(response) {
                    this.successMes = response.response.message;
                }
            }, (err: any) => {
                if (err.status === 400) {
                    err.error.errors.forEach(errormsg => {
                        const key = errormsg.errorField;
                        const value = errormsg.errorMessage;
                        this.errMes[key] =  value;
                    });
                } else {
                    console.log(err.status);
                }
            });
        }else{
            this.errMes['error'] = 'Please fill up change password form';
        }
    }
}
