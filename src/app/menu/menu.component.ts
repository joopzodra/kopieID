import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../services/canvas.service'
import { ImageService } from '../services/image.service'
import { DrawService } from '../services/draw.service'
import { WatermarkService } from '../services/watermark.service';

@Component({
  selector: 'jr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  image: HTMLImageElement;
  watermarkText = 'Kopie voor administratie';

  constructor(private canvasService: CanvasService, private imageService: ImageService, private drawService: DrawService, private watermarkService: WatermarkService) { }

  ngOnInit() {
    this.imageService.image$.subscribe(image => this.image = image);
    this.changeWatermarkText(this.watermarkText);
  }

  rotateRight() {
    this.canvasService.rotate(90);
  }

  resetRotation() {
    this.canvasService.resetRotation();
  }

  clearLines() {
    this.drawService.clearLines();
  }

  setPenWidth(value: number) {
    this.drawService.setPenWidth(value);
  }

  changeWatermarkText(value: string) {
    this.watermarkText = value;
    this.watermarkService.writeWatermark(value);
  }

  clearWatermarkText() {
    this.watermarkText = '';
    this.watermarkService.writeWatermark('');
  }
}
