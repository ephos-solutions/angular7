import { Component, OnInit } from '@angular/core';
import { TitleService } from './../../../services/title.service';
import { LoginService } from './../../../services/login.service';
import { AuthService } from './../../../services/auth.service';
import {errorCodes, actions, popuperrorCodes, errorCodeMap} from './../../../config/constant';
import { FormGroup,  FormBuilder,  Validators ,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from './../../../services/helper.service';
declare var bootbox;


@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    securityform: FormGroup;
    errMes = {};
    successMes = '';
    successSecurityMes = '';
    formConfig = [];
    formControlLabel: string[] = [];
    formControlType: string[] = [];

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
        this.title.setTitle('Forgot Password');
        this.createForm();
    }

    /**
     * Create forgot password form
     */
    createForm() {
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required , Validators.email])],
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
            //which API to use for checking user activate or not on forgot password page by passing only username

            const option = { username : formData.username};
            this.login.getSecurityChallange( option ).subscribe((response: any) => {
                if(response) {
                    this.title.setTitle('Security Challenge');
                    this.createSecurityChallenge(response.response, formData.username);
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
                        }else if(errormsg.errorCode === errorCodes['NO_SECURITY_QUESTIONS']){
                            if(this.helper.inArray(errormsg.errorCode,popuperrorCodes)){
                                //show popup message then redirect
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
                                                    self.sendTempPassByEmail(formData.username);
                                                }
                                            }
                                        },callback: function () {
                                            self.sendTempPassByEmail(formData.username);
                                        }

                                    }).find('.modal-dialog').css('padding-top', '15%');
                                } else {
                                    setTimeout(function () {
                                        window.alert(errormsg.errorMessage);
                                    }, 0);
                                    this.sendTempPassByEmail(formData.username);
                                }

                            }else {
                                this.sendTempPassByEmail(formData.username);
                            }
                        }
                        else {
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
    }


    onSecuritySubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successSecurityMes = '';
        const formData = this.securityform.value;
        if (this.securityform.status === 'VALID') {
            const params = {
                username: formData.username,
                action: actions['VALIDATE'],
                securityQuestion1: formData.securityQuestion1,
                securityQuestion2: formData.securityQuestion2,
                securityQuestion3: formData.securityQuestion3,
                securityAnswer1: formData.securityAnswer1,
                securityAnswer2: formData.securityAnswer2,
                securityAnswer3: formData.securityAnswer3,
            };
            this.login.sendPassByMail( params ).subscribe((response:any) => {
                if(response.response.message)
                {
                    this.successSecurityMes = response.response.message;
                }
            }, (err:any)=>{
                if (err.status === 400 || err.status === 404) {
                    err.error.errors.forEach(errormsg => {
                        if (errormsg.errorCode === errorCodes['USER_ACCOUNT_NOT_ACTIVATED']) {
                            if (this.helper.inArray(errormsg.errorCode, popuperrorCodes)) {
                                //show popup message then redirect
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
                            } else {
                                this.router.navigate(['/user/activate/' + formData.username]);
                            }
                        } else {
                            if (errormsg.errorMsgTitle && (errormsg.errorMsgTitle !== '' || errormsg.errorMsgTitle !== null)) {
                                this.errMes['error'] = errormsg.errorMessage;
                            } else {
                                this.errMes[errorCodeMap[errormsg.errorCode]] = errormsg.errorMessage;
                            }

                        }
                    });
                }else{
                    console.log(err);
                }
            });
        }
        if(this.securityform.controls['username'].status === 'INVALID'){
            this.errMes['username'] = 'Please provide valid email id';

        }
        if(this.securityform.controls['securityAnswer1'].status === 'INVALID'){
            this.errMes['securityAnswer1'] = 'Please enter your answer (1)';

        }
        if(this.securityform.controls['securityAnswer2'].status === 'INVALID'){
            this.errMes['securityAnswer2'] = 'Please enter your answer (2)';

        }
        if(this.securityform.controls['securityAnswer3'].status === 'INVALID'){
            this.errMes['securityAnswer3'] = 'Please enter your answer (3)';

        }
    }

    sendTempPassByEmail(user)
    {
        const params = {
            username: user,
            action: actions['RESET_CODE']
        };
        this.login.sendPassByMail( params ).subscribe((responseMail:any) => {
            if(responseMail.response.message)
            {
                this.successMes = responseMail.response.message;
            }
        }, (errMail:any)=> {
            if (errMail.status === 400 || errMail.status === 404) {
            errMail.error.errors.forEach(errormsg => {
                if (errormsg.errorCode === errorCodes['USER_ACCOUNT_NOT_ACTIVATED']) {
                    if (this.helper.inArray(errormsg.errorCode, popuperrorCodes)) {
                        //show popup message then redirect
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
                                            self.router.navigate(['/user/activate/' + user]);
                                        }
                                    }
                                },callback: function () {
                                    self.router.navigate(['/user/activate/' + user]);
                                }

                            }).find('.modal-dialog').css('padding-top', '15%');
                        } else {
                            setTimeout(function () {
                                window.alert(errormsg.errorMessage);
                            }, 0);
                            this.router.navigate(['/user/activate/' + user]);
                        }
                    } else {
                        this.router.navigate(['/user/activate/' + user]);
                    }
                } else {
                    if (errormsg.errorMsgTitle && (errormsg.errorMsgTitle !== '' || errormsg.errorMsgTitle !== null)) {
                        this.errMes['error'] = errormsg.errorMessage;
                    } else {
                        this.errMes[errorCodeMap[errormsg.errorCode]] = errormsg.errorMessage;
                    }

                }
            });
        }else{
                console.log(errMail);
            }
        });
    }

    createSecurityChallenge(formelement , username)
    {
        console.log(formelement);
        this.securityform = this.fb.group({});
        let index = 1;
        let counter = 1;
        this.securityform.addControl('username', new FormControl(username, Validators.compose([Validators.required,, Validators.email])));
        Object.keys(formelement).forEach(element=> {
            if(element.startsWith('securityQuestionDesc')) {
                this.formControlLabel['securityAnswer' + counter] = formelement[element];
                //this.fconfig['securityAnswer' + counter] = {'label' : formelement[element],'type': 'text'};
                counter = counter + 1;
            }
            else{
                if(element.startsWith('username')) {
                }else{
                    this.formConfig.push(element);
                    this.formControlType[element] = 'hidden';
                    //this.fconfig[element] = {'type':'hidden','label': ''};
                    this.formControlLabel[element] = '';
                    this.securityform.addControl(element, new FormControl(formelement[element], Validators.compose([Validators.required])));
                    this.formConfig.push('securityAnswer' + index);
                    this.formControlType['securityAnswer' + index] = 'text';
                    this.securityform.addControl('securityAnswer' + index, new FormControl('', Validators.compose([Validators.required])));

                    index = index + 1;
                }

            }
            console.log(this.formConfig);
        });

    }

    redirectToChangePassword()
    {
        this.sendTempPassByEmail(this.securityform.value.username);
    }

    redirectToLogin(){
        this.router.navigate(['/login']);
    }


}
