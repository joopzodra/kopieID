import { Component, Input, OnInit } from '@angular/core';
import { CanvasService } from '../services/canvas.service'
import { ImageService } from '../services/image.service'
import { DrawService } from '../services/draw.service'

@Component({
  selector: 'jr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input('orientation') orientation: string;
  image: HTMLImageElement;

  constructor(private canvasService: CanvasService, private imageService: ImageService, private drawService: DrawService) { }

  ngOnInit() {
    this.imageService.image$.subscribe(image => this.image = image);
  }

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
