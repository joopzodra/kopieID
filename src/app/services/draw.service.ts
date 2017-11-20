import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** DrawService is the intermediair between the MenuComponent and the DrawDirective */

@Injectable()
export class DrawService {

  clearLines$ = new Subject<boolean>();
  setBrushWidth$ = new Subject<number>();

  clearLines() {
    this.clearLines$.next(true);
  }

  setBrushWidth(value: number) {
    this.setBrushWidth$.next(value);
  }
}


