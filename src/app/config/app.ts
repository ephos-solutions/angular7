import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Provider, Type, ModuleWithProviders ,ErrorHandler } from '@angular/core';
import { HttpClientModule , HTTP_INTERCEPTORS} from '@angular/common/http';
import { CoreModule } from './../modules/core/core.module';
import { TitleService } from '../services/title.service';
import { MDBBootstrapModule} from 'angular-bootstrap-md';
import { EosHttpInterceptor } from '../classes/http-interceptor.class';
import { ErrorInterceptor } from '../classes/error.interceptor';
import { cavelogErrorHandler } from '../classes/cavelogErrorHandler';
import {AuthGuard} from '../guards/auth-guard.service';
import {HelperService} from '../services/helper.service';


/**
 * Site wide modules
 *
 * These modules are grouped and available throughout the sites
 * Any modules which will need to be injected in all sites, will be placed here.
 */
export const CommonModules: Array<Type<any> | ModuleWithProviders | any[]> = [
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
];

/**
 * Site wide providers
 *
 * These providers are grouped and available throughout sites
 */
export const CommonProviders: Provider[] = [
    TitleService,
    HelperService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: EosHttpInterceptor,
        multi: true,
    },
    AuthGuard
   //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //{provide: ErrorHandler, useClass: cavelogErrorHandler}
];
