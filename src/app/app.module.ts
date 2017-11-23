import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './menu/menu.component';
import { DrawDirective } from './canvas/draw/draw.directive'
import { UploadDirective } from './menu/upload/upload.directive'
import { ImageDirective } from './canvas/image/image.directive'
import { WatermarkDirective } from './canvas/watermark/watermark.directive'
import { SaveToFileDirective } from './canvas/save-to-file/save-to-file.directive';

import { CanvasService } from './services/canvas.service'
import { ImageService } from './services/image.service';
import { DrawService } from './services/draw.service'
import { WatermarkService } from './services/watermark.service'
import { SaveToFileService } from './services/save-to-file.service'
import { Globals } from './helpers/globals';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    MenuComponent,
    DrawDirective,
    UploadDirective,
    ImageDirective,
    WatermarkDirective,
    SaveToFileDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CanvasService,
    ImageService,
    DrawService,
    WatermarkService,
    SaveToFileService,
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
