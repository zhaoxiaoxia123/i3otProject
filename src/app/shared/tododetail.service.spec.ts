import { TestBed, inject } from '@angular/core/testing';

import { TododetailService } from './tododetail.service';

describe('TododetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TododetailService]
    });
  });

  it('should be created', inject([TododetailService], (service: TododetailService) => {
    expect(service).toBeTruthy();
  }));
});
