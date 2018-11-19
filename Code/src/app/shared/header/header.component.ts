import {Component} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ContextService} from '../context.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public title$: Subject<string> = this.appContext.moduleTitle;
  public isSideFiltersButtonVisible: boolean = this.appContext.isSideFiltersButtonVisible();

  constructor(private appContext: ContextService) {
    this.appContext.videoOpened$.subscribe(
      (wasOpened) => {
        this.isSideFiltersButtonVisible = !wasOpened;
      });
  }

  /**
   * Open side navigation function
   */
  public openNav() {
    this.appContext.sideFilters.open();
  }
}
