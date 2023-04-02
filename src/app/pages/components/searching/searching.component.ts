import { Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SearchingService } from 'src/app/services/searching.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UpdateProfileService } from 'src/app/services/update-profile.service';


@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styles: [
  ]
})
export class SearchingComponent {
  public openSearchBar: boolean = false;
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
      debounceTime(200),
      switchMap(async (searchText: string) => {
        return await this.searchAsync(searchText);
      })
    );
  }
  get toggleOpenBar(){ return !this.openSearchBar}

  async searchAsync(searchText: string): Promise<User[]> {
    if (!searchText) {
      return[]
    }
    this.searchingService.getResponse(searchText).subscribe(
      (resp: any) => {
        this.data = resp.data
        this.toggleOpenBar;
      })
      return [...this.data] ;
  }

  setProfile(profile: any) {
    this.searchForm.patchValue({ searchInput : null })
    this.toggleOpenBar;
    this.updateProfileService.userToUpdate(profile)
  }
    
} 
