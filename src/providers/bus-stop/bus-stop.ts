import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BusStopProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BusStopProvider {

    constructor(public http: Http) {
        console.log('Hello BusStopProvider Provider');
    }

    getBusStops(){
        return this.http.get('http://umshopin.com/umshopin_admin/api/bus_stop/getBusStop')
            .map(response => response.json());
    }

}
