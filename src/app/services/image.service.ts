import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** ImageService is the intermediair between the UploadDirective and the ImageDirective */

@Injectable()
export class ImageService {

  image$ = new Subject<HTMLImageElement>();
  image: HTMLImageElement;

  loadImage(image: HTMLImageElement) {
    this.image$.next(image);
    this.image = image;
  }
}
