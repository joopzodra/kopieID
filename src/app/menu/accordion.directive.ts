import { PanelComponent } from './panel/panel.component';
import { ContentChildren, QueryList, Input, Directive, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[jrAccordion]',
  exportAs: 'accordion'
})
export class AccordionDirective implements AfterContentInit {
  @Input() onlyOneOpen: boolean;

  @ContentChildren(PanelComponent) panels: QueryList<PanelComponent>;

  ngAfterContentInit() {
    this.panels.forEach((panel) => {
      panel.open = false;
      panel.panelToggled.subscribe((tmpPanel: PanelComponent) => {
        if (tmpPanel.open && this.onlyOneOpen) {
          this.closeOthers(tmpPanel);
        }
      });
    });
  }

  closeOthers(opened: PanelComponent) {
    for (const panel of this.panels.toArray()) {
      if (opened != panel && panel.open) {
        panel.open = false;
      }
    }
  }

  closeAll() {
    for (const panel of this.panels.toArray()) {
      panel.open = false;
    }
  }
}
