import { Component, OnInit, Input } from '@angular/core';
import { TitleService } from './../../../services/title.service';
import { LoginService } from './../../../services/login.service';
import { AuthService } from './../../../services/auth.service';
import { FormGroup,  FormBuilder,  Validators ,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {actions, errorCodeMap, errorCodes, popuperrorCodes} from '../../../config/constant';
import { HelperService } from './../../../services/helper.service';
declare var bootbox;


@Component({
    selector: 'app-challenge-verified',
    templateUrl: './challenge-verified.component.html'
})
export class ChallengeVerifiedComponent implements OnInit {
    form: FormGroup;
    errMes;
    successMes = '';
    @Input() securitydata: any;
    @Input() info_message: any;


    /**
     * Constructor for forgot password
     * @param title
     * @param fb
     * @param login
     */
    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private helper: HelperService,
                 private login: LoginService,
                 private auth: AuthService,
                 public  router: Router) {}

    /**
     * Start forgot password
     */
    ngOnInit() {
        this.errMes = [];
        this.successMes = '';
        this.title.setTitle('Password Reset');
        this.createForm();

    }

    /**
     * Create forgot password form
     */
    createForm() {
        this.form = this.fb.group({
            username: [this.securitydata.username, Validators.compose([Validators.required , Validators.email])],
            confirm_password: ['', Validators.compose([Validators.required , Validators.minLength(8)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        });
    }

    /**
     * On submit forgot password form
     * @param event
     */
    onSubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successMes = '';
        const formData = this.form.value;
        if ( this.form.status === 'VALID') {
            const params = {
                username: formData.username,
                action: actions['UPDATE_PWD'],
                password: formData.password,
                confirmPassword: formData.confirm_password,
                securityQuestion1: this.securitydata.securityQuestion1,
                securityQuestion2: this.securitydata.securityQuestion2,
                securityQuestion3: this.securitydata.securityQuestion3,
                securityAnswer1: this.securitydata.securityAnswer1,
                securityAnswer2: this.securitydata.securityAnswer2,
                securityAnswer3: this.securitydata.securityAnswer3,
            };
            this.login.sendPassByMail( params ).subscribe((response:any) => {
                if(response.response.message)
                {
                    this.userlogin(formData);
                    this.successMes = response.response.message;
                }
            }, (err:any)=>{
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
            this.errMes['username'] = 'Please enter valid email id of your account';

        }
        if(this.form.controls['password'].status === 'INVALID'){
            this.errMes['password'] = 'Password must be at least 8 char. long with uppercase, lowercase letters and numbers';

        }
        if(this.form.controls['confirm_password'].status === 'INVALID'){
            this.errMes['confirm_password'] = 'Password and Reconfirm Password should match';

        }
    }


    userlogin(formData){
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




}
