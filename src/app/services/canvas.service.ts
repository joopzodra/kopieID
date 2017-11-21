import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject'
import { Globals } from '../helpers/globals'

/** CanvasService provides values for canvas width and height and rotation. The service reacts on changes in uploaded image and changes in viewport size and orientation.  */

@Injectable()
export class CanvasService {

  constructor(private globals: Globals) {
    this.maxSizeCanvas();
    window.addEventListener('resize', () => this.globals.resizeThrottler(() => this.maxSizeCanvas()), false); // call this.resizeThrottler from within an arrow function to have CanvasService as this; wrap this.maxSizeCanvas in arrow function so it has the CanvasService as this;
  }

  private rotation = 0;
  maxSizeCanvas$ = new BehaviorSubject({width: 0, height: 0});
  canvasSize$ = new Subject<{width: number, height: number}>();
  rotate$ = new BehaviorSubject(0);

  maxSizeCanvas() {
    const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let canvasWidth;
    let canvasHeight;
    const orientation = viewPortWidth <= viewPortHeight ? 'portrait' : 'landscape';
    // by css the menu is set on the left side of landscape viewport and on the top side of portrait viewport; adjust the canvas size accordingly
    if (orientation === 'landscape') {
      canvasWidth = Math.min(viewPortWidth, this.globals.maxAppSize) - this.globals.menuSize;
      canvasHeight = Math.min(viewPortHeight, this.globals.maxAppSize - this.globals.menuSize);
    } else {
      canvasWidth = Math.min(viewPortWidth, this.globals.maxAppSize - this.globals.menuSize);
      canvasHeight = Math.min(viewPortHeight, this.globals.maxAppSize) - this.globals.menuSize;
    }
    this.maxSizeCanvas$.next({ width: canvasWidth, height: canvasHeight });
  }

  setCanvasSize(size: { width: number, height: number }) {
    this.canvasSize$.next(size);
  }

  rotate(value: number) {
    this.rotation = this.rotation + value;
    this.rotate$.next(this.rotation);
  }

  resetRotation() {
    this.rotation = 0;
    this.rotate$.next(0);
  }

}
