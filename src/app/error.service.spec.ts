import {TestBed, inject, getTestBed} from '@angular/core/testing';

import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorService]
    });
    const testBed = getTestBed();
    service = testBed.get(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should extract existing error message', () => {
    const mockError = new Error('test message');
    const mockErrorWrapper = {error: mockError};
    spyOn(console, 'error');
    expect(service.extractErrorMessage(mockErrorWrapper)).toEqual('test message');
  });
  it('should return default message if no existing error message', () => {
    const mockError = new Error();
    const mockErrorWrapper = {error: mockError};
    spyOn(console, 'error');
    expect(service.extractErrorMessage(mockErrorWrapper)).toEqual('Encountered an error when submitting recipe form');
    expect(service.extractErrorMessage(mockErrorWrapper, 'test message')).toEqual('Encountered an error when test message');
  });
});
