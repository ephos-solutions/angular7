import { CoreModule } from '../core/core.module';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRootComponent } from './components/dashboard-root/dashboard-root.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { MDBBootstrapModule} from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { MatSlideToggleModule} from '@angular/material'
import {MatSelectModule} from '@angular/material/select';
import {ChangePasswordProfileComponent} from './components/change-password/change-password.component';
import {SecurityChallengeComponent } from './components/security-challenge/security-challenge.component';
import {PrivacyComponent} from './components/privacy/privacy.component';

//import {HeaderComponent} from '../core/components/header/header.component';

const routes : Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DashboardRootComponent,
            }
        ]
    },
];

@NgModule({
    declarations: [
        DashboardRootComponent,
        ProfileComponent,
        NotificationComponent,
        PreferencesComponent,
        ChangePasswordProfileComponent,
        SecurityChallengeComponent,
        PrivacyComponent
       // HeaderComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MDBBootstrapModule,
        MatSlideToggleModule,
        MatSelectModule
    ],
    providers: [
       AuthService,
        LoginService
    ]
})
export class DashboardModule { }
