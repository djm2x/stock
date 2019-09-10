import { Injectable } from '@angular/core';
import { SuperRepository } from './super.repository';
import { VenteArticle } from '../entity';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleRepository } from './article.repository';

@Injectable({
  providedIn: 'root'
})
export class VenteArticleRepository extends SuperRepository<VenteArticle> {

  constructor(private serviceA: ArticleRepository) {
    super(VenteArticle);
  }


  async insertOrUpdate(vaNew: VenteArticle): Promise<VenteArticle | unknown> {
    const condition = { where: { articleId: vaNew.articleId, venteId: vaNew.venteId } };
    console.log('eeeeeeeeeeeeeeee', vaNew.articleId, vaNew.venteId);
    const vaOld = await this.get(condition).toPromise();
    console.log(vaOld);
    if (vaOld) {
      console.log('update va');
      const ob = this.context.createQueryBuilder().update(VenteArticle).set(vaNew)
        .where(`articleId = ${vaNew.articleId} and venteId = ${vaNew.venteId}`).execute();

      const article = await this.serviceA.findById(vaNew.articleId).toPromise();
      article.stockFinal = article.stockFinal + vaOld.qte - vaNew.qte;
      await this.serviceA.put(article.id, article).toPromise();

      return ob;
    } else {
      return await this.postVA(vaNew);
    }
  }

  async postVA(model: VenteArticle) {
    const article = await this.serviceA.findById(model.articleId).toPromise();
    article.stockFinal -= model.qte;
    const o = await this.context.insert(this.model, model);
    await this.serviceA.put(article.id, article).toPromise();
    return o;
  }

  async deleteVA(va: VenteArticle) {
    const article = await this.serviceA.get({ where: { id: va.articleId } }).toPromise();
    article.stockFinal += va.qte;
    console.log(va);
    // const o = this.deleteOpt({articleId: va.articleId, venteId: va.venteId});
    const o = this.context.createQueryBuilder().delete().from(VenteArticle)
    .where(`articleId = ${va.articleId} and venteId = ${va.venteId}`)
    .execute();
    this.serviceA.put(article.id, article);
    return o;
  }
}
