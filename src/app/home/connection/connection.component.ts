import { Component, OnInit } from '@angular/core';
import { dbConnection } from 'src/app/backend/db.connection';
import { Router } from '@angular/router';
import { ReloadService } from './reload.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {
  loader = false;
  constructor(public router: Router, private reload: ReloadService) { }

  ngOnInit() {
    this.loader = true;
    dbConnection.then(r => {
      setTimeout(() => {
        this.router.navigate(['/home/ventes'])
        this.loader = false;
      }, 100);
    })
      .catch(e => console.warn(e));

    // this.reload.refresh.subscribe(() => {
    //   this.router.navigate(['/home/connection'])
    // })
  }



}
