import { Injectable } from '@angular/core';


@Injectable()
export class HelperService {
    constructor() { }

    inArray(value: string | number, array: any[]): boolean {
        return array.indexOf(value) > -1;
    }

}
