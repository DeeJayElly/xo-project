import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import {throwError} from 'rxjs/index';
import {YoutubeService} from './service/youtube.service';
import {ContextService} from '@shared/context.service';
import {VideoClass} from './models/video.class';

@Component({
  selector: 'app-youtube-component',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})

export class YoutubeComponent implements OnInit {
  public loadingError$ = new Subject<boolean>();
  private filter: any = {} as any;
  public videos: VideoClass[] = [];

  constructor(private youtubeService: YoutubeService,
              private appContext: ContextService) {
  }

  public ngOnInit(): void {
    this.appContext.moduleTitle.next('YOUTUBE');
    this.loadStoredFilter();
    this.appContext.videosCountPerPage.subscribe((count) => this.loadVideos(count));
    this.appContext.newFilterValues$.subscribe(
      (values) => {
        this.filter = values;
        this.loadVideos(values.videosOnPage, values.country, values.categoryId);
      });

    this.appContext.newPageScroll$.subscribe((r) => {
      this.loadVideos(this.filter.videosOnPage, this.filter.country, this.filter.categoryId, true);
    });
  }

  /**
   * Load stored filters function
   */
  private loadStoredFilter() {
    const filters = this.appContext.storedFilters;
    if (filters && filters.filtersValue) {
      this.loadVideos(filters.filtersValue.videosOnPage, filters.filtersValue.country, filters.filtersValue.categoryId);
    } else {
      this.loadVideos();
    }
  }

  /**
   * Load videos function
   * @param videosPerPage
   * @param countryCode
   * @param categoryId
   * @param paginate
   */
  private loadVideos(videosPerPage?: number, countryCode?: string, categoryId?: number, paginate?: boolean) {
    const videoList = this.youtubeService.getTrendingVideos(videosPerPage, countryCode, categoryId, paginate)
      .pipe(
        catchError((error: any) => {
          this.loadingError$.next(true);
          return throwError(error);
        })
      ).subscribe((data) => {
        if (paginate) {
          this.videos = this.videos.concat(data);
        } else {
          this.videos = data;
        }
      }).add(() => {
        videoList.unsubscribe();
      });
  }
}
