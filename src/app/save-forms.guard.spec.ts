import { TestBed, async, inject } from '@angular/core/testing';

import { SaveFormsGuard } from './save-forms.guard';

describe('SaveFormsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveFormsGuard]
    });
  });

  it('should ...', inject([SaveFormsGuard], (guard: SaveFormsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
