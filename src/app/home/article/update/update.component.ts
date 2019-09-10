import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Article } from 'src/app/backend/entity/models';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  myForm: FormGroup;
  o: Article;
  stockInitial = 0;
  constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any
  , private fb: FormBuilder) { }

  ngOnInit() {
    this.o = this.data.o;
    this.o.qteE = 0;
    this.stockInitial = this.o.stockFinal;
    // console.log(this.data);
    this.createForm();
    this.qteE.valueChanges.subscribe(qteE => {
      console.log(qteE);
      this.stockFinal.setValue(this.stockInitial + qteE);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(o: Article): void {
    // o.stockFinal += o.qteE;
    this.dialogRef.close(o);
  }

  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      reference: [this.o.reference, Validators.required],
      designation: [this.o.designation, Validators.required],
      qteE: [this.o.qteE, [Validators.required, Validators.min(1)]],
      prixA: [this.o.prixA, [Validators.required, Validators.min(1)]],
      prixV: [this.o.prixV, [Validators.required, Validators.min(1)]],
      stockIntial: [this.o.stockIntial, [Validators.required, Validators.min(1)]],
      stockFinal: [this.o.stockFinal, [Validators.required, Validators.min(1)]],
    });
  }

  get qteE() { return this.myForm.get('qteE'); }
  get stockFinal() { return this.myForm.get('stockFinal'); }

  resetForm() {
    this.o = new Article();
    this.createForm();
  }

}
