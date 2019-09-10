import { Injectable, PLATFORM_ID, Inject, EventEmitter } from '@angular/core';

const USER = 'USER';
const TOKEN = 'TOKEN';
const ROLE = 'ROLE';
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public user = new User();
  public token = '';
  public idRole = -1;
  public notif: EventEmitter<{ is: boolean, user: User, idRole?: number }> = new EventEmitter();
  constructor() {
    this.getSession();
  }
  // se connecter
  public doSignIn(user: User) {
    if (!user) {
      return;
    }
    this.user = user;
    localStorage.setItem(USER, JSON.stringify(this.user));
    this.notif.next({ is: true, user: this.user });
  }

  // se deconnecter
  public doSignOut(): void {
    this.user = new User();
    localStorage.removeItem(USER);
    this.notif.next({ is: false, user: this.user });
  }

  // this methode is for our auth guard
  get isSignedIn(): boolean {
    return !!localStorage.getItem(USER);
  }

  //
  public getSession(): void {
    try {
      this.user = JSON.parse(localStorage.getItem(USER));
    } catch (error) {
      this.user = new User();
      console.warn('error localstorage data');
    }
  }
}

class User {
  id: 0;
  name = '';
}

