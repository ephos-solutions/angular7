import { CoreModule } from '../core/core.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MDBBootstrapModule} from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
//import {HeaderComponent} from '../core/components/header/header.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LoginComponent,
            }
        ]
    },
];

@NgModule({
    declarations: [
        LoginComponent,
        //HeaderComponent

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
export class LoginModule {
}
