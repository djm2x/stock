import { Injectable } from '@angular/core';
import { SuperRepository } from './super.repository';
import { Vente } from '../entity/models';
import { ArticleRepository } from './article.repository';

@Injectable({
  providedIn: 'root'
})
export class VenteRepository extends SuperRepository<Vente> {

    constructor(private serviceA: ArticleRepository) {
      super(Vente);
    }

    async deleteAndUpdateArticle(id) {
      const relation = { relations: ['venteArticles', 'venteArticles.article'] };

      const vente = await this.findById(id, relation).toPromise();
      const venteArticles = vente.venteArticles;
      // delete vente and venteArticle
      const r = await this.delete(id);
      // update article qte
      venteArticles.forEach(async va => {
        const a = va.article;
        a.stockFinal = a.stockFinal + va.qte;
        await this.serviceA.put(a.id, a).toPromise();
      });
      return r;
    }
}
