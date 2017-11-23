import { Directive, ContentChild, ElementRef, AfterViewInit } from '@angular/core';
import { ImageService } from '../../services/image.service'
import { CanvasService } from '../../services/canvas.service'

/* ImageDirective computes the right size for the image, given the maximum size for the canvas. Then it puts the image on its canvas and sends the size of this canvas to the CanvasService. The CanvasService sends this size to subscribers so that canvasses can be adjusted to this size. */

@Directive({
  selector: '[jrImage]'
})
export class ImageDirective implements AfterViewInit {

  constructor(private imageService: ImageService, private canvasService: CanvasService) { }

  @ContentChild('image') imageCanvasElRef: ElementRef;
  imageCanvas: HTMLCanvasElement;
  imageContext: CanvasRenderingContext2D;
  image: HTMLImageElement;
  maxCanvasSize: {width: number, height: number};

  ngAfterViewInit() {
    this.imageCanvas = this.imageCanvasElRef.nativeElement;
    this.imageContext = this.imageCanvas.getContext('2d');
    this.imageService.image$.subscribe(image => {
      this.image = image;
      this.drawImage();
    });
    this.canvasService.maxSizeCanvas$.subscribe(sizes => {
      this.maxCanvasSize = sizes;
      if (this.image) {
        setTimeout(() => this.drawImage(), 0); // call this.drawImage from within an arrow function to have CanvasService as this
      }
    });
  }

  drawImage() {
    this.imageContext.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
    const widthRatio = this.maxCanvasSize.width / this.image.width; // if image is larger than maxCanvasSize, than widthRatio < 1 so image needs resizing (it will be made smaller)
    const heightRatio = this.maxCanvasSize.height / this.image.height;
    if (widthRatio < 1 || heightRatio < 1) {
      const resizeFactor = Math.min(widthRatio, heightRatio);
      const imgWidth = Math.round(this.image.width * resizeFactor);
      const imgHeight = Math.round(this.image.height * resizeFactor);
      this.imageCanvas.width = imgWidth;
      this.imageCanvas.height = imgHeight;
      this.imageContext.drawImage(this.image, 0, 0, imgWidth, imgHeight);
      this.resizeCanvas({ width: imgWidth, height: imgHeight });

    } else {
      this.imageCanvas.width = this.image.width;
      this.imageCanvas.height = this.image.height;
      this.imageContext.drawImage(this.image, 0, 0, this.image.width, this.image.height);
      this.resizeCanvas({ width: this.image.width, height: this.image.height });
    }
  }

  resizeCanvas(sizes: {width: number, height: number}) {
    this.canvasService.setCanvasSize(sizes);
  }
}
