import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch,  Route, UrlSegment, GuardResult, MaybeAsync, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate {

    constructor(
        private serviceAuth: AuthService,
        private router: Router
    ) { }

    private checkAuthStatus(): MaybeAsync<GuardResult>{
        return this.serviceAuth.checkAuth()
        .pipe(
            tap( isAuth => {
                if(!isAuth) this.router.navigate(['/auth/login'])
            })
        )
    }

    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        // console.log('can match');
        // console.log({route, segments});
        
        return this.checkAuthStatus();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        // console.log('can activated');        
        // console.log({route, state});
        

        return this.checkAuthStatus();
    }
    
}