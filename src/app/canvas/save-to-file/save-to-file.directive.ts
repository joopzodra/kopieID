import { Directive, ContentChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { SaveToFileService } from '../../services/save-to-file.service'
import { ImageService } from '../../services/image.service'
// saveAs is the only function of FileSaver.js. FileSaver.js is added to the scripts list in .angular-cli.json
declare var saveAs: any;
// 
declare var toBlob: any;

@Directive({
  selector: '[jrSaveToFile]'
})
export class SaveToFileDirective implements AfterViewInit {


  @ContentChildren('image, watermark, view') canvasses: QueryList<ElementRef>

  constructor(private saveToFileService: SaveToFileService, private imageService: ImageService) { }

  ngAfterViewInit() {
    this.saveToFileService.save$.subscribe(save => this.save());
    console.log(this.canvasses)
  }

  save() {
    this.MergeCanvasses();
  }

  MergeCanvasses() {
    const inMemCanvas = document.createElement('canvas');
    const inMemContext = inMemCanvas.getContext('2d');
    const image = this.imageService.image;
    inMemCanvas.width = image.width;
    inMemCanvas.height = image.height;

    const imageCanvas: HTMLCanvasElement = this.canvasses.first.nativeElement;
    const imageCanvasContext = imageCanvas.getContext('2d')
    this.canvasses.filter(elRef => elRef.nativeElement.id !== 'image-canvas')
      .forEach(elRef => imageCanvasContext.drawImage(elRef.nativeElement, 0, 0));

    inMemContext.drawImage(imageCanvas, 0, 0, inMemCanvas.width, inMemCanvas.height);
    inMemCanvas.toBlob(blob => saveAs(blob, "kopie-van-ID.jpg"));
    //const dataUrl = inMemCanvas.toDataURL("image/jpeg", 0.6);
  }

}



