import { TestBed, inject } from '@angular/core/testing';

import { FgrmscanchildinputformService } from './fgrmscanchildinputform.service';

describe('FgrmscanchildinputformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FgrmscanchildinputformService]
    });
  });

  it('should be created', inject([FgrmscanchildinputformService], (service: FgrmscanchildinputformService) => {
    expect(service).toBeTruthy();
  }));
});
