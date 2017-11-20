import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MenuComponent } from './menu/menu.component';
import { PanelComponent } from './menu/panel/panel.component'
import { AccordionDirective } from './menu/accordion.directive'
import { RotateDirective } from './menu/rotate/rotate.directive'
import { DrawDirective } from './canvas/draw/draw.directive'
import { UploadDirective } from './menu/upload/upload.directive'
import { ImageDirective } from './canvas/image/image.directive'

import { CanvasService } from './services/canvas.service'
import { ImageService } from './services/image.service';
import { Globals } from './helpers/globals'

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    MenuComponent,
    PanelComponent,
    AccordionDirective,
    RotateDirective,
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
    Globals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
