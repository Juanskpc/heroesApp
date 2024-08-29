import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heores.service';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-new-page',
    templateUrl: './new-page.component.html',
    styles: ``
})
export class NewPageComponent implements OnInit {

    formHero = new FormGroup({
        id: new FormControl<string>(''),
        superhero: new FormControl<string>('', { nonNullable: true }),
        publisher: new FormControl<Publisher>(Publisher.DCComics),
        alter_ego: new FormControl<string>(''),
        first_appearance: new FormControl<string>(''),
        characters: new FormControl<string>(''),
        alt_img: new FormControl<string>(''),
    })

    publishers = [
        { id: 'DC Comics', desc: 'DC - Comics' },
        { id: 'Marvel Comics', desc: 'Marvel - Comics' }
    ]

    constructor(
        private serviceHero: HeroesService,
        private serviceActivatedRoute: ActivatedRoute,
        private serviceRouter: Router,
        private serviceMensaje: MatSnackBar,
        private serviceDialog: MatDialog
    ) { }

    ngOnInit(): void {
        if (!this.serviceRouter.url.includes('edit')) return;

        this.serviceActivatedRoute.params
            .pipe(
                switchMap(({ id }) => this.serviceHero.getHeroById(id))
            ).subscribe(hero => {
                if (!hero) {
                    this.serviceRouter.navigate(['/']);
                }

                this.formHero.reset(hero);
                return;
            })
    }

    get currentHero(): Hero {
        const hero = this.formHero.value as Hero;

        return hero;
    }

    onSubmit(): void {
        if (this.formHero.invalid) return;

        if (this.formHero.value.id) {
            this.serviceHero.updateHero(this.currentHero)
                .subscribe(hero => {
                    // TODO mostrar snackbar
                    this.showSnackbar(`${hero.superhero} updated!`)
                })

            return;
        }

        this.serviceHero.addHero(this.currentHero)
            .subscribe(hero => {
                // TODO mostrar snackbar y navegar a /heroes/edit hero.id
                this.showSnackbar(`${hero.superhero} created!`)
                this.serviceRouter.navigate(['/heroes/edit', hero.id])
            })
    }

    onDeleteHero() {
        if (!this.currentHero.id) throw Error('Hero id is required!')

        const dialogRef = this.serviceDialog.open(ConfirmDialogComponent, {
            data: this.formHero.value
        })

        dialogRef.afterClosed()
        .pipe(
            filter( (result: boolean) => result),
            switchMap( () =>  this.serviceHero.deleteHero(this.currentHero.id)),
            filter( (wasDeleted: boolean) => wasDeleted)
        )
        .subscribe( result => 
            this.serviceRouter.navigate(['/'])
        )

        // dialogRef.afterClosed().subscribe(result => {
        //     if( !result ) return;

        //     this.serviceHero.deleteHero(this.currentHero.id)
        //     .subscribe( deleted => {
        //         if( !deleted ) return;
        //         this.serviceRouter.navigate(['/'])
        //     })
            
        // })
    }

    showSnackbar(message: string): void {
        this.serviceMensaje.open(message, 'ok', {
            duration: 2500
        })
    }
}
