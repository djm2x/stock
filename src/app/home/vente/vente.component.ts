import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Vente } from 'src/app/backend/entity/models';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { VenteRepository } from 'src/app/backend/repository/vente.repository';
import { VenteArticleRepository } from 'src/app/backend/repository/vente.article.repository';
import { Router, ActivatedRoute } from '@angular/router';
import { VenteArticle, Article } from 'src/app/backend/entity';

@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.scss'],
  animations: [trigger('EnterLeave', [
    state('flyIn', style({ transform: 'translateX(0)', opacity: 1 })),
    transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate('0.5s 300ms ease-in')
    ]),
    transition(':leave', [
      animate('0.3s ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
    ])
  ])]
})
export class VenteComponent implements OnInit {
  myForm: FormGroup;
  myFormArray: FormGroup;
  qteController = new FormControl(0);
  o = new Vente();
  // variable for edit purposes
  isEdit = false;
  // stockSt = { state: true, color: 'green' };
  venteArticlesToDelete: VenteArticle[] = [];
  oldQte = 0;
  montantHT = 0;
  montantTTC = 0;
  constructor(private fb: FormBuilder, private serviceV: VenteRepository
    , private serviceVA: VenteArticleRepository, public router: Router
    , private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.createFormArray();
    this.createForm();

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (+paramMap.get('id') !== -1) {
        this.getObjectForEdit(+paramMap.get('id'));
      }
    });
  }

  createFormArray = () => this.myFormArray = this.fb.group({ items: this.fb.array([]) });

  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      numero: [this.o.numero, Validators.required],
      date: [this.o.date],
      // montantHT: [this.o.montantHT, Validators.required],
      // montantTTC: [this.o.montantTTC, Validators.required],
      tva: [this.o.tva, Validators.required],
    });
  }
  // access to form s control
  get array() { return this.myFormArray.get('items') as FormArray; }
  get tva() { return this.myForm.get('tva'); }
  // get montantHT() { return this.myForm.get('montantHT'); }
  // get montantTTC() { return this.myForm.get('montantTTC'); }

  submit(v: Vente, vas: VenteArticle[]) {
    // remove the liet that i added earlier in addToArray function
    vas.forEach(async va => {
      delete (va as any).designation;
      delete (va as any).prix;
      delete (va as any).stockIntial;
      delete (va as any).stockFinal;
    });

    !this.isEdit ? this.post(v, vas) : this.put(v, vas);
  }

  async post(v: Vente, vas: VenteArticle[]) {
    // insert vente and get his id back
    const idVente = await this.serviceV.post(v).toPromise();
    // insert venteArticle with new idVente
    vas.forEach(async va => {
      va.venteId = idVente;
      this.serviceVA.postVA(va).then(id => this.router.navigate(['/home/ventes']));
    });
  }

  async put(v: Vente, vas: VenteArticle[]) {
    // update vente
    await this.serviceV.put(v.id, v).toPromise();
    // update venteArticles
    vas.forEach(async va => {
      va.venteId = v.id;
      await this.serviceVA.insertOrUpdate(va);
    });
    // delete some venteArticles if there what have to be deleted
    this.venteArticlesToDelete.forEach(async e => {
      await this.serviceVA.deleteVA(e);
    });

    this.router.navigate(['/home/ventes']);
  }

  // util functions

  tvaChange(tva) {
    console.log(tva);
    this.montantTTC = parseFloat((this.montantHT * (1 + tva / 100)).toFixed(2));
  }

  getObjectForEdit(idVente: number) {
    const relation = { relations: ['venteArticles', 'venteArticles.article'] };
    this.serviceV.findById(idVente, relation).subscribe(r => {
      this.o = r as any;
      this.isEdit = true;
      this.createForm();
      this.o.venteArticles.forEach(e => {
        this.addToArray(e.article, e);
      });
    });
  }

  calculeMontantHT() {
    if (this.array.controls.length !== 0) {
      this.montantHT = this.array.controls.map(e => e.value.montant).reduce((a, c) => a + c);
      this.montantTTC = parseFloat((this.montantHT * (1 + this.tva.value / 100)).toFixed(2));
    } else {
      this.montantHT = 0;
      this.montantTTC = 0;
    }
  }

  qteChange(newQte, va, index) {
    const prix = parseFloat(va.prix);
    const stockIntial = parseFloat(va.stockIntial);
    const qte = parseFloat(newQte !== '' ? newQte : 1 );
    const stockFinal = stockIntial - qte;

    if (stockFinal < 0) {
      this.array.at(index).get('qte').setValue(this.oldQte);
      this.array.at(index).get('stockFinal').setValue(stockIntial - this.oldQte);
      this.array.at(index).get('montant').setValue(this.oldQte * prix);
      // this.calculeMontantHT();
      return;
    }

    this.array.at(index).get('stockFinal').setValue(stockFinal);
    // this.setStockState(qte, stockFinal);
    // reinitialiser the qte because its can exced the sotck value
    this.array.at(index).get('qte').setValue(qte);
    this.array.at(index).get('montant').setValue(qte * prix);
    this.calculeMontantHT();
    this.oldQte = qte;
  }

  // setStockState(qte: number, stockIntial: number): number {
  //   if (stockIntial > qte) {
  //     this.stockSt.state = true;
  //     stockIntial - 5 > qte ? this.stockSt.color = 'green' : this.stockSt.color = 'orange';
  //     return qte;
  //   } else {
  //     this.stockSt = { state: false, color: 'red' };
  //     return stockIntial;
  //   }
  // }

  // article come from ArticleComponent or from edit mode
  // VenteArticle come only in edit mode, otherwise is null
  addToArray(a: Article, v: VenteArticle) {
    // if (a.stockIntial === 0) {
    //   console.log('stock 0');
    //   return;
    // }

    // check if the articel is already in array
    if (!this.array.controls.find(e => (e.value as VenteArticle).articleId === a.id)) {
      const va = new VenteArticle();
      // this is a wondeful lie
      (va as any).designation = a.designation;
      (va as any).prix = a.prixV;
      (va as any).stockFinal = a.stockFinal;

      va.articleId = a.id;
      va.venteId = this.o.id;
      !v ? va.qte = 0 : va.qte = v.qte;
      !v ? va.montant = va.qte * a.prixV : va.montant = v.montant;

      this.oldQte = this.oldQte !== 0 ? this.oldQte : va.qte;

      (va as any).stockIntial = a.stockFinal + va.qte;
      // this.setStockState(va.qte, a.stockIntial);

      this.array.push(this.fb.group(va));
      this.calculeMontantHT();
    }
  }

  deleteFromArray(index, a: VenteArticle) {
    this.array.removeAt(index);
    this.calculeMontantHT();
    if (this.isEdit) {
      this.venteArticlesToDelete.push(a);
    }
  }

  // notifyMontant() {
  //   this.calculeMontantHT();
  // }
}
