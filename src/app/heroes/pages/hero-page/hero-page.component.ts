import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: ``
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private serviceHeroes: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      delay(1000),
      switchMap( ({id}) => this.serviceHeroes.getHeroById(id) )
    )
    .subscribe( hero => {
      console.log({hero});
      if(!hero) return this.router.navigate(['/heroes/list'])

      this.hero = hero;
      return hero;
    })
  }

  goBack():void{
    this.router.navigate(['/heroes/list'])
  }

}
