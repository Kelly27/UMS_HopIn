import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ReportsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportsProvider {

  public hasError:boolean = false;
  constructor(public http: Http) {
    console.log('Hello ReportsProvider Provider');
  }

  storeReport(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return new Promise(resolve => {
      this.http.post('http://umshopin.com/umshopin_admin/api/report/store', JSON.stringify(data), {headers: headers})
      .subscribe(data => {
        resolve(data);
        console.log('succes: ' , data);
      }, (err) => {
        resolve(true);
        this.hasError = true;
        console.log('failed: ' + err);
      });
    });
  }
}
