import { Component, Input } from '@angular/core';
import { CanvasService } from '../services/canvas.service'
import { DrawService } from '../services/draw.service'

@Component({
  selector: 'jr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Input('orientation') orientation: string;

  constructor(private canvasService: CanvasService, private drawService: DrawService) { }

  rotateRight() {
    this.canvasService.rotate$.next(90);
  }

  clearLines() {
    this.drawService.clearLines();
  }

  setBrushWidth(value: number) {
    this.drawService.setBrushWidth(value);
  }
}
