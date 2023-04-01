import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, finalize, map, switchMap, tap} from 'rxjs/operators';
import {fromEvent, of} from 'rxjs';
import { SearchingService } from 'src/app/services/searching.service';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styles: [
  ]
})
export class SearchingComponent {
  public isLoading = false;
  public src!: string;
  public data$: any;
  constructor(private searchingService: SearchingService) {}
  search(value: any) {
    console.log(value)
    this.isLoading = true;

    // this.data$ = this.apiRest.searchTrack({query: value}).pipe(
    //   map(({tracks}) => tracks.items),
    //   finalize(() => this.isLoading = false)
    // )
  }
}
