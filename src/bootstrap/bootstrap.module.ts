import { BootstrapComponent } from '../app/modules/core/components/bootstrap/bootstrap.component';
import { RouterModule } from '@angular/router';
import { routes } from '../app/config/routes';
import { NgModule } from '@angular/core';
import { CommonModules, CommonProviders  } from '../app/config/app';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';




@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModules
  ],
    providers: [
      {provide: LocationStrategy, useClass: HashLocationStrategy},
        CommonProviders,

    ],
  bootstrap: [BootstrapComponent]
})
export class BootStrapModule  {

  constructor() {}
}
