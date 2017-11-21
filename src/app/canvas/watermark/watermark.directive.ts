import { Directive, AfterViewInit, ElementRef, ContentChild } from '@angular/core';
import { WatermarkService } from '../../services/watermark.service'

@Directive({
  selector: '[jrWatermark]'
})
export class WatermarkDirective implements AfterViewInit {

  constructor(private watermarkService: WatermarkService) { }

  @ContentChild('watermark') watermark: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.canvas = this.watermark.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.watermarkService.watermark$.subscribe(watermark => this.writeWatermark(watermark));
  }

  writeWatermark(watermark: string) {
    console.log(watermark)
  }
}
