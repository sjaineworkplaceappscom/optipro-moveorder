import { TestBed, inject } from '@angular/core/testing';

import { MoveorderService } from './moveorder.service';

describe('MoveorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoveorderService]
    });
  });

  it('should be created', inject([MoveorderService], (service: MoveorderService) => {
    expect(service).toBeTruthy();
  }));
});
