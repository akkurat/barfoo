import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlayerBrowserService } from '../player-browser.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  progress = 50
  sub: Subscription;

  constructor(private playerService: PlayerBrowserService) {
    this.sub = this.playerService.prgObs().subscribe(a => {
      if (a) {
        this.progress = a.relative * 100; console.log(this.progress)
      }
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  ngOnInit(): void {
  }

}
