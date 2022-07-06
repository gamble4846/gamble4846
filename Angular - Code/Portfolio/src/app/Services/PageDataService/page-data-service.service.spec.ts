import { TestBed } from '@angular/core/testing';

import { PageDataServiceService } from './page-data-service.service';

describe('PageDataServiceService', () => {
  let service: PageDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
