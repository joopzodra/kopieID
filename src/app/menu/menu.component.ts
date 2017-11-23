import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../services/canvas.service'
import { ImageService } from '../services/image.service'
import { DrawService } from '../services/draw.service'
import { WatermarkService } from '../services/watermark.service';
import { SaveToFileService } from '../services/save-to-file.service'

@Component({
  selector: 'jr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  image: HTMLImageElement;
  watermarkText = 'Kopie voor administratie';

  constructor(
    private canvasService: CanvasService,
    private imageService: ImageService,
    private drawService: DrawService,
    private watermarkService: WatermarkService,
    private saveToFileService: SaveToFileService
  ) { }

  ngOnInit() {
    this.imageService.image$.subscribe(image => this.image = image);
    this.changeWatermarkText(this.watermarkText, true);
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

  changeWatermarkText(value: string, checked: boolean) {
    this.watermarkText = value;
    this.watermarkService.writeWatermark(value, checked);
  }

  save() {
    this.saveToFileService.save$.next(true);
  }
}
