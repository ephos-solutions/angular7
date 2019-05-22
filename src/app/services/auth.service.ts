import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public currentUserSubject: BehaviorSubject<any>;


    constructor() {
        this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('id_token'));
    }


    /**
     * Set token and expiry time
     * @param authResult
     */
    public setSession(authResult) {
        const expireAt = moment().add(authResult.expires_in, 'second');
        localStorage.setItem( 'id_token' , authResult.access_token);
        localStorage.setItem( 'firstname' , authResult.firstname);
        localStorage.setItem( 'lastname' , authResult.lastname);
        localStorage.setItem( 'refresh_token' , authResult.refresh_token);
        localStorage.setItem( 'expires_at' , JSON.stringify(expireAt.valueOf()) );
        this.currentUserSubject.next(authResult.access_token);


    }



    logout() {
        localStorage.setItem('id_token',null);
        localStorage.removeItem('expires_at');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('refresh_token');
        localStorage.clear();
        this.currentUserSubject.next(null);
        console.log('nill');

    }

    public isLoggedIn() {
        const isLoggedInFlag =  moment().isBefore(this.getExpiration());
        return isLoggedInFlag;
    }

    isLoggedOut() {
        return localStorage.getItem('id_token');
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }


}
