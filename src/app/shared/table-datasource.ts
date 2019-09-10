import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, tap, startWith, switchMap, catchError } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export class TableDataSource {
  isLoadingResults = true;
  resultsLength = 0;
  isRateLimitReached = false;

  constructor(private paginator: MatPaginator
    ,         private serviceData: any, public update: EventEmitter<any>) {

  }

  methode(): Observable<any> {
    const dataMutations = [
      this.paginator.page,
      this.update
    ];

    const obs = merge(...dataMutations)
      .pipe(
        startWith({}),
        switchMap((update) => {
          // if data is updated we init the page index to 0
          // need more operation here for sortable things
          if (update === true) {
            this.paginator.pageIndex = 0;
          }
          this.isLoadingResults = true;
          if (!this.paginator.pageSize) {
            this.paginator.pageSize = 15;
          }
          const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

          return this.serviceData.getPage(startIndex, this.paginator.pageSize);
        }),
        map((r: Reponce) => {
          // get length of data
          this.resultsLength = r.count;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          console.log(r);
          return r.list;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      );
    return obs;
  }

  // get data from api
  // loadInitialData(colToSort = '', orderBy = 'asc', startIndex = 0, pageSize = 10) {
  //   return this.serviceData.getAll(colToSort, orderBy, startIndex, pageSize);
  // }
  // this._todos.next(this._todos.getValue().push(newTodo));

}

interface Reponce {
  count: number;
  list: any[];
}


