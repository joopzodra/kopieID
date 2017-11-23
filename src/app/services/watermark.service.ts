import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WatermarkService {

  watermark$ = new BehaviorSubject({value: '', checked:true});

  constructor() { }

  writeWatermark(value: string, checked: boolean) {
    this.watermark$.next({value, checked});
  }
}
