import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {
  extractErrorMessage(err, failedAction: string = 'submitting recipe form') {
    console.error(err.error);
    if (err.error.message) {
      return err.error.message;
    }
    return `Encountered an error when ${failedAction}`;
  }

  constructor() { }

}
