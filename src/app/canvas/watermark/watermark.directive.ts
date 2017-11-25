import { Directive, AfterViewInit, ElementRef, ContentChild } from '@angular/core';
import { WatermarkService } from '../../services/watermark.service'
import { CanvasService } from '../../services/canvas.service'
import { ImageService } from '../../services/image.service'

/** WatermarkDirective writes the watermarkt two times. First to the canvas on screen. Then to the shadow canvas of the WatermarkService. This shadow canvas keeps the sizes of the original image and is used in the SaveToFileDirective. */

@Directive({
  selector: '[jrWatermark]'
})
export class WatermarkDirective implements AfterViewInit {

  constructor(private watermarkService: WatermarkService, private canvasService: CanvasService, private imageService: ImageService) { }

  @ContentChild('watermark') watermark: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  inMemCanvas = document.createElement('canvas');
  inMmeContext = this.inMemCanvas.getContext('2d');
  shadowCanvas = this.watermarkService.shadowWatermarkCanvas;
  shadowContext = this.watermarkService.shadowWatermarkContext;
  watermarkText: string;
  datum = 'datum: ' + new Date().toLocaleDateString();
  rotation = 0;

  ngAfterViewInit() {
    this.canvas = this.watermark.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.watermarkService.watermark$.subscribe(({ value: watermark, checked: datumChecked }) => {
      datumChecked ? this.datum = 'datum: ' + new Date().toLocaleDateString() : this.datum = '';
      this.writeWatermark(watermark, this.canvas, this.context);
      this.writeWatermark(watermark, this.shadowCanvas, this.shadowContext);
      this.watermarkText = watermark;
    });
    this.canvasService.canvasSize$.subscribe(sizes => this.onCanvasResize(sizes));
    this.canvasService.rotate$.subscribe(rotation => this.rotation = rotation);
    this.imageService.image$.subscribe(image => {
      this.shadowCanvas.width = image.width;
      this.shadowCanvas.height = image.height;
      setTimeout(() => {
        this.writeWatermark(this.watermarkText, this.canvas, this.context);
        this.writeWatermark(this.watermarkText, this.shadowCanvas, this.shadowContext);
      }, 0);
    });
  }

  writeWatermark(watermark: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    const fontSize = canvas.width / 15;
    const maxCharsPerLine = 25;
    context.font = fontSize + "px sans-serif";
    context.textAlign = 'center'
    context.save();
    context.fillStyle = 'rgba(0,0,0,0.3)';
    context.strokeStyle = 'rgba(255,255,255,0.4)';

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-this.rotation * Math.PI / 180);
    context.translate(-canvas.width / 2, -canvas.height / 2);

    // Compute values for line width and vertical line positioning on rotated canvas
    let contextXwidth = canvas.width;
    let contextYtop = 0;
    let contextYheight = canvas.height;
    if (this.rotation % 180 !== 0) {
      contextXwidth = canvas.height;
      const contextYcenter = canvas.height / 2;
      contextYtop = contextYcenter - canvas.width / 2;
      contextYheight = canvas.width;
    }

    // Wrapping the text lines
    const words = watermark.replace(/\n/g, ' ').split(' ');
    let line1 = '';
    let line2 = '';
    let i = 0;
    while (i < words.length) {
      const newLineLength = context.measureText(line1 + ' ' + words[i]).width;
      if (newLineLength < contextXwidth) {
        line1 = line1 + ' ' + words[i];
        i++;
      } else { break; }
    }
    while (i < words.length) {
      const newLineLength = context.measureText(line2 + ' ' + words[i]).width;
      if (newLineLength < contextXwidth) {
        line2 = line2 + ' ' + words[i];
        i++;
      } else { break; }
    }

    // Allow one or two lines of text and optional one line width the current date, no more. Hence number of characters <= 50 (set in template).
    if (line2 === '') {
      line1 = line1.trim();
      let linePosition;
      linePosition = this.datum !== '' ? 0.333 : 0.5;
      context.fillText(line1, canvas.width * 0.5, contextYtop + contextYheight * linePosition);
      context.fillText(this.datum, canvas.width * 0.5, contextYtop + contextYheight * 0.67);
      context.strokeText(line1, canvas.width * 0.5, contextYtop + contextYheight * linePosition);
      context.strokeText(this.datum, canvas.width * 0.5, contextYtop + contextYheight * 0.67);
    }
    else {
      line1 = line1.trim();
      line2 = line2.trim();
      let linePosition1;
      let linePosition2;
      linePosition1 = this.datum !== '' ? 0.25 : 0.333;
      linePosition2 = this.datum !== '' ? 0.5 : 0.666;
      context.fillText(line1, canvas.width * 0.5, contextYtop + contextYheight * linePosition1);
      context.fillText(line2, canvas.width * 0.5, contextYtop + contextYheight * linePosition2);
      context.fillText(this.datum, canvas.width * 0.5, contextYtop + contextYheight * 0.75);
      context.strokeText(line1, canvas.width * 0.5, contextYtop + contextYheight * linePosition1);
      context.strokeText(line2, canvas.width * 0.5, contextYtop + contextYheight * linePosition2);
      context.strokeText(this.datum, canvas.width * 0.5, contextYtop + contextYheight * 0.75);
    }

    if (canvas.width !== 0 && canvas.id === 'watermark-canvas') {
      this.inMemCanvas.width = canvas.width;
      this.inMemCanvas.height = canvas.height;
      this.inMmeContext.drawImage(canvas, 0, 0);
    }
  }

  onCanvasResize(sizes: { width: number, height: number }) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    setTimeout(() => this.context.drawImage(this.inMemCanvas, 0, 0, sizes.width, sizes.height), 0);
  }

}
