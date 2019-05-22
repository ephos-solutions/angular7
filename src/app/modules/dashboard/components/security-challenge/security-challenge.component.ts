import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../../../../services/login.service';

@Component({
    selector: 'app-security-challenge',
    templateUrl: 'security-challenge.component.html',
    providers: [DatePipe]
})
export class SecurityChallengeComponent implements OnInit {
    form: FormGroup;
    errMes = <any[]>[];
    successMes = '';
    res;
    formControlLabel: string[] = [];
    objectKeys = Object.keys;
    @Input() userid: any;
    @Input() userdata: any;

    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private auth: AuthService,
                 private login: LoginService,
                 public  router: Router) {}

    /**
     * Initialize Component
     */
    ngOnInit() {
        this.getSecurityQuestions();
    }

    getSecurityQuestions() {
        this.login.getSecurityQuestions().subscribe((response: any) => {
            this.res = response.response;
            this.createAccountForm();
        }, (err: any) => {
            if (err.status === 400) {
                console.log(err.error.errors);
                err.error.errors.forEach(errormsg => {
                    console.log(errormsg.errorMessage);
                });
            } else {
                console.log(err.status);
            }
        });
    }



    createAccountForm()
    {
        let securityQuestionData:any[] = [];
        let securityAnswerData:any[] = [];
        if(this.userdata){
            if(this.userdata['securityQuestion1']!==undefined){
                 securityQuestionData[1] = this.userdata['securityQuestion1'];
            }
            if(this.userdata['securityQuestion2']!==undefined){
                 securityQuestionData[2] = this.userdata['securityQuestion2'];
            }
            if(this.userdata['securityQuestion3']!==undefined){
                 securityQuestionData[3] = this.userdata['securityQuestion3'];
            }
            if(this.userdata['securityAnswer1']!==undefined){
                 securityAnswerData[1] = this.userdata['securityAnswer1'];
            }
            if(this.userdata['securityAnswer2']!==undefined){
                 securityAnswerData[2] = this.userdata['securityAnswer2'];
            }
            if(this.userdata['securityAnswer3']!==undefined){
                 securityAnswerData[3] = this.userdata['securityAnswer3'];
            }
        }
        console.log(securityAnswerData);
        console.log(securityQuestionData);

        this.form = this.fb.group({});
        let index = 1;
        this.form.addControl('currentPassword' , new FormControl('',Validators.compose([Validators.required ])));
        this.form.addControl('userid' , new FormControl(this.userid));
        Object.keys(this.res.list).forEach(element=> {
            this.formControlLabel[index] = this.res.list[element].value;
            if(index < 4) {
                if(securityQuestionData[index] === undefined || securityQuestionData[index] === ''){
                    securityQuestionData[index] = this.res.list[element].id;
                }
                if(securityAnswerData[index] === undefined || securityAnswerData[index] === ''){
                    securityAnswerData[index] = '';
                }
                this.form.addControl('securityQuestion' + index, new FormControl(securityQuestionData[index],Validators.compose([Validators.required ])));
                this.form.addControl('securityAnswer' + index, new FormControl(securityAnswerData[index] , Validators.compose([Validators.required ])));
                index = index + 1;
            }

        });
    }

    onSubmit(event: Event): void {
        event.preventDefault()
        const formData = this.form.value;
        this.errMes = [];
        this.successMes = '';
        if ( this.form.status === 'VALID') {
            if(this.validate(formData)) {
                const option = {
                    securityQuestion1: formData.securityQuestion1,
                    securityQuestion2: formData.securityQuestion2,
                    securityQuestion3: formData.securityQuestion3,
                    securityAnswer1: formData.securityAnswer1,
                    securityAnswer2: formData.securityAnswer2,
                    securityAnswer3: formData.securityAnswer3,
                    currentPassword: formData.currentPassword,
                    userid: formData.userid,
                };
                this.login.updateSecurity(option).subscribe((response: any) => {
                    if (response) {
                        this.successMes = (response.response.message);
                    }
                }, (err: any) => {
                    console.log(err);
                    if (err.status === 400) {
                        err.error.errors.forEach(errormsg => {
                            const key = errormsg.errorField;
                            const value = errormsg.errorMessage;
                            this.errMes[key] = value;
                        });
                    } else {
                        console.log(err.status);
                    }
                });
            }
        }
        if(this.form.controls['securityAnswer1'].status === 'INVALID'){
            this.errMes['securityAnswer1'] = 'Please enter your answer (1)';
            console.log(this.errMes);
        }
        if(this.form.controls['securityAnswer2'].status === 'INVALID'){
            this.errMes['securityAnswer2'] = 'Please enter your answer (2)';
            console.log(this.errMes);
        }
        if(this.form.controls['securityAnswer3'].status === 'INVALID'){
            this.errMes['securityAnswer3'] = 'Please enter your answer (3)';
            console.log(this.errMes);
        }
        if(this.form.controls['currentPassword'].status === 'INVALID'){
            this.errMes['currentPassword'] = 'Please enter your password';
            console.log(this.errMes);
        }
    }

    validate(formData){
        let flag = true;
        if(formData.securityQuestion1==formData.securityQuestion2){
            this.errMes['securityQuestion1'] = "Security question must be unique.";
            this.errMes['securityQuestion2'] = "Security question must be unique.";
            flag = false;
        }
        if(formData.securityQuestion1==formData.securityQuestion3){
            this.errMes['securityQuestion1'] = "Security question must be unique.";
            this.errMes['securityQuestion3'] = "Security question must be unique.";
            flag = false;
        }
        if(formData.securityQuestion2==formData.securityQuestion3){
            this.errMes['securityQuestion3'] = "Security question must be unique.";
            this.errMes['securityQuestion2'] = "Security question must be unique.";
            flag = false;
        }
        return  flag;

    }

    checkDuplicate(event) {
        let formData = this.form.value;
        this.errMes['securityQuestion1'] = "";
        this.errMes['securityQuestion2'] = "";
        this.errMes['securityQuestion3'] = "";
        if(formData.securityQuestion1==formData.securityQuestion2){
            this.errMes['securityQuestion1'] = "Security question must be unique.";
            this.errMes['securityQuestion2'] = "Security question must be unique.";
        }
        if(formData.securityQuestion1==formData.securityQuestion3){
            this.errMes['securityQuestion1'] = "Security question must be unique.";
            this.errMes['securityQuestion3'] = "Security question must be unique.";
        }
        if(formData.securityQuestion2==formData.securityQuestion3){
            this.errMes['securityQuestion3'] = "Security question must be unique.";
            this.errMes['securityQuestion2'] = "Security question must be unique.";
        }
        // alert(this.form.value.securityQuestion1);
        // alert(this.form.value.securityQuestion2);
        // alert(this.form.value.securityQuestion3);
        // alert(event.value);
    }
}
