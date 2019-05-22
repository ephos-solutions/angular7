import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {
    constructor(
        private title: Title
    ) { }

    /**
     * Set Document Title
     */
    setTitle(title: string) {
        const pageTitle = title;
        this.title.setTitle(pageTitle);
    }

}
