import {ErrorHandler} from '@angular/core';

export class cavelogErrorHandler implements ErrorHandler {
    handleError(error) {

        console.log(error);
        // do something with the exception
    }
}
