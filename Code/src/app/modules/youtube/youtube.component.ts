import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
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
  public trendingVideos: Observable<VideoClass[]>;
  public loadingError$ = new Subject<boolean>();
  public videos: VideoClass[];

  constructor(private youtubeService: YoutubeService,
              private appContext: ContextService) {
  }

  public ngOnInit(): void {
    this.appContext.moduleTitle.next('YOUTUBE');
    this.loadVideos();
    this.appContext.videosCountPerPage.subscribe((count) => this.loadVideos(count));
    this.appContext.countrySelected$.subscribe(
      (country) => {
        this.loadVideos(25, country);
      });
  }

  /**
   * Load videos function
   *
   * @param {number} videosPerPage
   * @param {string} countryCode
   */
  private loadVideos(videosPerPage?: number, countryCode?: string) {
    this.trendingVideos = this.youtubeService.getTrendingVideos(videosPerPage, countryCode)
      .pipe(
        catchError((error: any) => {
          this.loadingError$.next(true);
          return throwError(error);
        })
      );
  }

}
