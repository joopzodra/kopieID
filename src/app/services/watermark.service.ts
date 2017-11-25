import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/** WatermarkService is the intermediair between the MenuComponent and the WatermarkDirective. It also keeps a shadow watermark canvas. The watermarkDirective writes to this canvas, which has the size of the original image. The shadow canvas is used by the SaveToFileDirective. */

@Injectable()
export class WatermarkService {

  shadowWatermarkCanvas = document.createElement('canvas');
  shadowWatermarkContext = this.shadowWatermarkCanvas.getContext('2d');

  watermark$ = new BehaviorSubject({value: '', checked:true});

  writeWatermark(value: string, checked: boolean) {
    this.watermark$.next({value, checked});
  }
}
