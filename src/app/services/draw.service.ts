import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** DrawService is the intermediair between the MenuComponent and the DrawDirective */

@Injectable()
export class DrawService {

  clearLines$ = new Subject<boolean>();
  setPenWidth$ = new Subject<number>();

  clearLines() {
    this.clearLines$.next(true);
  }

  setPenWidth(value: number) {
    this.setPenWidth$.next(value);
  }
}


