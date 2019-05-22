import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { api_base_url } from '../config/constant';

@Injectable()
export class LoginService {
    /**
     * Login service constructor
     * @param http
     */
    constructor(private http: HttpClient) {}

    /**
     * Signup api call
     * @param options
     */
    registerUser(options): Observable<any> {
        const url = api_base_url + 'api/users/create-account';
        return this.http.post(url,
            options).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    /**
     * User authentication api call
     * @param options
     */
    authenticateUser(options): Observable<any> {
        const headers  = new HttpHeaders().set( 'authorization' , 'Basic d2ViOnNlY3JldA==');
        const url = api_base_url + 'api/users/authorize-account';
        return this.http.post(url,
            options, { headers : headers }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    /**
     * Get user profile
     */
    getUserProfile(): Observable<any> {
        const url = api_base_url + 'api/users/get-my-profile';
        return this.http.get(url, {
            params: { access_token : localStorage.getItem('id_token')}
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getSecurityChallange(options): Observable<any> {
        const url = api_base_url + 'api/users/get-security-challenge';
        return this.http.get(url, {
            params: options
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    sendPassByMail(options): Observable<any> {
        const url = api_base_url + 'api/users/reset-lost-password';
        return this.http.put(url,
            options).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getAlertPreference(): Observable<any> {
        const url = api_base_url + 'api/users/get-alert-prefs';
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        return this.http.get(url, {
            headers: headers
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getMyNotifications(): Observable<any> {
        const url = api_base_url + 'api/users/get-user-notifs';
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        return this.http.get(url, {
            headers: headers
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }


    getSecurityQuestions(): Observable<any> {
        const url = api_base_url + 'api/reference/get-master/security_questions';
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        return this.http.get(url, {
            headers: headers
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }


    updateAlertPreference(options): Observable<any> {
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        const url = api_base_url + 'api/users/update-alert-prefs';
        return this.http.put(url,
            options, { headers : headers }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }
    updateNotifications(options): Observable<any> {
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        const url = api_base_url + 'api/users//update-user-notifs';
        return this.http.put(url,
            options, { headers : headers }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    updateMyProfile(options): Observable<any> {
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        const url = api_base_url + 'api/users/update-personal-info';
        return this.http.put(url,
            options, { headers : headers }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }


    updateSecurity(options): Observable<any> {
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        const url = api_base_url + 'api/users/update-security';
        return this.http.put(url,
            options, { headers : headers }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    activateUser(options): Observable<any> {
        const url = api_base_url + 'api/users/verify-account-activation?username='+options['username']+'&activationCode='+options['activationCode'];
        return this.http.put(url,
            options).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getActivationCode(username): Observable<any> {
        const url = api_base_url + 'api/users/resend-activation-code';
        return this.http.get(url, {
            params: { username : username}
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getMasterStates(): Observable<any> {
        const url = api_base_url + 'api/reference/get-master/states';
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        return this.http.get(url, {
            headers: headers
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    getMasterWarrantyExpiry(): Observable<any> {
        const url = api_base_url + 'api/reference/get-master/warranty_expiry_reminder_options';
        const headers  = new HttpHeaders().set( 'authorization' , 'Bearer '+localStorage.getItem('id_token'));
        return this.http.get(url, {
            headers: headers
        }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }


}
