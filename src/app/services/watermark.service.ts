import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WatermarkService {

  watermark$ = new BehaviorSubject('');

  constructor() { }

  writeWatermark(value: string) {
    this.watermark$.next(value);
  }
}
