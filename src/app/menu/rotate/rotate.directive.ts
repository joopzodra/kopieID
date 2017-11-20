import { Directive } from '@angular/core';
import { CanvasService } from '../../services/canvas.service'

@Directive({
  selector: '[jrRotate]',
  exportAs: 'rotate'
})
export class RotateDirective {

  constructor(private canvasService: CanvasService) { }

  rotateLeft() {
    this.canvasService.rotate$.next(-90);
  }

  rotateRight() {
    this.canvasService.rotate$.next(90);
  }

}
