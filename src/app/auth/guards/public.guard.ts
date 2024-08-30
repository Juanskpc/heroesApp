import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, RouterStateSnapshot, GuardResult, MaybeAsync, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanActivate, CanMatch{

    constructor(
        private serviceAuth: AuthService,
        private router: Router
    ) { }

    private checkLogin(): MaybeAsync<GuardResult>{
        return this.serviceAuth.checkAuth()
        .pipe(
            tap( isAuth => console.log('Auth', isAuth)),
            tap( isAuth => {
                if( isAuth ) {
                    this.router.navigate(['/'])
                }
            }),
            map( isAuth => !isAuth)
        )
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return this.checkLogin();
    }
    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        return this.checkLogin();
    }
    
}