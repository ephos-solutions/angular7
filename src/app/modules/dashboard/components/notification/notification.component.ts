import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../../../../services/login.service';

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    providers: [DatePipe],
    styleUrls: ["../../css/dashboard.css"]
})
export class NotificationComponent implements OnInit {

    form: FormGroup;
    errMes = <any[]>[];
    successMes = '';
    res;
    warrExpAltertsList = [];
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
        this.getMyNotifications();
    }

    onChange(event) {
        this.form.controls['warrExpAlterts'].setValue(event.target.options[event.target.selectedIndex].text);
    }

    /**
     * Get my notifications
     */
    getMyNotifications() {
        this.login.getMyNotifications().subscribe((response: any) => {
            this.res = response.response;
            this.createNotificationForm();
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

    createNotificationForm()
    {
        this.getWarrantyExpiry();

        console.log(this.warrExpAltertsList);
        const importantProductAlerts = (this.res.importantProductAlerts === "N")? false : true;
        const productDealAlerts = (this.res.productDealAlerts === "N")? false : true;
        const rebateAlerts = (this.res.rebateAlerts === "N")? false : true;
        this.form = this.fb.group({
            warrExpAlterts: [this.res.warrExpAlterts, Validators.required ],
            warrExpAltertsId: [this.res.warrExpAltertsId, Validators.required ],
            rebateAlerts: [rebateAlerts, Validators.required ],
            productDealAlerts: [productDealAlerts, Validators.required ],
            importantProductAlerts: [importantProductAlerts, Validators.required ]
        });
    }

    getWarrantyExpiry(){
        this.login.getMasterWarrantyExpiry().subscribe((response: any) => {
            console.log(response);
            if(response.response.list){
                const list = response.response.list;
                Object.keys(list).forEach(index=> {
                    this.warrExpAltertsList[list[index]['id']]= list[index]['value'];
                });
            }
        }, (err: any) => {
            console.log(err.status);
        });
    }

    /**
     * On submit notification
     * @param event
     */
    onSubmit(event: Event): void {
        event.preventDefault()
        this.errMes = [];
        this.successMes = '';
        const formData = this.form.value;

        if ( this.form.status === 'VALID') {
            const rebateAlerts = (formData.rebateAlerts === true)? "Y" : "N";
            const productDealAlerts = (formData.productDealAlerts === true)? "Y" : "N";
            const importantProductAlerts = (formData.importantProductAlerts === true)? "Y" : "N";
            const option = {
                rebateAlerts:rebateAlerts,
                productDealAlerts: productDealAlerts,
                importantProductAlerts:importantProductAlerts,
                warrExpAlterts:formData.warrExpAlterts,
                warrExpAltertsId:formData.warrExpAltertsId,
            };
            this.login.updateNotifications( option ).subscribe((response: any) => {
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
