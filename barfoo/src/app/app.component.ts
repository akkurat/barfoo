import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PlayerBrowserService } from './player-browser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'barfoo';
  private songObs
  constructor(private songService: PlayerBrowserService,
    private titleService: Title) {
    this.songObs = this.songService.songObs().subscribe(s => this.titleService.setTitle(s?.title || '…'))
  }
  ngOnDestroy(): void {
    this.songObs.unsubscribe()
  }

}
