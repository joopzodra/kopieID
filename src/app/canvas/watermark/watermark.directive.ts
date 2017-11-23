import { Directive, AfterViewInit, ElementRef, ContentChild } from '@angular/core';
import { WatermarkService } from '../../services/watermark.service'
import { CanvasService } from '../../services/canvas.service'
import { ImageService } from '../../services/image.service'

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
  watermarkText: string;
  datum = 'datum: ' + new Date().toLocaleDateString();
  rotation = 0;

  ngAfterViewInit() {
    this.canvas = this.watermark.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.watermarkService.watermark$.subscribe(({value: watermark, checked: datumChecked})=> {
      datumChecked ? this.datum = 'datum: ' + new Date().toLocaleDateString() : this.datum = '';
      this.writeWatermark(watermark);
      this.watermarkText = watermark;
    });
    this.canvasService.canvasSize$.subscribe(sizes => this.onCanvasResize(sizes));
    this.canvasService.rotate$.subscribe(rotation => this.rotation = rotation);
    this.imageService.image$.subscribe(image => setTimeout(() => this.writeWatermark(this.watermarkText), 0));
  }

  writeWatermark(watermark: string) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);    
    this.context.restore();
    const fontSize = this.canvas.width / 15;
    const maxCharsPerLine = 25;
    this.context.font = fontSize + "px sans-serif";
    this.context.textAlign = 'center'
    this.context.save();
    this.context.fillStyle = 'rgba(0,0,0,0.3)';
    this.context.strokeStyle = 'rgba(255,255,255,0.4)';

    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate(-this.rotation * Math.PI / 180);
    this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);

    // Compute values for line width and vertical line positioning on rotated canvas
    let contextXwidth = this.canvas.width;
    let contextYtop = 0;
    let contextYheight = this.canvas.height;
    if (this.rotation % 180 !== 0) {
      contextXwidth = this.canvas.height;
      const contextYcenter = this.canvas.height / 2;
      contextYtop = contextYcenter - this.canvas.width / 2;
      contextYheight = this.canvas.width;
    }

    // Wrapping the text lines
    const words = watermark.replace(/\n/g, ' ').split(' ');
    let line1 = '';
    let line2 = '';
    let i = 0;
    while (i < words.length) {
      const newLineLength = this.context.measureText(line1 + ' ' + words[i]).width;
      if (newLineLength < contextXwidth) {
        line1 = line1 + ' ' + words[i];
        i++;
      } else { break; }
    }
    while (i < words.length) {
      const newLineLength = this.context.measureText(line2 + ' ' + words[i]).width;
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
      this.context.fillText(line1, this.canvas.width * 0.5, contextYtop + contextYheight * linePosition);
      this.context.fillText(this.datum, this.canvas.width * 0.5, contextYtop + contextYheight * 0.67);
      this.context.strokeText(line1, this.canvas.width * 0.5, contextYtop + contextYheight * linePosition);
      this.context.strokeText(this.datum, this.canvas.width * 0.5, contextYtop + contextYheight * 0.67);
    }
    else {
      line1 = line1.trim();
      line2 = line2.trim();
      let linePosition1;
      let linePosition2;
      linePosition1 = this.datum !== '' ? 0.25 : 0.333;
      linePosition2 = this.datum !== '' ? 0.5 : 0.666;
      this.context.fillText(line1, this.canvas.width * 0.5, contextYtop + contextYheight * linePosition1);
      this.context.fillText(line2, this.canvas.width * 0.5, contextYtop + contextYheight * linePosition2);
      this.context.fillText(this.datum, this.canvas.width * 0.5, contextYtop + contextYheight * 0.75);
      this.context.strokeText(line1, this.canvas.width * 0.5, contextYtop + contextYheight * linePosition1);
      this.context.strokeText(line2, this.canvas.width * 0.5, contextYtop + contextYheight * linePosition2);
      this.context.strokeText(this.datum, this.canvas.width * 0.5, contextYtop + contextYheight * 0.75);
    }

    if (this.canvas.width !== 0) {
      this.inMemCanvas.width = this.canvas.width;
      this.inMemCanvas.height = this.canvas.height;
      this.inMmeContext.drawImage(this.canvas, 0, 0);
    }
  }

  onCanvasResize(sizes: { width: number, height: number }) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    setTimeout(() => this.context.drawImage(this.inMemCanvas, 0, 0, sizes.width, sizes.height), 0);
  }

}
