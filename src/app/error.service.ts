import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {
  extractErrorMessage(err) {
    if (err.error.message) {
      return err.error.message;
    }
    return 'Encountered an error when submitting recipe form';
  }

  constructor() { }

}
