import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SessionStorage} from 'ngx-store';

@Injectable()
export class ContextService {
  public sideFilters: any;
  public moduleTitle: Subject<string> = new Subject<string>();
  public videosCountPerPage: Subject<number> = new Subject<number>();
  public videoOpened = new Subject<boolean>();
  public videoOpened$ = this.videoOpened.asObservable();
  public newFilterValues: Subject<any> = new Subject<any>();
  public newFilterValues$ = this.newFilterValues.asObservable();
  public newPageScroll$: Subject<number> = new Subject<number>();
  @SessionStorage() _storedFilters: any = {} as any;

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

  /**
   * request to add new video content to video list
   * @param count
   */
  public requestScroll(count: number) {
    this.newPageScroll$.next(count);
  }

  /**
   * Get stored filters function
   *
   * @return {any}
   */
  get storedFilters() {
    return this._storedFilters;
  }

  /**
   * Set filters function
   *
   * @param value
   */
  set storedFilters(value: any) {
    if (value && value.categoryFormControl) {
      this._storedFilters = value;

    }
  }
}
