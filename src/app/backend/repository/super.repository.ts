import { Observable, from, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
const typeorm = (window as any).require('typeorm');
const getManager = typeorm.getManager;
// import { getManager, getRepository, getConnection } from 'typeorm';

export class SuperRepository<T> {
  protected context = getManager();

  constructor(public model) { }


  postList(models: any[]) {
    return from(this.context.createQueryBuilder().insert().into(this.model).values(models).execute());
  }

  post(model: any): Observable<T> {
    // return from(this.context.createQueryBuilder().insert().into(this.model).values(model).execute())
    // .pipe(map((e: any) => e.raw));
    return from(this.context.insert(this.model, model)).pipe(map((e: any) => e.raw));
  }

  findAndCount(options) {
    return from(this.context.findAndCount(this.model, options)) as Observable<T[] | any[]>;
  }

  find(options) {
    return from(this.context.find(this.model, options)) as Observable<T[]>;
  }

  query(req) {
    return from(this.context.query(req)) as Observable<T[] | T | any>;
  }

  getAll() {
    return from(this.context.find(this.model, { order: { id: 'DESC' } })) as Observable<T[] | any[]>;
  }

  get(options?) {
    return from(this.context.findOne(this.model, options)) as Observable<T>;
  }

  findById(id, options?) {
    return from(this.context.findOne(this.model, id, options)) as Observable<T>;
  }

  put(id, model) {
    // const old = await this.context.findOneOrFail(this.model, id);
    return from(this.context.update(this.model, id, model)) as Observable<T | any>;
  }

  delete(id) {
    return from(this.context.delete(this.model, id)) as Observable<T | any>;
  }

  deleteOpt(options) {
    return from(this.context.delete(this.model, { where: options })) as Observable<T | any>;
  }
}
