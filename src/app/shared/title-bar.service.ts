import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleBarService {

  public remote: any | undefined = void 0;
  constructor() {
    if ((window as any).require) {
      try {
        this.remote = (window as any).require('electron').remote;
      } catch (e) {
        console.warn('ipc err : ', e);
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  post(action) {
    const window = this.remote.getCurrentWindow();
    switch (action) {
      case 'close': window.close(); break;
      case 'max':
        if (!window.isMaximized()) {
          window.maximize();
        } else {
          window.unmaximize();
        }
        break;

      default: window.minimize(); break;
    }
  }
}
