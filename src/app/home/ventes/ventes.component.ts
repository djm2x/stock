import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material';
import { Observable, merge } from 'rxjs';
import { VenteRepository } from 'src/app/backend/repository/vente.repository';
import { Vente, VenteArticle } from 'src/app/backend/entity/models';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteService } from '../delete/delete.service';

@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VentesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isLoadingResults = true;
  resultsLength = 0;
  isRateLimitReached = false;
  @Input() update: EventEmitter<any> = new EventEmitter();
  dataSource = [];
  columnDefs = [
    { columnDef: 'id', headName: 'id' },
    { columnDef: 'numero', headName: 'numero' },
    { columnDef: 'date', headName: 'date' },
    { columnDef: 'option', headName: 'Option' },
  ];

  i = 0;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
  ];

  filteredOptions: Observable<any>;

  // o = new Alimentation();
  expandedElement: Vente | null;
  isEdit = false;

  montantHT = 0;
  montantTTC = 0;
  constructor(private service: VenteRepository, public router: Router
    , private dialog: DeleteService) { }

  ngOnInit() {
    this.getPage(0, 5);
    merge(...[this.paginator.page, this.update]).subscribe(
      r => {
        r === true ? this.paginator.pageIndex = 0 : r = r;
        !this.paginator.pageSize ? this.paginator.pageSize = 5 : r = r;
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.isLoadingResults = true;
        this.getPage(startIndex, this.paginator.pageSize);
      }
    );
  }

  async expandedTable(o: Vente) {
    if (this.expandedElement && this.expandedElement.id === o.id) {
      this.expandedElement = null;
      return this.expandedElement;
    }
    const relation = { relations: ['venteArticles', 'venteArticles.article'] };
    this.expandedElement = await this.service.findById(o.id, relation).toPromise();
    this.calculeMontantHT(this.expandedElement);
    return this.expandedElement;
  }

  calculeMontantHT(o: Vente) {
    if (o.venteArticles.length !== 0) {
      this.montantHT = o.venteArticles.map(e => e.montant).reduce((a, c) => a + c);
      this.montantTTC = parseFloat((this.montantHT * (1 + o.tva / 100)).toFixed(2));
    }
  }

  getPage(startIndex, pageSize) {
    const options = { take: pageSize, skip: startIndex, order: { id: 'DESC' } }
    this.service.findAndCount(options).subscribe(
      (r: any[]) => {
        console.log(r);
        this.dataSource = r[0];
        this.resultsLength = r[1];
        this.isLoadingResults = false;
      }
    );
  }

  edit(o: any) {
    this.router.navigate(['/home/ventes', o.id]);
  }

  async delete(id) {
    const r = await this.dialog.openDialog('Vente').toPromise();
    if (r === 'ok') {
      this.service.deleteAndUpdateArticle(id).then(() => {
        this.update.next(true);
      });
    }
  }

}
