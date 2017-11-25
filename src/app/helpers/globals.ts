import { Injectable } from "@angular/core";

/** The global values for some app sizes. And a resizeThrottler function for global usage. */

@Injectable()
export class Globals {

  appBorderWidth = 4;
  maxAppSizeGross = 845;
  menuSize = 45;
  maxAppSize = this.maxAppSizeGross - 2 * this.appBorderWidth;

/**
 * resizeTimeout is undefined when a new resize event can be handled. During the handling of a resize event, resizeTimeout is the ID-number of a window.setTimeout timer.
 */
  private resizeTimeout: undefined | number ;
  private cachedInnerWidth: number;
  private cachedInnerHeight: number;

  resizeThrottler(functionToExecute: () => void) {
    let newInnerWidth = window.innerWidth;
    let newInnerHeight = window.innerHeight;
    // ignore resize events as long as an functionToExecute is in the queue
    if (!this.resizeTimeout && (newInnerWidth !== this.cachedInnerWidth || newInnerHeight !== this.cachedInnerHeight) ) {
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = undefined;
        this.cachedInnerWidth = window.innerWidth;
        functionToExecute();
        // functionToExecute will execute at a rate of 4fps
      }, 250);
    }
  }

}