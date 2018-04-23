import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ReservationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReservationProvider {

  public hasError:boolean = false;
  constructor(public http: Http) {
    console.log('Hello ReservationProvider Provider');
  }

  storeReservation(data){
    console.log(data);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return new Promise(resolve => {
      this.http.post('http://umshopin.com/umshopin_admin/api/reservation/store', JSON.stringify(data), {headers: headers})
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
