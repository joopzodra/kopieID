import { Directive, ContentChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CanvasService } from '../../services/canvas.service'
import { DrawService } from '../../services/draw.service'
import { ImageService } from '../../services/image.service'

interface TouchOffset { offsetX: number, offsetY: number }

/** DrawDirective puts the lines on canvas that the user draws with mouse or gesture. updateCanvasses() is called after the mouseup event or end of gesture. updateCanvasses copies the line from the tempCanvas to the viewCanvas. This saves the line, since lines on the tempCanvas are cleared on each mousemove.
 * 
 * The inMemCanvas stores the content of the viewCanvas, since canvasses are cleared when they are resized (which happens by resizing the window or change of viewport orientation). The inMemCanvas is not appended to the DOM so its doesn't resize.
 * 
 * Furthermore, there's a shadowCanvas which keeps the sizes of the original image and is used in the SaveToFileDirective.
 */

@Directive({
  selector: '[jrDraw]',
  exportAs: 'draw'
})
export class DrawDirective implements AfterViewInit {

  constructor(private canvasService: CanvasService, private drawService: DrawService, private imageService: ImageService) { }

  @ContentChild('temp') temp: ElementRef;
  tempCanvas: HTMLCanvasElement;
  tempContext: CanvasRenderingContext2D;
  @ContentChild('view') view: ElementRef;
  viewCanvas: HTMLCanvasElement;
  viewContext: CanvasRenderingContext2D;
  inMemCanvas = document.createElement('canvas');
  inMmeContext = this.inMemCanvas.getContext('2d');
  shadowCanvas = this.drawService.shadowDrawCanvas;
  shadowContext = this.drawService.shadowDrawContext;
  shadowTempRatio: number;

  started = false;
  x0: number;
  y0: number;
  x: number;
  y: number;
  shadowX0: number;
  shadowY0: number;
  mouseEventCache: MouseEvent | TouchOffset;
  penWidth = 10;
  rotation = 0;

  touchOffsetX: (touch: Touch) => number;
  touchOffsetY: (touch: Touch) => number;

  ngAfterViewInit() {
    this.tempCanvas = this.temp.nativeElement;
    this.tempContext = this.tempCanvas.getContext('2d');
    this.viewCanvas = this.view.nativeElement;
    this.viewContext = this.viewCanvas.getContext('2d');
    this.canvasService.canvasSize$.subscribe(sizes => this.onCanvasResize(sizes));
    this.drawService.clearLines$.subscribe(clear => this.clearLines());
    this.drawService.setPenWidth$.subscribe(value => this.setPenWidth(value));
    this.imageService.image$.subscribe(image => {
      this.shadowCanvas.width = image.width;
      this.shadowCanvas.height = image.height;
    });
    this.canvasService.rotate$.subscribe(rotation => setTimeout(() => {
      this.clientToOffset(rotation);
      this.rotation = rotation;
    }, 0));
  }

  startLine(event: MouseEvent | TouchOffset) {
    this.started = true;
    this.x0 = event.offsetX;
    this.y0 = event.offsetY;
    this.shadowTempRatio = this.shadowCanvas.width / this.tempCanvas.width;
    this.shadowX0 = this.shadowTempRatio * this.x0;
    this.shadowY0 = this.shadowTempRatio * this.y0;
    this.mouseEventCache = event;
  }

  drawLine(event: MouseEvent | TouchOffset) {
    if (!this.started) {
      return;
    }
    this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    this.tempContext.beginPath();
    this.tempContext.moveTo(this.x0, this.y0);
    this.tempContext.lineWidth = this.penWidth;
    this.tempContext.lineCap = 'round';
    this.tempContext.lineTo(event.offsetX, event.offsetY);
    this.tempContext.stroke();
    this.tempContext.closePath();
    this.mouseEventCache = event;
  }

