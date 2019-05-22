import { Component, OnInit } from '@angular/core';
import { TitleService } from './../../../services/title.service';
import { LoginService } from './../../../services/login.service';
import { AuthService } from './../../../services/auth.service';
import { HelperService } from './../../../services/helper.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {errorCodes, errorCodeMap,popuperrorCodes, crypto_key} from '../../../config/constant';
declare var bootbox;
import * as CryptoJS from 'crypto-js';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    errMes;
    successMes = '';

    /**
     * Constructor for login component
     * @param title
     * @param fb
     * @param login
     */
    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private login: LoginService,
                 private auth: AuthService,
                 private helper: HelperService,
                 public  router: Router) {this.auth.logout();}

    /**
     * Start login component
     */
    ngOnInit() {
    this.errMes = [];
        this.successMes = '';
        this.title.setTitle('Cavelog (tm)');
        this.createLoginForm();
        //alert(CryptoJS.AES.encrypt('test',crypto_key).toString());
    }

    /**
     * Create login form
     */
    createLoginForm() {
        this.form = this.fb.group({
            password: ['', Validators.compose([Validators.required])],
            username: ['', Validators.compose([Validators.required , Validators.email])],
        });
    }

    /**
     * On submit login form
     * @param event
     */
    onSubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successMes = '';
        const formData = this.form.value;
        if ( this.form.status === 'VALID') {
            const option = new FormData();
            option.append('password', formData.password );
            option.append('username', formData.username );
            option.append('grant_type', 'password' );
            this.login.authenticateUser( option ).subscribe((response: any) => {
                this.auth.setSession(response);
                if (response.access_token && this.auth.currentUserSubject!== null) {
                        this.router.navigate(['/dashboard']);
                }
            }, (err: any) => {
                if (err.status === 400 || err.status === 404) {
                    err.error.errors.forEach(errormsg => {
                        if (errormsg.errorCode === errorCodes['USER_ACCOUNT_NOT_ACTIVATED']) {
                            if(this.helper.inArray(errormsg.errorCode,popuperrorCodes)){
                                if (typeof bootbox !== 'undefined') {
                                    const self = this;
                                    bootbox.dialog({
                                        title: errormsg.errorMsgTitle,
                                        message: errormsg.errorMessage,
                                        buttons: {
                                            ok: {
                                                label: 'Ok',
                                                className: 'btn-facebook',
                                                callback: function(){
                                                    // alert(CryptoJS.AES.encrypt('test','test1234').toString());
                                                    // alert(CryptoJS.AES.decrypt('U2FsdGVkX19uJQLFqE2QN1DzqO1Bf3C9I915fhnt0D0=','test1234' ).toString(CryptoJS.enc.Utf8));
                                                    self.router.navigate(['/user/activate/' + formData.username]);
                                                }
                                            }
                                        },callback: function () {
                                            self.router.navigate(['/user/activate/' + formData.username]);
                                        }

                                    }).find('.modal-dialog').css('padding-top', '15%');
                                } else {
                                    setTimeout(function () {
                                        window.alert(errormsg.errorMessage);
                                    }, 0);
                                    this.router.navigate(['/user/activate/' + formData.username]);
                                }

                            }else {
                                this.router.navigate(['/user/activate/' + formData.username]);
                            }
                        }else {
                            if(errormsg.errorMsgTitle && (errormsg.errorMsgTitle!=='' || errormsg.errorMsgTitle!==null)){
                                this.errMes['error'] = errormsg.errorMessage;
                            }else {
                                this.errMes[errorCodeMap[errormsg.errorCode]] = errormsg.errorMessage;
                            }

                        }
                    });
                } else {
                    console.log(err.status);
                }
            });
        }
        if(this.form.controls['username'].status === 'INVALID'){
            this.errMes['username'] = 'Please provide valid email id';

        }
        if(this.form.controls['password'].status === 'INVALID'){
            this.errMes['password'] = 'Please provide password';

        }
    }
}
