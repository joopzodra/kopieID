import { Component, OnInit } from '@angular/core';
import { Globals } from './helpers/globals'

@Component({
  selector: 'jr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Globals] // AppComponent needs its own Globals provider otherwise it conflicts with the root Globals provider used by CanvasService
})
export class AppComponent implements OnInit {

  private orientation: string;

  constructor(private globals: Globals) { }

  ngOnInit() {
    this.setOrientation();
    window.addEventListener('resize', () => this.globals.resizeThrottler(() => this.setOrientation()), false); // call this.resizeThrottler from within an arrow function to have CanvasService as this    
  }

  setOrientation() {
    const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.orientation = viewPortWidth <= viewPortHeight ? 'portrait' : 'landscape';
  }

}
