import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ContextService {
  public sideFilters: any;
  public moduleTitle: Subject<string> = new Subject<string>();
  public videosCountPerPage: Subject<number> = new Subject<number>();
  public videoOpened = new Subject<boolean>();
  public videoOpened$ = this.videoOpened.asObservable();
  public newFilterValues: Subject<any> = new Subject<any>();
  public newFilterValues$ = this.newFilterValues.asObservable();

  /**
   * Check and emit if the filters have been changed function
   *
   * @param {any} newFilterValues
   */
  public filtersUpdate(newFilterValues: any) {
    this.newFilterValues.next(newFilterValues);
  }

  /**
   * Check and emit if the video page is opened function
   *
   * @param {boolean} isOpened
   */
  public videoOpen(isOpened: boolean) {
    this.videoOpened.next(isOpened);
  }

  /**
   * Check if side filter button is visible/hidden function
   */
  public isSideFiltersButtonVisible() {
    return (window.location.pathname.slice(8, 10) === '');
  }
}
