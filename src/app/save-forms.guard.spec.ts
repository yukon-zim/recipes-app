import { TestBed, async, inject } from '@angular/core/testing';

import { SaveFormsGuard } from './save-forms.guard';

describe('SaveFormsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveFormsGuard]
    });
  });

  it('should be created', inject([SaveFormsGuard], (guard: SaveFormsGuard) => {
    expect(guard).toBeTruthy();
  }));
  it('should call the component\'s canDeactivate', inject([SaveFormsGuard], (guard: SaveFormsGuard) => {
    const spyComponent = jasmine.createSpyObj('Component', {canDeactivate: true});
    expect(guard.canDeactivate(spyComponent)).toEqual(true);
    expect(spyComponent.canDeactivate).toHaveBeenCalled();
  }));
});
