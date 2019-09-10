import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  // templateUrl: 'loader.component.html',
  template: `
  <p *ngIf="loader.isLoading | async" style="margin-bottom: 0px;">
    <!-- <mat-progress-bar mode="indeterminate" color="warn" style="height: 3px;"></mat-progress-bar> -->
    <mat-spinner class="custom-spinner" color="accent" diameter="27"></mat-spinner>
  </p>`,
  // styles: [
  //   `
  //   .custom-spinner {
  //     mat-progress-spinner.mat-accent circle, mat-spinner.mat-accent circle {
  //       stroke: yellow;
  //     }
  //   }
  //   `
  // ]
})
export class LoaderComponent implements OnInit {

  constructor(public loader: LoaderService) { }

  ngOnInit() { }
}
