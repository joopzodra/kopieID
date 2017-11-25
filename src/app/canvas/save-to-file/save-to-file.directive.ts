import { Directive, ContentChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { SaveToFileService } from '../../services/save-to-file.service'
import { ImageService } from '../../services/image.service'
import { WatermarkService } from '../../services/watermark.service'
import { DrawService } from '../../services/draw.service'
import { CanvasService } from '../../services/canvas.service'

// saveAs is the only function of FileSaver.js. FileSaver.js is added to the scripts list in .angular-cli.json
declare const saveAs: any;

@Directive({
  selector: '[jrSaveToFile]'
})
export class SaveToFileDirective implements AfterViewInit {

  @ContentChildren('image, watermark, view') canvasses: QueryList<ElementRef>
  rotation = 0;

  constructor(
    private saveToFileService: SaveToFileService,
    private imageService: ImageService,
    private watermarkService: WatermarkService,
    private drawService: DrawService,
    private canvasService: CanvasService
  ) { }

  ngAfterViewInit() {
    this.saveToFileService.save$.subscribe(save => this.saveCanvas());
    this.canvasService.rotate$.subscribe(rotation => this.rotation = rotation);
  }

  saveCanvas() {
    const inMemCanvas = document.createElement('canvas');
    const inMemContext = inMemCanvas.getContext('2d');
    const image = this.imageService.image;
    if (this.rotation % 180 !== 0) {
      inMemCanvas.width = image.height;
      inMemCanvas.height = image.width;
    } else {
      inMemCanvas.width = image.width;
      inMemCanvas.height = image.height;
    }
    const quarterTurns = (this.rotation / 90) % 4;
    switch (quarterTurns) {
      case 1:
        inMemContext.translate(inMemCanvas.width, 0);
        inMemContext.rotate(90 * Math.PI / 180);
        break;
      case 2:
        inMemContext.translate(inMemCanvas.width / 2, inMemCanvas.height / 2);
        inMemContext.rotate(180 * Math.PI / 180);
        inMemContext.translate(-inMemCanvas.width / 2, -inMemCanvas.height / 2);
        break;
      case 3:
        inMemContext.translate(0, inMemCanvas.height);
        inMemContext.rotate(-90 * Math.PI / 180);
        break;
    }
    inMemContext.drawImage(image, 0, 0);
    inMemContext.drawImage(this.drawService.shadowDrawCanvas, 0, 0);
    inMemContext.drawImage(this.watermarkService.shadowWatermarkCanvas, 0, 0);

    inMemCanvas.toBlob(blob => saveAs(blob, 'kopie-van-ID.jpg'), 'image/jpeg', 0.8);
  }
}
