import { Injectable } from "@angular/core";

@Injectable()
export class Globals {

  maxAppSize = 840;
  menuSize = 40;

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