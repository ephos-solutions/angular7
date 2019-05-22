import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../../services/login.service';

@Component({
    selector: 'app-preferences',
    templateUrl: 'preferences.component.html',
    providers: [DatePipe],
    styleUrls: ["../../css/dashboard.css"]
})

export class PreferencesComponent implements OnInit {
    form: FormGroup;
    errMes = <any[]>[];
    successMes = '';
    res;

    constructor(
                 private title: TitleService,
                 private fb: FormBuilder,
                 private auth: AuthService,
                 private login: LoginService,
                 public  router: Router
    ){}

    /**
     * Initialize Component
     */
    ngOnInit() {
        this.getPreferences();
    }

    /**
     * Get Alert preferences
     */
    getPreferences() {
        this.login.getAlertPreference().subscribe((response: any) => {
            this.res = response.response;
            this.createPreferenceForm();
        }, (err: any) => {
            console.log(err.status);
            if (err.status === 400) {
                err.error.errors.forEach(errormsg => {
                    console.log(errormsg.errorMessage);
                });
            } else {
                console.log(err.status);
            }
        });
    }

    /**
     * Create Alert pref form
     */
    createPreferenceForm() {
        const alertByEmail = (this.res.alertByEmail === "N")? false : true;
        const alertByMobile = (this.res.alertByMobile === "N")? false : true;
        const pushNotifications = (this.res.pushNotifications === "N")? false : true;
        this.form = this.fb.group({
            alertByEmail: [alertByEmail, Validators.required ],
            alertByMobile: [alertByMobile, Validators.required ],
            alertEmail: [this.res.alertEmail, Validators.compose([Validators.required , Validators.email]) ],
            alertMobile: [this.res.alertMobile, Validators.required ],
            pushNotifications: [pushNotifications, Validators.required ]
        });
    }

    /**
     * On submit preference
     * @param event
     */
    onSubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successMes = '';
        const formData = this.form.value;

        if ( this.form.status === 'VALID') {
            const alertByEmail = (formData.alertByEmail === true)? "Y" : "N";
            const alertByMobile = (formData.alertByMobile === true)? "Y" : "N";
            const pushNotifications = (formData.pushNotifications === true)? "Y" : "N";
            const option = {
                alertByEmail:alertByEmail,
                alertByMobile: alertByMobile,
                alertEmail:formData.alertEmail,
                alertMobile:formData.alertMobile,
                pushNotifications:pushNotifications
            };
            this.login.updateAlertPreference( option ).subscribe((response: any) => {
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
        }
    }
}
