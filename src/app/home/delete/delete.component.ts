import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  model = '';
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.model = this.data.model;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close('ok');
  }

}

