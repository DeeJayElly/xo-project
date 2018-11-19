import {Component, OnInit, ViewChild} from '@angular/core';
import {ContextService} from '@shared/context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('filterSlide') public filterSlide;

  constructor(private appContext: ContextService) {
  }

  ngOnInit() {
    this.appContext.sideFilters = this.filterSlide;
  }
}
