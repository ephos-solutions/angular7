import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../../../../services/login.service';
declare var bootbox;
@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
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
            console.log(this.res);
            this.getStates();
            console.log(this.states);
            this.createAccountForm();
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


    getStates(){
        this.login.getMasterStates().subscribe((response: any) => {
            console.log(response);
            if(response.response.list){
                const list = response.response.list;
                Object.keys(list).forEach(index=> {
                    this.states[list[index]['id']]= list[index]['value'];
                });
            }
        }, (err: any) => {
            console.log(err.status);
        });
    }


    createAccountForm()
    {
        this.form = this.fb.group({
            firstname: [this.res.firstname, Validators.required ],
            lastname: [this.res.lastname, Validators.required ],
            telephone: [this.res.telephone, Validators.required ],
            addrline1: [this.res.addrline1],
            addrline2: [this.res.addrline2],
            city: [this.res.city, Validators.required ],
            zipcode: [this.res.zipcode, Validators.compose([Validators.required,,Validators.minLength(5)]) ],
            state_id: [this.res.state_id, Validators.required ],
            country: [this.res.country, Validators.required ],
            username: [this.res.username, Validators.compose([Validators.required , Validators.email])],
        });
    }

    onSubmit(event: Event): void {
        event.preventDefault()

        const formData = this.form.value;
        const self = this;
        if(formData.username !== this.res.username) {
            bootbox.dialog({
                message: "Are you sure, you want to change username?",
                className: 'warning-notification-msg',
                onEscape: true,
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success',
                        callback: function (result) {
                                    if (result) {
                                        self.updateMyProfile(formData);
                                    }
                        }
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                }
            }).find('.modal-dialog').css('padding-top', '15%');
        }else{
            this.updateMyProfile(formData);
        }
    }

    updateMyProfile(formData){
        console.log(formData);
        this.errMes = [];
        this.successMes = '';
        if ( this.form.status === 'VALID') {
            const option = {
                addrline1: formData.addrline1,
                addrline2: formData.addrline2,
                city: formData.city,
                country: formData.country,
                firstname: formData.firstname,
                lastname: formData.lastname,
                state_id: formData.state_id,
                telephone: formData.telephone,
                username: formData.username,
                zipcode: formData.zipcode
            };
            this.login.updateMyProfile( option ).subscribe((response: any) => {
                if(response) {
                    this.successMes = 'Your profile updated successfully';
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
        }if(this.form.controls['city'].status === 'INVALID'){
            this.errMes['city'] = 'Please enter your city';
            console.log(this.errMes);
        }
        if(this.form.controls['country'].status === 'INVALID'){
            this.errMes['country'] = 'Please enter your country';
            console.log(this.errMes);
        }
        if(this.form.controls['state_id'].status === 'INVALID'){
            this.errMes['state_id'] = 'Please select your state';
            console.log(this.errMes);
        }
        if(this.form.controls['zipcode'].status === 'INVALID'){
            this.errMes['zipcode'] = 'Please enter your zip code';
            console.log(this.errMes);
        }
    }


}
