import { Component, Input } from '@angular/core';

@Component({
  selector: 'jr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Input('orientation') orientation: string;

}
