import { Component, OnInit } from '@angular/core';
import { Router , NavigationEnd  } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls:["../../../../../assets/css/bootstrap.min.css","../../../../../assets/css/mdb.min.css","../../../../../assets/css/style.min.css"]
})

export class HeaderComponent implements OnInit {


    showNav: boolean = false;

    /**
     * Constructor for header
     */
    constructor(public auth: AuthService,
                private router: Router,
    ) {

        this.auth.currentUserSubject.subscribe(user => {
           // console.log('in');
           // console.log(user);
            if(user !== null){
                this.showNav = true;
            }
        });
    }

    /**
     * start component header
     */
    ngOnInit() {}

    redirectLogout(){
        this.auth.logout();
        this.router.navigate(['/logout']);
    }

    redirectHome(){
        if(this.showNav === true){
            this.router.navigate(['/dashboard']);
        }
        else{
            this.router.navigate(['/login']);
        }
    }

}
