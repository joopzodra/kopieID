import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SaveToFileService {

  save$ = new Subject();

  save() {
    this.save$.next(true);
  }
}
