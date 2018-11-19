import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {appConfig} from 'appConfig';
import {ContextService} from '@shared/context.service';
import {YoutubeService} from '@modules/youtube/service/youtube.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  public embedUrl: string;
  public videoLoader: boolean;
  public urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer, public contextService: ContextService,
              public youtubeService: YoutubeService) {
  }

  public ngOnInit() {
    const id = window.location.href
      .replace(/^.*\//g, '')
      .replace(/^.*\..*/g, '');

    if (!id.length) {
      return;
    }

    this.contextService.videoOpen(true);
    this.videoLoader = true;
    this.embedUrl = appConfig.getYoutubeEmbdedUrl(id);
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);
    // }
  }

  public ngOnDestroy() {
    this.contextService.videoOpen(false);
  }

  /**
   * On video ready hide loader function
   */
  public loadVideo(): void {
    this.videoLoader = false;
  }
}
