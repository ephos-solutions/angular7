import { Component, OnInit, Input } from '@angular/core';
import { TitleService } from './../../../services/title.service';
import { LoginService } from './../../../services/login.service';
import { AuthService } from './../../../services/auth.service';
import {errorCodes, errorCodeMap, popuperrorCodes , crypto_key} from './../../../config/constant';
import { FormGroup,  FormBuilder,  Validators  } from '@angular/forms';
import { Router ,ActivatedRoute } from '@angular/router';
import { HelperService } from './../../../services/helper.service';
declare var bootbox;
import * as CryptoJS from 'crypto-js';


@Component({
    selector: 'app-activation',
    templateUrl: './activation.component.html'
})
export class ActivationComponent implements OnInit {
    form: FormGroup;
    errMes;
    successMes = '';
    username = '';
    pass = '';
    code = '';
    @Input() userdata;
    @Input() mes;
    activationFlag = false;
    activationsuccessMes = '';


    /**
     * Constructor for forgot password
     * @param title
     * @param fb
     * @param login
     */
    constructor( private title: TitleService,
                 private route: ActivatedRoute,
                 private fb: FormBuilder,
                 private login: LoginService,
                 private auth: AuthService,
                 private helper: HelperService,
                 public  router: Router) {}

    /**
     * Start Activation
     */
    ngOnInit() {
        this.errMes = [];
        this.successMes = '';
        if(this.userdata){
            this.username = this.userdata.username;
        }else {
            this.username = this.route.snapshot.params['username'];
        }
        this.pass= this.route.snapshot.params['pass'];
        if(this.pass !== undefined){
             //U2FsdGVkX1++whXo0tZuiVZMAx3m9yNmQdn8HiKqGa4=
             this.pass = CryptoJS.AES.decrypt(this.pass,crypto_key ).toString(CryptoJS.enc.Utf8);
        }

        this.code= this.route.snapshot.params['code'];
        if(this.code !== undefined){
            this.activationFlag = true;
            //direct submit form
            const option = { username : this.username , activationCode :this.code };
            this.login.activateUser( option ).subscribe((response: any) => {

                    if (response.response.message) {
                        this.activationsuccessMes = response.response.message;
                    }

            }, (err: any) => {
                if (err.status === 400 || err.status === 404) {
                    err.error.errors.forEach(errormsg => {
                            if (errormsg.errorMsgTitle && (errormsg.errorMsgTitle !== '' || errormsg.errorMsgTitle !== null)) {
                                this.errMes['error'] = errormsg.errorMessage;
                            } else {
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

        this.title.setTitle('Account Activation');
        this.createForm();
    }

    /**
     * Create Activation form
     */
    createForm() {
        this.form = this.fb.group({
            username: [this.username, Validators.compose([Validators.required , Validators.email])],
            activationCode: [this.code, Validators.compose([Validators.required ])],
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
            const option = { username : formData.username , activationCode :formData.activationCode };
            this.login.activateUser( option ).subscribe((response: any) => {
                if(this.userdata){
                    //call login API redirect dashboard
                    if (typeof bootbox !== 'undefined') {
                        const self = this;
                        bootbox.dialog({
                            title: 'Redirecting please wait',
                            message: response.response.message,
                            buttons: {
                                ok: {
                                    label: 'Ok',
                                    className: 'btn-facebook',
                                    callback: function(){
                                        self.userlogin(this.userdata.username, this.userdata.password);
                                    }
                                }
                            },callback: function () {
                                self.userlogin(this.userdata.username, this.userdata.password);
                            }

                        }).find('.modal-dialog').css('padding-top', '15%');

                    } else {
                        setTimeout(function () {
                            window.alert(response.response.message);
                        }, 0);
                        this.userlogin(this.userdata.username, this.userdata.password);
                    }

                }else if(this.username.trim() !== '' && this.pass.trim() !== ''){
                    if (typeof bootbox !== 'undefined') {
                        const self = this;
                        bootbox.dialog({
                            title: 'Redirecting please wait',
                            message: response.response.message,
                            buttons: {
                                ok: {
                                    label: 'Ok',
                                    className: 'btn-facebook',
                                    callback: function(){
                                        self.userlogin(this.username,this.pass);
                                    }
                                }
                            },callback: function () {
                                self.userlogin(this.username,this.pass);
                            }

                        }).find('.modal-dialog').css('padding-top', '15%');

                    } else {
                        setTimeout(function () {
                            window.alert(response.response.message);
                        }, 0);
                        this.userlogin(this.username,this.pass);
                    }

                }
                else {
                    if (response.response.message) {
                        this.successMes = response.response.message;
                    }
                }
            }, (err: any) => {
                if (err.status === 400 || err.status === 404) {
                    err.error.errors.forEach(errormsg => {
                    if (errormsg.errorCode === errorCodes['ACCOUNT_ALREADY_ACTIVE']) {
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
                                                self.router.navigate(['/login']);
                                            }
                                        }
                                    },callback: function () {
                                        self.router.navigate(['/login']);
                                    }

                                }).find('.modal-dialog').css('padding-top', '15%');

                            } else {
                                setTimeout(function () {
                                    window.alert(errormsg.errorMessage);
                                }, 0);
                                this.router.navigate(['/login']);
                            }

                        }else {
                            this.router.navigate(['/login']);
                        }
                    }else {
                        if (errormsg.errorMsgTitle && (errormsg.errorMsgTitle !== '' || errormsg.errorMsgTitle !== null)) {
                            this.errMes['error'] = errormsg.errorMessage;
                        } else {
                                const key = errorCodeMap[errormsg.errorCode];
                                const value = errormsg.errorMessage;
                                this.errMes[key] = value;

                        }
                    }
                    });
                }else{
                    console.log(err);
                }

            });
        }
        if(this.form.controls['username'].status === 'INVALID'){
            this.errMes['username'] = 'Please enter valid email id of your account';

        }
        if(this.form.controls['activationCode'].status === 'INVALID'){
            this.errMes['activationCode'] = 'Enter the Activation Code received by email';

        }
    }

    getActivationCode()
    {
        const formData = this.form.value;

            this.login.getActivationCode(formData.username).subscribe((response: any) => {
                if (response.response.message) {
                    this.successMes = response.response.message;
                }
            }, (err: any) => {
                if (err.status === 400 || err.status === 404) {
                    err.error.errors.forEach(errormsg => {
                    if (errormsg.errorCode === errorCodes['ACCOUNT_ALREADY_ACTIVE']) {
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
                                                self.router.navigate(['/login']);
                                            }
                                        }
                                    },callback: function () {
                                        self.router.navigate(['/login']);
                                    }

                                }).find('.modal-dialog').css('padding-top', '15%');
                            } else {
                                setTimeout(function () {
                                    window.alert(errormsg.errorMessage);
                                }, 0);
                                this.router.navigate(['/login']);
                            }
                        }else {
                            this.router.navigate(['/login']);
                        }
                    }else {
                        if (errormsg.errorMsgTitle && (errormsg.errorMsgTitle !== '' || errormsg.errorMsgTitle !== null)) {
                            this.errMes['error'] = errormsg.errorMessage;
                        } else {
                                const key = errorCodeMap[errormsg.errorCode];
                                const value = errormsg.errorMessage;
                                this.errMes[key] = value;

                        }
                    }
                    });
                }else{
                    console.log(err);
                }

            });

    }

    userlogin(username, password){
        const option = new FormData();
        option.append('password', password );
        option.append('username', username );
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
                                                self.router.navigate(['/user/activate/' + this.userdata.username]);
                                            }
                                        }
                                    },callback: function () {
                                        self.router.navigate(['/user/activate/' + this.userdata.username]);
                                    }

                                }).find('.modal-dialog').css('padding-top', '15%');

                            } else {
                                setTimeout(function () {
                                    window.alert(errormsg.errorMessage);
                                }, 0);
                                this.router.navigate(['/user/activate/' + this.userdata.username]);
                            }

                        }else {
                            this.router.navigate(['/user/activate/' + this.userdata.username]);
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
