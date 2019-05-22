import { CommonModule } from '@angular/common';
import { BootstrapComponent } from './components/bootstrap/bootstrap.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core/';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@NgModule({
    declarations: [
        BootstrapComponent,
        FooterComponent,
        HeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        BootstrapComponent,
        FooterComponent,
        HeaderComponent
    ],
    providers: [
        AuthService
    ]
})
export class CoreModule { }
