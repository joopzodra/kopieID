import { Component, Input, Output, EventEmitter, ContentChild } from '@angular/core';

@Component({
  selector: 'jr-panel',
  templateUrl: './panel.component.html',
})
export class PanelComponent {

  open = true;
  @Input() title: string;
  @Output() panelToggled = new EventEmitter();
  @ContentChild(PanelComponent) panel: PanelComponent;

  togglePanel() { 
    this.open = !this.open;
    this.panelToggled.emit(this);
  }

}
