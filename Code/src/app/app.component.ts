import {Component, OnInit, ViewChild} from '@angular/core';
import {ContextService} from '@shared/context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('filterSlide') public filterSlide;
  private scrollCount = 0;

  constructor(private appContext: ContextService) {
  }

  ngOnInit() {
    this.appContext.sideFilters = this.filterSlide;
  }

  /**
   * On scroll function
   */
  public onScroll() {
    this.scrollCount += 1;
    this.appContext.requestScroll(this.scrollCount);
  }
}
