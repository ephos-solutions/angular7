import { Observable, throwError} from 'rxjs';
import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {api_base_url, errorCodes, x_messageId} from '../config/constant';
import {catchError, map, mergeMap} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class EosHttpInterceptor implements HttpInterceptor {
    private login;
    constructor(private http: HttpClient,private auth:AuthService) {
        //this.login = this.inj.get(AuthService);
    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

        if(request.method === 'GET') {
            return next.handle(request.clone({
                setHeaders: {
                    'Content-Type': 'application/json',
                    'x-MessageId': x_messageId
                }
            })).pipe(
                map(
                    resp=>{
                        return resp;
                    }
                ),
                catchError(err => {
                    if (err instanceof HttpErrorResponse) {

                        if (err.status === 401) {//TODO make it 401

                            const option = new FormData();

                            option.append('refresh_token', localStorage.getItem('refresh_token') );
                            option.append('grant_type', 'refresh_token' );
                            const headers  = new HttpHeaders().set( 'authorization' , 'Basic d2ViOnNlY3JldA==');
                            const url = api_base_url + 'api/users/authorize-account';
                            return this.http.post(url,
                                option, { headers : headers }).pipe(
                                map((newToken: any) => {
                                    this.auth.setSession(newToken);
                                    if(newToken.access_token){
                                        request.headers.set('authorization','Bearer '+newToken.access_token);
                                    }
                                    return newToken;
                                }),
                                mergeMap(() =>
                                    next.handle(request.clone({
                                        setHeaders: {
                                            'Content-Type': 'application/json',
                                            'x-MessageId': x_messageId,
                                            'authorization': 'Bearer ' + localStorage.getItem('id_token')
                                        }
                                    }))
                                ),
                                catchError( error => {
                                    return [];
                                })
                            );
                        }
                        else{
                            return throwError(err);
                        }
                    }

                }));
        } else {
            if (request.url.endsWith('authorize-account')) {
                return next.handle(request.clone({
                    setHeaders: {
                        'x-MessageId': x_messageId
                    }
                }));
            } else {
                return next.handle(request.clone({
                    setHeaders: {
                        'Content-Type': 'application/json',
                        'x-MessageId': x_messageId
                    }
                })).pipe(
                    map(
                        resp=>{
                            return resp;
                        }
                    ),
                    catchError(err => {
                        if (err instanceof HttpErrorResponse) {

                            if (err.status === 401) {//TODO make it 401

                                const option = new FormData();

                                option.append('refresh_token', localStorage.getItem('refresh_token') );
                                option.append('grant_type', 'refresh_token' );
                                const headers  = new HttpHeaders().set( 'authorization' , 'Basic d2ViOnNlY3JldA==');
                                const url = api_base_url + 'api/users/authorize-account';
                                return this.http.post(url,
                                    option, { headers : headers }).pipe(
                                    map((newToken: any) => {

                                        this.auth.setSession(newToken);

                                        if(newToken.access_token){
                                            request.headers.set('authorization','Bearer '+newToken.access_token);
                                        }

                                        return newToken;
                                    }),
                                    mergeMap(() =>
                                        next.handle(request.clone({
                                            setHeaders: {
                                                'Content-Type': 'application/json',
                                                'x-MessageId': x_messageId,
                                                'authorization': 'Bearer ' + localStorage.getItem('id_token')
                                            }
                                        }))
                                    ),
                                    catchError( error => {
                                        return [];
                                    })
                                );
                            }
                            else{
                               return throwError(err);
                            }
                        }

                    }));
            }
        }
    }

}
