import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** DrawService is the intermediair between the MenuComponent and the DrawDirective. It also keeps a shadow draw canvas. The drawDirective writes to this canvas, which has the size of the original image. The shadow canvas is used by the SaveToFileDirective. */

@Injectable()
export class DrawService {

  shadowDrawCanvas = document.createElement('canvas');
  shadowDrawContext = this.shadowDrawCanvas.getContext('2d');

  clearLines$ = new Subject<boolean>();
  setPenWidth$ = new Subject<number>();

  clearLines() {
    this.clearLines$.next(true);
  }

  setPenWidth(value: number) {
    this.setPenWidth$.next(value);
  }
}


