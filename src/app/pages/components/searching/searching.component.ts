import { Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SearchingService } from 'src/app/services/searching.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatMenuTrigger} from '@angular/material/menu';
import { User } from '../../../models/user.model';
import { UpdateProfileService } from 'src/app/services/update-profile.service';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styles: [
  ]
})
export class SearchingComponent {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  public searchForm!: FormGroup;
  public searchResults$!: Observable<User[]> | undefined;
  public data = []


  constructor(
    private searchingService: SearchingService,
    private formBuilder: FormBuilder,
    public updateProfileService: UpdateProfileService
  ) { }

  ngOnInit(){
    this.searchForm = this.formBuilder.group({
      searchInput: ['']
    });
    this.searchResults$ = this.searchForm.get('searchInput')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(async (searchText: string) => {
        return await this.searchAsync(searchText);
      })
    );
  }

  async searchAsync(searchText: string): Promise<User[]> {
    if (!searchText) {
      this.menuTrigger.closeMenu();
    }
    this.menuTrigger.openMenu();
    this.searchingService.getResponse(searchText).subscribe(
      (resp: any) => { this.data = resp.data })
      if (!this.data.length) {
        this.menuTrigger.closeMenu();
      }
      return [...this.data] ;
  }
    
} 
