import { Directive, ContentChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CanvasService } from '../../services/canvas.service'
import { DrawService } from '../../services/draw.service'

/** DrawDirective puts the lines on canvas that the user draws with mouse or gesture. updateCanvasses() is called after the mouseup event or end of gesture. updateCanvasses copies the line from the tempCanvas to the viewCanvas. This saves the line, since lines on the tempCanvas are cleared on each mousemove. The inMemCanvas stores the content of the viewCanvas, since canvasses are cleared when they are resized (which happens by resizing the window or change of viewport orientation). The inMemCanvas is not appended to the DOM so its doesn't resize. */

@Directive({
  selector: '[jrDraw]',
  exportAs: 'draw'
})
export class DrawDirective implements AfterViewInit {

  constructor(private canvasService: CanvasService, private drawService: DrawService) { }

  @ContentChild('temp') temp: ElementRef;
  tempCanvas: HTMLCanvasElement;
  tempContext: CanvasRenderingContext2D;
  @ContentChild('view') view: ElementRef;
  viewCanvas: HTMLCanvasElement;
  viewContext: CanvasRenderingContext2D;
  inMemCanvas = document.createElement('canvas');
  inMmeContext = this.inMemCanvas.getContext('2d');

  started = false;
  x0: number;
  y0: number;
  x: number;
  y: number;
  mouseEventCache: MouseEvent;
  relativeWidth: number;
  relativeHeigth: number;
  lineWidth = 10;

  ngAfterViewInit() {
    this.tempCanvas = this.temp.nativeElement;
    this.tempContext = this.tempCanvas.getContext('2d');
    this.viewCanvas = this.view.nativeElement;
    this.viewContext = this.viewCanvas.getContext('2d');
    this.canvasService.canvasSize$.subscribe(sizes => this.onCanvasResize(sizes));
    this.drawService.clearLines$.subscribe(clear => this.clearLines());
    this.drawService.setBrushWidth$.subscribe(value => this.setBrushWidth(value));
  }

  startLine(event: MouseEvent) {
    this.started = true;
    this.relativeWidth = this.tempCanvas.width / this.tempCanvas.clientWidth;
    this.relativeHeigth = this.tempCanvas.height / this.tempCanvas.clientHeight;
    this.x0 = event.offsetX * this.relativeWidth;
    this.y0 = event.offsetY * this.relativeHeigth;
  }

  drawLine(event: MouseEvent) {
    if (!this.started) {
      return;
    }
    this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    this.tempContext.beginPath();
    this.tempContext.moveTo(this.x0, this.y0);
    this.tempContext.lineWidth = this.lineWidth;
    this.tempContext.lineCap = 'round';
    this.tempContext.lineTo(event.offsetX * this.relativeWidth, event.offsetY * this.relativeHeigth);
    this.tempContext.stroke();
    this.tempContext.closePath();
    this.mouseEventCache = event;
  }

  endLine(event: MouseEvent) {
    if (this.started) {
      this.started = false;
      this.updateCanvasses();
    }
  }

  @HostListener('document:mouseup', ['$event']) onMouseup(event: MouseEvent) {
    this.endLine(this.mouseEventCache);
  }

  updateCanvasses() {
    this.inMemCanvas.width = this.tempCanvas.width;
    this.inMemCanvas.height = this.tempCanvas.height;
    this.viewContext.drawImage(this.tempCanvas, 0, 0);
    this.inMmeContext.drawImage(this.viewCanvas, 0, 0)
    this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
  }

  onCanvasResize(sizes: { width: number, height: number }) {
    setTimeout(() => this.viewContext.drawImage(this.inMemCanvas, 0, 0, sizes.width, sizes.height), 0);
  }

  clearLines() {
    this.viewContext.clearRect(0, 0, this.viewCanvas.width, this.viewCanvas.height);
    this.inMmeContext.clearRect(0, 0, this.inMemCanvas.width, this.inMemCanvas.height);
  }

  setBrushWidth(value: number) {
    this.lineWidth = value;
  }

}
