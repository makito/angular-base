import { TestBed, inject } from '@angular/core/testing';

import { EnumsService } from './enums.service';

describe('EnumsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnumsService]
    });
  });

  it('should be created', inject([EnumsService], (service: EnumsService) => {
    expect(service).toBeTruthy();
  }));
});
