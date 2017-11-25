import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/** SaveToFileService is the intermediair between the MenuComponent and the SaveToFileDirective */

@Injectable()
export class SaveToFileService {

  save$ = new Subject();

  save() {
    this.save$.next(true);
  }
}
