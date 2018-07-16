import { TestBed, inject } from '@angular/core/testing';

import { FgrmscanparentinputformService } from './fgrmscanparentinputform.service';

describe('FgrmscanparentinputformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FgrmscanparentinputformService]
    });
  });

  it('should be created', inject([FgrmscanparentinputformService], (service: FgrmscanparentinputformService) => {
    expect(service).toBeTruthy();
  }));
});
