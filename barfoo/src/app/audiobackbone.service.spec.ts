import { TestBed } from '@angular/core/testing';

import { AudiobackboneService } from './audiobackbone.service';

describe('AudiobackboneService', () => {
  let service: AudiobackboneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudiobackboneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
