import { Directive, OnInit } from '@angular/core';

import { ImageService } from '../../services/image.service'

@Directive({
  selector: '[jrUpload]',
  exportAs: 'upload'
})
export class UploadDirective {

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    const img = new Image();
    img.onload = () => this.imageService.loadImage(img);
  }

  onChange(event: Event) {
    let inputTarget: HTMLInputElement = <HTMLInputElement>event.target || <HTMLInputElement>event.srcElement; //browser compatibility
    let newFile = (inputTarget).files[0];
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
    let reader = new FileReader();
    let img = new Image();
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
