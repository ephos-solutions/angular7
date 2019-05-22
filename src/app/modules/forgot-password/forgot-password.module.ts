import { CoreModule } from '../core/core.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MDBBootstrapModule} from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import {ChallengeVerifiedComponent} from '../change-password/challenge-verified/challenge-verified.component';
import {ChangePasswordComponent} from '../change-password/change-password/change-password.component';
//import {ChangePasswordModule} from '../change-password/change-password.module';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ForgotPasswordComponent,
            }
        ]
    },
];

@NgModule({
    declarations: [
        ForgotPasswordComponent,
        ChallengeVerifiedComponent,
        ChangePasswordComponent

    ],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        MDBBootstrapModule,
        ReactiveFormsModule,
    ],
    providers: [
        LoginService,
        AuthService
    ]
})
export class ForgotPasswordModule {
}
