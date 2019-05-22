import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { LoginService } from '../services/login.service';
import {errorCodes} from '../config/constant';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService,private login:LoginService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(request).pipe(catchError(err => {
            console.log(request);
            // if (err.status === 401) { //TODO make it 401
            //     alert('inside');
            //     // auto logout if 401 response returned from api
            //     this.handle401Error(request, next);
            //     // this.authenticationService.logout();
            //     // location.reload(true);
            // }
            //
            // const error = err.error.message || err.statusText;
            return throwError(err);
        }))
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        const option = new FormData();

        option.append('refresh_token', localStorage.getItem('refresh_token') );
        option.append('grant_type', 'refresh_token' );

        return this.login.authenticateUser( option ).subscribe((response: any) => {
            console.log(req);
            console.log(response);
            //console.log(response);
            // this.auth.setSession(response);
            // if (response.access_token) {
            //     this.router.navigate(['/dashboard']);
            //
            // }
        }, (err: any) => {
            console.log(err);
            //return this.authenticationService.logout();
        });


            // return this.login.authenticateUser(option)
            //     .subscribe((newToken: string) => {
            //         if (newToken) {
            //             return next.handle(this.addToken(this.getNewRequest(req), newToken));
            //         }
            //
            //         // If we don't get a new token, we are in trouble so logout.
            //         this.authenticationService.logout();
            //         location.reload(true);
            //     })
            //     .catch(error => {
            //         // If there is an exception calling 'refreshToken', bad news so logout.
            //         return this.authenticationService.logout();
            //     });
    }

    getNewRequest(req: HttpRequest<any>): HttpRequest<any> {
        if (req.url.indexOf('getData') > 0) {
            return new HttpRequest('GET', 'http://private-4002d-testerrorresponses.apiary-mock.com/getData');
        }

        return new HttpRequest('GET', 'http://private-4002d-testerrorresponses.apiary-mock.com/getLookup');
    }


    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }})
    }
}
