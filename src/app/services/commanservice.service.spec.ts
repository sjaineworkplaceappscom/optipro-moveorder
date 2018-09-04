import { TestBed, inject } from '@angular/core/testing';

import { CommanserviceService } from './commanservice.service';

describe('CommanserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommanserviceService]
    });
  });

  it('should be created', inject([CommanserviceService], (service: CommanserviceService) => {
    expect(service).toBeTruthy();
  }));
});
