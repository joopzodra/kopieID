import { Directive, OnInit } from '@angular/core';

import { ImageService } from '../../services/image.service'

@Directive({
  selector: '[jrUpload]',
  exportAs: 'upload'
})
export class UploadDirective {

  constructor(private imageService: ImageService) { }

  onChange(event: Event) {
    const inputTarget: HTMLInputElement = <HTMLInputElement>event.target || <HTMLInputElement>event.srcElement; //browser compatibility
    const newFile = (inputTarget).files[0];
    if (!newFile) {
      return
    }
    if (newFile.type.match('image.*')) {
      this.loadImg(newFile);
    }
    else {
      alert('Je hebt geen afbeeldingsbestand of pdf gekozen. Kies opnieuw.')
    }
  }

  loadImg(file: File) {
    const reader = new FileReader();
    const img = new Image();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
    })
      .then((event: ProgressEvent) => {
        img.onload = () => this.imageService.loadImage(img);
        img.src = (<any>event).target.result;
        return img;
      })
      .catch(error => console.log(error));
  }
}
