import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { CanvasService } from '../services/canvas.service'
import { Globals } from '../helpers/globals'

/* CanvasComponent contains in its template all the canvasses. It has subsciptions to the CanvasService to adjust the canvasses and/or the divs around the canvasses to rotation and resizing. */

@Component({
  selector: 'jr-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges {

  showDraw = true;
  rotation = 'rotate(0deg)';
  canvasWidth = 0;
  canvasHeight = 0;
  maxCanvasWidth = 0;
  maxCanvasHeight = 0;
  transformation = '';
  translation = '';
  scale = '';
  @Input('orientation') orientation: string;

  constructor(private canvasService: CanvasService, private globals: Globals) { }

  ngOnInit() {
    this.canvasService.rotate$.subscribe(rotation => {
      const currentRotation = +this.rotation.match(/rotate\((-?\d+)deg\)/)[1];
      const newRotation = currentRotation + rotation;
      this.rotation = `rotate(${newRotation}deg)`;
      this.setTranformation(this.rotation);
    });
    this.canvasService.canvasSize$.subscribe(sizes => {
      this.canvasWidth = sizes.width;
      this.canvasHeight = sizes.height;
      this.setTranformation(this.rotation);
    });
    this.canvasService.maxSizeCanvas$.subscribe(maxSize => {
      this.maxCanvasWidth = maxSize.width;
      this.maxCanvasHeight = maxSize.height;
      this.setTranformation(this.rotation);
    });
  }

  ngOnChanges() {
    this.setTranformation(this.rotation);
  }

  setScale(rotation: number) {
    if (rotation % 180 !== 0) {
      const actualWidth = this.canvasHeight;
      const actualHeight = this.canvasWidth;
      const scaleX = this.maxCanvasWidth / actualWidth;
      const scaleY = this.maxCanvasHeight / actualHeight;
      let scale = Math.min(scaleX, scaleY);
      scale = Math.min(scale, 1); // to prevent enlarging of images that are smaller than the viewPort sizes
      this.scale = `scale(${scale})`;
    } else {
      this.scale = 'scale(1)';
    }
  }

  setTranslation(rotation: number) {
    let translateX = (this.maxCanvasWidth - this.canvasWidth) / 2;
    let translateY = (this.maxCanvasHeight - this.canvasHeight) / 2;
    if (rotation % 180 !== 0) {
      const scaleValue = +this.scale.match(/scale\((-?[\d\.]+)\)/)[1];
      const actualWidth = this.canvasHeight;
      const actualHeight = this.canvasWidth;
      this.translation = `translate(${translateX / scaleValue}px,${translateY / scaleValue}px)`
    } else {
      this.translation = `translate(${translateX}px,${translateY}px)`;
    }
  }

  setTranformation(rotation: string) {
    const rotationValue = +this.rotation.match(/rotate\((-?\d+)deg\)/)[1];
    this.setScale(rotationValue);
    this.setTranslation(rotationValue);
    this.transformation = this.scale + ' ' + this.translation;
  }
}
