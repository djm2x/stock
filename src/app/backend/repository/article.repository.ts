import { Injectable } from '@angular/core';
import { Article } from '../entity/models';
import { SuperRepository } from './super.repository';
import { from, Observable } from 'rxjs';
const typeorm = (window as any).require('typeorm');
const Like = typeorm.Like;

@Injectable({
  providedIn: 'root'
})
export class ArticleRepository extends SuperRepository<Article> {

  constructor() {
    super(Article);
  }

  pagination(take, skip, filter = '') {

    const options = filter !== '' ? { where: { designation: Like(`%${filter}%`) }, order: { id: 'DESC' }, take, skip }
      : { order: { id: 'DESC' }, take, skip };

    return from(this.context.find(this.model, options)) as Observable<Article[]>;
  }
}
