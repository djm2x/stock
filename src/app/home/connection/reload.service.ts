import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
const remote = (window as any).require('electron').remote;
@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  refresh = new EventEmitter(true);
  constructor(public router: Router) { }

  do() {
    this.router.navigate(['/home']);
    // setTimeout(() => remote.getCurrentWindow().reload(), 1000);
  }
}