  endLine() {
    if (this.started) {
      const event = this.mouseEventCache;
      this.started = false;
      this.updateCanvasses();
      const shadowX = event.offsetX * this.shadowTempRatio;
      const shadowY = event.offsetY * this.shadowTempRatio;
      this.shadowContext.beginPath();
      this.shadowContext.moveTo(this.shadowX0, this.shadowY0);
      this.shadowContext.lineWidth = this.penWidth * this.shadowTempRatio;
      this.shadowContext.lineCap = 'round';
      this.shadowContext.lineTo(shadowX, shadowY);
      this.shadowContext.stroke();
      this.shadowContext.closePath();
    }
  }

  // This method  converts touch event clientX and clientY to offsetX and offsetY; setTimeout is needed because after rotation the canvas resize after one event loop.
  clientToOffset(rotation: number) {
    setTimeout(() => {
      const canvasRect = this.tempCanvas.getBoundingClientRect();
      let canvasRatio: number;
      if (rotation % 180 !== 0) {
        canvasRatio = this.tempCanvas.width / canvasRect.height;
      } else {
        canvasRatio = this.tempCanvas.width / canvasRect.width;
      }
      const quarterTurns = (rotation / 90) % 4;
      switch (quarterTurns) {
        case 0:
          this.touchOffsetX = (touch) => (touch.clientX - canvasRect.left);
          this.touchOffsetY = (touch) => (touch.clientY - canvasRect.top);
          break;
        case 1:
          this.touchOffsetX = (touch) => (touch.clientY - canvasRect.top) * canvasRatio;
          this.touchOffsetY = (touch) => (canvasRect.right - touch.clientX) * canvasRatio;
          break;
        case 2:
          this.touchOffsetX = (touch) => (canvasRect.right - touch.clientX) * canvasRatio;
          this.touchOffsetY = (touch) => (canvasRect.bottom - touch.clientY) * canvasRatio;
          break;
        case 3:
          this.touchOffsetX = (touch) => (canvasRect.bottom - touch.clientY) * canvasRatio;
          this.touchOffsetY = (touch) => (touch.clientX - canvasRect.left) * canvasRatio;
          break;
      }
    }, 0);
  }

  touchStart(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length > 1) {
      this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
      return;
    }
    let touch = event.touches[0];
    const offsetX = this.touchOffsetX(touch);
    const offsetY = this.touchOffsetY(touch);
    this.startLine({ offsetX: Math.round(offsetX), offsetY: Math.round(offsetY) });
  }

  touchMove(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length > 1) {
      this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
      return;
    }
    let touch = event.touches[0];
    const offsetX = this.touchOffsetX(touch);
    const offsetY = this.touchOffsetY(touch);
    this.drawLine({ offsetX: Math.round(offsetX), offsetY: Math.round(offsetY) });
  }

  @HostListener('document:mouseup', ['$event']) onMouseup(event: MouseEvent) {
    this.endLine();
  }

  updateCanvasses() {
    this.inMemCanvas.width = this.tempCanvas.width;
    this.inMemCanvas.height = this.tempCanvas.height;
    this.viewContext.drawImage(this.tempCanvas, 0, 0);
    this.inMmeContext.drawImage(this.viewCanvas, 0, 0)
    this.tempContext.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
  }

  onCanvasResize(sizes: { width: number, height: number }) {
    setTimeout(() => {
      this.viewContext.drawImage(this.inMemCanvas, 0, 0, sizes.width, sizes.height);
      this.clientToOffset(this.rotation);
    }, 0);
  }

  clearLines() {
    this.viewContext.clearRect(0, 0, this.viewCanvas.width, this.viewCanvas.height);
    this.inMmeContext.clearRect(0, 0, this.inMemCanvas.width, this.inMemCanvas.height);
    this.shadowContext.clearRect(0, 0, this.shadowCanvas.width, this.shadowCanvas.height);
  }

  setPenWidth(value: number) {
    this.penWidth = value;
  }

}
