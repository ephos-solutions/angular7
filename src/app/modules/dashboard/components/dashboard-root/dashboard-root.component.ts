import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../../../services/title.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginService } from '../../../../services/login.service';
import { ProfileComponent } from '../profile/profile.component';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard-root.component.html',
    providers: [DatePipe]
})
export class DashboardRootComponent implements OnInit {

    firstname: string;
    lastname: string;
    form: FormGroup;
    errMes = <any[]>[];
    successMes = '';
    res;

    constructor( private title: TitleService,
                 private fb: FormBuilder,
                 private auth: AuthService,
                 private login: LoginService,
                 public  router: Router) {
        console.log(localStorage.getItem('id_token'));
        this.auth.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('id_token'));
    }

    /**
     * Initialize Component
     */
    ngOnInit() {
        if (!this.auth.isLoggedIn()) {
            this.auth.logout();
            this.router.navigate(['/login']);
            return false;
        }
        this.title.setTitle('My Profile');
        this.firstname = localStorage.getItem('firstname');
        this.lastname = localStorage.getItem('lastname');
        //this.getMyProfile();

    }

    // getMyProfile() {
    //     this.login.getUserProfile().subscribe((response: any) => {
    //         this.res = response.response;
    //         console.log(this.res);
    //         this.createAccountForm();
    //     }, (err: any) => {
    //         console.log(err.status);
    //         if (err.status === 400) {
    //             console.log(err.error.errors);
    //             err.error.errors.forEach(errormsg => {
    //                 console.log(errormsg.errorMessage);
    //             });
    //         } else {
    //             console.log(err.status);
    //         }
    //     });
    // }
    //
    // createAccountForm()
    // {
    //     this.form = this.fb.group({
    //         firstname: [this.res.firstname, Validators.required ],
    //         lastname: [this.res.lastname, Validators.required ],
    //         telephone: [this.res.telephone, Validators.required ],
    //         addrline1: [this.res.addrline1, Validators.required ],
    //         addrline2: [this.res.addrline2, Validators.required ],
    //         city: [this.res.city, Validators.required ],
    //         zipcode: [this.res.zipcode, Validators.required ],
    //         state_id: [this.res.state_id, Validators.required ],
    //         country: [this.res.country, Validators.required ],
    //         username: [this.res.username, Validators.compose([Validators.required , Validators.email])],
    //     });
    // }
}
