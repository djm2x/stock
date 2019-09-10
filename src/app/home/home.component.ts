import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessionService } from '../shared/session.service';
import { RouterOutlet, Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { TitleBarService } from '../shared/title-bar.service';
import { MatButton } from '@angular/material';
import { routerTransition } from '../shared/animations';
import { ReloadService } from './connection/reload.service';
const ipc = (window as any).require('electron').ipcRenderer;
const remote = (window as any).require('electron').remote;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition],
})
export class HomeComponent implements OnInit {
  @ViewChild('btndev', { static: true }) btndev: MatButton;
  keyDevTools = '';
  panelOpenState = false;
  mobileQuery: MediaQueryList;
  currentSection = 'section1';
  userImg = '../../assets/caisse.jpg';
  opened = true;
  idRole = -1;
  isConnected = false;
  // montantCaisse = this.s.notify;
  route = this.router.url;
  constructor(private session: SessionService, changeDetectorRef: ChangeDetectorRef
    , media: MediaMatcher, public router: Router
    , private titleBar: TitleBarService, private reload: ReloadService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addListener((e: MediaQueryListEvent) => changeDetectorRef.detectChanges());
  }

  ngOnInit() {
    // if (!this.session.isSignedIn) {
    //   this.router.navigate(['/auth']);
    // } else {
    //   this.isConnected = true;
    //   this.user = this.session.user;
    // }
    // this.session.notif.subscribe(
    //   r => {
    //     this.isConnected = r.is;
    //     this.user = r.user;
    //     console.log(r);
    //   }
    // );
    this.btndev._elementRef.nativeElement.addEventListener('keydown', event => {
      console.log(event.key);
      this.keyDevTools += event.key;
    });
    console.log(this.route);
    this.getRoute();

  }

  get patchRoute() { return this.route.split('/'); }

  getRoute() {
    this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        this.route = route.url;
        console.log(this.route);
      }
    });
  }

  devTools() {
    if (this.keyDevTools !== '1991') {
      this.keyDevTools = '';
    } else {
      remote.getCurrentWindow().reload();
      ipc.prependOnceListener('page', (event, r) => {
        console.log(r);
        this.keyDevTools = '';
      });
      ipc.send('main', 'plz click for me');
    }
  }

  do(action) {
    this.titleBar.post(action);
  }

  refresh() {
    this.router.navigate(['/home']);
    // this.reload.do();
  }


  disconnect() {
    this.session.doSignOut();
    this.router.navigate(['/auth']);
  }

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }
}
