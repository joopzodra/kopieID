import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../services/canvas.service'
import { ImageService } from '../services/image.service'
import { DrawService } from '../services/draw.service'
import { WatermarkService } from '../services/watermark.service';
import { SaveToFileService } from '../services/save-to-file.service'

/** The MenuComponent reacts on the user actions in the menu. When the user clicks on a menu item, it shows a modal for further interaction. Only the rotation menu item reacts immediatelely, without modal.  */

@Component({
  selector: 'jr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  image: HTMLImageElement;
  watermarkText: string;
  defaultWatermarkText = 'Kopie voor administratie';
  dateChecked = true;
  penWidth = 10;

  constructor(
    private canvasService: CanvasService,
    private imageService: ImageService,
    private drawService: DrawService,
    private watermarkService: WatermarkService,
    private saveToFileService: SaveToFileService
  ) { }

  ngOnInit() {
    this.imageService.image$.subscribe(image => {
      this.image = image;
      this.dateChecked = true;
      this.watermarkText = this.defaultWatermarkText;
      this.changeWatermarkText(this.defaultWatermarkText, true);
    });
  }

  reset() {
    this.canvasService.resetRotation();
    this.clearLines();
    this.changeWatermarkText(this.defaultWatermarkText, true);
    this.dateChecked = true;
  }

  rotateRight() {
    this.canvasService.rotate(90);
  }

  clearLines() {
    this.drawService.clearLines();
  }

  setPenWidth(value: number) {
    this.drawService.setPenWidth(value);
    this.penWidth = value;
  }

  changeWatermarkText(value: string, checked: boolean) {
    this.watermarkText = value;
    this.dateChecked = checked;
    this.watermarkService.writeWatermark(value, checked);
  }

  save() {
    this.saveToFileService.save$.next(true);
  }
}
