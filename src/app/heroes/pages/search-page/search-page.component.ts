import { Component } from '@angular/core';
import { HeroesService } from '../../services/heores.service';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``
})
export class SearchPageComponent {

    searchInput = new FormControl('')

    heroes: Hero[] = [];

    selectedHero?: Hero ;

    constructor(
        private serviceHeroes: HeroesService
    ){}

    searchHero(): void{
        const value: string = this.searchInput.value || '';
        
        this.serviceHeroes.getSuggestions(value)
        .subscribe( heroes => {
            this.heroes = heroes;
        })
    }

    onSelectedOption( event: MatAutocompleteSelectedEvent ): void{
        console.log(event.option.value);
        
        if(!event.option.value){
            this.selectedHero = undefined;
            return
        }

        this.selectedHero = event.option.value;
        this.searchInput.setValue(this.selectedHero!.superhero)
    }
}
