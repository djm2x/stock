import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleRepository } from 'src/app/backend/repository/article.repository';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UpdateComponent } from './update/update.component';
import { Article } from 'src/app/backend/entity/models';
import { DeleteService } from '../delete/delete.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  @Input() isInVente = false;
  @Output() addToPannier = new EventEmitter<any>();
  @ViewChild('call', { static: true }) call: ElementRef;
  startIndex = 0;
  pageSize = 20;
  myForm: FormGroup;
  filter = new FormControl('');
  constructor(private service: ArticleRepository, private fb: FormBuilder
    , public dialog: MatDialog, private mydialog: DeleteService) { }

  async ngOnInit() {
    // const items = Array.from({ length: 1000 }).map((_, i) => {
    //   const a = new Article();
    //   a.designation = `designation ${i}`;
    //   return a;
    // });
    // this.service.postList(items);
    this.createForm();
    this.search();
    this.downloadMore().subscribe(async isVisible => {
      console.log(isVisible);
      if (isVisible && !this.filter.value) {
        const newItems = await this.service.pagination(this.pageSize, this.startIndex).toPromise();
        this.startIndex += this.pageSize;
        // console.log(newItems)

        newItems.map(i => this.array.push(this.fb.group(i)));
        // this.items.emit(newItems);
      }
    });
  }

  trackById(index: number, o: any): number {
    return o.id;
  }

  openDialog(o: Article) {
    const dialogRef = this.dialog.open(UpdateComponent, {
      width: '750px',
      disableClose: true,
      data: { o }
    });

    return dialogRef.afterClosed();
  }

  add() {
    this.openDialog(new Article()).subscribe(result => {
      if (result) {
        this.service.post(result).subscribe(
          r => {
            this.array.insert(0, this.fb.group(result));
          }
        );
      }
    });
  }

  edit(index: number, o: Article) {
    this.openDialog(o).subscribe((result: Article) => {
      if (result) {
        this.service.put(result.id, result).subscribe(
          r => {
            this.array.at(index).patchValue(result);
          }
        );
      }
    });
  }

  async delete(index: number, o: Article) {
    const r = await this.mydialog.openDialog('Article').toPromise();
    if (r === 'ok') {
      this.service.delete(o.id).subscribe(() => this.array.removeAt(index));
    }
  }

  shope(o: Article) {
    this.addToPannier.next(o);
  }

  async refresh() {
    this.startIndex = 0;
    this.pageSize = 20;
    this.array.clear();
    this.filter.setValue('');
    const newItems = await this.service.pagination(this.pageSize, this.startIndex).toPromise();
    this.startIndex += this.pageSize;
    newItems.map(i => this.array.push(this.fb.group(i)));
  }

  createForm() {
    this.myForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  search() {
    this.filter.valueChanges.subscribe(async (value: string) => {
      if (value.length > 1) {
        this.startIndex = 0;
        this.pageSize = 20;
        const newItems = await this.service.pagination(this.pageSize, this.startIndex, value).toPromise();
        // this.startIndex += this.pageSize;
        console.log('filter', newItems.length);
        this.array.clear();
        newItems.map(i => this.array.push(this.fb.group(i)));
      } else {
        console.log('else filter');
        this.startIndex = 0;
        this.pageSize = 20;
      }

    });
  }

  get array() {
    return this.myForm.get('items') as FormArray;
  }

  downloadMore() {
    return new Observable(observer => {

      const inter = new IntersectionObserver((entries) => {

        entries.forEach((entry: any) => {
          if (entry.intersectionRatio > 0) {
            console.log('visi');
            observer.next(true);
          } else {
            observer.next(false);
          }
        });

      });
      inter.observe(this.call.nativeElement);
    });
  }
}
