import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError, tap} from 'rxjs/internal/operators';
import 'rxjs/add/operator/concatMap';
import {appConfig} from 'appConfig';
import {VideoClass} from '../models/video.class';

@Injectable()
export class YoutubeService {
  private nextToken: string;

  constructor(private http: HttpClient) {
  }

  /**
   * Get trending videos function
   * @param videosPerPage
   * @param regionCode
   * @param categoryId
   * @param paginate
   * @returns {Observable<VideoClass[]>}
   */
  public getTrendingVideos(videosPerPage?: number, regionCode?: string, categoryId?: number, paginate?: boolean): Observable<VideoClass[]> {
    const params: any = {
      part: appConfig.partsToLoad,
      chart: appConfig.chart,
      videoCategoryId: categoryId ? categoryId : appConfig.defaultCategoryId,
      regionCode: regionCode ? regionCode : appConfig.defaultRegion,
      maxResults: videosPerPage ? videosPerPage : appConfig.maxVideosToLoad,
      key: appConfig.youtubeApiKey
    };

    if (paginate) {
      params.pageToken = this.nextToken;
    }

    return this.http.get<any>(appConfig.getYoutubeEndPoint('videos'), {params})
      .pipe(tap((data) => {
          this.nextToken = data.nextPageToken;
        }),
        map(
          (data) => data.items
            .map((item) => new VideoClass(item))
            .filter((item) => item.id !== '')
        ),
        catchError(this.handleError('getTrendingVideos'))
      ) as Observable<VideoClass[]>;

  }

  /**
   * Handle error function
   *
   * @param {string} operation
   *
   * @return {(error: any) => Observable<never>}
   */
  private handleError(operation: string = 'operation') {
    return (error: any) => {
      error.operation = operation;
      return throwError(error);
    };
  }
}
