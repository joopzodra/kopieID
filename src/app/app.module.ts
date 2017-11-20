import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './menu/menu.component';
import { DrawDirective } from './canvas/draw/draw.directive'
import { UploadDirective } from './menu/upload/upload.directive'
import { ImageDirective } from './canvas/image/image.directive'

import { CanvasService } from './services/canvas.service'
import { ImageService } from './services/image.service';
import {DrawService } from './services/draw.service'
import { Globals } from './helpers/globals'

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    MenuComponent,
    DrawDirective,
    UploadDirective,
    ImageDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CanvasService,
    ImageService,
    DrawService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
