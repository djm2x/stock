import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteComponent } from './delete.component';

@Injectable()
export class DeleteService {

  constructor(public dialog: MatDialog) { }

  openDialog(model: string) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '750px',
      disableClose: true,
      data: { model }
    });

    return dialogRef.afterClosed();
  }
}
