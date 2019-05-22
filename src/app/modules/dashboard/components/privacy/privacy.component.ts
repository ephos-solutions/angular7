import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../../../../services/login.service';
declare var bootbox;
@Component({
    selector: 'app-privacy',
    templateUrl: 'privacy.component.html',
    providers: [DatePipe]
})
export class PrivacyComponent implements OnInit {
    form: FormGroup;
    errMes = <any[]>[];
    successMes = '';
    res;
    states = [];
    objectKeys = Object.keys;
    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private auth: AuthService,
                 private login: LoginService,
                 public  router: Router) {}

    /**
     * Initialize Component
     */
    ngOnInit() {
        this.getMyProfile();
    }

    getMyProfile() {
        this.login.getUserProfile().subscribe((response: any) => {
            this.res = response.response;
        }, (err: any) => {
            console.log(err.status);
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



}
