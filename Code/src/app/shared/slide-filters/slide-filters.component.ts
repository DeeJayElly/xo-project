import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {appConfig} from 'appConfig';
import {ICountryListModel} from '@shared/models/country-list.interface';
import {ICategoryListInterface} from '@shared/models/category-list.interface';
import {ContextService} from '@shared/context.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-slide-filters',
  templateUrl: './slide-filters.component.html',
  styleUrls: ['./slide-filters.component.scss']
})
export class SlideFiltersComponent implements OnInit {
  public countryFormControl: FormControl = new FormControl();
  public countryList: Observable<ICountryListModel[]>;
  public countries: ICountryListModel[] = appConfig.countryList;
  public categoryFormControl: FormControl = new FormControl();
  public categoriesList: ICategoryListInterface[] = [
    {name: 'Film & Animation', id: 1},
    {name: 'Autos & Vehicles', id: 2},
    {name: 'Music', id: 10},
    {name: 'Pets & Animals', id: 4}
  ];

  public defaultVideosOnPage: number = appConfig.maxVideosToLoad;
  public videosOnPage: number = appConfig.maxVideosToLoad;

  constructor(private appContext: ContextService) {
    this.countryList = this.countryFormControl.valueChanges
      .pipe(
        startWith(''),
        map((country) => country ? this.filterCountries(country) : this.countries.slice())
      );

    this.countryFormControl.valueChanges
      .subscribe((value) => {
        const country = appConfig.countryList.find((obj) => obj.name === value);
        if (country) {
          const category = this.categoriesList.find((item) => item.name === this.categoryFormControl.value);
          const filterValues = {
            videosOnPage: this.videosOnPage,
            country: country.code,
            categoryId: (category && category.id) ? category.id : null
          };
          this.appContext.filtersUpdate(filterValues);
        }
      });

    this.categoryFormControl.valueChanges
      .subscribe((value) => {
        const category = this.categoriesList.find((item) => item.name === value);
        if (category) {
          const country = appConfig.countryList.find((item) => item.name === this.countryFormControl.value);
          const filterValues = {
            videosOnPage: this.videosOnPage,
            country: country.code,
            categoryId: category.id
          };
          this.appContext.filtersUpdate(filterValues);
        }
      });
  }

  public ngOnInit() {
    this.setDefaults();
  }

  /**
   * Filter countries function
   *
   * @param {string} value
   */
  private filterCountries(value: string): ICountryListModel[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * On change videos per page function
   *
   * @param {number} count
   */
  public onChangeVideosPerPage(count: number) {
    this.videosOnPage = count;
    this.appContext.videosCountPerPage.next(count);
  }

  /**
   * Set defaults function
   */
  private setDefaults() {
    const defaultCountry = this.countries.find((country) =>
      country.code === appConfig.defaultRegion).name;
    const defaultCategory = this.categoriesList.find((country) =>
      country.id === appConfig.defaultCategoryId).name;
    this.countryFormControl.setValue(defaultCountry);
    this.categoryFormControl.setValue(defaultCategory);
  }

  /**
   * Close side navigation function
   */
  public closeNav() {
    this.appContext.sideFilters.close();
  }
}
