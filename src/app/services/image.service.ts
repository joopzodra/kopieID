import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** ImageService is the intermediair between the UploadDirective and the ImageDirective */

@Injectable()
export class ImageService {

  image$ = new Subject<HTMLImageElement>();
  private image: HTMLImageElement;

  loadImage(image: HTMLImageElement) {
    this.image = image;
    this.image$.next(image);
  }
}
