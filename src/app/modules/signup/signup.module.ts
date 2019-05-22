import { CoreModule } from '../core/core.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule} from 'angular-bootstrap-md';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import {ActivationComponent} from '../activation/activation/activation.component';
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'signup',
                component: SignupComponent,
            },
            {
                path: 'activate/:username',
                component: ActivationComponent,
            },
            {
                path: 'activate/:username/:pass',
                component: ActivationComponent,
            },
            {
                path: 'activate/:username/code/:code',
                component: ActivationComponent,
            },

        ]
    },

];

@NgModule({
    declarations: [
        SignupComponent,
        ActivationComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        MDBBootstrapModule,
        ReactiveFormsModule
    ],
    providers: [
        LoginService
    ]
})
export class SignupModule {
}
