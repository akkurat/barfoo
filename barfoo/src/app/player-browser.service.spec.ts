import { TestBed } from '@angular/core/testing';

import { PlayerBrowserService } from './player-browser.service';

describe('PlayerBrowserService', () => {
  let service: PlayerBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
